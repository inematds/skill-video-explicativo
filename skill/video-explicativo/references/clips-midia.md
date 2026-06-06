# Clips de mídia — vídeo, imagem e música

A skill é motion graphics (HTML/CSS/GSAP), mas o HyperFrames aceita **clips de mídia** que dão movimento real e contexto. Coloque-os como **irmãos das cenas** (filhos diretos do `#root`), com `data-start`/`data-duration`/`data-track-index` próprios e posicionados por CSS. Tracks de mídia: use índices que não colidam com cenas (1/3), captions (2/4), narração (20) e música (21) — ex.: 5, 6.

## Imagem (`<img>`)
- `class="clip"` **obrigatório** e `data-duration` **obrigatório** (não há source duration pra herdar).
- Formatos: PNG, JPG, WebP, SVG, GIF (só 1º frame). Posicione/dimensione por CSS.

```html
<img id="shot1" class="clip"
     data-start="s3" data-duration="4" data-track-index="5"
     src="assets/shot.png"
     style="position:absolute;top:140px;left:200px;width:1200px;border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.5)" />
```

Para animar (entrada/zoom), anime o `#shot1` no script da composição como qualquer elemento.

## Vídeo (`<video>`) — b-roll / screen capture
Regras críticas (ver também gotchas.md):
- **NÃO** colocar `class="clip"` no `<video>` — o framework gerencia play/seek direto.
- **NUNCA animar `width`/`height`/`top`/`left` no `<video>`** → Chrome para de renderizar. Para mover/redimensionar, anime um `<div>` wrapper.
- `data-media-start` = trim do início; `data-volume="0"` = mudo (quase sempre o que se quer, a voz é o TTS).

```html
<!-- wrapper estático posiciona; o vídeo (timed) fica dentro e preenche -->
<div id="bw" style="position:absolute;top:120px;left:760px;width:1000px;height:620px;border-radius:18px;overflow:hidden;border:2px solid var(--bg3)">
  <video id="broll"
         data-start="s5" data-duration="8" data-track-index="6"
         data-media-start="0" data-volume="0"
         src="assets/broll.mp4"
         style="width:100%;height:100%;object-fit:cover"></video>
</div>
```
Quer deslizar o vídeo entrando? Anime `#bw` (o wrapper), não `#broll`.

## Música de fundo (leito sonoro)
O template tem o hook pronto: defina `const MUSIC = "assets/audio/bg.mp3"` (e `MUSIC_VOL`, default `0.14`). Ele emite um `<audio data-volume>` cobrindo o vídeo todo no track 21.
- Use um arquivo **>= a duração do vídeo** (se for mais curto, congela/silencia no fim — não dá loop automático).
- `data-volume` vai de 0 a 1. ~0.10–0.18 deixa a narração na frente.

## Timing relativo (encaixar mídia numa cena)
`data-start` aceita o **ID de outro clip** em vez de segundos absolutos:
- `data-start="s3"` → começa junto com a cena 3.
- `data-start="s3 + 1.5"` → 1,5s depois do início da cena 3.
- `data-start="s4 - 0.5"` → 0,5s antes da cena 4 (útil pra sobrepor um momento-chave).

Isso evita recalcular segundos quando o nº/ordem de cenas muda. As cenas têm IDs `s1…sN` (a CTA é o último).

## Transições especiais (shader)
Padrão = corte limpo. Para 2–3 momentos-chave, o HyperFrames suporta **shader transitions** (ex.: glitch). Não aplicar em toda cena — só onde o ritmo pede um respiro forte. Detalhes na doc oficial do HyperFrames (catálogo de transições/componentes).
