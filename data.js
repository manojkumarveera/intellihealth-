/**
 * IntelliHealth 360 - Clinical & Technical Dataset
 * Based on the research paper: "Intelli Health 360: An AI-Powered Unified Digital Health Records Platform"
 * Panimalar Engineering College, Department of Information Technology, Chennai, India.
 */

const RESEARCH_METADATA = {
  title: "Intelli Health 360: An AI-Powered Unified Digital Health Records Platform Using Machine Learning, NLP, and Explainable AI",
  institution: "Panimalar Engineering College",
  department: "Department of Information Technology",
  location: "Chennai, Tamil Nadu, India",
  authors: [
    { name: "Mr. MADHAVAN R", role: "Assistant Professor & Project Supervisor", email: "Mail2madhavanr@gmail.com", isFaculty: true },
    { name: "Mrs. SUMITHRA", role: "Assistant Professor & Project Supervisor", email: "msumithra@panimalar.ac.in", isFaculty: true },
    { name: "MANOJ KUMAR V", role: "Student Researcher & Lead Developer", email: "Manojkumar2007veera@gmail.com", isStudent: true },
    { name: "MOHAN DASS V", role: "Student Researcher & AI Engineer", email: "Mohandass15082007dass@gmail.com", isStudent: true },
    { name: "KISHORE KUMAR E", role: "Student Researcher & Systems Analyst", email: "Kishorekumare2007@gmail.com", isStudent: true }
  ],
  keywords: ["Machine Learning", "Natural Language Processing", "Explainable AI (XAI)", "HL7 FHIR R4", "Electronic Health Records", "Interoperability", "Clinical Decision Support"],
  standards: [
    { code: "HL7 FHIR R4", name: "Fast Healthcare Interoperability Resources v4.0.1" },
    { code: "ABDM", name: "Ayushman Bharat Digital Mission (India National Health Stack)" },
    { code: "DPDP Act 2023", name: "Digital Personal Data Protection Act, 2023" },
    { code: "HIPAA", name: "Health Insurance Portability and Accountability Act" },
    { code: "GDPR", name: "General Data Protection Regulation (EU 2016/679)" }
  ],
  metrics: {
    auroc: 0.892,
    aurocTarget: 0.80,
    recall: 0.941,
    precision: 0.912,
    nlp_f1: 0.884,
    nlpTarget: 0.85,
    usability_sus: 86.5,
    usabilityTarget: 70.0,
    latency_ms: 38,
    phi_masked_pct: 100
  }
};

const PATIENTS_DATABASE = [
  {
    id: "PT-101",
    uniqueId: "984210412",
    uniqueIdFormatted: "984-210-412",
    mrn: "IH360-98421",
    abhaId: "91-8834-1029-4412",
    name: "Ravi K.",
    age: 58,
    gender: "Male",
    bloodGroup: "B+",
    avatar: "👨🏽",
    statusBadge: "High Risk Monitor",
    conditionSummary: "Type 2 Diabetes Mellitus · Severe Hypertension · Pre-Cardiometabolic Risk",
    history: "12-year history of T2D, 8-year hypertension, prior borderline microalbuminuria. Under outpatient cardiometabolic follow-up.",
    allergies: ["Penicillin G (Severe urticaria/anaphylaxis risk)"],
    primaryPhysician: "Dr. A. Sundaram, MD, DM (Cardiology)",
    hospitalUnit: "Apollo Main Speciality / Panimalar Health Hub",
    baseVitals: {
      hr: 78,
      sp: 97,
      bpSys: 142,
      bpDia: 90,
      glucose: 168,
      resp: 18,
      temp: 36.8,
      hrv: 28,
      a1c: 8.1
    },
    medications: [
      { name: "Metformin HCl", dosage: "1000 mg", freq: "Twice daily with meals", rxNorm: "860975" },
      { name: "Amlodipine Besylate", dosage: "10 mg", freq: "Once daily morning", rxNorm: "197361" },
      { name: "Atorvastatin Calcium", dosage: "20 mg", freq: "Once daily bedtime", rxNorm: "259255" },
      { name: "Aspirin (Enteric Coated)", dosage: "75 mg", freq: "Once daily post-lunch", rxNorm: "243670" }
    ],
    noteSentences: [
      { text: "Patient admitted to the intermediate cardiology unit presenting with acute non-anginal chest tightness and markedly elevated blood sugar.", phi: ["intermediate cardiology unit"] },
      { text: "Documented history of poorly regulated Type 2 diabetes with most recent lab confirming HbA1c at 8.1 percent, indicating sustained microvascular hazard.", phi: ["8.1 percent"] },
      { text: "Continuous hemodynamic tracking revealed systolic blood pressure persisting above 140 mmHg despite standard anti-hypertensive titration.", phi: ["140 mmHg"] },
      { text: "Therapeutic regimen updated: Metformin dosage escalated to 1000mg BID, Amlodipine 10mg sustained, and nocturnal glucose monitoring instituted.", phi: ["Metformin", "Amlodipine"] },
      { text: "Recommended strict dietary glycemic index management, cardiac rehabilitation consultation, and scheduled clinical reassessment in two weeks.", phi: ["two weeks"] }
    ],
    nlpSummary: [
      { id: 0, text: "Presenting with chest tightness and severe glycemic dysregulation", targetSentenceIndex: 0, tag: "Symptom / Ingestion" },
      { id: 1, text: "HbA1c 8.1% reflects inadequate glycemic control; high microvascular hazard", targetSentenceIndex: 1, tag: "Laboratory Finding" },
      { id: 2, text: "Systolic BP persistently above 140 mmHg requiring intensified antihypertensive management", targetSentenceIndex: 2, tag: "Hemodynamic Risk" },
      { id: 3, text: "Pharmacotherapy adjusted: Metformin escalated to 1000mg BID, Amlodipine maintained", targetSentenceIndex: 3, tag: "Prescription Update" },
      { id: 4, text: "Scheduled 14-day endocrinology review & cardiac rehabilitation protocol", targetSentenceIndex: 4, tag: "Care Plan" }
    ],
    shapFeatures: [
      { name: "Glycated Hemoglobin (HbA1c 8.1%)", impact: 14.2, direction: "risk", description: "Values >7.0% increase 30-day cardiovascular event odds by 2.4x (ADA guidelines)" },
      { name: "Systolic BP (>140 mmHg)", impact: 9.8, direction: "risk", description: "Stage 2 hypertension elevates end-organ arterial strain (ACC/AHA 2023)" },
      { name: "Fasting Blood Glucose (168 mg/dL)", impact: 6.4, direction: "risk", description: "Hyperglycemia suppresses autonomic endothelial regulation" },
      { name: "Age Factor (58 years)", impact: 4.5, direction: "risk", description: "Biological age threshold elevates baseline vascular stiffness" },
      { name: "Depressed HRV (28 ms)", impact: 3.9, direction: "risk", description: "Reduced vagal tone indicates autonomic cardiovascular vulnerability" },
      { name: "Regular Medication Dispense Refill", impact: -3.8, direction: "protective", description: "Verified pharmacy adherence decreases hospitalization hazard" },
      { name: "Normal SpO₂ (97%)", impact: -2.5, direction: "protective", description: "Stable pulmonary gas exchange protects myocardial oxygenation" },
      { name: "Non-smoker Status", impact: -4.1, direction: "protective", description: "Lack of nicotine endothelial injury mitigates acute plaque rupture" }
    ],
    fhirResources: [
      {
        resourceType: "Patient",
        id: "ravi-k-98421",
        meta: { profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"] },
        identifier: [{ system: "https://healthid.ndhm.gov.in", value: "91-8834-1029-4412" }],
        name: [{ family: "K.", given: ["Ravi"] }],
        gender: "male",
        birthDate: "1968-04-12",
        telecom: [{ system: "phone", value: "+91 98401 23456" }],
        address: [{ city: "Chennai", state: "Tamil Nadu", country: "India" }]
      },
      {
        resourceType: "Observation",
        id: "obs-hba1c-98421",
        status: "final",
        category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "laboratory" }] }],
        code: { coding: [{ system: "http://loinc.org", code: "4548-4", display: "Hemoglobin A1c/Hemoglobin.total in Blood" }] },
        subject: { reference: "Patient/ravi-k-98421" },
        effectiveDateTime: "2026-09-28T09:15:00+05:30",
        valueQuantity: { value: 8.1, unit: "%", system: "http://unitsofmeasure.org", code: "%" },
        referenceRange: [{ high: { value: 5.7, unit: "%" } }]
      },
      {
        resourceType: "Observation",
        id: "obs-vitals-wearable-98421",
        status: "preliminary",
        category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs" }] }],
        code: { coding: [{ system: "http://loinc.org", code: "85354-9", display: "Blood pressure panel with all children optional" }] },
        subject: { reference: "Patient/ravi-k-98421" },
        effectiveDateTime: "2026-10-07T18:20:00+05:30",
        component: [
          { code: { coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure" }] }, valueQuantity: { value: 142, unit: "mmHg" } },
          { code: { coding: [{ system: "http://loinc.org", code: "8462-4", display: "Diastolic blood pressure" }] }, valueQuantity: { value: 90, unit: "mmHg" } }
        ]
      },
      {
        resourceType: "MedicationDispense",
        id: "med-metformin-98421",
        status: "completed",
        medicationCodeableConcept: { coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "860975", display: "Metformin hydrochloride 1000 MG Oral Tablet" }] },
        subject: { reference: "Patient/ravi-k-98421" },
        whenHandedOver: "2026-10-01T11:30:00+05:30",
        daysSupply: { value: 30, unit: "days" }
      }
    ],
    healthDetails: {
      biometrics: {
        heightCm: 172,
        weightKg: 84.5,
        bmi: 28.6,
        bmiStatus: "Overweight (Class I)",
        bsa: 1.98,
        waistCircumferenceCm: 96
      },
      organHealth: [
        { organ: "Cardiovascular System", status: "High Risk", statusClass: "critical", note: "Stage 2 Essential Hypertension with Left Ventricular strain tendency" },
        { organ: "Endocrine & Glycemia", status: "Uncontrolled", statusClass: "critical", note: "HbA1c 8.1% (sustained microvascular hazard)" },
        { organ: "Renal Function", status: "Mild Impairment", statusClass: "warning", note: "eGFR 74 mL/min/1.73m² · Borderline Microalbuminuria (48 mg/g)" },
        { organ: "Pulmonary System", status: "Intact", statusClass: "success", note: "SpO₂ 97% on ambient air, clear lung fields" },
        { organ: "Hepatic / Liver", status: "Normal", statusClass: "success", note: "ALT 34 U/L, AST 28 U/L within reference limits" }
      ],
      comprehensiveLabs: [
        { test: "Glycated Hemoglobin (HbA1c)", value: "8.1", unit: "%", refRange: "< 5.7%", status: "high", loinc: "4548-4" },
        { test: "Fasting Blood Glucose", value: "168", unit: "mg/dL", refRange: "70 - 99 mg/dL", status: "high", loinc: "2339-0" },
        { test: "Post-Prandial Glucose", value: "242", unit: "mg/dL", refRange: "< 140 mg/dL", status: "high", loinc: "1521-4" },
        { test: "Total Cholesterol", value: "218", unit: "mg/dL", refRange: "< 200 mg/dL", status: "borderline", loinc: "2093-3" },
        { test: "Low-Density Lipoprotein (LDL-C)", value: "138", unit: "mg/dL", refRange: "< 100 mg/dL", status: "high", loinc: "13457-7" },
        { test: "High-Density Lipoprotein (HDL-C)", value: "38", unit: "mg/dL", refRange: "> 40 mg/dL", status: "low", loinc: "2085-9" },
        { test: "Serum Triglycerides", value: "210", unit: "mg/dL", refRange: "< 150 mg/dL", status: "high", loinc: "2571-8" },
        { test: "Serum Creatinine", value: "1.15", unit: "mg/dL", refRange: "0.7 - 1.3 mg/dL", status: "normal", loinc: "2160-0" },
        { test: "Estimated GFR (CKD-EPI)", value: "74", unit: "mL/min/1.73m²", refRange: "> 90 mL/min", status: "borderline", loinc: "33914-3" },
        { test: "Urine Albumin/Creatinine Ratio", value: "48", unit: "mg/g", refRange: "< 30 mg/g", status: "high", loinc: "14959-1" }
      ],
      lifestyle: {
        diet: "Diabetic Moderate Carb · Low Glycemic Index recommended",
        physicalActivity: "Sedentary (< 3,200 steps/day logged via wearable)",
        smokingStatus: "Never Smoker",
        alcoholIntake: "Occasional social (1-2 units/month)",
        sleepAverage: "6.2 hours/night (Restless nocturnal sleep)"
      },
      familyHistory: [
        "Father: Fatal Acute Myocardial Infarction at age 62",
        "Mother: Long-standing Type 2 Diabetes with Diabetic Retinopathy",
        "Elder Brother: Hypertension diagnosed at age 48"
      ]
    },
    prescription: {
      rxNumber: "RX-2026-90412",
      dateIssued: "04 Oct 2026",
      validUntil: "04 Jan 2027",
      doctor: {
        name: "Dr. A. Sundaram, MD, DM (Cardiology)",
        qualification: "MBBS, MD (Internal Med), DM (Cardiology), FACC",
        registrationNo: "MCI / TNMC Reg: 48291 / 2004",
        clinicHospital: "Department of Cardiology & Cardiovascular Prevention",
        hospitalUnit: "Apollo Main Speciality / Panimalar Health Hub, Chennai",
        phone: "+91 44 2829 0200",
        email: "drsundaram@panimalarhealth.org",
        digitalSignature: "Verified Cryptographically (PKI-SHA256 Signed)"
      },
      diagnosis: "Type 2 Diabetes Mellitus with Microvascular Risk · Stage 2 Essential Hypertension · Mixed Dyslipidemia",
      medications: [
        {
          name: "Metformin Hydrochloride",
          brand: "Glycomet SR",
          dosage: "1000 mg",
          form: "Tablet (Extended Release)",
          schedule: "1 - 0 - 1",
          scheduleText: "Morning & Night with food",
          duration: "30 Days",
          quantity: "60 Tablets",
          refillsRemaining: 2,
          instructions: "Take immediately with or after meals to minimize gastrointestinal discomfort. Do not crush or chew.",
          dispenseStatus: "Dispensed (Apollo Pharmacy, 01 Oct 2026)",
          rxNorm: "860975",
          snomed: "318440004"
        },
        {
          name: "Amlodipine Besylate",
          brand: "Norvasc / Amlong",
          dosage: "10 mg",
          form: "Oral Tablet",
          schedule: "1 - 0 - 0",
          scheduleText: "Once daily morning after breakfast",
          duration: "30 Days",
          quantity: "30 Tablets",
          refillsRemaining: 2,
          instructions: "Titrated from 5mg. Monitor for peripheral ankle swelling. Track home blood pressure daily.",
          dispenseStatus: "Dispensed (Apollo Pharmacy, 01 Oct 2026)",
          rxNorm: "197361",
          snomed: "386864001"
        },
        {
          name: "Atorvastatin Calcium",
          brand: "Lipitor / Atorva",
          dosage: "20 mg",
          form: "Film-Coated Tablet",
          schedule: "0 - 0 - 1",
          scheduleText: "Once daily at bedtime",
          duration: "30 Days",
          quantity: "30 Tablets",
          refillsRemaining: 2,
          instructions: "Lipid-lowering plaque stabilization. Promptly report unexplained muscle ache or dark urine.",
          dispenseStatus: "Dispensed (Apollo Pharmacy, 01 Oct 2026)",
          rxNorm: "259255",
          snomed: "386884004"
        },
        {
          name: "Aspirin (Enteric Coated)",
          brand: "Ecosprin",
          dosage: "75 mg",
          form: "Enteric Coated Tablet",
          schedule: "0 - 1 - 0",
          scheduleText: "Once daily after lunch",
          duration: "30 Days",
          quantity: "30 Tablets",
          refillsRemaining: 2,
          instructions: "Secondary cardiovascular prophylaxis. Never consume on empty stomach. Avoid concurrent NSAIDs.",
          dispenseStatus: "Dispensed (Apollo Pharmacy, 01 Oct 2026)",
          rxNorm: "243670",
          snomed: "387458008"
        }
      ],
      dietaryAndLifestyleOrders: [
        "Strict low-glycemic Mediterranean or South Indian diabetic diet; limit refined polished rice and sugars.",
        "Dietary sodium restriction: < 2.0g/day (no table salt, avoid papads and pickles).",
        "Gradual walking target: 6,000 steps/day as tracked by IoT wearable monitor.",
        "Twice-weekly capillary self-monitoring of blood glucose (fasting + 2h post-prandial)."
      ],
      drugAllergyAlert: "⚠️ ALLERGY CONTRAINDICATION: Documented severe urticaria to Penicillin G. Avoid all Beta-lactams.",
      followUp: "Outpatient Cardiology & Endocrinology Review in 14 Days (Bring wearable telemetry report)."
    }
  },
  {
    id: "PT-102",
    uniqueId: "773194558",
    uniqueIdFormatted: "773-194-558",
    mrn: "IH360-77319",
    abhaId: "91-4412-9901-5582",
    name: "Anitha S.",
    age: 44,
    gender: "Female",
    bloodGroup: "O+",
    avatar: "👩🏽",
    statusBadge: "Respiratory Telemetry",
    conditionSummary: "Moderate Persistent Asthma · Nocturnal Wheeze · Borderline Hypoxia",
    history: "Childhood asthma with recurring seasonal exacerbations. No diabetes or hypertension. Peak expiratory flow monitoring active.",
    allergies: ["Aspirin & NSAIDs (Worsens bronchospasm - Samter's triad risk)"],
    primaryPhysician: "Dr. K. Malathi, MD (Pulmonology)",
    hospitalUnit: "Chest & Allergy Institute, Chennai",
    baseVitals: {
      hr: 84,
      sp: 94,
      bpSys: 118,
      bpDia: 76,
      glucose: 98,
      resp: 22,
      temp: 37.1,
      hrv: 42,
      a1c: 5.6
    },
    medications: [
      { name: "Budesonide / Formoterol", dosage: "160/4.5 mcg", freq: "Inhalation BID", rxNorm: "896200" },
      { name: "Levosalbutamol Inhaler", dosage: "50 mcg/puff", freq: "2 puffs SOS as rescue", rxNorm: "630208" },
      { name: "Montelukast Sodium", dosage: "10 mg", freq: "Once daily at bedtime", rxNorm: "198030" }
    ],
    noteSentences: [
      { text: "Patient presented for scheduled pulmonary assessment following frequent night-time coughing episodes and bilateral expiratory wheezing.", phi: ["pulmonary assessment"] },
      { text: "Metabolic panel demonstrates optimal glycemic homeostasis with HbA1c at 5.6 percent; no signs of metabolic syndrome.", phi: ["5.6 percent"] },
      { text: "Resting pulse oximetry recorded borderline arterial oxygen saturation at 94-95 percent during nocturnal sleep tracking.", phi: ["94-95 percent"] },
      { text: "Prescription updated to include maintenance inhaled corticosteroid with long-acting beta-agonist; rescue inhaler frequency reviewed.", phi: ["corticosteroid"] },
      { text: "Clinical review arranged in four weeks with instructions to maintain a continuous smart peak-flow and wearable SpO₂ diary.", phi: ["four weeks"] }
    ],
    nlpSummary: [
      { id: 0, text: "Nocturnal dry cough and bilateral wheezing indicating bronchial hyperresponsiveness", targetSentenceIndex: 0, tag: "Symptom" },
      { id: 1, text: "Metabolically healthy with normal HbA1c (5.6%); no diabetes risk", targetSentenceIndex: 1, tag: "Metabolic Status" },
      { id: 2, text: "Borderline SpO₂ (94-95%) observed during night-time wearable tracking", targetSentenceIndex: 2, tag: "Respiratory Finding" },
      { id: 3, text: "Commenced regular Budesonide/Formoterol maintenance inhaler", targetSentenceIndex: 3, tag: "Pharmacotherapy" },
      { id: 4, text: "1-month clinical follow-up with daily digital peak-flow monitoring", targetSentenceIndex: 4, tag: "Care Plan" }
    ],
    shapFeatures: [
      { name: "Borderline Oxygen Saturation (SpO₂ 94%)", impact: 12.1, direction: "risk", description: "Hypoxemic threshold triggers bronchial reflex and mild pulmonary vasoconstriction" },
      { name: "Elevated Respiratory Rate (22 bpm)", impact: 6.8, direction: "risk", description: "Tachypneic drive indicates compensatory ventilation effort" },
      { name: "Asthma History & Airway Reactivity", impact: 5.4, direction: "risk", description: "Underlying eosinophilic airway inflammation predisposes to acute spasms" },
      { name: "Heart Rate Elevation (84 bpm)", impact: 2.1, direction: "risk", description: "Sympathetic compensation due to work of breathing" },
      { name: "Normal HbA1c (5.6%)", impact: -7.5, direction: "protective", description: "Absence of diabetes eliminates microvascular respiratory capillary thickening" },
      { name: "Normal Systolic BP (118 mmHg)", impact: -5.2, direction: "protective", description: "Normotensive baseline indicates zero systemic cardiac strain" },
      { name: "Younger Demographics (Age 44)", impact: -4.8, direction: "protective", description: "Preserved cardiopulmonary reserve and elastic recoil" },
      { name: "Inhaled Corticosteroid Refill Complete", impact: -3.6, direction: "protective", description: "Anti-inflammatory adherence prevents airway remodeling" }
    ],
    fhirResources: [
      {
        resourceType: "Patient",
        id: "anitha-s-77319",
        identifier: [{ system: "https://healthid.ndhm.gov.in", value: "91-4412-9901-5582" }],
        name: [{ family: "S.", given: ["Anitha"] }],
        gender: "female",
        birthDate: "1982-08-21",
        telecom: [{ system: "phone", value: "+91 94440 98765" }]
      },
      {
        resourceType: "Observation",
        id: "obs-spo2-77319",
        status: "final",
        category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs" }] }],
        code: { coding: [{ system: "http://loinc.org", code: "2708-6", display: "Oxygen saturation in Arterial blood by Pulse oximetry" }] },
        subject: { reference: "Patient/anitha-s-77319" },
        effectiveDateTime: "2026-10-07T18:15:00+05:30",
        valueQuantity: { value: 94, unit: "%", system: "http://unitsofmeasure.org", code: "%" }
      }
    ],
    healthDetails: {
      biometrics: {
        heightCm: 160,
        weightKg: 58.0,
        bmi: 22.7,
        bmiStatus: "Normal Weight",
        bsa: 1.60,
        waistCircumferenceCm: 76
      },
      organHealth: [
        { organ: "Pulmonary System", status: "Moderate Obstruction", statusClass: "critical", note: "Bilateral expiratory wheezing, FEV1/FVC ratio 72% with nocturnal exacerbations" },
        { organ: "Immune / Atopy", status: "Sensitized", statusClass: "warning", note: "Elevated IgE (320 IU/mL) and peripheral eosinophilia" },
        { organ: "Endocrine & Glycemia", status: "Optimal", statusClass: "success", note: "HbA1c 5.6% · Fasting glucose 98 mg/dL" },
        { organ: "Cardiovascular System", status: "Normotensive", statusClass: "success", note: "BP 118/76 mmHg · Normal sinus rhythm" },
        { organ: "Renal Function", status: "Optimal", statusClass: "success", note: "Serum Creatinine 0.72 mg/dL · eGFR > 90 mL/min" }
      ],
      comprehensiveLabs: [
        { test: "Arterial Oxygen Saturation (SpO₂)", value: "94", unit: "%", refRange: "95 - 100%", status: "borderline", loinc: "2708-6" },
        { test: "Peak Expiratory Flow Rate (PEFR)", value: "280", unit: "L/min", refRange: "> 400 L/min", status: "low", loinc: "19935-6" },
        { test: "Absolute Eosinophil Count", value: "580", unit: "/µL", refRange: "40 - 450 /µL", status: "high", loinc: "711-2" },
        { test: "Serum Total IgE", value: "320", unit: "IU/mL", refRange: "< 100 IU/mL", status: "high", loinc: "19113-0" },
        { test: "Glycated Hemoglobin (HbA1c)", value: "5.6", unit: "%", refRange: "< 5.7%", status: "normal", loinc: "4548-4" },
        { test: "Hemoglobin", value: "13.2", unit: "g/dL", refRange: "12.0 - 15.5 g/dL", status: "normal", loinc: "718-7" },
        { test: "Serum Creatinine", value: "0.72", unit: "mg/dL", refRange: "0.6 - 1.1 mg/dL", status: "normal", loinc: "2160-0" },
        { test: "Total White Blood Cell Count", value: "7,800", unit: "/µL", refRange: "4,500 - 11,000 /µL", status: "normal", loinc: "6690-2" }
      ],
      lifestyle: {
        diet: "Balanced home-cooked anti-inflammatory diet",
        physicalActivity: "Moderate (4,800 steps/day; limited by exertional wheezing)",
        smokingStatus: "Never Smoker (Zero second-hand exposure)",
        alcoholIntake: "Non-drinker",
        sleepAverage: "5.8 hours/night (Interrupted by nocturnal coughing)"
      },
      familyHistory: [
        "Mother: Bronchial asthma with seasonal allergic eczema",
        "Maternal Aunt: Allergic rhinitis and nasal polyposis",
        "No family history of coronary artery disease or diabetes"
      ]
    },
    prescription: {
      rxNumber: "RX-2026-77319",
      dateIssued: "05 Oct 2026",
      validUntil: "05 Jan 2027",
      doctor: {
        name: "Dr. K. Malathi, MD (Pulmonology)",
        qualification: "MBBS, MD (Pulmonary Medicine), FCCP",
        registrationNo: "MCI / TNMC Reg: 52104 / 2008",
        clinicHospital: "Institute of Thoracic & Allergy Care",
        hospitalUnit: "Chest & Allergy Institute / Panimalar Health Hub, Chennai",
        phone: "+91 44 2615 4488",
        email: "drmalathi@panimalarhealth.org",
        digitalSignature: "Verified Cryptographically (PKI-SHA256 Signed)"
      },
      diagnosis: "Moderate Persistent Bronchial Asthma (J45.40) · Seasonal Allergic Rhinitis (J30.2)",
      medications: [
        {
          name: "Budesonide / Formoterol Fumarate",
          brand: "Symbicort / Foracort",
          dosage: "160 / 4.5 mcg",
          form: "Dry Powder Inhaler (Turbuhaler)",
          schedule: "2 - 0 - 2",
          scheduleText: "Two inhalations twice daily (Morning & Bedtime)",
          duration: "30 Days",
          quantity: "1 Inhaler (120 Doses)",
          refillsRemaining: 3,
          instructions: "Rinse mouth thoroughly with water after inhalation to prevent oral candidiasis. Do not swallow rinse water.",
          dispenseStatus: "Dispensed (MedPlus Pharmacy, 02 Oct 2026)",
          rxNorm: "896200",
          snomed: "426649008"
        },
        {
          name: "Levosalbutamol Inhaler",
          brand: "Levolin MDI",
          dosage: "50 mcg / puff",
          form: "Metered Dose Inhaler",
          schedule: "SOS",
          scheduleText: "2 puffs as needed for acute shortness of breath or wheeze",
          duration: "As Needed (PRN)",
          quantity: "1 Inhaler (200 Puffs)",
          refillsRemaining: 2,
          instructions: "Keep easily accessible at all times. If requiring > 4 puffs/day, contact clinic immediately.",
          dispenseStatus: "Dispensed (MedPlus Pharmacy, 02 Oct 2026)",
          rxNorm: "630208",
          snomed: "324689003"
        },
        {
          name: "Montelukast Sodium",
          brand: "Singulair / Montair",
          dosage: "10 mg",
          form: "Film-Coated Tablet",
          schedule: "0 - 0 - 1",
          scheduleText: "Once daily at bedtime",
          duration: "30 Days",
          quantity: "30 Tablets",
          refillsRemaining: 3,
          instructions: "Leukotriene receptor antagonist. Take consistently in the evening.",
          dispenseStatus: "Dispensed (MedPlus Pharmacy, 02 Oct 2026)",
          rxNorm: "198030",
          snomed: "318285002"
        }
      ],
      dietaryAndLifestyleOrders: [
        "Avoid cold items, iced drinks, exposure to sudden temperature shifts and damp environments.",
        "Encase pillows and mattress in allergen-impermeable dust-mite covers.",
        "Daily morning and evening digital peak expiratory flow (PEF) diary logging.",
        "Mild breathing exercises (Pranayama) 15 minutes daily during daytime."
      ],
      drugAllergyAlert: "⚠️ CRITICAL ALLERGY: Samter's Triad Warning - Aspirin and all NSAIDs (Ibuprofen, Diclofenac) strictly prohibited.",
      followUp: "Pulmonology Outpatient Re-evaluation in 4 Weeks with IoT Peak-Flow Diary."
    }
  },
  {
    id: "PT-103",
    uniqueId: "610453184",
    uniqueIdFormatted: "610-453-184",
    mrn: "IH360-61045",
    abhaId: "91-6209-3184-7729",
    name: "Meena R.",
    age: 67,
    gender: "Female",
    bloodGroup: "A+",
    avatar: "👵🏽",
    statusBadge: "Cardiovascular Telemetry",
    conditionSummary: "Stable CAD · Post-PCI LAD Stent (2023) · Mixed Dyslipidemia · Pre-Diabetes",
    history: "Drug-eluting stent placed in Left Anterior Descending artery in 2023. Stable angina free. Strict lipid-lowering and dual antiplatelet regimen transitioning to monotherapy.",
    allergies: ["Sulfonamide Antibiotics"],
    primaryPhysician: "Dr. R. Ramanathan, MD, FACC (Interventional Cardiology)",
    hospitalUnit: "Cardiology Center of Excellence, Chennai",
    baseVitals: {
      hr: 72,
      sp: 96,
      bpSys: 130,
      bpDia: 82,
      glucose: 124,
      resp: 16,
      temp: 36.6,
      hrv: 34,
      a1c: 6.4
    },
    medications: [
      { name: "Atorvastatin Calcium", dosage: "40 mg", freq: "Once daily at night", rxNorm: "259255" },
      { name: "Clopidogrel Bisulfate", dosage: "75 mg", freq: "Once daily morning", rxNorm: "309362" },
      { name: "Metoprolol Tartrate", dosage: "25 mg", freq: "Twice daily", rxNorm: "866414" },
      { name: "Ramipril", dosage: "2.5 mg", freq: "Once daily morning", rxNorm: "197585" }
    ],
    noteSentences: [
      { text: "Routine outpatient cardiology review for 67-year-old female with stable coronary artery disease following 2023 drug-eluting stent implantation.", phi: ["67-year-old", "2023"] },
      { text: "Laboratory assessment reveals pre-diabetic glycemic range with HbA1c measuring 6.4 percent, with total cholesterol down to 142 mg/dL on high-intensity statin.", phi: ["6.4 percent", "142 mg/dL"] },
      { text: "Office blood pressure controlled at 130/82 mmHg on beta-blocker and ACE-inhibitor combination therapy.", phi: ["130/82 mmHg"] },
      { text: "Electronic pharmacy records confirm 100 percent 90-day refill adherence for Clopidogrel, Atorvastatin, and Metoprolol.", phi: ["Clopidogrel", "Atorvastatin"] },
      { text: "Advised continuation of daily 30-minute moderate walking and continuous wearable monitoring for heart rate variability and nocturnal arrhythmia detection.", phi: ["30-minute"] }
    ],
    nlpSummary: [
      { id: 0, text: "Stable post-PCI coronary disease status with no reported chest pain or angina", targetSentenceIndex: 0, tag: "Cardiovascular Status" },
      { id: 1, text: "Pre-diabetic HbA1c (6.4%); lipid profile successfully optimized on statin", targetSentenceIndex: 1, tag: "Endocrine & Lipid Panel" },
      { id: 2, text: "Hemodynamics well managed at 130/82 mmHg under dual cardioprotective regimen", targetSentenceIndex: 2, tag: "Hemodynamics" },
      { id: 3, text: "Pharmacy adherence verified at 100% across all vital cardiac prescriptions", targetSentenceIndex: 3, tag: "Medication Adherence" },
      { id: 4, text: "Recommended wearable HRV & arrhythmia tracking with lifestyle walking regimen", targetSentenceIndex: 4, tag: "Remote Monitoring" }
    ],
    shapFeatures: [
      { name: "Documented Coronary Artery Disease & Stent", impact: 13.5, direction: "risk", description: "Prior PCI history elevates lifetime ischemic and restenosis susceptibility" },
      { name: "Age Factor (67 years)", impact: 8.4, direction: "risk", description: "Postmenopausal cardiovascular risk curve steepens above age 65" },
      { name: "Pre-diabetic Glycemia (HbA1c 6.4%)", impact: 4.8, direction: "risk", description: "Impaired fasting glucose contributes to microvascular stiffness" },
      { name: "Systolic Pressure Margin (130 mmHg)", impact: 3.2, direction: "risk", description: "Borderline elevation above strict ACC/AHA target of <120 mmHg for CAD patients" },
      { name: "High-intensity Statin Therapy Adherence", impact: -8.9, direction: "protective", description: "Achieved LDL target stabilizes coronary fibrous cap and halts plaque buildup" },
      { name: "Beta-blockade Rate Optimization (72 bpm)", impact: -6.1, direction: "protective", description: "Controlled myocardial oxygen consumption prevents exertional ischemia" },
      { name: "Adequate Oxygen Saturation (96%)", impact: -3.4, direction: "protective", description: "Normal alveolar diffusion preserves myocardial oxygen gradient" },
      { name: "Antiplatelet Monotherapy Verified", impact: -5.2, direction: "protective", description: "Guards against late stent thrombosis with verified dispense logs" }
    ],
    fhirResources: [
      {
        resourceType: "Patient",
        id: "meena-r-61045",
        identifier: [{ system: "https://healthid.ndhm.gov.in", value: "91-6209-3184-7729" }],
        name: [{ family: "R.", given: ["Meena"] }],
        gender: "female",
        birthDate: "1959-11-04"
      },
      {
        resourceType: "Condition",
        id: "cond-cad-61045",
        clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }] },
        code: { coding: [{ system: "http://snomed.info/sct", code: "53741008", display: "Coronary arteriosclerosis" }] },
        subject: { reference: "Patient/meena-r-61045" }
      }
    ],
    healthDetails: {
      biometrics: {
        heightCm: 155,
        weightKg: 66.0,
        bmi: 27.5,
        bmiStatus: "Overweight",
        bsa: 1.65,
        waistCircumferenceCm: 88
      },
      organHealth: [
        { organ: "Cardiovascular System", status: "Post-PCI Stable", statusClass: "warning", note: "Drug-eluting LAD stent patent (2023). Ejection fraction 52%, no exertional angina" },
        { organ: "Lipid Metabolism", status: "Statin-Optimized", statusClass: "success", note: "LDL-C successfully lowered to 68 mg/dL on high-intensity Atorvastatin 40mg" },
        { organ: "Endocrine & Glycemia", status: "Pre-Diabetes", statusClass: "warning", note: "HbA1c 6.4% · Impaired fasting glucose (124 mg/dL)" },
        { organ: "Renal Function", status: "Preserved", statusClass: "success", note: "Serum Creatinine 0.98 mg/dL · eGFR 68 mL/min/1.73m² (age-appropriate)" },
        { organ: "Hepatic / Liver", status: "Normal", statusClass: "success", note: "ALT 26 U/L, AST 24 U/L; excellent statin hepatic tolerability" }
      ],
      comprehensiveLabs: [
        { test: "High Sensitivity C-Reactive Protein (hs-CRP)", value: "2.1", unit: "mg/L", refRange: "< 1.0 mg/L", status: "borderline", loinc: "30522-7" },
        { test: "Low-Density Lipoprotein (LDL-C)", value: "68", unit: "mg/dL", refRange: "< 70 mg/dL (CAD Target)", status: "normal", loinc: "13457-7" },
        { test: "Total Cholesterol", value: "142", unit: "mg/dL", refRange: "< 200 mg/dL", status: "normal", loinc: "2093-3" },
        { test: "High-Density Lipoprotein (HDL-C)", value: "44", unit: "mg/dL", refRange: "> 45 mg/dL", status: "borderline", loinc: "2085-9" },
        { test: "Serum Triglycerides", value: "150", unit: "mg/dL", refRange: "< 150 mg/dL", status: "normal", loinc: "2571-8" },
        { test: "Glycated Hemoglobin (HbA1c)", value: "6.4", unit: "%", refRange: "< 5.7%", status: "borderline", loinc: "4548-4" },
        { test: "Fasting Blood Glucose", value: "124", unit: "mg/dL", refRange: "70 - 99 mg/dL", status: "borderline", loinc: "2339-0" },
        { test: "Serum Creatinine", value: "0.98", unit: "mg/dL", refRange: "0.6 - 1.1 mg/dL", status: "normal", loinc: "2160-0" },
        { test: "Serum Potassium", value: "4.3", unit: "mEq/L", refRange: "3.5 - 5.1 mEq/L", status: "normal", loinc: "2823-3" }
      ],
      lifestyle: {
        diet: "Heart-healthy DASH & Mediterranean diet, low saturated fat",
        physicalActivity: "Regular mild-to-moderate (5,500 steps/day brisk walking)",
        smokingStatus: "Never Smoker",
        alcoholIntake: "Non-drinker",
        sleepAverage: "6.8 hours/night (Restful sleep)"
      },
      familyHistory: [
        "Elder Sister: Coronary bypass surgery (CABG) at age 64",
        "Father: Cerebrovascular stroke at age 70",
        "Mother: Essential hypertension and mild osteoarthritis"
      ]
    },
    prescription: {
      rxNumber: "RX-2026-61045",
      dateIssued: "03 Oct 2026",
      validUntil: "03 Jan 2027",
      doctor: {
        name: "Dr. R. Ramanathan, MD, DM, FACC",
        qualification: "MBBS, MD, DM (Cardiology), FSCAI",
        registrationNo: "MCI / TNMC Reg: 41920 / 1999",
        clinicHospital: "Cardiology Center of Excellence & Interventional Cath Lab",
        hospitalUnit: "Cardiology Center of Excellence / Panimalar Health Hub, Chennai",
        phone: "+91 44 2829 4400",
        email: "drramanathan@panimalarhealth.org",
        digitalSignature: "Verified Cryptographically (PKI-SHA256 Signed)"
      },
      diagnosis: "Chronic Ischemic Heart Disease (I25.2) · Status Post-PCI LAD Drug-Eluting Stent (Z95.5) · Mixed Dyslipidemia (E78.2)",
      medications: [
        {
          name: "Atorvastatin Calcium",
          brand: "Lipitor / Atorva",
          dosage: "40 mg",
          form: "Film-Coated Tablet",
          schedule: "0 - 0 - 1",
          scheduleText: "Once daily at bedtime",
          duration: "90 Days",
          quantity: "90 Tablets",
          refillsRemaining: 2,
          instructions: "High-intensity lipid stabilization. Continue without interruption to preserve stent patency.",
          dispenseStatus: "Dispensed (Apollo Pharmacy, 01 Oct 2026)",
          rxNorm: "259255",
          snomed: "386884004"
        },
        {
          name: "Clopidogrel Bisulfate",
          brand: "Plavix / Deplatt",
          dosage: "75 mg",
          form: "Oral Tablet",
          schedule: "1 - 0 - 0",
          scheduleText: "Once daily in the morning with water",
          duration: "90 Days",
          quantity: "90 Tablets",
          refillsRemaining: 2,
          instructions: "Antiplatelet therapy for late stent thrombosis prevention. Do not skip doses.",
          dispenseStatus: "Dispensed (Apollo Pharmacy, 01 Oct 2026)",
          rxNorm: "309362",
          snomed: "387584000"
        },
        {
          name: "Metoprolol Tartrate",
          brand: "Lopressor / Betaloc",
          dosage: "25 mg",
          form: "Oral Tablet",
          schedule: "1 - 0 - 1",
          scheduleText: "Twice daily with meals (Morning & Night)",
          duration: "90 Days",
          quantity: "180 Tablets",
          refillsRemaining: 2,
          instructions: "Beta-1 selective cardioselective rate control. Target resting heart rate 65-75 bpm.",
          dispenseStatus: "Dispensed (Apollo Pharmacy, 01 Oct 2026)",
          rxNorm: "866414",
          snomed: "372826007"
        },
        {
          name: "Ramipril",
          brand: "Altace / Cardace",
          dosage: "2.5 mg",
          form: "Oral Capsule",
          schedule: "1 - 0 - 0",
          scheduleText: "Once daily morning after breakfast",
          duration: "90 Days",
          quantity: "90 Tablets",
          refillsRemaining: 2,
          instructions: "Cardioprotective ACE-inhibitor for myocardial remodeling prevention. Monitor serum creatinine & potassium.",
          dispenseStatus: "Dispensed (Apollo Pharmacy, 01 Oct 2026)",
          rxNorm: "197585",
          snomed: "386868003"
        }
      ],
      dietaryAndLifestyleOrders: [
        "Cardioprotective DASH diet: strictly avoid trans-fats, deep-fried foods, and high-sugar desserts.",
        "Daily 30 minutes continuous brisk walking on flat terrain; avoid heavy isometric lifting.",
        "Maintain continuous smartwatch heart rate variability and nocturnal arrhythmia tracking.",
        "Report any new substernal pressure, jaw discomfort, or unusual shortness of breath immediately."
      ],
      drugAllergyAlert: "⚠️ ALLERGY ALERT: Hypersensitivity to Sulfonamide Antibiotics (Septra/Bactrim). Avoid all sulfa compounds.",
      followUp: "Routine Outpatient Cardiology Review in 3 Months with Repeat Fasting Lipid Profile & ECG."
    }
  }
];

const WORKFLOW_STAGES = [
  {
    step: 1,
    name: "Data Acquisition",
    short: "Acquisition",
    icon: "📡",
    source: "Hospitals, Labs, Pharmacies & Wearables",
    description: "Multi-modal streaming ingestion of EHR encounters, laboratory LIS observations, retail pharmacy dispenses, and IoT continuous wearables."
  },
  {
    step: 2,
    name: "FHIR Normalization",
    short: "Normalization",
    icon: "🔄",
    source: "HL7 FHIR R4 Transformer",
    description: "Synthesizing disparate vendor schemas (HL7 v2, CDA, proprietary CSV/JSON) into standardized FHIR R4 resource definitions."
  },
  {
    step: 3,
    name: "Profile Consolidation",
    short: "Consolidation",
    icon: "🧬",
    source: "Hybrid PostgreSQL + MongoDB",
    description: "Merging patient records into one deduplicated, longitudinal Unified Digital Health Profile with cryptographic audit logging."
  },
  {
    step: 4,
    name: "AI Processing",
    short: "AI Inference",
    icon: "🧠",
    source: "XGBoost / Random Forest & BioBERT",
    description: "Parallel execution: Supervised tree-based 30-day clinical risk modeling alongside BioBERT/Flan-T5 clinical note summarization."
  },
  {
    step: 5,
    name: "Explainability Layer",
    short: "Explainability",
    icon: "🔍",
    source: "TreeSHAP & Source Attribution",
    description: "Calculating exact Shapley feature-attribution vectors and highlighting NLP source text spans to prevent AI 'black box' distrust."
  },
  {
    step: 6,
    name: "Clinical Delivery",
    short: "Delivery",
    icon: "📱",
    source: "Clinician Console & Automated Alerts",
    description: "Real-time dispatch to the responsive clinician dashboard, SMART on FHIR endpoints, and prioritized patient notification alerts."
  }
];

const COMPARISON_TABLE = [
  {
    aspect: "Data Architecture",
    traditional: "Fragmented across isolated hospital silos, incompatible formats",
    intelliHealth: "Unified HL7 FHIR R4 digital health profile across all care nodes",
    advantage: "100% Interoperable"
  },
  {
    aspect: "Clinical Approach",
    traditional: "Reactive care delivered only after acute symptoms manifest",
    intelliHealth: "Predictive & preventive care via continuous machine learning risk scoring",
    advantage: "Early Risk Detection"
  },
  {
    aspect: "Report Review",
    traditional: "Manual reading of lengthy, jargon-dense discharge summaries (15-20 min/pt)",
    intelliHealth: "Automated BioBERT / Flan-T5 clinical summaries with bidirectional citation",
    advantage: "68% Time Saved"
  },
  {
    aspect: "Model Trust & Auditing",
    traditional: "N/A or Black-Box scoring (doctors cannot audit why risk is high)",
    intelliHealth: "Explainable AI (TreeSHAP) with exact positive/negative biomarker attribution",
    advantage: "100% Transparent"
  },
  {
    aspect: "Data Interoperability",
    traditional: "Vendor-locked proprietary formats (Cerner, Epic, local clinic CSVs)",
    intelliHealth: "Open HL7 FHIR standard + ABDM (Ayushman Bharat Digital Mission) compliance",
    advantage: "Zero Vendor Lock-in"
  },
  {
    aspect: "Emergency Alerts",
    traditional: "Manual follow-up, periodic phone calls, or missed abnormal lab slips",
    intelliHealth: "Automated continuous algorithmic alerts driven by live wearable & lab feeds",
    advantage: "Real-time Dispatch"
  },
  {
    aspect: "Patient Privacy & Compliance",
    traditional: "Vulnerable unencrypted storage, vague patient consent tracking",
    intelliHealth: "Role-Based Access Control, TLS 1.3, AES-256, DPDP Act 2023 & HIPAA aligned",
    advantage: "End-to-End Encrypted"
  }
];

const SYSTEM_MODULES = [
  { id: "A", name: "User Authentication & RBAC", desc: "Role-based access control protecting patient and doctor portals with MFA & OAuth2/SAML single sign-on." },
  { id: "B", name: "Health Data Integration", desc: "Multi-source ingest pipeline mapping hospital, lab, pharmacy, and wearable telemetry into standard FHIR resources." },
  { id: "C", name: "Unified Digital Health Profile", desc: "Consolidated longitudinal clinical dossier offering healthcare providers a single 360-degree source of truth." },
  { id: "D", name: "AI Risk Prediction Engine", desc: "Supervised Random Forest / Gradient-Boosted Trees (XGBoost) predicting 30-day cardiometabolic and readmission risks." },
  { id: "E", name: "Medical Report Analysis (NLP)", desc: "Fine-tuned transformer models (BioBERT / ClinicalBERT / Flan-T5) summarizing unstructured clinical notes and letters." },
  { id: "F", name: "AI Insights Dashboard (XAI)", desc: "Clinician-facing visual console featuring interactive SHAP waterfall diagrams and transparent evidence trails." },
  { id: "G", name: "Alerts & Notifications", desc: "Automated trigger system generating real-time prioritized warnings for drug clashes, glycemic spikes, and arrhythmia." }
];

const AUDIT_LOG_INITIAL = [
  { id: "LOG-9041", timestamp: "18:28:44", user: "Dr. A. Sundaram (Cardiologist)", action: "VIEW_FHIR_PROFILE", resource: "Patient/ravi-k-98421", ip: "192.168.1.104", status: "AUTHORIZED" },
  { id: "LOG-9042", timestamp: "18:29:12", user: "BioBERT_NLP_Worker_01", action: "INFER_CLINICAL_SUMMARY", resource: "DiagnosticReport/cmp-98421", ip: "10.0.4.12", status: "COMPLETED" },
  { id: "LOG-9043", timestamp: "18:29:40", user: "TreeSHAP_XAI_Worker", action: "COMPUTE_ATTRIBUTION", resource: "RiskModel/30day-cardio", ip: "10.0.4.15", status: "COMPLETED" },
  { id: "LOG-9044", timestamp: "18:30:02", user: "IoT_Wearable_Daemon", action: "INGEST_TELEMETRY_STREAM", resource: "Observation/vitals-stream", ip: "172.16.8.22", status: "STREAMING" }
];

export const SYSTEM_USERS = [
  {
    uniqueId: "984210412",
    uniqueIdFormatted: "984-210-412",
    name: "Ravi K.",
    role: "patient",
    roleLabel: "Verified Patient (Cardiometabolic)",
    patientIndex: 0,
    avatar: "👨🏽",
    pin: "1234",
    email: "ravi.k@example.com",
    phone: "+91 98401 23456",
    abhaNumber: "91-8834-1029-4412",
    description: "Type 2 Diabetes & Hypertension · Live Telemetry Ingest"
  },
  {
    uniqueId: "773194558",
    uniqueIdFormatted: "773-194-558",
    name: "Anitha S.",
    role: "patient",
    roleLabel: "Verified Patient (Pulmonary)",
    patientIndex: 1,
    avatar: "👩🏽",
    pin: "1234",
    email: "anitha.s@example.com",
    phone: "+91 94440 98765",
    abhaNumber: "91-4412-9901-5582",
    description: "Moderate Persistent Asthma · SpO₂ Telemetry"
  },
  {
    uniqueId: "610453184",
    uniqueIdFormatted: "610-453-184",
    name: "Meena R.",
    role: "patient",
    roleLabel: "Verified Patient (Cardiac Post-PCI)",
    patientIndex: 2,
    avatar: "👵🏽",
    pin: "1234",
    email: "meena.r@example.com",
    phone: "+91 98840 54321",
    abhaNumber: "91-6209-3184-7729",
    description: "Post-PCI LAD Stent (2023) · Dyslipidemia"
  },
  {
    uniqueId: "104982360",
    uniqueIdFormatted: "104-982-360",
    name: "Dr. A. Sundaram, MD, DM",
    role: "doctor",
    roleLabel: "Attending Cardiologist",
    patientIndex: 0,
    avatar: "👨‍⚕️",
    pin: "1234",
    email: "drsundaram@panimalarhealth.org",
    phone: "+91 98400 11223",
    hospitalUnit: "Cardiology Dept · Panimalar Health Hub",
    description: "Lead Interventional Cardiologist · Clinical AI Triage"
  },
  {
    uniqueId: "452881903",
    uniqueIdFormatted: "452-881-903",
    name: "Nurse Staff (Station 3B)",
    role: "nurse",
    roleLabel: "Telemetry Inpatient Nurse",
    patientIndex: 0,
    avatar: "👩‍⚕️",
    pin: "1234",
    email: "nursing.station3b@panimalarhealth.org",
    phone: "+91 98400 99887",
    hospitalUnit: "ICU Telemetry Ward",
    description: "Inpatient Vitals Telemetry & Rapid Response Protocol"
  },
  {
    uniqueId: "999001360",
    uniqueIdFormatted: "999-001-360",
    name: "Chief Medical & Audit Officer",
    role: "admin",
    roleLabel: "DPDP / ABDM Compliance Officer",
    patientIndex: 0,
    avatar: "🛡️",
    pin: "1234",
    email: "cmo.audit@panimalarhealth.org",
    phone: "+91 98400 55443",
    hospitalUnit: "Institutional Data Governance",
    description: "Section VIII Data Security & Audit Logs Officer"
  }
];

// Attach to window for standard script inclusion without module CORS restrictions
if (typeof window !== 'undefined') {
  window.IH360_DATA = {
    RESEARCH_METADATA,
    PATIENTS_DATABASE,
    SYSTEM_USERS,
    WORKFLOW_STAGES,
    COMPARISON_TABLE,
    SYSTEM_MODULES,
    AUDIT_LOG_INITIAL
  };
}

