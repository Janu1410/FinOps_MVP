import { transporter } from "../config/nodemailer.js";

export const sendVerificationEmail = async (email, full_name, otp) => {
  try {
    await transporter.sendMail({
      from: `"KandCo" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h3>Hello ${full_name}</h3>
        <p>Your verification code is:</p>
        <h2>${otp}</h2>
        <p>This code expires in 1 hour.</p>
      `
    });

    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, message: "Failed to send email" };
  }
};



export const sendInquiryAcknowledgementEmail = async (
  email,
  name,
  preferred_datetime,
  timezone
) => {
  try {
    const meetingDate = new Date(preferred_datetime);

    const formattedDateTime = meetingDate.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    });

    await transporter.sendMail({
      from: `"KandCo" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "We’ve Received Your Inquiry",
      html: `
        <h3>Hello ${name},</h3>

        <p>Thank you for contacting <strong>KandCo</strong>.</p>

        <p>
          We’ve successfully received your inquiry and our team is reviewing it.
        </p>

        <p><strong>Preferred Meeting Time:</strong><br/>
        ${formattedDateTime} (${timezone})
        </p>

        <p>
          If your request is accepted, you’ll receive a Google Meet link for further discussion.
        </p>

        <p>We usually respond within <strong>24 hours</strong>.</p>

        <p>Best regards,<br/>
        <strong>KandCo Team</strong></p>
      `
    });

    return { success: true };
  } catch (error) {
    console.error("Client email error:", error);
    return { success: false, message: "Failed to send acknowledgement email" };
  }
};


export const sendInquiryEmailToCompany = async (
  name,
  email,
  message,
  preferred_datetime,
  timezone,
  acceptLink,
  rejectLink
) => {
  try {
    const meetingDate = new Date(preferred_datetime);

    const formattedDateTime = meetingDate.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    });

    await transporter.sendMail({
      from: `"KandCo" <${process.env.SMTP_USER}>`,
      to: process.env.COMPANY_EMAIL,
      subject: "New Inquiry Received – Action Required",
      html: `
        <h3>New Inquiry Received</h3>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Message:</strong></p>
        <p>${message}</p>

        <p><strong>Preferred Meeting Time:</strong><br/>
          ${formattedDateTime} (${timezone})
        </p>

        <hr />

        <p><strong>Take Action:</strong></p>

        <a href="${acceptLink}" 
           style="padding:10px 15px; background:#28a745; color:#fff; text-decoration:none; border-radius:5px;">
          ✅ Accept Inquiry
        </a>

        <br/><br/>

        <a href="${rejectLink}" 
           style="padding:10px 15px; background:#dc3545; color:#fff; text-decoration:none; border-radius:5px;">
          ❌ Reject Inquiry
        </a>

        <p style="margin-top:20px;">
          If accepted, a Google Meet link will be automatically created
          for the above time and sent to the client.
        </p>
      `
    });

    return { success: true };
  } catch (error) {
    console.error("Company email error:", error);
    return { success: false, message: "Failed to send company email" };
  }
};

export const sendMeetingConfirmationEmail = async (
  email,
  name,
  preferred_datetime,
  timezone,
  meetLink
) => {
  try {
    const meetingDate = new Date(preferred_datetime);
    const formattedDateTime = meetingDate.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    });

    await transporter.sendMail({
      from: `"KandCo" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Meeting is Scheduled",
      html: `
        <h3>Hello ${name},</h3>

        <p>Good news! Your inquiry has been <strong>accepted</strong> by our team.</p>

        <p><strong>Meeting Details:</strong></p>
        <ul>
          <li><strong>Date & Time:</strong> ${formattedDateTime} (${timezone})</li>
          <li><strong>Google Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></li>
        </ul>

        <p>Please join the meeting at the scheduled time.</p>

        <p>Best regards,<br/>
        <strong>KandCo Team</strong></p>
      `
    });

    return { success: true };
  } catch (error) {
    console.error("Meeting confirmation email error:", error);
    return { success: false, message: "Failed to send meeting confirmation email" };
  }
};


export const sendInquiryRejectionEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"KandCo" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Inquiry Status",
      html: `
        <h3>Hello ${name},</h3>

        <p>We appreciate you contacting <strong>KandCo</strong>.</p>

        <p>After review, we regret to inform you that your inquiry has been <strong>rejected</strong>.</p>

        <p>Thank you for your interest, and we hope to hear from you in the future.</p>

        <p>Best regards,<br/>
        <strong>KandCo Team</strong></p>
      `
    });

    return { success: true };
  } catch (error) {
    console.error("Inquiry rejection email error:", error);
    return { success: false, message: "Failed to send rejection email" };
  }
};

