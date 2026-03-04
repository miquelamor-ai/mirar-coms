import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { comsData } from './data/comsContent';
import {
  ChevronRight, ChevronLeft, Check, HelpCircle, X,
  Rocket, FlaskConical, Construction, Brain, Ban, Send,
  BarChart2, EyeOff
} from 'lucide-react';
import { LiveChart } from './components/LiveChart';
import { motion, AnimatePresence } from 'framer-motion';

// --- Components Cinemàtics ---
const ParallaxBackground = () => (
  <div className="parallax-wrapper">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 0.05,
        y: [0, -30, 0],
        x: [0, 20, 0]
      }}
      transition={{
        opacity: { duration: 2 },
        y: { duration: 15, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 15, repeat: Infinity, ease: "easeInOut" }
      }}
      className="parallax-sphere sphere-1"
    />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 0.03,
        y: [0, 40, 0],
        x: [0, -20, 0]
      }}
      transition={{
        opacity: { duration: 2, delay: 0.5 },
        y: { duration: 20, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 20, repeat: Infinity, ease: "easeInOut" }
      }}
      className="parallax-sphere sphere-2"
    />
  </div>
);

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresenter, setIsPresenter] = useState(false);
  const [newIdea, setNewIdea] = useState('');
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [contributions, setContributions] = useState<any[]>([]);

  // Determinar mode des de la URL (?mode=presenter)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPresenter(params.get('mode') === 'presenter');
  }, []);

  // Sincronització de l'estat compartit
  useEffect(() => {
    const fetchAndSubscribe = async () => {
      // 1. Carregar estat inicial
      const { data } = await supabase
        .from('coms_session_state')
        .select('*')
        .single();

      if (data) {
        const slideIndex = comsData.findIndex(m => m.id === data.current_slide_id);
        if (slideIndex !== -1) setCurrentSlideIndex(slideIndex);
        setIsVotingOpen(data.is_voting_open);
      }
      setLoading(false);

      // 2. Subscriure's a canvis en temps real
      const channel = supabase
        .channel('coms_sync')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'coms_session_state' },
          (payload) => {
            const slideIndex = comsData.findIndex(m => m.id === payload.new.current_slide_id);
            if (slideIndex !== -1) setCurrentSlideIndex(slideIndex);
            setIsVotingOpen(payload.new.is_voting_open);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchAndSubscribe();
  }, []);

  // Gestió d'aportacions (Només per al presentador)
  useEffect(() => {
    if (!isPresenter) return;

    const fetchContributions = async () => {
      const { data } = await supabase
        .from('coms_contributions')
        .select('*')
        .eq('slide_id', comsData[currentSlideIndex].id)
        .order('created_at', { ascending: false });

      if (data) setContributions(data);
    };

    fetchContributions();

    const channel = supabase
      .channel('contributions_sync')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'coms_contributions', filter: `slide_id=eq.${comsData[currentSlideIndex].id}` },
        (payload) => {
          setContributions(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isPresenter, currentSlideIndex]);

  const updateSlide = async (index: number) => {
    if (!isPresenter || index < 0 || index >= comsData.length) return;

    // Update local state immediately for "Cinematic Smoothness"
    const newSlideId = comsData[index].id;
    setCurrentSlideIndex(index);
    setShowResults(false);

    // Sync with database
    try {
      await supabase
        .from('coms_session_state')
        .update({
          current_slide_id: newSlideId,
          is_voting_open: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
    } catch (err) {
      console.error("Error updating slide:", err);
    }
  };

  const toggleVoting = async () => {
    if (!isPresenter) return;
    await supabase
      .from('coms_session_state')
      .update({ is_voting_open: !isVotingOpen })
      .eq('id', 1);
  };

  const handleVote = async (choice: string, proposalId: string = 'general') => {
    const slideId = comsData[currentSlideIndex].id;
    await supabase.from('coms_votes').insert({
      slide_id: slideId,
      proposal_id: proposalId,
      choice
    });
    alert('Vot registrat correctament');
  };

  const submitIdea = async () => {
    if (!newIdea.trim()) return;
    const slideId = comsData[currentSlideIndex].id;
    await supabase.from('coms_contributions').insert({
      slide_id: slideId,
      content: newIdea
    });
    setNewIdea('');
    alert('Aportació enviada a revisió');
  };

  if (loading) return <div className="app-container items-center justify-center serif text-3xl">Carregant Mirades...</div>;

  const currentMirada = comsData[currentSlideIndex];

  return (
    <div className="app-container">
      <ParallaxBackground />

      {/* Capçalera */}
      <header className="site-header">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-4"
        >
          <span className="badge">FJE 2026–2029</span>
          <h1 className="serif">COMS • Pla d'Aprenentatge</h1>
        </motion.div>
        {isPresenter && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="badge"
            style={{ backgroundColor: 'var(--accent-gold)', color: 'white' }}
          >
            PRESENTADOR
          </motion.div>
        )}
      </header>

      {/* Contingut Principal */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >

            <div className="split-layout">
              {/* Esquerra: Títol de la Mirada (Fix) */}
              <div className="side-sticky">
                <section style={{ marginBottom: '2rem' }}>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mirada-number"
                  >
                    {currentMirada.number}
                  </motion.div>
                  <h2 className="serif" style={{ fontSize: '4.5rem', marginBottom: '1rem', color: currentMirada.color }}>
                    {currentMirada.title}
                  </h2>
                  <p className="mirada-subtitle serif" style={{ fontSize: '1.8rem' }}>{currentMirada.subtitle}</p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ fontSize: '1.3rem', marginTop: '2rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}
                  >
                    {currentMirada.intro}
                  </motion.p>
                </section>
              </div>

              {/* Dreta: Contingut i Interacció (Scroll) */}
              <div className="main-scroll-area">
                {currentMirada.sections.map((section) => (
                  <motion.div
                    key={section.id}
                    className="premium-card"
                    whileHover={{ y: -5 }}
                  >
                    <div className="card-icon-wrapper">
                      {section.icon}
                    </div>

                    <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{section.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: section.interactive ? '2rem' : '0' }}>
                      {section.content}
                    </p>

                    {/* Contingut d'interacció o resultats */}
                    {section.interactive && (
                      <div style={{ paddingTop: '2rem', borderTop: '1px solid #f0f0f0' }}>

                        {/* 1. Bloc de PROPOSTES (Mirada ENDAVANT) */}
                        {section.proposals ? (
                          <div className="proposals-list" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            {section.proposals.map((prop) => (
                              <div key={prop.id} className="proposal-item">
                                <div className="flex gap-2" style={{ marginBottom: '1rem', fontWeight: 600 }}>
                                  <span>{prop.icon}</span>
                                  <span>{prop.title}</span>
                                </div>

                                {isPresenter ? (
                                  showResults && <LiveChart slideId={currentMirada.id} proposalId={prop.id} type="decision" />
                                ) : (
                                  isVotingOpen ? (
                                    <div className="interaction-grid">
                                      <button onClick={() => handleVote('activar', prop.id)} className="vote-btn">
                                        <Rocket style={{ color: '#27ae60' }} />
                                        <span>Activar</span>
                                      </button>
                                      <button onClick={() => handleVote('pilotar', prop.id)} className="vote-btn">
                                        <FlaskConical style={{ color: '#3498db' }} />
                                        <span>Pilotar</span>
                                      </button>
                                      <button onClick={() => handleVote('preparar', prop.id)} className="vote-btn">
                                        <Construction style={{ color: '#f1c40f' }} />
                                        <span>Preparar</span>
                                      </button>
                                      <button onClick={() => handleVote('reflexionar', prop.id)} className="vote-btn">
                                        <Brain style={{ color: '#9b59b6' }} />
                                        <span>Repensar</span>
                                      </button>
                                      <button onClick={() => handleVote('desestimar', prop.id)} className="vote-btn">
                                        <Ban style={{ color: '#e74c3c' }} />
                                        <span>No</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-center py-4 bg-gray-50 rounded-lg text-sm text-gray-400 italic">Votacions tancades pel presentador</div>
                                  )
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* 2. Bloc de VALIDACIÓ (Mirada FORA / DINS) */
                          isPresenter ? (
                            showResults && <LiveChart slideId={currentMirada.id} type="validation" />
                          ) : (
                            isVotingOpen ? (
                              <div className="flex justify-between gap-4">
                                <button onClick={() => handleVote('confirmar')} className="btn-secondary flex-1 flex" style={{ justifyContent: 'center', gap: '8px' }}>
                                  <Check size={20} /> Confirmar
                                </button>
                                <button onClick={() => handleVote('dubtar')} className="btn-secondary flex-1 flex" style={{ justifyContent: 'center', gap: '8px' }}>
                                  <HelpCircle size={20} /> Dubtar
                                </button>
                                <button onClick={() => handleVote('denegar')} className="btn-secondary flex-1 flex" style={{ justifyContent: 'center', gap: '8px' }}>
                                  <X size={20} /> Denegar
                                </button>
                              </div>
                            ) : (
                              <div className="text-center py-4 bg-gray-50 rounded-lg text-sm text-gray-400 italic">Espai de reflexió (votacions tancades)</div>
                            )
                          )
                        )}

                        {/* Bústia d'aportacions (només audiència) */}
                        {!isPresenter && (
                          <div className="idea-input-group">
                            <input
                              type="text"
                              className="idea-input"
                              placeholder="Tens una aportació nova?"
                              value={newIdea}
                              onChange={(e) => setNewIdea(e.target.value)}
                            />
                            <button onClick={submitIdea} className="btn-primary" style={{ padding: '0 1.5rem', display: 'flex', alignItems: 'center' }}>
                              <Send size={20} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Tauler d'Aportacions (Dins de la columna de la dreta al final) */}
                {isPresenter && contributions.length > 0 && (
                  <section className="fade-in" style={{ marginTop: '3rem' }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
                      <Send className="text-info" size={24} />
                      <h3 className="serif text-2xl" style={{ opacity: 0.7 }}>Bústia de la Sala</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                      {contributions.map((idea) => (
                        <div key={idea.id} className="premium-card" style={{ padding: '1.2rem', marginBottom: 0, borderLeft: '4px solid var(--accent-blue)' }}>
                          <p style={{ fontSize: '1rem', fontStyle: 'italic' }}>"{idea.content}"</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navegació i Controls de Presentador */}
      {isPresenter && (
        <footer className="site-footer">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <button
              className="btn-nav"
              onClick={() => updateSlide(currentSlideIndex - 1)}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft size={32} />
            </button>

            <div className="flex gap-4 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleVoting}
                className="btn-primary flex items-center gap-2"
                style={{ backgroundColor: isVotingOpen ? '#e74c3c' : '#27ae60', padding: '0.8rem 1.5rem' }}
              >
                {isVotingOpen ? <X size={18} /> : <Rocket size={18} />}
                <span>{isVotingOpen ? 'Tancar Vots' : 'Obrir Vots'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowResults(!showResults)}
                className="btn-secondary flex items-center gap-2"
                style={{ padding: '0.8rem 1.5rem' }}
              >
                {showResults ? <EyeOff size={18} /> : <BarChart2 size={18} />}
                <span>Resultats</span>
              </motion.button>

              <div className="flex gap-2 ml-4">
                {comsData.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: i === currentSlideIndex ? 1.5 : 1,
                      backgroundColor: i === currentSlideIndex ? 'var(--accent-blue)' : '#e0e0e0'
                    }}
                    className="dot-nav"
                  />
                ))}
              </div>
            </div>

            <button
              className="btn-nav"
              onClick={() => updateSlide(currentSlideIndex + 1)}
              disabled={currentSlideIndex === comsData.length - 1}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </footer>
      )}

      {/* Progrés per a l'audiència */}
      {!isPresenter && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '4px', background: '#f0f0f0' }}>
          <div style={{
            height: '100%', backgroundColor: 'var(--accent-blue)',
            width: `${((currentSlideIndex + 1) / comsData.length) * 100}%`,
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      )}
    </div>
  );
}
