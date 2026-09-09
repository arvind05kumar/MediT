# 🏥 MediT — AI-Powered On-Demand Medicine Delivery Platform
> **Smart India Hackathon (SIH) Prototype Build**  
> *Hyperlocal instant medicine dispatch with multimodal prescription OCR, automated clinical interaction safeguards, Jan Aushadhi generic cost savings, and 24/7 AI health assistant.*

---

## 🌟 Executive Summary

**MediT** is a next-generation on-demand pharmaceutical delivery network engineered to bridge rapid delivery speeds (10-30 mins) with strict medical safety and regulatory compliance.

Unlike standard e-commerce delivery apps, MediT incorporates **Google Gemini Vision & Text AI** along with a mandatory **Human-in-the-Loop Pharmacist Verification** workflow to prevent dispensing errors, detect dangerous drug interactions, and save patients up to 60% on medication bills using bioequivalent generics.

---

## 🚀 Key Differentiators (Why MediT Stands Out)

| # | Feature | Technology / Safeguard | Impact |
|---|---|---|---|
| **1** | **Handwritten Prescription OCR** | Gemini 1.5 Flash Vision Multimodal OCR | Extracts illegible doctor handwriting, medication names, strengths, dosages, and calculates confidence scores per item. |
| **2** | **Real-Time Drug Interaction Safeguards** | Gemini 1.5 Clinical Analysis Engine | Cross-references cart items against the patient's active medical history (e.g. Blood Thinners ↔ NSAIDs, ARB Antihypertensives ↔ Potassium) to prevent adverse reactions. |
| **3** | **Jan Aushadhi Generic Substitute Finder** | AI Indian Drug Formulations Database | Automatically identifies cheaper bioequivalent generic formulations to save patients ₹50–₹250 per order. |
| **4** | **Human-in-the-Loop Verification** | Registered Pharmacist Verification Console | **Compliance Safeguard:** AI assists but registered pharmacists must explicitly review the prescription image side-by-side before dispatch. |
| **5** | **24/7 AI Health Chatbot (MediBot)** | Gemini 1.5 with Strict Medical Boundaries | Triages minor OTC symptoms with mandatory disclaimers and immediate emergency escalation. |
| **6** | **Voice-Enabled Search & Accessibility** | Native Web Speech API + High-Contrast Font Mode | Supports voice searches in **Hindi** and **English**, with font scaling for senior citizens. |

---

## 🖥️ Three Unified Interfaces

### 1. 👤 Customer Web App (`/` and `/orders`)
- **Voice Search** (English + Hindi) & Accessibility Font Mode for elderly users.
- **Categorized Catalogue** (OTC, Chronic Diabetes, Chronic BP, Antibiotics/Rx, Baby Care, Medical Devices).
- **Prescription Upload Studio** with live handwritten image OCR & entity confirmation.
- **Interactive Cart & Checkout**:
  - Drug interaction alarm banners.
  - 1-click Generic Swap cost-saving cards.
  - Emergency Express (10-min priority queue) vs Standard delivery modes.
  - Simulated UPI / Card / COD payment.
- **Live GPS Order Radar & Timeline** tracking state changes in real-time.
- **Refill Reminders** for chronic medications (BP/Diabetes).
- **Floating MediBot AI** health assistant.

### 2. 🚴 Delivery Partner App (`/delivery`)
- Mock rider profile (*Vikram Singh, Rider #104*).
- Active order queue with **EMERGENCY** orders highlighted in pulsing red at the top.
- Step-by-step dispatch status controls (*"Picked up from pharmacy"* ➔ *"Out for delivery"* ➔ *"Delivered"*).
- Synchronizes with the Customer Tracking radar in real time.
- Daily earnings breakdown and rating metrics.

### 3. 🏢 Pharmacy Admin & Compliance Console (`/pharmacy-admin`)
- **Prescription Verification Queue**: Side-by-side view comparing original prescription image against AI-extracted medicines. Pharmacist approves or flags.
- **Inventory & SKU Manager**: Stock quantity adjustments and out-of-stock toggling.
- **Multi-Node Mesh Routing**: Automatic order reassignment across partner pharmacy nodes (e.g., Apollo ➔ MedPlus ➔ Jan Aushadhi Hub) if local stock is depleted.

---

## 🛠️ Tech Stack

- **Frontend & Server**: Next.js 14+ (App Router), React 18, TypeScript.
- **Styling & Design**: Tailwind CSS v4, Lucide React Icons, Canvas Confetti.
- **AI Integration**: `@google/generative-ai` (Gemini 1.5 Flash Vision & Text).
- **Database Layer**: Supabase (PostgreSQL + Auth + Storage) + reactive client store fallback for zero-dependency offline/instant demoing.
- **Speech Engine**: Web Speech API (Free, browser-native).

---

## ⚡ Quick Start & Running Locally

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Create `.env.local` in the project root:
```env
# Free Gemini API Key from: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Supabase configuration (Database schema provided in supabase_schema.sql)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

> **Note:** If `GEMINI_API_KEY` is not provided, MediT automatically switches to its built-in realistic AI simulation engine so your presentation demo **never fails** even without internet/API keys!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Demo Walkthrough Script for SIH Presentation

1. **Customer Orders Rx Medicine**:
   - Open [http://localhost:3000](http://localhost:3000).
   - Try **Voice Search** (Click mic and say *"Augmentin"* or click the Hindi toggle).
   - Add **Augmentin 625 Duo** (Rx item) and **Dolo 650** to cart.
2. **AI Prescription OCR**:
   - Open Cart ➔ Notice checkout is locked because Rx is required.
   - Click **"Upload Prescription"** ➔ Select *"Dr. Verma (Chest & Fever Rx)"* preset.
   - Watch Gemini Vision OCR extract medicines with confidence percentages.
   - Click **"Confirm & Attach"**.
3. **AI Safety & Cost Savings**:
   - Notice the **AI Drug Interaction banner** cross-referencing active medications.
   - Click **"Swap & Save"** on generic alternative suggestion to reduce order total.
   - Select **"Express Emergency"** slot and click **"Place Order"**.
4. **Human-in-the-Loop Pharmacist Verification**:
   - Click top banner switch: **"Pharmacy Admin"** (`/pharmacy-admin`).
   - View the pending order with side-by-side prescription verification.
   - Click **"Approve & Authorize Dispense"**.
5. **Delivery Partner Dispatch**:
   - Switch to **"Delivery Partner"** (`/delivery`).
   - Notice the **EMERGENCY** order is flagged on top.
   - Click **"Picked Up from Pharmacy"** ➔ **"Out for Delivery"** ➔ **"Mark as Delivered"**.
6. **Customer Tracking**:
   - Return to **"Customer"** ➔ `/orders` and observe the live GPS radar and timeline reflecting every state update live!
7. **MediBot AI Chatbot**:
   - Click floating **"Ask MediBot AI"** at bottom right.
   - Ask: *"I have mild acidity after spicy food, what can I take?"*.
   - Verify safety disclaimers, OTC recommendations, and emergency triage boundary rules.

---

## 📜 Database Schema (Supabase)
The complete PostgreSQL schema with tables (`users`, `pharmacies`, `medicines`, `orders`, `prescriptions`, `refill_reminders`, `chat_history`), RLS policies, and enum types is available in [`supabase_schema.sql`](./supabase_schema.sql).

---

## ⚖️ Legal & Medical Disclaimer
MediT is an engineering prototype and proof-of-concept developed for hackathon demonstration. All clinical advice is for informational OTC support only. Emergency situations require dialing national medical hotlines (112 / 108).
