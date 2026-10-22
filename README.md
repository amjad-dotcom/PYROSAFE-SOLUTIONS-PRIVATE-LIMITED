# Pyrosafe Solutions Pvt Ltd — Enterprise Industrial Safety CRM & ERP

**Pyrosafe Solutions Pvt Ltd** is an industrial fire protection, compliance audit, automated GST tax billing, real-time inventory management, and workforce administration suite.

---

## 🏢 Corporate Entity Profile

- **Legal Entity**: Pyrosafe Solutions Pvt Ltd
- **GSTIN**: `04AAQCP8028G1Z7` (Chandigarh — State Code: 04)
- **Contact Number**: `9136406255`
- **Official Email**: `pyrosafesolutions2026@gmail.com`
- **Registered Premises**: PLOT NO 149, PRESS SITE, INDUSTRIAL AREA PHASE 1
- **City / State / PIN**: Chandigarh - 160002, India

---

## 🔐 Administrative Access Credentials

The portal is protected by role-based authentication guarding all financial, inventory, and employee records:

- **Admin Login ID**: `pyrosafesolutions2026@gmail.com`
- **Default Password**: `Ravi@1993`
- **Role**: Super Administrator / Audit Commander

---

## 🚀 Core Functional Modules

### 1. Sales CRM & Pipeline
- Track prospective commercial & industrial clients through custom fire safety stages:
  - `Lead` &rarr; `Qualified` &rarr; `Site Audit` &rarr; `Proposal` &rarr; `Negotiation` &rarr; `Closed Won`
- Automatic state code tagging for GST classification.

### 2. Tax Invoicing & Dual-Copy Printing
- **Intra-State Supply (Chandigarh Code 04)**: Automatic split into **CGST 9% + SGST 9%** (18% effective).
- **Inter-State Supply (Punjab, Haryana, Delhi, etc.)**: Automatic calculation of **IGST 18%**.
- Dual-copy printable tax invoice with Original for Recipient & Duplicate for Transporter.
- Official bank RTGS coordinates (HDFC Bank Industrial Area Phase 1 branch).

### 3. Inventory & Stock Hub with Auto-Deduction
- Real-time stock counts for firefighting appliances:
  - ABC Dry Powder Extinguishers (IS:15683, HSN 8424)
  - CO2 Extinguishers (IS:15683, HSN 8424)
  - Addressable Optical Smoke Detectors (IS:2189, HSN 8531)
  - Fire Hydrant Landing Valves (IS:5290, HSN 8481)
  - AFFF 3% Foam Concentrates (IS:4989, HSN 3813)
- **Auto-Deduction**: Invoices issued automatically reduce stock on hand with an audit trail.

### 4. Human Resources & Safety Engineering Workforce
- Safety technician directory with NFPA / NBC qualification logs.
- Automated monthly payroll calculator with Basic, HRA, PF (Provident Fund), and ESIC deductions.
- One-click printable pay-slips and attendance logs.

### 5. In-App Documentation (`README`)
- Accessible from the sidebar navigation (`System README & Docs`).
- Interactive copy-to-clipboard badges, API endpoint matrix, Indian GST reference tables, and quick launch triggers.

---

## 🛠️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend API**: Node.js & Express (`server.ts` proxy)
- **Database**: MongoDB cluster (`pyrosafe_db`)
  - Endpoints:
    - `POST /api/auth/login`: Admin authentication
    - `GET /api/invoices`: Fetch persistent invoices
    - `POST /api/invoices`: Save invoice to MongoDB
    - `GET /api/status`: MongoDB cluster health check
    - `POST /api/inventory/deduct`: Automatic stock deduction

---

## 🏃 Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Server starts on `http://localhost:3000`.
