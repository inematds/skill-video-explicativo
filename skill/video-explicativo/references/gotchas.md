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
- Todo elemento VISÍVEL temporizado precisa de `class="clip"` + `data-start` + `data-duration` + `data-track-index`. Áudio: idem, mas **sem** `class="clip"`.
- O framework força `opacity:1` no clip ativo → para fade de cena, anime um filho `.scene-inner`, nunca o wrapper.
- Timeline GSAP **pausada** e registrada: `window.__timelines["main"] = gsap.timeline({paused:true})`. O ID tem que bater com `data-composition-id`.
- **Root SEM `data-duration`**: a duração da composição vem de `tl.duration()`. `data-duration` no root é contra o contrato (pode quebrar em updates do framework).
- Animação de fundo "ambiente" (glow/grid) com `repeat` finito cobrindo o total + `tl.set({}, {}, TOTAL)` de sentinela no fim.
- Nada de `Date.now()`/`Math.random()`/fetch — render é determinístico.

## Vídeo (`<video>`) — pegadinhas
- **NUNCA animar `width`/`height`/`top`/`left` direto no `<video>`** com GSAP → o Chrome para de renderizar frames. Envolva num `<div>` wrapper e anime o wrapper.
- Vídeo **não** leva `class="clip"` — o framework gerencia play/pause/seek dele direto pelo `data-start`/`data-duration`/`data-track-index` no próprio `<video>`.
- `data-media-start="5"` = trim (começa 5s dentro do source). `data-volume="0"` = mudo. Se o source acaba antes do `data-duration`, congela o último frame.
- Imagem (`<img class="clip">`): `data-duration` é **obrigatório** (não tem source duration). Ver [clips-midia.md](clips-midia.md).

## 9:16 gerado por regex em cima do 16:9 — corta a imagem

Se o projeto usa **1 foto full-bleed por cena** (`object-fit:cover` cobrindo o frame inteiro — estilo fora do
`composition-template.mjs` oficial), **nunca** gere o `index-916.html` com um patch de regex sobre o `index.html`
16:9 (só trocar `1920→1080`/`font-size`). A imagem (tipicamente 16:9, ex. 1280×720) fica full-bleed e
`object-fit:cover` escala até a altura bater (2,67×) e corta ~69% da largura — perda de nitidez + corte
imprevisível. Já aconteceu em produção 3× seguidas (`websites-morrem`, `claude-5videos`, `monako-glasses`, todos
com o mesmo bug copiado). Gerador dedicado + imagem contida (não cortada) + título grande fixo no topo: ver
["Variante: cena é 1 foto full-bleed"](safe-zones.md#variante-cena-é-1-foto-full-bleed-não-svgtipografia--regra)
em safe-zones.md.

## Checklist antes de renderizar
- `npx hyperframes lint` → **0 erros**; `npx hyperframes inspect --samples 16` → 0 problemas.
- Todo visível temporizado tem `class="clip"`; vídeo **não** tem.
- Todo `data-start` que referencia outro clip aponta pra um ID que existe.
- Só **um** `index.html` (composição root) na raiz.
- A última cena é a **CTA INEMA.CLUB**.
