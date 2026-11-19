# FOLIO — MANUAL OPERACIONAL E DE MANUTENÇÃO

Guia prático para o proprietário executar, testar, configurar, atualizar e manter o **FOLIO — Gerador de Currículos** com segurança em produção.

---

## 1. Requisitos e Instalação de Dependências

- **Node.js recomendado:** `26.x` (padrão exigido na Vercel em `package.json`).
- **Gerenciador de pacotes:** `npm` (incluso no Node.js).

```bash
# Instalar dependências conforme package-lock.json
npm ci
# ou, em desenvolvimento local:
npm install
```

---

## 2. Como Executar Localmente, Testar e Gerar Build

```bash
# Servidor local de desenvolvimento (Vite HMR)
npm run dev

# Validação estrita de tipos TypeScript
npm run lint

# Suíte de testes automatizados (Vitest + Testing Library)
npm run test

# Build otimizado de produção (gera a pasta dist/)
npm run build

# Pré-visualização local do build de produção
npm run preview
```

---

## 3. Configuração de Variáveis de Ambiente

Todas as configurações externas são centralizadas exclusivamente em `src/config/siteConfig.ts` e documentadas em `.env.example`.

- **Localmente:** crie um arquivo `.env.local` (ignorado pelo `.gitignore`).
- **Na Vercel:** acesse *Project Settings → Environment Variables* e adicione as variáveis desejadas para os ambientes *Production* e *Preview*.
- **Regra de segurança:** nunca faça commit de arquivos `.env`, `.env.local` ou `.env.production` no Git.

| Variável | Obrigatória? | Finalidade |
| :--- | :---: | :--- |
| `VITE_SITE_URL` | Recomendada | URL canônica definitiva do site (sem barra final), usada em Canonical, Open Graph e JSON-LD. |
| `VITE_CONTACT_EMAIL` | Recomendada | E-mail institucional exibido em `/contato` e `/privacidade`. |
| `VITE_GA_MEASUREMENT_ID` | Opcional | ID da propriedade GA4 (`G-XXXXXXXXXX`). Só carrega após consentimento explícito do usuário. |
| `VITE_GSC_VERIFICATION_TOKEN` | Opcional | Token da meta tag `google-site-verification` do Google Search Console. |
| `VITE_ADSENSE_CLIENT_ID` | Opcional | Publisher ID oficial do Google AdSense (`ca-pub-XXXXXXXXXXXXXXXX`). |
| `VITE_ADSENSE_SLOT_LANDING` | Opcional | ID numérico do bloco de anúncio da página inicial. |
| `VITE_ADSENSE_SLOT_CONTENT` | Opcional | ID numérico do bloco de anúncio das páginas públicas de conteúdo. |
| `VITE_ADSENSE_SLOT_FOOTER` | Opcional | ID numérico do bloco de anúncio acima do rodapé público. |
| `VITE_ADSENSE_ADBLOCK_RECOVERY` | Opcional | `true` para ativar a tag oficial de Ad Blocking Recovery do Google AdSense. |
| `VITE_ADSENSE_REQUIRE_CONSENT` | Opcional | `true` (padrão) para exigir consentimento publicitário antes de inicializar scripts do AdSense. |
| `VITE_PIX_KEY` | Opcional* | Sobrescreve a chave Pix padrão centralizada em `src/config/siteConfig.ts`. |
| `VITE_PIX_RECIPIENT_NAME` | Opcional* | Sobrescreve o nome do beneficiário exibido em `/apoie`. |
| `VITE_PIX_RECIPIENT_INSTITUTION` | Opcional* | Sobrescreve a instituição financeira exibida em `/apoie`. |
| `VITE_PIX_RECIPIENT_CITY` | Opcional* | Define a cidade no campo `60` do EMV BR Code (padrão: `BRASIL`, máx. 15 caracteres ASCII). |
| `VITE_PIX_TXID` | Opcional* | Identificador curto do pagamento Pix (padrão: `FOLIOAPOIO`). |

*\*Os dados oficiais de recebimento Pix do proprietário já estão centralizados como padrão em `src/config/siteConfig.ts`.*

---

## 4. Configuração de Domínio na Vercel

1. Importe o repositório GitHub na Vercel (Framework: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
2. Em *Project Settings → Domains*, adicione o domínio definitivo escolhido.
3. Configure os registros DNS (`A` ou `CNAME`) no registrador do domínio conforme orientação exata da Vercel.
4. Após o domínio propagar e o SSL (HTTPS) ficar ativo:
   - Defina `VITE_SITE_URL` com a URL definitiva na Vercel.
   - Atualize as URLs absolutas em `public/sitemap.xml`, `public/robots.txt` e `index.html` caso o domínio definitivo seja diferente do placeholder atual.
5. As rotas SPA (`/editor`, `/apoie`, `/privacidade`, `/modelos-de-curriculo`, etc.) já estão configuradas em `vercel.json` via `rewrites` para `/index.html`, preservando arquivos estáticos (`robots.txt`, `sitemap.xml`, `favicon.svg`, `og-card.svg`, `manifest.webmanifest`, `assets/`).

---

## 5. Configuração do Google Search Console

1. Acesse o [Google Search Console](https://search.google.com/search-console) e adicione sua propriedade de domínio.
2. Copie o token de verificação por tag HTML e configure em `VITE_GSC_VERIFICATION_TOKEN` na Vercel (ou valide diretamente via registro `TXT` no DNS).
3. Após a verificação, envie o sitemap em *Indexação → Sitemaps*: `https://SEU-DOMINIO/sitemap.xml`.
4. Confirme na ferramenta de inspeção de URL que `/editor` retorna `noindex, nofollow` e que as páginas públicas retornam `index, follow`.

---

## 6. Configuração do Google AdSense e Recuperação de Adblock

1. Cadastre o domínio definitivo no painel do Google AdSense e aguarde a aprovação do site.
2. Crie até três blocos de anúncios responsivos (*Display*) para: página inicial, páginas de guias públicos e rodapé público.
3. Preencha `VITE_ADSENSE_CLIENT_ID` e os respectivos `VITE_ADSENSE_SLOT_*` nas variáveis de ambiente da Vercel.
4. Para ativar o recurso oficial de recuperação de Adblock:
   - Configure a mensagem em *Privacidade e mensagens → Recuperação de bloqueio de anúncios* no painel do AdSense.
   - Defina `VITE_ADSENSE_ADBLOCK_RECOVERY=true` na Vercel.
5. **Garantia arquitetural:** o componente `EditorialAdSlot.tsx` bloqueia explicitamente a renderização na rota `/editor` e na impressão/PDF.

---

## 7. Como Atualizar os Dados Pix

Os dados públicos de recebimento Pix ficam centralizados em **um único arquivo**: `src/config/siteConfig.ts` (objeto `SITE_CONFIG.pix`).

- **Sem alterar código (recomendado):** atualize `VITE_PIX_KEY`, `VITE_PIX_RECIPIENT_NAME`, `VITE_PIX_RECIPIENT_INSTITUTION` ou `VITE_PIX_RECIPIENT_CITY` no painel da Vercel e dispare um redeploy.
- **No código-fonte:** edite apenas `src/config/siteConfig.ts`, rode `npm run test` e faça um novo commit.
- **Atenção:** nunca armazene senhas, tokens bancários ou chaves privadas no repositório; nunca envie a chave Pix para ferramentas de analytics ou logs.

---

## 8. Como Verificar Erros em Produção

- **Console do navegador (DevTools):** verifique a aba *Console* e a aba *Network* após o deploy, especialmente testando com bloqueador de anúncios ativo e desativado.
- **Vercel Logs / Analytics:** acompanhe erros de build, status HTTP e métricas Core Web Vitals no painel do projeto na Vercel.
- **Google Search Console:** monitore semanalmente relatórios de *Indexação de páginas*, *Experiência na página* e *Links quebrados (404)*.

---

## 9. Como Realizar uma Atualização Segura

1. Crie uma branch ou teste localmente as alterações desejadas.
2. Execute a bateria completa de validação antes de qualquer commit:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
3. Verifique com `git status` e `git diff` se nenhum arquivo `.env` ou dado sensível foi incluído.
4. Faça o commit e o push para o GitHub.
5. Na Vercel, valide primeiro na URL de **Preview** antes de promover para **Production**.

---

## 10. Como Voltar a uma Versão Anterior (Rollback)

- **Rollback instantâneo na Vercel (sem alterar Git):**
  1. Acesse *Deployments* no painel da Vercel.
  2. Localize o último deploy estável anterior.
  3. Clique no menu `...` → **Promote to Production** (ou **Instant Rollback**).
- **Rollback no repositório Git (preservando histórico):**
  ```bash
  # Reverte um commit específico de forma segura sem reescrever o histórico
  git revert <HASH_DO_COMMIT>
  git push origin main
  ```
