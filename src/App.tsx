import { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import { comsData, type Mirada, type Block, type Item } from './data/comsContent';
import {
  ChevronRight, ChevronLeft, Check, HelpCircle, X,
  Rocket, FlaskConical, Construction, Brain, Ban, Send,
  BarChart2, EyeOff, QrCode, RotateCcw, Trash2
} from 'lucide-react';
import { LiveChart } from './components/LiveChart';
import { motion, AnimatePresence } from 'framer-motion';

// ─── FLAT SLIDE STRUCTURE ─────────────────────────────────────────────────────

type SlideType = 'mirada-intro' | 'block' | 'item' | 'dashboard' | 'endavant-vote-intro';

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
      const no  = iv.filter(v => v.choice === 'denegar').length;
      const total = yes + no;
      const yesPct = total > 0 ? Math.round((yes / total) * 100) : 0;
      return { ...item, blockIdx: bi, itemIdx: ii, blockTitle: b.title, yes, no, total, yesPct };
    })
  );

  const participantCount = new Set(votes.map(v => v.session_id)).size;
  const globalYes   = allItems.reduce((s, i) => s + i.yes, 0);
  const globalTotal = allItems.reduce((s, i) => s + i.total, 0);
  const globalPct   = globalTotal > 0 ? Math.round((globalYes / globalTotal) * 100) : 0;

  const voted = allItems.filter(i => i.total > 0);
  const topAgree    = [...voted].sort((a, b) => b.yesPct - a.yesPct).slice(0, 3);
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
          const bYes   = blockItems.reduce((s, i) => s + i.yes, 0);
          const bTotal = blockItems.reduce((s, i) => s + i.total, 0);
          const bPct   = bTotal > 0 ? Math.round((bYes / bTotal) * 100) : null;

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
  desestimar:  'No es veu possibilitat ni a la llarga de ser factible.',
  reflexionar: 'Cal dedicar més temps a parlar-ne i valorar la idoneïtat.',
  preparar:    'Es necessita temps, recursos o formació per implementar-ho.',
  pilotar:     'Es considera una prova per aprendre i poder escalar.',
  activar:     'Es pot implementar immediatament.',
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

type EndavantItemStat = {
  id: string; title: string;
  blockIdx: number; itemIdx: number;
  blockTitle: string; blockLetter: string;
  counts: Record<string, number>;
  total: number;
  winner: typeof ENDAVANT_OPTS[0] | null;
};

function DeItemRow({ item, numLabel, delay }: { item: EndavantItemStat; numLabel: string; delay: number }) {
  return (
    <motion.div className="de-item-row"
      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}>
      <span className="ds-item-num">{numLabel}</span>
      <div className="de-item-body">
        <span className="de-item-title">{item.title}</span>
        {item.total > 0 ? (
          <>
            <div className="de-stacked-bar">
              {ENDAVANT_OPTS.map(opt => {
                const pct = (item.counts[opt.key] / item.total) * 100;
                return pct > 0 ? (
                  <motion.div key={opt.key} className="de-stacked-seg"
                    style={{ background: opt.color }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
                    title={`${opt.label}: ${Math.round(pct)}%`}
                  />
                ) : null;
              })}
            </div>
            {item.winner && (
              <span className="de-win-badge"
                style={{ background: `${item.winner.color}18`, color: item.winner.color, borderColor: `${item.winner.color}40` }}>
                {item.winner.label}
              </span>
            )}
          </>
        ) : (
          <span className="de-no-votes">—</span>
        )}
      </div>
    </motion.div>
  );
}

function DashboardEndavant() {
  const [votes, setVotes] = useState<{ proposal_id: string; choice: string; session_id: string }[]>([]);
  const [activeBlock, setActiveBlock] = useState<string>('all');
  const endavant = comsData.find(m => m.id === 'mirada-endavant')!;
  const color = COLORS['mirada-endavant'];

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
  const filteredItems = activeBlock === 'all' ? allItems : allItems.filter(i => i.blockLetter === activeBlock);
  const numLabel = (item: EndavantItemStat) => `${item.blockIdx + 1}.${String(item.itemIdx + 1).padStart(2, '0')}`;

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

          {globalTotal > 0 && (
            <div className="de-dist">
              <p className="de-dist-label">Distribució global</p>
              <div className="de-dist-bar">
                {ENDAVANT_OPTS.map(opt => {
                  const pct = (globalCounts[opt.key] / globalTotal) * 100;
                  return pct > 0 ? (
                    <motion.div key={opt.key} className="de-dist-seg"
                      style={{ background: opt.color }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ) : null;
                })}
              </div>
              <div className="de-dist-legend">
                {ENDAVANT_OPTS.map(opt => (
                  <div key={opt.key} className="de-legend-row">
                    <span className="de-legend-dot" style={{ background: opt.color }} />
                    <span className="de-legend-label">{opt.label}</span>
                    <span className="de-legend-pct">
                      {globalTotal > 0 ? `${Math.round((globalCounts[opt.key] / globalTotal) * 100)}%` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="panel-right de-right">
        <div className="de-filters">
          <button className={`de-filter-btn${activeBlock === 'all' ? ' active' : ''}`}
            style={activeBlock === 'all' ? { borderColor: color, color } : {}}
            onClick={() => setActiveBlock('all')}>
            Tot
          </button>
          {endavant.blocks.map((b, bi) => {
            const letter = String.fromCharCode(65 + bi);
            return (
              <button key={letter}
                className={`de-filter-btn${activeBlock === letter ? ' active' : ''}`}
                style={activeBlock === letter ? { borderColor: color, color } : {}}
                onClick={() => setActiveBlock(letter)}
                title={b.title}>
                {letter}
              </button>
            );
          })}
        </div>

        {activeBlock === 'all' ? (
          endavant.blocks.map((block, bi) => {
            const blockItems = allItems.filter(i => i.blockIdx === bi);
            return (
              <div key={block.id} className="ds-block">
                <div className="ds-block-header" style={{ background: `${color}0f`, borderLeftColor: color }}>
                  <span className="ds-block-num" style={{ color }}>{String(bi + 1).padStart(2, '0')}</span>
                  <h3 className="ds-block-title">{block.title}</h3>
                </div>
                {blockItems.map((item, ii) => (
                  <DeItemRow key={item.id} item={item} numLabel={numLabel(item)} delay={(bi * 3 + ii) * 0.04} />
                ))}
              </div>
            );
          })
        ) : (
          <div className="ds-block">
            {filteredItems.map((item, ii) => (
              <DeItemRow key={item.id} item={item} numLabel={numLabel(item)} delay={ii * 0.05} />
            ))}
          </div>
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
                <div key={m.id} className="nav-dot-col">
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
        {isPresenter ? (
          <div className="header-controls">
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

            <span className="ctrl-counter">{currentIndex + 1}<span className="ctrl-counter-sep">/</span>{allSlides.length}</span>
          </div>
        ) : (
          <div className="header-brand" style={{ visibility: 'hidden' }} aria-hidden />
        )}
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
              <VotingPanel mirada={slide.mirada} myVotes={myVotes} onVote={handleVote} onReset={resetMyVotes} />
            ) : (
              <>
                {slide.type === 'mirada-intro' && <IntroSlide slide={slide} />}
                {slide.type === 'block' && <BlockSlide slide={slide} />}
                {slide.type === 'endavant-vote-intro' && <EndavantVoteIntroSlide />}
                {slide.type === 'dashboard' && (
                  slide.mirada.id === 'mirada-dins'
                    ? <DashboardSlide />
                    : <DashboardEndavant />
                )}
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
    </div>
  );
}
