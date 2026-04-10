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
    es: '[ OBRA ]',
  },
  'hud.lab': {
    en: '[ LAB ]',
    es: '[ LAB ]',
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
    es: '[ EL_OPERADOR ]',
  },
  'bio.role': {
    en: 'CREATIVE SPECIMEN',
    es: 'ESPÉCIMEN CREATIVO',
  },
  'bio.body': {
    en: "I design mutations that bridge the gap between static brands and living organisms. From autonomous agents to immersive interfaces, my work lives at the bleeding edge of evolution.",
    es: "Diseño mutaciones que cierran la brecha entre marcas estáticas y organismos vivos. Desde agentes autónomos hasta interfaces inmersivas, mi trabajo vive en el filo de la evolución.",
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

  // ─── SERVICES ─────────────────────────────────────────────────────────────
  'services.sectionLabel': {
    en: '[ WHAT_WE_DO ]',
    es: '[ LO_QUE_HACEMOS ]',
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
    en: 'Constructing visual systems with strict rules. Reducing brand chaos into a singular, undeniable signal.',
    es: 'Construimos sistemas visuales con reglas estrictas. Reducimos el caos de marca a una señal única e innegable.',
  },

  'services.research.title': {
    en: 'STRATEGIC INSIGHTS & RESEARCH',
    es: 'INSIGHTS ESTRATÉGICOS E INVESTIGACIÓN',
  },
  'services.research.desc': {
    en: 'Decoding the human variable. Deep qualitative investigation to uncover hidden patterns before code.',
    es: 'Decodificamos la variable humana. Investigación cualitativa profunda para descubrir patrones ocultos antes del código.',
  },

  'services.digital.title': {
    en: 'DIGITAL ARCHITECTURE',
    es: 'ARQUITECTURA DIGITAL',
  },
  'services.digital.desc': {
    en: 'Bespoke digital ecosystems. Zero templates. High-performance code designed for maximum immersion.',
    es: 'Ecosistemas digitales a medida. Cero templates. Código de alto rendimiento diseñado para máxima inmersión.',
  },

  'services.ai.title': {
    en: 'AUTOMATIONS & AI SOLUTIONS',
    es: 'AUTOMATIZACIONES Y SOLUCIONES IA',
  },
  'services.ai.desc': {
    en: 'Replacing manual labor with autonomous logic.',
    es: 'Reemplazamos el trabajo manual con lógica autónoma.',
  },

  // ─── WORKS SECTION ────────────────────────────────────────────────────────
  'works.sectionLabel': {
    en: '[ THE_ARCHIVE ]',
    es: '[ EL_ARCHIVO ]',
  },
  'works.sectionTitle': {
    en: 'CASE FILES',
    es: 'ARCHIVOS DE CASO',
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
  'works.happener.copy': {
    en: 'Autonomous Event Infrastructure. Engineered a robust, operator-independent ecosystem for the Dubai event market.',
    es: 'Infraestructura Autónoma de Eventos. Diseñamos un ecosistema robusto e independiente del operador para el mercado de eventos de Dubai.',
  },
  'works.xii.copy': {
    en: 'Biometric Lead Qualification. Integrated AI-driven logic to score applicant profiles in real-time.',
    es: 'Calificación Biométrica de Leads. Integramos lógica impulsada por IA para evaluar perfiles en tiempo real.',
  },
  'works.legendary.copy': {
    en: 'The Infinite Possibility Engine. A generative visual system where typography mutates to represent endless naming assets.',
    es: 'El Motor de Posibilidades Infinitas. Un sistema visual generativo donde la tipografía muta para representar activos de naming infinitos.',
  },
  'works.carola.copy': {
    en: 'Structural Heritage Navigation. Digitizing 30 years of sculptural mastery into a non-linear archive.',
    es: 'Navegación de Patrimonio Estructural. Digitalizamos 30 años de maestría escultórica en un archivo no lineal.',
  },
  'works.acau.copy': {
    en: 'High-Contrast Industrial UI. Designed for the harsh environments of mining and agro-tech.',
    es: 'UI Industrial de Alto Contraste. Diseñada para los entornos hostiles de minería y agro-tech.',
  },
  'works.frihcun.copy': {
    en: 'System architecture and industrial visual identity. Engineering-led design for high-performance environments.',
    es: 'Arquitectura de sistema e identidad visual industrial. Diseño orientado a ingeniería para entornos de alto rendimiento.',
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

  'works.rodrigo.copy': {
    en: 'Portfolio website for Argentine photographer Rodrigo Agüero. The project focused on building distinct ways to present very different bodies of work, treating the website itself as another format through which his photography could be shown and framed. It was a highly collaborative process, shaped through ongoing conversations about how the images should coexist, and how the homepage canvas could bring together backstage material and finished work.',
    es: 'Web portfolio para el fotógrafo argentino Rodrigo Agüero. El proyecto se centró en construir formas distintas de presentar trabajos fotográficos muy diferentes entre sí, entendiendo la web como otro formato posible para mostrar y enmarcar su obra. Fue un proceso muy colaborativo, construido a partir de conversaciones continuas sobre cómo debían convivir las imágenes y cómo el canvas de la home podía reunir material de backstage y trabajos terminados.',
  },

  'works.rejus.copy': {
    en: 'Justice Network Visualization. Injecting modern visual semantics into judicial structures.',
    es: 'Visualización de Red Judicial. Inyectamos semántica visual moderna en estructuras judiciales.',
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
    en: 'COPY EMAIL [↗]',
    es: 'COPIAR EMAIL [↗]',
  },
  'footer.copied': {
    en: '[ COPIED ]',
    es: '[ COPIADO ]',
  },
  'footer.systemStatus': {
    en: 'ALL SYSTEMS OPERATIONAL',
    es: 'TODOS LOS SISTEMAS OPERATIVOS',
  },
  'footer.cta': {
    en: 'START MUTATION',
    es: 'INICIAR MUTACIÓN',
  },
  'footer.ctaActive': {
    en: '[ MUTATION INITIATED ]',
    es: '[ MUTACIÓN INICIADA ]',
  },
  'footer.cursor': {
    en: '[ SCHEDULE_CALL ]',
    es: '[ AGENDAR ]',
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
