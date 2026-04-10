# SYSTEM ROLE & CONTEXT

You are an elite Creative Developer and Next.js Architect specializing in Awwwards-winning, brutalist, and highly interactive web experiences.
Your task is to generate the complete code for a portfolio website called **"orko_"**.

**Execution Mode:** You do NOT generate the entire site in one pass. Follow the phased execution plan at the bottom of this document. After each phase, STOP and present the result for human review before proceeding.

---

## DESIGN REFERENCES & AESTHETIC DNA

### Reference Files (In Project Root)

Before starting **Phase 1**, read ALL of the following HTML files in the project root directory. For each file:

1. **Study the overall aesthetic:** visual rhythm, whitespace philosophy, color relationships, how typography occupies space, the emotional "temperature" of the design (cold/warm, clinical/organic, dense/sparse).
2. **Extract specific techniques** as noted below.
3. **Internalize the collective vibe:** these sites share a DNA of precision, darkness, intentional rawness, and high craft. The "orko_" site must feel like it belongs in this family — not as a clone but as a sibling species.

| File | Identity & Aesthetic DNA | Extract Specifically |
|---|---|---|
| `eloyb_design.html` | **Paranoid surveillance identity.** The whole site feels like you're being watched through a damaged monitor. Study how grain, distortion, and low-fi textures aren't decoration — they ARE the brand voice. The site doesn't try to be pretty; it tries to make you uncomfortable. That's the identity. | CSS scanline overlay technique, noise grain implementation, RGB split / glitch CSS patterns, how they handle cursor and interactive states |
| `www_machinezero_it.html` | **Cold archival identity.** This site feels like breaking into a filing cabinet in a government bunker. The identity is built on restriction — what you CAN'T see matters as much as what you can. Study how information hierarchy and sparse reveals create a sense of classified access. | Table/list layout architecture, mechanical interaction patterns, the tempo and choreography of hover reveals, how they handle type at different scales |
| `studiolumio_com.html` | **Restrained luxury identity.** Premium but not decorative. Every motion feels earned and intentional. The identity whispers instead of shouting — but the craft is deafening. Study how they make minimalism feel alive rather than empty. | Easing curve values from CSS transitions, timing relationships between staggered elements, how they handle page-level transitions and loading states |
| `studiolumio_com (1).html` | **Same brand, deeper layer.** This is an inner page of the same site — study how the identity established on the homepage CONTINUES and EVOLVES on secondary pages. How do they maintain atmosphere without repeating the same tricks? How do inner pages feel connected but distinct? | Inner-page layout patterns, how animation intensity scales down on content-heavy pages, scroll behavior on long-form content, navigation state changes |
| `www_sutera_ch.html` | **Data-organism identity.** This site makes technical data feel alive and breathable. The identity lives in the tension between precision (monospace, grids, numbers) and organic rhythm (spacing, pacing, how elements breathe). Study how they pair cold data with warm layout instincts. | Typography scale ratios, data-node UI component patterns, monospace/sans-serif pairing logic, how small UI elements (tags, labels, metadata) are styled |
| `www_spektralstudio_com.html` | **Aggressive void identity.** The brand identity IS the tension between massive type and aggressive emptiness. Nothing is centered, nothing is safe. Study how asymmetry creates anxiety and how negative space isn't passive — it's a weapon. | Grid breaking techniques, oversized type placement, negative space ratios, how they handle the relationship between navigation and content |
| `www_utopiatokyo_com.html` | **Structural silence identity.** Minimal palette, maximum weight. The identity comes from what's withheld — borders do the work of color, rhythm does the work of imagery. Study how a near-monochrome palette can still feel rich and emotionally charged. | Border/line systems as design language, column rhythm and vertical spacing, the relationship between image and void, how they use a single accent color |

**CRITICAL RULES:**
- Do NOT copy code verbatim from any reference file.
- Store extracted values (easing curves, spacing ratios, color relationships) as design tokens in your working memory.
- When making any creative micro-decision (a hover timing, a gap size, an animation curve), consult these internalized tokens FIRST before defaulting to generic values.
- If a reference technique conflicts with performance requirements in this spec, performance wins.

---

## TECH STACK & INTEGRATION CONTRACT

- **Framework:** Next.js 14+ (App Router). ALL interactive components are Client Components (`"use client"`). `layout.tsx` and `page.tsx` are Server Components that compose them.
- **Styling:** Tailwind CSS v3 with custom config for brutalist tokens.
- **Scroll:** Lenis (smooth scroll) initialized in a top-level `<LenisProvider>` client component.

### Animation Ownership — STRICT PARTITION

| Library | Owns | Never Touches |
|---|---|---|
| **Framer Motion** | Hover states, cursor physics, floating elements (cards, data nodes), mount/unmount transitions, layout animations, component-level springs | Scroll-driven animation of any kind |
| **GSAP + ScrollTrigger** | ALL scroll-driven animations: section pin, parallax, progress-mapped transforms, Echo pulse, Tube plasma, section enter/exit lifecycle | Hover interactions, cursor, pointer-following elements |

**RULE:** Never use GSAP for hover. Never use Framer Motion for scroll. If in doubt, the trigger determines ownership: mouse event → Framer, scroll event → GSAP.

### Lenis ↔ GSAP Bridge (MANDATORY)

In the `LenisProvider` `useEffect`, wire:
```js
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```
Lenis uses native scrollbar — do NOT use `ScrollTrigger.scrollerProxy()`.

### Audio: Howler.js
- All sounds are gated behind the BootSequence user interaction (click `[ ENTER LAB ]`).
- Singleton `AudioEngine` class in `lib/audioEngine.ts`.
- No autoplay — `AudioContext` is created only after first user click.
- Methods: `.unlock()`, `.play(soundId)`, `.setVolume(soundId, vol)`, `.mute()`.

### Particles: Canvas
- The Hero "spores" MUST be rendered on an HTML5 `<canvas>` overlay with `pointer-events: none` (except for hit-testing via manual coordinate math).
- Use `requestAnimationFrame` for the physics loop. Do NOT use individual DOM elements for particles.

---

## ART DIRECTION & CONCEPT ("BIOLOGICAL BRUTALISM")

- **The Narrative:** The website functions as a classified mutation laboratory. The user is exploring a dark sci-fi, cyberpunk-inspired secure facility where digital organisms (brands and interfaces) are engineered, incubated, and deployed.
- **Visual Vibe:** "Xenobiology meets Tactical UI". The aesthetic channels a brutalist operating system from a dystopian future. It must feel raw, clinical, aggressive, and highly precise.
- **The Metaphor:** The interface is alive. Elements pulse, mutate, flee, and glitch. The code, physics, and animations must reflect an environment of raw experimentation where organic matter collides with rigid digital structures.

---

## DESIGN TOKENS

### Palette
| Token | Hex | Semantic |
|---|---|---|
| `bg-abyss` | `#050505` | Background, voids, "off" state |
| `line-ash` | `#1A1A1A` | Grids, borders, structural lines |
| `text-bone` | `#F0F0F0` | Primary typography, data readouts |
| `accent-infrared` | `#FF2A00` | Interactive states, life signals, alerts |
| `system-green` | `#00FF41` | Status indicators ("operational") |

### Typography (LOCKED — no alternatives)
| Role | Font | Source | Weight | Style |
|---|---|---|---|---|
| Headlines | **Unbounded** | Google Fonts | 700 | Uppercase, `letter-spacing: -0.02em`, `line-height: 0.9` |
| Data / Body / UI | **JetBrains Mono** | Google Fonts | 400, 700 | Normal case, `line-height: 1.5` |

Do NOT use Clash Display (requires commercial license). Do NOT substitute fonts.

### Motion Tokens
| Token | Value | Usage |
|---|---|---|
| `heroEase` | `cubic-bezier(0.16, 1, 0.3, 1)` | Section reveals, organic deceleration |
| `snapEase` | `cubic-bezier(0.85, 0, 0.15, 1)` | CRT snap, abrupt state changes |
| `aggro` | `cubic-bezier(0.7, 0, 0.3, 1)` | Service card hovers, aggressive fills |
| `microDuration` | `150ms` | Hover borders, scramble character ticks |
| `macroDuration` | `800ms` | Section transitions, card reveals |
| `scrollSmooth` | `1.2` (Lenis lerp) | Global smooth scroll intensity |
| `springConfig` | `{ stiffness: 150, damping: 15 }` | Framer Motion spring defaults |

### Spacing
| Token | Desktop | Mobile (<768px) |
|---|---|---|
| `gutter` | `40px` | `20px` |
| `maxContentWidth` | `1440px` | `100%` |
| `sectionPadding` | `10vh 40px` | `5vh 20px` |
| `gridColumns` | `12` | `1` (stacked) |

---

## BRAND ASSETS — LOGO SYSTEM

The `orko_` brand has two marks: the **wordmark** (`orko_`) and the **symbol** (`[K_O]`). The brackets are part of the logo — they are NOT decorative additions. Each mark exists in two forms: a PNG image (for visual richness) and a text rendition (for code/terminal aesthetic). Both forms are valid — the choice depends on context.

### Asset Files
```
{/* ASSET: LOGO_ORKO_WHITE | REPLACE_WITH: orko_ wordmark PNG, white on transparent, min 400px wide */}
{/* ASSET: LOGO_ORKO_RED | REPLACE_WITH: orko_ wordmark PNG, accent-infrared on transparent, min 400px wide */}
{/* ASSET: LOGO_KO_WHITE | REPLACE_WITH: [K_O] symbol PNG, white on transparent, min 200px wide */}
{/* ASSET: LOGO_KO_RED | REPLACE_WITH: [K_O] symbol PNG, accent-infrared on transparent, min 200px wide */}
```

### Usage Rules — When PNG, When Text

| Context | Mark | Form | Rationale |
|---|---|---|---|
| **HUD top-left** | `orko_` | **PNG** (white, ~24px height). Falls back to JetBrains Mono text if image fails to load. | The HUD is the persistent brand presence — the logo should look crafted, not typed. |
| **HUD bottom-left** | `[K_O]` | **Text** (`[K_O]` in JetBrains Mono, opacity 0.4). | The bottom-left is a subtle system signature — text fits the terminal aesthetic of the HUD corners. The brackets are part of the mark, not added formatting. |
| **BootSequence** | `[K_O]` | **PNG** (white, centered, ~40px, opacity 0.06). Visible behind the typing text as a watermark during the entire boot. | Subliminal brand imprint while the system loads. Nearly invisible but the shape registers. |
| **Footer** | `orko_` | **PNG** (white, ~32px height). Positioned in Col 3 near the `© 2026 orko_` text. The copyright text itself remains as text. | The Footer is the closing brand moment — PNG gives it weight. |
| **Mobile menu overlay** | `orko_` | **PNG** (white, ~48px height, centered at top of menu). | Full-screen menu is a brand moment. |
| **OG / Social share image** | Both | **PNG** (both marks composed in the OG image asset). | Social cards need visual identity. |

### Logo Behavior

**HUD logo (`orko_` PNG):**
- Default: white, `height: 24px`, `width: auto`.
- Hover: the PNG is replaced by a text-rendered `orko_` in JetBrains Mono that immediately runs the text scramble animation (random ASCII → resolve back to `orko_`). After scramble resolves (400ms), the PNG fades back in. This creates a "glitch between image and code" effect — the logo temporarily reveals its digital DNA.
- Sound: `glitch_burst`.
- Implementation: Stack the PNG and a hidden text element in the same position. On `mouseenter`, fade PNG to `opacity: 0` (50ms), show text, run scramble, on complete fade PNG back to `opacity: 1` and hide text.

**BootSequence watermark (`[K_O]` PNG):**
- `position: absolute`, centered (both axes), `opacity: 0.06`, `z-index: 0` (behind text).
- Static — no animation. It's a ghost behind the terminal output.
- Fades to `opacity: 0` during the CRT snap exit (400ms).

**Footer logo (`orko_` PNG):**
- Sits above the `© 2026 orko_` copyright text line.
- Default: `opacity: 0.6`. On section enter: fades to `opacity: 1` (part of standard section ENTER lifecycle).
- No hover effect — this is a quiet closing signature, not interactive.

---

## CLIENT LOGOS (Works Section)

Each project in the Works archive can optionally display a client logo. Logos appear in two places:

### In the Floating Card (Desktop):
- The bottom 20% bar of the FloatingCard currently shows client name + copy. Add a small client logo (PNG, white/monochrome, `height: 20px`, `opacity: 0.5`) to the LEFT of the client name text.
- If no logo asset is provided for a client, show only the text name — no broken image, no placeholder.

### In the Mobile Accordion:
- When a Work row expands on tap, the client logo (if available) appears above the video, `height: 24px`, `opacity: 0.5`.

### Client Logo Assets:
```
{/* ASSET: CLIENT_LOGO_1 | REPLACE_WITH: HAPPENER logo PNG, white on transparent */}
{/* ASSET: CLIENT_LOGO_2 | REPLACE_WITH: XII IMMIGRATIONS logo PNG, white on transparent */}
{/* ASSET: CLIENT_LOGO_3 | REPLACE_WITH: LEGENDARY NAMES logo PNG, white on transparent (optional) */}
{/* ASSET: CLIENT_LOGO_4 | REPLACE_WITH: CAROLA ZECH logo PNG, white on transparent (optional) */}
{/* ASSET: CLIENT_LOGO_5 | REPLACE_WITH: ACAU logo PNG, white on transparent (optional) */}
{/* ASSET: CLIENT_LOGO_6 | REPLACE_WITH: RODRIGO AGÜERO Z logo PNG, white on transparent (optional) */}
{/* ASSET: CLIENT_LOGO_7 | REPLACE_WITH: AGUSTINA MISTRETTA logo PNG, white on transparent (optional) */}
{/* ASSET: CLIENT_LOGO_8 | REPLACE_WITH: REJUS logo PNG, white on transparent (optional) */}
```

**All client logos must be monochrome white on transparent.** No color logos — they break the palette discipline. If a client's logo is colorful, desaturate it and convert to white. The lab doesn't care about their brand colors — it only cares about the specimen data.

---

## GLOBAL TEXTURE OVERLAY

A fixed `<TextureOverlay />` component covering `100vw × 100vh`:
- `position: fixed`, `inset: 0`, `z-index: 99`, `pointer-events: none`.
- **Layer 1 — Noise Grain:** CSS `background-image` using an SVG `feTurbulence` filter (or a tiny repeating noise PNG). Opacity `0.04`.
- **Layer 2 — Scanlines:** Repeating horizontal lines via `background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)`.
- Combined in a single div with two pseudo-elements (`::before`, `::after`).

---

## ORGANIC IMPERFECTION SYSTEM ("THE CORRUPTION LAYER")

The global texture overlay creates a baseline grunge, but it's *uniform* — and uniformity is the enemy of "biological." This system adds distributed, irregular, living imperfections that make the interface feel like a decaying organism, not a clean Figma export.

### Ambient Micro-Glitches
A global `<GlitchEngine />` utility (runs inside `providers.tsx`) that fires random micro-disturbances:
- **Frequency:** Every 12–20 seconds (randomized interval), one random visible element on the page receives a micro-glitch.
- **Glitch types** (randomly selected per event):
  1. **Position jitter:** Element shifts `translateX(2px)` for 80ms, then snaps back.
  2. **Opacity flicker:** Element flashes `opacity: 0.3` for 60ms, twice in rapid succession.
  3. **Color bleed:** Element's color shifts to `accent-infrared` for 100ms, then back.
  4. **Scanline tear:** A 2px-tall horizontal `accent-infrared` bar (`position: absolute`, `width: 100%`) flashes across the element for 1 frame (16ms).
- **Target selection:** Only target elements with a `data-glitchable` attribute (add this to: HUD elements, stat bars, data node content, Works row text, clock). Never glitch the Hero H1, videos, or the CTA — those have their own dedicated animations.
- **Respects `prefers-reduced-motion`:** Disable entirely if active.
- **Sound:** Optionally play `glitch_burst` at 5% volume on each event (test during Phase 7 — might be annoying, be ready to remove).

### Per-Section Atmospheric Textures
Beyond the global noise/scanline overlay, each section has a subtle unique texture that reinforces its narrative identity. These are `::before` pseudo-elements on each section container, `pointer-events: none`:

| Section | Texture | Implementation |
|---|---|---|
| **Hero** | Clean — the global overlay is enough. The video provides the organic layer. | None additional. |
| **Bio** | **CCTV vignette** — dark corners, as if viewed through a surveillance lens. | `background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)`. |
| **Services** | **Electromagnetic interference** — faint vertical streaks that drift slowly. | CSS `background: repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(255,42,0,0.015) 120px, rgba(255,42,0,0.015) 121px)`, animated `translateX` over 20s, infinite. |
| **Works** | **Photocopy grain** — slightly heavier scanlines, like a classified document that's been Xeroxed multiple times. | Duplicate the global scanline pattern but at `opacity: 0.06` (1.5× the global). Slightly offset vertically from the global layer to create moiré. |
| **Footer** | **Signal degradation** — the further down you go, the more the signal deteriorates. | `background: linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.6) 100%)` layered with noise grain at `opacity: 0.08` (2× the global). |

### Organic Border Imperfections
Not every border should be a perfect 1px line. The following elements get "corrupted" borders:

- **Works row separators:** Instead of a solid `border-bottom`, use a CSS `border-image` with a subtle SVG pattern that has micro-irregularities — or more practically: alternate between `opacity: 0.5` and `opacity: 0.8` on consecutive borders using `nth-child` selectors. Some rows' borders appear slightly faded, like worn paper.
- **Service card borders (idle):** Apply a subtle animated `border-opacity` that oscillates between `0.08` and `0.15` over 6s (staggered per card so they don't pulse in sync). The borders feel like they're breathing.
- **Data Node borders (Hero):** Use `border-style: dashed` with a very small `dash-array` (via SVG border or `border-image`) so the borders look like they're being transmitted with signal interference.
- **Tube glass (empty state):** The SVG stroke for the empty tube shouldn't be perfectly uniform. Apply `stroke-dasharray: 200 2 150 2 180 2` (long segments with tiny 2px gaps scattered irregularly). The glass tube looks like it has micro-fractures — hairline breaks in the containment.

### Type Corruption Micro-Events
Triggered independently from the Ambient Micro-Glitches (different system, different tempo):
- **Frequency:** Every 25–40 seconds, one `data-corruptible` text element has a single character replaced with a random Unicode block character (`█`, `▓`, `░`, `▒`, `╳`) for 120ms, then reverts.
- **Targets:** Only monospace/data text: clock digits, stat labels, data node values, Works table data (SECTOR, YEAR). NEVER corrupt headlines or body copy.
- **Effect:** Extremely subtle — most users won't consciously notice, but it creates an ambient feeling that the data stream is unstable.
- **Implementation:** A `useTypeCorruption` hook that selects a random character index in a random target element, stores the original char, replaces it, and reverts via `setTimeout`.

---

## COLOR DISCIPLINE — RED vs GREEN

The palette contains two high-saturation colors that are near-complementary: `accent-infrared` (`#FF2A00`) and `system-green` (`#00FF41`). If they appear in proximity, they create optical vibration (the edges "buzz"). This must be controlled:

### Rules:
1. **`system-green` is EXCLUSIVELY for operational status indicators.** It appears ONLY in:
   - Footer: the `ALL SYSTEMS OPERATIONAL [●]` pulsing dot.
   - BootSequence: the `[ ENVIRONMENT READY ]` terminal line.
2. **`system-green` and `accent-infrared` must NEVER appear within 200px of each other on screen.** Both green uses are spatially isolated from red interactive elements.
3. **No other element may use `system-green`.** If the AI needs a secondary accent for any reason, use `text-bone` at varying opacities — NOT green.
4. **If a future section or component needs a "success" state**, use `text-bone` with a ✓ character, not green.
5. **Narrative justification:** Red = organic, alive, dangerous, the mutation. Green = machine, stable, operational, the system that contains the mutation. They are opposing forces and should feel separated.

---

## LANGUAGE SYSTEM (EN / ES)

The site is bilingual: English (default) and Spanish (Rioplatense register — Argentine Spanish, vos form, natural and direct, not formal Spain-Spanish). Implemented as a client-side text swap, NOT as separate routes or full i18n framework. This is a single-page portfolio, not a content-heavy app.

### Implementation

- **Dictionary file:** `lib/i18n.ts` exports a `const dictionary` object with keys for every text string, each containing `{ en: "...", es: "..." }`.
- **Language context:** `<LanguageProvider>` in `providers.tsx` manages current language state (`'en' | 'es'`). Exposes `lang`, `setLang`, and a helper `t(key)` that returns the correct string.
- **Persistence:** Store selected language in `localStorage` (key: `orko_lang`). On first visit, default to `'en'`. On subsequent visits, restore saved preference.
- **No route changes.** No `/en` or `/es` prefixes. No page reload. Language switches are instant and client-side.
- **HTML lang attribute:** Update `<html lang="en">` / `<html lang="es">` dynamically when language changes.

### Toggle Interaction (HUD)

The HUD bottom-right currently shows `LANG: [EN]`.
- **Click behavior:** Toggles between `EN` and `ES`.
- **Animation:** On click, ALL visible text on the page simultaneously scrambles through random characters (200ms) and then resolves to the new language. This is the text scramble utility already used elsewhere — but applied globally in a coordinated burst. It should feel like the entire operating system is rebooting in a new language.
- **Sound:** Play `glitch_burst` on toggle.
- **Visual:** The `[EN]` / `[ES]` label itself animates: border flashes `accent-infrared` for 300ms on switch.

### Full Translation Dictionary

**IMPORTANT:** The Spanish translations use Rioplatense register. "Vos" instead of "tú." Direct, sharp tone. No formal corporate Spanish. The translations should feel like a native Argentine wrote them — not like they were run through a translator.

```
BOOT SEQUENCE:
en: "[ SYSTEM BOOT ] ..."          → es: "[ ARRANQUE DEL SISTEMA ] ..."
en: "SCANNING MUTATION DATABASE"    → es: "ESCANEANDO BASE DE MUTACIONES"
en: "LOADING VECTORS"               → es: "CARGANDO VECTORES"
en: "[ ENVIRONMENT READY ]"         → es: "[ ENTORNO LISTO ]"
en: "[ ENTER LAB ]"                 → es: "[ ENTRAR AL LAB ]"

HUD:
en: "[ WORK ]"                      → es: "[ OBRA ]"
en: "[ LAB ]"                       → es: "[ LAB ]"
en: "[ INTEL ]"                     → es: "[ INFO ]"
en: "LANG: [EN]"                    → es: "LANG: [ES]"

HERO:
en: "INCUBATING DIGITAL SPECIES."
es: "INCUBANDO ESPECIES DIGITALES."

en: "We synthesize living identities and high-performance interfaces designed for aggressive survival."
es: "Sintetizamos identidades vivas e interfaces de alto rendimiento diseñadas para la supervivencia agresiva."

TERMINAL TICKER:
en: "> DEPLOYING: BRAND SYSTEMS_"           → es: "> DESPLEGANDO: SISTEMAS DE MARCA_"
en: "> DEPLOYING: INTELLIGENT INTERFACES_"  → es: "> DESPLEGANDO: INTERFACES INTELIGENTES_"
en: "> DEPLOYING: AUTONOMOUS PLATFORMS_"    → es: "> DESPLEGANDO: PLATAFORMAS AUTÓNOMAS_"
en: "> DEPLOYING: VISUAL IDENTITIES_"       → es: "> DESPLEGANDO: IDENTIDADES VISUALES_"
en: "> DEPLOYING: AI-DRIVEN WORKFLOWS_"     → es: "> DESPLEGANDO: FLUJOS CON IA_"
en: "> DEPLOYING: IMMERSIVE EXPERIENCES_"   → es: "> DESPLEGANDO: EXPERIENCIAS INMERSIVAS_"

DATA NODES (Hero):
en: "STATUS: MUTATING"              → es: "ESTADO: MUTANDO"
en: "SEQ_ID: 0092"                  → es: "SEQ_ID: 0092" (no change — data stays in code format)
en: "VECTOR: ACTIVE"                → es: "VECTOR: ACTIVO"

BIO:
en: "[ THE_OPERATOR ]"              → es: "[ EL_OPERADOR ]"
en: "CREATIVE SPECIMEN"             → es: "ESPÉCIMEN CREATIVO"

en: "I design mutations that bridge the gap between static brands and living organisms. From autonomous agents to immersive interfaces, my work lives at the bleeding edge of evolution."
es: "Diseño mutaciones que cierran la brecha entre marcas estáticas y organismos vivos. Desde agentes autónomos hasta interfaces inmersivas, mi trabajo vive en el filo de la evolución."

en: "RESEARCH"                      → es: "INVESTIGACIÓN"
en: "DEVELOPMENT"                   → es: "DESARROLLO"
en: "ART DIRECTION"                 → es: "DIRECCIÓN DE ARTE"
en: "AUTOMATION"                    → es: "AUTOMATIZACIÓN"

SERVICES:
en: "[ WHAT_WE_DO ]"                → es: "[ LO_QUE_HACEMOS ]"
en: "MUTATION VECTORS"              → es: "VECTORES DE MUTACIÓN"

en: "BRAND IDENTITY & ART DIRECTION"
es: "IDENTIDAD DE MARCA Y DIRECCIÓN DE ARTE"
en: "Constructing visual systems with strict rules. Reducing brand chaos into a singular, undeniable signal."
es: "Construimos sistemas visuales con reglas estrictas. Reducimos el caos de marca a una señal única e innegable."

en: "STRATEGIC INSIGHTS & RESEARCH"
es: "INSIGHTS ESTRATÉGICOS E INVESTIGACIÓN"
en: "Decoding the human variable. Deep qualitative investigation to uncover hidden patterns before code."
es: "Decodificamos la variable humana. Investigación cualitativa profunda para descubrir patrones ocultos antes del código."

en: "DIGITAL ARCHITECTURE"
es: "ARQUITECTURA DIGITAL"
en: "Bespoke digital ecosystems. Zero templates. High-performance code designed for maximum immersion."
es: "Ecosistemas digitales a medida. Cero templates. Código de alto rendimiento diseñado para máxima inmersión."

en: "AUTOMATIONS & AI SOLUTIONS"
es: "AUTOMATIZACIONES Y SOLUCIONES IA"
en: "Replacing manual labor with autonomous logic."
es: "Reemplazamos el trabajo manual con lógica autónoma."

WORKS:
en: "CLIENT"     → es: "CLIENTE"
en: "TYPE"       → es: "TIPO"
en: "SECTOR"     → es: "SECTOR" (no change)
en: "YEAR"       → es: "AÑO"

Project copies:
en: "Autonomous Event Infrastructure. Engineered a robust, operator-independent ecosystem for the Dubai event market."
es: "Infraestructura Autónoma de Eventos. Diseñamos un ecosistema robusto e independiente del operador para el mercado de eventos de Dubai."

en: "Biometric Lead Qualification. Integrated AI-driven logic to score applicant profiles in real-time."
es: "Calificación Biométrica de Leads. Integramos lógica impulsada por IA para evaluar perfiles en tiempo real."

en: "The Infinite Possibility Engine. A generative visual system where typography mutates to represent endless naming assets."
es: "El Motor de Posibilidades Infinitas. Un sistema visual generativo donde la tipografía muta para representar activos de naming infinitos."

en: "Structural Heritage Navigation. Digitizing 30 years of sculptural mastery into a non-linear archive."
es: "Navegación de Patrimonio Estructural. Digitalizamos 30 años de maestría escultórica en un archivo no lineal."

en: "High-Contrast Industrial UI. Designed for the harsh environments of mining and agro-tech."
es: "UI Industrial de Alto Contraste. Diseñada para los entornos hostiles de minería y agro-tech."

en: "Isolate Display Environments. A portfolio behaving as a gallery of distinct architectural rooms."
es: "Entornos de Exhibición Aislados. Un portfolio que se comporta como una galería de salas arquitectónicas."

en: "Self-Governing Gallery System. Decentralized sales infrastructure for the Aspen market."
es: "Sistema de Galería Autogestionada. Infraestructura de venta descentralizada para el mercado de Aspen."

en: "Justice Network Visualization. Injecting modern visual semantics into judicial structures."
es: "Visualización de Red Judicial. Inyectamos semántica visual moderna en estructuras judiciales."

FOOTER:
en: "COPY EMAIL [↗]"               → es: "COPIAR EMAIL [↗]"
en: "[ COPIED ]"                    → es: "[ COPIADO ]"
en: "ALL SYSTEMS OPERATIONAL"       → es: "TODOS LOS SISTEMAS OPERATIVOS"
en: "START MUTATION"                → es: "INICIAR MUTACIÓN"
en: "[ MUTATION INITIATED ]"        → es: "[ MUTACIÓN INICIADA ]"
en: "[ SCHEDULE_CALL ]" (cursor)    → es: "[ AGENDAR ]"
```

### What does NOT translate:
- Brand name `orko_` — never translates.
- `[K_O]` symbol — never translates.
- `BUE [HH:MM:SS]` clock — stays as-is.
- `SEQ_ID`, `VECTOR`, technical data node labels — stay in code/English format (they're "system language," not human language).
- Project client names (HAPPENER, XII IMMIGRATIONS, etc.) — proper nouns.
- `LAT: -34.6037 | LON: -58.3816` — numeric data.
- `© 2026 orko_` — legal text stays.

---

## GLOBAL AUDIO MANIFEST

| ID | Trigger | Character | Duration | Placeholder |
|---|---|---|---|---|
| `bg_drone` | After `[ ENTER LAB ]` click | Dark low-frequency ambient loop, analog hum | 30s loop | `{/* ASSET: AUDIO_BG_DRONE \| REPLACE_WITH: URL to dark ambient .mp3 \| Autoplay after unlock */}` |
| `hover_beep` | Any interactive element hover | Short metallic click / tick, surgical | 50–100ms | `{/* ASSET: AUDIO_HOVER_BEEP \| REPLACE_WITH: URL to mechanical click .wav */}` |
| `scroll_swoosh` | Section transition (enter new section) | Low bass sweep, pressure change | 300ms | `{/* ASSET: AUDIO_SCROLL_SWOOSH \| REPLACE_WITH: URL to low bass drop .wav */}` |
| `glitch_burst` | Easter egg tap, text scramble events | Digital corruption burst, static | 200ms | `{/* ASSET: AUDIO_GLITCH_BURST \| REPLACE_WITH: URL to digital glitch .wav */}` |
| `heartbeat_thud` | Echo system pulse | Deep sub-bass thud, organic | 400ms | `{/* ASSET: AUDIO_HEARTBEAT_THUD \| REPLACE_WITH: URL to sub bass thud .wav */}` |

**Post-Build SFX Sourcing Options:**
- ElevenLabs Sound Effects (text-to-SFX generation)
- Freesound.org (CC0 samples, search: "mechanical click", "dark drone", "bass drop")
- Audacity: Generate drone with low synth pad, 30s, export .mp3

---

## SECTION TRANSITION PROTOCOL (Enter / Exit)

**APPLIES TO EVERY SECTION.** Orchestrated by GSAP ScrollTrigger.

Every section implements a scroll-linked lifecycle:

### ENTER (first 20% of section scroll range)
- Elements stagger in: `translateY(40px) → 0`, `opacity: 0 → 1`.
- Stagger: `0.08s` between elements.
- Ease: `heroEase`. Duration: `macroDuration`.
- Headlines animate character-by-character or word-by-word (scramble in from noise to final text).

### HOLD (middle 60% of section scroll range)
- Elements are fully visible and interactive.
- Hover states, scroll-progress-mapped animations (like Tube plasma) operate here.

### EXIT (last 20% of section scroll range)
- Elements "decompose": `scale(1 → 0.96)`, `opacity(1 → 0)`, `filter: blur(0 → 4px)`.
- Text elements trigger a fast 200ms scramble-to-random-characters before fading out.
- Cards / list items stagger OUT in **reverse order** of their stagger IN.
- Ease: `heroEase`. Scrub: `0.5` for smooth scroll-linked exit.

**Exception:** The Hero section has a custom exit (see Hero → Bio transition). The Footer never exits.

### Section-Specific Transition Bridges

Beyond the generic Enter/Exit lifecycle, each section boundary has a unique **bridge moment** — a visual handoff that connects the narrative:

**Hero → Bio:**
Defined in Hero section. The Tube's origin point activates, the 1px line descends and widens to 6px, the first drops of liquid appear. Video recedes. The Bio section's content enters as if the user is descending into a deeper chamber.

**Bio → Services:**
- The Tube liquid reaches 100% in Bio. Pressure pause (200ms), then RUSHES into Services (see **Tube System Phase 3**).
- Bio region dims. The Perspective Grid of Services fades in *behind* Bio content during the last 10% — layered parallax where the grid appears before the cards.
- Play `scroll_swoosh`.

**Services → Works:**
- The Tube curves off the left edge of the screen and disappears (see **Tube System Phase 4 — Exit**). This is a quiet, elegant departure — the vein leaves the visible body.
- As the last Service card exits, it compresses horizontally (`scaleX: 1 → 0.5`, `opacity: 1 → 0`, 400ms) as if being filed away.
- The Works header row (`CLIENT | TYPE | SECTOR | YEAR`) types in character-by-character (like a database terminal loading). Each column header appears one at a time with a 200ms delay.
- The first horizontal border line draws itself left-to-right (`width: 0 → 100%`) synced to scroll.
- Play `scroll_swoosh`.

**Works → Footer:**
- The last Work row's bottom border extends downward, becoming a vertical divider line that leads into the Footer.
- Footer content enters as terminal-typed text — character by character for data columns, cursor blink between groups.
- The "START MUTATION" CTA is the last element to appear: scales from `scale(0.9)` to `scale(1)` with a deep `heartbeat_thud` audio hit as it lands.

---

## THE "ECHO" SYSTEM (Global Scroll Heartbeat)

A persistent background pulse that keeps the "organism" feeling alive:

- `<EchoSystem />` component rendered via `createPortal` to `document.body`.
- A full-viewport `div` (`position: fixed`, `inset: 0`, `pointer-events: none`, `z-index: 1`).
- Contains a radial gradient centered on screen: `radial-gradient(circle at 50% 50%, #FF2A00, transparent 70%)`.
- Triggered by GSAP: every time the user scrolls **one full viewport height** (`100vh`), the gradient opacity pulses `0 → 0.05 → 0` over 1.2s.
- Also plays `heartbeat_thud` audio (if unmuted).
- **Must remain active on mobile.** Do not disable this for touch devices.

---

## THE TUBE SYSTEM (Circulatory Anatomy)

The Tube is the circulatory system of the site — but like any organism, it doesn't reach everywhere equally. It is born in the Hero, pumps life through Bio (its heart), feeds energy into Services, and then **fades off the left edge of the screen** as its work is done. It does NOT reach Works or Footer. Those sections stand on their own — the organism's influence echoes there through the red accent color and the heartbeat pulse, but the visible vein is gone. This restraint keeps the Tube feeling special rather than exhausting.

Implemented as ONE continuous component (`<TubeSystem />`) with `position: absolute` on the main page container, `z-index: 2`.

### Physical Form & Route

Rendered as an **SVG `<path>`** element, positioned on the left side of the viewport (`left: gutter`).

```
HERO (birth)
│  Straight vertical descent, 1px stroke
│  Starts at y: 70vh (near the Hero copy)
│  The line is drawing itself downward as you scroll
│
BIO (the heart — liquid fills here)
├──── Bleeder branch → toward ID Card (horizontal, 60px)
│  Main trunk widens to 6px
│  Subtle S-curve (~8px lateral displacement over the section height)
│  The curve makes it feel organic, like a vein, not a ruler line
│
SERVICES (final reach)
│  Trunk narrows to 3px
│  Path begins curving LEFT toward the screen edge
│  over the height of the Services section
├──── Single bleeder branch → 80px toward the card stack
│
EXIT (during Services, ~60% scroll)
│  The trunk curves decisively off the left edge of the viewport
│  stroke-width: 3px → 1px (thinning as it leaves)
│  opacity: 1 → 0 over the final 100px of path
╰── Gone. The vein has left the visible body.
```

**The tube does NOT appear in Works or Footer.** After the tube exits, the site's red accent color carries the biological memory — the text turning `accent-infrared` on Works row hovers, the CTA liquid fill, the Echo heartbeat — all feel like residual circulation, blood that was pumped by the tube even though the tube itself is no longer visible. Absence creates presence.

### SVG Implementation

- Main path: SVG `<path d="...">` using cubic Bézier curves for the S-curve in Bio and the leftward exit curve in Services.
- Bleeder branches: separate `<path>` elements connecting to the trunk at junction points.
- Empty tube (the "glass"): `stroke: line-ash`, `opacity: 0.2`, always visible where the tube exists.
- Filled tube (the liquid): overlaid on the same path with `stroke: accent-infrared` + glow.
- `stroke-linecap: round` on all paths.
- On mobile: entire Tube System is `display: none`.

### The Liquid — How It Flows

All movement is scroll-driven via GSAP ScrollTrigger using `stroke-dasharray` + `stroke-dashoffset` animation (SVG path drawing technique).

**Phase 1 — Genesis (Hero scroll: 80%–100%)**
- A red dot appears at the origin (y: 70vh). The path begins "drawing" itself downward as liquid flows in.
- Glow is faint: `filter: drop-shadow(0 0 8px #FF2A00)` at low opacity. The liquid is being born.

**Phase 2 — The Heart (Bio scroll: 0%–100%)**
- The primary pumping chamber. Liquid fills the Bio trunk AND the ID Card bleeder.
- At the S-curve bends, `stroke-width` animates `6px → 8px → 6px` — the liquid pools at curves like real fluid.
- **Meniscus:** `filter: blur(1.5px)` on the leading 10px of the fill edge. The front is soft, not a hard cutoff.
- **Internal turbulence:** A second overlaid path (same route) with `stroke-dasharray: 3 6` and cycling `stroke-dashoffset` CSS animation — bands of varying density flow upward inside the filled region. The liquid looks alive.
- **Glow escalation:** `drop-shadow` spread grows as the tube fills. At 100%, the left side of Bio has a faint red ambient wash.
- `scrub: 0.8` — liquid lags behind scroll. Heavy. Viscous. This is what makes it feel like liquid, not a progress bar.

**Phase 3 — Distribution (Bio 100% → Services ~60%)**
- At Bio 100% fill, a brief scroll-pause: 200ms of no movement. Pressure builds.
- Then liquid RUSHES into the Services segment (fast `scrub: 0.3`, sudden acceleration — feels like a pump).
- Bio region dims to `opacity: 0.5` (the heart has pumped, between beats).
- The single Services bleeder fills toward the card stack. When a service card is hovered, the bleeder tip **pulses** — `stroke-width` animates `1px → 3px → 1px`, `opacity` flashes. The liquid feeds energy to the card you're interacting with.

**Phase 4 — Exit (Services ~60% → 100%)**
- The trunk begins its leftward curve off-screen. The liquid follows, thinning.
- `stroke-width: 3px → 1px`. `opacity: 1 → 0`. `drop-shadow` fades to nothing.
- The Services bleeder retracts (path draws in reverse, 200ms).
- By Services 100%, the tube is completely gone from view. Clean exit.
- **Narrative meaning:** The organism has pumped its blood outward. What remains in Works and Footer is residual warmth — the `accent-infrared` that appears in hover states and the CTA is the tube's legacy, not its direct presence.

### Reverse Scroll Behavior

When the user scrolls **back up**, the entire system reverses organically:
- Liquid recedes (stroke-dashoffset reverses). The meniscus leads the retreat.
- Re-entering Bio from Services: liquid flows back into the Bio heart (the heart refills).
- Glow dims as liquid retreats.
- The tube's glass remains visible — only the liquid moves. This means if you scroll back up to Bio, you see the empty glass tube with the liquid rising back into it from below. Feels like the organism is breathing in.
- `scrub` values ensure the reverse feels equally weighted — no instant snapping.

### Liquid Visual Layers (SVG Stroke)

| Layer | Technique | Effect |
|---|---|---|
| **Fill** | `stroke-dasharray` / `stroke-dashoffset` + GSAP scroll | Progressive flow through the path |
| **Meniscus** | `filter: blur(1.5px)` on leading edge | Soft liquid front |
| **Turbulence** | Overlaid dashed stroke with cycling animation | Internal movement in filled region |
| **Glow** | `filter: drop-shadow` scaling with fill | Ambient red light grows with fill |
| **Pooling** | `stroke-width` swell at curve apex | Fluid collects at bends |

### Tube Sound Design

| Event | Sound |
|---|---|
| Liquid first appears (Hero 80%) | Faint rumble (reuse `bg_drone` at 20% vol, 1s) |
| Bio fill at 50% | `heartbeat_thud` at 30% vol — the heart activates |
| Bio fill at 100% (pressure pause) | Duck `bg_drone` 200ms → `scroll_swoosh` as liquid rushes |
| Bleeder pulse on card hover | `hover_beep` (already specified) |
| Tube exits screen (Services 80%) | Faint `scroll_swoosh` at 15% vol — a whisper goodbye |

---

## PERFORMANCE & PRELOADER ("BOOT SEQUENCE" + AUDIO GATE)

The `<BootSequence />` component serves two purposes:
1. Thematic entry animation (the user "logs in" to the lab).
2. User interaction gate that unlocks Web Audio API (browsers block autoplay).

### Implementation:
- Full-viewport `position: fixed` overlay, `z-index: 60`, `bg-abyss`.

### Background (System Powering On):
The BootSequence is NOT a flat black screen. It has two background layers that create the sensation of hardware initializing — a dormant system receiving power for the first time.

**Layer 1 — Dot Grid (the circuitry waking up):**
- CSS `radial-gradient` dot pattern (same technique as Services PerspectiveGrid): 1px dots, spaced 40px apart, `text-bone` at `opacity: 0.02` — barely visible at first.
- **Power-on sequence:** As the typing animation progresses, the grid opacity rises in sync:
  - `[ SYSTEM BOOT ]` → grid at `opacity: 0.02` (near invisible).
  - `SCANNING MUTATION DATABASE` → grid at `opacity: 0.03`.
  - `LOADING VECTORS` → grid at `opacity: 0.04`.
  - `[██████████████] 100%` → grid at `opacity: 0.05`.
  - `[ ENVIRONMENT READY ]` → a single radial pulse radiates outward from the center of the grid (a radial gradient of `text-bone` that scales from `0%` to `150%` viewport size over 800ms at `opacity: 0.03`, then fades). The system has fully powered on.
- On `[ ENTER LAB ]` click: grid does NOT disappear with the CRT snap — it persists underneath and transitions seamlessly into the site's global texture. This creates continuity: the grid was always there, the BootSequence just revealed it.

**Layer 2 — Static Noise (signal searching):**
- The global noise grain overlay but at `opacity: 0.08` (2× normal) with a CSS animation that shifts the `background-position` rapidly (`0 0` → `100px 100px` in 200ms, `steps(4)` timing). This creates visible crawling static — like a CRT searching for a signal.
- **Signal lock:** When the typing reaches `[ ENVIRONMENT READY ]`, the static animation smoothly decelerates over 600ms (ease-out) and the opacity drops from `0.08` to `0.04` (the global baseline). The signal has been found — the static calms into the normal grain. This transition should feel like tuning an analog TV: chaotic → locked → clean.
- On `[ ENTER LAB ]` click: noise is already at its baseline level, so the CRT snap just removes the BootSequence overlay. The `<TextureOverlay />` behind it is already running at the same `0.04` — seamless handoff, no visual jump.

**Layer interaction:** The dot grid sits behind the static noise. The noise partially obscures the grid, so the dots feel like they're emerging through interference. As the static calms, the grid becomes slightly more legible. The combined effect: dark → static haze → dots emerge through the noise → system stabilizes → signal lock → ready.

**Layer 3 — [K_O] Watermark (subliminal brand):**
- The `[K_O]` symbol PNG (white version), `position: absolute`, centered both axes, `height: ~80px`, `opacity: 0.04`. `z-index: 0` (behind everything, including the dot grid).
- Static — no animation during the boot sequence. It's a ghost: the brand exists before the system even finishes loading.
- Fades to `opacity: 0` during the CRT snap exit (with the rest of the overlay).
- Most users won't consciously see it. That's the point — it's an imprint, not a logo placement.
- `{/* ASSET: LOGO_KO_WHITE | Same asset as defined in Brand Assets */}`

### Text Overlay:
- JetBrains Mono text types out character-by-character (40ms per character):
  ```
  [ SYSTEM BOOT ] ...
  SCANNING MUTATION DATABASE ...
  LOADING VECTORS ...
  [██████████████████████] 100%
  [ ENVIRONMENT READY ]
  ```
- Text color: `text-bone`. The final line `[ ENVIRONMENT READY ]` flashes in `system-green` — this is one of only two places green appears on the entire site (the other is the Footer status dot). This creates a narrative callback: "the system that boots green is the same system that reports operational at the end."
- After typing completes (or after a 4s maximum), display a pulsing element: `[ ENTER LAB ]` (blinking `accent-infrared` border, 1s interval).
- **On click:**
  1. Call `audioEngine.unlock()` — creates `AudioContext`, begins loading sound assets.
  2. Animate overlay: `scaleY(1) → scaleY(0)` with `snapEase` (400ms), `transform-origin: top`, simulating CRT turning off.
  3. Set global `loaded` state to `true`.
  4. Start `bg_drone` playback (low volume, faded in over 2s).
  5. Unmount `<BootSequence />`.
- While BootSequence is visible, main page renders underneath with `visibility: hidden` and `overflow: hidden` on `<body>`.

### Video Optimization:
- ALL `<video>` tags MUST include `preload="none"` (except Hero background).
- Implement lazy loading with Intersection Observer — videos only call `.play()` when entering the viewport and `.pause()` when exiting.

---

## GLOBAL CURSOR ("Smart Cell")

- Hide default cursor: `cursor: none` on `<html>`.
- **Base State:** A `w-3 h-3` (12×12px) circle. Background: `accent-infrared` (`#FF2A00`). `mix-blend-mode: exclusion`. Positioned with Framer Motion `useSpring` (`springConfig`). `pointer-events: none` always.

**Color behavior with `exclusion` blend mode:**
On the dominant `bg-abyss` (#050505) background, the cursor will appear as its near-original Infrared Red — this is correct and intended. When the cursor passes over `text-bone` (#F0F0F0) text, it will invert to a dark teal/cyan — this creates a satisfying visual "bite" where the cursor eats through the text. When over the `accent-infrared` service cards (hover state), the cursor becomes near-black (invisible) — so during card hovers, switch the cursor to `text-bone` with a border instead. This is handled by the context states below.

- **Context States** (Framer Motion `layout` animation, smooth size transitions):
  | Context | Size | Visual | Color Override |
  |---|---|---|---|
  | Default | 12×12px | Solid red dot | `accent-infrared` (default) |
  | Hovering link / button | 48×48px | 1px `text-bone` border ring, label inside | `text-bone` border, no fill |
  | Hovering Works row | 64×64px | Magnetic (pulled toward row center), label `VIEW ↗` | `text-bone` border + label |
  | Hovering CTA | 64×64px | Label `SCHEDULE_CALL` | `text-bone` border + label |
  | Hovering ID Card video | 48×48px | Label `[ REC ]` | `accent-infrared` border, pulsing |
  | Hovering Service Card (red bg) | 48×48px | 1px `bg-abyss` border, no label | `bg-abyss` border (so it's visible on red) |

**IMPORTANT:** When the cursor expands to show a label, disable `mix-blend-mode: exclusion` and switch to `mix-blend-mode: normal`. Exclusion on complex states makes text unreadable. Only the 12×12px default dot uses exclusion.

---

# ARCHITECTURE & SECTIONS

## HUD (FIXED NAVIGATION)
- `position: fixed`, `z-index: 50`. Elements pinned to 4 corners (`gutter` padding).
- **Top-Left:** `orko_` logo as **PNG image** (white, 24px height). Hover: PNG glitches to text-rendered scramble and back — see **Brand Assets → Logo Behavior** for full animation. Sound: `glitch_burst`. Falls back to JetBrains Mono weight 700 text if image fails.
- **Top-Right:** Nav links (`flex-row`, `gap-6`). Links and their scroll targets:
  - `[ WORK ]` → scrolls to **Works** section (Section 04)
  - `[ LAB ]` → scrolls to **Services** section (Section 03, "Mutation Vectors")
  - `[ INTEL ]` → scrolls to **Bio** section (Section 02, "The Operator")
  - Hover: A 1px `accent-infrared` line strikes through the text (`text-decoration: line-through`, animated width 0→100% in `microDuration`).
  - Click: Lenis `scrollTo` to corresponding section with `macroDuration` duration.
- **Bottom-Left:** `[K_O]` symbol rendered as **text** in JetBrains Mono, `text-bone`, opacity 0.4 — see **Brand Assets** for rationale. The brackets are part of the logo mark, not added formatting.
- **Bottom-Right:** Live clock `BUE [HH:MM:SS]` (Buenos Aires timezone, `Intl.DateTimeFormat`) and language toggle `LANG: [EN]` / `LANG: [ES]`. JetBrains Mono, opacity 0.4. Click on `[EN]`/`[ES]` toggles language — see **Language System** section for full behavior. The toggle is a `<button>`, not a link.

### Mobile HUD (<768px):
- Top-Left: `orko_` PNG logo (white, ~20px height).
- Top-Right: Hamburger icon (3 lines, 1px `text-bone`). Opens a full-screen overlay menu with `orko_` PNG (white, ~48px, centered top) + nav links stacked vertically.
- Bottom elements hidden.

---

## SECTION 01: HERO ("THE LAB")
- **Layout:** `100vw × 100vh`, `position: relative`, `overflow: hidden`.

### Background Video (Dual-Source):
Implement a `<video>` element with responsive source selection:
- Desktop (`min-width: 768px`): `{/* ASSET: HERO_VID_DESKTOP | REPLACE_WITH: 16:9 .webm | Max 4MB */}`
- Mobile (`max-width: 767px`): `{/* ASSET: HERO_VID_MOBILE | REPLACE_WITH: 9:16 vertical .webm | Max 1MB */}`
- Properties: `autoplay`, `muted`, `loop`, `playsInline`, `object-fit: cover`, `w-full h-full`.

### Data Nodes:
3 small UI rectangles floating around the center area (top-right zone, bottom-left zone, mid-right zone):
- `backdrop-filter: blur(12px)`, `border: 1px solid rgba(240,240,240,0.2)`, `padding: 12px 16px`.
- Content (JetBrains Mono, 11px): `STATUS: MUTATING`, `SEQ_ID: 0092`, `VECTOR: ACTIVE`.
- Subtle Framer Motion float animation: `translateY` oscillates ±8px, duration 4s, infinite.
- **SVG Lines:** Connect each node to the exact center of the viewport using dynamic `<line>` elements inside an absolutely positioned SVG. Lines: 1px, `rgba(240,240,240,0.15)`.

### Spores (Canvas Layer):
- `<canvas>` element, `position: absolute`, `inset: 0`, `pointer-events: none`.
- 50 particles, each 1–2px. Color: `rgba(240,240,240,0.3)`. Random initial positions and slow drift velocities.
- **Desktop hover:** On `mousemove`, particles within 120px radius of cursor are repelled (inverse-square spring force) and flash `accent-infrared` for 300ms.
- **Mobile touch:** On `touchstart`, ripple repulsion from tap coordinates. Particles flash `accent-infrared`.

### Copy:
- `position: absolute`, `bottom: 10vh`, `left: gutter`. Max-width: 60% (desktop), 90% (mobile).
- **H1:** "INCUBATING DIGITAL SPECIES." — Unbounded, massive (`clamp(2.5rem, 7vw, 5.5rem)`), stacked lines.
- **Sub:** "We synthesize living identities and high-performance interfaces designed for aggressive survival." — JetBrains Mono, `text-bone` at opacity 0.6, max-width 500px.

### Terminal Ticker ("Active Mutations"):
Positioned below the Sub copy, `margin-top: 24px`. A single-line terminal readout that cycles through active deliverables/capabilities:
- JetBrains Mono, 13px, `accent-infrared`, opacity 0.8.
- Format: `> DEPLOYING: ` followed by cycling text.
- **Cycle sequence** (each item types in character-by-character at 30ms/char, holds for 2.5s, then erases character-by-character at 15ms/char before the next one types in):
  ```
  > DEPLOYING: BRAND SYSTEMS_
  > DEPLOYING: INTELLIGENT INTERFACES_
  > DEPLOYING: AUTONOMOUS PLATFORMS_
  > DEPLOYING: VISUAL IDENTITIES_
  > DEPLOYING: AI-DRIVEN WORKFLOWS_
  > DEPLOYING: IMMERSIVE EXPERIENCES_
  ```
- The trailing `_` blinks at 500ms interval (CSS `animation: blink 1s step-end infinite`).
- Loop is infinite. Each full cycle takes ~30s.
- On mobile: same behavior, slightly smaller (11px).
- **Sound:** Each character typed plays a faint, rapid keystroke tick (reuse `hover_beep` at 10% volume, or skip if too noisy — test during Phase 3 review).

### Hero → Bio Scroll Transition (GSAP ScrollTrigger):
- The background video: `scale(1 → 0.85)`, `filter: blur(0 → 24px)`, `opacity(1 → 0)`.
- The Terminal Ticker stops mid-word and freezes (no exit animation — it just halts, as if the process was interrupted by a deeper system taking priority).
- **The Tube is born:** See **Tube System Phase 1**. The SVG path begins drawing from its origin point (y: 70vh), descending as a 1px stroke that widens to 6px as it enters the Bio segment. The first red liquid appears at the origin and begins flowing down.
- Copy fades out with standard Exit protocol.
- Data nodes drift outward and fade.
- Play `scroll_swoosh` when the transition crosses the 50% mark.

---

## SECTION 02: BIO ("THE OPERATOR")
- **Layout:** CSS Grid `grid-cols-12`, `min-h-screen`, `sectionPadding`.
- **Mobile:** Stacked single column. ID card first, then text.

### Left Column (`col-span-4`):

**The Tube Plasma — Bio Segment:**

This section houses the Tube's primary chamber — where the liquid is generated and pumped. See **"THE TUBE SYSTEM"** section for full anatomy. In Bio specifically:
- The main trunk runs along the left edge of the left column.
- The liquid FILLS here (Layer 1 rises from `translateY(100%)` → `translateY(0%)` as the user scrolls through Bio).
- All 5 liquid layers (Fill, Meniscus, Turbulence, Glow, Bubbles) are active in this segment.
- A horizontal **bleeder branch** extends from the trunk at the vertical midpoint of the ID Card, reaching ~60px toward the card. The bleeder has a faint glow, as if the liquid is feeding the operator's video signal. The ID Card's bracket-corner hover animation pulses slightly brighter when the liquid level reaches this bleeder.

**ID Card:**
- `w-64 h-80` container. Framer Motion float animation (subtle `rotate: ±2deg`, `translateY: ±6px`).
- Grayscale `<video>` inside, `object-fit: cover`:
  - `{/* ASSET: BIO_ID_VIDEO | REPLACE_WITH: URL to CCTV-style operator footage .webm */}`
- CSS `filter: grayscale(100%) contrast(1.1)`.
- Hover: Animated `[ ]` bracket corners frame the video (4 corner borders animate inward from edges, 200ms). Video glitches for 300ms (CSS `clip-path` rapid vertical slicing + `hue-rotate` flicker). Cursor shows `[ REC ]`.

### Right Column (`col-span-8`):
- **Eyebrow:** `[ THE_OPERATOR ]` — JetBrains Mono, `accent-infrared`, 11px, letter-spacing `0.2em`.
- **H2:** "CREATIVE SPECIMEN" — Unbounded, `clamp(2rem, 5vw, 4rem)`.
- **Body:** "I design mutations that bridge the gap between static brands and living organisms. From autonomous agents to immersive interfaces, my work lives at the bleeding edge of evolution." — JetBrains Mono, 16px, `line-height: 1.7`, `text-bone` at opacity 0.7.
- **Stats** (staggered entry, 0.1s per bar):
  ```
  RESEARCH       [████████████████████░░] 98%
  DEVELOPMENT    [███████████████████░░░] 95%
  ART DIRECTION  [██████████████████████] 100%
  AUTOMATION     [█████████████████░░░░░] 85%
  ```
  JetBrains Mono, 13px. The filled portion is `accent-infrared`, the empty portion is `line-ash`.

---

## SECTION 03: SERVICES ("MUTATION VECTORS")
- **Layout:** GSAP `ScrollTrigger.pin()`. Total scroll distance: `200vh`.
- **Mobile:** No pin. Cards stack vertically. Mini videos visible by default.

### Background — Perspective Grid:
- A 20×20 dot grid (CSS `radial-gradient` on a full-section div).
- On `mousemove`, apply CSS `transform: perspective(800px) rotateX(Xdeg) rotateY(Ydeg)` where X/Y are clamped to ±5° based on cursor offset from grid center.
- On mobile, apply a slow auto-rotation (`rotateX: 2deg → -2deg`, 8s loop).

### Left Panel (Sticky, 40% width):
- **Eyebrow:** `[ WHAT_WE_DO ]` — JetBrains Mono, `accent-infrared`, 11px.
- **H2:** "MUTATION VECTORS" — Unbounded, stacked.
- Fixed in place while right panel scrolls.

### Right Panel (Scrollable, 60% width):
4 massive cards stacked vertically with `gap: 2px`.

**Card Idle State:**
- `bg-abyss`, `border: 1px solid line-ash`, `padding: 40px`.
- Card number `01/` — `04/` top-right, JetBrains Mono, opacity 0.3.

**Card Hover State (Desktop):**
- Background fills `accent-infrared` (animated with `aggro` ease, 400ms).
- All text turns `bg-abyss` (black).
- Play `hover_beep`.
- A small 80×80px `<video>` loop appears in the top-right corner (fade + scale in):
  - `{/* ASSET: SRV_VID_1 | REPLACE_WITH: URL to abstract loop .webm */}`
  - `{/* ASSET: SRV_VID_2 | REPLACE_WITH: URL to abstract loop .webm */}`
  - `{/* ASSET: SRV_VID_3 | REPLACE_WITH: URL to abstract loop .webm */}`
  - `{/* ASSET: SRV_VID_4 | REPLACE_WITH: URL to abstract loop .webm */}`

**Card Content:**
1. **BRAND IDENTITY & ART DIRECTION** — "Constructing visual systems with strict rules. Reducing brand chaos into a singular, undeniable signal."
2. **STRATEGIC INSIGHTS & RESEARCH** — "Decoding the human variable. Deep qualitative investigation to uncover hidden patterns before code."
3. **DIGITAL ARCHITECTURE** — "Bespoke digital ecosystems. Zero templates. High-performance code designed for maximum immersion."
4. **AUTOMATIONS & AI SOLUTIONS** — "Replacing manual labor with autonomous logic."

---

## SECTION 04: WORKS ("DEPLOYED SYSTEMS")
- **Layout:** Full-width vertical list. Rows separated by `border-bottom: 1px solid line-ash`.

### Desktop Columns:
`CLIENT | TYPE | SECTOR | YEAR` — JetBrains Mono. Header row at 11px, opacity 0.4. Data rows at 16px.

### Mobile Columns (<768px):
Show only `CLIENT | YEAR`. On tap, row expands as an inline accordion revealing: client logo (if available, `height: 24px`, `opacity: 0.5`, above video), TYPE, SECTOR, video, and description copy.

### List Interaction (Desktop):
- Hovering a row: all OTHER rows dim to `opacity: 0.2` (Framer Motion, 200ms). Active row text turns `accent-infrared`.
- Cursor becomes magnetic 64px circle with `VIEW ↗`.
- **Floating Card:** A `45vw`-wide, `aspect-ratio: 16/9` card appears and follows cursor with Framer Motion spring (offset `+20px` both axes).
  - `will-change: transform` for GPU compositing.
  - `pointer-events: none` (card must NOT block mouse events on rows beneath).
  - Top 80%: The project `.webm` video recording.
  - Bottom 20%: Solid `bg-abyss` bar. Left side: client logo PNG (monochrome white, `height: 20px`, `opacity: 0.5` — omit if no asset provided) + client name (Unbounded, 14px). Right side: description copy (JetBrains Mono, 11px, opacity 0.6). See **Client Logos** section for assets.
  - Video plays on hover enter, pauses on hover leave.
  - **Card Exit (on mouse leaving row):** Card doesn't just disappear. It scales down `scale(1 → 0.9)`, `opacity(1 → 0)`, `filter: blur(0 → 8px)` over 250ms with `heroEase`. Feels like the specimen retreating back into cold storage.
- **Click:** Routes to `href="#"` (placeholder for future case study pages).

### Project Data:
```
1. HAPPENER | Brand Identity & Platform Design | Events | 2024
   Video: {/* ASSET: WORK_VID_1 | REPLACE_WITH: .webm Project Screen Recording */}
   Copy: "Autonomous Event Infrastructure. Engineered a robust, operator-independent ecosystem for the Dubai event market."

2. XII IMMIGRATIONS | Branding & Intelligent Interface | Legal Tech | 2024
   Video: {/* ASSET: WORK_VID_2 | REPLACE_WITH: .webm Project Screen Recording */}
   Copy: "Biometric Lead Qualification. Integrated AI-driven logic to score applicant profiles in real-time."

3. LEGENDARY NAMES | Art Concept & Visual Identity | Domains | 2025
   Video: {/* ASSET: WORK_VID_3 | REPLACE_WITH: .webm Project Screen Recording */}
   Copy: "The Infinite Possibility Engine. A generative visual system where typography mutates to represent endless naming assets."

4. CAROLA ZECH | Digital Archiving | Art | 2023
   Video: {/* ASSET: WORK_VID_4 | REPLACE_WITH: .webm Project Screen Recording */}
   Copy: "Structural Heritage Navigation. Digitizing 30 years of sculptural mastery into a non-linear archive."

5. ACAU | Industrial Visibility Systems | Mining & Agro-Tech | 2025
   Video: {/* ASSET: WORK_VID_5 | REPLACE_WITH: .webm Project Screen Recording */}
   Copy: "High-Contrast Industrial UI. Designed for the harsh environments of mining and agro-tech."

6. RODRIGO AGÜERO Z | Experimental Curation | Photography | 2024
   Video: {/* ASSET: WORK_VID_6 | REPLACE_WITH: .webm Project Screen Recording */}
   Copy: "Isolate Display Environments. A portfolio behaving as a gallery of distinct architectural rooms."

7. AGUSTINA MISTRETTA | Autonomous Art Commerce | Fine Art | 2024
   Video: {/* ASSET: WORK_VID_7 | REPLACE_WITH: .webm Project Screen Recording */}
   Copy: "Self-Governing Gallery System. Decentralized sales infrastructure for the Aspen market."

8. REJUS | Institutional Activation | Justice | 2023
   Video: {/* ASSET: WORK_VID_8 | REPLACE_WITH: .webm Project Screen Recording */}
   Copy: "Justice Network Visualization. Injecting modern visual semantics into judicial structures."
```

---

## SECTION 05: FOOTER ("SYSTEM SHUTDOWN")
- **Layout:** `bg-abyss`, `sectionPadding`. Top half: 3-column data grid. Bottom half: Massive CTA.

### Top Half (Grid, 3 columns / stacked on mobile):
- **Col 1 — Links & Contact:**
  - Social links: `LINKEDIN ↗`, `INSTAGRAM ↗`, `GITHUB ↗`. JetBrains Mono, 14px. Hover: `accent-infrared` + `hover_beep`. Each opens in new tab.
  - **Email (Copy-to-Clipboard):**
    - Display: `COPY EMAIL [↗]` — JetBrains Mono, 14px, same style as social links.
    - `{/* ASSET: CONTACT_EMAIL | REPLACE_WITH: professional email address (e.g. hello@orko.design) */}`
    - **Click behavior:** Copies the email address to clipboard using `navigator.clipboard.writeText()`. No `mailto:`.
    - **Feedback on click:** Text instantly scrambles (150ms) then resolves to `[ COPIED ]` in `accent-infrared`. After 2s, reverts to `COPY EMAIL [↗]`. Play `hover_beep`.
    - **Fallback:** If `navigator.clipboard` is unavailable (older browsers, non-HTTPS), use the legacy `document.execCommand('copy')` method with a hidden `<textarea>`.
- **Col 2 — Location:** `BUENOS AIRES, AR` / `LAT: -34.6037` / `LON: -58.3816`. JetBrains Mono, 14px, opacity 0.4.
- **Col 3 — Brand & Status:**
  - `orko_` PNG logo (white, ~32px height, `opacity: 0.6` → `1.0` on section enter). See **Brand Assets**.
  - `© 2026 orko_` — JetBrains Mono, 14px, opacity 0.4. Below the logo.
  - `ALL SYSTEMS OPERATIONAL` with a pulsing `system-green` SVG circle (8px, CSS animation `pulse`: scale 1→1.3→1, opacity 1→0.5→1, 2s infinite).

### Bottom Half — CTA:
- Text: **"START MUTATION"** — Unbounded, `clamp(3rem, 10vw, 8rem)`, filling width.
- **Hover:** Text fills with solid `accent-infrared` from bottom to top. Implement with `background: linear-gradient(to top, #FF2A00 var(--fill), transparent var(--fill))` + `background-clip: text` + `color: transparent`. On hover, CSS transition `--fill` from `0%` to `100%` over 600ms with `aggro` ease.
- Cursor becomes `[ SCHEDULE_CALL ]`.
- **Click:** Opens Calendly link (`{/* ASSET: CALENDLY_URL | REPLACE_WITH: Calendly scheduling link */}`).
- **Post-Click Feedback:** On click, before the Calendly opens:
  1. The "START MUTATION" text does a fast full-scramble (200ms of random characters).
  2. Text resolves to `[ MUTATION INITIATED ]` in `accent-infrared`.
  3. A full-screen flash of `accent-infrared` at `opacity: 0.03` pulses once (100ms).
  4. Then the external link opens. Text reverts to "START MUTATION" after 2s.

---

## MOBILE ART DIRECTION & TOUCH INTERACTIONS

### Touch-Reactive Spores:
Bind spore Canvas logic to `touchstart`. On tap anywhere: particles within 150px radius flee from tap coordinates (ripple force) and flash `accent-infrared` for 300ms.

### The Lab Easter Egg:
Tapping directly on the center Hero video triggers:
- Violent CSS glitch (RGB split via `text-shadow` offsets on an overlay, extreme contrast `filter: contrast(3) invert(1)`, 400ms).
- Plays `heartbeat_thud` audio.
- Only fires once per session (flag it).

### Mobile Layout Summary:
| Element | Mobile Behavior |
|---|---|
| HUD | Logo + hamburger only. No clock/symbol. |
| Grid | All sections: single column, stacked. |
| Typography | H1: `clamp(2rem, 8vw, 4rem)`. Body: `0.875rem`. |
| Services | No pin. Cards stack vertically. Videos visible inline. |
| Works | CLIENT + YEAR columns only. Tap → accordion with video + copy. |
| Floating Card | Disabled. |
| Echo System | Active. Heartbeat pulse fires on mobile. |
| Tube System | Entirely hidden on mobile (`display: none`). The organic feel comes from Echo heartbeat, touch spores, and per-section textures instead. |

---

## ACCESSIBILITY BASELINE

### `prefers-reduced-motion: reduce`
- **Disable:** Spore particles, text scramble, glitch effects, Echo pulse, Tube plasma animation, floating card follow.
- **Replace:** Spring animations with `duration: 0` (instant state changes).
- **Keep:** Opacity transitions for scroll reveals (`opacity: 0 → 1` only, no transforms).
- **Audio:** Mute `bg_drone` by default. Keep UI click sounds at 50% volume.

### Keyboard Navigation:
- Works rows: `tabIndex={0}`. `Enter` or `Space` activates the link.
- HUD nav links: visible focus ring (1px `accent-infrared` outline, `outline-offset: 4px`).
- Skip-to-content link: visually hidden, visible on `:focus`.

### Screen Readers:
- BootSequence: `role="status"`, `aria-live="polite"` for typing text.
- `aria-label` on icon-only elements (logo, clock, `[K_O]`).
- Works section: semantic `<table>` with proper `<th scope="col">` headers.

---

## COMPONENT ARCHITECTURE

```
app/
├── layout.tsx              # Server. <html>, Google Fonts (Unbounded + JetBrains Mono),
│                           #   metadata, <Providers>, <TextureOverlay>.
├── page.tsx                # Server. Composes all section components in order.
├── providers.tsx            # Client. <LenisProvider>, <CursorProvider>,
│                           #   <AudioProvider>, <LanguageProvider>, <GlitchEngine>.
│                           #   Wraps {children}.
│
components/
├── BootSequence.tsx         # Client. Preloader + audio gate.
├── HUD.tsx                  # Client. Fixed nav, clock, logo scramble.
├── SmartCellCursor.tsx      # Client. Framer Motion useSpring cursor.
├── TextureOverlay.tsx       # Client. Fixed noise + scanlines overlay.
├── TerminalTicker.tsx       # Client. Hero cycling text ("DEPLOYING: ...").
├── TubeSystem.tsx           # Client. Full-page SVG circulatory system.
│                           #   Main trunk path (Hero→Bio→Services→exit).
│                           #   Bleeder branches to ID Card + Service cards.
│                           #   Liquid fill via stroke-dashoffset + GSAP ScrollTrigger.
│                           #   Exits off left edge during Services.
├── sections/
│   ├── Hero.tsx             # Client. Video, SporeCanvas, DataNodes, SVG lines,
│   │                       #   copy, TerminalTicker.
│   ├── Bio.tsx              # Client. Grid layout, TubePlasma, IDCard, stats.
│   │                       #   CCTV vignette texture.
│   ├── Services.tsx         # Client. GSAP pinned scroll, cards, PerspectiveGrid.
│   │                       #   EM interference texture.
│   ├── Works.tsx            # Client. Archive list, FloatingCard, row interactions.
│   │                       #   Photocopy grain texture.
│   └── Footer.tsx           # Client. CTA with post-click feedback, social links,
│                           #   CopyEmail, status. Signal degradation texture.
├── EchoSystem.tsx           # Client. createPortal to body. GSAP heartbeat pulse.
│
lib/
├── audioEngine.ts           # Howler.js singleton. .unlock(), .play(id), .mute().
├── useScrollProgress.ts     # Custom hook wrapping GSAP ScrollTrigger.
├── useMousePosition.ts      # Shared mouse/touch position tracking.
├── useGlitchEngine.ts       # Ambient micro-glitch system. Targets [data-glitchable].
├── useTypeCorruption.ts     # Type corruption micro-events. Targets [data-corruptible].
├── textScramble.ts          # Utility: scramble text through random chars → resolve.
├── constants.ts             # All design tokens + color rules exported as JS constants.
├── i18n.ts                  # Dictionary object { key: { en, es } }. t(key) helper.
│                           #   Full translation table for all UI and content strings.
```

Every component in `components/` is a Client Component (`"use client"`).

---

## AGENTIC SKILLS (Claude Code Plugins)

Three skills are installed and MUST be used at their designated trigger points. They activate automatically when relevant, but this section makes the triggers explicit for this project.

### Superpowers (`obra/superpowers`)
- **`/superpowers:brainstorm`** → Use BEFORE writing any code. Refines the design through questions, explores alternatives, validates approach. For this project: trigger at the START of Phase 1 to brainstorm architecture decisions informed by the reference HTML files.
- **`/superpowers:write-plan`** → Creates implementation plan with exact file paths, code, and verification steps. Trigger at the START of each phase to break it into bite-sized tasks.
- **`/superpowers:execute-plan`** → Executes plan in batches with review checkpoints. Use for all implementation work.

### GSD (`gsd-build/get-shit-done`)
- **`/gsd:new-project`** → Initialize at project start (once, before Phase 1).
- **`/gsd:plan-phase`** → Run at the start of each phase to register it in the GSD tracker.
- **`/gsd:execute-phase`** → Run to execute the current phase's tasks.
- Context window monitor and update-check hooks are active — respect them.

### UI/UX Pro Max (`nextlevelbuilder/ui-ux-pro-max-skill`)
- **Trigger:** At every Review Gate (end of each phase), run a UI/UX audit on the current build.
- Assess: visual consistency with design tokens, animation quality, responsiveness, interaction polish, accessibility.
- Flag any element that feels "generic" or disconnected from the Biological Brutalism concept.

### Workflow Per Phase
```
1. /gsd:plan-phase → Register phase in GSD
2. /superpowers:brainstorm → Discuss approach (Phase 1 only: also analyze HTML refs)
3. /superpowers:write-plan → Break phase into tasks
4. /superpowers:execute-plan → Build
5. UI/UX Pro Max audit → Quality gate
6. STOP → Present to human for review
7. Human approves → Next phase
```

---

## EXECUTION PHASES (Review-Driven Iteration)

**Do NOT generate the entire site in one pass.** Execute phase by phase. Use the Agentic Skills workflow above for each phase. After each phase, STOP and present the result for human review.

### PHASE 1 — SCAFFOLD
**Skills:** `/gsd:plan-phase "Phase 1 Scaffold"` → `/superpowers:brainstorm` (read ALL HTML reference files, extract design DNA, discuss architecture) → `/superpowers:write-plan` → `/superpowers:execute-plan`.
**Build:** Initialize Next.js 14+ (App Router, TypeScript). Install dependencies: `tailwindcss`, `framer-motion`, `gsap`, `@studio-freight/lenis`, `howler`. Build: `layout.tsx`, `page.tsx`, `providers.tsx` (including `<LanguageProvider>`), `tailwind.config.ts`, `TextureOverlay.tsx`, Google Font imports, global CSS (`cursor: none`, scrollbar styling), `constants.ts`, `i18n.ts` (full dictionary with all EN/ES translations).
**UI/UX Audit Gate:** Does the empty black page with noise grain and scanlines feel clinical and dark? Does the smooth scroll feel right? Does `i18n.ts` contain all translation keys from the spec?
**Human Review Gate:** Present build. Wait for approval before Phase 2.

### PHASE 2 — ENTRY
**Skills:** `/gsd:plan-phase "Phase 2 Entry"` → `/superpowers:write-plan` → `/superpowers:execute-plan`.
**Build:** `BootSequence.tsx` (with dot grid + static noise background layers, [K_O] watermark), `HUD.tsx` (PNG logo with glitch-to-text hover, `LANG: [EN/ES]` toggle), `SmartCellCursor.tsx`, `audioEngine.ts` (structure only, placeholder URLs).
**UI/UX Audit Gate:** Does the boot sequence → CRT snap → site reveal feel like accessing a restricted system? Does the cursor feel alive? Does toggling language scramble ALL visible text simultaneously before resolving? Do the BootSequence background layers (grid powering on + static calming) feel like hardware initializing?
**Human Review Gate:** Present build. Wait for approval.

### PHASE 3 — HERO
**Skills:** `/gsd:plan-phase "Phase 3 Hero"` → `/superpowers:write-plan` → `/superpowers:execute-plan`.
**Build:** `Hero.tsx` (responsive video, Canvas spores, DataNodes with SVG lines, copy, H1 scramble-in animation), `TerminalTicker.tsx` (cycling "DEPLOYING:" text).
**UI/UX Audit Gate:** Is the "mutation laboratory" atmosphere established? Do spores react naturally to the mouse? Do data nodes feel like monitoring instruments? Does the Terminal Ticker communicate what we do without being heavy-handed?
**Human Review Gate:** Present build. Wait for approval.

### PHASE 4 — NARRATIVE & CIRCULATORY SYSTEM
**Skills:** `/gsd:plan-phase "Phase 4 Narrative"` → `/superpowers:brainstorm` (the Tube SVG path is complex — brainstorm the exact Bézier curve coordinates and scroll mapping before coding) → `/superpowers:write-plan` → `/superpowers:execute-plan`.
**Build:** `Bio.tsx` (grid, IDCard with glitch hover, stats bars), `TubeSystem.tsx` (SVG anatomy: main trunk with S-curve from Hero through Bio into Services exit, ID Card bleeder branch, liquid layers via stroke-dashoffset, scroll-driven fill with scrub: 0.8), `EchoSystem.tsx`. Wire Hero → Bio transition including Tube genesis.
**UI/UX Audit Gate:** Does scrolling past the hero feel like descending deeper into the lab? Does the Tube liquid feel viscous and heavy (not like a progress bar)? Does the S-curve make it feel organic? Does the meniscus wobble at the liquid edge? Does the glow escalation tint the Bio section red as the tube fills? Does the heartbeat pulse register subconsciously?
**Human Review Gate:** Present build. Wait for approval.

### PHASE 5 — SYSTEMS
**Skills:** `/gsd:plan-phase "Phase 5 Systems"` → `/superpowers:write-plan` → `/superpowers:execute-plan`.
**Build:** `Services.tsx` (GSAP pin, 4 cards with hover fill, PerspectiveGrid, mini videos). Wire Tube System: liquid rush from Bio into Services, single bleeder branch to card stack, bleeder pulse on card hover, tube exit curve off left edge during Services scroll.
**UI/UX Audit Gate:** Do service cards feel aggressive on hover (red flood, black text inversion)? Does the pinned scroll feel intentional? Does the grid warp subtly? Does the Tube's exit feel graceful — like a vein leaving the body, not like someone forgot to extend it?
**Human Review Gate:** Present build. Wait for approval.

### PHASE 6 — ARCHIVE
**Skills:** `/gsd:plan-phase "Phase 6 Archive"` → `/superpowers:write-plan` → `/superpowers:execute-plan`.
**Build:** `Works.tsx` (table layout, row hover dimming, FloatingCard with spring-follow and exit animation, client logos in card footer, inline accordion for mobile). No Tube in this section — verify that the `accent-infrared` on hover feels like a residual echo of the circulatory system, not a disconnected color choice.
**UI/UX Audit Gate:** Does hovering the list feel like browsing classified files? Is the floating card performant at 60fps? Do other rows dim convincingly? Does the red hover color feel connected to the organism even without the Tube visible?
**Human Review Gate:** Present build. Wait for approval.

### PHASE 7 — CLOSURE, CORRUPTION & POLISH
**Skills:** `/gsd:plan-phase "Phase 7 Polish"` → `/superpowers:write-plan` (this is the largest phase — plan carefully, split into sub-batches) → `/superpowers:execute-plan`.
**Build:**
- `Footer.tsx` (CTA liquid fill with post-click scramble feedback, social links, copy-to-clipboard email with `[ COPIED ]`/`[ COPIADO ]` feedback, `orko_` PNG logo, status with `system-green` dot).
- Full audio integration (wire all `audioEngine.play()` calls across all components).
- Mobile touch events (spore tap, easter egg).
- Section enter/exit animations across all sections.
- **Section bridge transitions** (Bio→Services grid fade-in, Services→Works card compression + header typing, Works→Footer border morph + terminal typing).
- **Organic imperfection systems:** `useGlitchEngine.ts` (ambient micro-glitches on `[data-glitchable]` elements), `useTypeCorruption.ts` (character corruption on `[data-corruptible]` text). Add `data-glitchable` and `data-corruptible` attributes to appropriate elements in all sections.
- **Per-section atmospheric textures:** CCTV vignette (Bio), EM interference (Services), Photocopy grain (Works), Signal degradation (Footer).
- **Organic border imperfections:** Breathing card borders, worn row separators, dashed data node borders, micro-fractured Tube glass.
- `prefers-reduced-motion` handling for all systems.
- Verify `system-green` color isolation (Footer + BootSequence only, 200px+ from any red element).
**UI/UX Audit Gate (FULL):** Run comprehensive UI/UX Pro Max audit on entire site. Flag everything that feels generic, disconnected from the concept, or underperforming.
**Human Review Gate:** Full end-to-end experience review. Does the site feel like one continuous organism, not stitched sections? Do the micro-glitches and type corruptions register subconsciously without being distracting? Does the audio layer add tension without being annoying? Do the section transitions feel like narrative handoffs? Does mobile feel intentional, not broken? Is the green/red separation clean?

---

## METADATA, SEO & TECHNICAL BASELINE

### Head / Metadata (in `layout.tsx`)
```
Title: "orko_ — Digital Mutation Laboratory"
Description: "We incubate living identities and high-performance interfaces. Brand systems, intelligent platforms, and autonomous digital organisms."
OG Image: {/* ASSET: OG_IMAGE | REPLACE_WITH: 1200x630 .png social share card — dark, branded */}
Favicon: {/* ASSET: FAVICON | REPLACE_WITH: .ico or .svg — [K_O] mark in infrared red on black */}
Theme color: #050505
```
- Add `<meta name="theme-color" content="#050505">` for mobile browser chrome.
- Canonical URL, OpenGraph, and Twitter Card meta tags.

### Browser Support
- **Target:** Last 2 versions of Chrome, Firefox, Safari, Edge. iOS Safari 16+.
- **Graceful degradation:** If `backdrop-filter` is unsupported, Data Nodes fall back to solid `bg-abyss` at `opacity: 0.9` (no blur). If `mix-blend-mode` is unsupported, cursor operates without blend mode.
- **No IE support.** No polyfills for dead browsers.

### Code Splitting & Performance
- Use Next.js `dynamic()` imports for heavy sections below the fold:
  - `Services.tsx`, `Works.tsx`, `Footer.tsx` → `dynamic(() => import(...), { ssr: false })`.
  - `TubeSystem.tsx` → dynamic import, SSR disabled (SVG + GSAP is client-only).
- Hero, HUD, and BootSequence load eagerly (above-the-fold critical path).
- GSAP and Howler.js: import only in client components, never in server components.
- Target: First Contentful Paint < 1.5s. Total JS bundle < 300KB gzipped.

### Contact & Links
- **Email:** `{/* ASSET: CONTACT_EMAIL | REPLACE_WITH: professional email address (e.g. hello@orko.design) */}` — displayed in Footer as copy-to-clipboard, NOT mailto.
- **Social links (Footer):**
  - `{/* ASSET: LINKEDIN_URL | REPLACE_WITH: LinkedIn profile URL */}`
  - `{/* ASSET: INSTAGRAM_URL | REPLACE_WITH: Instagram profile URL */}`
  - `{/* ASSET: GITHUB_URL | REPLACE_WITH: GitHub profile URL */}`

### Reverse Scroll (Global Rule)
When the user scrolls **back up**, all animations reverse organically:
- Section transitions: EXIT animations play in reverse (elements recompose — blur clears, scale restores, opacity fades back in). The ENTER state is restored.
- The Tube liquid recedes (see Tube System → Reverse Scroll Behavior).
- The Echo heartbeat continues firing on upward scroll too — it's tied to distance, not direction.
- Terminal Ticker in Hero resumes from where it froze (if scrolling back to Hero).
- GSAP `scrub` handles most of this automatically. Verify that no animation has `once: true` unless explicitly intended (like the Easter Egg).

---

## FINAL RULES

1. Preserve ALL `{/* ASSET: ... */}` placeholder comments exactly as written so assets can be injected later.
2. Do not hallucinate content — use only the copy, data, and structure specified in this document.
3. When making any creative micro-decision not explicitly covered here, ask: "Would this feel at home in a dystopian xenobiology lab?" If no, choose differently.
4. Performance budget: Lighthouse Performance score must remain above 80 on desktop. Lazy-load everything that isn't above the fold.
5. Every animation must have a purpose. If it doesn't reinforce the "living organism" metaphor, remove it.
6. The organic imperfection systems (micro-glitches, type corruption, per-section textures, breathing borders) are what separate this site from every other dark portfolio. Do NOT skip them or implement them as afterthoughts. They are as important as the layout.
7. ALL user-facing text MUST use the `t(key)` helper from `LanguageProvider` — never hardcode English strings directly in JSX. The only exceptions are items listed in the "What does NOT translate" list (brand name, coordinates, client names, technical labels).