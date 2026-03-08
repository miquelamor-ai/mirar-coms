import { motion } from 'framer-motion';

const COLOR = '#16a085';
const ease = [0.22, 1, 0.36, 1] as const;

// ─── REPORT DATA ───────────────────────────────────────────────────────────────

const DIAG_ITEMS = [
  { id: 'A1', area: 'A. Limitacions', title: 'Formació aïllada', yes: 20, no: 1, pct: 95.2 },
  { id: 'A2', area: 'A. Limitacions', title: 'Del concert a fil musical', yes: 20, no: 1, pct: 95.2 },
  { id: 'B1', area: 'B. Receptes', title: 'Bloqueig emocional', yes: 21, no: 0, pct: 100 },
  { id: 'B2', area: 'B. Receptes', title: 'Receptes vs transformació', yes: 21, no: 0, pct: 100 },
  { id: 'B3', area: 'B. Receptes', title: 'Modelatge superficial', yes: 19, no: 2, pct: 90.5 },
  { id: 'C1', area: 'C. Transferència', title: 'Hipertròfia de la gestió', yes: 20, no: 1, pct: 95.2 },
  { id: 'C2', area: 'C. Transferència', title: 'Seguiment com a tràmit', yes: 20, no: 1, pct: 95.2 },
  { id: 'D1', area: 'D. Governança', title: 'Governança feble', yes: 19, no: 2, pct: 90.5 },
  { id: 'D2', area: 'D. Governança', title: 'Suport organitzatiu', yes: 21, no: 0, pct: 100 },
  { id: 'D3', area: 'D. Governança', title: 'Individualisme vs comunitat', yes: 17, no: 4, pct: 81.0 },
];

const PHASE_COLORS: Record<string, string> = {
  activar: '#27ae60', pilotar: '#3498db', preparar: '#c9922a',
  reflexionar: '#8e44ad', desestimar: '#e74c3c',
};

const TOP_ACTIVAR = [
  { title: 'Autonomia de centre', pct: 47.6 },
  { title: 'Durant — experiència activa', pct: 47.6 },
  { title: 'Més enllà de la satisfacció', pct: 45.0 },
  { title: 'Abans — preparació i compromís', pct: 42.9 },
  { title: 'Banc de talents intern', pct: 35.0 },
  { title: 'Superar les 15h actuals', pct: 33.3 },
];

const TOP_PILOTAR = [
  { title: 'Després — el focus real', pct: 50.0 },
  { title: 'Recull d\'evidències d\'aula', pct: 36.8 },
  { title: 'Plataforma dedicada i portafoli', pct: 30.0 },
  { title: 'Banc de talents intern', pct: 30.0 },
];

const TOP_PREPARAR = [
  { title: 'Auditoria d\'impacte', pct: 42.1 },
  { title: 'Lideratge per a la transferència', pct: 40.0 },
  { title: 'Plataforma dedicada i portafoli', pct: 35.0 },
];

const ROADMAP = [
  {
    year: '2026–27', phase: 'Bases + Lideratge', color: '#27ae60',
    items: [
      'Autonomia de centre i CPA',
      'Model ADD: fases Abans i Durant',
      'Banc de talents intern',
      'Formació intensiva Lideratge transferència',
    ]
  },
  {
    year: '2027–28', phase: 'Transferència', color: '#3498db',
    items: [
      'Pilotar fase Després (3-5 centres)',
      'Avaluació dinàmica integrada als pilots',
      'Superar les 15h (consolidar)',
    ]
  },
  {
    year: '2028–29', phase: 'Avaluació', color: '#c9922a',
    items: [
      'Més enllà de la satisfacció (mesurable)',
      'Recull d\'evidències d\'aula',
      'Auditoria d\'impacte amb universitats',
    ]
  },
];

// ─── STEP 0: RESUM EXECUTIU ────────────────────────────────────────────────────

function ReportExecSummary() {
  const stats = [
    { value: '94,3%', label: 'Diagnòstic — acord global', accent: '#27ae60' },
    { value: '281', label: '14 propostes — vots emesos', accent: '#3498db' },
    { value: '54,8%', label: 'Voluntat d\'acció (Activar+Pilotar)', accent: COLOR },
    { value: 'r = −0,31', label: 'Correlació — diagnosi × ambició', accent: '#e67e22' },
    { value: '5 capes', label: 'Cadena de dependències', accent: '#8e44ad' },
  ];

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: COLOR }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num">★</div>
          <h1 className="mirada-ttl">INFORME</h1>
          <p className="mirada-sub">Resultats de la consulta</p>
          <p className="intro-text-compact" style={{ marginTop: '1.5rem', opacity: 0.9 }}>
            Resum de la consulta a 21 direccions de centres FJE sobre el Pla d'Aprenentatge 2026–2029.
          </p>
          <p className="intro-text-compact" style={{ marginTop: '0.8rem', opacity: 0.7, fontSize: '0.8rem' }}>
            8 de març de 2026 · Dades verificades
          </p>
        </motion.div>
      </div>
      <div className="panel-right rpt-right">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Resum executiu</p>
          <div className="rpt-stat-grid">
            {stats.map((s, i) => (
              <motion.div key={i} className="rpt-stat-card"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, ease }}>
                <span className="rpt-stat-big" style={{ color: s.accent }}>{s.value}</span>
                <span className="rpt-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="rpt-conclusions">
            <p className="rpt-conclusions-title">Conclusions principals</p>
            {[
              'Diagnòstic validat: 94,3% d\'acord, 3 ítems amb consens unànime',
              'Mandat clar per avançar: 54,8% volen Activar o Pilotar',
              'Coll d\'ampolla identificat: el Lideratge per a la transferència',
              'Dependències crítiques: no es pot avaluar sense transferir primer',
              'Rebuig mínin (3,2%): alineació estratègica excepcional',
            ].map((c, i) => (
              <motion.div key={i} className="rpt-conclusion-item"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06, ease }}>
                <span className="rpt-conclusion-dot" style={{ background: COLOR }} />
                <span>{c}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ─── STEP 1: VALIDACIÓ DEL DIAGNÒSTIC ─────────────────────────────────────────

function ReportDiagnostic() {
  const full = DIAG_ITEMS.filter(d => d.pct === 100);
  return (
    <>
      <div className="panel-left intro-panel" style={{ background: COLOR }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num">★</div>
          <h1 className="mirada-ttl">Diagnòstic</h1>
          <p className="mirada-sub">Validació de la Mirada Dins</p>

          <div className="ds-stat-row" style={{ marginTop: '1.5rem' }}>
            <span className="ds-stat-big">94,3%</span>
            <span className="ds-stat-label">acord global</span>
          </div>

          <div className="ds-global" style={{ marginTop: '1rem' }}>
            <div className="ds-global-track">
              <motion.div className="ds-global-fill"
                style={{ background: 'rgba(255,255,255,0.9)' }}
                initial={{ width: 0 }} animate={{ width: '94.3%' }}
                transition={{ duration: 1, ease }} />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              {full.length} propostes amb 100% d'acord
            </p>
            <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.3rem' }}>
              210 vots totals · 21 participants × 10 ítems
            </p>
          </div>
        </motion.div>
      </div>
      <div className="panel-right rpt-right">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Acord per ítem del diagnòstic</p>
          <div className="rpt-diag-list">
            {DIAG_ITEMS.map((item, i) => (
              <motion.div key={item.id} className="rpt-diag-row"
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04, ease }}>
                <span className="rpt-diag-id" style={{ color: COLOR }}>{item.id}</span>
                <div className="rpt-diag-body">
                  <div className="rpt-diag-top">
                    <span className="rpt-diag-title">{item.title}</span>
                    <span className="rpt-diag-pct" style={{
                      color: item.pct === 100 ? '#27ae60' : item.pct >= 90 ? COLOR : '#e67e22'
                    }}>{item.pct}%</span>
                  </div>
                  <div className="rpt-diag-track">
                    <motion.div className="rpt-diag-fill"
                      style={{ background: item.pct === 100 ? '#27ae60' : item.pct >= 90 ? COLOR : '#e67e22' }}
                      initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.7, delay: 0.12 + i * 0.05, ease }} />
                  </div>
                  <div className="rpt-diag-votes">
                    <span className="rpt-diag-yes">✓ {item.yes}</span>
                    {item.no > 0 && <span className="rpt-diag-no">✗ {item.no}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ─── STEP 2: DISTRIBUCIÓ GLOBAL + PRIORITATS ──────────────────────────────────

const GLOBAL_DIST = [
  { phase: 'Activar', key: 'activar', votes: 88, pct: 31.3 },
  { phase: 'Pilotar', key: 'pilotar', votes: 66, pct: 23.5 },
  { phase: 'Preparar', key: 'preparar', votes: 64, pct: 22.8 },
  { phase: 'Reflexionar', key: 'reflexionar', votes: 54, pct: 19.2 },
  { phase: 'Desestimar', key: 'desestimar', votes: 9, pct: 3.2 },
];

const CATEGORIES = [
  { key: 'activar', label: 'Activar', icon: '▲', pct: 31.3, items: TOP_ACTIVAR.slice(0, 4) },
  { key: 'pilotar', label: 'Pilotar', icon: '◆', pct: 23.5, items: TOP_PILOTAR },
  { key: 'preparar', label: 'Preparar', icon: '●', pct: 22.8, items: [
    ...TOP_PREPARAR,
    { title: 'Més enllà de la satisfacció', pct: 25.0 },
  ]},
  { key: 'reflexionar', label: 'Reflexionar', icon: '◇', pct: 19.2, items: [
    { title: 'Nivells de profunditat', pct: 30.0 },
    { title: 'Lideratge per a la transferència', pct: 30.0 },
    { title: 'Autonomia de centre', pct: 28.6 },
    { title: 'Superar les 15h actuals', pct: 23.8 },
  ]},
];

function ReportDistribution() {
  const maxPct = Math.max(...GLOBAL_DIST.map(d => d.pct));

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: COLOR }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num">★</div>
          <h1 className="mirada-ttl">Distribució</h1>
          <p className="mirada-sub">281 vots · Mirada Endavant</p>

          <div style={{ marginTop: '1.5rem' }}>
            {GLOBAL_DIST.map((d, i) => (
              <motion.div key={d.key} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginTop: i > 0 ? '0.55rem' : 0,
              }}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, ease }}>
                <span style={{ fontSize: '0.78rem', width: '74px', textAlign: 'right', opacity: 0.9 }}>{d.phase}</span>
                <div style={{
                  flex: 1, height: 10, background: 'rgba(255,255,255,0.15)',
                  borderRadius: 5, overflow: 'hidden',
                }}>
                  <motion.div style={{
                    height: '100%', borderRadius: 5,
                    background: PHASE_COLORS[d.key],
                  }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.pct / maxPct) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.25 + i * 0.08, ease }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, width: '38px' }}>{d.pct}%</span>
              </motion.div>
            ))}
          </div>

          <p style={{ fontSize: '0.78rem', opacity: 0.8, marginTop: '1.2rem' }}>
            54,8% aposten per l'acció directa o controlada
          </p>
        </motion.div>
      </div>
      <div className="panel-right rpt-right">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Top propostes per categoria</p>

          <div className="rpt-cat-grid">
            {CATEGORIES.map((cat, ci) => (
              <motion.div key={cat.key} className="rpt-cat-tile"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + ci * 0.08, ease }}>
                <div className="rpt-cat-tile-header" style={{ background: PHASE_COLORS[cat.key] }}>
                  <span className="rpt-cat-tile-icon">{cat.icon}</span>
                  <span className="rpt-cat-tile-label">{cat.label}</span>
                  <span className="rpt-cat-tile-pct">{cat.pct}%</span>
                </div>
                <div className="rpt-cat-tile-body">
                  {cat.items.map((p, i) => (
                    <div key={i} className="rpt-cat-tile-item">
                      <span className="rpt-cat-tile-rank" style={{ color: PHASE_COLORS[cat.key] }}>{i + 1}</span>
                      <span className="rpt-cat-tile-title">{p.title}</span>
                      <span className="rpt-cat-tile-val" style={{ color: PHASE_COLORS[cat.key] }}>{p.pct}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ─── STEP 3: TOTES LES PROPOSTES ──────────────────────────────────────────────

const ALL_PROPOSALS = [
  { dim: 'A', title: 'Superar les 15h', act: 7, pil: 1, prep: 5, ref: 5, des: 3, total: 21 },
  { dim: 'A', title: 'Autonomia de centre', act: 10, pil: 3, prep: 2, ref: 6, des: 0, total: 21 },
  { dim: 'B', title: 'Abans — preparació', act: 9, pil: 4, prep: 4, ref: 4, des: 0, total: 21 },
  { dim: 'B', title: 'Durant — experiència', act: 10, pil: 6, prep: 4, ref: 1, des: 0, total: 21 },
  { dim: 'B', title: 'Després — el focus real', act: 4, pil: 10, prep: 4, ref: 2, des: 0, total: 20 },
  { dim: 'C', title: 'Lideratge transferència', act: 5, pil: 1, prep: 8, ref: 6, des: 0, total: 20 },
  { dim: 'C', title: 'Banc de talents', act: 7, pil: 6, prep: 3, ref: 4, des: 0, total: 20 },
  { dim: 'D', title: 'Itineraris plurianuals', act: 6, pil: 5, prep: 3, ref: 4, des: 2, total: 20 },
  { dim: 'D', title: 'Nivells profunditat', act: 3, pil: 4, prep: 5, ref: 6, des: 2, total: 20 },
  { dim: 'E', title: 'Plataforma i portafoli', act: 3, pil: 6, prep: 7, ref: 4, des: 0, total: 20 },
  { dim: 'E', title: 'Auditoria d\'impacte', act: 4, pil: 5, prep: 8, ref: 2, des: 0, total: 19 },
  { dim: 'F', title: 'Més enllà satisfacció', act: 9, pil: 4, prep: 5, ref: 2, des: 0, total: 20 },
  { dim: 'F', title: 'Avaluació dinàmica', act: 6, pil: 4, prep: 4, ref: 4, des: 1, total: 19 },
  { dim: 'F', title: 'Recull d\'evidències', act: 5, pil: 7, prep: 2, ref: 4, des: 1, total: 19 },
];

const DIM_LABELS: Record<string, string> = {
  A: 'Temps i Ritmes', B: 'Estructura ADD', C: 'Formadors i rols',
  D: 'Tipologies', E: 'Recursos', F: 'Avaluació i impacte',
};

function ReportAllProposals() {
  const maxTotal = Math.max(...ALL_PROPOSALS.map(p => p.total));

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: COLOR }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num">★</div>
          <h1 className="mirada-ttl">14 Propostes</h1>
          <p className="mirada-sub">Mirada Endavant — detall complet</p>

          <div className="ds-stat-row" style={{ marginTop: '1.5rem' }}>
            <span className="ds-stat-big">281</span>
            <span className="ds-stat-label">vots totals</span>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.5 }}>
              21 participants × 14 propostes agrupades en 6 dimensions estratègiques.
            </p>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {Object.entries(PHASE_COLORS).map(([key, color]) => (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                marginTop: '0.25rem',
              }}>
                <span style={{
                  width: 10, height: 10, borderRadius: 2,
                  background: color, flexShrink: 0,
                }} />
                <span style={{ fontSize: '0.7rem', opacity: 0.85, textTransform: 'capitalize' }}>
                  {key}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="panel-right rpt-right">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Distribució de vots per proposta</p>
          <div className="rpt-proposals-list">
            {ALL_PROPOSALS.map((p, i) => {
              const showDim = i === 0 || ALL_PROPOSALS[i - 1].dim !== p.dim;
              const segments = [
                { key: 'activar', val: p.act },
                { key: 'pilotar', val: p.pil },
                { key: 'preparar', val: p.prep },
                { key: 'reflexionar', val: p.ref },
                { key: 'desestimar', val: p.des },
              ];
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.03, ease }}>
                  {showDim && (
                    <div className="rpt-prop-dim-label" style={{ color: COLOR }}>
                      {p.dim}. {DIM_LABELS[p.dim]}
                    </div>
                  )}
                  <div className="rpt-prop-row">
                    <span className="rpt-prop-title">{p.title}</span>
                    <div className="rpt-prop-bar-wrap">
                      <div className="rpt-prop-bar" style={{ width: `${(p.total / maxTotal) * 100}%` }}>
                        {segments.map(seg => seg.val > 0 ? (
                          <div key={seg.key} className="rpt-prop-seg"
                            style={{
                              width: `${(seg.val / p.total) * 100}%`,
                              background: PHASE_COLORS[seg.key],
                            }}
                            title={`${seg.key}: ${seg.val}`}
                          />
                        ) : null)}
                      </div>
                      <span className="rpt-prop-total">{p.total}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ─── STEP 4: PERFILS DIRECTIUS + CORRELACIÓ ────────────────────────────────────

function ReportProfiles() {
  const profiles = [
    {
      name: 'Inconformistes Impacients',
      emoji: '🚀',
      color: '#e74c3c',
      agreement: '70–90%',
      ambition: '> 3,8 / 5',
      traits: [
        'Més crítics amb el diagnòstic presentat',
        'Voten massivament per Activar i Pilotar',
        'Volen accelerar la transformació',
      ],
      recommendation: 'Involucrar-los en projectes pilot com a early adopters',
    },
    {
      name: 'Prudents Alineats',
      emoji: '🧭',
      color: '#3498db',
      agreement: '95–100%',
      ambition: '< 3,4 / 5',
      traits: [
        'Validen plenament el diagnòstic',
        'Prefereixen Preparar i Reflexionar',
        'Confien en el procés institucional',
      ],
      recommendation: 'Poden liderar equips de disseny rigorós i consolidació',
    },
  ];

  // Mini scatter plot data
  const W = 300, H = 180, PL = 40, PR = 10, PT = 10, PB = 28;
  const plotW = W - PL - PR, plotH = H - PT - PB;
  const toX = (v: number) => PL + (v / 100) * plotW;
  const toY = (v: number) => PT + plotH - (v / 100) * plotH;
  // Simulated points based on report description
  const points = [
    { x: 70, y: 85 }, { x: 75, y: 82 }, { x: 80, y: 78 }, { x: 82, y: 80 },
    { x: 85, y: 72 }, { x: 88, y: 68 }, { x: 90, y: 65 },
    { x: 92, y: 60 }, { x: 95, y: 55 }, { x: 95, y: 52 }, { x: 100, y: 50 },
    { x: 100, y: 48 }, { x: 100, y: 45 }, { x: 98, y: 42 }, { x: 100, y: 38 },
    { x: 90, y: 70 }, { x: 85, y: 75 },
  ];

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: 'linear-gradient(155deg, #1c2e40 0%, #1a3025 100%)' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ opacity: 0.5, fontSize: '2rem' }}>◈</div>
          <h1 className="mirada-ttl">Correlació</h1>
          <p className="mirada-sub">Diagnosi × Ambició</p>

          <div className="ds-stat-row" style={{ marginTop: '1rem' }}>
            <span className="ds-stat-big" style={{ color: '#e74c3c' }}>r = −0,315</span>
            <span className="ds-stat-label">correlació negativa moderada</span>
          </div>

          <p style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: '1rem', lineHeight: 1.6 }}>
            Les direccions més crítiques amb el diagnòstic tendeixen a proposar accions més ambicioses.
            Les més alineades són més prudents.
          </p>

          <div style={{ marginTop: '1rem' }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 300, opacity: 0.85 }}>
              {[0, 50, 100].map(v => (
                <line key={`h${v}`} x1={PL} y1={toY(v)} x2={W - PR} y2={toY(v)} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              ))}
              {[0, 50, 100].map(v => (
                <line key={`v${v}`} x1={toX(v)} y1={PT} x2={toX(v)} y2={H - PB} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              ))}
              <line x1={toX(0)} y1={toY(85)} x2={toX(100)} y2={toY(40)}
                stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} strokeDasharray="4 3" />
              {points.map((p, i) => (
                <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={4}
                  fill={p.x < 88 ? `${profiles[0].color}cc` : `${profiles[1].color}cc`}
                  stroke="rgba(255,255,255,0.3)" strokeWidth={0.5} />
              ))}
              <text x={PL - 4} y={toY(100) + 4} textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize={8}>Activ.</text>
              <text x={PL - 4} y={toY(0) + 4} textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize={8}>Des.</text>
              <text x={toX(0)} y={H - PB + 12} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={8}>0%</text>
              <text x={toX(100)} y={H - PB + 12} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={8}>100%</text>
              <line x1={PL} y1={PT} x2={PL} y2={H - PB} stroke="rgba(255,255,255,0.3)" />
              <line x1={PL} y1={H - PB} x2={W - PR} y2={H - PB} stroke="rgba(255,255,255,0.3)" />
            </svg>
          </div>
        </motion.div>
      </div>
      <div className="panel-right rpt-right">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Dos perfils directius diferenciats</p>
          <div className="rpt-profiles-grid">
            {profiles.map((p, pi) => (
              <motion.div key={pi} className="rpt-profile-card"
                style={{ borderColor: `${p.color}30` }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + pi * 0.12, ease }}>
                <div className="rpt-profile-header" style={{ background: `${p.color}0a` }}>
                  <span className="rpt-profile-emoji">{p.emoji}</span>
                  <h3 className="rpt-profile-name" style={{ color: p.color }}>{p.name}</h3>
                </div>
                <div className="rpt-profile-stats">
                  <div className="rpt-profile-stat">
                    <span className="rpt-profile-stat-label">Acord diagnòstic</span>
                    <span className="rpt-profile-stat-val" style={{ color: p.color }}>{p.agreement}</span>
                  </div>
                  <div className="rpt-profile-stat">
                    <span className="rpt-profile-stat-label">Índex d'ambició</span>
                    <span className="rpt-profile-stat-val" style={{ color: p.color }}>{p.ambition}</span>
                  </div>
                </div>
                <ul className="rpt-profile-traits">
                  {p.traits.map((t, ti) => (
                    <li key={ti}>
                      <span className="rpt-profile-trait-dot" style={{ background: p.color }} />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="rpt-profile-rec" style={{ background: `${p.color}08`, borderColor: `${p.color}20` }}>
                  <span style={{ fontSize: '0.84rem', color: p.color, fontWeight: 600 }}>Recomanació</span>
                  <p style={{ fontSize: '0.88rem', marginTop: '0.2rem' }}>{p.recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p className="rpt-profile-insight"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}>
            Aquesta dualitat no és un problema, sinó una oportunitat estratègica:
            combinar l'energia transformadora dels primers amb la solidesa metodològica dels segons.
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}

// ─── STEP 4: FULL DE RUTA ──────────────────────────────────────────────────────

function ReportRoadmap() {
  return (
    <>
      <div className="panel-left intro-panel" style={{ background: COLOR }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num">★</div>
          <h1 className="mirada-ttl">Full de Ruta</h1>
          <p className="mirada-sub">Del diagnòstic a l'acció</p>

          <p className="intro-text-compact" style={{ marginTop: '1.5rem', opacity: 0.9 }}>
            Tres horitzons seqüencials que respecten les dependències entre propostes:
            primer líders, després transferència, llavors avaluació.
          </p>

          <div style={{ marginTop: '1.5rem' }}>
            {ROADMAP.map((r, i) => (
              <motion.div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginTop: i > 0 ? '0.5rem' : 0, opacity: 0.9
              }}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, ease }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: r.color, flexShrink: 0
                }} />
                <span style={{ fontSize: '0.8rem' }}>
                  <strong>{r.year}</strong> · {r.phase}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="panel-right rpt-right">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Recomanacions estratègiques</p>
          <div className="rpt-roadmap-grid">
            {ROADMAP.map((r, ri) => (
              <motion.div key={ri} className="rpt-roadmap-col"
                style={{ borderTopColor: r.color }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + ri * 0.1, ease }}>
                <div className="rpt-roadmap-header">
                  <span className="rpt-roadmap-year">{r.year}</span>
                  <span className="rpt-roadmap-phase" style={{ color: r.color, background: `${r.color}12` }}>
                    {r.phase}
                  </span>
                </div>
                <ul className="rpt-roadmap-items">
                  {r.items.map((item, ii) => (
                    <motion.li key={ii}
                      initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + ri * 0.1 + ii * 0.06, ease }}>
                      <span className="rpt-roadmap-dot" style={{ background: r.color }} />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div className="rpt-roadmap-footer"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}>
            <div className="rpt-roadmap-keys">
              <p className="rpt-roadmap-keys-title">Factors clau per a l'èxit</p>
              <div className="rpt-roadmap-key-items">
                {[
                  { icon: '🔑', text: 'Formar líders de transferència abans de pilotar el Després' },
                  { icon: '🔗', text: 'Respectar la cadena: líders → transferència → avaluació' },
                  { icon: '📢', text: 'Comunicar que seqüenciar no és frenar, sinó construir bé' },
                  { icon: '🤝', text: 'Equips mixtos: inconformistes + prudents als pilots' },
                ].map((k, i) => (
                  <div key={i} className="rpt-roadmap-key-item">
                    <span>{k.icon}</span>
                    <span>{k.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

// ─── STEP 5: CONCLUSIONS ──────────────────────────────────────────────────────

const DEPENDENCY_LAYERS = [
  {
    label: 'CAPA 1 — BASES', color: '#27ae60', tag: 'Activar ara',
    items: ['Autonomia de centre', 'Abans i Durant (ADD)', 'Banc de talents', 'Itineraris'],
  },
  {
    label: 'CAPA 2 — LIDERATGE', color: '#c9922a', tag: 'Preparar',
    items: ['Lideratge per a la transferència'],
  },
  {
    label: 'CAPA 3 — TRANSFERÈNCIA', color: '#3498db', tag: 'Pilotar',
    items: ['Després — el focus real'],
  },
  {
    label: 'CAPA 4 — AVALUACIÓ', color: '#8e44ad', tag: 'Quan hi hagi transferència',
    items: ['Avaluació dinàmica', 'Recull d\'evidències', 'Més enllà de la satisfacció'],
  },
  {
    label: 'CAPA 5 — IMPACTE', color: '#e74c3c', tag: 'Fase final',
    items: ['Auditoria d\'impacte'],
  },
];

const KEY_DECISIONS = [
  { num: '1', text: 'Activar immediatament les bases estructurals (Autonomia, ADD, Banc de talents)', color: '#27ae60' },
  { num: '2', text: 'Prioritzar la formació del Lideratge per a la transferència — el coll d\'ampolla', color: '#c9922a' },
  { num: '3', text: 'No pilotar el Després fins a tenir líders formats (any 2, no any 1)', color: '#3498db' },
  { num: '4', text: 'Diferir el bloc avaluatiu — primer transferir, després avaluar', color: '#8e44ad' },
  { num: '5', text: 'Obrir debat conceptual sobre Nivells de profunditat', color: '#95a5a6' },
];

function ReportConclusions() {
  return (
    <>
      <div className="panel-left intro-panel" style={{ background: COLOR }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num">★</div>
          <h1 className="mirada-ttl">Conclusions</h1>
          <p className="mirada-sub">Cadena de dependències</p>

          <p className="intro-text-compact" style={{ marginTop: '1rem', opacity: 0.95 }}>
            Les propostes no són independents. L'ordre d'implementació ve determinat per la seva seqüència lògica.
          </p>

          <div style={{ marginTop: '1rem' }}>
            {DEPENDENCY_LAYERS.map((layer, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, ease }}>
                {i > 0 && (
                  <div style={{
                    marginLeft: '5px', height: '10px',
                    borderLeft: '2px solid rgba(255,255,255,0.35)',
                  }} />
                )}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: layer.color, flexShrink: 0,
                    border: '2px solid rgba(255,255,255,0.3)',
                  }} />
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                      {layer.label.split(' — ')[1]}
                    </span>
                    <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>
                      {' '}· {layer.tag}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: '1.2rem', lineHeight: 1.5 }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
            transition={{ delay: 0.8 }}>
            El desig d'avaluar (45%) expressa urgència
            — però primer cal transferència real.
          </motion.p>
        </motion.div>
      </div>
      <div className="panel-right rpt-right">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Les 5 decisions estratègiques</p>

          <div className="rpt-decisions-list">
            {KEY_DECISIONS.map((d, i) => (
              <motion.div key={i} className="rpt-decision-card"
                style={{ borderLeftColor: d.color }}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.08, ease }}>
                <span className="rpt-decision-num" style={{ background: d.color }}>{d.num}</span>
                <span className="rpt-decision-text">{d.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div className="rpt-message-box"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, ease }}>
            <p className="rpt-message-title" style={{ color: COLOR }}>El missatge clau</p>
            <div className="rpt-message-items">
              <div className="rpt-message-item">
                <span className="rpt-message-icon" style={{ color: '#27ae60' }}>●</span>
                <span>No tot es pot fer alhora — respectar la seqüència lògica</span>
              </div>
              <div className="rpt-message-item">
                <span className="rpt-message-icon" style={{ color: '#c9922a' }}>●</span>
                <span>2026–27 és el curs dels líders — la inversió que ho desbloqueja tot</span>
              </div>
              <div className="rpt-message-item">
                <span className="rpt-message-icon" style={{ color: '#3498db' }}>●</span>
                <span>L'avaluació vindrà — quan pugui mesurar alguna cosa real</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────

export function ReportSlide({ step }: { step: number }) {
  switch (step) {
    case 0: return <ReportExecSummary />;
    case 1: return <ReportDiagnostic />;
    case 2: return <ReportDistribution />;
    case 3: return <ReportAllProposals />;
    case 4: return <ReportProfiles />;
    case 5: return <ReportRoadmap />;
    case 6: return <ReportConclusions />;
    default: return <ReportExecSummary />;
  }
}
