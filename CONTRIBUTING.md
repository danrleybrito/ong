# Fluxo de desenvolvimento

Este projeto usa Gitflow:

- `main`: versao estavel publicada. Nao desenvolva diretamente nesta branch.
- `develop`: integracao das proximas alteracoes.
- `feature/<nome>`: novas funcionalidades, criadas a partir de `develop` e integradas de volta a `develop`.
- `release/<versao>`: preparacao de uma versao, criada a partir de `develop`; ao concluir, integrar em `main` e `develop` e criar uma tag de versao.
- `hotfix/<nome>`: correcao urgente, criada a partir de `main`; ao concluir, integrar em `main` e `develop` e criar uma tag de versao.

## Versionamento semantico

As releases estaveis usam o formato `vMAJOR.MINOR.PATCH` (por exemplo, `v1.4.2`):

- `MAJOR`: mudanca incompativel com a versao anterior.
- `MINOR`: funcionalidade nova compativel com a versao anterior.
- `PATCH`: correcao compativel, sem funcionalidade nova que altere o contrato existente.

Enquanto o projeto ainda nao tiver um compromisso de estabilidade, podem ser usadas versoes `v0.MINOR.PATCH`; antes de `v1.0.0`, a API nao deve ser considerada estavel. Versoes de pre-lancamento, quando necessarias, seguem o formato SemVer, como `v1.2.0-rc.1`, e nao representam uma release estavel.

O numero da proxima release deve refletir as mudancas acumuladas desde a ultima tag. Durante a preparacao, a branch deve se chamar `release/<versao-sem-v>`, por exemplo `release/1.2.0`. Depois de integrar a release em `main`, crie nela uma tag anotada com o prefixo `v`:

```bash
git switch main
git tag -a v1.2.0 -m "Release v1.2.0"
```

Se houver um remoto configurado, publique a branch e a tag:

```bash
git push origin main
git push origin v1.2.0
```

## Iniciar uma funcionalidade

```bash
git switch develop
git switch -c feature/nome-da-funcionalidade
```

Ao terminar, integre a branch em `develop` e remova a branch de funcionalidade.

## Issues, milestones e pull requests

Ao hospedar o repositorio no GitHub, use issues para registrar bugs e funcionalidades. Os formularios em `.github/ISSUE_TEMPLATE/` orientam a abertura desses relatos; use o link de contribuicao para duvidas que nao sejam bugs nem pedidos de funcionalidade.

Crie uma milestone no GitHub para cada release planejada, usando a versao SemVer como titulo (por exemplo, `v0.2.0`). Associe a milestone as issues que pretende concluir naquela versao. A milestone organiza o trabalho, mas nao cria uma release nem uma tag automaticamente.

Abra pull requests para integrar alteracoes:

- `feature/*` para `develop`;
- `release/*` para `main` e, apos concluir o lancamento, tambem para `develop`;
- `hotfix/*` para `main` e `develop`.

Use o modelo `.github/PULL_REQUEST_TEMPLATE.md`, descreva como validar a mudanca e vincule issues relacionadas com palavras-chave do GitHub, como `Closes #123`. Ao mesclar uma release em `main`, crie a tag anotada da versao conforme a secao de versionamento semantico.

Branches `release/*` e `hotfix/*` devem ser criadas apenas quando houver uma versao para preparar ou uma correcao urgente. Pull requests, issues e milestones sao recursos da plataforma de hospedagem e ficam disponiveis quando este repositorio for publicado nela.

O arquivo `css/js/api/voluntarios.json` e ignorado porque armazena dados pessoais gerados em tempo de execucao; nao o adicione ao Git.
