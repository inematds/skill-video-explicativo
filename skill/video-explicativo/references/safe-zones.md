# Safe zones 9:16 (Shorts / Reels / TikTok)

No vertical, a **UI da rede social cobre faixas fixas** do vídeo. Conteúdo crítico (texto, número, logo, dado)
**não pode cair** nessas faixas, senão fica escondido atrás dos botões/legenda do app. O 16:9 não tem esse
problema (a UI do player fica fora do frame) — **isto é só para 9:16**.

## O mapa (frame 1080×1920)

| Zona | Onde | O que o app põe ali | Regra |
|---|---|---|---|
| **Topo** | ~0–11% (≈210px) | "Para você / Seguindo", busca | manter padding-top alto |
| **Lateral direita** | direita, ~45–90% da altura | botões curtir / comentar / compartilhar / áudio / perfil | nada crítico na coluna direita |
| **Base** | ~últimos 18–25% (≈360–480px) | @usuário, legenda do app, nome do áudio, CTA da plataforma | manter base livre |
| **Livre (segura)** | **miolo + topo-esquerda** | — | ancorar o conteúdo aqui |

## Layout validado p/ 9:16 (caso `videoprodutor/videos/hormozi-12-dicas`)

Arranjo que funcionou bem nas redes:

1. **MÍDIA/ILUSTRAÇÃO no TOPO** — imagem (ou ícone SVG) como **faixa de topo** (~34% da altura), **entrando da
   direita→esquerda**. Sem imagem/servidor → ícone **SVG** no topo (fallback; ver clips-midia.md).
2. **MENSAGEM no MEIO** — texto/número/dado centralizados verticalmente (altura confortável de leitura).
3. **BASE (~360px) e LATERAL-DIREITA livres** — onde o app põe legenda/@perfil e os botões.
4. **Caption do vídeo OCULTA no 9:16** — o conteúdo na tela já comunica e o app adiciona a legenda dele.

## Como o template aplica (e o que ajustar)

Nos overrides `body.v` de `scripts/composition-template.mjs`:

- `body.v .scene{padding:170px 80px 360px}` — mensagem no meio, **base de ~360px livre**. Aumente o
  padding-bottom se mirar TikTok (base mais alta).
- `body.v .caption{display:none}` — legenda do vídeo some no vertical (base livre).
- **Mídia de topo:** posicione o clip de imagem/SVG numa faixa superior e anime a entrada da direita→esquerda
  (ex.: `xPercent:18 → 0`). Veja clips-midia.md.
- **Lateral direita:** texto/itens **alinhados à esquerda** (ou com margem direita), fora da coluna de botões.

## Princípios

1. **Topo-esquerda e centro são sagrados; base e direita-baixo são "emprestados" ao app.**
2. **Caption curta** no 9:16 — quanto menor, menos risco de bater na coluna de botões.
3. **Logo/CTA/dado-chave** ficam no terço superior/central, nunca na base.
4. O mesmo conteúdo no 16:9 usa o frame inteiro; só o ramo `body.v` muda — não mexa no layout horizontal.

## Variante: cena é 1 FOTO full-bleed (não SVG/tipografia) — REGRA

O template oficial (`composition-template.mjs`) compõe cenas em SVG/CSS/tipografia, então media (quando existe) é
um clip *adicional* — nunca a cena inteira. Mas alguns projetos (geradores caseiros, fora do `composition-template.mjs`)
usam **1 foto de fundo full-bleed por cena** (`<img class="scene-img">` absoluta, `object-fit:cover` cobrindo o
frame inteiro) + texto por cima — caso real: `websites-morrem`, `claude-5videos`, `monako-glasses`.

**Nunca vire o 9:16 desse estilo com regex/patch em cima do HTML 16:9 já pronto** (só trocar `1920→1080` /
`1080→1920` e encolher `font-size`). A imagem geralmente é gerada em 16:9 (ex. flux2-klein a 1280×720). Com
`object-fit:cover` mantido, ela **escala até a altura bater** (720→1920 ≈ 2,67×) e **corta as laterais** — sobra
só ~31% da largura original, ampliada 2,67× (perda de nitidez + corte imprevisível do conteúdo). Isso já
aconteceu em produção (`websites-morrem`) e passou despercebido até alguém checar o print.

**O que fazer em vez disso — gerador 9:16 dedicado** (não um patch do 16:9; gera o `index-916.html` do zero, lendo
os mesmos `assets/audio/sN.wav` + `assets/txt/sN.txt`/título do vídeo):

1. **Imagem CONTIDA, não cortada.** Um `<div class="img-wrap">` de altura fixa (ex. `top:460px;height:480px` ou
   `top:230px;height:608px`, dependendo do resto do layout) com a foto dentro em `object-fit:cover` — como a
   altura do wrap já respeita a proporção ~16:9 da foto, o corte fica desprezível (não os 2,67× do full-bleed).
2. **Título do vídeo GRANDE, fixo no topo, 2 linhas** (ver regra `TITLE` acima) — usa o `title`/`subtitle` que o
   gerador já tem por vídeo, sem trabalho extra. Sora 800, ~56–72px (menor que os 104–118px do padrão porque aqui
   o subtitle tende a ser uma frase inteira, não só o gancho).
3. **Legenda da cena abaixo da imagem**, dentro do miolo seguro — **não** esconder (diferente do ponto 4 acima):
   nesse estilo a legenda é a única portadora do fato específico da cena (não há tipografia/gráfico próprio como
   no template oficial). Dê folga generosa: projetos reais chegam a **~240 caracteres** numa cena só — teste
   sempre com o texto mais longo do projeto antes de bater o render final, não só com a cena 1.
4. **Base (~420px) só com decoração ambient** (barra de progresso fina na borda, por ex.) — nunca badge/dado
   numérico aí (o layout antigo do `monako-glasses` tinha `data-badge{top:50px}` — dentro da zona de TOPO
   reservada; mova pro miolo também).

Sempre **renderize e extraia um frame da cena de texto mais longo** (`ffmpeg -ss <t> -vframes 1`) antes de aceitar
o layout — a zona segura da base é fácil de estourar sem perceber num teste só com a cena 1 (que costuma ter o
texto mais curto, tipo gancho).
