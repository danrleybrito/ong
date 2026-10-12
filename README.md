# ONG Esperança

Projeto de estudo de um site para a ONG Esperança, com páginas informativas e uma API simples para cadastro de voluntários.

## Estrutura

- `index.html`: página inicial do site.
- `cadastro.html`: página de cadastro de voluntários.
- `css/style.css`: estilos do site.
- `css/js/script.js`: código JavaScript do site.
- `css/js/api/`: API Node.js/Express para os dados de voluntários.
- `html/`: páginas HTML adicionais do projeto.
- `img/`: imagens usadas pelo site.

Para regenerar as versões PNG e WebP da imagem JPEG original, bem como variantes responsivas JPEG/WebP de 320 e 480 pixels, execute `npm run images:convert` na raiz do projeto. A página de projetos usa `picture`, `srcset` e `sizes` para o navegador escolher o formato e a resolução mais adequados à viewport e à densidade do ecrã; a imagem original de 678 pixels é o candidato de maior resolução.

## Aparência e acessibilidade

Use o seletor **Aparência** no cabeçalho para escolher entre seguir a preferência do sistema, tema claro, tema escuro ou alto contraste. A escolha manual fica guardada neste navegador. A página também respeita as cores forçadas do sistema operacional.

## Requisitos

- Node.js e npm.

## Executar o site

Na raiz do projeto, instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

O Vite serve as páginas e atualiza o navegador durante o desenvolvimento. As entradas são `index.html`, `cadastro.html` e as páginas em `html/`.

Para gerar os arquivos prontos para hospedagem:

```bash
npm run build
npm run preview
```

O site compilado é gerado em `dist/`. Esse diretório não deve ser versionado.

## Deploy no GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` compila o site e publica o conteúdo
de `dist/` no GitHub Pages sempre que há um push em `main` ou quando o workflow é
executado manualmente. Na primeira execução, confirme em **Settings > Pages** que
a origem está definida como **GitHub Actions** caso o GitHub solicite essa
configuração. Para este repositório, o endereço esperado é
`https://danrleybrito.github.io/ong/`.

A publicação hospeda somente o frontend estático. A API Express em `css/js/` não
é executada pelo GitHub Pages, e o formulário atual guarda os dados no
`localStorage` do navegador; os cadastros não são enviados a um servidor nem
compartilhados entre dispositivos.

## Executar a API

Instale as dependências e inicie o servidor:

```bash
cd css/js
npm install
npm start
```

A API ficará disponível em `http://localhost:3000/api`. Para verificar se está respondendo, acesse esse endereço no navegador. Os voluntários são armazenados em `css/js/api/voluntarios.json`, arquivo de dados local ignorado pelo Git.

Durante o desenvolvimento, use `npm run api` na raiz do projeto para iniciar a API com reinicialização automática. A API continua usando seu próprio `package.json` em `css/js/`.

## Contribuição

O projeto segue Gitflow e versionamento semântico. Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para orientações sobre branches, releases, issues, milestones e pull requests.
