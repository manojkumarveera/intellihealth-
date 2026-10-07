/**
 * IntelliHealth 360 - Interactive Core Application
 * Panimalar Engineering College · AI-Powered Unified Digital Health Records
 */

const {
  PATIENTS_DATABASE,
  RESEARCH_METADATA,
  WORKFLOW_STAGES,
  COMPARISON_TABLE,
  SYSTEM_MODULES,
  AUDIT_LOG_INITIAL
} = (typeof window !== 'undefined' && window.IH360_DATA) ? window.IH360_DATA : {};

class IntelliHealthApp {
  constructor() {
    this.patients = PATIENTS_DATABASE;
    this.currentPatientIndex = 0;
    this.currentRole = 'doctor'; // doctor, nurse, patient, admin
    this.audioEnabled = false;
    this.audioCtx = null;
    this.maskPHI = true;
    
    // Live vitals state
    this.liveVitals = {};
    this.timelineFilter = 'all';
    this.activeSentenceIndex = null;
    this.alertsQueue = [];
    this.auditLogs = [...AUDIT_LOG_INITIAL];
    
    // ECG Simulation parameters
    this.ecgPhase = 0;
    this.ecgBuffer = [];
    this.ecgCanvas = null;
    this.ecgCtx = null;
    this.ecgWidth = 800;
    this.ecgHeight = 160;
    this.lastBeatTime = 0;
    this.isCrisisMode = false;

    // Cache elements
    this.dom = {};
  }

  init() {
    this.cacheDomElements();
    this.initTheme();
    this.initECG();
    this.loadPatient(0);
    this.checkAuthSession();
    this.bindEvents();
    this.renderPipelineStepper();
    this.renderComparisonTable();
    this.renderSystemModules();
    this.renderAuthors();
    this.renderAuditLogs();
    
    // Start real-time engine
    this.startVitalsLoop();
    this.startECGLoop();
    this.startPeriodicTelemetryIngest();
  }

  cacheDomElements() {
    this.dom = {
      themeToggle: document.getElementById('theme-toggle'),
      roleSelect: document.getElementById('role-select'),
      audioToggle: document.getElementById('audio-toggle'),
      audioIcon: document.getElementById('audio-icon'),
      patientTabs: document.getElementById('patient-tabs'),
      
      // Patient Dossier
      patientAvatar: document.getElementById('patient-avatar'),
      patientName: document.getElementById('patient-name'),
      patientUniqueId: document.getElementById('patient-unique-id'),
      patientMrn: document.getElementById('patient-mrn'),
      patientAbha: document.getElementById('patient-abha'),
      patientAgeGender: document.getElementById('patient-age-gender'),
      patientBlood: document.getElementById('patient-blood'),
      patientAllergies: document.getElementById('patient-allergies'),
      patientCondition: document.getElementById('patient-condition'),
      patientPhysician: document.getElementById('patient-physician'),
      
      // Vitals tiles
      valHr: document.getElementById('val-hr'),
      tileHr: document.getElementById('tile-hr'),
      valSp: document.getElementById('val-sp'),
      tileSp: document.getElementById('tile-sp'),
      valBp: document.getElementById('val-bp'),
      tileBp: document.getElementById('tile-bp'),
      valGl: document.getElementById('val-gl'),
      tileGl: document.getElementById('tile-gl'),
      valResp: document.getElementById('val-resp'),
      valTemp: document.getElementById('val-temp'),
      
      // ECG
      canvas: document.getElementById('ecg-canvas'),
      ecgBpmDisplay: document.getElementById('ecg-bpm-display'),
      pulseLed: document.getElementById('pulse-led'),
      
      // Simulation buttons
      btnCrisis: document.getElementById('btn-crisis'),
      btnNormalize: document.getElementById('btn-normalize'),
      btnHypoxia: document.getElementById('btn-hypoxia'),
      btnHyperglycemia: document.getElementById('btn-hyperglycemia'),
      
      // Timeline & FHIR
      timelineList: document.getElementById('timeline-list'),
      timelineFilters: document.getElementById('timeline-filters'),
      
      // AI Risk & SHAP
      riskScoreNum: document.getElementById('risk-score-num'),
      riskScoreCircle: document.getElementById('risk-score-circle'),
      riskScoreCategory: document.getElementById('risk-score-category'),
      riskScoreDesc: document.getElementById('risk-score-desc'),
      shapRowsContainer: document.getElementById('shap-rows-container'),
      
      // NLP
      nlpSummaryList: document.getElementById('nlp-summary-list'),
      nlpNoteContent: document.getElementById('nlp-note-content'),
      togglePhiBtn: document.getElementById('toggle-phi-btn'),
      
      // Alerts
      alertStream: document.getElementById('alert-stream'),
      
      // Dynamic rendering containers
      pipelineContainer: document.getElementById('pipeline-container'),
      pipelineDetail: document.getElementById('pipeline-detail'),
      comparisonTbody: document.getElementById('comparison-tbody'),
      modulesContainer: document.getElementById('modules-container'),
      authorsContainer: document.getElementById('authors-container'),
      auditTableBody: document.getElementById('audit-tbody'),
      
      // Modal
      fhirModal: document.getElementById('fhir-modal'),
      modalTitle: document.getElementById('modal-title'),
      modalJsonContent: document.getElementById('modal-json-content'),
      closeModalBtn: document.getElementById('close-modal-btn'),
      copyJsonBtn: document.getElementById('copy-json-btn'),
      
      // Prescription Modal & Buttons
      prescribeModal: document.getElementById('prescribe-modal'),
      closePrescribeModalBtn: document.getElementById('close-prescribe-modal-btn'),
      btnSubmitNewMed: document.getElementById('btn-submit-new-med'),
      btnPrintRx: document.getElementById('btn-print-rx'),
      btnOpenPrescribeModal: document.getElementById('btn-open-prescribe-modal'),
      btnCheckDdi: document.getElementById('btn-check-ddi'),

      toastContainer: document.getElementById('toast-container')
    };
  }

  initTheme() {
    const savedTheme = localStorage.getItem('ih360_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ih360_theme', next);
    this.showToast(`Switched to ${next} theme mode`, 'info');
  }

  initECG() {
    this.ecgCanvas = this.dom.canvas;
    if (!this.ecgCanvas) return;
    this.ecgCtx = this.ecgCanvas.getContext('2d');
    
    // Scale for crisp rendering
    const rect = this.ecgCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.ecgWidth = rect.width || 760;
    this.ecgHeight = 160;
    
    this.ecgCanvas.width = this.ecgWidth * dpr;
    this.ecgCanvas.height = this.ecgHeight * dpr;
    this.ecgCtx.scale(dpr, dpr);
    
    // Pre-fill buffer
    this.ecgBuffer = new Array(Math.floor(this.ecgWidth)).fill(this.ecgHeight / 2);
  }

  checkAuthSession() {
    try {
      const stored = localStorage.getItem('ih360_auth_user');
      const container = document.getElementById('nav-auth-container');
      if (stored && container) {
        const user = JSON.parse(stored);
        this.currentRole = user.role || 'doctor';
        if (this.dom.roleSelect) {
          this.dom.roleSelect.value = this.currentRole;
        }
        if (typeof user.patientIndex === 'number' && this.patients[user.patientIndex]) {
          this.currentPatientIndex = user.patientIndex;
          this.loadPatient(user.patientIndex);
        }

        container.innerHTML = `
          <div class="auth-user-nav-badge" title="Authenticated 9-Digit Unique ID Session">
            <span>🛡️</span>
            <span style="font-weight:700;">${user.name}</span>
            <span class="id-chip">${user.uniqueIdFormatted || user.uniqueId}</span>
            <button id="nav-btn-logout" class="auth-logout-btn" title="Sign out / Switch ID">⏻ Sign Out</button>
          </div>
        `;

        const logoutBtn = document.getElementById('nav-btn-logout');
        if (logoutBtn) {
          logoutBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('ih360_auth_user');
            this.showToast('Signed out of 9-digit session', 'info');
            window.location.href = 'login.html';
          };
        }

        this.showToast(`Session Active: ${user.name} (${user.uniqueIdFormatted || user.uniqueId})`, 'success');
        this.logAuditAction('SESSION_AUTHENTICATED_WITH_UHID', `UHID/${user.uniqueId}`);
      }
    } catch (e) {
      console.warn('Session verification failed', e);
    }
  }

  loadPatient(index) {
    this.currentPatientIndex = index;
    const patient = this.patients[index];
    if (!patient) return;

    // Reset baseline live vitals
    this.liveVitals = { ...patient.baseVitals };
    this.isCrisisMode = false;
    this.activeSentenceIndex = null;

    // Render dossier
    this.renderPatientDossier(patient);
    this.renderPatientTabs();
    this.renderTimeline(patient);
    this.renderNLP(patient);
    this.renderHealthDetails(patient);
    this.renderPrescription(patient);
    this.updateVitalsDisplay();
    this.calculateAndRenderRisk();

    this.showToast(`Switched active profile to ${patient.name} (${patient.mrn})`, 'info');
    this.logAuditAction('PATIENT_PROFILE_LOADED', `Patient/${patient.id}`);
  }

  renderPatientTabs() {
    if (!this.dom.patientTabs) return;
    this.dom.patientTabs.innerHTML = this.patients.map((p, idx) => `
      <button class="patient-tab-btn ${idx === this.currentPatientIndex ? 'active' : ''}" data-idx="${idx}">
        <span class="patient-tab-avatar">${p.avatar}</span>
        <span>${p.name} <small style="font-family:var(--font-mono); opacity:0.8;">[${p.uniqueIdFormatted || p.uniqueId}]</small></span>
      </button>
    `).join('');

    this.dom.patientTabs.querySelectorAll('.patient-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.idx, 10);
        this.loadPatient(idx);
      });
    });
  }

  renderPatientDossier(p) {
    if (this.dom.patientAvatar) this.dom.patientAvatar.textContent = p.avatar;
    if (this.dom.patientName) this.dom.patientName.textContent = p.name;
    if (this.dom.patientUniqueId) this.dom.patientUniqueId.textContent = `9-Digit UHID: ${p.uniqueIdFormatted || p.uniqueId}`;
    if (this.dom.patientMrn) this.dom.patientMrn.textContent = `MRN: ${p.mrn}`;
    if (this.dom.patientAbha) this.dom.patientAbha.textContent = `ABHA: ${p.abhaId}`;
    if (this.dom.patientAgeGender) this.dom.patientAgeGender.textContent = `${p.age} Years · ${p.gender}`;
    if (this.dom.patientBlood) this.dom.patientBlood.textContent = `Blood: ${p.bloodGroup}`;
    if (this.dom.patientAllergies) this.dom.patientAllergies.textContent = `Allergies: ${p.allergies.join(', ')}`;
    if (this.dom.patientCondition) this.dom.patientCondition.textContent = p.conditionSummary;
    if (this.dom.patientPhysician) this.dom.patientPhysician.textContent = `${p.primaryPhysician} · ${p.hospitalUnit}`;
  }

  renderHealthDetails(patient) {
    const hd = patient.healthDetails;
    if (!hd) return;

    // 1. Biometrics
    const bioContainer = document.getElementById('biometrics-container');
    if (bioContainer && hd.biometrics) {
      const b = hd.biometrics;
      bioContainer.innerHTML = `
        <div class="biometric-chip">
          <span class="biometric-chip-label">Height</span>
          <span class="biometric-chip-val">${b.heightCm} <small style="font-size:12px;">cm</small></span>
          <span class="biometric-chip-sub">Standing</span>
        </div>
        <div class="biometric-chip">
          <span class="biometric-chip-label">Weight</span>
          <span class="biometric-chip-val">${b.weightKg} <small style="font-size:12px;">kg</small></span>
          <span class="biometric-chip-sub">Current Mass</span>
        </div>
        <div class="biometric-chip">
          <span class="biometric-chip-label">Body Mass Index</span>
          <span class="biometric-chip-val">${b.bmi}</span>
          <span class="biometric-chip-sub">${b.bmiStatus}</span>
        </div>
        <div class="biometric-chip">
          <span class="biometric-chip-label">Body Surface Area</span>
          <span class="biometric-chip-val">${b.bsa} <small style="font-size:12px;">m²</small></span>
          <span class="biometric-chip-sub">Mosteller</span>
        </div>
        <div class="biometric-chip">
          <span class="biometric-chip-label">Waist Circumference</span>
          <span class="biometric-chip-val">${b.waistCircumferenceCm} <small style="font-size:12px;">cm</small></span>
          <span class="biometric-chip-sub">Visceral Adiposity</span>
        </div>
      `;
    }

    // 2. Organ Health Grid
    const organContainer = document.getElementById('organ-health-container');
    if (organContainer && hd.organHealth) {
      organContainer.innerHTML = hd.organHealth.map(o => `
        <div class="organ-card">
          <div class="organ-card-head">
            <span class="organ-name">${o.organ}</span>
            <span class="organ-status-pill ${o.statusClass}">${o.status}</span>
          </div>
          <div class="organ-note">${o.note}</div>
        </div>
      `).join('');
    }

    // 3. Comprehensive Labs Table
    const labsTbody = document.getElementById('labs-table-tbody');
    if (labsTbody && hd.comprehensiveLabs) {
      labsTbody.innerHTML = hd.comprehensiveLabs.map(lab => `
        <tr>
          <td style="font-weight: 600; color: var(--text-main);">${lab.test}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: var(--brand-cyan);">${lab.value} <span style="font-size: 11px; color: var(--text-muted); font-weight: normal;">${lab.unit}</span></td>
          <td style="color: var(--text-secondary); font-size: 12px;">${lab.refRange}</td>
          <td><span class="lab-status-badge ${lab.status}">${lab.status.toUpperCase()}</span></td>
          <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${lab.loinc}</td>
        </tr>
      `).join('');
    }

    // 4. Lifestyle List
    const lifestyleList = document.getElementById('lifestyle-list');
    if (lifestyleList && hd.lifestyle) {
      const l = hd.lifestyle;
      lifestyleList.innerHTML = `
        <li><span>🥗</span> <strong>Dietary Pattern:</strong> ${l.diet}</li>
        <li><span>👟</span> <strong>Physical Activity:</strong> ${l.physicalActivity}</li>
        <li><span>🚭</span> <strong>Smoking History:</strong> ${l.smokingStatus}</li>
        <li><span>🍷</span> <strong>Alcohol Usage:</strong> ${l.alcoholIntake}</li>
        <li><span>🌙</span> <strong>Nocturnal Sleep:</strong> ${l.sleepAverage}</li>
      `;
    }

    // 5. Family Medical History List
    const familyList = document.getElementById('family-history-list');
    if (familyList && hd.familyHistory) {
      familyList.innerHTML = hd.familyHistory.map(item => `
        <li><span>🧬</span> ${item}</li>
      `).join('');
    }
  }

  renderPrescription(patient) {
    const rx = patient.prescription;
    if (!rx) return;

    // Doctor details
    if (document.getElementById('rx-hospital-name')) document.getElementById('rx-hospital-name').textContent = rx.doctor.clinicHospital || 'Panimalar Health Hub & Medical Center';
    if (document.getElementById('rx-hospital-sub')) document.getElementById('rx-hospital-sub').textContent = rx.doctor.hospitalUnit || 'Department of Cardiology & Metabolic Health';
    if (document.getElementById('rx-doctor-name')) document.getElementById('rx-doctor-name').textContent = rx.doctor.name;
    if (document.getElementById('rx-doctor-qual')) document.getElementById('rx-doctor-qual').textContent = rx.doctor.qualification;
    if (document.getElementById('rx-doctor-reg')) document.getElementById('rx-doctor-reg').textContent = rx.doctor.registrationNo;
    if (document.getElementById('rx-doctor-contact')) document.getElementById('rx-doctor-contact').textContent = `${rx.doctor.phone} · ${rx.doctor.email}`;
    if (document.getElementById('rx-sig-doc-name')) document.getElementById('rx-sig-doc-name').textContent = rx.doctor.name;

    // Patient info
    if (document.getElementById('rx-patient-name')) document.getElementById('rx-patient-name').textContent = patient.name;
    if (document.getElementById('rx-patient-meta')) document.getElementById('rx-patient-meta').textContent = `${patient.age}y / ${patient.gender} / Blood: ${patient.bloodGroup}`;
    if (document.getElementById('rx-patient-uhid')) document.getElementById('rx-patient-uhid').textContent = patient.uniqueIdFormatted || patient.uniqueId;
    if (document.getElementById('rx-number')) document.getElementById('rx-number').textContent = rx.rxNumber;
    if (document.getElementById('rx-date')) document.getElementById('rx-date').textContent = rx.dateIssued;
    if (document.getElementById('rx-diagnosis')) document.getElementById('rx-diagnosis').textContent = rx.diagnosis;
    if (document.getElementById('rx-followup')) document.getElementById('rx-followup').textContent = rx.followUp;

    // Allergy alert
    const allergyEl = document.getElementById('rx-allergy-alert');
    if (allergyEl) {
      allergyEl.textContent = rx.drugAllergyAlert;
    }

    // Directives
    const dirList = document.getElementById('rx-directives-list');
    if (dirList && rx.dietaryAndLifestyleOrders) {
      dirList.innerHTML = rx.dietaryAndLifestyleOrders.map(d => `<li>${d}</li>`).join('');
    }

    // Medication table
    const medsTbody = document.getElementById('rx-meds-tbody');
    if (medsTbody && rx.medications) {
      medsTbody.innerHTML = rx.medications.map(m => `
        <tr>
          <td>
            <div class="rx-med-name">${m.name}</div>
            <div class="rx-med-brand">${m.brand || 'Generic'}</div>
          </td>
          <td style="color: var(--text-main); font-weight: 600;">
            ${m.dosage}<br>
            <small style="color: var(--text-muted); font-weight: normal;">${m.form}</small>
          </td>
          <td>
            <span class="rx-schedule-tag">${m.schedule}</span>
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 3px;">${m.scheduleText || ''}</div>
          </td>
          <td style="color: var(--text-secondary);">
            <strong>${m.duration}</strong><br>
            <small>${m.quantity || ''}</small>
          </td>
          <td style="font-size: 12px; color: var(--text-secondary); max-width: 220px;">
            ${m.instructions}
          </td>
          <td>
            <span class="badge-pill" style="font-size: 10px;">${m.dispenseStatus}</span>
            <div style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted); margin-top: 3px;">RxNorm: ${m.rxNorm || 'N/A'}</div>
          </td>
        </tr>
      `).join('');
    }
  }

  renderTimeline(patient) {
    if (!this.dom.timelineList) return;
    
    // Initial feed synthesized from patient records
    const sampleItems = [
      {
        source: 'Hospital',
        type: 'Encounter',
        title: 'Specialty Outpatient Consultation',
        date: 'Today, 10:15 AM',
        detail: `Attending: ${patient.primaryPhysician}. Evaluated primary condition: ${patient.conditionSummary}.`,
        fhirRef: patient.fhirResources.find(r => r.resourceType === 'Encounter') || patient.fhirResources[0]
      },
      {
        source: 'Lab',
        type: 'Observation',
        title: 'Glycated Hemoglobin & Lipid Panel',
        date: '3 Days Ago',
        detail: `HbA1c reported at ${patient.baseVitals.a1c}%. LOINC 4548-4. Verified by Automated Clinical Chemistry LIS.`,
        fhirRef: patient.fhirResources.find(r => r.resourceType === 'Observation' && r.code?.coding?.[0]?.code === '4548-4') || patient.fhirResources[1]
      },
      {
        source: 'Pharmacy',
        type: 'MedicationDispense',
        title: 'Electronic Prescription Fulfillment',
        date: '6 Days Ago',
        detail: `Dispensed 30-day supply of ${patient.medications[0].name} ${patient.medications[0].dosage} (${patient.medications[0].freq}).`,
        fhirRef: patient.fhirResources.find(r => r.resourceType === 'MedicationDispense') || patient.fhirResources[0]
      },
      {
        source: 'Wearable',
        type: 'Observation',
        title: 'Continuous IoT Telemetry Stream',
        date: 'Streaming Live',
        detail: `Continuous Lead-II ECG and SpO₂ photoplethysmography logged via encrypted Bluetooth Low Energy BLE.`,
        fhirRef: patient.fhirResources.find(r => r.resourceType === 'Observation' && r.id?.includes('wearable')) || patient.fhirResources[0]
      }
    ];

    this.activeTimelineRecords = sampleItems;
    this.filterTimeline();
  }

  filterTimeline() {
    if (!this.dom.timelineList) return;
    const filtered = this.timelineFilter === 'all'
      ? this.activeTimelineRecords
      : this.activeTimelineRecords.filter(item => item.source.toLowerCase() === this.timelineFilter.toLowerCase());

    this.dom.timelineList.innerHTML = filtered.map(item => `
      <div class="timeline-item">
        <div class="source-badge ${item.source}">${item.source}</div>
        <div class="timeline-content">
          <div class="timeline-title">${item.title}</div>
          <div class="timeline-sub">
            <span><strong>FHIR:</strong> ${item.type}</span>
            <span>•</span>
            <span>${item.date}</span>
          </div>
          <div class="timeline-detail">${item.detail}</div>
          <div class="timeline-actions">
            <button class="btn-link view-fhir-btn" data-json='${JSON.stringify(item.fhirRef).replace(/'/g, "&apos;")}'>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              View Raw HL7 FHIR JSON
            </button>
          </div>
        </div>
      </div>
    `).join('');

    this.dom.timelineList.querySelectorAll('.view-fhir-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const raw = JSON.parse(btn.getAttribute('data-json'));
          this.openFhirModal(raw);
        } catch (err) {
          console.error('Failed to parse FHIR JSON', err);
        }
      });
    });
  }

  renderNLP(patient) {
    if (!this.dom.nlpNoteContent || !this.dom.nlpSummaryList) return;

    // Render Note with masked/unmasked text
    this.dom.nlpNoteContent.innerHTML = patient.noteSentences.map((s, idx) => {
      let displayText = s.text;
      if (this.maskPHI && s.phi && s.phi.length > 0) {
        s.phi.forEach(term => {
          displayText = displayText.replace(term, `<span class="phi-mask">[PROTECTED PHI]</span>`);
        });
      }
      return `<span class="note-sentence ${this.activeSentenceIndex === idx ? 'highlighted' : ''}" data-sentence="${idx}">${displayText} </span>`;
    }).join('');

    // Render BioBERT summary bullets
    this.dom.nlpSummaryList.innerHTML = patient.nlpSummary.map(item => `
      <button class="nlp-summary-btn ${this.activeSentenceIndex === item.targetSentenceIndex ? 'highlighted' : ''}" data-target="${item.targetSentenceIndex}">
        <span class="nlp-summary-tag">${item.tag}</span>
        <span>${item.text}</span>
      </button>
    `).join('');

    // Attach click events for bidirectional highlighting
    this.dom.nlpSummaryList.querySelectorAll('.nlp-summary-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.dataset.target, 10);
        this.activeSentenceIndex = this.activeSentenceIndex === targetIdx ? null : targetIdx;
        this.renderNLP(patient);
      });
    });

    this.dom.nlpNoteContent.querySelectorAll('.note-sentence').forEach(span => {
      span.addEventListener('click', () => {
        const targetIdx = parseInt(span.dataset.sentence, 10);
        this.activeSentenceIndex = this.activeSentenceIndex === targetIdx ? null : targetIdx;
        this.renderNLP(patient);
      });
    });
  }

  calculateAndRenderRisk() {
    const patient = this.patients[this.currentPatientIndex];
    if (!patient) return;

    // Real-time calculation based on live vitals + patient baseline features
    let riskDelta = 0;
    
    // Heart rate penalty
    if (this.liveVitals.hr > 100) riskDelta += (this.liveVitals.hr - 100) * 0.45;
    else if (this.liveVitals.hr < 55) riskDelta += (55 - this.liveVitals.hr) * 0.35;

    // Systolic BP penalty
    if (this.liveVitals.bpSys > 130) riskDelta += (this.liveVitals.bpSys - 130) * 0.4;

    // SpO2 penalty
    if (this.liveVitals.sp < 95) riskDelta += (95 - this.liveVitals.sp) * 2.8;

    // Glucose penalty
    if (this.liveVitals.glucose > 140) riskDelta += (this.liveVitals.glucose - 140) * 0.14;

    // Baseline calculation from static SHAP features
    const baseSum = patient.shapFeatures.reduce((acc, f) => acc + f.impact, 0);
    const calculatedScore = Math.max(5, Math.min(98, Math.round(25 + baseSum + riskDelta)));

    // Update gauge
    if (this.dom.riskScoreNum) this.dom.riskScoreNum.textContent = `${calculatedScore}%`;
    
    let category = 'Low Risk';
    let catClass = 'var(--status-success)';
    let desc = 'Biomarkers within stabilized reference intervals. Routine preventive outpatient follow-up recommended.';

    if (calculatedScore >= 70) {
      category = 'Severe Critical Risk';
      catClass = 'var(--status-critical)';
      desc = 'High hazard of acute cardiac decompensation or 30-day readmission. Immediate clinician bedside triage triggered.';
    } else if (calculatedScore >= 50) {
      category = 'Elevated Moderate Risk';
      catClass = 'var(--status-warning)';
      desc = 'Persistent hemodynamic or glycemic derangements detected. Escalation of outpatient therapy advised.';
    }

    if (this.dom.riskScoreCategory) {
      this.dom.riskScoreCategory.textContent = category;
      this.dom.riskScoreCategory.style.color = catClass;
    }
    if (this.dom.riskScoreDesc) {
      this.dom.riskScoreDesc.textContent = desc;
    }

    if (this.dom.riskScoreCircle) {
      const deg = Math.round((calculatedScore / 100) * 360);
      this.dom.riskScoreCircle.style.background = `conic-gradient(${catClass} 0deg ${deg}deg, var(--bg-elevated) ${deg}deg 360deg)`;
      this.dom.riskScoreCircle.style.boxShadow = `0 0 20px ${catClass}44`;
    }

    // Render SHAP waterfall bars
    this.renderShapBars(patient, calculatedScore);
  }

  renderShapBars(patient, currentScore) {
    if (!this.dom.shapRowsContainer) return;

    // Find max value for normalization
    const maxVal = Math.max(...patient.shapFeatures.map(f => Math.abs(f.impact)), 16);

    this.dom.shapRowsContainer.innerHTML = patient.shapFeatures.map(f => {
      const pct = Math.min(48, (Math.abs(f.impact) / maxVal) * 48);
      const isRisk = f.direction === 'risk';
      const fillStyle = isRisk
        ? `left: 50%; width: ${pct}%;`
        : `right: 50%; width: ${pct}%;`;
      
      const valStr = `${isRisk ? '+' : '-'}${Math.abs(f.impact).toFixed(1)}%`;

      return `
        <div class="shap-row" title="${f.description}">
          <span class="shap-feature-name">${f.name}</span>
          <div class="shap-bar-track">
            <div class="shap-midline"></div>
            <div class="shap-bar-fill ${f.direction}" style="${fillStyle}"></div>
          </div>
          <span class="shap-val ${f.direction}">${valStr}</span>
        </div>
      `;
    }).join('');
  }

  updateVitalsDisplay() {
    const v = this.liveVitals;
    if (!v.hr) return;

    if (this.dom.valHr) this.dom.valHr.textContent = Math.round(v.hr);
    if (this.dom.valSp) this.dom.valSp.textContent = Math.round(v.sp);
    if (this.dom.valBp) this.dom.valBp.textContent = `${Math.round(v.bpSys)}/${Math.round(v.bpDia)}`;
    if (this.dom.valGl) this.dom.valGl.textContent = Math.round(v.glucose);
    if (this.dom.valResp) this.dom.valResp.textContent = Math.round(v.resp);
    if (this.dom.valTemp) this.dom.valTemp.textContent = v.temp.toFixed(1);
    if (this.dom.ecgBpmDisplay) this.dom.ecgBpmDisplay.textContent = Math.round(v.hr);

    // Dynamic threshold styling
    if (this.dom.tileHr) {
      this.dom.tileHr.classList.toggle('critical', v.hr > 120 || v.hr < 45);
      this.dom.tileHr.classList.toggle('warning', (v.hr > 100 && v.hr <= 120) || (v.hr >= 45 && v.hr < 55));
    }
    if (this.dom.tileSp) {
      this.dom.tileSp.classList.toggle('critical', v.sp < 92);
      this.dom.tileSp.classList.toggle('warning', v.sp >= 92 && v.sp < 95);
    }
    if (this.dom.tileBp) {
      this.dom.tileBp.classList.toggle('critical', v.bpSys > 160);
      this.dom.tileBp.classList.toggle('warning', v.bpSys > 135 && v.bpSys <= 160);
    }
    if (this.dom.tileGl) {
      this.dom.tileGl.classList.toggle('critical', v.glucose > 240 || v.glucose < 65);
      this.dom.tileGl.classList.toggle('warning', (v.glucose > 180 && v.glucose <= 240) || (v.glucose >= 65 && v.glucose < 75));
    }
  }

  startVitalsLoop() {
    setInterval(() => {
      const patient = this.patients[this.currentPatientIndex];
      if (!patient) return;

      if (!this.isCrisisMode) {
        // Natural physiological small micro-fluctuations reverting to baseline
        const drift = (curr, target, range, min, max) => {
          const delta = (target - curr) * 0.15 + (Math.random() - 0.5) * range;
          return Math.max(min, Math.min(max, curr + delta));
        };

        this.liveVitals.hr = drift(this.liveVitals.hr, patient.baseVitals.hr, 3, 45, 160);
        this.liveVitals.sp = drift(this.liveVitals.sp, patient.baseVitals.sp, 0.8, 85, 100);
        this.liveVitals.bpSys = drift(this.liveVitals.bpSys, patient.baseVitals.bpSys, 3, 85, 200);
        this.liveVitals.bpDia = drift(this.liveVitals.bpDia, patient.baseVitals.bpDia, 2, 50, 120);
        this.liveVitals.glucose = drift(this.liveVitals.glucose, patient.baseVitals.glucose, 5, 50, 350);
        this.liveVitals.resp = drift(this.liveVitals.resp, patient.baseVitals.resp, 1, 10, 40);
      } else {
        // Crisis fluctuations (more jitter)
        this.liveVitals.hr += (Math.random() - 0.5) * 4;
        this.liveVitals.bpSys += (Math.random() - 0.5) * 4;
      }

      this.updateVitalsDisplay();
      this.calculateAndRenderRisk();
      this.checkVitalThresholdAlerts();
    }, 1000);
  }

  checkVitalThresholdAlerts() {
    const v = this.liveVitals;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (v.hr > 125) {
      this.triggerAlert('critical', `Sustained Sinus Tachycardia detected: Heart rate at ${Math.round(v.hr)} bpm.`);
    } else if (v.sp < 92) {
      this.triggerAlert('critical', `Hypoxemia Alert: Arterial oxygen saturation dropped to ${Math.round(v.sp)}%.`);
    } else if (v.bpSys > 165) {
      this.triggerAlert('critical', `Hypertensive Urgency: Systolic BP reached ${Math.round(v.bpSys)} mmHg.`);
    } else if (v.glucose > 250) {
      this.triggerAlert('warning', `Severe Hyperglycemia: Blood glucose spiked to ${Math.round(v.glucose)} mg/dL.`);
    }
  }

  triggerAlert(level, message) {
    // Avoid spamming identical consecutive messages within 8 seconds
    if (this.alertsQueue.length > 0 && this.alertsQueue[0].message === message) {
      return;
    }

    const alert = {
      level,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    this.alertsQueue.unshift(alert);
    if (this.alertsQueue.length > 25) this.alertsQueue.pop();

    this.renderAlerts();
    this.showToast(message, level);
    this.logAuditAction(`CLINICAL_ALERT_${level.toUpperCase()}`, message);
  }

  renderAlerts() {
    if (!this.dom.alertStream) return;
    if (this.alertsQueue.length === 0) {
      this.dom.alertStream.innerHTML = `<div class="alert-item info"><span class="alert-text">Continuous monitor active. All parameters within safe margins.</span><span class="alert-time">Live</span></div>`;
      return;
    }

    this.dom.alertStream.innerHTML = this.alertsQueue.map(a => `
      <div class="alert-item ${a.level}">
        <span class="alert-text">${a.message}</span>
        <span class="alert-time">${a.time}</span>
      </div>
    `).join('');
  }

  // ==========================================================================
  // Realistic Lead-II ECG Waveform Synthesizer
  // ==========================================================================
  generateEcgPoint(phase) {
    const p = phase % 1.0;
    // P wave (atrial depolarization)
    if (p >= 0.05 && p < 0.15) {
      return 10 * Math.sin(((p - 0.05) / 0.10) * Math.PI);
    }
    // PR interval baseline
    if (p >= 0.15 && p < 0.22) {
      return 0;
    }
    // Q wave (septal depolarization)
    if (p >= 0.22 && p < 0.25) {
      return -8 * Math.sin(((p - 0.22) / 0.03) * Math.PI);
    }
    // R wave peak (ventricular depolarization)
    if (p >= 0.25 && p < 0.31) {
      return 75 * Math.sin(((p - 0.25) / 0.06) * Math.PI);
    }
    // S wave
    if (p >= 0.31 && p < 0.35) {
      return -16 * Math.sin(((p - 0.31) / 0.04) * Math.PI);
    }
    // ST segment
    if (p >= 0.35 && p < 0.45) {
      return 0;
    }
    // T wave (ventricular repolarization)
    if (p >= 0.45 && p < 0.65) {
      return 16 * Math.sin(((p - 0.45) / 0.20) * Math.PI);
    }
    // TP baseline
    return 0;
  }

  startECGLoop() {
    const draw = () => {
      if (!this.ecgCtx) return;

      const hr = Math.max(40, Math.min(180, this.liveVitals.hr || 75));
      const beatsPerSecond = hr / 60;
      const phaseIncrement = (beatsPerSecond / 60) * 0.9;

      // Advance phase and populate buffer
      for (let step = 0; step < 2; step++) {
        this.ecgPhase += phaseIncrement / 2;
        const normalizedVal = this.generateEcgPoint(this.ecgPhase);
        const yPos = (this.ecgHeight / 2) - normalizedVal;
        this.ecgBuffer.push(yPos);
        this.ecgBuffer.shift();

        // Check if R-wave peak passed for Audio & LED
        const pMod = this.ecgPhase % 1.0;
        if (pMod > 0.27 && pMod < 0.29 && Date.now() - this.lastBeatTime > 400) {
          this.lastBeatTime = Date.now();
          this.onHeartBeat();
        }
      }

      // Draw Grid & Waveform
      this.drawEcgCanvas();
      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }

  drawEcgCanvas() {
    const ctx = this.ecgCtx;
    const w = this.ecgWidth;
    const h = this.ecgHeight;

    // Clear
    ctx.fillStyle = '#040a0c';
    ctx.fillRect(0, 0, w, h);

    // Medical ECG Grid lines
    ctx.strokeStyle = '#0e2321';
    ctx.lineWidth = 0.5;

    // Small grid (10px)
    ctx.beginPath();
    for (let x = 0; x < w; x += 12) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += 12) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Large grid (60px)
    ctx.strokeStyle = '#163b37';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < w; x += 60) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += 60) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Draw Lead II Trace with phosphor glow
    ctx.save();
    ctx.shadowColor = '#00f5b4';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#00f5b4';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    const len = this.ecgBuffer.length;
    for (let i = 0; i < len; i++) {
      const x = (i / len) * w;
      const y = this.ecgBuffer[i];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  onHeartBeat() {
    // Flash LED
    if (this.dom.pulseLed) {
      this.dom.pulseLed.style.transform = 'scale(1.4)';
      this.dom.pulseLed.style.boxShadow = '0 0 14px #10b981';
      setTimeout(() => {
        if (this.dom.pulseLed) {
          this.dom.pulseLed.style.transform = 'scale(1)';
          this.dom.pulseLed.style.boxShadow = '0 0 6px #10b981';
        }
      }, 120);
    }

    // Play clinical audio blip if enabled
    if (this.audioEnabled) {
      this.playClinicalBeep();
    }
  }

  playClinicalBeep() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      const freq = this.isCrisisMode ? 1040 : 880;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {
      // Audio not permitted or unsupported
    }
  }

  // ==========================================================================
  // Simulations & Telemetry Ingestion
  // ==========================================================================
  simulateCrisis() {
    this.isCrisisMode = true;
    this.liveVitals.hr = 138;
    this.liveVitals.bpSys = 174;
    this.liveVitals.bpDia = 108;
    this.liveVitals.sp = 91;
    this.liveVitals.glucose = 265;
    this.liveVitals.resp = 28;

    this.triggerAlert('critical', 'CRISIS EVENT SIMULATED: Tachycardia, Hypertensive Spike & Hypoxia!');
    this.showToast('Crisis triggered: Continuous vitals spiked to critical thresholds', 'critical');
    this.updateVitalsDisplay();
    this.calculateAndRenderRisk();
    this.logAuditAction('SIMULATE_CARDIAC_CRISIS', `Patient/${this.patients[this.currentPatientIndex].id}`);
  }

  simulateHypoxia() {
    this.liveVitals.sp = 88;
    this.liveVitals.resp = 26;
    this.liveVitals.hr = 98;
    this.triggerAlert('critical', 'Acute Bronchospasm & Desaturation: SpO₂ plummeted to 88%!');
    this.updateVitalsDisplay();
    this.calculateAndRenderRisk();
  }

  simulateHyperglycemia() {
    this.liveVitals.glucose = 295;
    this.triggerAlert('warning', 'Postprandial Hyperglycemic Surge: Blood glucose elevated to 295 mg/dL.');
    this.updateVitalsDisplay();
    this.calculateAndRenderRisk();
  }

  normalizeVitals() {
    this.isCrisisMode = false;
    const base = this.patients[this.currentPatientIndex].baseVitals;
    this.liveVitals = { ...base };
    this.showToast('Vitals stabilized back to baseline ranges', 'success');
    this.updateVitalsDisplay();
    this.calculateAndRenderRisk();
  }

  startPeriodicTelemetryIngest() {
    // Random incoming FHIR record every 12 seconds to demonstrate continuous streaming
    const randomSources = [
      { source: 'Wearable', type: 'Observation', title: 'Heart Rate Variability Update', desc: 'Nocturnal RMSSD calculated at 34 ms' },
      { source: 'Hospital', type: 'Encounter', title: 'Telemetry Triage Log', desc: 'Auto-synchronized with Apollo Health Hub HIS' },
      { source: 'Lab', type: 'Observation', title: 'Serum Electrolytes Normal', desc: 'Sodium 139 mEq/L, Potassium 4.2 mEq/L' },
      { source: 'Pharmacy', type: 'MedicationDispense', title: 'Refill Adherence Verified', desc: 'Patient scanned QR prescription via WhatsApp portal' }
    ];

    setInterval(() => {
      const pick = randomSources[Math.floor(Math.random() * randomSources.length)];
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newRecord = {
        source: pick.source,
        type: pick.type,
        title: pick.title,
        date: `Just now (${now})`,
        detail: pick.desc,
        fhirRef: {
          resourceType: pick.type,
          id: `auto-${Date.now()}`,
          status: 'final',
          meta: { lastUpdated: new Date().toISOString() },
          note: [{ text: pick.desc }]
        }
      };

      this.activeTimelineRecords.unshift(newRecord);
      if (this.activeTimelineRecords.length > 30) this.activeTimelineRecords.pop();
      this.filterTimeline();

      // Log to audit
      this.logAuditAction(`INGEST_${pick.source.toUpperCase()}_RECORD`, `${pick.type}/${newRecord.fhirRef.id}`);
    }, 14000);
  }

  // ==========================================================================
  // Pipeline Stepper, Comparison, Modules, Authors
  // ==========================================================================
  renderPipelineStepper() {
    if (!this.dom.pipelineContainer) return;

    this.dom.pipelineContainer.innerHTML = WORKFLOW_STAGES.map((s, idx) => `
      <div class="pipe-step-card ${idx === 0 ? 'active' : ''}" data-step="${idx}">
        <span class="pipe-step-icon">${s.icon}</span>
        <strong>${s.step}. ${s.short}</strong>
      </div>
    `).join('');

    this.showPipelineDetail(0);

    this.dom.pipelineContainer.querySelectorAll('.pipe-step-card').forEach(card => {
      card.addEventListener('click', () => {
        this.dom.pipelineContainer.querySelectorAll('.pipe-step-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.showPipelineDetail(parseInt(card.dataset.step, 10));
      });
    });
  }

  showPipelineDetail(stepIdx) {
    if (!this.dom.pipelineDetail) return;
    const stage = WORKFLOW_STAGES[stepIdx];
    this.dom.pipelineDetail.innerHTML = `
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px 18px; margin-top: 10px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--brand-cyan); letter-spacing: 0.05em;">Stage ${stage.step} of 6 · ${stage.source}</span>
          <h4 style="font-size: 16px; margin: 2px 0 4px;">${stage.icon} ${stage.name}</h4>
          <p style="font-size: 13px; color: var(--text-secondary); max-width: 780px;">${stage.description}</p>
        </div>
        <span class="badge-pill">HL7 FHIR Certified</span>
      </div>
    `;
  }

  renderComparisonTable() {
    if (!this.dom.comparisonTbody) return;
    this.dom.comparisonTbody.innerHTML = COMPARISON_TABLE.map(row => `
      <tr>
        <td style="font-weight: 600; color: var(--text-main);">${row.aspect}</td>
        <td style="color: var(--text-muted);">${row.traditional}</td>
        <td style="color: var(--brand-cyan); font-weight: 500;">${row.intelliHealth}</td>
        <td><span class="badge-pill">${row.advantage}</span></td>
      </tr>
    `).join('');
  }

  renderSystemModules() {
    if (!this.dom.modulesContainer) return;
    this.dom.modulesContainer.innerHTML = SYSTEM_MODULES.map(m => `
      <div class="module-card">
        <div class="module-header">
          <div class="module-tag">${m.id}</div>
          <div class="module-title">${m.name}</div>
        </div>
        <div class="module-desc">${m.desc}</div>
      </div>
    `).join('');
  }

  renderAuthors() {
    if (!this.dom.authorsContainer) return;
    this.dom.authorsContainer.innerHTML = RESEARCH_METADATA.authors.map(a => `
      <div class="author-card">
        <div class="author-avatar">${a.isFaculty ? '👨‍🏫' : '👨‍💻'}</div>
        <div class="author-name">${a.name}</div>
        <div class="author-role">${a.role}</div>
        <div class="author-inst">${RESEARCH_METADATA.department}<br>${RESEARCH_METADATA.institution}</div>
        <a class="author-email" href="mailto:${a.email}">${a.email}</a>
      </div>
    `).join('');
  }

  renderAuditLogs() {
    if (!this.dom.auditTableBody) return;
    this.dom.auditTableBody.innerHTML = this.auditLogs.slice(0, 6).map(l => `
      <tr>
        <td class="mono" style="font-size: 11px;">${l.id}</td>
        <td class="mono" style="font-size: 11px;">${l.timestamp}</td>
        <td style="font-size: 12px; font-weight: 600;">${l.user}</td>
        <td><span class="badge-pill" style="font-size: 10px;">${l.action}</span></td>
        <td class="mono" style="font-size: 11px; color: var(--text-muted);">${l.resource}</td>
        <td style="font-size: 11px; color: var(--brand-emerald); font-weight: 700;">${l.status}</td>
      </tr>
    `).join('');
  }

  logAuditAction(action, resource) {
    const newEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      user: this.getRoleActorName(),
      action,
      resource,
      ip: '192.168.1.104',
      status: 'VERIFIED'
    };

    this.auditLogs.unshift(newEntry);
    this.renderAuditLogs();
  }

  getRoleActorName() {
    switch (this.currentRole) {
      case 'doctor': return 'Dr. A. Sundaram (Cardiology)';
      case 'nurse': return 'Nurse Staff (Station 3B)';
      case 'patient': return 'Patient Portal Session';
      case 'admin': return 'Chief Medical Officer / Admin';
      default: return 'System Agent';
    }
  }

  // ==========================================================================
  // Modal & Toast UI Handlers
  // ==========================================================================
  openFhirModal(jsonData) {
    if (!this.dom.fhirModal) return;
    const resourceType = jsonData.resourceType || 'Resource';
    if (this.dom.modalTitle) {
      this.dom.modalTitle.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        HL7 FHIR R4 Standard: ${resourceType}
      `;
    }
    if (this.dom.modalJsonContent) {
      this.dom.modalJsonContent.textContent = JSON.stringify(jsonData, null, 2);
    }
    this.dom.fhirModal.classList.add('open');
  }

  closeFhirModal() {
    if (this.dom.fhirModal) {
      this.dom.fhirModal.classList.remove('open');
    }
  }

  copyModalJson() {
    if (!this.dom.modalJsonContent) return;
    const text = this.dom.modalJsonContent.textContent;
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('FHIR R4 JSON payload copied to clipboard!', 'success');
    }).catch(() => {
      this.showToast('Could not access clipboard', 'warning');
    });
  }

  showToast(message, type = 'info') {
    if (!this.dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'critical') icon = '🚨';
    else if (type === 'warning') icon = '⚠️';
    else if (type === 'success') icon = '✅';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    this.dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  bindEvents() {
    // Theme toggle
    if (this.dom.themeToggle) {
      this.dom.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Audio toggle
    if (this.dom.audioToggle) {
      this.dom.audioToggle.addEventListener('click', () => {
        this.audioEnabled = !this.audioEnabled;
        if (this.audioEnabled) {
          if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
          this.dom.audioToggle.classList.add('active');
          if (this.dom.audioIcon) this.dom.audioIcon.textContent = '🔊';
          this.showToast('Clinical telemetry audio heartbeat enabled', 'info');
        } else {
          this.dom.audioToggle.classList.remove('active');
          if (this.dom.audioIcon) this.dom.audioIcon.textContent = '🔇';
          this.showToast('Audio muted', 'info');
        }
      });
    }

    // Role switcher
    if (this.dom.roleSelect) {
      this.dom.roleSelect.addEventListener('change', (e) => {
        this.currentRole = e.target.value;
        this.showToast(`Role switched to: ${this.currentRole.toUpperCase()}`, 'info');
        this.logAuditAction('SWITCH_RBAC_ROLE', `Role/${this.currentRole}`);
      });
    }

    // Mask PHI toggle
    if (this.dom.togglePhiBtn) {
      this.dom.togglePhiBtn.addEventListener('click', () => {
        this.maskPHI = !this.maskPHI;
        this.dom.togglePhiBtn.textContent = this.maskPHI ? 'Mask Protected PHI (Active)' : 'Unmask PHI (Audit Logged)';
        this.renderNLP(this.patients[this.currentPatientIndex]);
        this.showToast(`PHI de-identification ${this.maskPHI ? 'enabled' : 'disabled (logged in audit)'}`, 'info');
        this.logAuditAction(this.maskPHI ? 'ENABLE_PHI_MASKING' : 'VIEW_RAW_UNMASKED_PHI', 'Note/DeIdentification');
      });
    }

    // Timeline filter buttons
    if (this.dom.timelineFilters) {
      this.dom.timelineFilters.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          this.dom.timelineFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.timelineFilter = chip.dataset.filter;
          this.filterTimeline();
        });
      });
    }

    // Simulation triggers
    if (this.dom.btnCrisis) this.dom.btnCrisis.addEventListener('click', () => this.simulateCrisis());
    if (this.dom.btnNormalize) this.dom.btnNormalize.addEventListener('click', () => this.normalizeVitals());
    if (this.dom.btnHypoxia) this.dom.btnHypoxia.addEventListener('click', () => this.simulateHypoxia());
    if (this.dom.btnHyperglycemia) this.dom.btnHyperglycemia.addEventListener('click', () => this.simulateHyperglycemia());

    // Modal close & copy
    if (this.dom.closeModalBtn) this.dom.closeModalBtn.addEventListener('click', () => this.closeFhirModal());
    if (this.dom.copyJsonBtn) this.dom.copyJsonBtn.addEventListener('click', () => this.copyModalJson());
    if (this.dom.fhirModal) {
      this.dom.fhirModal.addEventListener('click', (e) => {
        if (e.target === this.dom.fhirModal) this.closeFhirModal();
      });
    }

    // Window resize handler for ECG canvas
    window.addEventListener('resize', () => {
      this.initECG();
    });
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new IntelliHealthApp();
  app.init();
  window.__ih360 = app;
});
