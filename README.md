# ⚡ PULSO — Rede de Comunicação Local

> **A sua cidade em uma nova frequência.**  
> Uma nova maneira de conectar comércios, empresas, instituições e moradores através de uma infraestrutura digital integrada para cidades pequenas e médias do interior.

---

## 📌 Sobre o Projeto

No interior do Brasil, os carros de som e panfletos físicos ainda são os meios mais comuns de divulgação para o comércio local. A **Rede PULSO** nasce como uma proposta contemporânea, inteligente e sustentável para modernizar essa comunicação.

O projeto reúne múltiplos canais em um único ecossistema, permitindo que lojistas e prestadores de serviços alcancem a população com agilidade, sem gerar poluição sonora nas ruas e sem depender exclusivamente de algoritmos imprevisíveis das redes sociais.

> [!NOTE]
> Este repositório contém a **landing page institucional e de apresentação de conceito** do projeto pioneiro. Não inclui plataformas administrativas, backend de anúncios ou sistemas de autenticação, que fazem parte do roadmap futuro.

---

## 📡 Visão Multicanal da Rede

A proposta da PULSO é integrar gradualmente os seguintes canais:

1. **📻 Rádio Digital pela Internet**: Programação musical contínua, notícias locais e veiculação de spots comerciais transmitidos online (ouvida no trânsito, no celular ou nos estabelecimentos).
2. **💬 Distribuição via WhatsApp**: Canal verificado para envio autorizado de ofertas do dia, comunicados e utilidade pública para moradores cadastrados voluntariamente.
3. **🌐 Portal & Vitrine Local**: Um ponto de encontro centralizado na web com guia comercial, agenda de eventos, classificados e notícias da região.
4. **📱 Conteúdos para Redes Sociais**: Materiais audiovisuais padronizados e profissionais para ampliar a presença digital das marcas parceiras.

---

## 🎨 Identidade Visual (GTA 6 Vice City Aesthetic)

A identidade visual foi desenvolvida com forte apelo estético inspirado no universo contemporâneo de **GTA 6 (Vice City / Leonida)**, equilibrando modernidade tecnológica e credibilidade institucional:

- **Paleta Sunset Neon**: *Sunset Pink* (`#ff2a85`), *Tangerine/Amber* (`#ff7300` / `#f59e0b`) e *Vice Cyan / Electric Blue* (`#00f0ff` / `#0284c7`).
- **Modo Escuro (Dark Mode)**: Imersão em tons *Midnight Obsidian* (`#080914`), com linhas de grade cibernéticas sutis, efeitos de iluminação e bordas neon.
- **Modo Claro (Light Mode)**: Fundo limpo, contemporâneo e de alto contraste em ardósia/off-white (`#fcfcfd`), garantindo legibilidade perfeita e sofisticação.
- **Alternador de Tema**: Botão Sol / Lua no cabeçalho com transição fluida e persistência via `localStorage`.

---

## 📑 Estrutura da Landing Page

- **Navbar**: Logotipo dinâmico com insígnia de pulso elétrico, links de navegação suave, alternador de tema e botão CTA.
- **Hero Section**: Headline marcante, proposta de valor e composição gráfica original (**PULSO HUB**) com equalizador de áudio animado e simulações de canais conectados.
- **Card de Contadores (`+0`)**: Demonstração transparente do estágio inaugural (`Cidades +0`, `Estabelecimentos +0`, `Canais Ativos +0`, `Moradores +0`) com convite para parceiros fundadores.
- **O Cenário (O Problema)**: Abordagem respeitosa sobre os limites de circulação física dos carros de som e dispersão de informações.
- **A Solução**: Detalhamento dos 4 canais planejados com selo de transparência de escopo.
- **Como Funciona**: Fluxo de 4 etapas (*Preparo → Organização → Distribuição → Acompanhamento pela comunidade*).
- **Para Quem É**: Segmentação para comércio local, alimentação, saúde, serviços, eventos, entidades e moradores.
- **Visão de Futuro & Manifesto**: Pilares de sustentabilidade urbana e respeito ao espaço público.
- **Formulário de Interesse Pioneiro**: Validação de campos em tempo real, máscara de WhatsApp e modal completo de **Política de Privacidade** (em conformidade com a LGPD).
- **Footer**: Links úteis, canais previstos, contatos oficiais e direitos autorais.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Turbopack)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Biblioteca de UI**: [React](https://react.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- Gerenciador de pacotes `npm`

### Instalação

1. Clone o repositório ou navegue até a pasta do projeto:
   ```bash
   cd voz-local
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra no navegador:
   ```
   http://localhost:3000
   ```

### Build de Produção

Para testar o build estático otimizado:
```bash
npm run build
npm run start
```

---

## 🌐 Deploy na Vercel

O projeto está 100% otimizado para deploy imediato na Vercel:

1. Faça push deste repositório para o seu GitHub/GitLab.
2. Acesse [vercel.com](https://vercel.com) e importe o repositório.
3. O Next.js será identificado automaticamente. Clique em **Deploy**.
4. Em menos de 1 minuto a sua landing page estará no ar com link público HTTPS.

---

## ⚖️ Licença & Termos Institucionais

Desenvolvido para apresentação e validação da marca **PULSO — Rede de Comunicação Local**.  
Todos os direitos reservados © 2026.
