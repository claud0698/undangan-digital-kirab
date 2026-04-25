/**
 * Single source of truth for invitation content.
 * Source: PROPOSAL DANA KIRAB 2026.pdf (Tjie Thien Ta Sen Bio, Tangerang).
 */

export type Bilingual = { id: string; en: string };

export type ScheduleDay = {
  date: string;
  dateLabel: Bilingual;
  imlekLabel: string;
  timeRange: string;
  items: Bilingual[];
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
    tagline: { id: "Semarak Harmony Budaya & Tradisi", en: "Semarak Harmony Budaya & Tradisi" },
  },

  eventName: {
    id: "Kirab Budaya & Ruwat Bumi 2026",
    en: "Cultural Procession & Earth Blessing 2026",
  },
  eventTagline: {
    id: "Memperingati Sejit YMS Tjie Thien Ta Sen & HUT Tjie Thien Ta Sen Bio yang ke-43 Tahun",
    en: "Commemorating the Birthday of YMS Tjie Thien Ta Sen & the 43rd Anniversary of Tjie Thien Ta Sen Bio",
  },

  dateRange: { id: "24–27 September 2026", en: "24–27 September 2026" },
  imlekRange: "14–17 Pwe Gwee 2577 Imlek",
  startsAt: "2026-09-24T09:00:00+07:00",
  climaxAt: "2026-09-27T09:00:00+07:00",
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
    id: "Dalam rangka menyambut Sejit YMS TJIE THIEN TA SEN & HUT Tjie Thien Ta Sen Bio Ke-43 tahun, kami akan menyelenggarakan Kirab Budaya & Ruwat Bumi 2026. Sebagai penghormatan dan ungkapan rasa terima kasih kami kepada YMS TJIE THIEN TA SEN sebagai dewa pemberi berkah dan pembimbing yang kita yakini selalu memberikan kesehatan, keselamatan, perlindungan, dan kemakmuran bagi kita semua.",
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
      date: "2026-09-24",
      dateLabel: { id: "Kamis, 24 September 2026", en: "Thursday, 24 September 2026" },
      imlekLabel: "14 Pwe Gwee 2577 Imlek",
      timeRange: "09:00 WIB — Selesai",
      items: [
        { id: "Fangsen 1000 Ekor Ikan",        en: "Fangsen — Release of 1,000 Fish" },
        { id: "Cia Peng An",                   en: "Cia Peng An" },
        { id: "Pentas Seni Barongsai & Liong", en: "Barongsai & Liong Performance" },
        { id: "Pendarasan Sutra (Liam Keng)",  en: "Sutra Recitation (Liam Keng)" },
        { id: "Sembahyang Bersama",            en: "Communal Prayer" },
      ],
    },
    {
      date: "2026-09-25",
      dateLabel: { id: "Jumat, 25 September 2026", en: "Friday, 25 September 2026" },
      imlekLabel: "15 Pwe Gwee 2577 Imlek",
      timeRange: "09:00 WIB — Selesai",
      items: [
        { id: "San Kung",                          en: "San Kung" },
        { id: "Cia Peng An",                       en: "Cia Peng An" },
        { id: "Pemasangan 72 Lilin oleh Umat",     en: "Lighting of 72 Candles by Devotees" },
        { id: "Pentas Seni Barongsai",             en: "Barongsai Performance" },
        { id: "Persembahan 72 Macam Buah oleh Umat", en: "Offering of 72 Fruit Varieties by Devotees" },
        { id: "Pendarasan Sutra (Liam Keng)",      en: "Sutra Recitation (Liam Keng)" },
        { id: "Sembahyang Bersama",                en: "Communal Prayer" },
      ],
    },
    {
      date: "2026-09-26",
      dateLabel: { id: "Sabtu, 26 September 2026", en: "Saturday, 26 September 2026" },
      imlekLabel: "16 Pwe Gwee 2577 Imlek",
      timeRange: "09:00 WIB — Selesai",
      items: [
        { id: "San Kung",                                en: "San Kung" },
        { id: "Penerimaan Kiem Sin / Sen Siang & Kio / Joli", en: "Reception of Kiem Sin / Sen Siang & Kio / Joli" },
        { id: "Cia Peng An",                             en: "Cia Peng An" },
      ],
    },
    {
      date: "2026-09-27",
      dateLabel: { id: "Minggu, 27 September 2026 — Puncak Acara", en: "Sunday, 27 September 2026 — Climax" },
      imlekLabel: "17 Pwe Gwee 2577 Imlek · 八月十七",
      timeRange: "09:00 WIB — Selesai",
      climax: true,
      items: [
        { id: "San Kung",                                          en: "San Kung" },
        { id: "Ritual Persiapan Kirab",                            en: "Procession Preparation Ritual" },
        { id: "Cia Peng An",                                       en: "Cia Peng An" },
        { id: "Penyerahan Kiem Sin / Sen Siang ke Kio / Joli masing-masing", en: "Placement of Kiem Sin / Sen Siang into respective Kio / Joli" },
        { id: "Pelepasan Kirab Budaya & Ruwat Bumi 2026",          en: "Procession Send-off — Kirab Budaya & Ruwat Bumi 2026" },
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
      { role: "Wakil 1",                name: "Bp. Andrie" },
      { role: "Wakil 2",                name: "Bp. Effen Wijaya / Eddy" },
      { role: "Sekretaris 1",           name: "Bp. Lukas Susanto" },
      { role: "Sekretaris 2",           name: "Bp. Freddy" },
      { role: "Bendahara 1",            name: "Ibu Oeij Ailie" },
      { role: "Bendahara 2",            name: "Sdri. Liliany Candra" },
      { role: "Kord. Persembahyangan",  name: "Suhu Benny Susanto" },
    ],
    coordinators: [
      {
        title: { id: "Penerimaan Kimsin", en: "Kimsin Reception" },
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
        title: { id: "Joli / Kiauw", en: "Joli / Kiauw" },
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

  share: {
    siteUrl: "https://undangan-kirab.pages.dev",
  },
} as const;

export type Invitation = typeof invitation;
