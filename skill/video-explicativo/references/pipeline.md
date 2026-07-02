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
    audio/sN.wav        # narrações (voz bella / inemavox; Kokoro fallback)
    fonts/*.woff2 + fonts.css
```
> MP4 finais **não** ficam em `renders/` local — vão para a pasta única `~/projetos/output/<nome>/` (ver SKILL.md › Render).

## Roteiro (SCRIPT.md)
- **Nº de cenas dinâmico** (ver "Plano de cenas" no SKILL.md): o assunto define quantos beats entram. Range 4–12 de conteúdo + a CTA. Não trave em 6–9.
  - Arco de referência: hook → primeiro princípio → mecânica → conceito-chave → aplicação → avançado → exemplo real → fecho → **CTA INEMA.CLUB**. Funda beats se o tema for pequeno, desdobre se for grande.
  - Default de duração quando o usuário não pede: ~1:40–2:00 (cabe em Shorts). Com duração-alvo: cenas ≈ `voz_alvo / ~12s`.
  - Override: se o usuário fixar o nº de cenas, use exatamente esse (conteúdo) + CTA.
- Narração por cena: 1–3 frases curtas.
- **Gancho de abertura (cena 1):** é o beat mais importante — os ~3s iniciais decidem a retenção (regra de ouro no SKILL.md). Abra **direto na tensão**, sem aquecimento (logo/"olá pessoal" fora). Padrões que param o scroll: **pergunta afiada** ("Por que 90% dos vídeos morrem nos 3 primeiros segundos?"), **número/contraste chocante**, **promessa concreta** ("Em 40s você monta um vídeo narrado sozinho"), **erro comum** ("Você está fazendo isso errado — e nem sabe"). O texto/imagem forte precisa estar **no primeiro segundo**, não depois da abertura.
- **Variações (se o usuário pedir 2–3 versões):** cada variação é um roteiro próprio com **ângulo/arco diferente** (didático vs. caso real vs. contrarian vs. lista) e **gancho diferente** — não é reordenar as mesmas frases. Ver seção "Variações" no SKILL.md. (Não confundir com os dois formatos 16:9/9:16, que são padrão.)

## Revisão de texto (antes de narração e slides)
Etapa obrigatória **antes** de gerar os WAVs e de escrever texto na tela. Detalhe completo +
checklist + léxico de inglês em [revisao-texto.md](revisao-texto.md). Resumo:
- **Duas formas por frase**: **tela** (`caption` + literais em `html(p)`) = PT-BR acentuado + inglês na grafia original; **fala** (`txt/sN.txt`) = mesma frase com siglas/URLs expandidas **e inglês reescrito foneticamente**.
- **Acentuação**: varrer palavra a palavra (vídeo, você, é, só, código, conteúdo, princípio, mecânica…).
- **Siglas/URLs (forma-fala)**: "SKILL.md" → "SKILL ponto M D"; ".claude/skills" → "ponto claude, barra skills"; URLs → "inema ponto club".
- **Inglês (forma-fala)**: `deploy`→"deplói", `design`→"dizáin", `skill`→"skiu", `framework`→"frêimuork"… (PT usa muito termo em inglês e o TTS — Edge/bella ou Kokoro — fonemiza pela grafia escrita). Na dúvida, gerar WAV de teste e o usuário ouvir.

## Movimento (mid-scene activity — anti-slideshow)
- **Linguagem de movimento definida**: componha do vocabulário `M.*` do gerador (`reveal/sweep/type/float/pulse/glow/countUp…`), não tweens soltos. Catálogo e princípios em [motion.md](motion.md).
- O gerador embute **câmera Ken Burns** (zoom/pan lento) em toda cena → o quadro nunca fica 100% parado depois da entrada.
- Distribua os reveals ao LONGO da fala (não tudo nos 2s iniciais); revele cada elemento quando a voz o mencionar.
- Em cenas longas, adicione atividade contínua: contador subindo, pulso na palavra-chave, drift de um elemento, varredura de gradiente.
- **Transições** (`TRANS`): corte limpo (`fade`) é o padrão; especiais (`push/zoom/wipe/slideUp/fadeBlack`) só em **2–3 momentos-chave**, marcadas com `transIn` na cena que entra. Catálogo em [motion.md](motion.md).

## Banco de padrões (exemplos oficiais HyperFrames)
Para inspiração de motion, veja `npx hyperframes init x --example <name>`: `decision-tree` (explainers/tutoriais — nosso caso), `nyt-graph` (data stories/contadores), `kinetic-type` (motion tipográfico), `swiss-grid` (técnico/limpo). A skill usa `blank` + house style dark premium próprio, mas esses exemplos são ótimos para copiar ideias de animação.

## Narração (voz `bella` via inemavox · Kokoro fallback)
Default = **voz `bella`** (clone via inemavox `chatterbox-vc`: Edge TTS gera a fala, o Chatterbox transfere o timbre da `bella.wav`). O template `narration.sh` já faz isso e cai no Kokoro só se o inemavox falhar.
```bash
# bella (inemavox): grava sempre <outdir>/generated.wav → renomear para sN.wav
python3 ~/projetos/inemavox/tts_direct.py \
  --text "$(cat assets/txt/s1.txt)" --lang pt \
  --engine chatterbox-vc --ref ~/projetos/timesmkt3/media/voice-refs/bella.wav \
  --outdir /tmp/tts_s1 && mv -f /tmp/tts_s1/generated.wav assets/audio/s1.wav
```
- `python3` do sistema roda o `tts_direct.py` (tem `edge_tts`); o env conda `chatterbox` (`/home/nmaldaner/miniconda3/envs/chatterbox/bin/python3`) é chamado internamente para a conversão de timbre.
- **Fallback Kokoro** (só se inemavox/bella falhar): `npx hyperframes tts "assets/txt/s1.txt" --voice pf_dora --speed 0.98 --output assets/audio/s1.wav`. Voz `pf_dora` = PT-BR feminina; 1ª execução baixa ~340MB.
- Prático: rode `bash assets/narration.sh` — ele já tenta `bella` e faz o fallback por cena, iterando sobre todos os `sN.txt`.
- Medir durações: `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 assets/audio/sN.wav`.

## Timing (no gerador)
- `LEAD=0.5` (visual antes da voz), `TAIL=0.9` (segura depois), `FADE=0.45`.
- Cena dur = LEAD + áudio + TAIL. Áudio começa em (início da cena + LEAD).
- Cada cena em `SCENES[]` tem o campo `audio` = duração REAL medida (ffprobe). `CTA.audio` = duração do WAV da CTA. O nº de WAVs (`s1.wav … sN.wav`) acompanha o nº de cenas — a CTA é o último `sN.wav`.

## Render
- **Um arquivo por formato, e só.** O render do HyperFrames (`<nome>-16x9.mp4` / `<nome>-9x16.mp4`) é a entrega. **Não** criar uma segunda cópia comprimida (`-FINAL.mp4`) ao lado — são o mesmo vídeo e confundem. Comprimir é opt-in (só a pedido) e **sobrescreve o mesmo nome** (ver SKILL.md › Render).
- `--quality draft` para iterar; `--quality high --fps 30` para entrega.
- ~110s de vídeo = ~3500 frames ≈ 3–4 min de render (22 cores).
- Extrair frame p/ conferência: `ffmpeg -nostdin -y -ss <t> -i video.mp4 -vframes 1 -update 1 frame.png` e abrir com a ferramenta Read.
- Conferir 1 frame por cena cobre bem.

## Dois formatos
O gerador sempre escreve `index.html`. O modo é escolhido por `--vertical`. Renderize logo após gerar cada modo (não deixe dois `index*.html` na raiz — o lint acusa "multiple_root_compositions").
