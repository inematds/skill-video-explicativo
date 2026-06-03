# Armadilhas e correções (lint / inspect / render)

Problemas reais já enfrentados e como resolver — aplique ANTES de renderizar.

## Lint

- **`overlapping_clips_same_track`** (cenas se tocam na borda por float): NÃO crie gaps. Alterne `data-track-index` — cenas em 1/3, captions em 2/4. O template já faz `s.i % 2 === 1 ? 1 : 3`.
- **`gsap_exit_missing_hard_kill`**: depois do fade-out de saída de cada cena, adicione `tl.set("#scene-inner-N",{opacity:0}, fimDaCena)`. O template já inclui.
- **`multiple_root_compositions`**: só pode existir UM `index.html` (com `data-composition-id`) na raiz. Não deixe `index-vertical.html`/backups na raiz; o gerador sempre grava `index.html`.
- **`google_fonts_import` / `font_family_without_font_face`**: nunca use Google Fonts via `<link>`/`@import`. Baixe `.woff2` (subset latin cobre PT-BR) com `fetch-fonts.mjs` e embuta `@font-face` local.
- **`timeline_track_too_dense`** (4+ por track): é só aviso, pode ignorar.

## Inspect (overflow visual)

- **Decorativos off-canvas** (palavra gigante de fundo, glows, `.bg-layer`): marque com `data-layout-ignore`. Sem isso, o auditor mede o box e acusa overflow.
- **Texto estourando container** (ex.: linha de código longa): estreite a fonte, alargue o box, ou encurte o texto. Marcador de highlight (`marker sweep`) deve ficar DENTRO do span da frase (use `left/right`, não `width`, com `z-index:-1` atrás do texto).
- Rode `npx hyperframes inspect --samples 16` até dar **0 problemas**.

## FFmpeg no Windows/git-bash
- Use **`ffmpeg -nostdin`** sempre. Sem isso, no git-bash o ffmpeg pode retornar exit 0 **sem gerar arquivo** (consome stdin e sai).
- Caminho explícito se preciso: `/c/ffmpeg/bin/ffmpeg.exe`.
- Extrair frame único: `ffmpeg -nostdin -y -ss <t> -i in.mp4 -vframes 1 -update 1 out.png`.

## Mecânica do HyperFrames
- Todo elemento temporizado precisa de `class="clip"` + `data-start` + `data-duration` + `data-track-index`.
- O framework força `opacity:1` no clip ativo → para fade de cena, anime um filho `.scene-inner`, nunca o wrapper.
- Timeline GSAP **pausada** e registrada: `window.__timelines["main"] = gsap.timeline({paused:true})`.
- Animação de fundo "ambiente" (glow/grid) com `repeat` finito cobrindo o total + `tl.set({}, {}, TOTAL)` de sentinela no fim.
- Nada de `Date.now()`/`Math.random()`/fetch — render é determinístico.
