export type ViewId = 'mirada-fora' | 'mirada-dins' | 'mirada-endavant';

export interface Proposal {
    id: string;
    title: string;
    icon: string;
    content: string;
}

export interface Mirada {
    id: ViewId;
    title: string;
    subtitle: string;
    number: string;
    color: string;
    intro: string;
    sections: {
        id: string;
        title: string;
        icon: string;
        content: string;
        interactive?: boolean;
        proposals?: Proposal[];
    }[];
}

export const comsData: Mirada[] = [
    {
        id: 'mirada-fora',
        title: 'MIRAR FORA',
        subtitle: 'Fonamentació Científica i Estratègica',
        number: '01',
        color: '#3498db',
        intro: 'La reflexió sobre el Pla d’Aprenentatge respon a una premissa: el desenvolupament professional és l’element amb més impacte en l’aprenentatge de l’alumnat.',
        sections: [
            {
                id: 'motor-desenvolupament',
                title: 'El Desenvolupament com a Motor',
                icon: '⚙️',
                content: 'L\'educador passa de receptor passiu a protagonista. Transitem del "concert" puntual al "fil musical" constant en la cultura escolar.',
                interactive: true
            },
            {
                id: 'impacte-guskey',
                title: 'Avaluació de l’Impacte (Guskey)',
                icon: '🎯',
                content: 'Superar la satisfacció per arribar a la transferència. Planificació inversa: primer la millora de l\'alumne, després l\'acció docent.',
                interactive: true
            },
            {
                id: 'capital-professional',
                title: 'Capital Professional i Identitat',
                icon: '🏛️',
                content: 'Enfortir la musculatura institucional (Fullan & Hargreaves). Els 6 COMS són actes pedagògics que decideixen qui som.',
                interactive: true
            }
        ]
    },
    {
        id: 'mirada-dins',
        title: 'MIRAR DINS',
        subtitle: 'Diagnosi i Punts Crítics',
        number: '02',
        color: '#e67e22',
        intro: 'Analitzem les limitacions actuals per evitar "castells a l\'aire" i garantir que l\'aprenentatge cali realment en la cultura organitzativa.',
        sections: [
            {
                id: 'diagnosi-critica',
                title: 'La Fragmentació i les Receptes',
                icon: '⚠️',
                content: 'Tallers de 15h insuficients per al canvi profund. L\'angoixa emocional demana receptes ràpides sense comprensió real.',
                interactive: true
            },
            {
                id: 'hipertrofia-gestio',
                title: 'Barreres de la Cultura',
                icon: '🏗️',
                content: 'Hipertròfia de la gestió (burocràcia) i docents "francotiradors" que impedeixen formar comunitats d\'aprenentatge.',
                interactive: true
            }
        ]
    },
    {
        id: 'mirada-endavant',
        title: 'MIRAR ENDAVANT',
        subtitle: 'Full de Ruta i Propostes Concretes',
        number: '03',
        color: '#27ae60',
        intro: 'Classificació de les propostes estratègiques segons el seu nivell d\'implementació immediata en la reforma dels 6 COMS.',
        sections: [
            {
                id: 'temps-ritmes',
                title: 'Temps i Ritmes (Autonomia)',
                icon: '🕒',
                content: 'Ús estratègic de les 30h de conveni i sobirania del centre per rescatar hores de gestió cap al desenvolupament.',
                interactive: true,
                proposals: [
                    {
                        id: 'hours-rescue',
                        title: 'Rescat d’hores (30h)',
                        icon: '🔓',
                        content: 'Transformar reunions logístiques en moments de desenvolupament professional pausat.'
                    }
                ]
            },
            {
                id: 'model-add',
                title: 'Estructura i Metodologia (ADD)',
                icon: '🔄',
                content: 'Focus real en el DESPRÉS: protocols de seguiment, espais de reflexió compartida i observació entre iguals.',
                interactive: true,
                proposals: [
                    {
                        id: 'phase-before',
                        title: 'Fase ABANS (Diagnosi)',
                        icon: '📂',
                        content: 'Arribar amb preguntes i reptes identificats directament a l\'aula.'
                    },
                    {
                        id: 'phase-after',
                        title: 'Fase DESPRÉS (Impacte)',
                        icon: '📈',
                        content: 'Observació a l’aula i recull sistemàtic d’evidències d’aplicació.'
                    }
                ]
            },
            {
                id: 'rols- talents',
                title: 'Talents i Acompanyament',
                icon: '🤝',
                content: 'Lideratge pedagògic que protegeix espais i un Banc de Talents Intern per a un aprenentatge orgànic.',
                interactive: true,
                proposals: [
                    {
                        id: 'talent-bank',
                        title: 'Banc de Talents Intern',
                        icon: '💎',
                        content: 'Potenciar facilitadors i mentors de la pròpia xarxa institucional.'
                    }
                ]
            },
            {
                id: 'tipologies-profunditat',
                title: 'Cicles i Itineraris',
                icon: '🛤️',
                content: 'Itineraris plurianuals de 2 anys (Experimentació + Consolidació) i escala de progressió competencial.',
                interactive: true,
                proposals: [
                    {
                        id: 'pluriannual-cycles',
                        title: 'Itineraris de 2 anys',
                        icon: '♻️',
                        content: 'Any 1: Prova. Any 2: Producció de materials i reflexió sobre l’impacte.'
                    }
                ]
            },
            {
                id: 'avaluacio-evidencies',
                title: 'Avaluació i Impacte (Evidències)',
                icon: '📊',
                content: 'Mesurar el canvi real a l’aula i l’impacte en l’aprenentatge i benestar de l’alumnat (Nivells 4 i 5 de Guskey).',
                interactive: true,
                proposals: [
                    {
                        id: 'guskey-monitoring',
                        title: 'Monitoratge (Nivell 3-5)',
                        icon: '👁️',
                        content: 'Avaluar el suport del centre, el canvi docent i l’èxit de l’alumne.'
                    },
                    {
                        id: 'evidence-collection',
                        title: 'Recull d’Evidències d’Aula',
                        icon: '📸',
                        content: 'Diaris d’aula i mostres de treball de l’alumne per fer visible la millora.'
                    }
                ]
            },
            {
                id: 'recursos-plataforma',
                title: 'Recursos i Simplificació',
                icon: '💻',
                content: 'Plataforma de gestió per eliminar burocràcia i Portafoli Professional com a diari de creixement.',
                interactive: true,
                proposals: [
                    {
                        id: 'digital-portfolio',
                        title: 'Portafoli Professional',
                        icon: '📝',
                        content: 'Eina digital com a diari de creixement i reflexió docent.'
                    }
                ]
            }
        ]
    }
];
