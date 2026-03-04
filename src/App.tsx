import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { comsData } from './data/comsContent';
import {
  ChevronRight, ChevronLeft, Check, HelpCircle, X,
  Rocket, FlaskConical, Construction, Brain, Ban, Send,
  BarChart2, EyeOff
} from 'lucide-react';
import { LiveChart } from './components/LiveChart';

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresenter, setIsPresenter] = useState(false);
  const [newIdea, setNewIdea] = useState('');
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [isVotingOpen, setIsVotingOpen] = useState(false);

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

  const updateSlide = async (index: number) => {
    if (!isPresenter) return;
    const newSlideId = comsData[index].id;
    await supabase
      .from('coms_session_state')
      .update({
        current_slide_id: newSlideId,
        is_voting_open: false, // Reset voting when changing slide
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);
    setShowResults(false);
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
      {/* Capçalera */}
      <header className="site-header">
        <div className="flex items-center gap-4">
          <span className="badge">FJE 2026–2029</span>
          <h1 className="serif">COMS • Pla d'Aprenentatge</h1>
        </div>
        {isPresenter && <div className="badge" style={{ backgroundColor: 'var(--accent-gold)', color: 'white' }}>PRESENTADOR</div>}
      </header>

      {/* Contingut Principal */}
      <main className="main-content fade-in">

        {/* Capçalera de Mirada */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="mirada-number">{currentMirada.number}</div>
          <h2 className="serif" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: currentMirada.color }}>
            {currentMirada.title}
          </h2>
          <p className="mirada-subtitle serif">{currentMirada.subtitle}</p>
          <p style={{ fontSize: '1.2rem', marginTop: '1.5rem', color: 'var(--text-secondary)', maxWidth: '700px' }}>
            {currentMirada.intro}
          </p>
        </section>

        {/* Seccions Interactives */}
        {currentMirada.sections.map((section) => (
          <div key={section.id} className="premium-card">
            <div className="flex gap-6" style={{ marginBottom: section.interactive ? '2rem' : '0' }}>
              <span style={{ fontSize: '2.5rem' }}>{section.icon}</span>
              <div>
                <h3 className="serif text-2xl" style={{ marginBottom: '0.5rem' }}>{section.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{section.content}</p>
              </div>
            </div>

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
          </div>
        ))}
      </main>

      {/* Navegació i Controls de Presentador */}
      {isPresenter && (
        <footer className="site-footer">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button
              className="btn-secondary"
              onClick={() => updateSlide(currentSlideIndex - 1)}
              disabled={currentSlideIndex === 0}
              style={{ borderRadius: '50%', padding: '0.8rem', display: 'flex' }}
            >
              <ChevronLeft size={28} />
            </button>

            <div className="flex gap-6 items-center">
              <button
                onClick={toggleVoting}
                className="btn-primary flex items-center gap-2"
                style={{ backgroundColor: isVotingOpen ? '#e74c3c' : '#27ae60', padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}
              >
                {isVotingOpen ? <X size={16} /> : <Rocket size={16} />}
                {isVotingOpen ? 'Tancar Votacions' : 'Obrir Votacions'}
              </button>

              <button
                onClick={() => setShowResults(!showResults)}
                className="btn-secondary flex items-center gap-2"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}
              >
                {showResults ? <EyeOff size={16} /> : <BarChart2 size={16} />}
                {showResults ? 'Amagar Resultats' : 'Veure Resultats en Viu'}
              </button>

              <div className="flex gap-2">
                {comsData.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      backgroundColor: i === currentSlideIndex ? 'var(--accent-blue)' : '#e0e0e0',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              className="btn-secondary"
              onClick={() => updateSlide(currentSlideIndex + 1)}
              disabled={currentSlideIndex === comsData.length - 1}
              style={{ borderRadius: '50%', padding: '0.8rem', display: 'flex' }}
            >
              <ChevronRight size={28} />
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
