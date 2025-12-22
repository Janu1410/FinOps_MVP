import fs from "fs";
import csv from "csv-parser";
import { processRecords } from "../../utils/processRecords.js";

export const processCSV = (req, res) => {
  console.log("Received file upload request...");

  if (!req.file) {
    console.error("No file received");
    return res.status(400).json({ error: "No file uploaded." });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(
      csv({
        // FIX: Strip BOM (Byte Order Mark) which often breaks the first column name
        mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, ""),
      })
    )
    .on("data", (data) => results.push(data))
    .on("end", () => {
      try {
        console.log(`Parsed ${results.length} rows. Processing analytics...`);

        if (results.length === 0) {
          throw new Error("CSV file appeared empty or could not be parsed.");
        }

        // Process data
        const analytics = processRecords(results);

        console.log("Analytics generated successfully.");

        // Return JSON
        res.json({
          success: true,
          data: analytics,
          rawRecords: analytics.rawRecords,
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
