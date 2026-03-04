import { useState, useEffect, useRef } from "react";

const data = [
  {
    id: "proposit",
    number: "00",
    title: "Propòsit i Necessitat del Canvi",
    subtitle: "El Motor del Desenvolupament Professional",
    color: "#d4a853",
    icon: "⚡",
    intro: "La reflexió sobre el Pla d'Aprenentatge respon a una premissa fonamental: el desenvolupament professional dels educadors és l'element intraescolar amb més capacitat d'impactar en la millora dels aprenentatges de l'alumnat.",
    items: [
      {
        title: "De la Formació al Desenvolupament",
        icon: "🔄",
        content: "Volem superar el concepte passiu de \"rebre cursos\" —sovint viscuts com una càrrega externa— per transitar cap a un model de \"desenvolupar-se professionalment\". L'educador és el protagonista d'un procés continu d'indagació i millora, integrat en la seva identitat docent i en el projecte de centre."
      },
      {
        title: "L'Impacte com a Nord",
        icon: "🎯",
        content: "Qualsevol modificació en els COMS té com a última finalitat una transformació real a l'aula. L'aprenentatge del docent ha de redundar en un alumne que aprengui més i millor, però també en un docent que se senti més competent, segur de la seva pràctica i realment acompanyat per la seva comunitat."
      },
      {
        title: "Del Concert al Fil Musical",
        icon: "🎵",
        content: "Necessitem abandonar la idea de l'aprenentatge com un \"concert\" puntual de gran intensitat que s'apaga en sortir de la sala. L'objectiu és crear un \"fil musical\": una presència constant, rítmica i sostinguda que acompanya la pràctica quotidiana de l'escola i impregna la cultura institucional."
      }
    ]
  },
  {
    id: "fora",
    number: "01",
    title: "Mirar Fora",
    subtitle: "Fonamentació Científica i Estratègica",
    color: "#6aacb8",
    icon: "🔭",
    intro: "Ens recolzem en quatre pilars que configuren el marc de referència i justifiquen de manera rigorosa l'evolució del model.",
    items: [
      {
        title: "L'Avaluació de l'Impacte — Guskey",
        icon: "📊",
        content: "L'èxit de la formació no es pot mesurar per la satisfacció immediata (Nivell 1). Cal avaluar la transferència real a l'aula (Nivell 4) i l'impacte en l'alumnat (Nivell 5). El suport organitzatiu (Nivell 3) és el factor de \"tot o res\": si la institució no protegeix el temps ni acompanya el docent, la formació mor abans d'arribar a l'aula. Perspectiva de planificació inversa: definir primer la millora desitjada en l'alumne."
      },
      {
        title: "La Transferència a l'Aula — Grossman & Salas",
        icon: "🔁",
        content: "La formació s'articula en tres moments crítics: Abans (expectatives i compromís), Durant (experiència activa) i Després (seguiment). El clima de suport al centre i l'oportunitat d'aplicar els aprenentatges immediatament són els predictors més potents. Cal reduir la distància entre el lloc on s'aprèn i el lloc on s'ensenya."
      },
      {
        title: "Capital Professional — Fullan & Hargreaves",
        icon: "🧠",
        content: "Tres tipus de capital: Capital Humà (talent i competència individual), Capital Social (densitat i qualitat de la col·laboració; l'aprenentatge entre iguals), i Capital Decisional (capacitat experta per prendre decisions pedagògiques basades en evidències). Construïm una cultura de professionalisme col·laboratiu."
      },
      {
        title: "El Marc dels 6 COMS — Arquitectura FJE",
        icon: "🏗️",
        content: "Sis decisions estructurals: Temps, Metodologia, Rols, Tipologia, Recursos i Impacte. No són qüestions logístiques; són actes pedagògics i d'identitat. Decidir com aprenem és decidir qui som i quin valor donem a la cura de les persones i a l'excel·lència educativa."
      }
    ]
  },
  {
    id: "endins",
    number: "02",
    title: "Mirar Endins",
    subtitle: "Diagnosi de la Situació Actual",
    color: "#c47a5a",
    icon: "🔍",
    intro: "A partir de la diagnosi realitzada en la sessió de reflexió i les evidències recollides, es presenta la mirada interna sobre l'estat actual de la formació.",
    items: [
      {
        title: "Limitacions del model aïllat i esporàdic",
        icon: "⚠️",
        content: "El model actual de 15 hores es percep com \"dosis\" fragmentades que no garanteixen desenvolupament progressiu. Aquests tallers sense continuïtat no permeten que el coneixement s'integri ni es transformi en pràctica d'aula. Cal passar del \"concert\" puntual al \"fil musical\" sostingut."
      },
      {
        title: "La \"trampa de les receptes\" i l'angoixa docent",
        icon: "📋",
        content: "La demanda de receptes pràctiques sovint amaga angoixa i bloqueig davant la complexitat. Els docents busquen procediments tècnics perquè no es desplacen a la formació amb el cos, sinó només amb un cap carregat. Si la formació descuida la vivència i les creences, el coneixement esdevé un \"castell a l'aire\"."
      },
      {
        title: "Desequilibri: el dèficit del \"després\"",
        icon: "⏳",
        content: "S'inverteix massa energia en logística i en el \"durant\", deixant el \"després\" desatès. Les escasses accions de seguiment post-formatiu es viuen com un tràmit o com una fiscalització, en lloc d'un acompanyament real. Sense suport organitzatiu, la formació esdevé \"paper mullat\"."
      },
      {
        title: "Governança, fragmentació i suport institucional",
        icon: "🏛️",
        content: "Cal reforçar les estructures que possibiliten que l'aprenentatge cali en la cultura del centre. El suport organitzatiu (Nivell 3 Guskey) és crític: si la direcció no prioritza i protegeix el temps, l'impacte és nul. Sovint els docents actuen com a \"francotiradors\" sense formar comunitat d'aprenentatge."
      }
    ]
  },
  {
    id: "endavant",
    number: "03",
    title: "Mirar Endavant",
    subtitle: "La CPA com a Model de Transformació",
    color: "#7ab87a",
    icon: "🚀",
    intro: "La Comunitat Professional d'Aprenentatge (CPA) és el model superior i l'arquitectura que articula tots els COMS en una proposta única i coherent.",
    items: [
      {
        title: "A. Temps i Ritmes",
        icon: "⏱️",
        content: "Superar les 15h actuals: ús estratègic i intencional de les 30h de conveni. L'increment no és quantitatiu, sinó qualitatiu. Cada escola té sobirania per rescatar hores administratives i transformar-les en moments reals de desenvolupament professional."
      },
      {
        title: "B. Estructura i Metodologia (Model ADD)",
        icon: "🔧",
        content: "ABANS: diagnosi, preparació de la mirada i compromís previ. Es defineix teoria del canvi i objectius d'equip. DURANT: experiència activa, superant xerrades unidireccionals (taller, simulació, disseny col·laboratiu). DESPRÉS (el focus real): protocols de seguiment, observació a l'aula, recull sistemàtic d'evidències."
      },
      {
        title: "C. Formadors, Rols i Acompanyament",
        icon: "👥",
        content: "Lideratge per a la transferència: direccions i coordinacions evolucionen cap a líders pedagògics que protegeixen espais i acompanyen emocionalment. Banc de Talents: facilitadors i mentors interns. L'expertesa ja no és només externa; s'aprofita el saber fer de les pròpies escoles."
      },
      {
        title: "D. Tipologies d'Aprenentatge",
        icon: "📈",
        content: "Itineraris plurianuals: cicles de 2 anys. Any 1: input, experimentació i prova. Any 2: producció de materials, reflexió sobre impacte i consolidació. Escala de progressió: Bàsic/Sensibilització → Avançat/Implementació → Expert/Mentoria."
      },
      {
        title: "E. Recursos i Sostenibilitat",
        icon: "♻️",
        content: "Plataforma dedicada per reduir burocràcia (signatures digitals, certificats automatitzats). Portafoli professional del docent com a diari de creixement. Auditoria d'impacte constant: els recursos invertits generen els canvis desitjats?"
      },
      {
        title: "F. Avaluació i Impacte",
        icon: "📐",
        content: "Més enllà de la satisfacció: monitorar suport organitzatiu real (Nivell 3), aplicació efectiva a l'aula (Nivell 4), i millora en aprenentatges i benestar de l'alumnat (Nivell 5). Avaluació dinàmica i autoreflexi: el docent monitoritza el seu propi creixement. Recull d'evidències d'aula per fer visible el canvi."
      }
    ]
  }
];

function AccordionItem({ item, isOpen, onToggle, accentColor }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        marginBottom: "8px",
        borderRadius: "10px",
        border: `1px solid ${isOpen ? accentColor + "66" : "#2a2a2a"}`,
        background: isOpen ? accentColor + "08" : "#111111",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          color: "#e8e8e8",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{item.icon}</span>
        <span
          style={{
            flex: 1,
            fontSize: "0.95rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            color: isOpen ? accentColor : "#e8e8e8",
            transition: "color 0.3s ease",
          }}
        >
          {item.title}
        </span>
        <span
          style={{
            fontSize: "1.2rem",
            color: accentColor,
            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            flexShrink: 0,
            opacity: 0.7,
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          height: `${height}px`,
          transition: "height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
      >
        <div
          ref={contentRef}
          style={{
            padding: "0 20px 18px 52px",
            color: "#b0b0b0",
            fontSize: "0.9rem",
            lineHeight: 1.75,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {item.content}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ section, index, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: "1 1 0",
        minWidth: "140px",
        padding: "16px 12px",
        background: isActive ? section.color + "15" : "transparent",
        border: `1px solid ${isActive ? section.color + "55" : "#1a1a1a"}`,
        borderRadius: "12px",
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "40px",
            height: "3px",
            background: section.color,
            borderRadius: "3px 3px 0 0",
          }}
        />
      )}
      <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{section.icon}</div>
      <div
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: isActive ? section.color : "#666",
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: "4px",
        }}
      >
        {section.number}
      </div>
      <div
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: isActive ? "#e8e8e8" : "#888",
          fontFamily: "'Cormorant Garamond', serif",
          lineHeight: 1.3,
        }}
      >
        {section.title}
      </div>
    </button>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [openItems, setOpenItems] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const toggleItem = (sectionId, itemIndex) => {
    const key = `${sectionId}-${itemIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    const section = data[activeSection];
    const newState = {};
    const allOpen = section.items.every(
      (_, i) => openItems[`${section.id}-${i}`]
    );
    section.items.forEach((_, i) => {
      newState[`${section.id}-${i}`] = !allOpen;
    });
    setOpenItems((prev) => ({ ...prev, ...newState }));
  };

  const current = data[activeSection];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#e8e8e8",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
      }}
    >
      {/* Subtle background glow */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${current.color}08 0%, transparent 60%)`,
          transition: "background 0.6s ease",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #1a1a1a",
          padding: "20px 24px 16px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              marginBottom: "4px",
            }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#d4a853",
                background: "rgba(212,168,83,0.1)",
                border: "1px solid rgba(212,168,83,0.25)",
                padding: "3px 10px",
                borderRadius: "50px",
              }}
            >
              FJE 2026–2029
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)",
              fontWeight: 700,
              color: "#e8e8e8",
              margin: "8px 0 16px",
              lineHeight: 1.2,
            }}
          >
            Resignificant el Pla d'Aprenentatge
          </h1>

          {/* Navigation tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {data.map((section, i) => (
              <SectionCard
                key={section.id}
                section={section}
                index={i}
                isActive={activeSection === i}
                onClick={() => {
                  setActiveSection(i);
                }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "32px 24px 80px",
          position: "relative",
          zIndex: 1,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.5s ease",
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "3rem",
                fontWeight: 700,
                color: current.color + "30",
                lineHeight: 1,
              }}
            >
              {current.number}
            </span>
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                  fontWeight: 700,
                  color: current.color,
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                {current.title}
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#888",
                  margin: "2px 0 0",
                  fontStyle: "italic",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.05rem",
                }}
              >
                {current.subtitle}
              </p>
            </div>
          </div>

          <p
            style={{
              color: "#a0a0a0",
              fontSize: "0.92rem",
              lineHeight: 1.7,
              maxWidth: "700px",
              margin: "16px 0 0",
              paddingLeft: "2px",
            }}
          >
            {current.intro}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: `linear-gradient(90deg, ${current.color}33, transparent)`,
            marginBottom: "24px",
          }}
        />

        {/* Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#555",
            }}
          >
            {current.items.length} conceptes
          </span>
          <button
            onClick={expandAll}
            style={{
              background: "none",
              border: `1px solid #2a2a2a`,
              borderRadius: "6px",
              padding: "5px 12px",
              color: "#777",
              fontSize: "0.72rem",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.05em",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = current.color + "55";
              e.target.style.color = current.color;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#2a2a2a";
              e.target.style.color = "#777";
            }}
          >
            {current.items.every((_, i) => openItems[`${current.id}-${i}`])
              ? "Replegar tot"
              : "Desplegar tot"}
          </button>
        </div>

        {/* Accordion items */}
        <div>
          {current.items.map((item, i) => (
            <AccordionItem
              key={`${current.id}-${i}`}
              item={item}
              isOpen={!!openItems[`${current.id}-${i}`]}
              onToggle={() => toggleItem(current.id, i)}
              accentColor={current.color}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "40px",
            paddingTop: "24px",
            borderTop: "1px solid #1a1a1a",
          }}
        >
          <button
            onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
            disabled={activeSection === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              color: activeSection === 0 ? "#333" : "#888",
              cursor: activeSection === 0 ? "default" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              padding: "8px 0",
              transition: "color 0.2s ease",
            }}
          >
            ← {activeSection > 0 ? data[activeSection - 1].title : ""}
          </button>
          <button
            onClick={() =>
              setActiveSection(Math.min(data.length - 1, activeSection + 1))
            }
            disabled={activeSection === data.length - 1}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              color: activeSection === data.length - 1 ? "#333" : "#888",
              cursor:
                activeSection === data.length - 1 ? "default" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              padding: "8px 0",
              transition: "color 0.2s ease",
            }}
          >
            {activeSection < data.length - 1
              ? data[activeSection + 1].title
              : ""}{" "}
            →
          </button>
        </div>
      </main>

      {/* Progress bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "#111",
          zIndex: 50,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((activeSection + 1) / data.length) * 100}%`,
            background: `linear-gradient(90deg, ${current.color}, ${current.color}88)`,
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "0 2px 2px 0",
          }}
        />
      </div>
    </div>
  );
}
