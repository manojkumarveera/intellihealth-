# IntelliHealth 360: AI-Powered Unified Digital Health Records Platform

> **An AI-Powered Unified Digital Health Records Platform Using Machine Learning, NLP, and Explainable AI**  
> *Developed by Department of Information Technology, Panimalar Engineering College, Chennai, India*

---

## 👥 Authors & Academic Affiliation

- **Mr. MADHAVAN R** – Assistant Professor & Project Supervisor (`Mail2madhavanr@gmail.com`)
- **Mrs. SUMITHRA** – Assistant Professor & Project Supervisor (`msumithra@panimalar.ac.in`)
- **MANOJ KUMAR V** – Student Researcher & Lead Developer (`Manojkumar2007veera@gmail.com`)
- **MOHAN DASS V** – Student Researcher & AI Engineer (`Mohandass15082007dass@gmail.com`)
- **KISHORE KUMAR E** – Student Researcher & Systems Analyst (`Kishorekumare2007@gmail.com`)

**Institution:** Panimalar Engineering College, Chennai, Tamil Nadu, India.

---

## 🏥 Platform Overview

Patient health records are traditionally scattered across isolated silos—hospitals, laboratories, retail pharmacies, and wearable IoT monitors. **IntelliHealth 360** bridges these divides by consolidating disparate electronic health records into a single, standardized **HL7® FHIR® R4** profile.

On top of this unified layer, the platform deploys:
1. **Supervised Machine Learning (XGBoost / Random Forest)**: Predicts 30-day cardiometabolic and hospital readmission hazards.
2. **Transformer Natural Language Processing (BioBERT / Flan-T5)**: Synthesizes long physician discharge summaries into concise, actionable clinical bullets.
3. **Explainable AI (TreeSHAP)**: Provides complete, auditable feature-attribution waterfall breakdowns showing exactly which clinical markers drove a given risk score up or down.
4. **Real-time IoT Telemetry**: Continuous Lead-II Electrocardiogram (ECG), SpO₂, Blood Pressure, and CGM Blood Glucose monitoring with automatic clinical alerts.

---

## 🚀 Key Features

- **Live Lead-II ECG Telemetry Canvas**: 60 FPS real-time cardiac waveform rendering with QRS complex peak detection, audio heartbeat synthesizer, and arrhythmia simulation.
- **Multi-Patient Clinical Dossier**: Seamlessly toggle between rich synthetic patient profiles:
  - **Ravi K. (58y, Male)** – Type 2 Diabetes, Severe Stage 2 Hypertension, Elevated 30-Day Risk.
  - **Anitha S. (44y, Female)** – Moderate Persistent Asthma, Borderline SpO₂ Hypoxia.
  - **Meena R. (67y, Female)** – Stable Coronary Artery Disease (CAD), Post-PCI LAD Stent, Pre-Diabetes.
- **TreeSHAP Explainability Waterfall**: Transparent horizontal bar charts indicating adverse risk drivers (+%) vs protective markers (-%) with medical guideline rationale.
- **BioBERT Clinical Summarization with Bidirectional Citation**: Click any summary bullet to highlight the exact source sentence in the physician's note.
- **HL7 FHIR R4 JSON Inspector**: View, inspect, and copy live compliant JSON payloads (`Patient`, `Observation`, `Encounter`, `MedicationDispense`).
- **9-Digit Unique ID (UHID / ABHA) Authentication Portal**:
  - Dedicated login portal (`login.html`) featuring formatted 9-digit input `[###-###-###]`, RBAC privilege validation, and simulated 2FA OTP verification.
  - Interactive **Digital Smart Health Card (ABDM)** generator with QR code and instant clinical registration.
  - Seamless session persistence connecting `login.html` and `index.html`.
- **Data Privacy & Compliance Vault**: Formatted according to India's **DPDP Act 2023**, **ABDM (Ayushman Bharat)**, **HIPAA**, and **GDPR**, with immutable audit logging and automated PHI de-identification.
- **Dark & Light Mode**: Seamless toggle between dark clinical telemetry cockpit and clean hospital day mode.

---

### 🔑 Pre-Configured 9-Digit Unique ID Credentials

| Name | Role | 9-Digit Unique ID | PIN | Profile Details |
| :--- | :--- | :--- | :--- | :--- |
| **Ravi K.** | Patient | `984-210-412` | `1234` | Type 2 Diabetes & Severe HTN |
| **Anitha S.** | Patient | `773-194-558` | `1234` | Moderate Asthma Telemetry |
| **Meena R.** | Patient | `610-453-184` | `1234` | Post-PCI LAD Stent CAD |
| **Dr. A. Sundaram** | Doctor | `104-982-360` | `1234` | Attending Cardiologist (Full Access) |
| **Nurse In-Charge** | Nurse | `452-881-903` | `1234` | Station 3B Inpatient Telemetry |
| **Compliance Officer** | Admin | `999-001-360` | `1234` | DPDP Act 2023 & Audit Officer |

---

## 💻 How to Open & Run

This web application is built with modern, zero-dependency HTML5, CSS3, and ES6 JavaScript modules. It requires no complex build tools or installation steps.

### Method 1: Direct Browser Launch
Simply double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari):
```
file:///C:/Users/Manoj/.gemini/antigravity/scratch/intellihealth360/index.html
```

### Method 2: Local Web Server (Recommended)
If you have Python or Node.js installed:
```bash
# Using Python
cd C:\Users\Manoj\.gemini\antigravity\scratch\intellihealth360
python -m http.server 8080

# Or using Node / npx
npx serve .
```
Then navigate to: `http://localhost:8080`

---

## 📚 Citation

```bibtex
@article{intellihealth360_2026,
  title={Intelli Health 360: An AI-Powered Unified Digital Health Records Platform Using Machine Learning, NLP, and Explainable AI},
  author={Madhavan, R. and Sumithra, and Kumar V, Manoj and Dass V, Mohan and Kumar E, Kishore},
  institution={Panimalar Engineering College, Department of Information Technology},
  address={Chennai, India},
  year={2026}
}
```
