import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    base: "./",
    build: {
        rollupOptions: {
            input: {
                index: fileURLToPath(new URL("./index.html", import.meta.url)),
                cadastro: fileURLToPath(new URL("./cadastro.html", import.meta.url)),
                "html/index": fileURLToPath(new URL("./html/index.html", import.meta.url)),
                "html/projetos": fileURLToPath(new URL("./html/projetos.html", import.meta.url)),
                "html/cadastro": fileURLToPath(new URL("./html/cadastro.html", import.meta.url))
            }
        }
    },
    root
});
