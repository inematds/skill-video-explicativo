---
name: video-explicativo
description: Cria vídeos explicativos completos em PT-BR (HTML→MP4 via HyperFrames) a partir de um assunto — roteiro, narração TTS local, cenas animadas dark premium, captions e CTA do INEMA.CLUB, nos formatos 16:9 (YouTube) e 9:16 (Shorts/Reels). Use quando o usuário pedir para "fazer um vídeo", "vídeo explicativo", "vídeo sobre X", "vídeo pra Shorts/Reels", "mini tutorial em vídeo", "vídeo do INEMA", ou quando der um assunto e quiser um vídeo narrado pronto. Cobre roteiro, locução, animação, render e a CTA final.
---

# Vídeo Explicativo (HyperFrames)

Gera um vídeo narrado, animado e renderizado a partir de um **assunto**. Stack: [HyperFrames](https://github.com/heygen-com/hyperframes) (HTML→MP4, Chrome headless + FFmpeg) + TTS local Kokoro. Tudo roda na máquina do usuário, **sem chave de API**.

Padrão do usuário (Nei): **PT-BR**, **dark premium** (accent âmbar), gerar **16:9 E 9:16**, e sempre terminar com a **cena de CTA do INEMA.CLUB**.

## Pré-requisitos (já instalados nesta máquina)
- Node 22+ e FFmpeg em `C:\ffmpeg\bin` (no git-bash use `ffmpeg -nostdin`, senão sai exit 0 sem gerar arquivo).
- Chrome headless do HyperFrames: `npx hyperframes browser ensure`.
- TTS local: `pip install kokoro-onnx soundfile` (sem espeak-ng — o Kokoro já fonemiza PT-BR).
- Verifique com `npx hyperframes doctor` se algo falhar.

## Fluxo (sempre nesta ordem)

1. **Roteiro** — escreva `SCRIPT.md`: 6–9 cenas, do primeiro princípio ao avançado, com exemplo real. Narração curta por cena (≈100s de voz ≈ 1:50 de vídeo). Expanda siglas para a fala (ex.: "SKILL.md" → "SKILL ponto M D"). Veja [references/pipeline.md](references/pipeline.md).
2. **Projeto** — `npx hyperframes init <nome> --example blank --non-interactive`. Copie `design.md` (house style) para a raiz.
3. **Fontes** — `node fetch-fonts.mjs` (baixa .woff2 subset latin → `assets/fonts/fonts.css`). Script em [scripts/fetch-fonts.mjs](scripts/fetch-fonts.mjs).
4. **Narração** — escreva `assets/txt/sN.txt` e gere os WAVs com Kokoro voz `pf_dora`, `--speed 0.98`. Template em [scripts/narration-template.sh](scripts/narration-template.sh). Meça as durações com `ffprobe`.
5. **Composição** — adapte [scripts/composition-template.mjs](scripts/composition-template.mjs) (copie como `build-index.mjs`): preencha `AUDIO[]` com as durações reais, escreva `sceneN()` (HTML) e `anim()` (GSAP) por cena, ajuste `CAPTIONS[]`. A **cena de CTA do INEMA.CLUB já está incluída** como última cena. Rode `node build-index.mjs` (16:9) e `node build-index.mjs --vertical` (9:16) — ambos escrevem `index.html` (renderize logo após cada geração).
6. **Validar** — `npx hyperframes lint` (0 erros) e `npx hyperframes inspect --samples 16` (0 problemas de layout). Corrija seguindo [references/gotchas.md](references/gotchas.md).
7. **Render** — `--quality draft` para conferir (extraia frames e mostre ao usuário), depois `--quality high`. Gere as duas versões:
   ```bash
   node build-index.mjs           && npx hyperframes render --quality high --output renders/<nome>-16x9.mp4
   node build-index.mjs --vertical && npx hyperframes render --quality high --output renders/<nome>-9x16.mp4
   ```

## Regras de ouro (não-negociáveis)
- **Animar o `.scene-inner`**, nunca o wrapper `.clip` (o framework força `opacity:1` no clip ativo).
- **Cenas e captions em tracks alternados** (1/3 e 2/4) para não dar overlap nas bordas (erro de float).
- **Decorativos off-canvas** (ghost/bg-layer): `data-layout-ignore`.
- **Fontes locais** via `@font-face` (NÃO usar Google Fonts CDN — some no render).
- **Timing é fonte única**: o gerador tira `data-start/duration` E os tempos dos tweens do MESMO array `AUDIO[]` → áudio e animação sempre batidos.
- Sempre **conferir frames** com o usuário antes do render final (não consigo ouvir o áudio — pedir pra ele validar a locução).

## Identidade visual (house style)
Paleta dark premium: bg `#0D1321`, painel `#1D2D44`, borda `#3E5C76`, texto `#F0EBD8`, secundário `#748CAB`, **accent âmbar `#FFC300`**, código `#2EC4B6`. Fontes: **Sora** (títulos 700/800), **Inter** (corpo), **JetBrains Mono** (código/URLs). Detalhes em [references/house-style.md](references/house-style.md).

## CTA INEMA.CLUB (cena final padrão)
A última cena mostra "CONTINUA EM" + **INEMA.CLUB** (INEMA creme, .CLUB âmbar, com glow) + URL `🌐 inema.club`, narração curta ("Isso é conteúdo do INEMA ponto CLUB. Acesse: inema ponto club."). Já vem pronta no template (`scene9()` / `case 9`).
