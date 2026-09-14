# WbMonster Institutional Starter 🏛️

Boilerplate canônico para sites institucionais, portais corporativos e landing pages de alta autoridade no ecossistema WbMonster.

---

## 💎 Arquitetura & Diretrizes de Governança

1. **Engine Estática de Altíssimo Desempenho (Astro v5 + Tailwind CSS v4):**
   - Renderização estática pura (*Static Site Generation - SSG*).
   - Zero JavaScript enviado ao cliente nas seções institucionais.
   - Core Web Vitals otimizados para pontuação 98–100 no Google PageSpeed.
   - Suporte nativo a OpenGraph (WhatsApp, LinkedIn, Twitter) e Schema.org JSON-LD estruturado (`ProfessionalService`, `Organization`).

2. **Gestão de Conteúdo Git-Based (Keystatic CMS):**
   - Painel administrativo visual acessível em `/keystatic`.
   - Modificações de textos, seções, serviços e depoimentos salvam diretamente no Git (em JSON/Markdown tipado), eliminando scripts ad-hoc de correção (`fix_*.cjs`).
   - Sem dependência de banco de dados externo ou servidor dedicado.

3. **Design Editorial De-AI (Diretrizes `frontend-humanizer`):**
   - Paleta mineral autêntica (`#FBFBFA`, stone, ardósia, navy sóbrio).
   - Tipografia de autoridade com serifa clássica (*Newsreader*) + sem serifa moderna (*Plus Jakarta Sans*).
   - Veto rigoroso a clichês de IA (radial glows, pill badges pulsantes, tríades simétricas, textos inflados *"Não é apenas X, é Y"*).

4. **Prontidão para Deploy PaaS Dokku:**
   - Multi-stage `Dockerfile` com compilação estática do Astro e runtime ultraleve Nginx Alpine.
   - `nginx.conf` com compressão Gzip, cabeçalhos de segurança HTTP e cache imutável de 1 ano para assets estáticos.

---

## 🛠️ Comandos de Desenvolvimento

```bash
# Instalação das dependências
npm install

# Iniciar servidor de desenvolvimento (Site em localhost:4321 / CMS em localhost:4321/keystatic)
npm run dev

# Checagem de tipos e compilação de produção
npm run build

# Pré-visualização do build de produção
npm run preview

# Auditoria automatizada de qualidade com Lighthouse CI
npm run audit
```

---

## 📂 Estrutura de Diretórios

```
wbmonster-institutional-starter/
├── keystatic.config.ts        # Modelagem tipada dos schemas do Keystatic CMS
├── astro.config.mjs           # Configuração do Astro + Tailwind v4 + React + Keystatic
├── Dockerfile                 # Contêiner multi-stage de produção para Dokku
├── nginx.conf                 # Servidor HTTP otimizado com Gzip e Security Headers
├── lighthouserc.json          # Regras de auditoria de qualidade (Lighthouse CI)
├── src/
│   ├── content/               # Conteúdos versionados no Git (Settings, Hero, Serviços, FAQ)
│   │   ├── settings/
│   │   ├── home/
│   │   ├── services/
│   │   ├── testimonials/
│   │   └── faq/
│   ├── components/            # Catálogo de blocos institucionais modulares De-AI
│   │   ├── Navbar.astro
│   │   ├── HeroEditorial.astro
│   │   ├── TrustBar.astro
│   │   ├── ServicesScope.astro
│   │   ├── Testimonials.astro
│   │   ├── FaqSection.astro
│   │   ├── ContactSection.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── BaseLayout.astro   # Layout mestre com SEO, OpenGraph e Schema.org
│   ├── styles/
│   │   └── global.css         # Importações Tailwind v4 e fontes editoriais
│   └── pages/
│       ├── index.astro        # Homepage institucional
│       └── 404.astro          # Tratamento de página não encontrada
└── public/
    └── favicon.svg            # Favicon institucional
```

---

## 🚀 Como fazer Deploy no Dokku

Na VPS Hostinger (`129.121.54.26`):

```bash
# 1. Criar o app no Dokku
sudo dokku apps:create nome-do-site

# 2. Configurar domínio
sudo dokku domains:set nome-do-site site.wbmonster.com.br

# 3. Adicionar o remote git na máquina local e disparar o deploy
git remote add dokku dokku@129.121.54.26:nome-do-site
git push dokku main

# 4. Habilitar SSL gratuito automático Let's Encrypt
sudo dokku letsencrypt:enable nome-do-site
```
