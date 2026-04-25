import sharp from "sharp";
import { readdir } from "fs/promises";
import { join } from "path";

const dir = "public/gallery";
const files = (await readdir(dir)).filter(f => /\.(jpe?g|png)$/i.test(f));

for (const f of files) {
  const p = join(dir, f);
  const out = p.replace(/\.(jpe?g|png)$/i, ".jpg");
  const webp = p.replace(/\.(jpe?g|png)$/i, ".webp");
  // resize to max 1600 wide, jpg q=78 + webp q=72
  const img = sharp(p).resize({ width: 1600, withoutEnlargement: true });
  await img.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(out + ".tmp");
  await img.clone().webp({ quality: 72 }).toFile(webp);
  // replace original
  const { rename, unlink } = await import("fs/promises");
  if (out !== p) await unlink(p);
  await rename(out + ".tmp", out);
}
console.log("done");
