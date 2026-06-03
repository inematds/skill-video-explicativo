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
- 6–9 cenas. Arco: hook → primeiro princípio → mecânica → conceito-chave → aplicação → avançado → exemplo real → fecho → **CTA INEMA.CLUB**.
- Narração por cena: 1–3 frases curtas. ~100s de fala no total ≈ 1:50 de vídeo (bom para retenção e cabe em Shorts).
- Para a FALA (TTS), expanda: "SKILL.md" → "SKILL ponto M D"; ".claude/skills" → "ponto claude, barra skills"; URLs → "inema ponto club".

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
- O array `AUDIO[]` no gerador deve ter as durações REAIS medidas (inclui a CTA s9).

## Render
- `--quality draft` para iterar; `--quality high --fps 30` para entrega.
- ~110s de vídeo = ~3500 frames ≈ 3–4 min de render (22 cores).
- Extrair frame p/ conferência: `ffmpeg -nostdin -y -ss <t> -i video.mp4 -vframes 1 -update 1 frame.png` e abrir com a ferramenta Read.
- Conferir 1 frame por cena cobre bem.

## Dois formatos
O gerador sempre escreve `index.html`. O modo é escolhido por `--vertical`. Renderize logo após gerar cada modo (não deixe dois `index*.html` na raiz — o lint acusa "multiple_root_compositions").
