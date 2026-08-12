import nodemailer from "nodemailer";

type Lead = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  business: string;
  url: string;
  message: string;
};

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char);
}

function shell(content: string) {
  return `<div style="margin:0;background:#fffaf1;padding:32px 16px;font-family:Arial,sans-serif;color:#3d2424"><div style="max-width:620px;margin:auto;background:#fff;border:1px solid #ead8c8;border-radius:20px;overflow:hidden"><div style="background:#3d2424;padding:22px;text-align:center;color:#fff;font-weight:800">Digital <span style="color:#e98b50">Niraj</span></div><div style="padding:32px">${content}</div><div style="padding:18px 32px;background:#f8ead5;color:#755e58;font-size:12px;text-align:center">AI Marketing Consultation • Digital Niraj</div></div></div>`;
}

export async function sendLeadEmails(lead: Lead) {
  const gmailUser = required("GMAIL_USER");
  const ownerEmail = required("OWNER_NOTIFICATION_EMAIL");
  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: gmailUser, pass: required("GMAIL_APP_PASSWORD").replace(/\s/g, "") } });
  const safe = Object.fromEntries(Object.entries(lead).map(([key, value]) => [key, escapeHtml(value)])) as Lead;

  const ownerMail = transporter.sendMail({
    from: `Digital Niraj <${gmailUser}>`,
    to: ownerEmail,
    replyTo: lead.email,
    subject: `New consultation request — ${lead.business}`,
    html: shell(`<p style="margin:0;color:#bc4f4f;font-weight:800;font-size:13px">NEW CONSULTATION REQUEST</p><h1 style="font-size:26px;margin:10px 0 20px">You received a new lead</h1><p><strong>Lead ID:</strong> ${safe.id}</p><p><strong>Name:</strong> ${safe.name}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>WhatsApp:</strong> ${safe.whatsapp}</p><p><strong>Business:</strong> ${safe.business}</p><p><strong>Website / Facebook:</strong> ${safe.url || "Not provided"}</p><p><strong>Marketing challenge:</strong><br>${safe.message || "Not provided"}</p>`),
  });
  const customerMail = transporter.sendMail({
    from: `Digital Niraj <${gmailUser}>`,
    to: lead.email,
    replyTo: ownerEmail,
    subject: "Your AI marketing consultation request is confirmed",
    html: shell(`<p style="margin:0;color:#bc4f4f;font-weight:800;font-size:13px">REQUEST CONFIRMED</p><h1 style="font-size:28px;margin:10px 0 20px">Thank you, ${safe.name}!</h1><p style="line-height:1.7">Your request for a <strong>Free AI Marketing Consultation</strong> has been received.</p><p style="line-height:1.7">I&apos;ll review your business and current marketing situation so we can identify practical opportunities during your consultation.</p><div style="margin:24px 0;padding:18px;border-radius:14px;background:#f8ead5"><strong>Your reference:</strong> ${safe.id}</div><p style="line-height:1.7">If you have a question, reply to this email or message me on WhatsApp.</p><a href="https://t.ly/PicEi" style="display:inline-block;margin-top:8px;padding:14px 22px;border-radius:999px;background:#bc4f4f;color:#fff;text-decoration:none;font-weight:800">Message Me on WhatsApp</a>`),
  });

  const [owner, customer] = await Promise.allSettled([ownerMail, customerMail]);
  return {
    owner: owner.status === "fulfilled" ? "Sent" : "Failed",
    customer: customer.status === "fulfilled" ? "Sent" : "Failed",
  };
}
