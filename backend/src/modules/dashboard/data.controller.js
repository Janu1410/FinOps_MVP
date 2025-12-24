import fs from "fs";
import csv from "csv-parser";
import { detectColumns, normalizeRow } from "../../utils/columnMapper.js";
import { processRecords } from "../../utils/processRecords.js";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

export const processCSV = (req, res) => {
  if (!req.file) {
    console.error("No file received");
    return res.status(400).json({ error: "No file uploaded." });
  }

  // For large files, use streaming processing
  let firstRow = null;
  let rowCount = 0;
  let columnMapping = null;
  const sampleRecords = []; // Store sample for frontend preview
  const MAX_SAMPLE_SIZE = 5000; // Send first 5000 rows for frontend preview
  
  // Initialize aggregators
  let totalSpend = 0;
  let leakageCost = 0;
  const timelineMap = {};
  const serviceMap = {};
  const regionMap = {};
  const leakageItems = [];

  fs.createReadStream(req.file.path)
    .pipe(
      csv({
        // FIX: Strip BOM (Byte Order Mark) which often breaks the first column name
        mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, ""),
      })
    )
    .on("data", (data) => {
      rowCount++;
      
      // Detect columns from first row
      if (rowCount === 1) {
        firstRow = data;
        columnMapping = detectColumns(data);
      }
      
      // Process row immediately (streaming)
      try {
        const normalizedRow = normalizeRow(data, columnMapping);
        
        // Parse cost
        let rawCost = normalizedRow.BilledCost || normalizedRow.Cost || '0';
        if (typeof rawCost === 'string') {
          rawCost = rawCost.replace(/[$,]/g, '');
        }
        const cost = parseFloat(rawCost) || 0;

        // Aggregate Total Spend
        totalSpend += cost;

        // Leakage Logic
        const discountStatus = normalizedRow.CommitmentDiscountStatus || '';
        const isOptimized = discountStatus.toLowerCase().includes('used') || 
                            discountStatus.toLowerCase().includes('covered') ||
                            discountStatus.toLowerCase().includes('reserved') ||
                            discountStatus.toLowerCase().includes('savings');
        
        if (!isOptimized && cost > 0.0001) { 
          leakageCost += cost;
          
          if (leakageItems.length < 100) {
             leakageItems.push({
               name: normalizedRow.ResourceName || normalizedRow.ResourceId || normalizedRow.ServiceName || 'Unknown Resource',
               service: normalizedRow.ServiceName || 'Unknown Service',
               region: normalizedRow.RegionName || 'Global',
               cost: cost,
               CommitmentDiscountStatus: 'Uncovered'
             });
          }
        }

        // Timeline
        const dateStr = normalizedRow.BillingPeriodStart || normalizedRow.UsageStartDate || normalizedRow.Date;
        if (dateStr) {
          const date = String(dateStr).split(' ')[0].split('T')[0]; 
          if (date && date.match(/^\d{4}-\d{2}-\d{2}/)) {
            timelineMap[date] = (timelineMap[date] || 0) + cost;
          }
        }

        // Service Breakdown
        const service = normalizedRow.ServiceName || normalizedRow.Product || 'Other';
        serviceMap[service] = (serviceMap[service] || 0) + cost;
        
        // Region Breakdown
        const region = normalizedRow.RegionName || normalizedRow.Region || 'Global';
        regionMap[region] = (regionMap[region] || 0) + cost;

        // Store sample records for frontend (first N rows)
        if (sampleRecords.length < MAX_SAMPLE_SIZE) {
          sampleRecords.push(normalizedRow);
        }
      } catch (err) {
        console.warn(`Skipping row ${rowCount} due to error:`, err.message);
      }
    })
    .on("end", () => {
      try {
        if (rowCount === 0) {
          throw new Error("CSV file appeared empty or could not be parsed.");
        }

        // Format aggregated data
        const timelineGraph = Object.keys(timelineMap).sort().map(date => ({
          date,
          cost: parseFloat(timelineMap[date].toFixed(2))
        }));

        const productEarnings = Object.entries(serviceMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);

        const efficiencyScore = totalSpend > 0 
          ? Math.round(((totalSpend - leakageCost) / totalSpend) * 100) 
          : 100;

        // Return JSON with column mapping info
        res.json({
          success: true,
          data: {
            totalSpend: totalSpend.toFixed(2),
            leakageCost: leakageCost.toFixed(2),
            efficiencyScore,
            timelineGraph,
            productEarnings,
            leakageItems,
            recordCount: rowCount
          },
          rawRecords: sampleRecords, // Sample records for frontend preview
          columnMapping: columnMapping, // Include detected column mapping
          totalRows: rowCount, // Total row count for reference
          sampleSize: sampleRecords.length // How many rows sent
        });

        // Cleanup
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error("SERVER ERROR Processing Data:", error);
        res.status(500).json({
          error: "Failed to process CSV data",
          details: error.message,
        });

        // Attempt cleanup if file exists
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      }
    })
    .on("error", (err) => {
      console.error("CSV READ ERROR:", err);
      res.status(500).json({ error: "Failed to read CSV file" });
    });
};

export const downLoadReport = (req, res) => {
  const {
    period,
    totalSpend,
    topServices,
    topRegions,
    optimizationData,
    topServicePercent,
    taggedPercent,
    prodPercent,
  } = req.body;

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logoPath = path.join(__dirname, "../assets/kco_logo.png");

  // Force browser download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Cloud_Cost_Optimization_Report.pdf"'
  );

  doc.pipe(res);

  /* ================= HEADER ================= */
  doc.image(logoPath, 50, 30, { width: 80 });

  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("KandCo", { align: "center" });

  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("FinOps Executive Report", { align: "center" });

  doc.moveTo(50, 120).lineTo(550, 120).stroke();

  doc.moveDown(2);
  /* ================= BILLING OVERVIEW ================= */
  doc.fontSize(14).text("Billing Overview", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).text(`Billing Period: ${period}`);
  doc.text(`Total Cloud Spend: $${Number(totalSpend).toFixed(2)} USD`);
  doc.moveDown(2);

  doc
    .fontSize(11)
    .text(
      "This report provides a summarized view of cloud spend, regional distribution, service-level costs, and optimization insights."
    );
  doc.moveDown(2);

  /* ================= TOP SERVICES ================= */
  doc.fontSize(14).text("Top Cost-Contributing Services", { underline: true });
  doc.moveDown(0.5);

  topServices.forEach((service, index) => {
    doc
      .fontSize(11)
      .text(`${index + 1}. ${service.name} — $${service.cost.toFixed(2)}`);
  });

  doc.moveDown();
  doc
    .fontSize(11)
    .text(
      `The top service contributes approximately ${topServicePercent.toFixed(
        1
      )}% of the total cloud spend.`
    );
  doc.moveDown(2);

  /* ================= REGIONS ================= */
  doc.fontSize(14).text("Regional Spend Distribution", { underline: true });
  doc.moveDown(0.5);

  topRegions.forEach((region, index) => {
    doc
      .fontSize(11)
      .text(`${index + 1}. ${region.name} — $${region.cost.toFixed(2)}`);
  });

  doc.moveDown(2);

  /* ================= OPTIMIZATION ================= */
  doc.fontSize(14).text("Cost Optimization Insights", { underline: true });
  doc.moveDown(0.5);

  doc
    .fontSize(11)
    .text(
      `Total Potential Savings: $${optimizationData.totalPotentialSavings}`
    );
  doc.text(
    `High-Confidence Savings: ${optimizationData.highConfidencePercent}%`
  );
  doc.text(`Savings Under Review: ${optimizationData.underReviewPercent}%`);

  doc.moveDown();
  doc.text("Identified Opportunities:");
  doc.text(`• Idle Resources: ${optimizationData.idleResources}`);
  doc.text(`• Right-Sizing Candidates: ${optimizationData.rightSizing}`);
  doc.text(`• Commitment Opportunities: ${optimizationData.commitments}`);
  doc.moveDown(2);

  /* ================= GOVERNANCE ================= */
  doc.fontSize(14).text("Governance & Cost Allocation", { underline: true });
  doc.moveDown(0.5);

  doc
    .fontSize(11)
    .text(`Tagged Spend Coverage: ${taggedPercent.toFixed(1)}% of total spend`);
  doc.text(
    `Production Environment Spend: ${prodPercent.toFixed(1)}% of total spend`
  );
  doc.moveDown(2);

  /* ================= KEY TAKEAWAYS ================= */
  doc.fontSize(14).text("Key Takeaways", { underline: true });
  doc.moveDown(0.5);

  doc
    .fontSize(11)
    .text("• Cloud spending is well distributed across services.");
  doc.text("• Clear optimization opportunities with measurable savings.");
  doc.text("• Improved tagging will enhance cost visibility.");
  doc.text("• Cost concentration should be continuously monitored.");
  doc.moveDown(2);

  /* ================= COMING SOON ================= */
  doc.fontSize(14).text("More Insights Coming Soon", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(11).text("• Forecasted monthly spend trends");
  doc.text("• Budget vs actual variance analysis");
  doc.text("• Automated anomaly detection");
  doc.text("• Service efficiency scoring");
  doc.text("• Intelligent optimization recommendations");

  /* ================= FOOTER ================= */
  doc.moveDown(3);
  doc.fontSize(9).text("Confidential – Generated for internal analysis only", {
    align: "center",
  });

  doc.end();
};
