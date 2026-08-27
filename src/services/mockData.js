/**
 * Mock data services for local development (MVP Demo Version)
 * Contenu réaliste en français, thème géopolitique & économie Maghreb.
 *
 * Toutes les données sont simulées : elles servent à démontrer le produit et
 * sa vision long terme (agrégation de réseaux sociaux via Apify, etc.).
 */

// ---------------------------------------------------------------------------
// Métadonnées de plateformes (badges UI)
// ---------------------------------------------------------------------------

export const PLATFORM_META = {
  rss: { label: 'RSS', short: '📰', className: 'badge-rss' },
  website: { label: 'Web', short: '🌐', className: 'badge-website' },
  x: { label: 'X / Twitter', short: '𝕏', className: 'badge-x' },
  linkedin: { label: 'LinkedIn', short: 'in', className: 'badge-linkedin' },
  instagram: { label: 'Instagram', short: 'IG', className: 'badge-instagram' },
  youtube: { label: 'YouTube', short: '▶', className: 'badge-youtube' },
  'noozra-api': { label: 'Noozra', short: 'N', className: 'badge-noozra' },
  social: { label: 'Social', short: '💬', className: 'badge-social' },
}

export function getPlatformMeta(type) {
  return PLATFORM_META[type] || PLATFORM_META.website
}

// ---------------------------------------------------------------------------
// Catalogue de sources populaires
// ---------------------------------------------------------------------------

export const POPULAR_RSS_FEEDS = [
  {
    id: 'lemonde-afrique',
    name: 'Le Monde Afrique',
    url: 'https://www.lemonde.fr/afrique/rss_full.xml',
    type: 'rss',
    description: 'Actualité africaine et maghrébine',
  },
  {
    id: 'jeune-afrique',
    name: 'Jeune Afrique',
    url: 'https://www.jeuneafrique.com/feed/',
    type: 'rss',
    description: 'Économie et politique du continent',
  },
  {
    id: 'medias24',
    name: 'Médias24',
    url: 'https://medias24.com/feed',
    type: 'rss',
    description: 'Économie et société au Maroc',
  },
  {
    id: 'businessnews-tunisie',
    name: 'Business News Tunisie',
    url: 'https://www.businessnews.com.tn/feed',
    type: 'rss',
    description: 'Économie tunisienne au quotidien',
  },
]

export const SOCIAL_POPULAR_SOURCES = [
  {
    id: 'x-geomaghreb',
    name: '@GeoMaghreb_Intel',
    url: 'https://x.com/GeoMaghreb_Intel',
    type: 'x',
    description: 'Analyses géopolitiques du Maghreb (via Apify)',
  },
  {
    id: 'x-ecomaghreb',
    name: '@EcoMaghreb_Data',
    url: 'https://x.com/EcoMaghreb_Data',
    type: 'x',
    description: 'Indicateurs économiques Maroc/Tunisie/Algérie (via Apify)',
  },
  {
    id: 'linkedin-oem',
    name: 'Observatoire Économique du Maghreb',
    url: 'https://www.linkedin.com/company/oem-maghreb',
    type: 'linkedin',
    description: 'Posts et études macro-économiques (via Apify)',
  },
  {
    id: 'linkedin-institut-mp',
    name: 'Institut Maghreb Prospective',
    url: 'https://www.linkedin.com/company/maghreb-prospective',
    type: 'linkedin',
    description: 'Think tank — politiques publiques régionales (via Apify)',
  },
  {
    id: 'instagram-infonext',
    name: '@maghreb.infographies',
    url: 'https://www.instagram.com/maghreb.infographies',
    type: 'instagram',
    description: 'Infographies d’actualité quotidienne (via Apify)',
  },
  {
    id: 'youtube-oeilmaghreb',
    name: 'L’Œil du Maghreb — Débats',
    url: 'https://www.youtube.com/@oeildumaghreb',
    type: 'youtube',
    description: 'Débats et interviews d’experts (via Apify)',
  },
]

export const NOOZRA_POPULAR_SOURCES = [
  {
    id: 'noozra-world',
    name: 'Noozra - Monde',
    type: 'noozra-api',
    category: 'world',
    limit: 10,
    description: 'Fil international gratuit',
  },
  {
    id: 'noozra-business',
    name: 'Noozra - Business',
    type: 'noozra-api',
    category: 'business',
    limit: 10,
    description: 'Économie mondiale gratuite',
  },
]

export const POPULAR_SOURCES = [...POPULAR_RSS_FEEDS, ...SOCIAL_POPULAR_SOURCES, ...NOOZRA_POPULAR_SOURCES]

// Scénario de démo : chargé en 1 clic pour la présentation
export const DEMO_SCENARIO = [...POPULAR_RSS_FEEDS, ...SOCIAL_POPULAR_SOURCES]

// Sources par défaut (génération de flux sans aucune source)
export function getMockSources() {
  return POPULAR_RSS_FEEDS.slice(0, 2).map((s) => ({
    id: s.id,
    name: s.name,
    url: s.url,
    type: s.type,
    createdAt: new Date().toISOString(),
  }))
}

export function getPopularRSSFeeds() {
  return [...POPULAR_RSS_FEEDS]
}

export function getAllPopularSources() {
  return [...POPULAR_SOURCES]
}

// ---------------------------------------------------------------------------
// Bibliothèque de contenus simulés, par source (français, Maghreb)
// minutesAgo = ancienneté par rapport au moment de l'extraction
// ---------------------------------------------------------------------------

const SOURCE_CONTENT_LIBRARY = {
  'lemonde-afrique': [
    {
      title: 'Sommet UE-Afrique : une feuille de route sur la migration relance le dialogue avec le Maghreb',
      text: 'Les Vingt-Sept et les pays du Maghreb se sont accordés sur un cadre de coopération migratoire incluant un fonds commun de 800 M€. Le texte prévoit la facilitation des visas pour les étudiants et chercheurs, ainsi qu’un mécanisme conjoint de retour volontaire. Un premier bilan est attendu avant la fin de l’année.',
      author: 'Service Afrique',
      minutesAgo: 42,
    },
    {
      title: 'Interconnexion électrique Maroc-Espagne : la troisième ligne entre en phase d’études',
      text: 'Les gestionnaires de réseaux des deux rives confirment l’étude d’une troisième interconnexion sous-marine, portant la capacité d’échange à 1 400 MW. Le projet, soutenu par Bruxelles, doit accompagner l’essor des exportations d’électricité verte marocaine vers le marché européen.',
      author: 'Marlène Delrue',
      minutesAgo: 190,
    },
    {
      title: 'Algérie : le Parlement adopte la loi de finances complémentaire, cap sur les recettes hors hydrocarbures',
      text: 'Le texte renforce la fiscalité sur les importations non essentielles et crée un guichet unique pour l’investissement étranger. Objectif affiché : réduire la dépendance du budget aux hydrocarbures, qui représentent encore près de 60 % des recettes de l’État.',
      author: 'Service Économie',
      minutesAgo: 420,
    },
    {
      title: 'Sahara : reprise discrète des consultations à Genève sous médiation internationale',
      text: 'Selon nos informations, des réunions techniques se tiennent cette semaine entre les parties concernées, dans un format restreint. Aucun calendrier formel n’a été publié, mais les diplomates évoquent « une fenêtre d’espoir » après deux ans de blocage.',
      author: 'Rédaction Internationale',
      minutesAgo: 780,
    },
  ],
  'jeune-afrique': [
    {
      title: 'Automobile : le Maroc conforte son rang de hub africain avec un record de production',
      text: 'Avec plus de 700 000 véhicules produits sur l’année, le royaume consolide sa première place africaine. Les constructeurs annoncent une accélération sur les modèles électrifiés, portée par l’arrivée de nouvelles usines de batteries à Kénitra.',
      author: 'Chawki Amari',
      minutesAgo: 75,
    },
    {
      title: 'Startups maghrébines : la fintech attire 40 % des levées de fonds du premier semestre',
      text: 'Les startups du Maroc, de Tunisie et d’Algérie ont levé 118 M$ au premier semestre, en hausse de 25 % sur un an. La fintech domine, suivie de la logistique et de la santé numérique. Les investisseurs européens représentent la majorité des tickets.',
      author: 'Rédaction Tech',
      minutesAgo: 260,
    },
    {
      title: 'Tunisie : accord avec le FMI en vue ? Les signaux se multiplient',
      text: 'Après plusieurs mois de négociations laborieuses, des sources proches du dossier évoquent un accord technique sur un programme élargi. Reste la question des financements complémentaires promis par les partenaires bilatéraux.',
      author: 'Salma Ben Ali',
      minutesAgo: 600,
    },
  ],
  medias24: [
    {
      title: 'Inflation : le Maroc passe sous la barre des 2 %, première depuis quatre ans',
      text: 'L’indice des prix à la consommation a ralenti à 1,9 % en glissement annuel, porté par la baisse des prix alimentaires. Bank Al-Maghrib disposerait désormais d’une marge pour amorcer un assouplissement monétaire dès la prochaine réunion.',
      author: 'Hind Sefrioui',
      minutesAgo: 55,
    },
    {
      title: 'Eau : le remplissage des barrages dépasse 38 % grâce aux dernières précipitations',
      text: 'Les dernières averses ont permis de gagner trois points de remplissage en une semaine. Le ministère maintient toutefois les restrictions d’irrigation dans les bassins du Sud, où la situation reste critique.',
      author: 'Redaction Médias24',
      minutesAgo: 320,
    },
    {
      title: 'Offshoring : CasablancaFinance City annonce l’implantation de douze nouvelles entreprises',
      text: 'Le centre financier régional accueille douze nouveaux membres, dont cinq sociétés technologiques européennes cherchant à servir le marché africain depuis Casablanca. L’objectif de 500 entreprises d’ici 2028 se rapproche.',
      author: 'Yassine El Mansouri',
      minutesAgo: 900,
    },
  ],
  'businessnews-tunisie': [
    {
      title: 'Dinar euro : la BCE ouvre la porte à une baisse des taux, quel impact pour la Tunisie ?',
      text: 'Un assouplissement monétaire européen pourrait alléger la charge de la dette libellée en euros et soutenir les transferts de la diaspora, deuxième source de devises du pays. Les importateurs, eux, redoutent une pression accrue sur la balance commerciale.',
      author: 'Moez Joudi',
      minutesAgo: 95,
    },
    {
      title: 'Tourisme : saison record visée avec 10 millions d’entrées annoncées',
      text: 'Le ministre du Tourisme table sur 10 millions de visiteurs et 7,5 milliards de dinars de recettes. Les marchés allemand et polonais progressent plus vite que le traditionnel marché français.',
      author: 'Rédaction BN',
      minutesAgo: 380,
    },
    {
      title: 'Industrie : le textile tunisien mise sur la nearshoring pour séduire les marques européennes',
      text: 'Face à la concurrence asiatique, les industriels misent sur la proximité et la rapidité : livraison en 72 h en Europe, petites séries, traçabilité. Le secteur représente encore 180 000 emplois directs.',
      author: 'Nizar Bahloul',
      minutesAgo: 720,
    },
  ],

  // --- Réseaux sociaux (simulation future via Apify) ---

  'x-geomaghreb': [
    {
      title: '🧵 THREAD | Crise de l’eau au Maghreb : ce que révèlent les dernières images satellites',
      text: '1/ Les barrages algériens sont à 28 % en moyenne nationale, contre 34 % il y a un an.\n\n2/ La nappe de la Mitidja continue de baisser malgré l’interdiction de forage.\n\n3/ Le dessalement avance vite côté Maroc : 9 stations opérationnelles d’ici fin 2027.\n\nAnalyse complète en réponse ⤵️',
      author: '@GeoMaghreb_Intel',
      minutesAgo: 18,
      engagement: { likes: 2340, comments: 187, reposts: 612 },
    },
    {
      title: 'Le sommet UE–Maghreb sur la migration s\'achève sur un compromis inattendu.',
      text: 'Le point de bascule : un régime de visas étudiant simplifié pour les trois pays du Maghreb. Personne n’y croyait il y a encore une semaine. À suivre : la transposition nationale, souvent là où tout se joue.',
      author: '@GeoMaghreb_Intel',
      minutesAgo: 150,
      engagement: { likes: 1180, comments: 94, reposts: 305 },
    },
    {
      title: 'Signaux faibles à surveiller cette semaine 👇',
      text: '— Visite non annoncée d’une délégation émiratie à Tunis\n— Manœuvres navales conjointes au large de Tanger\n— Report sine die du sommet gazier transsaharien\n\nOn décrypte tout dans la newsletter du vendredi.',
      author: '@GeoMaghreb_Intel',
      minutesAgo: 480,
      engagement: { likes: 890, comments: 61, reposts: 240 },
    },
  ],
  'x-ecomaghreb': [
    {
      title: '📊 INFLATION | Derniers chiffres régionaux',
      text: '🇲🇦 Maroc : 1,9 % (plus bas depuis 4 ans)\n🇹🇳 Tunisie : 6,7 % (décrue continue)\n🇩🇿 Algérie : 4,2 % (stabilisation)\n\nTrois trajectoires divergentes, une même question : quand viendra le tour des baisses de taux ? #Maghreb #Economie',
      author: '@EcoMaghreb_Data',
      minutesAgo: 30,
      engagement: { likes: 1540, comments: 122, reposts: 430 },
    },
    {
      title: 'Le dirham et le dinar face à l’euro : tendances croisées',
      text: 'Le dirham s’apprécie légèrement (+0,8 % depuis janvier), soutenu par les transferts des MRE et le tourisme. Le dinar tunisien reste quasi stable en apparence… mais perd 11 % face au dollar. Thread complet demain matin.',
      author: '@EcoMaghreb_Data',
      minutesAgo: 210,
      engagement: { likes: 720, comments: 88, reposts: 195 },
    },
    {
      title: 'FDI : les annonces d’investissements directs explosent, mais…',
      text: '+62 % d’annonces en valeur sur un an au Maghreb. Nuance importante : 70 % concernent des projets pas encore financés. L’indicateur à suivre, c’est le passage annonce → chantier, pas l’annonce elle-même.',
      author: '@EcoMaghreb_Data',
      minutesAgo: 560,
      engagement: { likes: 640, comments: 47, reposts: 210 },
    },
  ],
  'linkedin-oem': [
    {
      title: '📄 Nouvelle étude : « Croissance verte et emplois au Maghreb » — les résultats clés',
      text: 'Notre Observatoire publie aujourd’hui son rapport semestriel. Trois enseignements majeurs :\n\n① Les métiers de l’énergie renouvelable pourraient créer 180 000 emplois directs d’ici 2030 au Maroc et en Tunisie.\n② Le déficit de formation technique est le premier frein cité par les employeurs (68 %).\n③ Le financement climatique capté par la région reste inférieur à 1 % des flux mondiaux.\n\nRapport complet en commentaire 👇 #Maghreb #TransitionEnergetique',
      author: 'Observatoire Économique du Maghreb • Newsletter hebdomadaire',
      minutesAgo: 65,
      engagement: { likes: 1870, comments: 143, reposts: 396 },
    },
    {
      title: 'Retour sur notre panel « Investir dans le Sud méditerranéen »',
      text: 'Merci aux 400 participants présents hier. Le message le plus fort venu du terrain : « la stabilité réglementaire compte plus que les incitations fiscales ». Un constat que nos lecteurs institutionnels ne devraient pas ignorer.\n\nProchain rendez-vous : webinaire sur le financement des PME le 15.',
      author: 'Observatoire Économique du Maghreb',
      minutesAgo: 350,
      engagement: { likes: 920, comments: 67, reposts: 158 },
    },
    {
      title: 'Infographie : le commerce intra-maghrébin stagne sous les 5 %',
      text: 'Malgré les discours, les échanges commerciaux entre les pays du Maghreb représentent moins de 5 % de leurs échanges totaux — l’un des ratios les plus faibles au monde pour une région intégrée. Comparaison saisissante avec l’ASEAN (25 %) et l’UE (60 %).',
      author: 'Observatoire Économique du Maghreb',
      minutesAgo: 1100,
      engagement: { likes: 1340, comments: 205, reposts: 487 },
    },
  ],
  'linkedin-institut-mp': [
    {
      title: 'Tribune : « La jeunesse maghrébine, variable d’ajustement ou actrice du changement ? »',
      text: 'Par notre directrice de recherche Dr. Amel Karoui. Avec un âge médian de 29 ans, la région dispose du plus grand capital humain jeune de Méditerranée. Encore faut-il transformer ce dividende démographique en opportunité économique. Analyse en 5 minutes de lecture.',
      author: 'Dr. Amel Karoui • Institut Maghreb Prospective',
      minutesAgo: 120,
      engagement: { likes: 860, comments: 112, reposts: 174 },
    },
    {
      title: 'Nous recrutons : analyste politiques publiques (Casablanca / Tunis, hybride)',
      text: 'Rejoignez notre équipe recherche ! Profil : master en économie/sciences po, excellente maîtrise de l’analyse de données, arabe et français courants, anglais professionnel. Candidatures jusqu’au 30. Poste détaillé en commentaire.',
      author: 'Institut Maghreb Prospective',
      minutesAgo: 640,
      engagement: { likes: 340, comments: 58, reposts: 96 },
    },
  ],
  'instagram-infonext': [
    {
      title: '📸 Infographie du jour : qui sont les premiers partenaires commerciaux du Maghreb ?',
      text: 'France, Espagne, Italie côté export ; Chine qui grimpe à toute vitesse côté import. Une carte pour comprendre les dépendances économiques de la région. Swipe ➡️ #Maghreb #CommerceInternational #DataViz',
      author: '@maghreb.infographies',
      minutesAgo: 140,
      engagement: { likes: 3120, comments: 78, reposts: 245 },
    },
    {
      title: '📸 En chiffres : le dessalement au Maroc en 2026',
      text: '9 stations en service · 1,7 million de m³/jour capacité · objectif 2030 : couvrir 50 % de l’eau potable urbaine. Toutes les données dans cette infographie à partager sans modération 💧',
      author: '@maghreb.infographies',
      minutesAgo: 520,
      engagement: { likes: 2480, comments: 54, reposts: 310 },
    },
  ],
  'youtube-oeilmaghreb': [
    {
      title: '🎬 VIDÉO | Migration : le deal UE-Maghreb change-t-il vraiment la donne ? (débat 45 min)',
      text: 'Avec Nadia Fettah (économiste), Karim Lasme (géopolitologue) et Sofiane Belhaj (journaliste, correspondant à Bruxelles). Au programme : visa étudiants, fonds de développement, retours volontaires — décryptage sans langue de bois du compromis conclu cette semaine.',
      author: 'L’Œil du Maghreb — Débats',
      minutesAgo: 200,
      engagement: { likes: 1240, comments: 356, reposts: 89 },
    },
    {
      title: '🎬 VIDÉO | Énergie : pourquoi le Sahara solaire intéresse autant Bruxelles',
      text: 'Reportage de 22 minutes entre Ouarzazate et Tunis. Comment la région veut devenir le grenier solaire de l’Europe — et à quelles conditions les populations locales y trouveront leur compte. Documentaire à voir avant le sommet énergétique de juin.',
      author: 'L’Œil du Maghreb — Débats',
      minutesAgo: 1450,
      engagement: { likes: 2130, comments: 412, reposts: 156 },
    },
  ],
}

// Contenu générique pour les sources inconnues (choix déterministe par nom)
const GENERIC_ARTICLES = [
  {
    title: 'Maghreb : les indicateurs économiques du trimestre en cinq points',
    text: 'Croissance, inflation, investissements directs, transferts de la diaspora et commerce extérieur : le tableau de bord complet de la région, avec les écarts notables entre le Maroc, l’Algérie et la Tunisie.',
    minutesAgo: 90,
  },
  {
    title: 'Politique : une semaine diplomatique dense attend la région',
    text: 'Entre les consultations régionales, les visites officielles annoncées et les dossiers en suspens (énergie, migration, sécurité), tour d’horizon des rendez-vous à suivre de près cette semaine.',
    minutesAgo: 240,
  },
  {
    title: 'Énergie : la course au solaire et à l’hydrogène vert s’accélère',
    text: 'Les projets annoncés au Maghreb dépassent désormais 40 GW de capacité solaire envisagée à horizon 2030. Point sur les projets réels, les financements sécurisés et les partenariats industriels signés.',
    minutesAgo: 400,
  },
  {
    title: 'Société : jeunesse, emploi et mobilité, le triple défi régional',
    text: 'Alors que 60 % de la population a moins de 35 ans, l’emploi des jeunes reste la priorité absolue des politiques publiques. Analyse comparative des dispositifs lancés dans les trois pays.',
    minutesAgo: 620,
  },
  {
    title: 'Tech & innovation : l’écosystème startup maghrébin franchit un palier',
    text: 'Fonds dédiés, accélérateurs internationaux, premières sorties réussies : comment l’écosystème régional se professionnalise et attire enfin les capitaux étrangers au-delà des amorçages.',
    minutesAgo: 850,
  },
]

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function resolveLibraryKey(source) {
  if (source.demoKey && SOURCE_CONTENT_LIBRARY[source.demoKey]) {
    return source.demoKey
  }
  const byId = SOURCE_CONTENT_LIBRARY[source.id]
  if (byId) return source.id
  const byName = POPULAR_SOURCES.find(
    (s) => s.name === source.name || s.url === source.url
  )
  if (byName && SOURCE_CONTENT_LIBRARY[byName.id]) {
    return byName.id
  }
  return null
}

/**
 * Extraction simulée principale.
 * Retourne 3-4 items réalistes par source, datés relativement à maintenant.
 */
export async function mockExtractSourceContent(source) {
  const isSocial = ['x', 'linkedin', 'instagram', 'youtube'].includes(source.type)
  const libraryKey = resolveLibraryKey(source)

  let templates
  if (libraryKey) {
    templates = SOURCE_CONTENT_LIBRARY[libraryKey]
  } else {
    // Source inconnue : rotation déterministe du contenu générique
    const offset = hashString(source.name || source.url || 'sourcia') % GENERIC_ARTICLES.length
    templates = [GENERIC_ARTICLES[offset], GENERIC_ARTICLES[(offset + 1) % GENERIC_ARTICLES.length]]
  }

  const items = templates.map((tpl) => ({
    title: tpl.title,
    text: tpl.text,
    url: source.url,
    publishedAt: new Date(Date.now() - tpl.minutesAgo * 60000).toISOString(),
    author: tpl.author || source.name,
    ...(isSocial && tpl.engagement ? { engagement: tpl.engagement } : {}),
  }))

  return {
    success: true,
    items,
    source: source.url,
    sourceType: source.type,
    itemCount: items.length,
    isReal: false,
    demo: true,
  }
}

// ---------------------------------------------------------------------------
// Résumés IA simulés (fallback sans clé API)
// ---------------------------------------------------------------------------

export function mockGenerateSummary(text, maxLength = 150) {
  // Coupe proprement à la fin d'une phrase si possible
  let summary = text.length <= maxLength ? text : text.substring(0, maxLength)
  if (text.length > maxLength) {
    const lastDot = summary.lastIndexOf('.')
    summary = lastDot > maxLength * 0.4 ? summary.substring(0, lastDot + 1) : summary.trimEnd() + '…'
  }

  return {
    success: true,
    summary,
    originalLength: text.length,
    summaryLength: summary.length,
  }
}
