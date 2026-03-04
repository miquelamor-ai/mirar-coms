import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { comsData, type Mirada, type Block, type Item } from './data/comsContent';
import {
  ChevronRight, ChevronLeft, Check, HelpCircle, X,
  Rocket, FlaskConical, Construction, Brain, Ban, Send,
  BarChart2, EyeOff
} from 'lucide-react';
import { LiveChart } from './components/LiveChart';
import { motion, AnimatePresence } from 'framer-motion';

// ─── FLAT SLIDE STRUCTURE ─────────────────────────────────────────────────────

type SlideType = 'mirada-intro' | 'block' | 'item';

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
  introStep?: number; // 0 = initial intro, 1+ = progressive chip reveal
}

function buildSlides(): FlatSlide[] {
  return comsData.flatMap(mirada => {
    const introSlide: FlatSlide = {
      type: 'mirada-intro', slideKey: `${mirada.id}:intro`,
      mirada, blockIndex: -1, itemIndex: -1,
      totalBlocks: mirada.blocks.length, totalItems: 0, introStep: 0,
    };

    if (mirada.layout === 'reveal-only') {
      return [
        introSlide,
        ...mirada.blocks.map((_, si) => ({
          type: 'mirada-intro' as SlideType,
          slideKey: `${mirada.id}:intro:s${si + 1}`,
          mirada, blockIndex: -1, itemIndex: -1,
          totalBlocks: mirada.blocks.length, totalItems: 0, introStep: si + 1,
        })),
      ];
    }

    // 'blocks-only': intro + block slides, no reveal steps, no item slides
    return [
      introSlide,
      ...mirada.blocks.map((block, bi) => ({
        type: 'block' as SlideType,
        slideKey: `${mirada.id}:b${bi}`,
        mirada, block, blockIndex: bi, itemIndex: -1,
        totalBlocks: mirada.blocks.length, totalItems: block.items.length,
      })),
    ];
  });
}

function normalizeKey(key: string): string {
  return key.includes(':') ? key : `${key}:intro`;
}

const allSlides = buildSlides();

const COLORS: Record<string, string> = {
  'preamble': '#8e44ad',
  'mirada-fora': '#3498db',
  'mirada-dins': '#e67e22',
  'mirada-endavant': '#27ae60'
};

// ─── MIRADA INTRO SLIDE ───────────────────────────────────────────────────────

function IntroSlide({ slide }: { slide: FlatSlide }) {
  const { mirada } = slide;
  const step = slide.introStep ?? 0;
  const color = COLORS[mirada.id];

  // ── Step 0: initial intro ──────────────────────────────────────────────────
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
                <motion.div
                  key={b.id}
                  className="intro-block-chip"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                >
                  {b.title}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="panel-right intro-right">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <div className="intro-label" style={{ color }}>Introducció</div>
            <blockquote className="intro-quote">{mirada.intro}</blockquote>

            {mirada.illustration && (
              <motion.div className="intro-illustration"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
              >
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

  // ── Step 1+: progressive chip reveal ──────────────────────────────────────
  const revealedBlocks = mirada.blocks.slice(0, step);

  return (
    <>
      {/* Left: header + intro text compact */}
      <div className="panel-left intro-panel" style={{ background: color }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="intro-left-content"
        >
          <div className="mirada-num">{mirada.number}</div>
          <h1 className="mirada-ttl">{mirada.title}</h1>
          <p className="mirada-sub">{mirada.subtitle}</p>
          <p className="intro-text-compact">{mirada.intro}</p>
        </motion.div>
      </div>

      {/* Right: revealed expanded chips */}
      <div className="panel-right reveal-right">
        <div className="reveal-chips-list">
          {revealedBlocks.map((block, i) => {
            const isNew = i === revealedBlocks.length - 1;
            return (
              <motion.div
                key={block.id}
                className="reveal-chip"
                initial={isNew ? { opacity: 0, x: -28 } : { opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={isNew
                  ? { duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 0.18 }
                }
              >
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
      {/* Left: mirada context */}
      <div className="panel-left" style={{ background: `linear-gradient(155deg, var(--bg) 0%, ${color}12 100%)` }}>
        <div className="accent-line" style={{ background: `linear-gradient(to bottom, transparent, ${color}90, transparent)` }} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
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
                  borderRadius: '6px',
                  padding: '0.3rem 0.5rem',
                  margin: '0 -0.5rem',
                }}>
                <div className="block-nav-dot" style={{ background: i === blockIndex ? color : 'var(--border)', flexShrink: 0 }} />
                <span>{b.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: block overview with items */}
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
              <motion.div className="block-illustration"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <img src={block.illustration} className="sketch-img" alt="" style={{ maxWidth: '400px', margin: '1rem 0' }} />
              </motion.div>
            )}

            {block.items.length > 0 ? (
              <div className="block-items-grid">
                {block.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="block-item-card"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                  >
                    <div>
                      <p className="block-item-title">{item.title}</p>
                      <p className="block-item-preview">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : block.keyPoints && (
              <ul className="key-points" style={{ marginTop: '1.25rem' }}>
                {block.keyPoints.map((pt, i) => (
                  <motion.li
                    key={i}
                    className="key-point"
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                  >
                    <span className="kp-dot" style={{ background: color }} />
                    {pt}
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
  handleVote: (choice: string, itemId: string) => void;
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
      {/* Left: full context (mirada + block + items nav) */}
      <div className="panel-left" style={{ background: `linear-gradient(155deg, var(--bg) 0%, ${color}10 100%)` }}>
        <div className="accent-line" style={{ background: `linear-gradient(to bottom, transparent, ${color}80, transparent)` }} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.38 }}>
          <p className="side-label">Mirada</p>
          <div className="side-num" style={{ color }}>{mirada.number}</div>
          <h2 className="side-ttl" style={{ color }}>{mirada.title}</h2>

          {/* Block breadcrumb */}
          <div className="block-breadcrumb" style={{ borderColor: `${color}30`, color }}>
            {block.title}
          </div>

          {/* Items navigation */}
          <div className="items-nav">
            {block.items.map((it, i) => (
              <div key={it.id} className="item-nav-row"
                style={{
                  color: i === itemIndex ? color : 'var(--text-dim)',
                  fontWeight: i === itemIndex ? 600 : 400,
                  background: i === itemIndex ? `${color}12` : 'transparent',
                  borderRadius: '5px',
                  padding: '0.25rem 0.45rem',
                  margin: '0 -0.45rem',
                }}>
                <div className="item-nav-dot" style={{ background: i === itemIndex ? color : 'var(--border)', flexShrink: 0 }} />
                <span>{it.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: item detail */}
      <div className="panel-right">
        <AnimatePresence mode="wait">
          <motion.div key={item.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>

            {/* Header */}
            <div className="item-header">
              <p className="item-meta">{itemIndex + 1} de {totalItems}</p>
              <h2 className="item-title">{item.title}</h2>
            </div>

            {/* Content */}
            <p className="item-content">{item.content}</p>

            {/* Key points */}
            {item.keyPoints && (
              <ul className="key-points">
                {item.keyPoints.map((pt, i) => (
                  <motion.li
                    key={i}
                    className="key-point"
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                  >
                    <span className="kp-dot" style={{ background: color }} />
                    {pt}
                  </motion.li>
                ))}
              </ul>
            )}

            {/* Interactive voting */}
            {item.interactive && (
              <div className="interactive-divider">
                {isPresenter ? (
                  showResults && <LiveChart slideId={mirada.id} proposalId={item.id} type={item.votingType === 'decision' ? 'decision' : 'validation'} />
                ) : isVotingOpen ? (
                  <div className={item.votingType === 'decision' ? 'vote-grid' : 'validate-grid'}>
                    {VOTE_OPTIONS.map(v => (
                      <button
                        key={v.key}
                        className={item.votingType === 'decision' ? 'vote-btn' : 'validate-btn'}
                        onClick={() => handleVote(v.key, item.id)}
                        style={{ '--vote-color': v.color } as React.CSSProperties}
                      >
                        <span style={{ color: v.color }}>{v.icon}</span>
                        <span>{v.label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="voting-closed">
                    {isPresenter ? 'Votacions tancades' : 'Espai de reflexió'}
                  </div>
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

            {/* Contributions (presenter) */}
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

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPresenter, setIsPresenter] = useState(false);
  const [newIdea, setNewIdea] = useState('');
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [contributions, setContributions] = useState<any[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPresenter(params.get('mode') === 'presenter');
  }, []);

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.from('coms_session_state').select('*').single();
      if (data) {
        const key = normalizeKey(data.current_slide_id);
        const idx = allSlides.findIndex(s => s.slideKey === key);
        if (idx !== -1) setCurrentIndex(idx);
        setIsVotingOpen(data.is_voting_open);
      }
      setLoading(false);

      const ch = supabase.channel('coms_sync')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'coms_session_state' }, (p) => {
          const key = normalizeKey(p.new.current_slide_id);
          const idx = allSlides.findIndex(s => s.slideKey === key);
          if (idx !== -1) setCurrentIndex(idx);
          setIsVotingOpen(p.new.is_voting_open);
        }).subscribe();
      return () => { supabase.removeChannel(ch); };
    };
    run();
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
    setCurrentIndex(index); setShowResults(false);
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
    await supabase.from('coms_session_state').update({ is_voting_open: !isVotingOpen }).eq('id', 1);
  };

  const handleVote = async (choice: string, itemId: string) => {
    const slide = allSlides[currentIndex];
    await supabase.from('coms_votes').insert({ slide_id: slide.mirada.id, proposal_id: itemId, choice });
    alert('Vot registrat correctament');
  };

  const submitIdea = async () => {
    if (!newIdea.trim()) return;
    const slide = allSlides[currentIndex];
    await supabase.from('coms_contributions').insert({ slide_id: slide.mirada.id, content: newIdea });
    setNewIdea(''); alert('Aportació enviada');
  };

  if (loading) return <div className="loading-screen">Carregant...</div>;

  const slide = allSlides[currentIndex];
  const color = COLORS[slide.mirada.id];

  // Build breadcrumb text
  const breadcrumb = (() => {
    if (slide.type === 'mirada-intro') return slide.mirada.title;
    if (slide.type === 'block') return `${slide.mirada.title} · ${slide.block?.title}`;
    return `${slide.mirada.title} · ${slide.block?.title} · ${slide.item?.title}`;
  })();

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span className="badge">FJE 2026–2029</span>
          <span className="header-title">COMS · Pla d'Aprenentatge</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Breadcrumb-style position */}
          <span className="header-breadcrumb" style={{ color }}>{breadcrumb}</span>

          {/* Mirada dots */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {comsData.map((m) => {
              const miradaSlides = allSlides.filter(s => s.mirada.id === m.id);
              const mColor = COLORS[m.id];
              const currentInMirada = miradaSlides.findIndex(s => allSlides.indexOf(s) === currentIndex);
              const pct = currentInMirada >= 0 ? ((currentInMirada + 1) / miradaSlides.length) : 0;
              const isActive = slide.mirada.id === m.id;
              return (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center' }}>
                  <motion.div
                    animate={{ background: isActive ? mColor : '#ddd', width: isActive ? '28px' : '14px', height: '5px', borderRadius: '3px' }}
                    transition={{ duration: 0.3 }}
                  />
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
                onClick={toggleVoting}
              >
                {isVotingOpen ? <><X size={10} style={{ marginRight: 4 }} /> TANCAR VOTS</> : <><Rocket size={10} style={{ marginRight: 4 }} /> OBRIR VOTS</>}
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="badge"
                style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setShowResults(v => !v)}
              >
                {showResults ? <><EyeOff size={10} style={{ marginRight: 4 }} /> AMAGAR</> : <><BarChart2 size={10} style={{ marginRight: 4 }} /> RESULTATS</>}
              </motion.button>

              <span className="badge" style={{ borderColor: 'rgba(201,146,42,0.4)', color: 'var(--gold)' }}>PRESENTADOR</span>
            </>
          )}
        </div>
      </header>

      {/* Slide */}
      <main className="slide-area">
        <AnimatePresence mode="wait">
          <motion.div key={slide.slideKey} className="slide-area" style={{ width: '100%' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
            {slide.type === 'mirada-intro' && <IntroSlide slide={slide} />}
            {slide.type === 'block' && <BlockSlide slide={slide} />}
            {slide.type === 'item' && (
              <ItemSlide
                slide={slide} isPresenter={isPresenter} isVotingOpen={isVotingOpen}
                showResults={showResults} contributions={contributions}
                handleVote={handleVote} submitIdea={submitIdea}
                newIdea={newIdea} setNewIdea={setNewIdea}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      {/* Navegació Flotant Minimalista (Només fletxes) */}
      <div className="nav-overlay">
        <button className="nav-arrow-float" onClick={() => updateSlide(currentIndex - 1)} disabled={currentIndex === 0}>
          <ChevronLeft size={24} />
        </button>
        <button className="nav-arrow-float" onClick={() => updateSlide(currentIndex + 1)} disabled={currentIndex === allSlides.length - 1}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
