/**
 * orko_ — Root Page
 *
 * Architecture:
 *   GLOBAL FIXED LAYERS (persist across all sections):
 *     GlobalVideo   — z:0  — mutant-tank, reacts to scroll position
 *     GlobalSpores  — z:2  — particle canvas, behavior changes per section
 *     TextureOverlay— z:99 — noise grain + scanlines
 *     SmartCellCursor— z:200
 *     HUD           — z:40
 *     EchoSystem    — z:5
 *     BootSequence  — z:50
 *
 *   SCROLLING SECTIONS:
 *     Hero      — foreground content only (transparent bg, video shows through)
 *     Interlude — typographic transition (text materializes line by line)
 *     Bio       — the operator (transparent bg, video echo visible)
 *     Services  — mutation vectors
 *     Works     — case files
 *     Footer    — system shutdown
 */

import { SmartCellCursor } from '@/components/SmartCellCursor';
import { HUD } from '@/components/HUD';
import { BootSequence } from '@/components/BootSequence';
import { TextureOverlay } from '@/components/TextureOverlay';
import { GlobalVideo } from '@/components/GlobalVideo';
import { GlobalSpores } from '@/components/GlobalSpores';
import { Hero } from '@/components/Hero';
import { Interlude } from '@/components/Interlude';
import { Bio } from '@/components/Bio';
import { Services } from '@/components/Services';
import { Works } from '@/components/Works';
import { Footer } from '@/components/Footer';
import { GlitchController } from '@/components/GlitchController';
import { EchoSystem } from '@/components/EchoSystem';
import { SectionDivider } from '@/components/SectionDivider';
import { TickerSection } from '@/components/TickerSection';

export default function Home() {
  return (
    <main id="main-content" suppressHydrationWarning>
      {/* ═══ GLOBAL FIXED LAYERS ═══ */}
      <GlobalVideo />
      <GlobalSpores />
      <TextureOverlay />
      <SmartCellCursor />
      <HUD />
      <EchoSystem />
      <BootSequence />

      {/* ═══ SCROLLING SECTIONS ═══ */}

      {/* Hero — transparent bg, video shows through */}
      <Hero />

      {/* Interlude — personal statement materializes */}
      <Interlude />

      <TickerSection />

      {/* Bio — The Operator */}
      <Bio />

      <SectionDivider height="8vh" showLine />

      {/* Services — Mutation Vectors */}
      <Services />

      <SectionDivider height="15vh" showLine />

      {/* Works — Case Files */}
      <Works />

      <SectionDivider height="8vh" showLine={false} />

      {/* Footer — System Shutdown */}
      <Footer />
      <GlitchController />
    </main>
  );
}