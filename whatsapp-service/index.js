const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();

// Increase JSON body limit to support PDF Base64 report payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Load configurations from environment variables
const OWNER_PHONE_ENV = process.env.LAB_OWNER_WHATSAPP_NUMBER || '919513951931';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', (qr) => {
  console.log('--- SCAN THIS QR CODE WITH YOUR WHATSAPP APP ---');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp Service is ready and authenticated!');
});

client.initialize().catch(err => {
  console.error('WhatsApp client initialization failed:', err);
});

// Helper function to normalize and format phone number for whatsapp-web.js
function formatPhone(phone) {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return `${cleaned}@c.us`;
}

// 1. Confirm Booking Endpoint
app.post('/api/whatsapp/send-booking', async (req, res) => {
  const { bookingId, patientPhone, patientEmail, ownerEmail, packageName, schedule, address, patientCount, ownerPhone } = req.body;

  console.log(`[LOG] Processing WhatsApp booking notification for ID: #${bookingId}`);

  if (!patientPhone) {
    return res.status(400).json({ success: false, error: 'Patient phone is required' });
  }

  const patientJid = formatPhone(patientPhone);
  const resolvedOwnerPhone = ownerPhone || OWNER_PHONE_ENV;
  const ownerJid = formatPhone(resolvedOwnerPhone);

  const messageText = 
`🏥 *Thyronex Care Diagnostics* - Booking Confirmed!
-----------------------------------
🧪 *Booking ID:* #${bookingId}
🧪 *Package:* ${packageName}
📅 *Schedule:* ${schedule}
👥 *Patients:* ${patientCount}
📍 *Address:* ${address}
📞 *Contact:* ${patientPhone}
-----------------------------------
Thank you for choosing Thyronex Care!`;

  try {
    // Send message to Patient
    await client.sendMessage(patientJid, messageText);
    console.log(`[LOG] Successfully sent booking confirmation to Patient JID: ${patientJid}`);

    // Send notification alert to Lab Owner
    const ownerText = `🚨 *NEW LAB TEST BOOKED*\n\n${messageText}\n📧 *Owner Email:* ${ownerEmail || 'N/A'}`;
    await client.sendMessage(ownerJid, ownerText);
    console.log(`[LOG] Successfully sent booking notification to Lab Owner JID: ${ownerJid}`);

    return res.status(200).json({ success: true, message: 'WhatsApp sent successfully' });
  } catch (err) {
    console.error(`[ERROR] Failed to send WhatsApp notification for booking #${bookingId}:`, err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Complete Test Endpoint (Supports sending PDF Softcopy Attachment)
app.post('/api/whatsapp/send-completion', async (req, res) => {
  const { bookingId, patientPhone, packageName, schedule, pdfBase64 } = req.body;

  console.log(`[LOG] Processing WhatsApp completion notification for ID: #${bookingId}`);

  if (!patientPhone) {
    return res.status(400).json({ success: false, error: 'Patient phone is required' });
  }

  const patientJid = formatPhone(patientPhone);

  const messageText = 
`🏥 *Thyronex Care Diagnostics* - Test Report Ready!
-----------------------------------
🧪 *Booking ID:* #${bookingId}
🧪 *Package:* ${packageName}
📅 *Completed Schedule:* ${schedule}
-----------------------------------
Dear Customer, your diagnostic test report has been verified by our clinical pathologists. 
Please find your attached *Official Diagnostic Softcopy Report (PDF)* above.

You can also view and re-download your reports anytime under 'My Bookings' on our portal.

Thank you for choosing Thyronex Care!`;

  try {
    // If PDF Base64 is provided, attach it as a PDF Document
    if (pdfBase64 && pdfBase64.includes('base64,')) {
      const cleanBase64 = pdfBase64.split('base64,')[1];
      const media = new MessageMedia('application/pdf', cleanBase64, `Thyronex_Report_Booking_${bookingId}.pdf`);
      await client.sendMessage(patientJid, media, { caption: messageText });
      console.log(`[LOG] Successfully sent completion WhatsApp with PDF document to: ${patientJid}`);
    } else {
      // Fallback: Send plain text message
      await client.sendMessage(patientJid, messageText);
      console.log(`[LOG] Successfully sent completion text notification to: ${patientJid}`);
    }

    return res.status(200).json({ success: true, message: 'WhatsApp completion message sent successfully' });
  } catch (err) {
    console.error(`[ERROR] Failed to send WhatsApp completion message for booking #${bookingId}:`, err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`WhatsApp node service running on port ${PORT}`));