***

````markdown
# Design System — Dark Premium
> Especificacions visuals i estructurals per construir webs amb estètica dark elegant i accent daurat.
> Document genèric: serveix per qualsevol projecte. Passa'l tal qual a un IDE (Cursor, Bolt, v0) o a un dissenyador.
> Substitueix els `[PLACEHOLDERS]` amb el contingut del teu projecte.

---

## ÍNDEX
1. [Identitat visual](#1-identitat-visual)
2. [Components UI](#2-components-ui)
3. [Estructura de pàgines](#3-estructura-de-pàgines)
4. [CSS base complet](#4-css-base-complet)
5. [Instruccions per a l'IDE o dissenyador](#5-instruccions-per-a-lide-o-dissenyador)

---

## 1. IDENTITAT VISUAL

### 1.1 Paleta de colors

| Token                    | HEX         | Ús                                   |
|--------------------------|-------------|--------------------------------------|
| `--color-bg`             | `#0a0a0a`   | Fons global                          |
| `--color-surface`        | `#111111`   | Cards i seccions                     |
| `--color-surface-alt`    | `#1a1a1a`   | Hover / superfície alternada         |
| `--color-border`         | `#2a2a2a`   | Vores i separadors                   |
| `--color-accent`         | `#d4a853`   | Accent principal (daurat)            |
| `--color-accent-dark`    | `#b8974a`   | Accent en hover                      |
| `--color-text`           | `#e8e8e8`   | Text principal                       |
| `--color-text-secondary` | `#a0a0a0`   | Text secundari                       |
| `--color-text-muted`     | `#666666`   | Text desactivat / metadades          |

> **Per adaptar:** canvia `#d4a853` per qualsevol accent clar sobre fons fosc.
> Ex: blau `#4a90d4`, verd `#4aad7a`, lila `#9b7fd4`. La resta escala sola.

---

### 1.2 Tipografia

| Rol               | Font              | Mida                         | Pes         |
|-------------------|-------------------|------------------------------|-------------|
| Títol principal   | Playfair Display  | `clamp(2.5rem, 6vw, 5rem)`   | 700         |
| Subtítol hero     | Playfair Display  | `clamp(1.2rem, 3vw, 2rem)`   | 400 italic  |
| Títols de secció  | Playfair Display  | `clamp(1.8rem, 4vw, 2.8rem)` | 700         |
| Títols de card    | Playfair Display  | `1.3rem`                     | 600         |
| Text corrent      | Inter             | `1rem`                       | 400         |
| Text petit/meta   | Inter             | `0.875rem`                   | 400         |
| Navegació         | Inter             | `0.9rem`                     | 500         |
| Botons            | Inter             | `0.95rem`                    | 600         |

```css
/* Afegir a l'<head> o al CSS global */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
````

> **Per adaptar:** Playfair Display → Lora, Cormorant Garamond o DM Serif Display.
> Inter → Outfit, DM Sans o Manrope.

---

### 1.3 Espaiat i mides

| Propietat          | Valor               |
|--------------------|---------------------|
| Max-width layout   | `1200px`            |
| Padding lateral    | `1.5rem`            |
| Padding de secció  | `6rem 0` (desktop) / `4rem 0` (mòbil) |
| Gap entre cards    | `2rem`              |
| Border-radius card | `12px`              |
| Border-radius botó | `8px`               |

---

### 1.4 Efectes i animacions

```css
/* Transició global per a tots els elements interactius */
transition: all 0.3s ease;

/* Elevació en hover de cards */
transform: translateY(-4px);
box-shadow: 0 20px 40px rgba(0,0,0,0.4);
border-color: var(--color-accent);

/* Gradient de fons per al hero */
background: radial-gradient(ellipse at center,
  rgba(212,168,83,0.05) 0%,
  transparent 70%);

/* Animació shimmer per a elements accent opcionals */
@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
```

---

## 2. COMPONENTS UI

### 2.1 Navbar

```
[Logo / Nom — esquerra]       [Enllaços de nav]       [Botó CTA]
```

```css
position: sticky;
top: 0;
z-index: 50;
background: rgba(10,10,10,0.95);
backdrop-filter: blur(20px);
border-bottom: 1px solid #1a1a1a;
padding: 1rem 0;
```

- Logo: Playfair Display 700, color `#d4a853`
- Links: color `#a0a0a0` → hover `#d4a853`
- CTA: botó primari (veure § 2.3)

---

### 2.2 Hero Section

```
        [BADGE — etiqueta opcional]

    [TÍTOL PRINCIPAL — gran, centrat, serif]

      [Subtítol o claim — italic, centrat]

  [Descripció breu — màx 2 línies, centrada]

       [Botó primari]   [Botó secundari]
```

```css
/* Contenidor */
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
text-align: center;

/* Fons */
background: radial-gradient(ellipse at center,
  rgba(212,168,83,0.05) 0%, transparent 70%);
```

```css
/* Badge */
display: inline-block;
background: rgba(212,168,83,0.1);
border: 1px solid rgba(212,168,83,0.3);
color: #d4a853;
border-radius: 50px;
font-size: 0.85rem;
padding: 0.4rem 1.2rem;
letter-spacing: 0.05em;
text-transform: uppercase;
margin-bottom: 2rem;
```

**Contingut a omplir:**
```
[BADGE]       → categoria, àmbit o etiqueta del projecte
[TÍTOL]       → nom del projecte o proposta central
[SUBTÍTOL]    → claim, lema o resum en una frase
[DESCRIPCIÓ]  → 1-2 frases que expliquen el propòsit
[CTA 1]       → acció principal (ex: "Explora", "Comença", "Descobreix")
[CTA 2]       → acció secundària (ex: "Llegeix més", "Contacta", "Veure demo")
```

---

### 2.3 Botons

**Primari:**
```css
background: linear-gradient(135deg, #d4a853, #b8974a);
color: #ffffff;
padding: 0.875rem 2rem;
border-radius: 8px;
font-weight: 600;
border: none;
cursor: pointer;
/* hover */
transform: translateY(-2px);
box-shadow: 0 8px 25px rgba(212,168,83,0.3);
```

**Secundari:**
```css
background: transparent;
color: #d4a853;
border: 1px solid rgba(212,168,83,0.4);
padding: 0.875rem 2rem;
border-radius: 8px;
font-weight: 600;
cursor: pointer;
/* hover */
background: rgba(212,168,83,0.08);
border-color: #d4a853;
```

---

### 2.4 Card estàndard

```
┌──────────────────────────────┐
│  [Icona, emoji o SVG]        │
│                              │
│  [Títol]                     │
│  ──────────────────          │
│  [Text descriptiu 2-3 línies]│
│                              │
│  [Etiqueta o link →]         │
└──────────────────────────────┘
```

```css
background: #111111;
border: 1px solid #2a2a2a;
border-radius: 12px;
padding: 2rem;
transition: all 0.3s ease;
/* hover */
border-color: rgba(212,168,83,0.4);
transform: translateY(-4px);
box-shadow: 0 20px 40px rgba(0,0,0,0.4);
```

---

### 2.5 Card numerada

```
┌──────────────────────────────┐
│  01                          │  ← serif, 3rem, color accent
│                              │
│  [Títol]                     │
│  [Text]                      │
└──────────────────────────────┘
```

```css
/* Número */
font-family: 'Playfair Display', serif;
font-size: 3rem;
font-weight: 700;
color: rgba(212,168,83,0.3);
/* hover */
color: #d4a853;
```

---

### 2.6 Accordion

```
▼  [Títol — visible sempre]
   [Contingut expandit]

▶  [Títol — tancat]
```

```css
/* Contenidor */
border: 1px solid #2a2a2a;
border-radius: 12px;
overflow: hidden;
margin-bottom: 1rem;

/* Capçalera */
background: #111111;
padding: 1.5rem 2rem;
cursor: pointer;
/* hover */
background: #1a1a1a;

/* Contingut */
background: rgba(212,168,83,0.02);
border-top: 1px solid #2a2a2a;
padding: 1.5rem 2rem;
color: #a0a0a0;
line-height: 1.8;
```

---

### 2.7 Secció dividida (50/50)

```
[Bloc text]                  [Bloc visual]
─ Títol                      ─ Cards / stats
─ Descripció                 ─ Imatge / diagrama
─ Punts clau                 ─ Element decoratiu
─ CTA
```

```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 4rem;
align-items: center;

@media (max-width: 768px) {
  grid-template-columns: 1fr;
  gap: 2rem;
}
```

---

### 2.8 Bloc de dades / estadístiques

```
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│  42+ │  │  8   │  │ 95%  │  │  3k  │
│label │  │label │  │label │  │label │
└──────┘  └──────┘  └──────┘  └──────┘
```

```css
/* Valor */
font-family: 'Playfair Display', serif;
font-size: 2.5rem;
font-weight: 700;
color: #d4a853;

/* Etiqueta */
font-size: 0.85rem;
color: #666666;
text-transform: uppercase;
letter-spacing: 0.1em;
```

---

### 2.9 Bloc CTA final

```
        [Títol de tancament]
        [Frase motivadora breu]
        [Botó primari]  [Botó secundari]
```

```css
background: linear-gradient(135deg,
  rgba(212,168,83,0.05) 0%,
  transparent 100%);
border: 1px solid rgba(212,168,83,0.1);
border-radius: 16px;
padding: 4rem 2rem;
text-align: center;
```

---

### 2.10 Footer

```
[Logo + descripció curta]   [Columna links]   [Columna links]

────────────────────────────────────────────────────────────
[© Any — Nom]                              [Legal · Privacitat]
```

```css
background: #050505;
border-top: 1px solid #1a1a1a;
padding: 4rem 0 2rem;
color: #666666;
font-size: 0.875rem;
```

---

## 3. ESTRUCTURA DE PÀGINES

Aquesta secció descriu **patrons de composició**, no continguts concrets.
Tria el patró que s'adapta al teu projecte i omple els blocs amb el teu material.

---

### PATRÓ A — Pàgina principal (landing page)

Cada bloc és **independent, opcional i reordenable**.

| # | Bloc | Propòsit | Component recomanat |
|---|------|----------|---------------------|
| 1 | **Navbar** | Identificació i navegació | Navbar sticky |
| 2 | **Hero** | Primera impressió, context i crida a l'acció | Hero full-screen |
| 3 | **Bloc introductori** | Explicar el "per què" del projecte | Text centrat o 50/50 |
| 4 | **Bloc de llista jerarquitzada** | Mostrar ítems amb ordre i pes visual | Grid cards numerades |
| 5 | **Bloc de catàleg** | Mostrar elements equivalents sense jerarquia | Grid cards amb icona |
| 6 | **Bloc expandible** | Contingut dens accessible a demanda | Accordion |
| 7 | **Bloc de dades** | Reforçar credibilitat amb xifres | Estadístiques |
| 8 | **Bloc visual** | Aprofundir un element clau amb format ric | Secció 50/50 |
| 9 | **CTA final** | Tancar amb una acció clara | Bloc CTA centrat |
| 10 | **Footer** | Navegació secundària i informació legal | Footer |

**Regles de composició:**
- No posar mai 2 blocs del mateix tipus