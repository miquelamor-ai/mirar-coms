import { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import { comsData, type Mirada, type Block, type Item } from './data/comsContent';
import {
  ChevronRight, ChevronLeft, Check, HelpCircle, X,
  Rocket, FlaskConical, Construction, Brain, Ban, Send,
  BarChart2, EyeOff, Eye, QrCode, RotateCcw, Trash2
} from 'lucide-react';
import { LiveChart } from './components/LiveChart';
import { ReportSlide } from './components/ReportSlides';
import { motion, AnimatePresence } from 'framer-motion';

// ─── FLAT SLIDE STRUCTURE ─────────────────────────────────────────────────────

type SlideType = 'mirada-intro' | 'block' | 'item' | 'dashboard' | 'endavant-vote-intro' | 'correlation' | 'quiz' | 'report';

interface FlatSlide {
  type: SlideType;
  slideKey: string;
  mirada: Mirada;
  block?: Block;
  blockIndex: number;
  item?: Item;
  itemIndex: number;
  totalBlocks: number;
  totalItems: number;
  introStep?: number;
}

const COLORS: Record<string, string> = {
  'quiz-opening': '#c0392b',
  'preamble': '#8e44ad',
  'mirada-fora': '#3498db',
  'mirada-dins': '#e67e22',
  'mirada-endavant': '#27ae60',
  'report': '#16a085'
};

const QUIZ = {
  slideId: 'quiz-opening',
  proposalId: 'q1',
  question: "Segons la recerca més rigorosa (Hattie, UCL, OCDE), quin d'aquests factors té l'evidència més demostrada per millorar l'aprenentatge dels alumnes?",
  options: [
    { key: 'lideratge', label: 'Lideratge pedagògic i cultura de centre' },
    { key: 'clima', label: "Clima d'aula segur i d'altes expectatives" },
    { key: 'desenvolupament', label: 'Desenvolupament professional' },
    { key: 'recursos', label: 'Recursos i materials/tecnologia' },
    { key: 'visio', label: 'Visió compartida i direcció estratègica' },
  ],
  correctKey: 'desenvolupament',
  audienceUrl: 'https://mirar-coms.vercel.app',
};

const QUIZ_MIRADA: Mirada = {
  id: 'quiz-opening',
  title: 'Pregunta Inicial',
  subtitle: 'Votem abans de començar',
  number: '?',
  color: '#c0392b',
  intro: '',
  layout: 'blocks-only',
  blocks: [],
};

function buildSlides(): FlatSlide[] {
  const result: FlatSlide[] = [];

  // Opening quiz slide (before all miradas)
  result.push({
    type: 'quiz',
    slideKey: 'quiz:opening',
    mirada: QUIZ_MIRADA,
    blockIndex: -1, itemIndex: -1,
    totalBlocks: 0, totalItems: 0,
  });

  for (const mirada of comsData) {
    // Special handling for report section
    if (mirada.id === 'report') {
      for (let step = 0; step < 5; step++) {
        result.push({
          type: 'report',
          slideKey: `report:s${step}`,
          mirada, blockIndex: -1, itemIndex: -1,
          totalBlocks: 0, totalItems: 0, introStep: step,
        });
      }
      continue;
    }

    const introSlide: FlatSlide = {
      type: 'mirada-intro', slideKey: `${mirada.id}:intro`,
      mirada, blockIndex: -1, itemIndex: -1,
      totalBlocks: mirada.blocks.length, totalItems: 0, introStep: 0,
    };

    if (mirada.layout === 'reveal-only') {
      result.push(introSlide);
      mirada.blocks.forEach((_, si) => result.push({
        type: 'mirada-intro',
        slideKey: `${mirada.id}:intro:s${si + 1}`,
        mirada, blockIndex: -1, itemIndex: -1,
        totalBlocks: mirada.blocks.length, totalItems: 0, introStep: si + 1,
      }));
    } else {
      result.push(introSlide);
      mirada.blocks.forEach((block, bi) => result.push({
        type: 'block',
        slideKey: `${mirada.id}:b${bi}`,
        mirada, block, blockIndex: bi, itemIndex: -1,
        totalBlocks: mirada.blocks.length, totalItems: block.items.length,
      }));
      // After blocks: vote-intro + dashboard for mirada-endavant, only dashboard for mirada-dins
      if (mirada.id === 'mirada-endavant') {
        result.push({
          type: 'endavant-vote-intro',
          slideKey: 'mirada-endavant:vote-intro',
          mirada, blockIndex: -1, itemIndex: -1,
          totalBlocks: 0, totalItems: 0,
        });
      }
      if (mirada.id === 'mirada-dins' || mirada.id === 'mirada-endavant') {
        result.push({
          type: 'dashboard',
          slideKey: `${mirada.id}:dashboard`,
          mirada, blockIndex: -1, itemIndex: -1,
          totalBlocks: 0, totalItems: 0,
        });
      }
      if (mirada.id === 'mirada-endavant') {
        result.push({
          type: 'correlation',
          slideKey: 'mirada-endavant:correlation',
          mirada, blockIndex: -1, itemIndex: -1,
          totalBlocks: 0, totalItems: 0,
        });
      }
    }
  }

  return result;
}

function normalizeKey(key: string): string {
  return key.includes(':') ? key : `${key}:intro`;
}

const allSlides = buildSlides();

// ─── QUIZ COMPONENTS ──────────────────────────────────────────────────────────

function QuizVotePanel({ myVotes, onVote }: {
  myVotes: Record<string, string>;
  onVote: (choice: string, itemId: string, sectionId: string) => void;
}) {
  const selected = myVotes[QUIZ.proposalId];
  return (
    <div className="quiz-vote-wrap">
      <div className="quiz-vote-header">
        <span className="quiz-vote-tag">❓ Pregunta inicial</span>
        <p className="quiz-vote-question">{QUIZ.question}</p>
      </div>
      <div className="quiz-vote-options">
        {QUIZ.options.map((opt, i) => (
          <button key={opt.key}
            className={`quiz-vote-opt${selected === opt.key ? ' selected' : ''}`}
            onClick={() => onVote(opt.key, QUIZ.proposalId, QUIZ.slideId)}>
            <span className="quiz-opt-num">{i + 1}</span>
            <span className="quiz-opt-label">{opt.label}</span>
            {selected === opt.key && <Check size={15} className="quiz-opt-check" />}
          </button>
        ))}
      </div>
      {selected ? (
        <p className="quiz-vote-hint">✓ Resposta registrada. Pots canviar-la fins que el presentador continuï.</p>
      ) : (
        <p className="quiz-vote-hint">Selecciona una opció per votar.</p>
      )}
    </div>
  );
}

function QuizSlide() {
  const [votes, setVotes] = useState<{ session_id: string; choice: string }[]>([]);
  const [revealed, setRevealed] = useState(false);
  const color = COLORS['quiz-opening'];

  useEffect(() => {
    let mounted = true;
    const fetchVotes = async () => {
      const { data } = await supabase.from('coms_votes')
        .select('session_id, choice')
        .eq('slide_id', QUIZ.slideId)
        .eq('proposal_id', QUIZ.proposalId);
      if (mounted) setVotes(data || []);
    };
    fetchVotes();
    const interval = setInterval(fetchVotes, 2000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const counts: Record<string, number> = Object.fromEntries(QUIZ.options.map(o => [o.key, 0]));
  votes.forEach(v => { if (v.choice in counts) counts[v.choice]++; });
  const participantCount = new Set(votes.map(v => v.session_id)).size;
  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <>
      <div className="panel-left quiz-left" style={{ background: `linear-gradient(160deg, #1a0a0a 0%, #2c0e0e 100%)` }}>
        <div className="intro-left-content">
          <span className="quiz-slide-tag" style={{ color }}>❓ Pregunta inicial</span>
          <p className="quiz-slide-question">{QUIZ.question}</p>
          <div className="quiz-qr-block">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(QUIZ.audienceUrl)}`}
              alt="QR Code" className="quiz-qr-img" />
            <code className="quiz-qr-url">{QUIZ.audienceUrl}</code>
          </div>
        </div>
      </div>

      <div className="panel-right quiz-right">
        <div className="quiz-right-header">
          <span className="ds-stat-row">
            <span className="ds-stat-big">{participantCount}</span>
            <span className="ds-stat-label">respostes</span>
          </span>
          <button
            className={`quiz-reveal-btn${revealed ? ' revealed' : ''}`}
            style={revealed ? { background: '#2ecc7122', borderColor: '#2ecc71', color: '#2ecc71' } : { borderColor: color, color }}
            onClick={() => setRevealed(v => !v)}>
            {revealed ? '✓ Ocultar resposta' : '▶ Revelar resposta correcta'}
          </button>
        </div>

        <div className="quiz-result-bars">
          {QUIZ.options.map((opt, i) => {
            const count = counts[opt.key] || 0;
            const isCorrect = opt.key === QUIZ.correctKey;
            const highlight = revealed && isCorrect;
            const barPct = (count / maxCount) * 100;
            return (
              <div key={opt.key} className={`quiz-result-row${highlight ? ' correct' : ''}`}>
                <span className="quiz-result-num" style={{ color: highlight ? '#2ecc71' : 'var(--text-muted)' }}>{i + 1}</span>
                <div className="quiz-result-body">
                  <span className="quiz-result-label" style={{ color: highlight ? '#2ecc71' : 'var(--text)' }}>
                    {opt.label}
                    {highlight && <Check size={14} style={{ display: 'inline', marginLeft: '0.4rem', verticalAlign: 'middle' }} />}
                  </span>
                  <div className="quiz-result-track">
                    <motion.div className="quiz-result-fill"
                      style={{ background: highlight ? '#2ecc71' : `${color}99` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      transition={{ duration: 0.5 }} />
                  </div>
                </div>
                <span className="quiz-result-count" style={{ color: highlight ? '#2ecc71' : 'var(--text-muted)' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── MIRADA INTRO SLIDE ───────────────────────────────────────────────────────

function IntroSlide({ slide }: { slide: FlatSlide }) {
  const { mirada } = slide;
  const step = slide.introStep ?? 0;
  const color = COLORS[mirada.id];

  if (step === 0) {
    return (
      <>
        <div className="panel-left intro-panel" style={{ background: color }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="intro-left-content"
          >
            <div className="mirada-num">{mirada.number}</div>
            <h1 className="mirada-ttl">{mirada.title}</h1>
            <p className="mirada-sub">{mirada.subtitle}</p>
            <div className="intro-blocks-preview">
              {mirada.blocks.map((b, i) => (
                <motion.div key={b.id} className="intro-block-chip"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}>
                  {b.title}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="panel-right intro-right">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}>
            <div className="intro-label" style={{ color }}>Introducció</div>
            <blockquote className="intro-quote">{mirada.intro}</blockquote>
            {mirada.illustration && (
              <motion.div className="intro-illustration" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 0.6 }}>
                <img src={mirada.illustration} className="sketch-img" alt="" />
              </motion.div>
            )}
            <div className="intro-items-count">
              <p className="count-label">{mirada.blocks.length} apartats</p>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  const revealedBlocks = mirada.blocks.slice(0, step);
  return (
    <>
      <div className="panel-left intro-panel" style={{ background: color }}>
        <div className="intro-left-content">
          <div className="mirada-num">{mirada.number}</div>
          <h1 className="mirada-ttl">{mirada.title}</h1>
          <p className="mirada-sub">{mirada.subtitle}</p>
          <p className="intro-text-compact">{mirada.intro}</p>
        </div>
      </div>
      <div className="panel-right reveal-right">
        <div className="reveal-chips-list">
          {revealedBlocks.map((block, i) => {
            const isNew = i === revealedBlocks.length - 1;
            return (
              <motion.div key={block.id} className="reveal-chip"
                initial={isNew ? { opacity: 0, x: -28 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={isNew ? { duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] } : { duration: 0.18 }}>
                <div className="reveal-chip-num" style={{ color }}>{String(i + 1).padStart(2, '0')}</div>
                <h3 className="reveal-chip-title" style={{ color }}>{block.title}</h3>
                <p className="reveal-chip-summary">{block.summary}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── BLOCK (APARTAT) SLIDE ────────────────────────────────────────────────────

function BlockSlide({ slide }: { slide: FlatSlide }) {
  const { mirada, block, blockIndex, totalBlocks } = slide;
  if (!block) return null;
  const color = COLORS[mirada.id];

  return (
    <>
      <div className="panel-left" style={{ background: `linear-gradient(155deg, var(--bg) 0%, ${color}12 100%)` }}>
        <div className="accent-line" style={{ background: `linear-gradient(to bottom, transparent, ${color}90, transparent)` }} />
        <div>
          <p className="side-label">Mirada</p>
          <div className="side-num" style={{ color }}>{mirada.number}</div>
          <h2 className="side-ttl" style={{ color }}>{mirada.title}</h2>
          <div className="block-nav">
            {mirada.blocks.map((b, i) => (
              <div key={b.id} className="block-nav-item"
                style={{
                  color: i === blockIndex ? color : 'var(--text-dim)',
                  fontWeight: i === blockIndex ? 600 : 400,
                  background: i === blockIndex ? `${color}12` : 'transparent',
                  borderRadius: '6px', padding: '0.3rem 0.5rem', margin: '0 -0.5rem',
                }}>
                <div className="block-nav-dot" style={{ background: i === blockIndex ? color : 'var(--border)', flexShrink: 0 }} />
                <span>{b.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="panel-right">
        <AnimatePresence mode="wait">
          <motion.div key={block.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <div className="block-header">
              <div>
                <p className="block-meta">{blockIndex + 1} de {totalBlocks}</p>
                <h2 className="block-title">{block.title}</h2>
              </div>
            </div>
            <p className="block-summary">{block.summary}</p>
            {block.illustration && (
              <motion.div className="block-illustration" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <img src={block.illustration} className="sketch-img" alt="" style={{ maxWidth: '400px', margin: '1rem 0' }} />
              </motion.div>
            )}
            {block.items.length > 0 ? (
              <div className="block-items-grid">
                {block.items.map((item, i) => (
                  <motion.div key={item.id} className="block-item-card"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                    <div>
                      <span className="block-item-num" style={{ color }}>{blockIndex + 1}.{String(i + 1).padStart(2, '0')}</span>
                      <p className="block-item-title">{item.title}</p>
                      <p className="block-item-preview">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : block.keyPoints && (
              <ul className="key-points" style={{ marginTop: '1.25rem' }}>
                {block.keyPoints.map((pt, i) => (
                  <motion.li key={i} className="key-point" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }}>
                    <span className="kp-dot" style={{ background: color }} />{pt}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

// ─── ITEM (SUBAPARTAT) SLIDE ──────────────────────────────────────────────────

interface ItemSlideProps {
  slide: FlatSlide;
  isPresenter: boolean;
  isVotingOpen: boolean;
  showResults: boolean;
  contributions: any[];
  handleVote: (choice: string, itemId: string, sectionId: string) => void;
  submitIdea: () => void;
  newIdea: string;
  setNewIdea: (v: string) => void;
}

function ItemSlide({ slide, isPresenter, isVotingOpen, showResults, contributions, handleVote, submitIdea, newIdea, setNewIdea }: ItemSlideProps) {
  const { mirada, block, item, itemIndex, totalItems } = slide;
  if (!block || !item) return null;
  const color = COLORS[mirada.id];

  const VOTE_OPTIONS = item.votingType === 'decision'
    ? [
      { key: 'activar', icon: <Rocket size={13} />, label: 'Activar', color: '#27ae60' },
      { key: 'pilotar', icon: <FlaskConical size={13} />, label: 'Pilotar', color: '#3498db' },
      { key: 'preparar', icon: <Construction size={13} />, label: 'Preparar', color: '#c9922a' },
      { key: 'reflexionar', icon: <Brain size={13} />, label: 'Repensar', color: '#8e44ad' },
      { key: 'desestimar', icon: <Ban size={13} />, label: 'No', color: '#e74c3c' },
    ]
    : [
      { key: 'confirmar', icon: <Check size={14} />, label: 'Confirmar', color: '#27ae60' },
      { key: 'dubtar', icon: <HelpCircle size={14} />, label: 'Dubtar', color: '#c9922a' },
      { key: 'denegar', icon: <X size={14} />, label: 'Denegar', color: '#e74c3c' },
    ];

  return (
    <>
      <div className="panel-left" style={{ background: `linear-gradient(155deg, var(--bg) 0%, ${color}10 100%)` }}>
        <div className="accent-line" style={{ background: `linear-gradient(to bottom, transparent, ${color}80, transparent)` }} />
        <div>
          <p className="side-label">Mirada</p>
          <div className="side-num" style={{ color }}>{mirada.number}</div>
          <h2 className="side-ttl" style={{ color }}>{mirada.title}</h2>
          <div className="block-breadcrumb" style={{ borderColor: `${color}30`, color }}>{block.title}</div>
          <div className="items-nav">
            {block.items.map((it, i) => (
              <div key={it.id} className="item-nav-row"
                style={{
                  color: i === itemIndex ? color : 'var(--text-dim)',
                  fontWeight: i === itemIndex ? 600 : 400,
                  background: i === itemIndex ? `${color}12` : 'transparent',
                  borderRadius: '5px', padding: '0.25rem 0.45rem', margin: '0 -0.45rem',
                }}>
                <div className="item-nav-dot" style={{ background: i === itemIndex ? color : 'var(--border)', flexShrink: 0 }} />
                <span>{it.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="panel-right">
        <AnimatePresence mode="wait">
          <motion.div key={item.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <div className="item-header">
              <p className="item-meta">{itemIndex + 1} de {totalItems}</p>
              <h2 className="item-title">{item.title}</h2>
            </div>
            <p className="item-content">{item.content}</p>
            {item.keyPoints && (
              <ul className="key-points">
                {item.keyPoints.map((pt, i) => (
                  <motion.li key={i} className="key-point" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }}>
                    <span className="kp-dot" style={{ background: color }} />{pt}
                  </motion.li>
                ))}
              </ul>
            )}
            {item.interactive && (
              <div className="interactive-divider">
                {isPresenter ? (
                  showResults && <LiveChart slideId={mirada.id} proposalId={item.id} type={item.votingType === 'decision' ? 'decision' : 'validation'} />
                ) : isVotingOpen ? (
                  <div className={item.votingType === 'decision' ? 'vote-grid' : 'validate-grid'}>
                    {VOTE_OPTIONS.map(v => (
                      <button key={v.key} className={item.votingType === 'decision' ? 'vote-btn' : 'validate-btn'}
                        onClick={() => handleVote(v.key, item.id, mirada.id)}
                        style={{ '--vote-color': v.color } as React.CSSProperties}>
                        <span style={{ color: v.color }}>{v.icon}</span>
                        <span>{v.label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="voting-closed">{isPresenter ? 'Votacions tancades' : 'Espai de reflexió'}</div>
                )}
                {!isPresenter && (
                  <div className="idea-input-group">
                    <input className="idea-input" type="text" placeholder="Tens una aportació?"
                      value={newIdea} onChange={e => setNewIdea(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submitIdea()} />
                    <button className="btn-send" onClick={submitIdea}><Send size={15} /></button>
                  </div>
                )}
              </div>
            )}
            {isPresenter && contributions.length > 0 && (
              <div className="contributions-panel">
                <p className="contrib-label">Bústia de la sala</p>
                {contributions.slice(0, 4).map(c => (
                  <div key={c.id} className="contribution-item">"{c.content}"</div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

// ─── VOTING PANEL (AUDIENCE) ──────────────────────────────────────────────────

const ENDAVANT_OPTS = [
  { key: 'desestimar', label: 'Desestimar', color: '#e74c3c' },
  { key: 'reflexionar', label: 'Reflexionar', color: '#8e44ad' },
  { key: 'preparar', label: 'Preparar', color: '#c9922a' },
  { key: 'pilotar', label: 'Pilotar', color: '#3498db' },
  { key: 'activar', label: 'Activar', color: '#27ae60' },
];

function VotingPanel({ mirada, myVotes, onVote, onReset }: {
  mirada: Mirada;
  myVotes: Record<string, string>;
  onVote: (choice: string, itemId: string, sectionId: string) => void;
  onReset: () => void;
}) {
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const color = COLORS[mirada.id];
  const isMiradaDins = mirada.id === 'mirada-dins';
  const allItems = mirada.blocks.flatMap((b, bi) =>
    b.items.map((item, ii) => ({ ...item, blockTitle: b.title, blockIdx: bi, itemIdx: ii }))
  );

  return (
    <div className="voting-panel">
      <div className="voting-header" style={{ borderColor: `${color}30` }}>
        <span className="voting-num" style={{ color }}>{mirada.number}</span>
        <div style={{ flex: 1 }}>
          <h2 className="voting-title" style={{ color }}>{mirada.title}</h2>
          <p className="voting-subtitle">{mirada.subtitle}</p>
        </div>
        {Object.keys(myVotes).length > 0 && (
          <button className="vp-reset-btn" onClick={onReset} title="Esborrar tots els meus vots">
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>

      <div className="voting-items-list">
        {allItems.map((item) => (
          <div key={item.id} className="voting-item">
            <div className="voting-item-header">
              <span className="voting-item-num" style={{ color }}>{item.blockIdx + 1}.{String(item.itemIdx + 1).padStart(2, '0')}</span>
              <p className="voting-item-title">{item.title}</p>
            </div>
            {isMiradaDins ? (
              <div className="vote-btns vote-btns--2">
                <button
                  className={`vote-btn-dins${myVotes[item.id] === 'confirmar' ? ' active active--yes' : ''}`}
                  onClick={() => onVote('confirmar', item.id, mirada.id)}
                >
                  <Check size={13} /> Coincideixo
                </button>
                <button
                  className={`vote-btn-dins${myVotes[item.id] === 'denegar' ? ' active active--no' : ''}`}
                  onClick={() => onVote('denegar', item.id, mirada.id)}
                >
                  <X size={13} /> No coincideixo
                </button>
              </div>
            ) : (
              <div className="vote-btns vote-btns--5">
                {ENDAVANT_OPTS.map(opt => (
                  <button
                    key={opt.key}
                    className={`vote-btn-end${myVotes[item.id] === opt.key ? ' active' : ''}`}
                    style={{ '--vote-color': opt.color } as React.CSSProperties}
                    onClick={() => onVote(opt.key, item.id, mirada.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="voting-comment-section">
        {!submitted ? (
          <>
            <textarea
              className="voting-textarea"
              placeholder="Algun diagnòstic que et sembli important i no hem esmentat? (opcional)"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
            />
            {comment.trim() && (
              <button className="voting-submit-btn" style={{ background: color }} onClick={async () => {
                await supabase.from('coms_contributions').insert({ slide_id: mirada.id, content: comment });
                setSubmitted(true);
              }}>
                Enviar aportació
              </button>
            )}
          </>
        ) : (
          <p className="voting-thanks">Aportació enviada. Gràcies!</p>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD SLIDE ──────────────────────────────────────────────────────────

function DashboardSlide() {
  const [votes, setVotes] = useState<{ proposal_id: string; choice: string; session_id: string }[]>([]);
  const dins = comsData.find(m => m.id === 'mirada-dins')!;
  const color = COLORS['mirada-dins'];

  useEffect(() => {
    let mounted = true;
    const fetchVotes = async () => {
      const { data } = await supabase.from('coms_votes').select('proposal_id, choice, session_id').eq('slide_id', 'mirada-dins');
      if (mounted) setVotes(data || []);
    };
    fetchVotes();
    const interval = setInterval(fetchVotes, 3000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Enrich items with stats
  const allItems = dins.blocks.flatMap((b, bi) =>
    b.items.map((item, ii) => {
      const iv = votes.filter(v => v.proposal_id === item.id);
      const yes = iv.filter(v => v.choice === 'confirmar').length;
      const no = iv.filter(v => v.choice === 'denegar').length;
      const total = yes + no;
      const yesPct = total > 0 ? Math.round((yes / total) * 100) : 0;
      return { ...item, blockIdx: bi, itemIdx: ii, blockTitle: b.title, yes, no, total, yesPct };
    })
  );

  const participantCount = new Set(votes.map(v => v.session_id)).size;
  const globalYes = allItems.reduce((s, i) => s + i.yes, 0);
  const globalTotal = allItems.reduce((s, i) => s + i.total, 0);
  const globalPct = globalTotal > 0 ? Math.round((globalYes / globalTotal) * 100) : 0;

  const voted = allItems.filter(i => i.total > 0);
  const topAgree = [...voted].sort((a, b) => b.yesPct - a.yesPct).slice(0, 3);
  const topDisagree = [...voted].sort((a, b) => a.yesPct - b.yesPct).slice(0, 3);

  const numLabel = (i: typeof allItems[0]) => `${i.blockIdx + 1}.${String(i.itemIdx + 1).padStart(2, '0')}`;

  return (
    <>
      {/* Left: resum executiu */}
      <div className="panel-left intro-panel" style={{ background: color }}>
        <div className="intro-left-content">
          <div className="mirada-num">02</div>
          <h1 className="mirada-ttl">Resultats</h1>
          <p className="mirada-sub">Mirada Dins · Diagnosi</p>

          <div className="ds-stat-row">
            <span className="ds-stat-big">{participantCount}</span>
            <span className="ds-stat-label">participants</span>
          </div>

          {globalTotal > 0 && (
            <div className="ds-global">
              <div className="ds-global-top">
                <span className="ds-global-pct">{globalPct}%</span>
                <span className="ds-global-label">acord global</span>
              </div>
              <div className="ds-global-track">
                <motion.div className="ds-global-fill"
                  initial={{ width: 0 }} animate={{ width: `${globalPct}%` }}
                  transition={{ duration: 0.9 }} />
              </div>
            </div>
          )}

          {topAgree.length > 0 && (
            <div className="ds-top">
              <p className="ds-top-label">↑ Més acord</p>
              {topAgree.map(item => (
                <div key={item.id} className="ds-top-row">
                  <span className="ds-top-num">{numLabel(item)}</span>
                  <span className="ds-top-title">{item.title}</span>
                  <span className="ds-top-pct">{item.yesPct}%</span>
                </div>
              ))}
            </div>
          )}

          {topDisagree.length > 0 && (
            <div className="ds-top ds-top--no">
              <p className="ds-top-label">↓ Menys acord</p>
              {topDisagree.map(item => (
                <div key={item.id} className="ds-top-row">
                  <span className="ds-top-num">{numLabel(item)}</span>
                  <span className="ds-top-title">{item.title}</span>
                  <span className="ds-top-pct">{item.yesPct}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: items agrupats per bloc */}
      <div className="panel-right ds-right">
        {dins.blocks.map((block, bi) => {
          const blockItems = allItems.filter(i => i.blockIdx === bi);
          const bYes = blockItems.reduce((s, i) => s + i.yes, 0);
          const bTotal = blockItems.reduce((s, i) => s + i.total, 0);
          const bPct = bTotal > 0 ? Math.round((bYes / bTotal) * 100) : null;

          return (
            <div key={block.id} className="ds-block">
              <div className="ds-block-header" style={{ background: `${color}0f`, borderLeftColor: color }}>
                <span className="ds-block-num" style={{ color }}>{String(bi + 1).padStart(2, '0')}</span>
                <h3 className="ds-block-title">{block.title}</h3>
                {bPct !== null && (
                  <span className="ds-block-badge" style={{ background: `${color}20`, color }}>
                    {bPct}% acord
                  </span>
                )}
              </div>

              {blockItems.map((item, ii) => {
                const pctColor = item.total > 0 ? (item.yesPct >= 50 ? '#1a7a42' : '#c0392b') : 'var(--text-dim)';
                return (
                  <motion.div key={item.id} className="ds-item-row"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (bi * 3 + ii) * 0.04 }}>
                    <span className="ds-item-num">{numLabel(item)}</span>
                    <div className="ds-item-body">
                      <span className="ds-item-title">{item.title}</span>
                      <div className="ds-bar-track">
                        <motion.div className="ds-bar-yes"
                          initial={{ width: 0 }} animate={{ width: `${item.yesPct}%` }}
                          transition={{ duration: 0.7, delay: (bi * 3 + ii) * 0.05, ease: [0.22, 1, 0.36, 1] }} />
                        <motion.div className="ds-bar-no"
                          initial={{ width: 0 }} animate={{ width: `${item.total > 0 ? 100 - item.yesPct : 0}%` }}
                          transition={{ duration: 0.7, delay: (bi * 3 + ii) * 0.05 + 0.08, ease: [0.22, 1, 0.36, 1] }} />
                      </div>
                      <span className="ds-item-pct" style={{ color: pctColor }}>
                        {item.total > 0 ? `${item.yesPct}%` : '—'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── ENDAVANT VOTE INTRO ──────────────────────────────────────────────────

const ENDAVANT_CAT_DESCS: Record<string, string> = {
  desestimar: 'No es veu possibilitat ni a la llarga de ser factible.',
  reflexionar: 'Cal dedicar més temps a parlar-ne i valorar la idoneïtat.',
  preparar: 'Es necessita temps, recursos o formació per implementar-ho.',
  pilotar: 'Es considera una prova per aprendre i poder escalar.',
  activar: 'Es pot implementar immediatament.',
};

function EndavantVoteIntroSlide() {
  const color = COLORS['mirada-endavant'];
  return (
    <>
      <div className="panel-left intro-panel" style={{ background: color }}>
        <motion.div
          className="intro-left-content"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mirada-num">03</div>
          <h1 className="mirada-ttl">Mirada Endavant</h1>
          <p className="mirada-sub">Ara voteu!</p>
          <p className="intro-text-compact">
            Escaneja el QR i puntua cada proposta amb la categoria que millor
            reflecteixi la teva posició.
          </p>
        </motion.div>
      </div>
      <div className="panel-right evi-right">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}>
          <p className="evi-header">Categories de votació</p>
          <div className="evi-cats">
            {ENDAVANT_OPTS.map((opt, i) => (
              <motion.div key={opt.key} className="evi-cat-row"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}>
                <div className="evi-cat-left">
                  <span className="evi-cat-dot" style={{ background: opt.color }} />
                  <span className="evi-cat-name" style={{ color: opt.color }}>{opt.label}</span>
                </div>
                <p className="evi-cat-desc">{ENDAVANT_CAT_DESCS[opt.key]}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ─── DASHBOARD ENDAVANT ───────────────────────────────────────────────────

type ChartType = 'stacked' | 'bubbles' | 'grouped';

type EndavantItemStat = {
  id: string; title: string;
  blockIdx: number; itemIdx: number;
  blockTitle: string; blockLetter: string;
  counts: Record<string, number>;
  total: number;
  winner: typeof ENDAVANT_OPTS[0] | null;
};

function DeItemRow({ item, numLabel, delay, chartType }: {
  item: EndavantItemStat; numLabel: string; delay: number; chartType: ChartType;
}) {
  const chart = item.total > 0 ? (() => {
    if (chartType === 'stacked') return (
      <div className="de-stacked-bar">
        {ENDAVANT_OPTS.map(opt => {
          const pct = (item.counts[opt.key] / item.total) * 100;
          return pct > 0 ? (
            <motion.div key={opt.key} className="de-stacked-seg"
              style={{ background: opt.color }}
              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
              title={`${opt.label}: ${Math.round(pct)}%`}>
              {pct >= 11 && <span className="de-seg-pct">{Math.round(pct)}%</span>}
            </motion.div>
          ) : null;
        })}
      </div>
    );

    if (chartType === 'bubbles') return (
      <div className="de-bubbles">
        {ENDAVANT_OPTS.map(opt => {
          const pct = (item.counts[opt.key] / item.total) * 100;
          if (pct === 0) return null;
          const size = Math.max(8, Math.sqrt(pct) * 3.8);
          return (
            <div key={opt.key} className="de-bubble-wrap" title={`${opt.label}: ${Math.round(pct)}%`}>
              <motion.div className="de-bubble"
                style={{ width: size, height: size, background: opt.color }}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: delay + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
              <span className="de-bubble-lbl" style={{ color: opt.color }}>{opt.label.slice(0, 3)}</span>
            </div>
          );
        })}
      </div>
    );

    // grouped vertical bars
    return (
      <div className="de-grouped-bars">
        {ENDAVANT_OPTS.map(opt => {
          const pct = (item.counts[opt.key] / item.total) * 100;
          return (
            <div key={opt.key} className="de-gbar-col">
              <div className="de-gbar-track">
                <motion.div className="de-gbar-fill"
                  style={{ background: opt.color }}
                  initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                  transition={{ duration: 0.6, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }} />
              </div>
              {pct >= 8 && <span className="de-gbar-pct">{Math.round(pct)}%</span>}
              <span className="de-gbar-label" style={{ color: pct > 0 ? opt.color : 'var(--border)' }}>
                {opt.label.slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    );
  })() : <span className="de-no-votes">—</span>;

  return (
    <motion.div className="de-item-row"
      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}>
      <span className="ds-item-num">{numLabel}</span>
      <div className="de-item-body">
        <div className="de-item-top">
          <span className="de-item-title">{item.title}</span>
          {item.winner && (
            <span className="de-win-badge"
              style={{ background: `${item.winner.color}18`, color: item.winner.color, borderColor: `${item.winner.color}40` }}>
              {item.winner.label}
            </span>
          )}
        </div>
        {chart}
      </div>
    </motion.div>
  );
}

const CHART_TYPES: { key: ChartType; label: string }[] = [
  { key: 'stacked', label: 'Acumulat' },
  { key: 'bubbles', label: 'Bombolles' },
  { key: 'grouped', label: 'Barres' },
];

function DashboardEndavant() {
  const [votes, setVotes] = useState<{ proposal_id: string; choice: string; session_id: string }[]>([]);
  const [dinsVotesSeg, setDinsVotesSeg] = useState<{ session_id: string; choice: string }[]>([]);
  const [activeBlock, setActiveBlock] = useState<string>('all');
  const [activeOpt, setActiveOpt] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartType>('stacked');
  const [segByDins, setSegByDins] = useState(false);
  const [showCorr, setShowCorr] = useState(false);
  const endavant = comsData.find(m => m.id === 'mirada-endavant')!;
  const color = COLORS['mirada-endavant'];
  const colorDins = COLORS['mirada-dins'];

  useEffect(() => {
    let mounted = true;
    const fetchVotes = async () => {
      const { data } = await supabase.from('coms_votes')
        .select('proposal_id, choice, session_id').eq('slide_id', 'mirada-endavant');
      if (mounted) setVotes(data || []);
    };
    fetchVotes();
    const interval = setInterval(fetchVotes, 3000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (!segByDins && !showCorr) { setDinsVotesSeg([]); return; }
    supabase.from('coms_votes').select('session_id, choice').eq('slide_id', 'mirada-dins')
      .then(({ data }) => setDinsVotesSeg(data || []));
  }, [segByDins, showCorr]);

  const allItems: EndavantItemStat[] = endavant.blocks.flatMap((b, bi) =>
    b.items.map((item, ii) => {
      const iv = votes.filter(v => v.proposal_id === item.id);
      const counts: Record<string, number> = Object.fromEntries(
        ENDAVANT_OPTS.map(o => [o.key, iv.filter(v => v.choice === o.key).length])
      );
      const total = Object.values(counts).reduce((s, c) => s + c, 0);
      const winner = total > 0
        ? ENDAVANT_OPTS.reduce((a, b) => counts[a.key] >= counts[b.key] ? a : b)
        : null;
      return { ...item, blockIdx: bi, itemIdx: ii, blockTitle: b.title, blockLetter: String.fromCharCode(65 + bi), counts, total, winner };
    })
  );

  const participantCount = new Set(votes.map(v => v.session_id)).size;
  const globalCounts: Record<string, number> = Object.fromEntries(
    ENDAVANT_OPTS.map(o => [o.key, allItems.reduce((s, item) => s + item.counts[o.key], 0)])
  );
  const globalTotal = Object.values(globalCounts).reduce((s, c) => s + c, 0);
  const filteredItems = allItems
    .filter(i => activeBlock === 'all' || i.blockLetter === activeBlock)
    .filter(i => !activeOpt || i.winner?.key === activeOpt);
  const numLabel = (item: EndavantItemStat) => `${item.blockIdx + 1}.${String(item.itemIdx + 1).padStart(2, '0')}`;

  // Diagnosi segmentation
  const diagProfile: Record<string, 'alta' | 'baixa'> = {};
  if (segByDins && dinsVotesSeg.length > 0) {
    const bySession: Record<string, { confirmar: number; total: number }> = {};
    dinsVotesSeg.forEach(v => {
      if (!bySession[v.session_id]) bySession[v.session_id] = { confirmar: 0, total: 0 };
      bySession[v.session_id].total++;
      if (v.choice === 'confirmar') bySession[v.session_id].confirmar++;
    });
    Object.entries(bySession).forEach(([sid, { confirmar, total }]) => {
      diagProfile[sid] = confirmar / total >= 0.5 ? 'alta' : 'baixa';
    });
  }

  const itemSegData: Record<string, { altaCounts: Record<string, number>; altaTotal: number; baixaCounts: Record<string, number>; baixaTotal: number }> = {};
  if (segByDins && Object.keys(diagProfile).length > 0) {
    allItems.forEach(item => {
      const iv = votes.filter(v => v.proposal_id === item.id);
      const altaIv = iv.filter(v => diagProfile[v.session_id] === 'alta');
      const baixaIv = iv.filter(v => diagProfile[v.session_id] === 'baixa');
      itemSegData[item.id] = {
        altaCounts: Object.fromEntries(ENDAVANT_OPTS.map(o => [o.key, altaIv.filter(v => v.choice === o.key).length])),
        altaTotal: altaIv.length,
        baixaCounts: Object.fromEntries(ENDAVANT_OPTS.map(o => [o.key, baixaIv.filter(v => v.choice === o.key).length])),
        baixaTotal: baixaIv.length,
      };
    });
  }

  const renderRow = (item: EndavantItemStat, nl: string, delay: number) =>
    segByDins ? (
      <DeSegmentedRow key={item.id} item={item} numLabel={nl} delay={delay}
        altaCounts={itemSegData[item.id]?.altaCounts ?? {}}
        altaTotal={itemSegData[item.id]?.altaTotal ?? 0}
        baixaCounts={itemSegData[item.id]?.baixaCounts ?? {}}
        baixaTotal={itemSegData[item.id]?.baixaTotal ?? 0}
      />
    ) : (
      <DeItemRow key={item.id} item={item} numLabel={nl} delay={delay} chartType={chartType} />
    );

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: color }}>
        <div className="intro-left-content">
          <div className="mirada-num">03</div>
          <h1 className="mirada-ttl">Resultats</h1>
          <p className="mirada-sub">Mirada Endavant · Decisions</p>

          <div className="ds-stat-row">
            <span className="ds-stat-big">{participantCount}</span>
            <span className="ds-stat-label">participants</span>
          </div>


          {globalTotal > 0 && !showCorr && (
            <div className="de-dist">
              <p className="de-dist-label">Distribució global</p>
              <div className="de-dist-bar">
                {ENDAVANT_OPTS.map(opt => {
                  const pct = (globalCounts[opt.key] / globalTotal) * 100;
                  return pct > 0 ? (
                    <motion.div key={opt.key} className="de-dist-seg"
                      style={{ background: opt.color }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  ) : null;
                })}
              </div>
              <div className="de-dist-legend">
                {ENDAVANT_OPTS.map(opt => (
                  <div key={opt.key}
                    className={`de-legend-row de-legend-row--btn${activeOpt === opt.key ? ' active' : ''}`}
                    style={activeOpt === opt.key ? { background: 'rgba(255,255,255,0.18)', borderRadius: 6 } : {}}
                    onClick={() => setActiveOpt(prev => prev === opt.key ? null : opt.key)}>
                    <span className="de-legend-dot" style={{ background: opt.color }} />
                    <span className="de-legend-label">{opt.label}</span>
                    <span className="de-legend-pct">
                      {globalTotal > 0 ? `${Math.round((globalCounts[opt.key] / globalTotal) * 100)}%` : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="panel-right de-right">
        {/* Horizontal Filters Bar */}
        {!showCorr && (
          <div className="de-horizontal-filters">
            <div className="de-h-row">
              <span className="de-h-label">Vista:</span>
              <div className="de-chart-toggle">
                {!segByDins && CHART_TYPES.map(ct => (
                  <button key={ct.key}
                    className={`de-chart-btn${chartType === ct.key ? ' active' : ''}`}
                    style={chartType === ct.key ? { borderColor: color, color, background: `${color}10` } : {}}
                    onClick={() => setChartType(ct.key)}>
                    {ct.label}
                  </button>
                ))}
                <button
                  className={`de-chart-btn${segByDins ? ' active' : ''}`}
                  style={segByDins ? { color: colorDins, background: `${colorDins}10`, borderColor: colorDins } : {}}
                  onClick={() => { setSegByDins(v => !v); setShowCorr(false); }}
                  title="Segmentar per perfil de diagnosi intern">
                  ◈ Segmentació
                </button>
                <button
                  className={`de-chart-btn${showCorr ? ' active' : ''}`}
                  style={showCorr ? { color, background: `${color}10` } : {}}
                  onClick={() => { setShowCorr(v => !v); setSegByDins(false); }}
                  title="Veure correlació diagnosi × ambició">
                  ⊕ Correlació
                </button>
              </div>
            </div>

            <div className="de-h-row">
              <span className="de-h-label">Blocs:</span>
              <div className="de-filters de-filters--horizontal">
                <button className={`de-filter-btn${activeBlock === 'all' ? ' active' : ''}`}
                  style={activeBlock === 'all' ? { background: color, color: 'white' } : {}}
                  onClick={() => setActiveBlock('all')}>
                  Tots
                </button>
                {endavant.blocks.map((b, bi) => {
                  const letter = String.fromCharCode(65 + bi);
                  return (
                    <button key={letter}
                      className={`de-filter-btn${activeBlock === letter ? ' active' : ''}`}
                      style={activeBlock === letter ? { background: color, color: 'white' } : {}}
                      onClick={() => setActiveBlock(letter)}
                      title={b.title}>
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {showCorr ? (
          <CorrelationPlot dinsVotes={dinsVotesSeg} endVotes={votes} />
        ) : activeBlock === 'all' && !activeOpt ? (
          endavant.blocks.map((block, bi) => {
            const blockItems = filteredItems.filter(i => i.blockIdx === bi);
            if (blockItems.length === 0) return null;
            return (
              <div key={block.id} className="ds-block">
                <div className="ds-block-header" style={{ background: `${color}0f`, borderLeftColor: color }}>
                  <span className="ds-block-num" style={{ color }}>{String(bi + 1).padStart(2, '0')}</span>
                  <h3 className="ds-block-title">{block.title}</h3>
                </div>
                {blockItems.map((item, ii) => renderRow(item, numLabel(item), (bi * 3 + ii) * 0.04))}
              </div>
            );
          })
        ) : (
          <div className="ds-block">
            {filteredItems.length > 0 ? filteredItems.map((item, ii) => renderRow(item, numLabel(item), ii * 0.05)) : (
              <p className="de-empty">Cap proposta amb aquesta combinació de filtres.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── SEGMENTED ROW (DIAGNOSI ×  ENDAVANT) ─────────────────────────────────────

function DeSegmentedRow({ item, numLabel, delay, altaCounts, altaTotal, baixaCounts, baixaTotal }: {
  item: EndavantItemStat; numLabel: string; delay: number;
  altaCounts: Record<string, number>; altaTotal: number;
  baixaCounts: Record<string, number>; baixaTotal: number;
}) {
  const renderSegBar = (counts: Record<string, number>, total: number) => (
    <div className="de-stacked-bar de-stacked-bar--sm">
      {total > 0 ? ENDAVANT_OPTS.map(opt => {
        const pct = (counts[opt.key] / total) * 100;
        return pct > 0 ? (
          <motion.div key={opt.key} className="de-stacked-seg"
            style={{ background: opt.color }}
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, delay: delay + 0.1 }}
            title={`${opt.label}: ${Math.round(pct)}%`}>
            {pct >= 15 && <span className="de-seg-pct">{Math.round(pct)}%</span>}
          </motion.div>
        ) : null;
      }) : <span className="de-no-votes">—</span>}
    </div>
  );

  return (
    <motion.div className="de-item-row" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <span className="ds-item-num">{numLabel}</span>
      <div className="de-item-body">
        <div className="de-item-top">
          <span className="de-item-title">{item.title}</span>
        </div>
        <div className="de-diag-row">
          <span className="de-diag-label de-diag-label--alta">Alta diagnosi <small>n={altaTotal}</small></span>
          {renderSegBar(altaCounts, altaTotal)}
        </div>
        <div className="de-diag-row">
          <span className="de-diag-label de-diag-label--baixa">Baixa diagnosi <small>n={baixaTotal}</small></span>
          {renderSegBar(baixaCounts, baixaTotal)}
        </div>
      </div>
    </motion.div>
  );
}

// ─── CORRELATION PLOT (shared, inline-embeddable) ─────────────────────────────

function CorrelationPlot({
  dinsVotes, endVotes,
}: {
  dinsVotes: { session_id: string; choice: string }[];
  endVotes: { session_id: string; choice: string }[];
}) {
  const URGENCY: Record<string, number> = { desestimar: 0, reflexionar: 25, preparar: 50, pilotar: 75, activar: 100 };
  const colorEnd = COLORS['mirada-endavant'];

  const allSessions = new Set([...dinsVotes, ...endVotes].map(v => v.session_id));
  const points: { dins: number; end: number }[] = [];
  allSessions.forEach(sid => {
    const md = dinsVotes.filter(v => v.session_id === sid);
    const me = endVotes.filter(v => v.session_id === sid);
    if (!md.length || !me.length) return;
    const confirmar = md.filter(v => v.choice === 'confirmar').length;
    points.push({
      dins: (confirmar / md.length) * 100,
      end: me.reduce((s, v) => s + (URGENCY[v.choice] ?? 0), 0) / me.length,
    });
  });

  const n = points.length;
  let r = 0, slope = 0, intercept = 50;
  if (n >= 2) {
    const mX = points.reduce((s, p) => s + p.dins, 0) / n;
    const mY = points.reduce((s, p) => s + p.end, 0) / n;
    const ssxy = points.reduce((s, p) => s + (p.dins - mX) * (p.end - mY), 0);
    const ssx = points.reduce((s, p) => s + (p.dins - mX) ** 2, 0);
    const ssy = points.reduce((s, p) => s + (p.end - mY) ** 2, 0);
    r = ssx > 0 && ssy > 0 ? ssxy / Math.sqrt(ssx * ssy) : 0;
    slope = ssx > 0 ? ssxy / ssx : 0;
    intercept = mY - slope * mX;
  }

  const W = 460, H = 280, PL = 54, PR = 16, PT = 16, PB = 36;
  const plotW = W - PL - PR, plotH = H - PT - PB;
  const toX = (v: number) => PL + (v / 100) * plotW;
  const toY = (v: number) => PT + plotH - (v / 100) * plotH;
  const tY1 = Math.max(0, Math.min(100, slope * 0 + intercept));
  const tY2 = Math.max(0, Math.min(100, slope * 100 + intercept));
  const YLABELS = [
    { v: 0, l: 'Des.' }, { v: 25, l: 'Refl.' }, { v: 50, l: 'Prep.' },
    { v: 75, l: 'Pilot.' }, { v: 100, l: 'Activ.' },
  ];
  const rColor = r > 0.3 ? '#2ecc71' : r < -0.3 ? '#e74c3c' : '#bdc3c7';
  const absR = Math.abs(r);
  const strength = absR > 0.5 ? 'forta' : absR > 0.3 ? 'moderada' : 'feble';
  const direction = r > 0.05 ? 'positiva' : r < -0.05 ? 'negativa' : 'nul·la';

  if (n < 2) return <p className="corr-empty">Calen almenys 2 participants amb vots a les dues mirades.</p>;

  return (
    <div className="corr-plot-wrap">
      <div className="corr-inline-header">
        <span className="corr-r-val" style={{ color: rColor }}>r = {r.toFixed(2)}</span>
        <span className="corr-r-sub">correlació {direction} {strength} · {n} participants creuats</span>
      </div>
      <svg className="corr-svg" viewBox={`0 0 ${W} ${H}`}>
        {YLABELS.map(yl => (
          <line key={yl.v} x1={PL} y1={toY(yl.v)} x2={W - PR} y2={toY(yl.v)} stroke="var(--border)" strokeWidth={1} />
        ))}
        {[0, 25, 50, 75, 100].map(x => (
          <line key={x} x1={toX(x)} y1={PT} x2={toX(x)} y2={H - PB} stroke="var(--border)" strokeWidth={1} />
        ))}
        {YLABELS.map(yl => (
          <text key={yl.v} x={PL - 5} y={toY(yl.v) + 4} textAnchor="end" fill="var(--text-muted)" fontSize={10}>{yl.l}</text>
        ))}
        {[0, 25, 50, 75, 100].map(x => (
          <text key={x} x={toX(x)} y={H - PB + 14} textAnchor="middle" fill="var(--text-muted)" fontSize={10}>{x}%</text>
        ))}
        <line x1={toX(0)} y1={toY(tY1)} x2={toX(100)} y2={toY(tY2)}
          stroke="#7f8c8d" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.7} />
        {points.map((p, i) => (
          <circle key={i} cx={toX(p.dins)} cy={toY(p.end)} r={5.5}
            fill={`${colorEnd}aa`} stroke={colorEnd} strokeWidth={0.8} opacity={0.8} />
        ))}
        <line x1={PL} y1={PT} x2={PL} y2={H - PB} stroke="var(--text-dim)" strokeWidth={1} />
        <line x1={PL} y1={H - PB} x2={W - PR} y2={H - PB} stroke="var(--text-dim)" strokeWidth={1} />
      </svg>
      <div className="corr-axes-labels">
        <span>→ % Coincideixo (Mirada Dins)</span>
        <span className="corr-y-axis-label">↑ Ambició (Desestimar → Activar)</span>
      </div>
    </div>
  );
}

// ─── CORRELATION DASHBOARD ────────────────────────────────────────────────────

function CorrelationDashboard() {
  const [dinsVotes, setDinsVotes] = useState<{ session_id: string; proposal_id: string; choice: string }[]>([]);
  const [endVotes, setEndVotes] = useState<{ session_id: string; proposal_id: string; choice: string }[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      const [d, e] = await Promise.all([
        supabase.from('coms_votes').select('session_id, proposal_id, choice').eq('slide_id', 'mirada-dins'),
        supabase.from('coms_votes').select('session_id, proposal_id, choice').eq('slide_id', 'mirada-endavant'),
      ]);
      if (mounted) { setDinsVotes(d.data || []); setEndVotes(e.data || []); }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const URGENCY: Record<string, number> = { desestimar: 0, reflexionar: 25, preparar: 50, pilotar: 75, activar: 100 };
  const allSessions = new Set([...dinsVotes, ...endVotes].map(v => v.session_id));

  type Point = { dins: number; end: number };
  const points: Point[] = [];
  allSessions.forEach(sid => {
    const myDins = dinsVotes.filter(v => v.session_id === sid);
    const myEnd = endVotes.filter(v => v.session_id === sid);
    if (myDins.length === 0 || myEnd.length === 0) return;
    const confirmar = myDins.filter(v => v.choice === 'confirmar').length;
    points.push({
      dins: (confirmar / myDins.length) * 100,
      end: myEnd.reduce((s, v) => s + (URGENCY[v.choice] ?? 0), 0) / myEnd.length,
    });
  });

  const n = points.length;
  let r = 0, slope = 0, intercept = 50;
  if (n >= 2) {
    const meanX = points.reduce((s, p) => s + p.dins, 0) / n;
    const meanY = points.reduce((s, p) => s + p.end, 0) / n;
    const ssxy = points.reduce((s, p) => s + (p.dins - meanX) * (p.end - meanY), 0);
    const ssx = points.reduce((s, p) => s + (p.dins - meanX) ** 2, 0);
    const ssy = points.reduce((s, p) => s + (p.end - meanY) ** 2, 0);
    r = ssx > 0 && ssy > 0 ? ssxy / Math.sqrt(ssx * ssy) : 0;
    slope = ssx > 0 ? ssxy / ssx : 0;
    intercept = meanY - slope * meanX;
  }

  // SVG layout
  const W = 460, H = 300, PL = 54, PR = 16, PT = 16, PB = 36;
  const plotW = W - PL - PR, plotH = H - PT - PB;
  const toX = (v: number) => PL + (v / 100) * plotW;
  const toY = (v: number) => PT + plotH - (v / 100) * plotH;
  const tY1 = Math.max(0, Math.min(100, slope * 0 + intercept));
  const tY2 = Math.max(0, Math.min(100, slope * 100 + intercept));

  const YLABELS = [
    { v: 0, l: 'Des.' }, { v: 25, l: 'Refl.' }, { v: 50, l: 'Prep.' },
    { v: 75, l: 'Pilot.' }, { v: 100, l: 'Activ.' },
  ];

  const absR = Math.abs(r);
  const strength = absR > 0.5 ? 'forta' : absR > 0.3 ? 'moderada' : 'feble';
  const direction = r > 0.05 ? 'positiva' : r < -0.05 ? 'negativa' : 'nul·la';
  const rColor = r > 0.3 ? '#2ecc71' : r < -0.3 ? '#e74c3c' : '#bdc3c7';
  const colorDins = COLORS['mirada-dins'];
  const colorEnd = COLORS['mirada-endavant'];

  const interpretation = r > 0.3
    ? 'Les persones que coincideixen més amb el diagnòstic tendeixen a votar propostes més ambicioses.'
    : r < -0.3
      ? 'Les persones que coincideixen menys amb el diagnòstic tendeixen a votar propostes més ambicioses.'
      : 'No hi ha una correlació clara entre diagnosi i ambició de les propostes.';

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: 'linear-gradient(155deg, #1c2e40 0%, #1a3025 100%)' }}>
        <div className="intro-left-content">
          <div className="mirada-num" style={{ opacity: 0.5, fontSize: '2rem' }}>◈</div>
          <h1 className="mirada-ttl">Correlació</h1>
          <p className="mirada-sub">Diagnosi × Ambició</p>

          <div className="ds-stat-row" style={{ marginTop: '1.5rem' }}>
            <span className="ds-stat-big">{n}</span>
            <span className="ds-stat-label">participants creuats</span>
          </div>

          {n >= 2 && (
            <>
              <div className="corr-r-display">
                <span className="corr-r-val" style={{ color: rColor }}>r = {r.toFixed(2)}</span>
                <span className="corr-r-sub">correlació {direction} {strength}</span>
              </div>
              <div className="corr-interpret">
                <p className="corr-interpret-text">{interpretation}</p>
              </div>
            </>
          )}

          <div className="corr-legend">
            <div className="corr-legend-row">
              <span className="corr-legend-dot" style={{ background: colorDins }} />
              <span>Eix X · % coincideixo (Dins)</span>
            </div>
            <div className="corr-legend-row">
              <span className="corr-legend-dot" style={{ background: colorEnd }} />
              <span>Eix Y · Ambició propostes (Endavant)</span>
            </div>
            <div className="corr-legend-row">
              <span className="corr-legend-dash">– –</span>
              <span>Tendència (regressió lineal)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-right corr-right">
        {n < 2 ? (
          <p className="corr-empty">Calen almenys 2 participants amb vots a les dues mirades.</p>
        ) : (
          <>
            <p className="corr-chart-title">Diagnosi interna (Mirada Dins) vs Ambició de les propostes (Mirada Endavant)</p>
            <svg className="corr-svg" viewBox={`0 0 ${W} ${H}`}>
              {/* Grid */}
              {YLABELS.map(yl => (
                <line key={yl.v} x1={PL} y1={toY(yl.v)} x2={W - PR} y2={toY(yl.v)} stroke="var(--border)" strokeWidth={1} />
              ))}
              {[0, 25, 50, 75, 100].map(x => (
                <line key={x} x1={toX(x)} y1={PT} x2={toX(x)} y2={H - PB} stroke="var(--border)" strokeWidth={1} />
              ))}
              {/* Y labels */}
              {YLABELS.map(yl => (
                <text key={yl.v} x={PL - 5} y={toY(yl.v) + 4} textAnchor="end" fill="var(--text-muted)" fontSize={10}>{yl.l}</text>
              ))}
              {/* X labels */}
              {[0, 25, 50, 75, 100].map(x => (
                <text key={x} x={toX(x)} y={H - PB + 14} textAnchor="middle" fill="var(--text-muted)" fontSize={10}>{x}%</text>
              ))}
              {/* Trend line */}
              <line x1={toX(0)} y1={toY(tY1)} x2={toX(100)} y2={toY(tY2)}
                stroke="#7f8c8d" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.7} />
              {/* Points */}
              {points.map((p, i) => (
                <circle key={i} cx={toX(p.dins)} cy={toY(p.end)} r={5.5}
                  fill={`${colorEnd}aa`} stroke={colorEnd} strokeWidth={0.8} opacity={0.8} />
              ))}
              {/* Axes */}
              <line x1={PL} y1={PT} x2={PL} y2={H - PB} stroke="var(--text-dim)" strokeWidth={1} />
              <line x1={PL} y1={H - PB} x2={W - PR} y2={H - PB} stroke="var(--text-dim)" strokeWidth={1} />
            </svg>
            <div className="corr-axes-labels">
              <span>→ Coincideixo amb el diagnòstic intern (%)</span>
              <span className="corr-y-axis-label">↑ Ambició (Desestimar → Activar)</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Computed synchronously — no state needed
  const isPresenter = new URLSearchParams(window.location.search).get('mode') === 'presenter';
  const [newIdea, setNewIdea] = useState('');
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [contributions, setContributions] = useState<any[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, string>>({});
  const [showQr, setShowQr] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Anonymous session ID (persisted in localStorage)
  const [sessionId] = useState<string>(() => {
    const stored = localStorage.getItem('coms_session_id');
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem('coms_session_id', id);
    return id;
  });

  // Load existing votes — localStorage first (instant), DB as source of truth
  useEffect(() => {
    const lsKey = `coms_votes_${sessionId}`;
    const stored = localStorage.getItem(lsKey);
    if (stored) setMyVotes(JSON.parse(stored));

    supabase.from('coms_votes').select('proposal_id, choice').eq('session_id', sessionId)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const map: Record<string, string> = {};
          data.forEach(v => { map[v.proposal_id] = v.choice; });
          setMyVotes(map);
          localStorage.setItem(lsKey, JSON.stringify(map));
        }
      });
  }, [sessionId]);

  // Initial load from DB + real-time sync via broadcast
  useEffect(() => {
    // 1. Fetch current state (for late joiners)
    const init = async () => {
      const { data } = await supabase.from('coms_session_state').select('*').single();
      if (data) {
        const key = normalizeKey(data.current_slide_id);
        const idx = allSlides.findIndex(s => s.slideKey === key);
        if (idx !== -1) setCurrentIndex(idx);
        setIsVotingOpen(data.is_voting_open);
      }
      setLoading(false);
    };
    init();

    // 2. Broadcast channel — audience listens, presenter sends
    const ch = supabase.channel('coms_room');
    if (!isPresenter) {
      ch.on('broadcast', { event: 'slide_change' }, ({ payload }) => {
        const key = normalizeKey(payload.slideKey);
        const idx = allSlides.findIndex(s => s.slideKey === key);
        if (idx !== -1) setCurrentIndex(idx);
        setIsVotingOpen(payload.isVotingOpen ?? false);
      });
    }
    ch.subscribe();
    channelRef.current = ch;
    return () => { supabase.removeChannel(ch); };
  }, []);

  useEffect(() => {
    if (!isPresenter) return;
    const slide = allSlides[currentIndex];
    const fetchC = async () => {
      const { data } = await supabase.from('coms_contributions').select('*')
        .eq('slide_id', slide.mirada.id).order('created_at', { ascending: false });
      if (data) setContributions(data);
    };
    fetchC();
    const ch = supabase.channel('c_sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'coms_contributions', filter: `slide_id=eq.${slide.mirada.id}` },
        (p) => setContributions(prev => [p.new, ...prev])).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [isPresenter, currentIndex]);

  const updateSlide = async (index: number) => {
    if (!isPresenter || index < 0 || index >= allSlides.length) return;
    const slideKey = allSlides[index].slideKey;
    setCurrentIndex(index); setShowResults(false); setIsVotingOpen(false);
    // Broadcast immediately (real-time for connected audience)
    channelRef.current?.send({ type: 'broadcast', event: 'slide_change', payload: { slideKey, isVotingOpen: false } });
    // Persist to DB (for late joiners)
    try {
      await supabase.from('coms_session_state')
        .update({ current_slide_id: slideKey, is_voting_open: false, updated_at: new Date().toISOString() }).eq('id', 1);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') updateSlide(currentIndex + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') updateSlide(currentIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, isPresenter]);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) updateSlide(currentIndex + 1);
        else updateSlide(currentIndex - 1);
      }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd); };
  }, [currentIndex, isPresenter]);

  const toggleVoting = async () => {
    if (!isPresenter) return;
    const newState = !isVotingOpen;
    setIsVotingOpen(newState);
    const slideKey = allSlides[currentIndex].slideKey;
    channelRef.current?.send({ type: 'broadcast', event: 'slide_change', payload: { slideKey, isVotingOpen: newState } });
    await supabase.from('coms_session_state').update({ is_voting_open: newState }).eq('id', 1);
  };

  const handleVote = async (choice: string, itemId: string, sectionId: string) => {
    const isToggleOff = myVotes[itemId] === choice;
    const newVotes = { ...myVotes };
    if (isToggleOff) delete newVotes[itemId]; else newVotes[itemId] = choice;
    setMyVotes(newVotes);
    localStorage.setItem(`coms_votes_${sessionId}`, JSON.stringify(newVotes));
    try {
      if (isToggleOff) {
        await supabase.from('coms_votes').delete()
          .eq('session_id', sessionId).eq('proposal_id', itemId);
      } else {
        await supabase.from('coms_votes').upsert({
          session_id: sessionId, slide_id: sectionId, proposal_id: itemId, choice,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'session_id,proposal_id' });
      }
    } catch (e) { /* votes already saved in localStorage */ }
  };

  const resetMyVotes = async () => {
    setMyVotes({});
    localStorage.removeItem(`coms_votes_${sessionId}`);
    try {
      await supabase.from('coms_votes').delete().eq('session_id', sessionId);
    } catch (e) { /* ignore */ }
  };

  const resetAllVotes = async () => {
    if (!window.confirm('Eliminar TOTS els vots i iniciar nova votació?')) return;
    try {
      await supabase.from('coms_votes').delete().neq('session_id', '');
    } catch (e) { /* ignore */ }
    resetMyVotes();
  };

  const submitIdea = async () => {
    if (!newIdea.trim()) return;
    const slide = allSlides[currentIndex];
    await supabase.from('coms_contributions').insert({ slide_id: slide.mirada.id, content: newIdea });
    setNewIdea('');
  };

  if (loading) return <div className="loading-screen">Carregant...</div>;

  const slide = allSlides[currentIndex];
  const color = COLORS[slide.mirada.id];
  const isVotingSection =
    slide.type === 'quiz' ||
    slide.mirada.id === 'mirada-dins' ||
    slide.type === 'endavant-vote-intro' ||
    (slide.type === 'dashboard' && slide.mirada.id === 'mirada-endavant');
  const audienceUrl = `${window.location.origin}${window.location.pathname}`;

  const breadcrumb = slide.mirada.title;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        {/* Brand */}
        <div className="header-brand">
          <span className="badge">FJE 2026–2029</span>
          <span className="header-title">COMS · Pla d'Aprenentatge</span>
        </div>

        {/* Center: breadcrumb + section progress */}
        <div className="header-center">
          <span className="header-breadcrumb" style={{ color }}>{breadcrumb}</span>
          <div className="header-nav-dots">
            {comsData.map((m) => {
              const miradaSlides = allSlides.filter(s => s.mirada.id === m.id);
              const mColor = COLORS[m.id];
              const currentInMirada = miradaSlides.findIndex(s => allSlides.indexOf(s) === currentIndex);
              const pct = currentInMirada >= 0 ? ((currentInMirada + 1) / miradaSlides.length) : 0;
              const isActive = slide.mirada.id === m.id;
              return (
                <div key={m.id} className="nav-dot-col"
                  style={{ cursor: isPresenter ? 'pointer' : 'default' }}
                  onClick={() => {
                    if (!isPresenter) return;
                    const firstSlideIdx = allSlides.findIndex(s => s.mirada.id === m.id);
                    if (firstSlideIdx !== -1) updateSlide(firstSlideIdx);
                  }}
                  title={isPresenter ? `Salta a: ${m.title}` : ''}>
                  <motion.div className="nav-dot-bar"
                    animate={{ background: isActive ? mColor : 'var(--border)', width: isActive ? '26px' : '12px' }}
                    transition={{ duration: 0.3 }} />
                  {isActive && (
                    <div className="nav-dot-track">
                      <motion.div className="nav-dot-fill"
                        style={{ background: mColor }}
                        animate={{ width: `${pct * 100}%` }}
                        transition={{ duration: 0.4 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: presenter controls (or empty spacer for audience) */}
        <div className="header-controls">
          {isPresenter && (
            <>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`ctrl-vote-btn${isVotingOpen ? ' ctrl-vote-btn--open' : ''}`}
                onClick={toggleVoting}>
                {isVotingOpen
                  ? <><X size={11} /> Tancar vots</>
                  : <><Rocket size={11} /> Obrir vots</>}
              </motion.button>

              <div className="ctrl-icon-group">
                <button className={`ctrl-icon-btn${showResults ? ' active' : ''}`}
                  onClick={() => setShowResults(v => !v)}
                  title={showResults ? 'Amagar resultats' : 'Mostrar resultats'}>
                  {showResults ? <EyeOff size={13} /> : <BarChart2 size={13} />}
                </button>
                <button className={`ctrl-icon-btn${showQr ? ' active' : ''}`}
                  onClick={() => setShowQr(v => !v)} title="QR per participants">
                  <QrCode size={13} />
                </button>
                <button className="ctrl-icon-btn ctrl-icon-btn--danger"
                  onClick={resetAllVotes} title="Nova votació (esborra tots els vots)">
                  <Trash2 size={13} />
                </button>
              </div>
            </>
          )}

          <div className="ctrl-counter"
            style={{ cursor: isPresenter ? 'pointer' : 'default' }}
            onClick={() => isPresenter && setShowSelector(true)}>
            {currentIndex + 1}<span className="ctrl-counter-sep">/</span>{allSlides.length}
          </div>
        </div>
      </header>

      {/* Slide */}
      <main className="slide-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={(() => {
              if (!isPresenter && isVotingSection) return `voting-${slide.mirada.id}`;
              // Stable key within same section type → left panel stays mounted, only right panel animates internally
              if (slide.type === 'block') return `${slide.mirada.id}:blocks`;
              if (slide.type === 'item') return `${slide.mirada.id}:items:${slide.block?.id}`;
              // Stable key for reveal steps (>0) within same mirada — only right panel animates
              if (slide.type === 'mirada-intro' && (slide.introStep ?? 0) > 0) return `${slide.mirada.id}:intro:reveal`;
              return slide.slideKey;
            })()}
            className="slide-area" style={{ width: '100%' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>

            {/* Audience in voting sections → voting panel */}
            {!isPresenter && isVotingSection ? (
              slide.type === 'quiz'
                ? <QuizVotePanel myVotes={myVotes} onVote={handleVote} />
                : <VotingPanel mirada={slide.mirada} myVotes={myVotes} onVote={handleVote} onReset={resetMyVotes} />
            ) : (
              <>
                {slide.type === 'quiz' && <QuizSlide />}
                {slide.type === 'mirada-intro' && <IntroSlide slide={slide} />}
                {slide.type === 'block' && <BlockSlide slide={slide} />}
                {slide.type === 'endavant-vote-intro' && <EndavantVoteIntroSlide />}
                {slide.type === 'dashboard' && (
                  slide.mirada.id === 'mirada-dins'
                    ? <DashboardSlide />
                    : <DashboardEndavant />
                )}
                {slide.type === 'correlation' && <CorrelationDashboard />}
                {slide.type === 'report' && <ReportSlide step={slide.introStep ?? 0} />}
                {slide.type === 'item' && (
                  <ItemSlide slide={slide} isPresenter={isPresenter} isVotingOpen={isVotingOpen}
                    showResults={showResults} contributions={contributions}
                    handleVote={handleVote} submitIdea={submitIdea}
                    newIdea={newIdea} setNewIdea={setNewIdea} />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation — only visible to presenter */}
      {isPresenter && (
        <div className="nav-overlay">
          <button className="nav-arrow-float" onClick={() => updateSlide(currentIndex - 1)} disabled={currentIndex === 0}>
            <ChevronLeft size={24} />
          </button>
          <button className="nav-arrow-float" onClick={() => updateSlide(currentIndex + 1)} disabled={currentIndex === allSlides.length - 1}>
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* QR Modal */}
      {showQr && (
        <div className="qr-overlay" onClick={() => setShowQr(false)}>
          <div className="qr-modal" onClick={e => e.stopPropagation()}>
            <p className="qr-label">URL per als participants</p>
            <code className="qr-url">{audienceUrl}</code>
            <img className="qr-img"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(audienceUrl)}`}
              alt="QR Code" />
            <button className="qr-close" onClick={() => setShowQr(false)}>Tancar</button>
          </div>
        </div>
      )}
      {/* Slide Selector Modal */}
      <AnimatePresence>
        {showSelector && (
          <motion.div className="qr-overlay de-selector-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowSelector(false)}>
            <motion.div className="de-selector-modal"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <div className="de-selector-header">
                <h3>Ves a la diapositiva</h3>
                <button className="de-selector-close" onClick={() => setShowSelector(false)}><X size={18} /></button>
              </div>
              <div className="de-selector-list">
                {allSlides.map((s, i) => {
                  const isActive = currentIndex === i;
                  return (
                    <button key={i}
                      className={`de-selector-item${isActive ? ' active' : ''}`}
                      onClick={() => { updateSlide(i); setShowSelector(false); }}>
                      <span className="de-sel-num">{i + 1}</span>
                      <span className="de-sel-title">{s.mirada.title}</span>
                      {isActive && <Eye size={14} className="de-sel-eye" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
