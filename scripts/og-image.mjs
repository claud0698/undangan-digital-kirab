import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.join(root, "public/gallery/gate.webp");
const out = path.join(root, "public/og-image.jpg");

const W = 1200, H = 630;

const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(20,4,4,0.55)"/>
      <stop offset="55%" stop-color="rgba(20,4,4,0.78)"/>
      <stop offset="100%" stop-color="rgba(20,4,4,0.92)"/>
    </linearGradient>
    <linearGradient id="goldText" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f3d068"/>
      <stop offset="100%" stop-color="#b48536"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>

  <!-- corner ornaments -->
  <g fill="none" stroke="#d8a847" stroke-width="1.5" opacity="0.75">
    <path d="M 30 30 L 110 30 M 30 30 L 30 110 M 30 50 L 90 50 L 90 30 M 50 30 L 50 90 L 30 90"/>
    <path d="M ${W - 30} 30 L ${W - 110} 30 M ${W - 30} 30 L ${W - 30} 110 M ${W - 30} 50 L ${W - 90} 50 L ${W - 90} 30 M ${W - 50} 30 L ${W - 50} 90 L ${W - 30} 90"/>
    <path d="M 30 ${H - 30} L 110 ${H - 30} M 30 ${H - 30} L 30 ${H - 110} M 30 ${H - 50} L 90 ${H - 50} L 90 ${H - 30} M 50 ${H - 30} L 50 ${H - 90} L 30 ${H - 90}"/>
    <path d="M ${W - 30} ${H - 30} L ${W - 110} ${H - 30} M ${W - 30} ${H - 30} L ${W - 30} ${H - 110} M ${W - 30} ${H - 50} L ${W - 90} ${H - 50} L ${W - 90} ${H - 30} M ${W - 50} ${H - 30} L ${W - 50} ${H - 90} L ${W - 30} ${H - 90}"/>
  </g>

  <!-- 慈 seal -->
  <circle cx="${W / 2}" cy="135" r="55" fill="rgba(74,8,8,0.7)" stroke="#d8a847" stroke-width="1.5"/>
  <text x="${W / 2}" y="158" text-anchor="middle" font-family="Noto Serif SC, serif" font-size="58" font-weight="700" fill="url(#goldText)">慈</text>

  <!-- eyebrow -->
  <text x="${W / 2}" y="240" text-anchor="middle" font-family="Cinzel, serif" font-size="18" letter-spacing="6" fill="#e9cf86" opacity="0.85">— MEMPERINGATI HUT KE-43 TAHUN —</text>

  <!-- title -->
  <text x="${W / 2}" y="305" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="56" font-weight="700" fill="#f4e9d4">Kirab Budaya &amp; Ruwat Bumi 2026</text>

  <!-- chinese -->
  <text x="${W / 2}" y="360" text-anchor="middle" font-family="Noto Serif SC, serif" font-size="28" letter-spacing="14" fill="#d8a847">巡 遊 大 典</text>

  <!-- temple line -->
  <text x="${W / 2}" y="415" text-anchor="middle" font-family="Cormorant Garamond, serif" font-style="italic" font-size="28" fill="#e9cf86">Tjie Thien Ta Sen Bio · Tangerang</text>

  <!-- divider -->
  <line x1="${W / 2 - 90}" y1="455" x2="${W / 2 - 12}" y2="455" stroke="#b48536" stroke-width="1"/>
  <circle cx="${W / 2}" cy="455" r="3" fill="#d8a847"/>
  <line x1="${W / 2 + 12}" y1="455" x2="${W / 2 + 90}" y2="455" stroke="#b48536" stroke-width="1"/>

  <!-- date row -->
  <text x="${W / 2}" y="510" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="56" font-weight="600" fill="#f4e9d4">24 · 25 · 26 · 27</text>
  <text x="${W / 2}" y="555" text-anchor="middle" font-family="Cinzel, serif" font-size="18" letter-spacing="8" fill="#d8a847">SEPTEMBER 2026</text>

  <!-- bottom subline -->
  <text x="${W / 2}" y="595" text-anchor="middle" font-family="Cinzel, serif" font-size="11" letter-spacing="6" fill="#b48536">PWE GWEE 14 — 17 · IMLEK 2577</text>
</svg>`;

await sharp(src)
  .resize(W, H, { fit: "cover", position: "center" })
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(out);

console.log("Wrote", out);
