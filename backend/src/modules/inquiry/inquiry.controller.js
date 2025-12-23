import {
  sendInquiryAcknowledgementEmail,
  sendInquiryEmailToCompany,
  sendMeetingConfirmationEmail,
  sendInquiryRejectionEmail,
} from "../../utils/sendEmail.js";
import { generateJWT, verifyJWT } from "../../utils/jwt.js";
import { Inquiry } from "../../models/index.js";
import { createInquiry } from "./inquiry.service.js";
import { scheduleEvent  , getFreeSlots} from "../../utils/calender.js";



export const submitInquiry = async (req, res) => {
  try {
    const { name, email, message, preferred_datetime, timezone } = req.body;

    if (!preferred_datetime) {
      return res.status(400).json({
        message: "Preferred date & time is required",
      });
    }

    // 1️⃣ Create inquiry
    const newInquiry = await createInquiry({
      name,
      email,
      message,
      preferred_datetime,
      timezone,
    });

    // 2️⃣ Generate ONE-TIME action token
    const actionToken = generateJWT({ inquiryId: newInquiry.id });

    // 3️⃣ Store token in DB
    await newInquiry.update({
      action_token: actionToken,
    });

    // 4️⃣ Create secure links
    const acceptLink = `${process.env.BACKEND_URL}/api/inquiry/accept/${newInquiry.id}?token=${actionToken}`;
    const rejectLink = `${process.env.BACKEND_URL}/api/inquiry/reject/${newInquiry.id}?token=${actionToken}`;

    // 5️⃣ Send email to company
    await sendInquiryEmailToCompany(
      name,
      email,
      message,
      preferred_datetime,
      timezone,
      acceptLink,
      rejectLink
    );

    // 6️⃣ Send acknowledgement to client
    await sendInquiryAcknowledgementEmail(
      email,
      name,
      preferred_datetime,
      timezone
    );

    return res.status(201).json({
      message: "Inquiry submitted successfully",
      data: newInquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Invalid request");
    }

    // 1️⃣ Find inquiry
    const inquiry = await Inquiry.findByPk(id);

    if (!inquiry) {
      return res.status(404).send("Inquiry not found");
    }

    // 2️⃣ Check already processed
    if (inquiry.status !== "PENDING") {
      return res.send("This inquiry has already been processed.");
    }

    // 3️⃣ Validate token
    if (token !== inquiry.action_token) {
      return res.status(403).send("Invalid or expired link.");
    }

    // 4️⃣ (Optional) Verify JWT expiry
    verifyJWT(token);

    // 5️⃣ Create Google Meet (plug here)
    
    const event = await scheduleEvent(
      `Meeting with ${inquiry.name}`,
      inquiry.message, 
        inquiry.preferred_datetime,
        inquiry.timezone
    );

    if (!event.success) {
      return res.status(500).send("Failed to schedule meeting: " + event.message);
    }
    const { meetingLink } = event;

    // 6️⃣ Update inquiry
    await inquiry.update({
      status: "ACCEPTED",
      meet_link: meetingLink,
      action_token: null, // invalidate token
    });

    // 7️⃣ Notify client
    await sendMeetingConfirmationEmail(
      inquiry.email,
      inquiry.name,
      inquiry.preferred_datetime,
      inquiry.timezone,
      meetingLink
    );

    // 8️⃣ Response (simple HTML)

    return res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Inquiry Status</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .card {
        background: #fff;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-align: center;
      }
      .success {
        color: #28a745;
        font-size: 3rem;
      }
      .failure {
        color: #dc3545;
        font-size: 3rem;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="success">✅</div>
      <h1>Inquiry Accepted</h1>
      <p>The meeting has been scheduled and the client has been notified.</p>
    </div>
  </body>
  </html>
`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

export const rejectInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Invalid request");
    }

    // 1️⃣ Find inquiry
    const inquiry = await Inquiry.findByPk(id);

    if (!inquiry) {
      return res.status(404).send("Inquiry not found");
    }

    // 2️⃣ Already processed
    if (inquiry.status !== "PENDING") {
      return res.send("This inquiry has already been processed.");
    }

    // 3️⃣ Validate token
    if (token !== inquiry.action_token) {
      return res.status(403).send("Invalid or expired link.");
    }

    // 4️⃣ Verify JWT expiry
    verifyJWT(token);

    // 5️⃣ Update inquiry
    await inquiry.update({
      status: "REJECTED",
      action_token: null, // invalidate token
    });

    // 6️⃣ Notify client
    await sendInquiryRejectionEmail(inquiry.email, inquiry.name);

    // 7️⃣ Response
    return res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Inquiry Status</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .card {
        background: #fff;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-align: center;
      }
      .failure {
        color: #dc3545;
        font-size: 3rem;
        margin-bottom: 20px;
      }
      h1 {
        margin-bottom: 15px;
      }
      p {
        font-size: 1.1rem;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="failure">❌</div>
      <h1>Inquiry Rejected</h1>
      <p>You have rejected the client's inquiry.</p>
    </div>
  </body>
  </html>
`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};



/**
 * GET /api/slots/by-date
 * Query:
 *  - date (YYYY-MM-DD) [required]
 *  - slotMinutes (default 60)
 */
export async function getSlotsByDate(req, res) {
  try {
    const { date } = req.query;
    const slotMinutes = Number(req.query.slotMinutes) || 60;
    const timezone = "Asia/Kolkata";

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date query param is required (YYYY-MM-DD)",
      });
    }

    // 1️⃣ Create day range (10:00–18:00)
    const startOfDay = new Date(`${date}T10:00:00`);
    const endOfDay = new Date(`${date}T18:00:00`);

    // 2️⃣ If selected date is today → start from now
    const now = new Date();
    if (startOfDay.toDateString() === now.toDateString()) {
      const roundedNow = new Date(now);
      roundedNow.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0);

      if (roundedNow > startOfDay) {
        startOfDay.setTime(roundedNow.getTime());
      }
    }

    // If day already passed
    if (startOfDay >= endOfDay) {
      return res.status(200).json({
        success: true,
        date,
        timezone,
        slots: [],
      });
    }

    // 3️⃣ Get free slots
    const freeSlots = await getFreeSlots(
      startOfDay.toISOString(),
      endOfDay.toISOString(),
      timezone,
      slotMinutes,
      10,
      18
    );

    // 4️⃣ Format response
    const slots = freeSlots.map((slot) => ({
      start: new Date(slot.start).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone,
      }),
      end: new Date(slot.end).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone,
      }),
    }));

    return res.status(200).json({
      success: true,
      date,
      timezone,
      slots,
    });
  } catch (error) {
    console.error("Get slots by date error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
