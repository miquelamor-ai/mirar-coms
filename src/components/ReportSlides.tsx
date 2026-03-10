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
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ fontSize: '5rem', opacity: 0.5 }}>★</div>
          <h1 className="mirada-ttl" style={{ fontSize: '4rem' }}>INFORME</h1>
          <p className="mirada-sub" style={{ fontSize: '1.2rem' }}>Resultats de la consulta</p>
          <p className="intro-text-compact" style={{ marginTop: '1.2rem', opacity: 0.95, fontSize: '1rem' }}>
            Resum de la consulta a 21 direccions de centres FJE sobre el Pla d'Aprenentatge 2026–2029.
          </p>
          <p className="intro-text-compact" style={{ marginTop: '0.6rem', opacity: 0.8, fontSize: '0.92rem' }}>
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
  return (
    <>
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ color: '#fff', fontSize: '3rem' }}>★</div>
          <h1 className="mirada-ttl" style={{ color: '#fff', fontSize: '2.5rem' }}>Diagnòstic</h1>
          <p className="mirada-sub" style={{ color: '#fff', opacity: 1, fontSize: '1rem' }}>Validació de la Mirada Dins</p>

          <div className="ds-stat-row" style={{ marginTop: '1.2rem' }}>
            <span className="ds-stat-big" style={{ color: '#fff', fontSize: '4rem' }}>94,3%</span>
            <span className="ds-stat-label" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>acord global</span>
          </div>

          <div className="ds-global" style={{ marginTop: '0.8rem' }}>
            <div className="ds-global-track" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <motion.div className="ds-global-fill"
                style={{ background: 'rgba(255,255,255,0.95)' }}
                initial={{ width: 0 }} animate={{ width: '94.3%' }}
                transition={{ duration: 1, ease }} />
            </div>
          </div>

          <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', lineHeight: 1 }}>3</span>
              <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>ítems amb<br /><strong>100% d'acord</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', lineHeight: 1 }}>210</span>
              <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>vots totals<br /><strong>21 × 10 ítems</strong></span>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="panel-right rpt-right" style={{ padding: '1.8rem 2.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: '#0a6b57' }}>Acord per ítem del diagnòstic</p>
          <div className="rpt-diag-list">
            {DIAG_ITEMS.map((item, i) => {
              const itemColor = item.pct === 100 ? '#27ae60' : item.pct >= 90 ? '#0a6b57' : '#e67e22';
              return (
                <motion.div key={item.id} className="rpt-diag-card"
                  style={{ borderLeftColor: itemColor }}
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.04, ease }}>
                  <div className="rpt-diag-card-left">
                    <span className="rpt-diag-id" style={{ color: itemColor }}>{item.id}</span>
                  </div>
                  <div className="rpt-diag-body">
                    <div className="rpt-diag-top">
                      <span className="rpt-diag-title">{item.title}</span>
                      <span className="rpt-diag-pct" style={{ color: itemColor }}>{item.pct}%</span>
                    </div>
                    <div className="rpt-diag-track">
                      <motion.div className="rpt-diag-fill"
                        style={{ background: itemColor }}
                        initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                        transition={{ duration: 0.7, delay: 0.12 + i * 0.05, ease }} />
                    </div>
                  </div>
                  <div className="rpt-diag-votes-col">
                    <span className="rpt-diag-yes">✓ {item.yes}</span>
                    {item.no > 0 && <span className="rpt-diag-no">✗ {item.no}</span>}
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
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ fontSize: '5rem', opacity: 0.45 }}>★</div>
          <h1 className="mirada-ttl" style={{ fontSize: '3.5rem' }}>Distribució</h1>
          <p className="mirada-sub" style={{ fontSize: '1.15rem' }}>281 vots · Mirada Endavant</p>

          <div style={{ marginTop: '1.5rem' }}>
            {GLOBAL_DIST.map((d, i) => (
              <motion.div key={d.key} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginTop: i > 0 ? '0.55rem' : 0,
              }}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, ease }}>
                <span style={{ fontSize: '0.95rem', width: '82px', textAlign: 'right', opacity: 0.95 }}>{d.phase}</span>
                <div style={{
                  flex: 1, height: 14, background: 'rgba(255,255,255,0.15)',
                  borderRadius: 7, overflow: 'hidden',
                }}>
                  <motion.div style={{
                    height: '100%', borderRadius: 7,
                    background: PHASE_COLORS[d.key],
                  }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.pct / maxPct) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.25 + i * 0.08, ease }} />
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, width: '44px' }}>{d.pct}%</span>
              </motion.div>
            ))}
          </div>

          <p style={{ fontSize: '1rem', opacity: 0.9, marginTop: '1.2rem' }}>
            54,8% aposten per l'acció directa o controlada
          </p>
        </motion.div>
      </div>
      <div className="panel-right rpt-right" style={{ padding: '1.8rem 2rem', display: 'flex', flexDirection: 'column' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Top propostes per categoria</p>

          <div className="rpt-cat-grid" style={{ flex: 1 }}>
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
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ fontSize: '5rem', opacity: 0.45 }}>★</div>
          <h1 className="mirada-ttl" style={{ fontSize: '3.5rem' }}>14 Propostes</h1>
          <p className="mirada-sub" style={{ fontSize: '1.15rem' }}>Mirada Endavant — detall complet</p>

          <div className="ds-stat-row" style={{ marginTop: '1.2rem' }}>
            <span className="ds-stat-big">281</span>
            <span className="ds-stat-label">vots totals</span>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.5 }}>
              21 participants × 14 propostes agrupades en 6 dimensions estratègiques.
            </p>
          </div>

          <div style={{ marginTop: '1.2rem' }}>
            {Object.entries(PHASE_COLORS).map(([key, color]) => (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginTop: '0.4rem',
              }}>
                <span style={{
                  width: 14, height: 14, borderRadius: 3,
                  background: color, flexShrink: 0,
                }} />
                <span style={{ fontSize: '0.95rem', opacity: 0.95, textTransform: 'capitalize' as const }}>
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
                        {segments.map(seg => {
                          const pct = Math.round((seg.val / p.total) * 100);
                          return seg.val > 0 ? (
                            <div key={seg.key} className="rpt-prop-seg"
                              style={{
                                width: `${pct}%`,
                                background: PHASE_COLORS[seg.key],
                              }}
                              title={`${seg.key}: ${seg.val} (${pct}%)`}
                            >
                              {pct >= 20 && (
                                <span className="rpt-prop-seg-pct">{pct}</span>
                              )}
                            </div>
                          ) : null;
                        })}
                      </div>
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

// ─── STEP 4: FULL DE RUTA ──────────────────────────────────────────────────────

function ReportRoadmap() {
  return (
    <>
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ fontSize: '5rem', opacity: 0.45 }}>★</div>
          <h1 className="mirada-ttl" style={{ fontSize: '3.5rem' }}>Full de Ruta</h1>
          <p className="mirada-sub" style={{ fontSize: '1.15rem' }}>Del diagnòstic a l'acció</p>

          <p className="intro-text-compact" style={{ marginTop: '1.2rem', opacity: 0.95, fontSize: '1rem' }}>
            Tres horitzons seqüencials que respecten les dependències entre propostes:
            primer líders, després transferència, llavors avaluació.
          </p>

          <div style={{ marginTop: '1.2rem' }}>
            {ROADMAP.map((r, i) => (
              <motion.div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                marginTop: i > 0 ? '0.65rem' : 0, opacity: 0.95
              }}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, ease }}>
                <span style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: r.color, flexShrink: 0,
                  border: '2px solid rgba(255,255,255,0.3)'
                }} />
                <span style={{ fontSize: '1rem' }}>
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
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ fontSize: '5rem', opacity: 0.45 }}>★</div>
          <h1 className="mirada-ttl" style={{ fontSize: '3.5rem' }}>Conclusions</h1>
          <p className="mirada-sub" style={{ fontSize: '1.15rem' }}>Cadena de dependències</p>

          <p className="intro-text-compact" style={{ marginTop: '1rem', opacity: 0.95, fontSize: '1rem' }}>
            Les propostes no són independents. L'ordre d'implementació ve determinat per la seva seqüència lògica.
          </p>

          <div style={{ marginTop: '1.2rem' }}>
            {DEPENDENCY_LAYERS.map((layer, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, ease }}>
                {i > 0 && (
                  <div style={{
                    marginLeft: '7px', height: '12px',
                    borderLeft: '2px solid rgba(255,255,255,0.4)',
                  }} />
                )}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: layer.color, flexShrink: 0,
                    border: '2px solid rgba(255,255,255,0.35)',
                  }} />
                  <div>
                    <span style={{ fontSize: '1rem', fontWeight: 700 }}>
                      {layer.label.split(' — ')[1]}
                    </span>
                    <span style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                      {' '}· {layer.tag}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p style={{ fontSize: '0.95rem', opacity: 0.95, marginTop: '1.2rem', lineHeight: 1.5 }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.95 }}
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
            <p className="rpt-message-title" style={{ color: COLOR }}>El missatge a les direccions</p>
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
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                <span style={{ color: '#e67e22', fontWeight: 600 }}>r = −0,31</span>
                {' '}· Els més crítics volen accelerar, els més alineats volen solidesa — combinar ambdós perfils en equips pilots mixtos.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

// ─── STEP 6: VISIÓ — L'HORITZÓ FINAL ─────────────────────────────────────────

function ReportVision() {
  const layers = [
    { icon: '◉', label: 'Millora de l\'aprenentatge i el benestar de l\'alumnat', sub: 'El nord de tot el que fem', color: '#e74c3c' },
    { icon: '◈', label: 'Transformació real de la pràctica docent a l\'aula', sub: 'El docent ensenya diferent perquè ha après diferent', color: '#e67e22' },
    { icon: '◆', label: 'Cultura professional col·laborativa al centre', sub: 'Comunitats que aprenen juntes, no docents aïllats', color: '#c9922a' },
    { icon: '●', label: 'Desenvolupament professional continu i sostingut', sub: 'Del concert puntual al fil musical permanent', color: '#3498db' },
    { icon: '○', label: 'Condicions organitzatives que ho fan possible', sub: 'Temps, espais, lideratge i recursos al servei de l\'aprenentatge', color: '#27ae60' },
  ];

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ fontSize: '5rem', opacity: 0.45 }}>★</div>
          <h1 className="mirada-ttl" style={{ fontSize: '3rem' }}>L'horitzó</h1>
          <p className="mirada-sub" style={{ fontSize: '1.15rem' }}>Per què fem tot això?</p>

          <p className="intro-text-compact" style={{ marginTop: '1.2rem', opacity: 0.95, fontSize: '1rem', lineHeight: 1.6 }}>
            Tot canvi en el model de formació té un únic criteri de validació:
            <strong style={{ display: 'block', marginTop: '0.6rem', fontSize: '1.15rem' }}>
              l'alumne aprèn més i millor, i el docent se sent més competent i acompanyat.
            </strong>
          </p>

          <p style={{ marginTop: '1rem', fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.5 }}>
            No perseguim canviar la formació per canviar-la. Perseguim que cada hora invertida en creixement professional es tradueixi en millores concretes a l'aula.
          </p>
        </motion.div>
      </div>
      <div className="panel-right rpt-right" style={{ padding: '1.8rem 2.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>De les condicions a l'impacte</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {layers.map((layer, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.1, ease }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.9rem 1.2rem',
                  background: i === 0 ? `${layer.color}10` : 'transparent',
                  borderLeft: `4px solid ${layer.color}`,
                  borderRadius: 'var(--r)',
                }}>
                  <span style={{
                    fontSize: '1.6rem', color: layer.color, flexShrink: 0,
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    width: '2rem', textAlign: 'center',
                  }}>{layer.icon}</span>
                  <div>
                    <span style={{
                      fontSize: i === 0 ? '1.05rem' : '0.95rem',
                      fontWeight: i === 0 ? 700 : 600,
                      color: 'var(--text)',
                      display: 'block',
                    }}>{layer.label}</span>
                    <span style={{
                      fontSize: '0.82rem', color: 'var(--text-muted)',
                      lineHeight: 1.4,
                    }}>{layer.sub}</span>
                  </div>
                </div>
                {i < layers.length - 1 && (
                  <div style={{
                    marginLeft: '2.2rem', height: '18px',
                    borderLeft: '2px dashed var(--border)',
                    display: 'flex', alignItems: 'center', paddingLeft: '0.7rem',
                  }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {['requereix ↓', 'requereix ↓', 'requereix ↓', 'requereix ↓'][i]}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div style={{
            marginTop: '1.2rem', padding: '1rem 1.2rem',
            background: 'var(--surface-alt)', borderRadius: 'var(--r)',
            border: '1px solid var(--border)',
          }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text)' }}>Lectura de baix a dalt:</strong> Sense condicions organitzatives no hi ha desenvolupament; sense desenvolupament no hi ha cultura col·laborativa; sense cultura no hi ha transformació docent; sense transformació docent no hi ha impacte en l'alumnat. <strong style={{ color: '#e74c3c' }}>Cada capa depèn de l'anterior.</strong>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

// ─── STEP 7: ITINERARI INVERS — DEPENDÈNCIES ─────────────────────────────────

function ReportDependencies() {
  const chain = [
    {
      level: 'IMPACTE',
      color: '#e74c3c',
      title: 'Millora de l\'aprenentatge i la convivència',
      items: [
        'Resultats acadèmics i competencials de l\'alumnat',
        'Benestar i clima d\'aula',
        'Indicadors d\'equitat i inclusió',
      ],
      question: 'Com ho sabem?',
    },
    {
      level: 'EVIDÈNCIA',
      color: '#e67e22',
      title: 'Dades i evidències d\'aula',
      items: [
        'Mostres de treball de l\'alumnat (quantitatives i qualitatives)',
        'Registres d\'observació entre iguals',
        'Diaris d\'aula i portafolis docents',
        'Instruments d\'avaluació dinàmica i autorúbriques',
      ],
      question: 'D\'on surten?',
    },
    {
      level: 'TRANSFERÈNCIA',
      color: '#c9922a',
      title: 'Transformació real de la pràctica docent',
      items: [
        'El docent implementa activitats i materials nous a l\'aula',
        'Avaluació dinàmica: el docent monitora el seu propi creixement',
        'Portafoli professional: registre viu d\'experimentació i reflexió',
        'Reflexió compartida sobre el que funciona i el que no',
      ],
      question: 'Què ho fa possible?',
    },
    {
      level: 'SUPORT',
      color: '#3498db',
      title: 'Suport organitzatiu i lideratge per a l\'aprenentatge',
      items: [
        'Acompanyament per implementar a l\'aula (mentoria, codocència)',
        'Temps i recursos per crear i modificar activitats',
        'Orientació en el disseny de propostes d\'aula',
        'Capacitació: competències per dissenyar i implementar',
        'Cura emocional del procés de canvi',
      ],
      question: 'Sobre quins fonaments?',
    },
    {
      level: 'FONAMENTS',
      color: '#27ae60',
      title: 'Preparació, visió i compromís',
      items: [
        'Visió compartida i compromís individual i col·lectiu',
        'Diagnòstic honest i profund del punt de partida',
        'Objectius i propòsit individual i col·lectiu',
        'Teoria del canvi i planificació estratègica',
        'Vincles de confiança i llenguatge compartit',
      ],
      question: '',
    },
  ];

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ fontSize: '5rem', opacity: 0.45 }}>★</div>
          <h1 className="mirada-ttl" style={{ fontSize: '2.5rem' }}>Dependències</h1>
          <p className="mirada-sub" style={{ fontSize: '1.1rem' }}>L'itinerari invers</p>

          <p className="intro-text-compact" style={{ marginTop: '1rem', opacity: 0.95, fontSize: '0.95rem', lineHeight: 1.6 }}>
            Si l'objectiu final és l'impacte en l'alumnat, quina cadena d'accions cal construir?
          </p>
          <p style={{ marginTop: '0.8rem', fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.5 }}>
            Llegit <strong>de dalt a baix</strong>: el que volem aconseguir.
          </p>
          <p style={{ marginTop: '0.3rem', fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.5 }}>
            Llegit <strong>de baix a dalt</strong>: l'ordre en què cal construir-ho.
          </p>

          <motion.p style={{ marginTop: '1.2rem', fontSize: '0.92rem', opacity: 0.9, lineHeight: 1.5, fontStyle: 'italic' }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
            transition={{ delay: 0.6 }}>
            Aquest esquema s'aplica a qualsevol línia temporal: un trimestre, un semestre, un curs o un trienni.
          </motion.p>
        </motion.div>
      </div>
      <div className="panel-right rpt-right" style={{ padding: '1rem 1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>De l'impacte als fonaments</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {chain.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.1, ease }}>
                <div style={{
                  display: 'flex', gap: '0.8rem',
                  padding: '0.6rem 0.8rem',
                  borderLeft: `3px solid ${step.color}`,
                  borderRadius: 'var(--r)',
                  background: i === 0 ? `${step.color}08` : 'transparent',
                }}>
                  <div style={{ flexShrink: 0, width: '70px' }}>
                    <span style={{
                      fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase' as const,
                      color: step.color, letterSpacing: '0.05em',
                      background: `${step.color}15`, padding: '2px 6px', borderRadius: 3,
                    }}>{step.level}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)',
                      display: 'block', marginBottom: '0.25rem',
                    }}>{step.title}</span>
                    {step.items.map((item, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'baseline', gap: '0.4rem',
                        fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5,
                      }}>
                        <span style={{ color: step.color, flexShrink: 0 }}>•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {step.question && (
                  <div style={{
                    marginLeft: '1.5rem', height: '20px',
                    borderLeft: '2px dashed var(--border)',
                    display: 'flex', alignItems: 'center', paddingLeft: '0.7rem',
                  }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                      ↑ {step.question}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ─── STEP 8: FASE ABANS — FONAMENTS I COMPROMÍS ─────────────────────────────

function ReportPhaseAbans() {
  const dynamics = [
    {
      area: 'Visió i compromís',
      color: '#8e44ad',
      items: [
        { name: 'Lectures dialògiques de textos fundacionals', desc: 'Connectar la missió amb la pràctica' },
        { name: 'Taller d\'indagació apreciativa (4D)', desc: 'Descobrir, Somiar, Dissenyar, Desplegar' },
        { name: 'Exercicis d\'escriptura reflexiva', desc: 'Vincular textos amb experiència personal' },
      ]
    },
    {
      area: 'Diagnòstic honest',
      color: '#e67e22',
      items: [
        { name: 'Mapa d\'empatia i User Journey', desc: 'Què sent, veu, escolta i fa l\'alumnat?' },
        { name: 'Anàlisi de causes (Ishikawa, 5 per què)', desc: 'Arribar a l\'arrel dels problemes' },
        { name: 'DAFO participatiu i dades del centre', desc: 'Fortaleses, debilitats, oportunitats, amenaces' },
      ]
    },
    {
      area: 'Objectius i teoria del canvi',
      color: '#3498db',
      items: [
        { name: 'Fórmula: Per a què → Què → Com', desc: 'Impacte alumnat → Focus → Activitats' },
        { name: 'Preguntes indagatòries', desc: 'Guiar la recerca i l\'experimentació' },
        { name: 'Revisió d\'evidències de la recerca', desc: 'Decisions basades en dades, no en intuïcions' },
      ]
    },
    {
      area: 'Vincles i llenguatge',
      color: '#27ae60',
      items: [
        { name: 'Construcció de llenguatge compartit', desc: 'Significats comuns al voltant de conceptes clau' },
        { name: 'Cura personalis i vincle fratern', desc: 'Confiança, benestar i missió compartida a l\'equip' },
        { name: 'Normes i responsabilitats de la CPA', desc: 'Rols, freqüència i rituals de funcionament' },
      ]
    },
  ];

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ fontSize: '5rem', opacity: 0.45 }}>★</div>
          <h1 className="mirada-ttl" style={{ fontSize: '3rem' }}>ABANS</h1>
          <p className="mirada-sub" style={{ fontSize: '1.1rem' }}>Context · Experiència · Reflexió</p>

          <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.5 }}>
              <strong>No s'arriba a la formació en blanc.</strong> Abans de qualsevol acció formativa cal preparar el terreny.
            </p>
            <p style={{ fontSize: '0.92rem', opacity: 0.85, lineHeight: 1.5 }}>
              Aquesta fase és on es construeixen els fonaments sense els quals el Durant i el Després no funcionen.
            </p>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--r)' }}>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.5 }}>
              <strong>Clau:</strong> La reflexió de l'Abans no és abstracta — es basa en dades reals del context propi i en la vivència personal del docent.
            </p>
          </div>
        </motion.div>
      </div>
      <div className="panel-right rpt-right" style={{ padding: '1.5rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Dinàmiques i dispositius de la fase Abans</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {dynamics.map((group, gi) => (
              <motion.div key={gi}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + gi * 0.1, ease }}
                style={{ borderRadius: 'var(--r)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{
                  padding: '0.5rem 0.9rem',
                  background: `${group.color}10`,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{group.area}</span>
                </div>
                <div style={{ padding: '0.5rem 0.9rem' }}>
                  {group.items.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'baseline', gap: '0.5rem',
                      padding: '0.3rem 0',
                      borderBottom: i < group.items.length - 1 ? '1px solid var(--border-light)' : 'none',
                    }}>
                      <span style={{ color: group.color, fontSize: '0.75rem', flexShrink: 0 }}>▸</span>
                      <div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{item.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>— {item.desc}</span>
                      </div>
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

// ─── STEP 9: FASE DURANT — EXPERIÈNCIA I ACCIÓ ──────────────────────────────

function ReportPhaseDurant() {
  const dynamics = [
    {
      area: 'Aprenentatge actiu',
      color: '#3498db',
      items: [
        { name: 'Tallers participatius i simulacions', desc: 'Viure l\'experiència com a aprenent abans de ser docent' },
        { name: 'Disseny col·laboratiu de propostes d\'aula', desc: 'Crear junts el que s\'aplicarà a l\'aula' },
        { name: 'Tertúlies pedagògiques dialògiques', desc: 'Lectura compartida i diàleg sobre recerca educativa' },
      ]
    },
    {
      area: 'Reflexió durant la pràctica',
      color: '#e67e22',
      items: [
        { name: 'Observació entre iguals a l\'aula', desc: 'Pre-observació → observació → post-reflexió' },
        { name: 'Lesson Study', desc: 'Disseny col·laboratiu → observar alumnat → revisar → reensenyar' },
        { name: 'Modelatge d\'experts i codocència', desc: 'Acompanyament in situ, no consells des de fora' },
      ]
    },
    {
      area: 'Implementació acompanyada',
      color: '#27ae60',
      items: [
        { name: 'Aplicació d\'activitats i materials a l\'aula', desc: 'Experimentar el que s\'ha dissenyat al taller' },
        { name: 'Mentoria i coaching pedagògic', desc: 'Acompanyament personalitzat en el procés d\'aplicació' },
        { name: 'Temps i recursos per crear i ajustar materials', desc: 'Protecció institucional del temps de preparació' },
      ]
    },
    {
      area: 'Cura emocional',
      color: '#8e44ad',
      items: [
        { name: 'Espais de suport emocional', desc: 'Reconèixer la complexitat emocional del canvi' },
        { name: 'Feedback positiu i orientat al creixement', desc: 'Reconeixement primer, millora després' },
        { name: 'Examen de consciència sobre la pràctica', desc: 'Rutina reflexiva sobre pensaments, paraules i accions' },
      ]
    },
  ];

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ fontSize: '5rem', opacity: 0.45 }}>★</div>
          <h1 className="mirada-ttl" style={{ fontSize: '3rem' }}>DURANT</h1>
          <p className="mirada-sub" style={{ fontSize: '1.1rem' }}>Reflexió · Acció</p>

          <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.5 }}>
              <strong>L'experiència activa no és rebre, és construir.</strong> El docent experimenta, aplica i reflexiona en temps real.
            </p>
            <p style={{ fontSize: '0.92rem', opacity: 0.85, lineHeight: 1.5 }}>
              No sols el que passa al taller, sinó tot el procés d'aplicació a l'aula amb acompanyament.
            </p>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--r)' }}>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.5 }}>
              <strong>3 nivells de reflexivitat</strong> (Van Manen): tècnica (procediments) → pràctica (creences) → crítica (propòsit i ètica)
            </p>
          </div>
        </motion.div>
      </div>
      <div className="panel-right rpt-right" style={{ padding: '1.5rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Dinàmiques i dispositius de la fase Durant</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {dynamics.map((group, gi) => (
              <motion.div key={gi}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + gi * 0.1, ease }}
                style={{ borderRadius: 'var(--r)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{
                  padding: '0.5rem 0.9rem',
                  background: `${group.color}10`,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{group.area}</span>
                </div>
                <div style={{ padding: '0.5rem 0.9rem' }}>
                  {group.items.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'baseline', gap: '0.5rem',
                      padding: '0.3rem 0',
                      borderBottom: i < group.items.length - 1 ? '1px solid var(--border-light)' : 'none',
                    }}>
                      <span style={{ color: group.color, fontSize: '0.75rem', flexShrink: 0 }}>▸</span>
                      <div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{item.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>— {item.desc}</span>
                      </div>
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

// ─── STEP 10: FASE DESPRÉS — TRANSFERÈNCIA I AVALUACIÓ ───────────────────────

function ReportPhaseDespres() {
  const dynamics = [
    {
      area: 'Transferència a l\'aula',
      color: '#e74c3c',
      items: [
        { name: 'Implementació real d\'activitats i materials', desc: 'El docent aplica el que ha dissenyat al context propi' },
        { name: 'Anàlisi de casos reals', desc: 'Relator descriu → facilitador modera → oients extreuen aprenentatges' },
        { name: 'Incidents crítics', desc: 'Reflexió profunda sobre moments decisius de la pràctica' },
      ]
    },
    {
      area: 'Seguiment i evidències',
      color: '#e67e22',
      items: [
        { name: 'Portafoli professional docent', desc: 'Registre viu d\'experimentació, reflexió i evolució' },
        { name: 'Avaluació dinàmica i autorúbriques', desc: 'El docent monitora el seu propi creixement competencial' },
        { name: 'Recull de mostres de treball de l\'alumnat', desc: 'Evidències quantitatives i qualitatives de millora' },
      ]
    },
    {
      area: 'Reflexió post-pràctica',
      color: '#3498db',
      items: [
        { name: 'Planificació reflexiva conjunta', desc: 'Què vam planificar, què va passar, què canviem' },
        { name: 'Investigació a l\'aula', desc: 'Dissenyar, implementar, analitzar i difondre resultats' },
        { name: 'Feedback 360° i autoavaluació', desc: 'Múltiples perspectives sobre l\'evolució professional' },
      ]
    },
    {
      area: 'Impacte en l\'alumnat',
      color: '#27ae60',
      items: [
        { name: 'Indicadors d\'aprenentatge i benestar', desc: 'Mesura del canvi real en l\'alumnat' },
        { name: 'Comunicació de resultats a la comunitat', desc: 'La millora visible, comunicable i transferible' },
        { name: 'Avaluació del trienni i actualització del pla', desc: 'Cicle complet: avaluar per millorar el pla' },
      ]
    },
  ];

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ fontSize: '5rem', opacity: 0.45 }}>★</div>
          <h1 className="mirada-ttl" style={{ fontSize: '3rem' }}>DESPRÉS</h1>
          <p className="mirada-sub" style={{ fontSize: '1.1rem' }}>Avaluació · Impacte</p>

          <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.5 }}>
              <strong>La fase abandonada que hauria de ser la protagonista.</strong> Aquí és on es demostra si la formació ha servit.
            </p>
            <p style={{ fontSize: '0.92rem', opacity: 0.85, lineHeight: 1.5 }}>
              Sense Després, la formació és un acte de fe. Amb Després, és un procés mesurable i millorable.
            </p>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--r)' }}>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.5 }}>
              <strong>Recordem:</strong> 50% de les direccions van votar Pilotar — saben que cal prudència i acompanyament, no activació massiva.
            </p>
          </div>
        </motion.div>
      </div>
      <div className="panel-right rpt-right" style={{ padding: '1.5rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Dinàmiques i dispositius de la fase Després</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {dynamics.map((group, gi) => (
              <motion.div key={gi}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + gi * 0.1, ease }}
                style={{ borderRadius: 'var(--r)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{
                  padding: '0.5rem 0.9rem',
                  background: `${group.color}10`,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{group.area}</span>
                </div>
                <div style={{ padding: '0.5rem 0.9rem' }}>
                  {group.items.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'baseline', gap: '0.5rem',
                      padding: '0.3rem 0',
                      borderBottom: i < group.items.length - 1 ? '1px solid var(--border-light)' : 'none',
                    }}>
                      <span style={{ color: group.color, fontSize: '0.75rem', flexShrink: 0 }}>▸</span>
                      <div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{item.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>— {item.desc}</span>
                      </div>
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

// ─── STEP 11: PRIORITATS — EL XOC ENTRE DESIG I SEQÜÈNCIA ──────────────────

const PRIORITY_ANALYSIS = [
  {
    status: 'activar',
    label: 'ACTIVAR JA',
    color: '#27ae60',
    desc: 'Sense dependències prèvies — es pot començar demà',
    proposals: [
      { name: 'Autonomia de centre', votePct: 47.6, reason: 'Sobirania del centre per reubicar temps i energia' },
      { name: 'Abans — preparació i compromís', votePct: 42.9, reason: 'Diagnosi, objectius i teoria del canvi' },
      { name: 'Durant — experiència activa', votePct: 47.6, reason: 'Tallers, simulacions, disseny col·laboratiu' },
      { name: 'Banc de talents intern', votePct: 35.0, reason: 'Identificar el lideratge intern de la xarxa' },
    ],
  },
  {
    status: 'preparar',
    label: 'PREPARAR AMB URGÈNCIA',
    color: '#c9922a',
    desc: 'El coll d\'ampolla — sense això, el Després no funciona',
    proposals: [
      { name: 'Lideratge per a la transferència', votePct: 40.0, reason: 'Formació intensiva dels responsables pedagògics — 40% voten Preparar, i tenen raó' },
    ],
  },
  {
    status: 'pilotar',
    label: 'PILOTAR (Any 2)',
    color: '#3498db',
    desc: 'Quan els líders estiguin formats — no abans',
    proposals: [
      { name: 'Després — el focus real', votePct: 50.0, reason: '50% voten Pilotar — prudència encertada, cal acompanyament' },
    ],
  },
  {
    status: 'diferir',
    label: 'DIFERIR (Any 3)',
    color: '#8e44ad',
    desc: 'Malgrat el desig d\'activar — primer cal transferència real',
    proposals: [
      { name: 'Més enllà de la satisfacció', votePct: 45.0, reason: '45% volen activar — però no es pot mesurar impacte sense transferència' },
      { name: 'Avaluació dinàmica', votePct: 31.6, reason: 'S\'integrarà com a eina dins dels pilots del Després' },
      { name: 'Recull d\'evidències d\'aula', votePct: 36.8, reason: 'Sense pràctica transferida, no hi ha res a recollir' },
      { name: 'Auditoria d\'impacte', votePct: 42.1, reason: 'Última peça: requereix tot l\'anterior en marxa' },
    ],
  },
];

function ReportPriorities() {
  return (
    <>
      <div className="panel-left intro-panel" style={{ background: '#0a6b57' }}>
        <motion.div className="intro-left-content"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}>
          <div className="mirada-num" style={{ fontSize: '5rem', opacity: 0.45 }}>★</div>
          <h1 className="mirada-ttl" style={{ fontSize: '2.8rem' }}>Prioritats</h1>
          <p className="mirada-sub" style={{ fontSize: '1.1rem' }}>Desig vs seqüència lògica</p>

          <p className="intro-text-compact" style={{ marginTop: '1rem', opacity: 0.95, fontSize: '0.92rem', lineHeight: 1.6 }}>
            Les votacions expressen <strong>què volen</strong> les direccions. L'anàlisi de dependències revela <strong>què es pot fer</strong> en cada moment.
          </p>

          <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--r)' }}>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.5 }}>
              <strong>El 45% que vol activar l'avaluació d'impacte</strong> no diu que es pugui fer demà — diu que vol saber si la formació serveix. Aquesta pregunta només es pot respondre quan hi hagi transferència real.
            </p>
          </div>

          <motion.p style={{ marginTop: '0.8rem', fontSize: '0.88rem', opacity: 0.85, lineHeight: 1.5, fontStyle: 'italic' }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.85 }}
            transition={{ delay: 0.5 }}>
            Seqüenciar no és frenar. És construir bé.
          </motion.p>
        </motion.div>
      </div>
      <div className="panel-right rpt-right" style={{ padding: '1.2rem 1.8rem' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="rpt-section-label" style={{ color: COLOR }}>Seqüència recomanada vs votacions</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {PRIORITY_ANALYSIS.map((phase, pi) => (
              <motion.div key={pi}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + pi * 0.1, ease }}
                style={{ borderRadius: 'var(--r)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{
                  padding: '0.45rem 0.9rem',
                  background: `${phase.color}12`,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase' as const,
                      color: '#fff', background: phase.color,
                      padding: '2px 8px', borderRadius: 3, letterSpacing: '0.05em',
                    }}>{phase.label}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{phase.desc}</span>
                </div>
                <div style={{ padding: '0.4rem 0.9rem' }}>
                  {phase.proposals.map((p, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'baseline', gap: '0.5rem',
                      padding: '0.3rem 0',
                      borderBottom: i < phase.proposals.length - 1 ? '1px solid var(--border-light)' : 'none',
                    }}>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, color: phase.color,
                        flexShrink: 0, width: '38px', textAlign: 'right',
                      }}>{p.votePct}%</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.3rem' }}>— {p.reason}</span>
                      </div>
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

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────

export function ReportSlide({ step }: { step: number }) {
  switch (step) {
    case 0: return <ReportExecSummary />;
    case 1: return <ReportDiagnostic />;
    case 2: return <ReportDistribution />;
    case 3: return <ReportAllProposals />;
    case 4: return <ReportRoadmap />;
    case 5: return <ReportConclusions />;
    case 6: return <ReportVision />;
    case 7: return <ReportDependencies />;
    case 8: return <ReportPhaseAbans />;
    case 9: return <ReportPhaseDurant />;
    case 10: return <ReportPhaseDespres />;
    case 11: return <ReportPriorities />;
    default: return <ReportExecSummary />;
  }
}
