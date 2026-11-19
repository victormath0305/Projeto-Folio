# FOLIO — Gerador de Currículos (Fase 01: Identidade, Design System e Fundação)

Plataforma aberta e gratuita para criação de currículos profissionais em formato **ISO 216 A4 (210 × 297 mm)**, projetada com direção de arte editorial contemporânea, tipografia suíça e arquitetura *local-first* (sem necessidade de cadastro e sem marcas d’água).

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
- **Títulos e Chamadas Editoriais:** `Instrument Serif` & `Newsreader` (personalidade editorial, itálicos expressivos e numeração de seções).
- **Corpo, Formulários e Navegação:** `Plus Jakarta Sans` (sans-serif geométrica/humanista de altíssima legibilidade em telas e impressos).
- **Legendas Técnicas e Cotas:** `JetBrains Mono` (índices `§ 01`, dimensões `210 × 297 MM`, referências de matriz).

---

## 2. Matrizes Demonstrativas A4 Implementadas

1. **ESSENCIAL (`MATRIZ 01 / SÉRIE SUÍÇA`)** — Minimalista, direto e profissional. Grade linear de coluna única com compatibilidade máxima em sistemas ATS.
2. **EDITORIAL (`MATRIZ 02 / SÉRIE LAUDA`)** — Personalidade tipográfica e composição diferenciada em duas colunas assimétricas (68% / 32%).
3. **CLÁSSICO (`MATRIZ 03 / SÉRIE CÁTEDRA`)** — Tradicional e organizado, com cabeçalho simétrico e estrutura cronológica formal.

---

## 3. Como Executar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Verificar tipagem TypeScript
npm run lint

# 4. Executar suíte de testes automatizados (Vitest + Testing Library)
npm run test

# 5. Gerar build de produção
npm run build
```
