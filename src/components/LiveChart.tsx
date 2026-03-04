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
            data.forEach(v => { counts[v.choice] = (counts[v.choice] || 0) + 1; });
            setResults(counts);
            setTotal(data.length);
        }
    };

    useEffect(() => {
        fetchVotes();
        const channel = supabase
            .channel(`votes-${slideId}-${proposalId}`)
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'coms_votes', filter: `slide_id=eq.${slideId}` },
                () => fetchVotes()
            )
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [slideId, proposalId]);

    if (total === 0) return (
        <div style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.8rem', fontStyle: 'italic', color: '#444', fontFamily: 'Lora, serif' }}>
            Esperant vots...
        </div>
    );

    const choices = type === 'validation'
        ? ['confirmar', 'dubtar', 'denegar']
        : ['activar', 'pilotar', 'preparar', 'reflexionar', 'desestimar'];

    const colors: Record<string, string> = {
        confirmar: '#27ae60', dubtar: '#d4a853', denegar: '#e74c3c',
        activar: '#27ae60', pilotar: '#4a90d4', preparar: '#d4a853',
        reflexionar: '#9b59b6', desestimar: '#e74c3c'
    };

    return (
        <div className="chart-container">
            <p style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555', marginBottom: '1rem', fontFamily: 'Lora, serif' }}>
                Resultats en viu — {total} vots
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {choices.map(choice => {
                    const count = results[choice] || 0;
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    return (
                        <div key={choice}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: colors[choice] }}>
                                    {choice}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: '#555', fontFamily: 'Lora, serif' }}>
                                    {count} ({Math.round(pct)}%)
                                </span>
                            </div>
                            <div className="chart-bar-bg">
                                <div
                                    className="chart-bar-fill"
                                    style={{ width: `${pct}%`, backgroundColor: colors[choice] }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
