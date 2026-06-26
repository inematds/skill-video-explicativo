# 🎬 Skill `video-explicativo` — Vídeos explicativos com Claude Code

Repositório da Skill **`video-explicativo`** (Claude Code) + o **curso completo** no formato
**INEMA.CLUB** que ensina a usá-la. A Skill cria vídeos explicativos narrados (**HTML → MP4**) com o
framework [HyperFrames](https://github.com/heygen-com/hyperframes) — animados, em **PT-BR**, renderizados
**localmente, sem chave de API**, nos formatos **16:9** (YouTube) e **9:16** (Shorts/Reels).

> Este projeto nasceu de um vídeo que foi, ele mesmo, **feito por uma Skill**.

**Versão da Skill:** `v1.6.3` · esquema `v1.yy.xxx` (yy = recurso, xxx = bug) · histórico em [`skill/video-explicativo/CHANGELOG.md`](skill/video-explicativo/CHANGELOG.md).

---

## 📦 A Skill

A Skill `video-explicativo` está incluída neste repositório:

- **Pasta navegável:** [`skill/video-explicativo/`](skill/video-explicativo/)
- **Download (.zip):** [`downloads/video-explicativo.zip`](downloads/video-explicativo.zip)

### Instalação

Copie a pasta da skill para um dos diretórios que o Claude Code lê:

```bash
# Global (vale para todos os projetos)
cp -r skill/video-explicativo ~/.claude/skills/

# OU por projeto
cp -r skill/video-explicativo .claude/skills/
```

Ou baixe e descompacte o `.zip`:

```bash
unzip downloads/video-explicativo.zip -d ~/.claude/skills/
```

### Como usar

Depois de instalada, basta pedir um vídeo ao Claude Code em linguagem natural:

> *"faça um vídeo explicativo sobre X, em 16:9 e 9:16, terminando com a CTA do INEMA.CLUB."*

A Skill dispara automaticamente em pedidos como *"fazer um vídeo"*, *"vídeo explicativo"*,
*"vídeo sobre X"*, *"vídeo pra Shorts/Reels"*, *"mini tutorial em vídeo"* ou *"vídeo do INEMA"*.

### Pré-requisitos

Roda 100% local, sem chave de API. Você precisa de:

- **Node 22+** e **FFmpeg** (no git-bash, use `ffmpeg -nostdin`).
- **Chrome headless** do HyperFrames: `npx hyperframes browser ensure`.
- **TTS local Kokoro:** `pip install kokoro-onnx soundfile` (voz PT-BR `pf_dora`, sem espeak-ng).
- Diagnóstico: `npx hyperframes doctor`.

### O que a Skill faz (pipeline HTML → MP4)

1. **Plano de cenas** — o nº de cenas sai do **assunto**, não é fixo: cada beat do arco vira uma cena (range 4–12 + CTA). Default ~1:40–2:00; se o usuário fixar o número, ele manda.
2. **Roteiro** — `SCRIPT.md` com as cenas do plano, do primeiro princípio ao avançado, narração curta por cena.
3. **Projeto** — `npx hyperframes init` + house style dark premium.
4. **Fontes** — baixa `.woff2` locais (Sora / Inter / JetBrains Mono).
5. **Narração** — gera os WAVs por cena com Kokoro (voz `pf_dora`).
6. **Composição** — gerador **data-driven** (`SCENES[]` → N dinâmico) monta HTML + animação GSAP, com **mid-scene activity** (câmera Ken Burns embutida = anti-slideshow) e a **CTA anexada automaticamente** como última cena. Timing único = áudio batido com a animação.
7. **Validação** — `hyperframes lint` + `inspect` (0 erros de layout).
8. **Render** — gera **16:9** e **9:16** em `--quality high`, sempre terminando com a **cena de CTA do INEMA.CLUB**.

> Detalhes completos no [`skill/video-explicativo/SKILL.md`](skill/video-explicativo/SKILL.md) e nas
> [`references/`](skill/video-explicativo/references/) (pipeline, house style, gotchas).

### Stack
- **HyperFrames** — HTML → MP4 via Chrome headless + FFmpeg
- **Kokoro** — TTS local PT-BR (voz `pf_dora`, sem chave de API)
- **GSAP** — animação das cenas

---

## 🎨 Customização (o que está fixo na Skill)

A Skill tem **padrões fixos** (CTA do INEMA.CLUB, paleta dark âmbar, voz, formatos). Há dois níveis pra mudar:

- **Por vídeo** (recomendado): a Skill copia o template como `build-index.mjs` no seu projeto — edite lá, sem alterar a Skill.
- **Mudar o padrão de todos os vídeos**: edite os arquivos da Skill em
  [`skill/video-explicativo/scripts/`](skill/video-explicativo/scripts/) (e reinstale).

> Arquivo principal: [`scripts/composition-template.mjs`](skill/video-explicativo/scripts/composition-template.mjs)
> (no projeto, vira `build-index.mjs`).

### 1. Mudar a CTA (INEMA.CLUB → outra marca/URL)

A CTA é a **última cena**, definida em `const CTA` no `composition-template.mjs` e anexada automaticamente (`ALL = [...SCENES, CTA]`). Edite o `html` dela:

```js
const CTA = {
  audio: 3.840,                 // duração real do WAV da narração da CTA
  caption: "Mais conteúdo em suamarca.com",
  html: (p) => `
    <div class="cta-eyebrow" id="${p}-eye">CONTINUA EM</div>
    <div class="cta-brand" id="${p}-brand"><span class="b1">SUA</span><span class="bdotsep">.</span><span class="b2">MARCA</span></div>
    <div class="rule center" id="${p}-rule"></div>
    <div class="cta-url mono" id="${p}-url"><span class="cta-globe">🌐</span>suamarca.com</div>
    ...`,
  anim: (at, p) => [ /* tweens GSAP da CTA */ ],
};
```

- `b1` = parte clara (creme), `b2` + `bdotsep` = parte âmbar (accent). Edite o texto dentro dos spans.
- `cta-eyebrow` = "CONTINUA EM"; `cta-url` = a URL exibida.
- **Narração da CTA**: é o último `sN.wav` do projeto — edite o `.txt` correspondente e gere o WAV de novo (expanda a URL pra fala, ex.: "sua marca ponto com"), e ajuste `CTA.audio` com a duração real. Veja [`scripts/narration-template.sh`](skill/video-explicativo/scripts/narration-template.sh).
- **Estilo da CTA**: regras CSS `.cta-eyebrow` / `.cta-brand` / `.cta-url` (tamanho da marca, glow etc.) no mesmo arquivo.
- Para **remover** a CTA: troque `const ALL = [...SCENES, CTA]` por `const ALL = [...SCENES]`. (O padrão da casa é **sempre manter** a CTA.)

### 2. Cores / paleta (dark premium âmbar)

Tokens CSS no topo do `composition-template.mjs` (bloco `:root`):

```css
--bg:#0D1321; --bg2:#1D2D44; --bg3:#3E5C76;
--fg:#F0EBD8; --muted:#748CAB;
--accent:#FFC300; --accent2:#FCA311; --code:#2EC4B6;
```

Troque `--accent`/`--accent2` para mudar a cor de destaque em todas as cenas. Referência completa em
[`references/house-style.md`](skill/video-explicativo/references/house-style.md).

### 3. Fontes

Padrão: **Sora** (títulos), **Inter** (corpo), **JetBrains Mono** (código/URLs), baixadas localmente por
[`scripts/fetch-fonts.mjs`](skill/video-explicativo/scripts/fetch-fonts.mjs). Edite a lista nesse script
para trocar as famílias (use sempre fontes locais `@font-face` — Google Fonts CDN some no render).

### 4. Voz da narração (TTS)

Definida em [`scripts/narration-template.sh`](skill/video-explicativo/scripts/narration-template.sh):

```bash
npx -y hyperframes tts "txt/s$i.txt" --voice pf_dora --speed 0.98 --output "audio/s$i.wav"
```

Mude `--voice` (vozes Kokoro) e `--speed` para outra locução.

### 5. Formato (16:9 / 9:16)

Controlado pela flag `--vertical` ao rodar o gerador (`1920×1080` vs `1080×1920`):

```bash
node build-index.mjs            # 16:9
node build-index.mjs --vertical # 9:16
```

Ajustes específicos do vertical ficam nas regras CSS `body.v ...`.

### 6. Número de cenas (dinâmico)

Não há número fixo: o nº de cenas = nº de itens no array `SCENES[]` do gerador. O assunto define quantas (range 4–12 + CTA); se você pedir um número específico, ele é respeitado. A CTA é sempre anexada no fim (`ALL = [...SCENES, CTA]`) — não conta no total.

### 7. Música de fundo (opcional)

Defina o caminho de um leito sonoro no topo do gerador (fica baixo, o vídeo inteiro):

```js
const MUSIC = "assets/audio/bg.mp3"; // null = sem música
const MUSIC_VOL = 0.14;              // 0–1 (deixe a narração na frente)
```

Use um arquivo **≥ a duração do vídeo**. Vídeo/imagem como b-roll: ver [`references/clips-midia.md`](skill/video-explicativo/references/clips-midia.md).

### 8. Movimento / animação

O movimento é um **estilo definido**: toda cena compõe a partir do vocabulário `M.*` no gerador (`reveal`, `sweep`, `type`, `float`, `pulse`, `glow`, `countUp`…), com **mid-scene activity** (câmera Ken Burns) e deslocamentos que se ajustam ao formato (9:16 mais contido). Para mudar o "jeito" do movimento, ajuste os presets em `M` — não escreva tweens soltos. Catálogo e princípios em [`references/motion.md`](skill/video-explicativo/references/motion.md).

---

## 🎓 O curso

Curso completo, no formato **INEMA.CLUB**, que ensina a Skill de ponta a ponta.

**🌐 Acesse:** https://inematds.github.io/skill-video-explicativo/

### As 4 trilhas

| Trilha | Tema | O que cobre |
|--------|------|-------------|
| 🧩 **T1 — Skills no Claude Code** | Fundamentos | O que é uma Skill, o `SKILL.md`, `name` + `description`, divulgação progressiva, onde vivem |
| 🎬 **T2 — Pipeline: HTML → MP4** | Prático | Setup, roteiro, narração TTS (Kokoro), composição em GSAP, lint/inspect, render 16:9 e 9:16 |
| 🔧 **T3 — Por dentro do skill** | Avançado | Estrutura do skill, house style dark premium, o gerador `build-index.mjs`, gotchas de produção |
| 💡 **T4 — Aplicações & Prompts** | Prático | YouTube, Shorts, onboarding, aulas, lançamentos + biblioteca de prompts prontos |

---

## 🗂️ Estrutura do repositório

```
index.html                 # Landing do curso
curso/
  index.html               # Índice das trilhas
  trilha1..4/
    index.html             # Índice da trilha (mapa + módulos)
    modulo-X-Y.html        # Páginas de módulo (17 no total)
skill/video-explicativo/   # A Skill, navegável (SKILL.md + scripts + references)
downloads/                 # video-explicativo.zip (a Skill empacotada)
```

---

Conteúdo do [**INEMA.CLUB**](https://inema.club) · 2026
