import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LiveChartProps {
    slideId: string;
    proposalId?: string;
    type: 'validation' | 'decision';
}

export function LiveChart({ slideId, proposalId = 'general', type }: LiveChartProps) {
    const [results, setResults] = useState<Record<string, number>>({});
    const [total, setTotal] = useState(0);

    const fetchVotes = async () => {
        const { data } = await supabase
            .from('coms_votes')
            .select('choice')
            .eq('slide_id', slideId)
            .eq('proposal_id', proposalId);

        if (data) {
            const counts: Record<string, number> = {};
            data.forEach(v => {
                counts[v.choice] = (counts[v.choice] || 0) + 1;
            });
            setResults(counts);
            setTotal(data.length);
        }
    };

    useEffect(() => {
        fetchVotes();

        const channel = supabase
            .channel(`votes-${slideId}-${proposalId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'coms_votes', filter: `slide_id=eq.${slideId}` },
                () => {
                    fetchVotes();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [slideId, proposalId]);

    if (total === 0) return <div className="text-center py-4 text-sm text-gray-400 italic">Esperant vots...</div>;

    const choices = type === 'validation'
        ? ['confirmar', 'dubtar', 'denegar']
        : ['activar', 'pilotar', 'preparar', 'reflexionar', 'desestimar'];

    const colors: Record<string, string> = {
        confirmar: '#27ae60',
        dubtar: '#f1c40f',
        denegar: '#e74c3c',
        activar: '#27ae60',
        pilotar: '#3498db',
        preparar: '#f39c12',
        reflexionar: '#9b59b6',
        desestimar: '#e74c3c'
    };

    return (
        <div className="chart-container fade-in">
            <div className="flex justify-between items-end mb-2">
                <h4 style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                    Resultats en viu ({total} vots)
                </h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {choices.map(choice => {
                    const count = results[choice] || 0;
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                        <div key={choice} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div className="flex justify-between" style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                <span className={`text-${choices.length > 3 ? (choice === 'activar' ? 'success' : choice === 'pilotar' ? 'info' : choice === 'preparar' ? 'warning' : choice === 'reflexionar' ? 'purple' : 'danger') : (choice === 'confirmar' ? 'success' : choice === 'dubtar' ? 'warning' : 'danger')}`}>
                                    {choice}
                                </span>
                                <span style={{ color: 'var(--text-secondary)' }}>{count} ({Math.round(percentage)}%)</span>
                            </div>
                            <div className="chart-bar-bg">
                                <div
                                    className="chart-bar-fill"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: colors[choice] || '#ccc'
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
