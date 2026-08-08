const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  console.log('--- SCAN THIS QR CODE WITH YOUR WHATSAPP APP ---');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp Service is ready!');
});

client.initialize();

app.post('/api/whatsapp/send-booking', async (req, res) => {
  const { patientPhone, ownerEmail, packageName, schedule, address, patientCount } = req.body;

  // Set the owner's WhatsApp number here (e.g., 919876543210@c.us)
  const OWNER_PHONE = '919876543210@c.us'; 

  let formattedPatientPhone = patientPhone.replace(/[^0-9]/g, '');
  if (!formattedPatientPhone.startsWith('91')) {
    formattedPatientPhone = '91' + formattedPatientPhone;
  }
  const patientJid = `${formattedPatientPhone}@c.us`;

  const messageText = 
`🏥 *Thyronex Care Diagnostics* - Booking Confirmed!
-----------------------------------
🧪 *Package:* ${packageName}
📅 *Schedule:* ${schedule}
👥 *Patients:* ${patientCount}
📍 *Address:* ${address}
📞 *Contact:* ${patientPhone}
-----------------------------------
Thank you for choosing Thyronex Care!`;

  try {
    // Send to Patient
    await client.sendMessage(patientJid, messageText);

    // Send alert to Lab Owner
    const ownerText = `🚨 *NEW LAB TEST BOOKED*\n\n${messageText}\n📧 *Owner Email:* ${ownerEmail}`;
    await client.sendMessage(OWNER_PHONE, ownerText);

    res.status(200).json({ success: true, message: 'WhatsApp sent' });
  } catch (err) {
    console.error('WhatsApp Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log('WhatsApp service running on port 3000'));