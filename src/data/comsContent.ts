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
        subtitle: 'El Motor del Desenvolupament Professional',
        number: '01',
        color: '#3498db',
        intro: 'La reflexió sobre el Pla d’Aprenentatge respon a una premissa: el desenvolupament professional és l’element amb més impacte en l’aprenentatge de l’alumnat.',
        sections: [
            {
                id: 'fonamentacio',
                title: 'Fonamentació Científica i Estratègica',
                icon: '🔭',
                content: 'Ens recolzem en Guskey (impacte en aula), Grossman & Salas (transferència), Fullan & Hargreaves (Capital Social) i el marc dels 6 COMS.',
                interactive: true
            }
        ]
    },
    {
        id: 'mirada-dins',
        title: 'MIRAR DINS',
        subtitle: 'Diagnosi de la Situació Actual',
        number: '02',
        color: '#e67e22',
        intro: 'Analitzem críticament l’estat actual de la formació per identificar punts de bloqueig i oportunitats de millora real.',
        sections: [
            {
                id: 'diagnosi',
                title: 'Limitacions i Punts de Dolor',
                icon: '🔍',
                content: 'Model aïllat, dosis fragmentades, la trampa de les receptes i el dèficit d’acompanyament post-formatiu.',
                interactive: true
            }
        ]
    },
    {
        id: 'mirada-endavant',
        title: 'MIRAR ENDAVANT',
        subtitle: 'La CPA com a Model de Transformació',
        number: '03',
        color: '#27ae60',
        intro: 'La CPA és el model superior que articula els COMS en una proposta única i coherent per al desplegament estratègic.',
        sections: [
            {
                id: 'propostes-coms',
                title: 'Propostes Estratègiques COMS',
                icon: '🚀',
                content: 'Prioritzem el desplegament actiu de l’estructura ADD, els itineraris plurianuals i l’avaluació d’impacte.',
                interactive: true,
                proposals: [
                    {
                        id: 'add-structure',
                        title: 'Estructura ADD (Abans, Durant, Després)',
                        icon: '🔧',
                        content: 'Consolidar el seguiment post-formatiu com el focus real de l’aprenentatge docent.'
                    },
                    {
                        id: 'itineraris-plurianuals',
                        title: 'Itineraris Plurianuals',
                        icon: '📅',
                        content: 'Cicles de 2 anys: Any 1 d’experimentació i Any 2 de consolidació i producció.'
                    },
                    {
                        id: 'avaluacio-impacte',
                        title: 'Avaluació Dinàmica (Guskey 3-5)',
                        icon: '📊',
                        content: 'Monitorar el suport organitzatiu, l’aplicació a l’aula i la millora en l’alumnat.'
                    }
                ]
            }
        ]
    }
];
