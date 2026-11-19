# FOLIO — Gerador de Currículos Profissionais Gratuito

Plataforma aberta, gratuita e sem necessidade de cadastro para criação de currículos profissionais em formato **ISO 216 A4 (210 × 297 mm)**, projetada com direção de arte editorial contemporânea, tipografia suíça e arquitetura *local-first* (salvamento local no navegador, privacidade por padrão e exportação em PDF vetorial sem marcas d’água).

---

## 1. Direção de Arte & Design System

### Paleta de Cores Base
| Token | Hexadecimal | Função Editorial |
| :--- | :--- | :--- |
| `ivory` | `#F3EFE6` | Papel marfim principal (superfície de leitura confortável) |
| `ink` | `#191919` | Grafite profundo (tipografia principal, fios estruturais e contraste) |
| `vermilion` | `#D94732` | Vermelho editorial (destaque intencional, índices, selos e foco) |
| `paper` | `#C8C1B4` | Cinza papel (linhas divisórias finas, cotas e grade suíça) |
| `sheet` | `#FFFFFF` | Branco puro (exclusivo para a representação física das folhas A4) |

### Sistema Tipográfico
- **Títulos e Chamadas Editoriais:** `Instrument Serif` & `Newsreader`
- **Corpo, Formulários e Navegação:** `Plus Jakarta Sans`
- **Legendas Técnicas e Cotas:** `JetBrains Mono`

---

## 2. Biblioteca de Cinco Modelos Profissionais A4

1. **M·01 — ESSENCIAL (`SÉRIE SUÍÇA`)** — Minimalista, linear e com compatibilidade máxima em sistemas ATS.
2. **M·02 — EDITORIAL (`SÉRIE LAUDA`)** — Duas colunas assimétricas (68% / 32%) com forte personalidade tipográfica.
3. **M·03 — CLÁSSICO (`SÉRIE CÁTEDRA`)** — Tradicional, simétrico e formal para áreas jurídicas, acadêmicas e financeiras.
4. **M·04 — EXECUTIVO (`SÉRIE DIRETORIA`)** — Hierarquia de liderança com faixa superior estruturada e foco em impacto.
5. **M·05 — TÉCNICO (`SÉRIE ENGENHARIA`)** — Grade modular para tecnologia, engenharia e dados com painel de competências.

---

## 3. Principais Funcionalidades

- **Editor de 9 Seções com Pré-visualização A4 em Tempo Real** (`/editor`, protegido por `noindex, nofollow`).
- **Modo Primeiro Emprego / Sem Experiência**, adaptando a estrutura curricular automaticamente.
- **Paginação Multi-Página A4 e Exportação PDF Vetorial** (texto selecionável e pesquisável via `jsPDF`, sem marcas d’água).
- **SEO Técnico e Páginas Públicas de Conteúdo:** `/modelos-de-curriculo`, `/curriculo-primeiro-emprego`, `/curriculo-sem-experiencia`, `/como-fazer-um-curriculo` e `/curriculo-profissional`.
- **Transparência e Conformidade:** `/privacidade`, `/termos-de-uso`, `/contato` e página 404 dedicada.
- **Sustentabilidade Independente:** Arquitetura modular para Google AdSense (somente em páginas públicas, nunca no editor), recuperação de Adblock dispensável e doações voluntárias via Pix EMV/BR Code (`/apoie`).

---

## 4. Execução Local e Operação

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Verificar tipagem TypeScript
npm run lint

# 4. Executar suíte completa de testes automatizados (Vitest + Testing Library)
npm run test

# 5. Gerar build de produção (saída em dist/)
npm run build

# 6. Pré-visualizar o build de produção localmente
npm run preview
```

Para o manual completo de manutenção, variáveis de ambiente, domínio, AdSense, Search Console, atualização de dados Pix, deploy na Vercel e rollback, consulte **[OPERACAO.md](./OPERACAO.md)**.
