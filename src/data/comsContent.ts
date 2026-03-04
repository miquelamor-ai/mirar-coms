export type ViewId = 'preamble' | 'mirada-fora' | 'mirada-dins' | 'mirada-endavant';

export interface Item {
    id: string;
    title: string;
    content: string;
    keyPoints?: string[];
    interactive?: boolean;
    votingType?: 'validation' | 'decision';
}

export interface Block {
    id: string;
    title: string;
    summary: string;
    illustration?: string;
    keyPoints?: string[];   // used when items is empty
    items: Item[];
}

export interface Mirada {
    id: ViewId;
    title: string;
    subtitle: string;
    number: string;
    color: string;
    intro: string;
    illustration?: string;
    layout: 'reveal-only' | 'blocks-only';
    blocks: Block[];
}

export const comsData: Mirada[] = [

    // ── 00 · PROPÒSIT ────────────────────────────────────────────────────────
    {
        id: 'preamble',
        title: 'PROPÒSIT',
        subtitle: 'El motor del desenvolupament professional',
        number: '00',
        color: '#8e44ad',
        layout: 'reveal-only',
        intro: 'El desenvolupament professional dels educadors és l\'element intraescolar amb més capacitat d\'impactar en la millora dels aprenentatges. No és un complement: és el motor del canvi.',
        blocks: [
            {
                id: 'prop-a',
                title: 'De la formació al desenvolupament',
                summary: 'Superar el concepte passiu de "rebre cursos" per transitar cap a un model on l\'educador és el protagonista d\'un procés continu d\'indagació i millora.',
                keyPoints: [
                    'Del "m\'ensenyen" al "aprenc, experimento i construeixo"',
                    'L\'educador com a protagonista actiu, no receptor passiu',
                    'Integrat en la seva identitat docent i en el projecte de centre'
                ],
                items: []
            },
            {
                id: 'prop-b',
                title: 'L\'impacte com a nord',
                summary: 'La finalitat última de qualsevol canvi en els COMS és la transformació real a l\'aula: un alumne que aprengui més i un docent més segur i acompanyat.',
                keyPoints: [
                    'Millora de l\'aprenentatge i benestar de l\'alumnat',
                    'Docent més competent, segur i realment acompanyat per la seva comunitat',
                    'Tot canvi ha d\'apuntar aquí: és el criteri de validació'
                ],
                items: []
            },
            {
                id: 'prop-c',
                title: 'Del concert al fil musical',
                summary: 'De l\'acte puntual d\'alta intensitat a una presència constant, rítmica i sostinguda que acompanya la pràctica quotidiana i impregna la cultura institucional.',
                keyPoints: [
                    'El "concert": acte puntual, intens, que s\'apaga en sortir de la sala',
                    'El "fil musical": presència constant i rítmica integrada en el dia a dia',
                    'La continuïtat és la clau del canvi profund i durador'
                ],
                items: []
            }
        ]
    },

    // ── 01 · MIRAR FORA ──────────────────────────────────────────────────────
    {
        id: 'mirada-fora',
        title: 'MIRAR FORA',
        subtitle: 'Fonamentació científica i estratègica',
        number: '01',
        color: '#3498db',
        layout: 'reveal-only',
        intro: 'Quatre pilars de la recerca educativa internacional que justifiquen i orienten de manera rigorosa l\'evolució del model de formació docent.',
        blocks: [
            {
                id: 'fora-a',
                title: 'Avaluació d\'impacte',
                summary: 'L\'èxit de la formació no es mesura per la satisfacció immediata sinó per la transferència real a l\'aula i l\'impacte en l\'alumnat.',
                keyPoints: [
                    'Nivell 1 (satisfacció): mesura insuficient de l\'èxit formatiu',
                    'Nivell 3 (suport organitzatiu): factor de "tot o res" — sense protecció institucional, la formació no arriba',
                    'Nivell 4 (canvi en la pràctica) i Nivell 5 (impacte en l\'alumnat): el veritable objectiu',
                    'Planificació inversa: definir primer la millora en l\'alumne, després dissenyar l\'acció docent'
                ],
                items: []
            },
            {
                id: 'fora-b',
                title: 'Transferència a l\'aula',
                summary: 'La formació es un cicle viu en tres moments. El clima de suport al centre i la immediació de l\'aplicació en determinen l\'èxit.',
                keyPoints: [
                    'ABANS: creació d\'expectatives i compromís previ',
                    'DURANT: experiència activa i pràctica col·laborativa',
                    'DESPRÉS: seguiment i acompanyament (la fase més crítica)',
                    'L\'escola com a laboratori de pràctiques validades on el feedback és creixement'
                ],
                items: []
            },
            {
                id: 'fora-c',
                title: 'Capital professional',
                summary: 'L\'aprenentatge com a procés col·lectiu que enforteix la musculatura de la institució a través de tres capitals interdependents.',
                keyPoints: [
                    'Capital humà: el talent i la competència individual de cada educador',
                    'Capital social: la col·laboració i l\'aprenentatge entre iguals com a cola de la institució',
                    'Capital decisional: decisions pedagògiques complexes basades en evidències, no en intuïcions',
                    'Construïm una cultura de professionalisme col·laboratiu compartit'
                ],
                items: []
            },
            {
                id: 'fora-d',
                title: 'Marc dels 6 COMS',
                summary: 'Les sis decisions estructurals que configuren el nostre sistema d\'aprenentatge: Temps, Metodologia, Rols, Tipologia, Recursos i Impacte.',
                keyPoints: [
                    'No són qüestions logístiques: són actes pedagògics i d\'identitat institucional',
                    'Decidir com aprenem és decidir qui som com a comunitat educativa',
                    'Gestionem les condicions de possibilitat per a la transformació de la missió'
                ],
                items: []
            }
        ]
    },

    // ── 02 · MIRAR DINS ──────────────────────────────────────────────────────
    {
        id: 'mirada-dins',
        title: 'MIRAR DINS',
        subtitle: 'Diagnosi de la situació actual',
        number: '02',
        color: '#e67e22',
        layout: 'blocks-only',
        intro: 'Reconèixer amb honestedat els obstacles que impedeixen que la formació cali de veritat en la cultura del centre. Sense diagnosi honesta, no hi ha canvi real.',
        blocks: [
            {
                id: 'dins-a',
                title: 'Limitacions del model de formació aïllada',
                summary: 'Les accions formatives de 15h fragmentades no garanteixen un desenvolupament competencial progressiu ni la integració del coneixement en la pràctica.',
                items: [
                    {
                        id: 'dins-a1',
                        title: 'Insuficiència per al canvi profund',
                        content: 'Els "tallers únics" sense continuïtat no permeten que el coneixement s\'integri en la memòria a llarg termini ni que es transformi en pràctica d\'aula.',
                        keyPoints: [
                            'Formació fragmentada en "dosis" que arriba però no arrela',
                            'Absència de continuïtat i seguiment posterior',
                            'El canvi profund necessita cicles, no dosis puntuals'
                        ],
                        interactive: true, votingType: 'validation'
                    },
                    {
                        id: 'dins-a2',
                        title: 'Necessitat de transició metafòrica',
                        content: 'Cal passar d\'una formació entesa com un "concert" puntual a un "fil musical": presència constant i sostinguda que acompanya la pràctica quotidiana.',
                        keyPoints: [
                            'Del "concert": acte puntual i intens amb ponents externs',
                            'Al "fil musical": presència rítmica que impregna la cultura institucional',
                            'La continuïtat és la condició del canvi real i durador'
                        ],
                        interactive: true, votingType: 'validation'
                    }
                ]
            },
            {
                id: 'dins-b',
                title: 'El fenomen de la "trampa de les receptes"',
                summary: 'La tensió entre la demanda de solucions pràctiques immediates i la necessitat de comprensió pedagògica profunda que empoderi el docent.',
                items: [
                    {
                        id: 'dins-b1',
                        title: 'Origen en el bloqueig emocional',
                        content: 'La demanda de "receptes" d\'aplicació immediata sovint amaga una situació d\'angoixa i bloqueig davant la complexitat real de l\'aula.',
                        keyPoints: [
                            'L\'angoixa emocional docent genera demanda de receptes tècniques',
                            'Solucions sense comprensió del perquè ni del context propi',
                            'Cal abordar la dimensió emocional abans de la tècnica'
                        ],
                        interactive: true, votingType: 'validation'
                    },
                    {
                        id: 'dins-b2',
                        title: 'Procediment vs. vivència',
                        content: 'Si la formació només aborda l\'aspecte tècnic i descuida la vivència i les creences, el coneixement esdevé un "castell a l\'aire" sense fonaments.',
                        keyPoints: [
                            'Els docents arriben a la formació "amb el cap, sense el cos"',
                            'El canvi real transforma conviccions i emocions, no sols procediments',
                            'Cal incloure la dimensió experiencial i corporal en la formació'
                        ],
                        interactive: true, votingType: 'validation'
                    },
                    {
                        id: 'dins-b3',
                        title: 'El risc del modelatge superficial',
                        content: 'El docent pot limitar-se a copiar un model de bones pràctiques sense haver-lo integrat ni sentir-se empoderat per traduir-lo al seu propi context.',
                        keyPoints: [
                            'Els exemples il·luminen, però no s\'han de copiar literalment',
                            'Risc de reproduir pràctiques sense adaptació al context propi',
                            'Cal integrar i sentir-se empoderat per transferir de veritat'
                        ],
                        interactive: true, votingType: 'validation'
                    }
                ]
            },
            {
                id: 'dins-c',
                title: 'Desequilibri en la transferència: el dèficit del "després"',
                summary: 'Una distribució ineficient de l\'energia institucional: massa esforç en la logística del "durant" i abandó total del "després", que és la fase crítica.',
                items: [
                    {
                        id: 'dins-c1',
                        title: 'Hipertròfia de la gestió',
                        content: 'S\'inverteix una gran quantitat d\'energia en logística i gestió del "durant" (ponents, fitxes, tràmits), deixant el "després" pràcticament desatès.',
                        keyPoints: [
                            'Gestió de ponents, fitxes i tràmits de bonificació consumeix tota l\'energia',
                            'El "després" (transferència, impacte) és la fase abandonada',
                            'La gestió ofega el desenvolupament professional real'
                        ],
                        interactive: true, votingType: 'validation'
                    },
                    {
                        id: 'dins-c2',
                        title: 'Seguiment vs. avaluació burocràtica',
                        content: 'Les accions de seguiment post-formatiu es viuen com un tràmit o fiscalització, no com acompanyament real. Sense suport organitzatiu, la formació és "paper mullat".',
                        keyPoints: [
                            'Seguiment viscut com a tràmit per "calmar la consciència"',
                            'Avaluació fiscalitzadora en lloc d\'acompanyament real al docent',
                            'Sense mentoratge, coaching o codocència, la formació no aterra'
                        ],
                        interactive: true, votingType: 'validation'
                    }
                ]
            },
            {
                id: 'dins-d',
                title: 'Governança, fragmentació i suport institucional',
                summary: 'L\'èxit de la formació està condicionat per l\'entorn organitzatiu. Sense estructures clares de lideratge pedagògic, l\'aprenentatge no cala en la cultura del centre.',
                items: [
                    {
                        id: 'dins-d1',
                        title: 'Risc de governança feble',
                        content: 'Cal reforçar les estructures que possibiliten que l\'aprenentatge cali en la cultura del centre, evitant la fragmentació dels esforços en massa línies que no es consoliden.',
                        keyPoints: [
                            'Esforços dispersos en massa línies sense consolidació real',
                            'Manca d\'estructures formals de seguiment pedagògic',
                            'Necessitat de lideratge centrat en pedagogia, no en logística'
                        ],
                        interactive: true, votingType: 'validation'
                    },
                    {
                        id: 'dins-d2',
                        title: 'El "tot o res" del suport organitzatiu',
                        content: 'El suport organitzatiu (Nivell 3 de Guskey) és el factor crític: si la direcció no prioritza i protegeix el temps de qualitat per a la formació, l\'impacte és nul.',
                        keyPoints: [
                            'Factor binari: amb suport real, transforma; sense suport, no arriba',
                            'La direcció ha de prioritzar i protegir activament el temps de qualitat',
                            'Lideratge pedagògic actiu com a condició indispensable'
                        ],
                        interactive: true, votingType: 'validation'
                    },
                    {
                        id: 'dins-d3',
                        title: 'Individualisme vs. comunitat',
                        content: 'Sovint els docents actuen com a "francotiradors" que fan la mateixa activitat però no formen un equip ni una comunitat d\'aprenentatge dins de l\'escola.',
                        keyPoints: [
                            'Cada docent actua de manera aïllada i independent',
                            'Coneixement adquirit que no es transfereix entre iguals',
                            'Cal construir veritables comunitats d\'aprenentatge professional'
                        ],
                        interactive: true, votingType: 'validation'
                    }
                ]
            }
        ]
    },

    // ── 03 · MIRAR ENDAVANT ──────────────────────────────────────────────────
    {
        id: 'mirada-endavant',
        title: 'MIRAR ENDAVANT',
        subtitle: 'La CPA com a model de transformació holístic',
        number: '03',
        color: '#27ae60',
        layout: 'blocks-only',
        intro: 'Sis eixos d\'actuació que articulen tots els COMS en una proposta única i coherent per transformar la cultura d\'aprenentatge de tota la institució.',
        blocks: [
            {
                id: 'end-a',
                title: 'A. Temps i ritmes',
                summary: 'Ús estratègic i intencional de les 30h de conveni i autonomia de cada centre per transformar reunions logístiques en moments reals de creixement professional.',
                items: [
                    {
                        id: 'end-a1',
                        title: 'Superar la insuficiència de les 15h actuals',
                        content: 'Transitar cap a un ús estratègic de les 30h de conveni, permetent processos de reflexió més pausats i profunds que garanteixin la integració del coneixement.',
                        keyPoints: [
                            'De les 15h actuals a les 30h de conveni: canvi qualitatiu, no sols quantitatiu',
                            'Permet cicles complets ABANS–DURANT–DESPRÉS amb profunditat real',
                            'Processos pausats per integrar el coneixement i transformar la pràctica'
                        ],
                        interactive: true, votingType: 'decision'
                    },
                    {
                        id: 'end-a2',
                        title: 'Autonomia de centre',
                        content: 'Cada escola té la sobirania per identificar i "rescatar" hores de tasques purament administratives per transformar-les en moments reals de desenvolupament professional.',
                        keyPoints: [
                            'Sobirania per convertir reunions logístiques en espais de creixement',
                            'El centre decideix on posa el temps i l\'energia col·lectiva',
                            'Autonomia pedagògica com a primera palanca de canvi institucional'
                        ],
                        interactive: true, votingType: 'decision'
                    }
                ]
            },
            {
                id: 'end-b',
                title: 'B. Estructura i metodologia (model ADD)',
                summary: 'L\'espai formatiu articulat en tres fases interconnectades que garanteixen la continuïtat i l\'impacte real del procés d\'aprenentatge.',
                items: [
                    {
                        id: 'end-b1',
                        title: 'Abans — preparació i compromís',
                        content: 'No s\'arriba a la formació en blanc. Processos de diagnosi, preparació de la mirada i generació de compromís previ amb preguntes i reptes identificats a la pròpia aula.',
                        keyPoints: [
                            'Diagnosi del context: preguntes i reptes identificats prèviament',
                            'Definir una teoria del canvi i objectius d\'equip i personals',
                            'Arribar a la formació amb mirada preparada i compromís explícit'
                        ],
                        interactive: true, votingType: 'decision'
                    },
                    {
                        id: 'end-b2',
                        title: 'Durant — experiència activa',
                        content: 'L\'espai formatiu supera el model de xerrades unidireccionals: prioritza el taller, la simulació i el disseny col·laboratiu de solucions aplicables.',
                        keyPoints: [
                            'Tallers participatius i simulacions pràctiques',
                            'Disseny col·laboratiu d\'estratègies aplicables a l\'aula',
                            'Aprenentatge actiu, no recepció passiva de continguts'
                        ],
                        interactive: true, votingType: 'decision'
                    },
                    {
                        id: 'end-b3',
                        title: 'Després — el focus real',
                        content: 'La fase més crítica. Protocols de seguiment, espais de reflexió compartida sobre la pràctica, observació a l\'aula i recull sistemàtic d\'evidències d\'aplicació.',
                        keyPoints: [
                            'Protocols de seguiment sistemàtic de la transferència',
                            'Espais de reflexió compartida sobre la pràctica real',
                            'Observació entre iguals o amb mentors i recull d\'evidències'
                        ],
                        interactive: true, votingType: 'decision'
                    }
                ]
            },
            {
                id: 'end-c',
                title: 'C. Formadors, rols i acompanyament',
                summary: 'Reforçar el lideratge pedagògic de direccions i coordinacions i activar el talent intern de la pròpia xarxa com a font d\'aprenentatge contextualitzat.',
                items: [
                    {
                        id: 'end-c1',
                        title: 'Lideratge per a la transferència',
                        content: 'El paper de les direccions evoluciona de la gestió logística cap al lideratge pedagògic que protegeix espais, acompanya emocionalment i garanteix que els aprenentatges aterrin a l\'aula.',
                        keyPoints: [
                            'Protegir espais i temps de qualitat per al desenvolupament professional',
                            'Acompanyament emocional del claustre en el procés de canvi',
                            'Fer visible i celebrar el creixement professional del centre'
                        ],
                        interactive: true, votingType: 'decision'
                    },
                    {
                        id: 'end-c2',
                        title: 'Banc de talents intern',
                        content: 'L\'expertesa no és sols externa. Impulsem i visibilitzem el talent de la pròpia xarxa mitjançant facilitadors i mentors per a un aprenentatge orgànic i contextualitzat.',
                        keyPoints: [
                            'Identificar i visibilitzar el talent docent intern de la xarxa',
                            'Aprenentatge orgànic basat en la confiança i el context compartit',
                            'Mentoria entre iguals amb coneixement real del context'
                        ],
                        interactive: true, votingType: 'decision'
                    }
                ]
            },
            {
                id: 'end-d',
                title: 'D. Tipologies d\'aprenentatge',
                summary: 'Substituir les accions aïllades per cicles de 2 anys i una escala de progressió competencial que respecta el ritme i punt de partida de cada docent.',
                items: [
                    {
                        id: 'end-d1',
                        title: 'Itineraris plurianuals',
                        content: 'Cicles de 2 anys que eviten la superficialitat. Any 1: input, experimentació i prova. Any 2: producció de materials, reflexió sobre l\'impacte i consolidació.',
                        keyPoints: [
                            'Any 1: input, experimentació i prova a l\'aula',
                            'Any 2: producció de materials i consolidació de pràctiques validades',
                            'Cicles que superen la superficialitat de la formació puntual'
                        ],
                        interactive: true, votingType: 'decision'
                    },
                    {
                        id: 'end-d2',
                        title: 'Nivells de profunditat',
                        content: 'Escala de progressió competencial que permet a cada docent traçar el seu propi camí de creixement segons el seu punt de partida i les seves necessitats professionals.',
                        keyPoints: [
                            'Bàsic / sensibilització: primer contacte i exploració del tema',
                            'Avançat / implementació: aplicació sistemàtica a l\'aula',
                            'Expert / mentoria: lideratge i transferència a iguals'
                        ],
                        interactive: true, votingType: 'decision'
                    }
                ]
            },
            {
                id: 'end-e',
                title: 'E. Recursos i sostenibilitat',
                summary: 'Eliminar la burocràcia amb plataforma dedicada i portafoli professional, i analitzar constantment si els recursos invertits generen canvis reals en la cultura d\'aprenentatge.',
                items: [
                    {
                        id: 'end-e1',
                        title: 'Plataforma dedicada i portafoli professional',
                        content: 'Eines digitals que eliminen la gestió burocràtica i alliberen energia per al portafoli professional del docent com a diari de creixement i memòria viva.',
                        keyPoints: [
                            'Signatures i certificats digitals automàtics: zero burocràcia',
                            'Portafoli professional: registre d\'experimentacions i reflexions',
                            'Memòria viva del creixement professional individual i col·lectiu'
                        ],
                        interactive: true, votingType: 'decision'
                    },
                    {
                        id: 'end-e2',
                        title: 'Auditoria d\'impacte',
                        content: 'Anàlisi constant de si els recursos invertits (temps i econòmics) estan generant els canvis desitjats en la cultura d\'aprenentatge del centre.',
                        keyPoints: [
                            'Revisió periòdica del retorn de la inversió formativa',
                            'Formació per impacte mesurable, no per acumulació de certificats',
                            'Dades com a base de les decisions pedagògiques institucionals'
                        ],
                        interactive: true, votingType: 'decision'
                    }
                ]
            },
            {
                id: 'end-f',
                title: 'F. Avaluació i impacte',
                summary: 'Superar les enquestes de satisfacció per mesurar el canvi real a l\'aula, el creixement professional del docent i l\'impacte mesurable en l\'alumnat.',
                items: [
                    {
                        id: 'end-f1',
                        title: 'Més enllà de la satisfacció',
                        content: 'Superar el model d\'enquestes superficials per monitorar el suport organitzatiu real (N3), l\'aplicació efectiva a l\'aula (N4) i l\'impacte en l\'alumnat (N5).',
                        keyPoints: [
                            'Nivell 3: l\'escola ha donat el temps i suport necessari?',
                            'Nivell 4: com ha canviat realment la pràctica docent?',
                            'Nivell 5: millora en aprenentatge i benestar de l\'alumnat'
                        ],
                        interactive: true, votingType: 'decision'
                    },
                    {
                        id: 'end-f2',
                        title: 'Avaluació dinàmica i autoreflexió',
                        content: 'El docent disposa d\'instruments per monitoritzar el seu propi creixement competencial de manera continuada, fent-lo conscient de la seva evolució professional.',
                        keyPoints: [
                            'Instruments d\'autoreflexió i rúbriques de creixement competencial',
                            'Monitoratge personal i continu del progrés professional',
                            'La reflexió com a pràctica habitual i sistemàtica'
                        ],
                        interactive: true, votingType: 'decision'
                    },
                    {
                        id: 'end-f3',
                        title: 'Recull d\'evidències d\'aula',
                        content: 'Documentar el canvi amb mostres de treball de l\'alumnat, diaris d\'aula i observacions, fent que la millora sigui visible i comunicable a tota la comunitat educativa.',
                        keyPoints: [
                            'Mostres de treball de l\'alumnat com a evidència del canvi real',
                            'Diaris d\'aula i registres d\'observació entre iguals',
                            'La millora visible, comunicable i transferible a tota la comunitat'
                        ],
                        interactive: true, votingType: 'decision'
                    }
                ]
            }
        ]
    }
];
