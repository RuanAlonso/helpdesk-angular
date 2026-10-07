# Fila de Suporte

Painel de chamados de suporte (service desk) feito com **Angular 20**, **TypeScript** e **SCSS**.
Pensado a partir da rotina real de suporte e sustentação de sistemas: fila priorizada, SLA, histórico de atendimento.

> Demo: _adicione aqui o link do GitHub Pages depois do deploy_

## Funcionalidades

- **Fila de hoje**: chamados com SLA vencido em destaque, situação da fila por status, abertos por prioridade e últimas atualizações
- **Lista de chamados** com busca por texto e filtros por status e prioridade
- **Detalhe do chamado**: troca de status, histórico de comentários, prazo de SLA
- **Criar e editar chamados** com formulários reativos e validação
- Dados persistidos no navegador (localStorage), sem necessidade de back-end
- Layout responsivo, navegação por teclado e foco visível

## Tecnologias e conceitos aplicados

- Angular 20 com componentes standalone e novo controle de fluxo (`@if`, `@for`, `@let`)
- Signals (`signal`, `computed`, `effect`, `input`)
- Roteamento com lazy loading (`loadComponent`) e binding de parâmetros de rota em `input()`
- Reactive Forms tipados (`NonNullableFormBuilder`) com validadores
- `HttpClient` para carregar os dados iniciais (`public/tickets.json`)
- Serviço central de dados (`TicketService`) com testes unitários (Jasmine)
- TypeScript estrito, modelos e tipos de união (`Status`, `Prioridade`)
- HTML semântico, CSS/SCSS próprio com variáveis (sem biblioteca de UI)

## Como rodar

Requisitos: Node.js 20.19+ ou 22+ e npm.

```bash
npm install
npm start          # http://localhost:4200
npm test           # testes unitários
npm run build      # build de produção em dist/
```

## Estrutura

```
src/app/
├── models/ticket.model.ts        # tipos, interfaces e rótulos
├── services/ticket.service.ts    # dados, regras de SLA e persistência
├── pages/
│   ├── dashboard/                # fila de hoje
│   ├── ticket-list/              # lista com filtros
│   ├── ticket-detail/            # detalhe e comentários
│   └── ticket-form/              # criar e editar
├── app.routes.ts                 # rotas com lazy loading
└── app.config.ts                 # providers (router, http, locale pt-BR)
public/tickets.json               # chamados de exemplo
```

## Deploy no GitHub Pages

1. Crie o repositório no GitHub e envie o código (branch `main`).
2. Em **Settings > Pages**, escolha **Source: GitHub Actions**.
3. O workflow `.github/workflows/deploy.yml` faz o build e publica a cada push.
4. O site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## Próximos passos (ideias)

- Trocar o localStorage por uma API REST (Flask/FastAPI/Node) usando `HttpClient`
- Login simulado com `CanActivateFn` e interceptor de autenticação
- Testes de componentes e testes E2E com Playwright
- Paginação e ordenação na lista
