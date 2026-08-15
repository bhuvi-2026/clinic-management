# Thyronex Care — Local Development & Setup Guide

This document outlines the step-by-step instructions for configuring, building, running, and verifying the full-stack Thyronex Care application locally.

---

## 1. Environment Configurations & Files

To configure environment variables, create a `.env` file in your shell or define them in your OS. All variables default to fully functioning mock values suitable for local development/testing.

### Frontend Configurations
The frontend is built with **Angular 17+** and points to:
* **Backend API URL:** `http://localhost:8080` (Standard local Spring Boot server port)

### Backend Configurations
Create or customize the variables below. They are configured via dynamic property placeholders in `backend/src/main/resources/application.properties`:

| Variable Name | Description | Default Local Test Value |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string | `jdbc:postgresql://localhost:5432/doctor_booking_local` |
| `DATABASE_USERNAME` | PostgreSQL database user | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL database password | `Bhuvana@2026` |
| `SMTP_HOST` | Gmail or custom SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USERNAME` | SMTP account email address | `blrrudresh972@gmail.com` |
| `SMTP_PASSWORD` | Google SMTP App Password | `bjvkzeslsfrvkacq` |
| `WHATSAPP_API_URL` | Port/URL of local node WhatsApp service | `http://localhost:3000` |
| `BUSINESS_EMAIL` | Default business sender email | `blrrudresh972@gmail.com` |
| `LAB_OWNER_EMAIL` | Lab owner's recipient email | `bhuvis459@gmail.com` |
| `LAB_OWNER_WHATSAPP_NUMBER` | Lab owner's recipient mobile | `919876543210` |

---

## 2. Setting Up and Starting Services

### Step A: Starting the database (PostgreSQL)
1. Ensure PostgreSQL is running on port `5432`.
2. Create a local database named `doctor_booking_local`.
3. Hibernate will automatically update/create the schema upon starting the backend.

### Step B: Running the WhatsApp Node Microservice
1. Open a terminal and navigate to the `whatsapp-service` directory:
   ```bash
   cd whatsapp-service
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Start the node service:
   ```bash
   npm start
   ```
4. Authenticate the whatsapp-web.js client:
   * A QR code will display in the terminal. Scan this using your WhatsApp Mobile app (`Linked Devices`).

### Step C: Running the Spring Boot Backend
1. Open a new terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Build and start the Spring Boot application using Maven:
   ```bash
   mvnw spring-boot:run
   ```
3. The server runs on `http://localhost:8080`.

### Step D: Running the Angular Frontend
1. Open a new terminal and navigate to the `frontend/Thyronex` directory:
   ```bash
   cd frontend/Thyronex
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
4. Access the web interface in your browser at `http://localhost:4200`.

---

## 3. Verification & Testing Instructions

### Flow 1: Signup / Login & OTP Authentication
1. Go to `http://localhost:4200/login`.
2. Enter your test phone number (e.g., `9876543210`).
3. Click "Request OTP".
4. Check the Spring Boot backend console output for the log line:
   `>>> [SMS GATEWAY] Sending OTP <six-digit-code> to 9876543210`
5. Enter the six-digit code on the login page and click "Verify".
6. Verify successful authentication and redirection.

### Flow 2: Selecting and Booking a Blood Test
1. From the Home page, click on any Lab Package.
2. Complete the collection address, patient count, schedule slots, and email.
3. Click "Confirm Booking".
4. Verify the database table `lab_bookings` has persisted your new record reliably.
5. In the backend logs, confirm that WhatsApp/Email notifications were initiated asynchronously.

### Flow 3: Viewing Your Booked Tests (My Bookings)
1. Inside the app, access the User Profile/Dashboard.
2. Confirm your booked tests are displayed immediately in the list with a beautiful "CONFIRMED" status badge.

### Flow 4: Simulating Test Completion Notification
1. To simulate marking a lab test completed by the lab owner, invoke the completion API endpoint:
   ```bash
   curl -X POST http://localhost:8080/api/lab-packages/bookings/<BOOKING_ID>/complete
   ```
2. Confirm the booking status transitions to `"COMPLETED"` in the Database and in "My Bookings" on the UI.
3. Confirm that thank-you/completion emails and WhatsApp notifications are triggered immediately.
