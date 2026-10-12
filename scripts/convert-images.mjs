import sharp from "sharp";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../img/Social.jpeg", import.meta.url));
const png = fileURLToPath(new URL("../img/Social.png", import.meta.url));
const webp = fileURLToPath(new URL("../img/Social.webp", import.meta.url));
const widths = [320, 480];

await sharp(source).png().toFile(png);
await sharp(source).webp({ quality: 80 }).toFile(webp);

for (const width of widths) {
    await sharp(source)
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: 75 })
        .toFile(fileURLToPath(new URL(`../img/Social-${width}.jpeg`, import.meta.url)));

    await sharp(source)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(fileURLToPath(new URL(`../img/Social-${width}.webp`, import.meta.url)));
}

console.log(`Imagem original convertida e variantes responsivas geradas em ${new URL("../img/", import.meta.url).pathname}`);
