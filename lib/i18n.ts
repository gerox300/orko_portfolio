/**
 * orko_ i18n Dictionary
 * All translatable UI strings. EN default / ES Rioplatense (Argentine Spanish, "vos" form).
 *
 * RULE: ALL user-facing text in JSX MUST use t(key). Never hardcode EN strings.
 * Exceptions (do NOT translate): orko_, [K_O], BUE clock, SEQ_ID/VECTOR data labels,
 * LAT/LON coordinates, client names, © legal text.
 */

export type Language = 'en' | 'es';

const dictionary = {
  // ─── BOOT SEQUENCE ────────────────────────────────────────────────────────
  'boot.systemBoot': {
    en: '[ SYSTEM BOOT ]',
    es: '[ ARRANQUE DEL SISTEMA ]',
  },
  'boot.scanning': {
    en: 'SCANNING MUTATION DATABASE',
    es: 'ESCANEANDO BASE DE MUTACIONES',
  },
  'boot.loading': {
    en: 'LOADING VECTORS',
    es: 'CARGANDO VECTORES',
  },
  'boot.envReady': {
    en: '[ ENVIRONMENT READY ]',
    es: '[ ENTORNO LISTO ]',
  },
  'boot.enterLab': {
    en: '[ ENTER LAB ]',
    es: '[ ENTRAR AL LAB ]',
  },

  // ─── HUD ──────────────────────────────────────────────────────────────────
  'hud.work': {
    en: '[ WORK ]',
    es: '[ PROYECTOS ]',
  },
  'hud.lab': {
    en: '[ LAB ]',
    es: '[ SERVICIOS ]',
  },
  'hud.intel': {
    en: '[ INTEL ]',
    es: '[ INFO ]',
  },
  'hud.langEn': {
    en: 'LANG: [EN]',
    es: 'LANG: [EN]',
  },
  'hud.langEs': {
    en: 'LANG: [ES]',
    es: 'LANG: [ES]',
  },
  'hud.langCurrent': {
    en: 'LANG: [EN]',
    es: 'LANG: [ES]',
  },

  // ─── HERO ─────────────────────────────────────────────────────────────────
  'hero.headline': {
    en: 'INCUBATING DIGITAL SPECIES.',
    es: 'INCUBANDO ESPECIES DIGITALES.',
  },
  'hero.subheadline': {
    en: 'We synthesize living identities and high-performance interfaces designed for aggressive survival.',
    es: 'Sintetizamos identidades vivas e interfaces de alto rendimiento diseñadas para la supervivencia agresiva.',
  },

  // ─── TERMINAL TICKER ──────────────────────────────────────────────────────
  'ticker.brandSystems': {
    en: '> DEPLOYING: BRAND SYSTEMS_',
    es: '> DESPLEGANDO: SISTEMAS DE MARCA_',
  },
  'ticker.interfaces': {
    en: '> DEPLOYING: INTELLIGENT INTERFACES_',
    es: '> DESPLEGANDO: INTERFACES INTELIGENTES_',
  },
  'ticker.platforms': {
    en: '> DEPLOYING: AUTONOMOUS PLATFORMS_',
    es: '> DESPLEGANDO: PLATAFORMAS AUTÓNOMAS_',
  },
  'ticker.identities': {
    en: '> DEPLOYING: VISUAL IDENTITIES_',
    es: '> DESPLEGANDO: IDENTIDADES VISUALES_',
  },
  'ticker.aiWorkflows': {
    en: '> DEPLOYING: AI-DRIVEN WORKFLOWS_',
    es: '> DESPLEGANDO: FLUJOS CON IA_',
  },
  'ticker.experiences': {
    en: '> DEPLOYING: IMMERSIVE EXPERIENCES_',
    es: '> DESPLEGANDO: EXPERIENCIAS INMERSIVAS_',
  },

  // ─── DATA NODES (HERO) ────────────────────────────────────────────────────
  'dataNode.status': {
    en: 'STATUS: MUTATING',
    es: 'ESTADO: MUTANDO',
  },
  'dataNode.seqId': {
    en: 'SEQ_ID: 0092',
    es: 'SEQ_ID: 0092',
  },
  'dataNode.vector': {
    en: 'VECTOR: ACTIVE',
    es: 'VECTOR: ACTIVO',
  },

  // ─── BIO ──────────────────────────────────────────────────────────────────
  'bio.label': {
    en: '[ THE_OPERATOR ]',
    es: '[ DIR-CREATIVA ]',
  },
  'bio.role': {
    en: 'CREATIVE SPECIMEN',
    es: 'ESPÉCIMEN CREATIVO',
  },
  'bio.body': {
    en: "I came to design through anthropology — which means I arrived sideways, through fieldwork rather than form. I've been running that same diagnostic ever since: reading cultures before touching pixels, mapping how meaning moves through a brand before proposing how it should look.\n\nThe output is what you'd expect from that kind of process — identities, narratives, and interfaces that mutate with the contexts they inhabit. Precise because they're situated. Alive because they're built from the inside.",
    es: "Llegué al diseño a través de la antropología, lo que significa que llegué de costado, a través del trabajo de campo y no de la forma. Desde entonces aplico el mismo diagnóstico: leer culturas antes de tocar píxeles, mapear cómo se mueve el significado en una marca antes de proponer cómo debería verse.\nEl resultado es lo que esperarías de ese tipo de proceso, identidades, narrativas e interfaces que mutan con los contextos que habitan. Precisas porque están situadas. Vivas porque están construidas desde adentro.",
  },
  'bio.stat.research': {
    en: 'RESEARCH',
    es: 'INVESTIGACIÓN',
  },
  'bio.stat.development': {
    en: 'DEVELOPMENT',
    es: 'DESARROLLO',
  },
  'bio.stat.artDirection': {
    en: 'ART DIRECTION',
    es: 'DIRECCIÓN DE ARTE',
  },
  'bio.stat.automation': {
    en: 'AUTOMATION',
    es: 'AUTOMATIZACIÓN',
  },
  'bio.id.classified': {
    en: 'CLASSIFIED',
    es: 'CLASIFICADO',
  },
  'bio.id.age': { en: 'AGE', es: 'EDAD' },
  'bio.id.sign': { en: 'SIGN', es: 'SIGNO' },
  'bio.id.origin': { en: 'ORIGIN', es: 'ORIGEN' },
  'bio.id.audio_op': { en: 'AUDIO_OP', es: 'OP_AUDIO' },
  'bio.id.langs': { en: 'LANGS', es: 'IDIOMAS' },
  'bio.id.status': { en: 'STATUS', es: 'ESTADO' },

  // ─── SERVICES ─────────────────────────────────────────────────────────────
  'services.sectionLabel': {
    en: '[ SERVICES ]',
    es: '[ SERVICIOS ]',
  },
  'services.sectionTitle': {
    en: 'MUTATION VECTORS',
    es: 'VECTORES DE MUTACIÓN',
  },

  'services.brand.title': {
    en: 'BRAND IDENTITY & ART DIRECTION',
    es: 'IDENTIDAD DE MARCA Y DIRECCIÓN DE ARTE',
  },
  'services.brand.desc': {
    en: 'Synthesizing visual DNA. Distilling chaotic brand matter into highly concentrated, unmistakable market signals.',
    es: 'Sintetizando ADN visual. Destilando la materia caótica de la marca en señales en estado puro, de alta concentración e inconfundibles.',
  },

  'services.research.title': {
    en: 'STRATEGIC RESEARCH',
    es: 'INVESTIGACION DIGITAL',
  },
  'services.research.desc': {
    en: 'Decoding the human variable. Deep qualitative investigation to uncover hidden behavioral patterns before writing a single line of code. Strategic mapping of cultural meaning within your niche.',
    es: 'Decodificamos la variable humana. Investigación cualitativa profunda para descubrir patrones de comportamiento ocultos. Mapeo estratégico de los significados culturales en tu nicho para fundar la marca.',
  },

  'services.digital.title': {
    en: 'DESIGN ECOSYSTEMS',
    es: 'ECOSISTEMAS DE DISEÑO',
  },
  'services.digital.desc': {
    en: 'Bespoke digital ecosystems. Zero templates. High-performance code designed for maximum immersion. Web, apps, and platform development.',
    es: 'Desarrollo de webs, apps, software y plataformas a medida. Cero templates. Código de alto rendimiento diseñado para inmersión total.',
  },

  'services.ai.title': {
    en: 'AUTOMATIONS & AI SOLUTIONS',
    es: 'AUTOMATIZACIONES Y SOLUCIONES IA',
  },
  'services.ai.desc': {
    en: 'Intelligent automation flows and autonomous agents. Replacing manual labor with scalable, self-operating logic.',
    es: 'Flujos de automatización inteligente y agentes autónomos. Reemplazamos el trabajo manual con lógica escalable que opera por sí sola.',
  },

  // ─── WORKS SECTION ────────────────────────────────────────────────────────
  'works.sectionLabel': {
    en: '[ THE_ARCHIVE ]',
    es: '[ ARCHIVO ]',
  },
  'works.sectionTitle': {
    en: 'CASE FILES',
    es: 'PROYECTOS',
  },

  // ─── WORKS TABLE HEADERS ──────────────────────────────────────────────────
  'works.col.client': {
    en: 'CLIENT',
    es: 'CLIENTE',
  },
  'works.col.type': {
    en: 'TYPE',
    es: 'TIPO',
  },
  'works.col.sector': {
    en: 'SECTOR',
    es: 'SECTOR',
  },
  'works.col.year': {
    en: 'YEAR',
    es: 'AÑO',
  },

  // ─── PROJECT COPY (WORKS) ─────────────────────────────────────────────────
  'works.happener.sector': {
    en: 'Event Design',
    es: 'Diseño de Eventos',
  },
  'works.happener.type': {
    en: 'Branding & Web Design',
    es: 'Branding y Diseño Web',
  },
  'works.happener.copy': {
    en: 'Vibrant branding and digital platform for a Dubai-based event organizer. Breaking away from corporate genericism, the identity reflects transformation and the energy of human encounters.',
    es: 'Branding vibrante y plataforma digital para una organizadora de eventos en Dubái. Rompiendo con el genericismo corporativo, la identidad refleja la transformación y la energía del encuentro humano.',
  },
  'works.happener.approachItem1': {
    en: 'Logo design inspired by a chrysalis, symbolizing transformation and growth.',
    es: 'Diseño de logo inspirado en una crisálida, simbolizando la transformación y el crecimiento.',
  },
  'works.happener.approachItem2': {
    en: 'Balancing professional corporate standards with a highly personal and energetic visual identity.',
    es: 'Equilibrio entre estándares corporativos profesionales y una identidad visual altamente personal y energética.',
  },
  'works.happener.approachItem3': {
    en: 'Collaborative branding process based on the client’s sketches and vision of non-generic events.',
    es: 'Proceso de branding colaborativo basado en los bocetos de la cliente y su visión de eventos no genéricos.',
  },
  'works.xii.sector': {
    en: 'Immigrations & Incorporations',
    es: 'Inmigración y Radicación',
  },
  'works.xii.type': {
    en: 'Strategic Landing & AI',
    es: 'Landing Estratégica e IA',
  },
  'works.xii.copy': {
    en: 'Strategic digital presence for a firm specializing in company establishment and immigration across the UAE. The project features a minimalist landing page driven by real testimonials and an AI-powered intelligent form for automated lead qualification.',
    es: 'Presencia digital estratégica para una firma especializada en la radicación de empresas e inmigración en los Emiratos Árabes. El proyecto incluye una landing page minimalista impulsada por testimonios reales y un formulario inteligente con IA para la calificación automatizada de leads.',
  },
  'works.xii.approachItem1': {
    en: 'Minimalist landing page designed to convey trust and operational excellence in the Emirates market.',
    es: 'Landing page minimalista diseñada para transmitir confianza y excelencia operativa en el mercado de los Emiratos.',
  },
  'works.xii.approachItem2': {
    en: 'Integration of real testimonials to build authority in the legal and corporate sector.',
    es: 'Integración de testimonios reales para construir autoridad en el sector legal y corporativo.',
  },
  'works.xii.approachItem3': {
    en: 'AI-guided intelligent form for lead qualification and automated user onboarding.',
    es: 'Formulario inteligente guiado por IA para la calificación de leads y onboarding automatizado de usuarios.',
  },
  'works.legendary.sector': {
    en: 'Domain Assets & Naming',
    es: 'Activos de Dominio y Naming',
  },
  'works.legendary.type': {
    en: 'Mystical Branding & Platform',
    es: 'Branding Místico y Plataforma',
  },
  'works.legendary.copy': {
    en: 'A dedicated platform for a pioneer domain broker with 12+ years of trajectory in Domain Acquisition. Transitioning from third-party platforms to a proprietary hub to offer naming services, the project merged a premium portfolio with a mystical aesthetic rooted in the sacred act of naming, driven by multiple dynamic Google-indexed landing pages.',
    es: 'Plataforma propia para un broker pionero en la adquisición de dominios con más de 12 años de trayectoria. En la búsqueda de un espacio autónomo para ofrecer sus servicios de naming, el proyecto fusionó un portfolio premium con una estética mística centrada en el acto sagrado de nombrar, impulsado por múltiples landings dinámicas indexables en Google.',
  },
  'works.legendary.approachItem1': {
    en: 'Visual identity inspired by mythology and the sacred act of turning the infinite into the finite through names.',
    es: 'Identidad visual inspirada en la mitología y el acto sagrado de volver finito lo infinito a través del nombre.',
  },
  'works.legendary.approachItem2': {
    en: 'Translating a complex aesthetic vision into a functional, letter-driven design system.',
    es: 'Traducción de una visión estética compleja en un sistema de diseño funcional centrado en la letra.',
  },
  'works.legendary.approachItem3': {
    en: 'Technical implementation of dynamic, Google-indexed landings for every domain in the portfolio.',
    es: 'Implementación técnica de landings dinámicas indexables por Google para cada dominio del portfolio.',
  },
  'works.carola.sector': {
    en: 'Art',
    es: 'Arte',
  },
  'works.carola.type': {
    en: 'Digital Archiving',
    es: 'Archivo Digital',
  },
  'works.carola.copy': {
    en: 'Digital archive for renowned Argentine artist Carola Zech. Navigating 30 years of sculptural mastery through a custom, non-linear structural heritage system.',
    es: 'Archivo digital para la reconocida artista argentina Carola Zech. Navegación de 30 años de maestría escultórica a través de un sistema de patrimonio estructural personalizado y no lineal.',
  },
  'works.carola.approachItem1': {
    en: 'Organizing a massive body of work into coherent, visually attractive installations and series.',
    es: 'Organización de un acervo de obra enorme en instalaciones y series coherentes y visualmente atractivas.',
  },
  'works.carola.approachItem2': {
    en: 'Iterative prototyping process to define custom display logics for images and their relationships.',
    es: 'Proceso iterativo de prototipado para definir lógicas de exhibición personalizadas y sus relaciones.',
  },
  'works.carola.approachItem3': {
    en: 'Ultra-minimalist and sober design focus, allowing the artworks to speak for themselves.',
    es: 'Enfoque de diseño ultra-minimalista y sobrio, permitiendo que las obras hablen por sí mismas.',
  },
  'works.acau.sector': {
    en: 'Industrial Lighting',
    es: 'Luminaria Industrial',
  },
  'works.acau.type': {
    en: 'High-Status Industrial Presence',
    es: 'Presencia Industrial de Estatus',
  },
  'works.acau.copy': {
    en: 'Visual modernization for an Argentine factory with 30+ years of trajectory in industrial, agricultural, and mining lighting. The project elevated their digital identity to properly reflect their distinctive technical expertise and establish a stronger relationship with global distributors and manufacturers.',
    es: 'Modernización visual para una fábrica argentina con más de 30 años de trayectoria en luminaria industrial, agrícola y minera. El proyecto elevó su identidad digital para reflejar fielmente su distintiva experiencia técnica y establecer una relación más sólida con distribuidores y fabricantes globales.',
  },
  'works.acau.approachItem1': {
    en: 'On-site industrial filming and photography to capture the scale of their national production.',
    es: 'Rodaje y fotografía industrial in-situ para capturar la escala de su producción nacional.',
  },
  'works.acau.approachItem2': {
    en: 'Generation of high-impact AI-driven audiovisual assets for social and web platforms.',
    es: 'Generación de activos audiovisuales de alto impacto mediante IA para redes y plataformas web.',
  },
  'works.acau.approachItem3': {
    en: 'Redesigning a legacy identity to bridge the gap with global distributors and manufacturers.',
    es: 'Rediseño de una identidad heredada para cerrar la brecha con distribuidores y fabricantes globales.',
  },
  'works.frihcun.sector': {
    en: 'Global Industrial Trade',
    es: 'Trade Industrial Global',
  },
  'works.frihcun.type': {
    en: 'Sophisticated Trade Interface',
    es: 'Interfaz de Trade Sofisticada',
  },
  'works.frihcun.copy': {
    en: 'Global trade platform for a highly specialized industrial refrigeration trader. Connecting international manufacturers with markets worldwide. The challenge was creating a sophisticated, elegant, and minimalist digital presence for a very specific niche, highlighted by the development of a custom realistic 3D globe visualizing their operational markets.',
    es: 'Plataforma web para un trader especializado en equipos de refrigeración industrial que conecta a fabricantes con mercados de todo el mundo. El desafío radicaba en crear una presencia digital sofisticada, minimalista y elegante para un nicho sumamente específico, destacando el desarrollo de un globo terráqueo 3D realista con sus mercados operativos reales.',
  },
  'works.frihcun.approachItem1': {
    en: 'Translating a highly technical, specific industry into a simple and attractive visual system.',
    es: 'Traducción de una industria altamente técnica y específica en un sistema visual simple y atractivo.',
  },
  'works.frihcun.approachItem2': {
    en: 'Creation of an elegant and professional digital presence for global market expansion.',
    es: 'Creación de una presencia digital elegante y profesional para la expansión de mercados globales.',
  },
  'works.frihcun.approachItem3': {
    en: 'Development of a realistic 3D globe visualization showing real-time operational markets.',
    es: 'Desarrollo de una visualización realista de un globo terráqueo 3D que muestra los mercados reales.',
  },
  'works.cantus_avi.sector': {
    en: 'Choral / Music',
    es: 'Coral / Musica',
  },
  'works.cantus_avi.type': {
    en: 'Visual Identity Redesign',
    es: 'Rediseno de Identidad',
  },
  'works.rodrigo.sector': {
    en: 'Photography',
    es: 'Fotografia',
  },
  'works.rodrigo.type': {
    en: 'Photography Portfolio',
    es: 'Portfolio Fotografico',
  },

  'works.cantus_avi.copy': {
    en: 'Visual transformation for a youthful academic choir. We transitioned their choral heritage into a professional, high-impact brand system designed for commercial integration. The result is a jovial yet sophisticated identity that bridges the gap between academic excellence and the professional event market, with a special focus on weddings and high-end ceremonies.',
    es: 'Transformación visual para un coro académico de jóvenes. Transicionamos su herencia coral hacia un sistema de marca profesional y de alto impacto diseñado para la inserción comercial. El resultado es una identidad jovial pero sofisticada que cierra la brecha entre la excelencia académica y el mercado de eventos profesionales, con un enfoque especial en casamientos y ceremonias de gran nivel.',
  },
  'works.cantus_avi.approachItem1': {
    en: 'We immersed ourselves in their world, reviewing archival footage and recordings to capture the choir’s true essence.',
    es: 'Nos sumergimos en su mundo, revisando material de archivo y grabaciones para capturar la verdadera esencia del coro.',
  },
  'works.cantus_avi.approachItem2': {
    en: 'The identity was developed with their music as a constant soundtrack, letting their sound guide every visual decision.',
    es: 'La identidad se desarrolló con su música como banda sonora constante, dejando que el sonido guiara cada decisión visual.',
  },
  'works.cantus_avi.approachItem3': {
    en: 'Through shared sessions, we shaped a system that honors their academic roots while opening new professional doors.',
    es: 'En sesiones compartidas, modelamos un sistema que honra sus raíces académicas mientras abre nuevas puertas profesionales.',
  },

  'works.sama.sector': {
    en: 'Creative Collective',
    es: 'Colectivo Creativo',
  },
  'works.sama.type': {
    en: 'Visual Identity',
    es: 'Identidad Visual',
  },
  'works.sama.copy': {
    en: 'Visual identity and branding for SAMA, a multidisciplinary creative collective. Born from a deeply personal homage to a beloved cat, the identity balances raw emotion with a modern aesthetic designed for the live performance and art scene.',
    es: 'Identidad visual y branding para SAMA, un colectivo creativo multidisciplinario. Nacida como un homenaje muy personal a un gato muy querido, la identidad equilibra la emoción cruda con una estética moderna para la escena del arte y los eventos en vivo.',
  },
  'works.sama.approachItem1': {
    en: 'Navigating an open and personal client brief to create a flexible brand identity without rigid corporate structures.',
    es: 'Abordaje de un brief de cliente abierto y personal para crear una identidad de marca flexible, sin estructuras corporativas rígidas.',
  },
  'works.sama.approachItem2': {
    en: 'Honoring the collective\'s origin story by introducing a subtle, abstract nod to cat whiskers into the logo.',
    es: 'Un homenaje a la historia de origen, introduciendo un sutil y abstracto guiño a los bigotes de un gato en el diseño del logo.',
  },
  'works.sama.approachItem3': {
    en: 'Development of a visual system that reflects the collective’s evolution into a modern creative signal.',
    es: 'Desarrollo de un sistema visual que refleja la evolución del colectivo hacia una señal creativa moderna.',
  },

  'works.rodrigo.copy': {
    en: 'Portfolio website for Argentine photographer Rodrigo Agüero. The project focused on building distinct ways to present very different bodies of work, treating the website itself as another format through which his photography could be shown and framed. It was a highly collaborative process, shaped through ongoing conversations about how the images should coexist, and how the homepage canvas could bring together backstage material and finished work.',
    es: 'Web portfolio para el fotógrafo argentino Rodrigo Agüero. El proyecto se centró en construir formas distintas de presentar trabajos fotográficos muy diferentes entre sí, entendiendo la web como otro formato posible para mostrar y enmarcar su obra. Fue un proceso muy colaborativo, construido a partir de conversaciones continuas sobre cómo debían convivir las imágenes y cómo el canvas de la home podía reunir material de backstage y trabajos terminados.',
  },
  'works.rejus.sector': {
    en: 'Legal Network / Social Action',
    es: 'Derecho / Acción Social',
  },
  'works.rejus.type': {
    en: 'Fresh Institutional Identity',
    es: 'Identidad Institucional Fresca',
  },
  'works.rejus.copy': {
    en: 'Digital institutional presence for a collective of young lawyers from the University of Buenos Aires. Merging law with social action through a fresh and accessible aesthetic.',
    es: 'Web institucional para un colectivo de abogados y abogadas jóvenes de la UBA. Fusionando el derecho con la acción social mediante una estética fresca y accesible.',
  },
  'works.rejus.approachItem1': {
    en: 'Creating a "cool" and attractive institutional design that breaks away from academic coldness.',
    es: 'Creación de un diseño institucional "cool" y atractivo que rompe con la frialdad académica.',
  },
  'works.rejus.approachItem2': {
    en: 'Visualizing distinct action pillars to explain training, education, and voluntary support activities.',
    es: 'Visualización de pilares de acción claros para explicar actividades de capacitación, educación y ayuda voluntaria.',
  },
  'works.rejus.approachItem3': {
    en: 'Developing a simple yet professional bridge for the next generation of legal social activists.',
    es: 'Desarrollo de un puente simple pero profesional para la próxima generación de activistas sociales del derecho.',
  },
  'works.panel.projectLabel': {
    en: 'Project',
    es: 'Proyecto',
  },
  'works.panel.sectorLabel': {
    en: 'Sector',
    es: 'Sector',
  },
  'works.panel.approachTitle': {
    en: 'Approach',
    es: 'Enfoque',
  },
  'works.rodrigo.approachItem1': {
    en: 'Distinct display logic for different photographic works',
    es: 'Una lógica de exhibición distinta para trabajos fotográficos diferentes',
  },
  'works.rodrigo.approachItem2': {
    en: 'Collaborative design process shaped through conversation and review',
    es: 'Proceso de diseño colaborativo construido a través de conversaciones y revisiones',
  },
  'works.rodrigo.approachItem3': {
    en: 'Homepage canvas built to let backstage and finished images coexist',
    es: 'Canvas en la home pensado para que convivan imágenes de backstage y trabajos terminados',
  },

  // ─── FOOTER ───────────────────────────────────────────────────────────────
  'footer.copyEmail': {
    en: '[ COPY EMAIL ]',
    es: '[ COPIAR EMAIL ]',
  },
  'footer.copied': {
    en: '[ COPIED! ]',
    es: '[ ¡COPIADO! ]',
  },
  'footer.systemStatus': {
    en: 'ALL SYSTEMS OPERATIONAL',
    es: 'TODOS LOS SISTEMAS OPERATIVOS',
  },
  'footer.cta': {
    en: 'START MUTATION',
    es: 'INICIAR PROYECTO',
  },
  'footer.ctaActive': {
    en: '[ MUTATION INITIATED ]',
    es: '[ SECUENCIA INICIADA ]',
  },
  'footer.cursor': {
    en: '[ SCHEDULE_CALL ]',
    es: '[ AGENDAR ]',
  },

  // ─── SPECIMEN PILLS (HERO) ────────────────────────────────────────────────
  'pill.webDesign': { en: 'WEB DESIGN', es: 'DISEÑO WEB' },
  'pill.branding': { en: 'BRANDING', es: 'BRANDING' },
  'pill.logoDesign': { en: 'LOGO DESIGN', es: 'DISEÑO DE LOGO' },
  'pill.writing': { en: 'WRITING', es: 'REDACCIÓN' },
  'pill.automations': { en: 'AUTOMATIONS', es: 'AUTOMATIZACIONES' },
  'pill.research': { en: 'CULTURAL RESEARCH', es: 'INVESTIGACIÓN CULTURAL' },
  'pill.identity': { en: 'VISUAL IDENTITY', es: 'IDENTIDAD VISUAL' },
  'pill.artDirection': { en: 'ART DIRECTION', es: 'DIRECCIÓN DE ARTE' },

  // ─── FOOTER EXTRA ─────────────────────────────────────────────────────────
  'footer.labLabel': {
    en: 'orko_ | MUTATION LABORATORY',
    es: 'orko_ | LABORATORIO CREATIVO',
  },
  'footer.step1': { en: 'ESTABLISHING_VECTORS...', es: 'ESTABLECIENDO_VECTORES...' },
  'footer.step2': { en: 'PINGING_AVAILABILITY_LAB...', es: 'VERIFICANDO_LABORATORIO...' },
  'footer.step3': { en: 'ENCRYPTING_HANDSHAKE...', es: 'ENCRIPTANDO_ENLACE...' },
  'footer.step4': { en: 'OPENING_BOOKING_PORTAL...', es: 'ABRIENDO_AGENDA...' },
  'footer.rights': {
    en: 'ALL RIGHTS RESERVED',
    es: 'TODOS LOS DERECHOS RESERVADOS',
  },
} as const;

export type DictionaryKey = keyof typeof dictionary;

/**
 * Returns the translated string for the given key and language.
 * Used by LanguageProvider's t() helper.
 */
export function translate(key: DictionaryKey, lang: Language): string {
  const entry = dictionary[key];
  if (!entry) {
    console.warn(`[i18n] Missing key: ${key}`);
    return key;
  }
  return entry[lang];
}

export { dictionary };
