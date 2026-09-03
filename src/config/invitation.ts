/**
 * Single source of truth for invitation content.
 * Source: PROPOSAL DANA KIRAB 2026 v2.pdf (Tjie Thien Ta Sen Bio / 齊天大聖廟, Tangerang).
 */

export type Bilingual = { id: string; en: string };

export type ScheduleItem = Bilingual & { time?: string; children?: ScheduleItem[] };

export type ScheduleDay = {
  date: string;
  dateLabel: Bilingual;
  imlekLabel: string;
  timeRange: string;
  items: ScheduleItem[];
  climax?: boolean;
};

export type CommitteeGroup = {
  title: Bilingual;
  members: { role?: string; name: string; location?: string }[];
};

export type SponsorTier = {
  rank: string;
  name: Bilingual;
  contribution: Bilingual;
  perks: Bilingual[];
  badge?: Bilingual;
};

/**
 * `rank` groups the roster the way the committee's own source files do — one group
 * per contribution bracket — and drives tile size only. 1 is the largest.
 *   1 = Rp 20jt   2 = Rp 10jt   3 = Rp 5jt   4 = Rp 2,5jt   5 = pendukung
 * Nothing about the bracket is shown on the page; the wall is logos only.
 */
export type SponsorLogo = {
  slug: string;                                          // file is /sponsors/<slug>.webp
  name: string;                                          // img alt
  rank: 1 | 2 | 3 | 4 | 5;
};

/**
 * `chineseName` is the donor's actual Chinese given name — Quency and Gloria share
 * the generation character 芳 (Fong) — not a nickname, so render it plainly with no
 * quotation marks. `city` follows the Tangerang klenteng convention of inscribing a
 * donor's place of origin beside their name, as on Boen Tek Bio's own 19th-century
 * bells and censers. Order below is the committee's; do not sort it.
 */
export type SponsorDonor = { name: string; chineseName?: string; city?: string };

export const invitation = {
  organization: {
    foundation: "Panitia Kirab Budaya & Ruwat Bumi 2026",
    name: "Tjie Thien Ta Sen Bio",
    location: "Kota Tangerang",
    chinese: "齊天大聖廟",
    logoText: "TTTSB",
  },

  letterRef: "001/HUT/TTTSB/III/2026",

  anniversary: {
    number: 43,
    label: { id: "Tahun", en: "Anniversary" },
    tagline: { id: "Semarak Harmoni Budaya & Tradisi", en: "A Celebration of Cultural Harmony" },
  },

  eventName: {
    id: "Kirab Budaya & Ruwat Bumi 2026",
    en: "Cultural Procession & Earth Blessing 2026",
  },
  eventTagline: {
    id: "Memperingati Sejit YMS Tjie Thien Ta Sen & HUT Tjie Thien Ta Sen Bio Ke-43 Tahun",
    en: "Commemorating the Birthday of YMS Tjie Thien Ta Sen & the 43rd Anniversary of Tjie Thien Ta Sen Bio",
  },

  dateRange: { id: "23–27 September 2026", en: "23–27 September 2026" },
  imlekRange: "Pwe Gwee 13 — 17 · Imlek 2577",
  startsAt: "2026-09-23T08:00:00+07:00",
  climaxAt: "2026-09-27T14:00:00+07:00",
  endsAt:   "2026-09-27T18:00:00+07:00",

  venue: {
    name: "Tjie Thien Ta Sen Bio",
    address:
      "Jl. Bouraq No. 39, Pintu Air Timur, Kp. Sirnagalih, RT.002/RW.002, Karangsari, Neglasari, Kota Tangerang",
    mapsUrl:
      "https://maps.google.com/?q=Jl.+Bouraq+No.39,+Karangsari,+Neglasari,+Kota+Tangerang",
    embedUrl: "",
  },

  // ─── opening copy from the proposal ───────────────────────────
  greeting: { id: "Salam Kebajikan", en: "Greetings of Virtue" },
  honorific: { id: "Dengan Hormat,", en: "Respectfully," },
  opening: {
    id: "Dalam rangka menyambut Sejit YMS Tjie Thien Ta Sen & HUT Tjie Thien Ta Sen Bio Ke-43 Tahun, kami akan menyelenggarakan Kirab Budaya & Ruwat Bumi 2026. Sebagai penghormatan dan ungkapan rasa terima kasih kami kepada YMS Tjie Thien Ta Sen sebagai dewa pemberi berkah dan pembimbing yang kita yakini selalu memberikan kesehatan, keselamatan, perlindungan, dan kemakmuran bagi kita semua.",
    en: "In welcoming the Birthday of YMS TJIE THIEN TA SEN & the 43rd Anniversary of Tjie Thien Ta Sen Bio, we will hold the Cultural Procession & Earth Blessing 2026 — a tribute and expression of gratitude to YMS TJIE THIEN TA SEN, the deity of blessing and guidance who continually grants health, safety, protection, and prosperity to us all.",
  },
  invite: {
    id: "Demi kelancaran dan suksesnya acara ini, kami mengharapkan kehadiran dan partisipasi Bapak/Ibu sekalian dalam acara ini.",
    en: "For the smooth and joyful conduct of this event, we sincerely hope for your presence and participation.",
  },
  closing: {
    id: "Hormat Kami, Panitia Kirab Budaya & Ruwat Bumi 2026 — Tjie Thien Ta Sen Bio Tangerang.",
    en: "Sincerely, the Cultural Procession & Earth Blessing 2026 Committee — Tjie Thien Ta Sen Bio Tangerang.",
  },

  // ─── latar belakang & tujuan ──────────────────────────────────
  background: {
    id: "Kirab budaya merupakan salah satu bentuk pelestarian tradisi dan kearifan lokal yang memiliki nilai historis, sosial, dan edukatif bagi masyarakat. Kegiatan ini tidak hanya menjadi sarana hiburan, tetapi juga memperkuat identitas budaya serta meningkatkan kebersamaan warga.",
    en: "The cultural procession preserves tradition and local wisdom — bearing historical, social, and educational value. Beyond entertainment, it strengthens cultural identity and the bonds of community.",
  },
  goals: [
    { id: "Menyelenggarakan kirab budaya yang sakral & meriah",                        en: "Holding a procession that is both sacred and festive" },
    { id: "Melestarikan dan memperkenalkan keanekaragaman budaya nusantara kepada masyarakat luas", en: "Preserving and introducing the cultural diversity of the archipelago" },
    { id: "Membangun hubungan & kolaborasi yang baik antara panitia dengan para sponsor & donatur", en: "Building strong collaboration between organizers, sponsors, and donors" },
    { id: "Menggalang dana secara kreatif dan transparan",                             en: "Raising funds creatively and transparently" },
  ],

  // ─── susunan acara ────────────────────────────────────────────
  schedule: [
    {
      date: "2026-09-23",
      dateLabel: { id: "Rabu, 23 September 2026", en: "Wednesday, 23 September 2026" },
      imlekLabel: "八月十三 · Pwe Gwee 13 / Imlek 2577",
      timeRange: "08.00 WIB s.d. selesai",
      items: [
        { time: "08.00 – 10.00", id: "Fangsen 1.000 ekor ikan",       en: "Fangsen — Release of 1,000 Fish" },
        { time: "11.00 – 12.00", id: "San Kung",                      en: "San Kung" },
        { time: "12.00 – 20.00", id: "Cia Peng An",                   en: "Cia Peng An", children: [
          { time: "15.00 – 18.00", id: "Pentas Seni Barongsai & Liong", en: "Barongsai & Liong Performance" },
        ] },
        { time: "22.00 – 24.00", id: "Sembahyang Bersama",            en: "Communal Prayer" },
      ],
    },
    {
      date: "2026-09-24",
      dateLabel: { id: "Kamis, 24 September 2026", en: "Thursday, 24 September 2026" },
      imlekLabel: "八月十四 · Pwe Gwee 14 / Imlek 2577",
      timeRange: "09.00 WIB s.d. selesai",
      items: [
        { time: "09.00 – 17.00", id: "梁皇寶懺 Liang Huang Bao Chan — Ritual Pertobatan Kaisar Liang (Lt. 3)", en: "梁皇寶懺 Liang Huang Bao Chan — Emperor Liang Repentance Ritual (3rd Floor)" },
        { time: "12.00 – 20.00", id: "Cia Peng An",                  en: "Cia Peng An" },
        { time: "22.00 – 24.00", id: "Sembahyang Bersama",           en: "Communal Prayer" },
      ],
    },
    {
      date: "2026-09-25",
      dateLabel: { id: "Jumat, 25 September 2026", en: "Friday, 25 September 2026" },
      imlekLabel: "八月十五 · Pwe Gwee 15 / Imlek 2577",
      timeRange: "09.00 WIB s.d. selesai",
      items: [
        { time: "09.00 – 17.00", id: "梁皇寶懺 Liang Huang Bao Chan — Ritual Pertobatan Kaisar Liang (Lt. 3)", en: "梁皇寶懺 Liang Huang Bao Chan — Emperor Liang Repentance Ritual (3rd Floor)" },
        { time: "12.00 – 20.00", id: "Cia Peng An",                          en: "Cia Peng An", children: [
          { time: "18.00 – 20.00", id: "Pentas Seni Barongsai (Tuan Rumah)",   en: "Barongsai Performance (Host)" },
          { time: "19.00 – 20.00", id: "Pemasangan 72 Lilin & Persembahan 72 macam buah oleh umat", en: "Lighting of 72 Candles & Offering of 72 Fruit Varieties by Devotees" },
        ] },
        { time: "22.00 – 24.00", id: "Sembahyang Bersama & Pembagian Wisit + Minyak Obat", en: "Communal Prayer & Distribution of Wisit + Medicinal Oil" },
      ],
    },
    {
      date: "2026-09-26",
      dateLabel: { id: "Sabtu, 26 September 2026", en: "Saturday, 26 September 2026" },
      imlekLabel: "八月十六 · Pwe Gwee 16 / Imlek 2577",
      timeRange: "08.00 WIB s.d. selesai",
      items: [
        { time: "09.00 – 17.00", id: "梁皇寶懺 Liang Huang Bao Chan — Ritual Pertobatan Kaisar Liang (Lt. 3)", en: "梁皇寶懺 Liang Huang Bao Chan — Emperor Liang Repentance Ritual (3rd Floor)" },
        { time: "12.00 – 20.00", id: "Cia Peng An",                             en: "Cia Peng An" },
        { time: "08.00 – 20.00", id: "Penerimaan Kiem Sin / Sen Siang & Kio / Joli (Lt. 2)", en: "Reception of Kiem Sin / Sen Siang & Kio / Joli (2nd Floor)" },
      ],
    },
    {
      date: "2026-09-27",
      dateLabel: { id: "Minggu, 27 September 2026 — Puncak Acara", en: "Sunday, 27 September 2026 — Climax" },
      imlekLabel: "八月十七 · Pwe Gwee 17 / Imlek 2577",
      timeRange: "08.00 WIB s.d. selesai",
      climax: true,
      items: [
        { time: "11.00 – 12.00", id: "San Kung",                                          en: "San Kung" },
        { time: "08.00 – 10.00", id: "Ritual persiapan kirab",                            en: "Procession Preparation Ritual" },
        { time: "08.00 – 20.00", id: "Cia Peng An",                                       en: "Cia Peng An" },
        { time: "08.00 – 12.00", id: "Penyerahan Kiem Sin / Sen Siang ditempatkan di Kio / Joli masing-masing", en: "Placement of Kiem Sin / Sen Siang into respective Kio / Joli" },
        { time: "14.00 – 18.00", id: "Pelepasan Kirab Budaya & Ruwat Bumi 2026",          en: "Procession Send-off — Kirab Budaya & Ruwat Bumi 2026" },
      ],
    },
  ] satisfies ScheduleDay[],

  // ─── susunan panitia ──────────────────────────────────────────
  committee: {
    penanggungJawab: "Suhu Benny Susanto",
    dewanKehormatan: [
      { name: "Bp. Juanto Kencana Jaya",                location: "Jakarta" },
      { name: "Bp. Lie Kok Tie",                        location: "Jakarta" },
      { name: "Bp. Kwee Ebie",                          location: "Jakarta" },
      { name: "Suhu Atjai",                             location: "Cikoleang" },
      { name: "Y.M. Dharmarakkhita Sthavira / Suhu Riki", location: "Lampung" },
      { name: "Bp. Na Beng Ti",                         location: "Tangerang" },
      { name: "Bp. Keng Sun",                           location: "Tanjung Kait" },
      { name: "Bp. Liaw Kim Hiung",                     location: "Jakarta" },
      { name: "Bp. Sianto Lim",                         location: "Sentul" },
      { name: "Bp. Benny Nova",                         location: "Jakarta" },
    ],
    inti: [
      { role: "Ketua Panitia",          name: "Bp. Fiter Lie" },
      { role: "Wakil Ketua 1",          name: "Bp. Andrie" },
      { role: "Wakil Ketua 2",          name: "Bp. Effen Wijaya / Eddy" },
      { role: "Sekretaris 1",           name: "Bp. Lukas Susanto" },
      { role: "Sekretaris 2",           name: "Bp. Freddy" },
      { role: "Bendahara 1",            name: "Ibu Oeij Ailie" },
      { role: "Bendahara 2",            name: "Sdri. Liliany Candra" },
      { role: "Koord. Persembahyangan", name: "Suhu Benny Susanto" },
    ],
    coordinators: [
      {
        title: { id: "Penerimaan Kiem Sin", en: "Kiem Sin Reception" },
        members: [
          { name: "Ibu Herlie" },     { name: "Bp. Sianto Lim" },
          { name: "Ibu Ayin" },       { name: "Bp. Karnadi" },
          { name: "Bp. Yuidi Haidiman" }, { name: "Bp. Zhong Yong Pao" },
          { name: "Bp. Willy" },      { name: "Bp. Jen Jung" },
          { name: "Bp. Wendy" },      { name: "Ibu San San" },
          { name: "Ibu Ai Cen" },
        ],
      },
      {
        title: { id: "Kio / Joli", en: "Kio / Joli" },
        members: [
          { name: "Bp. Arifin" }, { name: "Bp. Sanjaya" }, { name: "Bp. Alvin" },
          { name: "Bp. Charles" }, { name: "Bp. Santoso" }, { name: "Bp. Agus" },
          { name: "Bp. Ali Kurniawan" }, { name: "Bp. Adit" },
        ],
      },
      {
        title: { id: "Konsumsi", en: "Catering" },
        members: [
          { name: "Ibu Yenny / Aing" }, { name: "Ibu Cide" }, { name: "Ibu Herlie" },
          { name: "Ibu-Ibu Tjie Thien Ta Sen Bio" },
        ],
      },
      {
        title: { id: "Perlengkapan", en: "Logistics" },
        members: [
          { name: "Bp. Dedy Susanto" }, { name: "Kevin" }, { name: "Hasan" },
          { name: "Agus" }, { name: "Chandra" }, { name: "Hani" }, { name: "Enro" },
          { name: "Simpatisan" },
        ],
      },
      {
        title: { id: "Keamanan", en: "Security" },
        members: [
          { name: "Kapolsek Neglasari" }, { name: "Bimas Neglasari" },
          { name: "Babinsa Neglasari" }, { name: "Ketua RW 02" },
          { name: "Ketua RT 02" }, { name: "Ketua ORARI Lokal Tangerang" },
        ],
      },
      {
        title: { id: "Acara, Seni, & Budaya", en: "Programme, Arts & Culture" },
        members: [
          { name: "Ibu Tan Ai Cen" },
          { name: "Bp. Yuidi Hardiman" },
          { name: "Bp. Dedi HLT (Liong & Barongsai)" },
        ],
      },
      {
        title: { id: "Akomodasi & Transportasi", en: "Accommodation & Transport" },
        members: [
          { name: "Bp. Efendi Lukias" }, { name: "Bp. Vendy Susanto" }, { name: "Bp. Asien" },
        ],
      },
      {
        title: { id: "Humas, Umum & Birokrasi", en: "Public Relations & Administration" },
        members: [
          { name: "Bp. Willy" }, { name: "Bp. Tommy" },
        ],
      },
      {
        title: { id: "Dokumentasi & Promosi", en: "Documentation & Promotion" },
        members: [{ name: "Bp. Dwi Pundarika" }],
      },
      {
        title: { id: "P3K", en: "First Aid" },
        members: [{ name: "dr. Lily Suryadi" }],
      },
    ] satisfies CommitteeGroup[],
    signatories: [
      { role: "Ketua Panitia", name: "Fiter Lie" },
      { role: "Sekretaris",    name: "Lukas Susanto" },
    ],
  },

  // ─── sponsorship tiers ────────────────────────────────────────
  sponsors: [
    {
      rank: "01",
      name: { id: "Sponsor Utama", en: "Principal Sponsor" },
      contribution: { id: "Kontribusi di atas Rp 20.000.000++", en: "Contribution above Rp 20,000,000++" },
      perks: [
        { id: "1 halaman penuh (full color) di bagian depan",        en: "Full-page color ad on the front section" },
        { id: "Logo pada cover belakang",                            en: "Logo on the back cover" },
        { id: "Penyebutan nama dalam acara",                         en: "Name mention during the event" },
      ],
      badge: { id: "Hanya 3 sponsor — 1 depan & 2 belakang", en: "Only 3 sponsors — 1 front & 2 back" },
    },
    {
      rank: "02",
      name: { id: "Sponsor Madya", en: "Mid-tier Sponsor" },
      contribution: { id: "Rp 20.000.000", en: "Rp 20,000,000" },
      perks: [
        { id: "1 halaman penuh (full color)",  en: "Full-page color ad" },
        { id: "Logo dalam halaman khusus sponsor", en: "Logo on dedicated sponsor page" },
      ],
    },
    {
      rank: "03",
      name: { id: "Sponsor Pendukung", en: "Supporting Sponsor" },
      contribution: { id: "Mulai Rp 2.500.000", en: "From Rp 2,500,000" },
      perks: [
        { id: "½ halaman (hitam putih / full color) — Rp 10.000.000", en: "½ page (B/W / full color) — Rp 10,000,000" },
        { id: "¼ halaman (hitam putih / warna terbatas) — Rp 5.000.000", en: "¼ page (B/W / limited color) — Rp 5,000,000" },
        { id: "1/8 halaman (hitam putih / warna terbatas) — Rp 2.500.000", en: "1/8 page (B/W / limited color) — Rp 2,500,000" },
      ],
    },
    {
      rank: "04",
      name: { id: "Donatur Pendukung", en: "Supporting Donor" },
      contribution: { id: "Dana sukarela", en: "Voluntary contribution" },
      perks: [
        { id: "Pencantuman nama / logo kecil pada spanduk sponsor",  en: "Small name / logo on the sponsor banner" },
      ],
    },
  ] satisfies SponsorTier[],
  sponsorNote: {
    id: "Semua sponsor & donatur akan dicetak dalam 1 spanduk dan dipasang selama acara berlangsung.",
    en: "All sponsors and donors will be printed on a single banner displayed throughout the event.",
  },

  // ─── sponsor roster (logos) ───────────────────────────────────
  sponsorLogos: [
    { slug: "astic-group",                    name: "ASTIC Group",                                            rank: 1 },
    { slug: "borobudur-lotus-artfest",        name: "Borobudur Lotus Artfest",                                rank: 1 },
    { slug: "bangun-jaya-group",              name: "Bangun Jaya Group",                                      rank: 1 },
    { slug: "dextone-avian",                  name: "Dextone · Abrasive · Provioz · Veloz",                   rank: 1 },
    { slug: "new-armada",                     name: "New Armada · PT Bumen Redja Abadi",                      rank: 1 },

    { slug: "dominique-jewellery",            name: "Dominique Jewellery",                                    rank: 2 },
    { slug: "handphone-tiam",                 name: "Handphone Tiam",                                         rank: 2 },
    { slug: "kapal-api",                      name: "Kapal Api",                                              rank: 2 },
    { slug: "putra-jaya",                     name: "Putra Jaya",                                             rank: 2 },
    { slug: "gibrig-indonesia-bersih",        name: "PT Gibrig Indonesia Bersih · Aneka Plastindo · Sushi Abe",rank: 2 },
    { slug: "cap-panda",                      name: "Cap Panda",                                              rank: 2 },

    { slug: "kalimasadha-nusantara",          name: "Kalimasadha Nusantara",                                  rank: 3 },
    { slug: "aldana-mitrasarana-kita",        name: "PT Aldana Mitrasarana Kita",                             rank: 3 },
    { slug: "kotaminyak",                     name: "KMI Solution · Kotaminyak",                              rank: 3 },
    { slug: "maju-jaya-plasindo",             name: "PT Maju Jaya Plasindo",                                  rank: 3 },
    { slug: "mayapada-hospital",              name: "Mayapada Hospital",                                      rank: 3 },
    { slug: "surya-jaya",                     name: "Surya Jaya",                                             rank: 3 },
    { slug: "palais-contruction",             name: "Palais Contruction · Tjoetji Sepatoe",                   rank: 3 },
    { slug: "global-copier",                  name: "Global Copier",                                          rank: 3 },

    { slug: "megajaya-masterbatch",           name: "PT Megajaya Masterbatch",                                rank: 4 },
    { slug: "yuro-sport",                     name: "Toko Yuro Sport",                                        rank: 4 },
    { slug: "polytech-chemical",              name: "PT Polytech Chemical Indonesia",                         rank: 4 },
    { slug: "pingan-pingsu-plastic",          name: "PT Pingan Pingsu Plastic",                               rank: 4 },
    { slug: "fajar-jaya-agung",               name: "PT Fajar Jaya Agung",                                    rank: 4 },
    { slug: "utama-jaya-sukses",              name: "CV Utama Jaya Sukses",                                   rank: 4 },
    { slug: "elephant-springbed",             name: "Elephant Spring & Latex Bed",                            rank: 4 },
    { slug: "tirta-samudra-emas",             name: "PT Tirta Samudra Emas",                                  rank: 4 },
    { slug: "wahana-trilintas-mining",        name: "PT Wahana Trilintas Mining",                             rank: 4 },
    { slug: "pakons-prime",                   name: "Pakons Prime",                                           rank: 4 },
    { slug: "maju-makmur-prima",              name: "Maju Makmur Prima",                                      rank: 4 },
    { slug: "sariwangi-mentari",              name: "PT Sariwangi Mentari",                                   rank: 4 },
    { slug: "bakpau-kue-555",                 name: "Bakpau & Kue 555",                                       rank: 4 },

    { slug: "daai-tv",                        name: "DAAI TV",                                                rank: 5 },
    { slug: "mediapers",                      name: "MP MediaPers",                                           rank: 5 },
    { slug: "actual-news",                    name: "Actual News",                                            rank: 5 },
    { slug: "detik-suara-rakyat",             name: "Detik Suara Rakyat",                                     rank: 5 },
    { slug: "mandiri-kasih",                  name: "Mandiri Kasih",                                          rank: 5 },
    { slug: "universitas-buddhi-dharma",      name: "Universitas Buddhi Dharma",                              rank: 5 },

    // Received 31 Aug as PDF. Eight of these nine are not in the treasurer's
    // ledger as of 22 Aug, so no contribution bracket is known for them; they sit
    // in rank 5, which asserts nothing about what was paid. Re-rank once the
    // committee confirms. Nara JW Lawfirm is the ledger's "Lawyer Nara Jw" —
    // a firm, not a person, so it moves off the donor roll and onto the wall.
    { slug: "ichitan",                        name: "Ichitan",                                                rank: 5 },
    { slug: "vajrayana-buddhist-indonesia",   name: "Vajrayana Buddhist Indonesia",                           rank: 5 },
    { slug: "andika-mas",                     name: "Toko Mas Andika Mas",                                    rank: 5 },
    { slug: "menembus-batas",                 name: "MB Menembus Batas",                                      rank: 5 },
    { slug: "tng-tv",                         name: "TNG TV",                                                 rank: 5 },
    { slug: "disbudpar-kota-tangerang",       name: "Disbudpar Kota Tangerang",                               rank: 5 },
    { slug: "bakorsiskom-polsekta",           name: "Bakorsiskom Polsekta Tangerang",                         rank: 5 },
    { slug: "kota-tangerang",                 name: "Kota Tangerang",                                         rank: 5 },
    { slug: "nara-jw-lawfirm",                name: "Nara JW Lawfirm",                                        rank: 4 },
  ] satisfies SponsorLogo[],

  // ─── donatur tanpa logo (teks / gulungan) ─────────────────────
  // Source: the treasurer's ledger "Dana Kirab Budaya 2026.xlsx" (Drive
  // 1Uk9_vhpLmVPuSjG-nnPpzPqgKKjV3qlD), rows classified as a personal gift with no
  // company logo. Ledger order preserved. Bookkeeping prefixes (A.n, Dana dari)
  // stripped; nothing else guessed at. Needs proofreading aloud by the committee.
  sponsorDonors: [
    { name: "Quency Nathaniel Kertasasmita",             chineseName: "Cang Fong Ling" },
    { name: "Gloria Nathaniel Kertasasmita",             chineseName: "Cang Fong Cen" },
    { name: "Rudy Setiawan & Keluarga",                  city: "Magelang" },
    { name: "Tommy & Keluarga" },
    { name: "Ibu Yatie" },
    { name: "Ibu Phang Ki Moy",                          city: "Bogor" },
    { name: "Ko Agus" },
    { name: "Thong Sin Nio" },
    { name: "Lo Ce Min" },
    { name: "Yap Yun Fui",                               city: "Bayur" },
    { name: "Lo Cing Cung" },
    { name: "Tonny Setiawan" },
    { name: "Bp. Frans" },
    { name: "Bp. Suryono" },
    { name: "Lily" },
    { name: "Andry Suryadi W & Keluarga",                city: "Tangerang" },
    { name: "Benny Nova & Lany Nova" },
    { name: "Marsan & Eni" },
    { name: "Alm. Hauw Hin Bih & Lien Nio",              city: "Cikupa" },
    { name: "Laurent Wang & Vincent Ong" },
    { name: "Sukarto & Keluarga" },
    { name: "Hendra Setiadi Thjia & Keluarga" },
    { name: "Chia Thiam Hua & Keluarga" },
    { name: "Rudy Lisven" },
    { name: "Thedy Oentoro" },
    { name: "Lo Cin Ying" },
    { name: "Lo Jing Ming / Andri" },
    { name: "Tono Chang" },
    { name: "Rudi Gunawan / Ate & Keluarga",             city: "Lampung" },
    { name: "Jilly & Family" },
    { name: "Yongcen & Family" },
    { name: "Djemi Tejo Sukmono & Janty Setiawan" },
    { name: "Bun Khiok Hok" },
    { name: "Liauw Denny & Keluarga" },
    { name: "Mr. Alwi" },
    { name: "Mr. Kwan Ping" },
    { name: "Ria" },
    { name: "Ibu Lie Dian",                              city: "Jakarta" },
    { name: "Mrs. Nina",                                 city: "Jakarta" },
    { name: "Rita Iskandar" },
    { name: "Claudya" },
    { name: "Halim Susanto",                             city: "Palembang" },
    { name: "Ko Bebeng & Keluarga" },
  ] satisfies SponsorDonor[],

  share: {
    siteUrl: "https://undangan-digital-kirab.liefisca.com",
  },
} as const;

export type Invitation = typeof invitation;
