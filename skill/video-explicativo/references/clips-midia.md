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

### Imagem atrás de texto — legibilidade (REGRA)
Foto/raster **crua** atrás de texto quase sempre mata a leitura: um frame claro da imagem cai por cima da letra e ela some. Sempre que texto ficar **sobre** uma imagem, use **uma** destas três (nunca nenhuma):

**(a) Scrim — gradiente/painel escuro por cima da imagem** (mais comum; barato e controlável):
```html
<div class="clip" data-start="s3" data-duration="6" data-track-index="6"
     style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,19,33,.15),rgba(13,19,33,.82));z-index:4"></div>
<!-- o texto da cena entra ACIMA (z-index maior) -->
```

**(b) Blur na própria imagem** (quando ela é só clima de fundo, não informação):
```html
<img class="clip" ... style="...;filter:blur(6px) brightness(.55)" />
```

**(c) Bloco-painel opaco isolando o texto** (imagem fica ao lado/atrás, texto num cartão sólido):
```html
<div style="position:absolute;...;background:rgba(29,45,68,.92);border:1px solid var(--bg3);border-radius:16px;padding:28px 34px;z-index:5">…texto…</div>
```

Regras de encaixe: o scrim/painel entra em **track própria** entre a imagem e o texto (ex.: imagem 5, scrim 6, cena 1/3 por cima). Ícone/diagrama **SVG** já nasce sobre o fundo dark — não precisa de nada disso. Na dúvida, escureça mais: legível > bonito.

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
- **A voz manda — música é cama, nunca protagonista.** `data-volume` vai de 0 a 1; teto **~0.14** (faixa 0.10–0.18). Acima disso ela compete com a narração e derruba a retenção. Na dúvida, mais baixo.

### Ducking (baixar a música sob a fala, subir nos vazios)
O `data-volume` é fixo no vídeo todo — bom quando quase tudo tem narração (`0.14` já resolve). Mas se há **trechos sem voz** (intro instrumental, respiro entre blocos, outro), vale **ducking**: música um pouco mais alta nos vazios e bem baixa durante a fala. Como não há automação de volume por trecho, faça por **camadas de áudio segmentadas** em vez de um `<audio>` único:
- Um clip de música **baixo (`~0.10`) cobrindo as cenas com narração** (`data-start` na 1ª cena falada até a última).
- Outro clip da mesma música **mais alto (`~0.22`) só nos trechos sem voz** (ex.: `data-start="0" data-duration="s1"` na intro, e um no fim depois da última fala).
Cada um é um `<audio>` irmão com seu `data-start`/`data-duration`/`data-track-index` (use 21 e 22). Simples, determinístico, e a voz nunca briga com a trilha. Para a maioria dos vídeos curtos o volume fixo `0.14` basta — só faça ducking quando existir silêncio de fala real.

## Timing relativo (encaixar mídia numa cena)
`data-start` aceita o **ID de outro clip** em vez de segundos absolutos:
- `data-start="s3"` → começa junto com a cena 3.
- `data-start="s3 + 1.5"` → 1,5s depois do início da cena 3.
- `data-start="s4 - 0.5"` → 0,5s antes da cena 4 (útil pra sobrepor um momento-chave).

Isso evita recalcular segundos quando o nº/ordem de cenas muda. As cenas têm IDs `s1…sN` (a CTA é o último).

## Fallback SVG (sem servidor/API de imagem) — REGRA

Imagens raster (ex.: flux2-klein via servidor `inemaimg` em `:8000`) são **opcionais, com fallback**. Antes de
depender delas, cheque `curl -s localhost:8000/health`. Se o servidor (ou qualquer API de imagem) **não** estiver
disponível, **não trave o vídeo** — use **SVG**:

- **Ilustração de tópico (ícones/diagramas: seta, alvo, funil, megafone, etiqueta, contador):** **sempre pode ser
  SVG** e é **preferível** — determinístico, ~KB, nítido em qualquer escala, versionável (texto no git), sem risco
  de texto embaralhado, e **animável** nativamente (draw-on via `stroke-dashoffset`, morph, count-up).
- **Fundo da cena:** com servidor/API → imagem raster (look editorial 3D); sem ele → **fundo SVG flat/editorial**
  (formas + `<linearGradient>` + glow `feGaussianBlur`), no mesmo espírito visual dark premium âmbar.

SVG entra como qualquer clip de mídia (inline `<svg>` numa cena, ou `<img src="...svg">` com `class="clip"`).
Sempre **conferir o asset** antes de aceitar (raster às vezes mete texto/elemento errado → regerar/trocar seed).

## Transições especiais (shader)
Padrão = corte limpo. Para 2–3 momentos-chave, o HyperFrames suporta **shader transitions** (ex.: glitch). Não aplicar em toda cena — só onde o ritmo pede um respiro forte. Detalhes na doc oficial do HyperFrames (catálogo de transições/componentes).
