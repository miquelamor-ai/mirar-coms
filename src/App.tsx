import { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import { comsData, type Mirada, type Block, type Item } from './data/comsContent';
import {
  ChevronRight, ChevronLeft, Check, HelpCircle, X,
  Rocket, FlaskConical, Construction, Brain, Ban, Send,
  BarChart2, EyeOff, QrCode
} from 'lucide-react';
import { LiveChart } from './components/LiveChart';
import { motion, AnimatePresence } from 'framer-motion';

// ─── FLAT SLIDE STRUCTURE ─────────────────────────────────────────────────────

type SlideType = 'mirada-intro' | 'block' | 'item' | 'dashboard';

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

function buildSlides(): FlatSlide[] {
  const result: FlatSlide[] = [];

  for (const mirada of comsData) {
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
      // Dashboard after mirada-dins
      if (mirada.id === 'mirada-dins') {
        result.push({
          type: 'dashboard',
          slideKey: 'mirada-dins:dashboard',
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

const COLORS: Record<string, string> = {
  'preamble':         '#8e44ad',
  'mirada-fora':      '#3498db',
  'mirada-dins':      '#e67e22',
  'mirada-endavant':  '#27ae60'
};

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
      { key: 'activar',     icon: <Rocket size={13} />,      label: 'Activar',    color: '#27ae60' },
      { key: 'pilotar',     icon: <FlaskConical size={13} />, label: 'Pilotar',    color: '#3498db' },
      { key: 'preparar',    icon: <Construction size={13} />, label: 'Preparar',   color: '#c9922a' },
      { key: 'reflexionar', icon: <Brain size={13} />,        label: 'Repensar',   color: '#8e44ad' },
      { key: 'desestimar',  icon: <Ban size={13} />,          label: 'No',         color: '#e74c3c' },
    ]
    : [
      { key: 'confirmar', icon: <Check size={14} />,     label: 'Confirmar', color: '#27ae60' },
      { key: 'dubtar',    icon: <HelpCircle size={14} />, label: 'Dubtar',    color: '#c9922a' },
      { key: 'denegar',   icon: <X size={14} />,         label: 'Denegar',   color: '#e74c3c' },
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
  { key: 'desestimar',  label: 'Desestimar',  color: '#e74c3c' },
  { key: 'reflexionar', label: 'Reflexionar', color: '#8e44ad' },
  { key: 'preparar',    label: 'Preparar',    color: '#c9922a' },
  { key: 'pilotar',     label: 'Pilotar',     color: '#3498db' },
  { key: 'activar',     label: 'Activar',     color: '#27ae60' },
];

function VotingPanel({ mirada, myVotes, onVote }: {
  mirada: Mirada;
  myVotes: Record<string, string>;
  onVote: (choice: string, itemId: string, sectionId: string) => void;
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
        <div>
          <h2 className="voting-title" style={{ color }}>{mirada.title}</h2>
          <p className="voting-subtitle">{mirada.subtitle}</p>
        </div>
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

  const allItems = dins.blocks.flatMap((b, bi) =>
    b.items.map((item, ii) => ({ ...item, blockIdx: bi, itemIdx: ii }))
  );
  const participantCount = new Set(votes.map(v => v.session_id)).size;

  return (
    <>
      <div className="panel-left intro-panel" style={{ background: color }}>
        <div className="intro-left-content">
          <div className="mirada-num">02</div>
          <h1 className="mirada-ttl">Resultats</h1>
          <p className="mirada-sub">Mirada Dins · Diagnosi</p>
          <p className="intro-text-compact" style={{ color: 'rgba(255,255,255,0.85)', marginTop: '1.5rem' }}>
            {participantCount} participant{participantCount !== 1 ? 's' : ''} han votat
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            {allItems.map((item) => {
              const itemVotes = votes.filter(v => v.proposal_id === item.id);
              const yes = itemVotes.filter(v => v.choice === 'confirmar').length;
              const total = yes + itemVotes.filter(v => v.choice === 'denegar').length;
              const yesPct = total > 0 ? Math.round((yes / total) * 100) : 0;
              const numLabel = `${item.blockIdx + 1}.${String(item.itemIdx + 1).padStart(2, '0')}`;
              return (
                <div key={item.id} style={{ marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>
                    <span>{numLabel}</span><span>{yesPct}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div style={{ height: '100%', background: 'rgba(255,255,255,0.75)', borderRadius: '2px' }}
                      initial={{ width: 0 }} animate={{ width: `${yesPct}%` }} transition={{ duration: 0.6, delay: item.itemIdx * 0.04 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="panel-right" style={{ overflowY: 'auto' }}>
        <div className="dashboard-grid">
          {allItems.map((item) => {
            const itemVotes = votes.filter(v => v.proposal_id === item.id);
            const yes = itemVotes.filter(v => v.choice === 'confirmar').length;
            const no  = itemVotes.filter(v => v.choice === 'denegar').length;
            const total = yes + no;
            const yesPct = total > 0 ? Math.round((yes / total) * 100) : 0;
            const noPct  = total > 0 ? Math.round((no  / total) * 100) : 0;
            const numLabel = `${item.blockIdx + 1}.${String(item.itemIdx + 1).padStart(2, '0')}`;
            return (
              <div key={item.id} className="dashboard-item">
                <div className="dash-item-header">
                  <span className="dash-item-num" style={{ color }}>{numLabel}</span>
                  <p className="dash-item-title">{item.title}</p>
                </div>
                <div className="dash-bar-track">
                  <motion.div className="dash-bar dash-bar--yes" title={`${yes} coincideixen`}
                    initial={{ width: 0 }} animate={{ width: `${yesPct}%` }} transition={{ duration: 0.6, delay: item.itemIdx * 0.05 }} />
                  <motion.div className="dash-bar dash-bar--no" title={`${no} no coincideixen`}
                    initial={{ width: 0 }} animate={{ width: `${noPct}%` }} transition={{ duration: 0.6, delay: item.itemIdx * 0.05 + 0.1 }} />
                </div>
                <div className="dash-counts">
                  <span className="dash-yes">{yes} coincideixen</span>
                  <span className="dash-no">{no} no coincideixen</span>
                  {total === 0 && <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>Sense vots</span>}
                </div>
              </div>
            );
          })}
        </div>
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
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   updateSlide(currentIndex - 1);
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
        else        updateSlide(currentIndex - 1);
      }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend',   onEnd,   { passive: true });
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
    const newVotes = { ...myVotes, [itemId]: choice };
    setMyVotes(newVotes);
    localStorage.setItem(`coms_votes_${sessionId}`, JSON.stringify(newVotes));
    try {
      await supabase.from('coms_votes').upsert({
        session_id: sessionId, slide_id: sectionId, proposal_id: itemId, choice,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'session_id,proposal_id' });
    } catch (e) { /* votes already saved in localStorage */ }
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
  const isVotingSection = slide.mirada.id === 'mirada-dins' || slide.mirada.id === 'mirada-endavant';
  const audienceUrl = `${window.location.origin}${window.location.pathname}`;

  const breadcrumb = slide.mirada.title;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span className="badge">FJE 2026–2029</span>
          <span className="header-title">COMS · Pla d'Aprenentatge</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span className="header-breadcrumb" style={{ color }}>{breadcrumb}</span>

          <div className="mirada-nav-dots" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {comsData.map((m) => {
              const miradaSlides = allSlides.filter(s => s.mirada.id === m.id);
              const mColor = COLORS[m.id];
              const currentInMirada = miradaSlides.findIndex(s => allSlides.indexOf(s) === currentIndex);
              const pct = currentInMirada >= 0 ? ((currentInMirada + 1) / miradaSlides.length) : 0;
              const isActive = slide.mirada.id === m.id;
              return (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center' }}>
                  <motion.div animate={{ background: isActive ? mColor : '#ddd', width: isActive ? '28px' : '14px', height: '5px', borderRadius: '3px' }} transition={{ duration: 0.3 }} />
                  {isActive && (
                    <div style={{ width: '28px', height: '2px', background: '#eee', borderRadius: '1px', overflow: 'hidden' }}>
                      <motion.div style={{ height: '100%', background: mColor, borderRadius: '1px' }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.4 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isPresenter && (
            <>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="badge"
                style={{ background: isVotingOpen ? '#c0392b' : '#1e8449', color: 'white', cursor: 'pointer', border: 'none' }}
                onClick={toggleVoting}>
                {isVotingOpen ? <><X size={10} style={{ marginRight: 4 }} /> TANCAR VOTS</> : <><Rocket size={10} style={{ marginRight: 4 }} /> OBRIR VOTS</>}
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="badge"
                style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setShowResults(v => !v)}>
                {showResults ? <><EyeOff size={10} style={{ marginRight: 4 }} /> AMAGAR</> : <><BarChart2 size={10} style={{ marginRight: 4 }} /> RESULTATS</>}
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="badge"
                style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setShowQr(v => !v)}>
                <QrCode size={10} style={{ marginRight: 4 }} /> QR
              </motion.button>

              <span className="badge" style={{ borderColor: 'rgba(201,146,42,0.4)', color: 'var(--gold)' }}>PRESENTADOR</span>
            </>
          )}
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

            {/* Audience in voting sections → VotingPanel (stays even when presenter is at dashboard) */}
            {!isPresenter && isVotingSection ? (
              <VotingPanel mirada={slide.mirada} myVotes={myVotes} onVote={handleVote} />
            ) : (
              <>
                {slide.type === 'mirada-intro' && <IntroSlide slide={slide} />}
                {slide.type === 'block' && <BlockSlide slide={slide} />}
                {slide.type === 'dashboard' && <DashboardSlide />}
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

      {/* Navigation */}
      <div className="nav-overlay">
        <button className="nav-arrow-float" onClick={() => updateSlide(currentIndex - 1)} disabled={currentIndex === 0}>
          <ChevronLeft size={24} />
        </button>
        <button className="nav-arrow-float" onClick={() => updateSlide(currentIndex + 1)} disabled={currentIndex === allSlides.length - 1}>
          <ChevronRight size={24} />
        </button>
      </div>

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
    </div>
  );
}
