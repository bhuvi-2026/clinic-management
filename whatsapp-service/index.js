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
        protocolTimeout: 300000,
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

client.on('ready', async () => {
    console.log('WhatsApp Service is ready and authenticated!');
    
    // Upstream hotfix: Patch window.WWebJS.sendMessage in the active browser page
    // Prevents "Data passed to getter must include an id property" by stripping __x_id
    try {
        if (client.pupPage) {
            await client.pupPage.evaluate(() => {
                if (window.WWebJS && window.WWebJS.sendMessage) {
                    const originalSendMessage = window.WWebJS.sendMessage;
                    window.WWebJS.sendMessage = async function(chat, content, options = {}) {
                        if (options && options.sendMediaAsDocument) {
                            delete options.__x_id;
                        }
                        return originalSendMessage.apply(this, arguments);
                    };
                }
            });
            console.log('[LOG] Applied runtime in-browser __x_id memoize safety patch.');
        }
    } catch (e) {
        console.warn('[WARN] Could not attach runtime in-page hook:', e.message);
    }
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
// OTP Verification
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
        return res.status(200).json({ success: true, message: 'OTP sent via WhatsApp' });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// -------------------------------------------------------------
// 1. Confirm Booking
// -------------------------------------------------------------
app.post('/api/whatsapp/send-booking', async (req, res) => {
    const { bookingId, patientPhone, packageName, schedule, address, patientCount, ownerPhone, ownerEmail } = req.body;
    if (!patientPhone) {
        return res.status(400).json({ success: false, error: 'Patient phone is required' });
    }

    const patientJid = formatPhone(patientPhone);
    const ownerJid = formatPhone(ownerPhone || OWNER_PHONE_ENV);

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
        const ownerText = `🚨 *NEW LAB TEST BOOKED*\n\n${messageText}\n📧 *Owner Email:* ${ownerEmail || 'N/A'}`;
        await client.sendMessage(ownerJid, ownerText);
        return res.status(200).json({ success: true, message: 'WhatsApp sent successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// -------------------------------------------------------------
// 2. Complete Test Endpoint (Direct PDF Document Attachment Only)
// -------------------------------------------------------------
app.post('/api/whatsapp/send-completion', async (req, res) => {
    const { bookingId, patientPhone, packageName, schedule, pdfBase64, fileName } = req.body;

    console.log(`[LOG] Received WhatsApp completion request for Booking ID: #${bookingId}`);

    if (!patientPhone) {
        return res.status(400).json({ success: false, error: 'Patient phone is required' });
    }

    const patientJid = formatPhone(patientPhone);

    const captionText = 
`🏥 *Thyronex Health Care* - Test Report Ready!
-----------------------------------
🧪 *Booking ID:* #${bookingId}
🧪 *Package:* ${packageName || 'Diagnostic Health Package'}
📅 *Completed Schedule:* ${schedule || 'Recent'}
-----------------------------------
Dear Customer, your diagnostic test report has been verified by our clinical pathologists. 
Please find your official softcopy report document attached above.

Thank you for choosing Thyronex Care!`;

    let tempFilePath = null;
    try {
        if (pdfBase64 && pdfBase64.trim().length > 50) {
            const cleanBase64 = pdfBase64.includes('base64,') 
                ? pdfBase64.split('base64,')[1].replace(/\s/g, '') 
                : pdfBase64.replace(/\s/g, '');

            const documentName = fileName || `Thyronex_Report_Booking_${bookingId}.pdf`;
            tempFilePath = path.join('/tmp', `Thyronex_Report_${bookingId}_${Date.now()}.pdf`);

            // 1. Write the clean binary buffer to a temp file on disk
            fs.writeFileSync(tempFilePath, Buffer.from(cleanBase64, 'base64'));

            // 2. Load media from the disk file
            const media = MessageMedia.fromFilePath(tempFilePath);
            media.filename = documentName;

            // 3. Send the attached PDF document directly with caption
            await client.sendMessage(patientJid, media, {
                caption: captionText,
                sendMediaAsDocument: true
            });

            console.log(`[SUCCESS] PDF Document attached & delivered directly to: ${patientJid}`);
        } else {
            // Text-only fallback if no PDF is uploaded
            await client.sendMessage(patientJid, captionText);
            console.log(`[LOG] Sent text notification to: ${patientJid}`);
        }

        return res.status(200).json({ success: true, message: 'WhatsApp PDF dispatched successfully' });
    } catch (err) {
        console.error(`[ERROR] Failed to send WhatsApp PDF document:`, err);
        return res.status(500).json({ success: false, error: err.message });
    } finally {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
            } catch (cleanupErr) {
                // Ignore temporary file unlink errors
            }
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`WhatsApp node service running on port ${PORT}`));