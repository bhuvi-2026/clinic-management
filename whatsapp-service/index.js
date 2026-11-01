const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const OWNER_PHONE_ENV = process.env.LAB_OWNER_WHATSAPP_NUMBER || '919513951931';

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '/home/ubuntu/whatsapp-service/.wwebjs_auth'
    }),
    puppeteer: {
        headless: true,
        protocolTimeout: 300000, // 5 minutes timeout to prevent Runtime.callFunctionOn timeouts
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-software-rasterizer',
            '--disk-cache-size=0',
            '--media-cache-size=0',
            '--aggressive-cache-discard'
        ]
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

function formatPhone(phone) {
    let cleaned = (phone || '').replace(/[^0-9]/g, '');
    if (cleaned.length === 10) {
        cleaned = '91' + cleaned;
    }
    return `${cleaned}@c.us`;
}

// -------------------------------------------------------------
// OTP Verification Message Endpoint
// -------------------------------------------------------------
app.post('/api/whatsapp/send-otp', async (req, res) => {
    const { patientPhone, otp } = req.body;

    if (!patientPhone || !otp) {
        return res.status(400).json({ success: false, error: 'patientPhone and otp are required' });
    }

    const patientJid = formatPhone(patientPhone);
    const otpMessage = 
`🏥 *Thyronex Care Diagnostics*
-----------------------------------
Your verification code is: *${otp}*

Valid for 5 minutes. Please do not share this code with anyone.
-----------------------------------
Thank you for choosing Thyronex Care!`;

    try {
        await client.sendMessage(patientJid, otpMessage);
        console.log(`[LOG] Successfully dispatched OTP WhatsApp to: ${patientJid}`);
        return res.status(200).json({ success: true, message: 'OTP sent via WhatsApp' });
    } catch (err) {
        console.error(`[ERROR] Failed to send OTP to ${patientJid}:`, err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// -------------------------------------------------------------
// 1. Confirm Booking Endpoint
// -------------------------------------------------------------
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
`🏥 *Thyronex Health Care* - Booking Confirmed!
-----------------------------------
🧪 *Booking ID:* #${bookingId}
🧪 *Package:* ${packageName || 'Diagnostic Health Checkup'}
📅 *Schedule:* ${schedule || 'Scheduled'}
👥 *Patients:* ${patientCount || 1}
📍 *Address:* ${address || 'Home Visit'}
📞 *Contact:* ${patientPhone}
-----------------------------------
Thank you for choosing Thyronex Care!`;

    try {
        await client.sendMessage(patientJid, messageText);
        console.log(`[LOG] Successfully sent booking confirmation to Patient: ${patientJid}`);

        const ownerText = `🚨 *NEW LAB TEST BOOKED*\n\n${messageText}\n📧 *Owner Email:* ${ownerEmail || 'N/A'}`;
        await client.sendMessage(ownerJid, ownerText);
        console.log(`[LOG] Successfully sent booking notification to Owner: ${ownerJid}`);

        return res.status(200).json({ success: true, message: 'WhatsApp sent successfully' });
    } catch (err) {
        console.error(`[ERROR] Failed to send WhatsApp notification for booking #${bookingId}:`, err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// -------------------------------------------------------------
// 2. Complete Test Endpoint (Large PDF Disk-Stream + Download Link)
// -------------------------------------------------------------
app.post('/api/whatsapp/send-completion', async (req, res) => {
    const { bookingId, patientPhone, packageName, schedule, pdfBase64, fileName } = req.body;

    console.log(`[LOG] Received WhatsApp completion request for Booking ID: #${bookingId}`);

    if (!patientPhone) {
        return res.status(400).json({ success: false, error: 'Patient phone is required' });
    }

    const patientJid = formatPhone(patientPhone);
    const portalUrl = `http://thyronexcare-frontend-2026.s3-website.ap-south-1.amazonaws.com/booking-status?id=${bookingId}`;

    const messageText = 
`🏥 *Thyronex Health Care* - Test Report Ready!
-----------------------------------
🧪 *Booking ID:* #${bookingId}
🧪 *Package:* ${packageName || 'Diagnostic Health Package'}
📅 *Completed Schedule:* ${schedule || 'Recent'}
-----------------------------------
Dear Customer, your diagnostic test report has been verified by our clinical pathologists.

📄 *View / Download Report Online:*
👉 ${portalUrl}

Please find your official softcopy report document attached below.
You can also view and re-download your reports anytime under 'My Bookings' on our portal.

Thank you for choosing Thyronex Care!`;

    let tempFilePath = null;
    try {
        // Step A: Send text confirmation first
        await client.sendMessage(patientJid, messageText);
        console.log(`[LOG] Sent completion message to: ${patientJid}`);

        // Step B: Send PDF file if provided
        if (pdfBase64 && pdfBase64.trim().length > 50) {
            const cleanBase64 = pdfBase64.includes('base64,')
                ? pdfBase64.split('base64,')[1].replace(/\s/g, '')
                : pdfBase64.replace(/\s/g, '');

            const documentName = fileName || `Thyronex_Report_Booking_${bookingId}.pdf`;
            tempFilePath = path.join('/tmp', `Report_${bookingId}_${Date.now()}.pdf`);

            // Write to disk first to avoid Chromium memory timeouts
            fs.writeFileSync(tempFilePath, Buffer.from(cleanBase64, 'base64'));

            const media = MessageMedia.fromFilePath(tempFilePath);
            media.filename = documentName;

            await client.sendMessage(patientJid, media, {
                sendMediaAsDocument: true
            });
            console.log(`[SUCCESS] PDF document delivered to: ${patientJid}`);
        }

        return res.status(200).json({ success: true, message: 'WhatsApp dispatched successfully' });
    } catch (err) {
        console.error(`[ERROR] Failed to send WhatsApp completion payload:`, err);
        return res.status(500).json({ success: false, error: err.message });
    } finally {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
            } catch (cleanupErr) {
                console.error(`[WARN] Failed to delete temp file ${tempFilePath}:`, cleanupErr.message);
            }
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`WhatsApp node service running on port ${PORT}`));