# Pipeline detalhado

## Estrutura de projeto
```
<nome>/
  SCRIPT.md            # roteiro (narração + tela por cena)
  design.md            # house style (copiar de references/house-style.md)
  build-index.mjs      # gerador (copiar de scripts/composition-template.mjs)
  fetch-fonts.mjs      # copiar de scripts/fetch-fonts.mjs
  index.html           # GERADO — não editar à mão
  assets/
    narration.sh       # copiar de scripts/narration-template.sh
    txt/sN.txt          # textos da locução
    audio/sN.wav        # narrações Kokoro
    fonts/*.woff2 + fonts.css
  renders/
```

## Roteiro (SCRIPT.md)
- **Nº de cenas dinâmico** (ver "Plano de cenas" no SKILL.md): o assunto define quantos beats entram. Range 4–12 de conteúdo + a CTA. Não trave em 6–9.
  - Arco de referência: hook → primeiro princípio → mecânica → conceito-chave → aplicação → avançado → exemplo real → fecho → **CTA INEMA.CLUB**. Funda beats se o tema for pequeno, desdobre se for grande.
  - Default de duração quando o usuário não pede: ~1:40–2:00 (cabe em Shorts). Com duração-alvo: cenas ≈ `voz_alvo / ~12s`.
  - Override: se o usuário fixar o nº de cenas, use exatamente esse (conteúdo) + CTA.
- Narração por cena: 1–3 frases curtas.
- Para a FALA (TTS), expanda: "SKILL.md" → "SKILL ponto M D"; ".claude/skills" → "ponto claude, barra skills"; URLs → "inema ponto club".

## Movimento (mid-scene activity — anti-slideshow)
- O gerador embute **câmera Ken Burns** (zoom/pan lento) em toda cena → o quadro nunca fica 100% parado depois da entrada.
- Distribua os reveals ao LONGO da fala (não tudo nos 2s iniciais); revele cada elemento quando a voz o mencionar.
- Em cenas longas, adicione atividade contínua: contador subindo, pulso na palavra-chave, drift de um elemento, varredura de gradiente.
- **Transições**: corte limpo (crossfade do `.scene-inner`) é o padrão. Reserve **shader transitions para 2–3 momentos-chave** (recomendação oficial). Não sobreponha cenas em todo corte.

## Banco de padrões (exemplos oficiais HyperFrames)
Para inspiração de motion, veja `npx hyperframes init x --example <name>`: `decision-tree` (explainers/tutoriais — nosso caso), `nyt-graph` (data stories/contadores), `kinetic-type` (motion tipográfico), `swiss-grid` (técnico/limpo). A skill usa `blank` + house style dark premium próprio, mas esses exemplos são ótimos para copiar ideias de animação.

## Narração (Kokoro, local)
```bash
npx hyperframes tts "assets/txt/s1.txt" --voice pf_dora --speed 0.98 --output assets/audio/s1.wav
```
- Voz `pf_dora` = PT-BR feminina. Alternativas PT-BR: `pm_alex`, `pm_santa`.
- Primeira execução baixa ~340MB (modelo + vozes). Sem chave, sem espeak-ng.
- Medir durações: `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 assets/audio/sN.wav`.

## Timing (no gerador)
- `LEAD=0.5` (visual antes da voz), `TAIL=0.9` (segura depois), `FADE=0.45`.
- Cena dur = LEAD + áudio + TAIL. Áudio começa em (início da cena + LEAD).
- Cada cena em `SCENES[]` tem o campo `audio` = duração REAL medida (ffprobe). `CTA.audio` = duração do WAV da CTA. O nº de WAVs (`s1.wav … sN.wav`) acompanha o nº de cenas — a CTA é o último `sN.wav`.

## Render
- `--quality draft` para iterar; `--quality high --fps 30` para entrega.
- ~110s de vídeo = ~3500 frames ≈ 3–4 min de render (22 cores).
- Extrair frame p/ conferência: `ffmpeg -nostdin -y -ss <t> -i video.mp4 -vframes 1 -update 1 frame.png` e abrir com a ferramenta Read.
- Conferir 1 frame por cena cobre bem.

## Dois formatos
O gerador sempre escreve `index.html`. O modo é escolhido por `--vertical`. Renderize logo após gerar cada modo (não deixe dois `index*.html` na raiz — o lint acusa "multiple_root_compositions").
