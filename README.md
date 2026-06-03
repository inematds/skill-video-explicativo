# 🎬 Skill `video-explicativo` — Vídeos explicativos com Claude Code

Repositório da Skill **`video-explicativo`** (Claude Code) + o **curso completo** no formato
**INEMA.CLUB** que ensina a usá-la. A Skill cria vídeos explicativos narrados (**HTML → MP4**) com o
framework [HyperFrames](https://github.com/heygen-com/hyperframes) — animados, em **PT-BR**, renderizados
**localmente, sem chave de API**, nos formatos **16:9** (YouTube) e **9:16** (Shorts/Reels).

> Este projeto nasceu de um vídeo que foi, ele mesmo, **feito por uma Skill**.

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

1. **Roteiro** — `SCRIPT.md` com 6–9 cenas, do primeiro princípio ao avançado, narração curta por cena.
2. **Projeto** — `npx hyperframes init` + house style dark premium.
3. **Fontes** — baixa `.woff2` locais (Sora / Inter / JetBrains Mono).
4. **Narração** — gera os WAVs por cena com Kokoro (voz `pf_dora`).
5. **Composição** — monta as cenas em HTML + animação GSAP (timing único = áudio batido com a animação).
6. **Validação** — `hyperframes lint` + `inspect` (0 erros de layout).
7. **Render** — gera **16:9** e **9:16** em `--quality high`, sempre terminando com a **cena de CTA do INEMA.CLUB**.

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

A CTA é a **última cena** (`scene9()` / `case 9`) do `composition-template.mjs`. O texto fica em `scene9()`:

```js
function scene9() {
  return `
    <div class="cta-eyebrow" id="s9-eye">CONTINUA EM</div>
    <div class="cta-brand" id="s9-brand"><span class="b1">SUA</span><span class="bdotsep">.</span><span class="b2">MARCA</span></div>
    <div class="rule center" id="s9-rule"></div>
    <div class="cta-url mono" id="s9-url"><span class="cta-globe">🌐</span>suamarca.com</div>
    ...`;
}
```

- `b1` = parte clara (creme), `b2` + `bdotsep` = parte âmbar (accent). Edite o texto dentro dos spans.
- `cta-eyebrow` = "CONTINUA EM"; `cta-url` = a URL exibida.
- **Narração da CTA**: está no áudio da última cena — edite `assets/txt/s9.txt` do projeto e gere o WAV de novo (expanda a URL pra fala, ex.: "sua marca ponto com"). Veja [`scripts/narration-template.sh`](skill/video-explicativo/scripts/narration-template.sh).
- **Estilo da CTA**: regras CSS `.cta-eyebrow` / `.cta-brand` / `.cta-url` (tamanho da marca, glow etc.) no mesmo arquivo.
- Para **remover** a CTA: tire `scene9` do array `BODIES`, o `case 9` e ajuste `AUDIO[]`/`CAPTIONS[]`. (O padrão da casa é **sempre manter** a CTA.)

### 2. Cores / paleta (dark premium âmbar)

Tokens CSS no topo do `composition-template.mjs` (bloco `:root`):

```css
--bg:#0D1321; --bg2:#1D2D44; --line:#3E5C76;
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
