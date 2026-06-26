---
name: video-explicativo
version: 1.6.3
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

## Plano de cenas (quantas cenas?)

**Não há número fixo.** O nº de cenas sai do roteiro, não de um template travado:

- **O assunto define a quantidade.** Quebre o arco (hook → primeiro princípio → mecânica → conceito-chave → aplicação → avançado → exemplo real → fecho) em quantos beats o tema pedir. Cada beat = 1 cena, 1–3 frases, ~8–15s de voz.
- **Range saudável: 4–12 cenas de conteúdo.** Abaixo de 4 fica raso; acima de 12 cansa/perde retenção. Tema grande → desdobre beats (mecânica em 2, exemplos em 2); tema pequeno → funda.
- **Duração-alvo** (se o usuário pedir): nº de cenas ≈ `voz_alvo / ~12s`, dentro do range. **Default quando não dizem nada: ~1:40–2:00** (curto, bom pra Shorts).
- **A CTA do INEMA.CLUB é sempre +1, obrigatória, última** — e já vem anexada automaticamente pelo gerador (`ALL = [...SCENES, CTA]`). Não conta no nº de cenas de conteúdo.
- **Override do usuário manda:** se ele fixar ("faz 6 cenas", "quero 5"), use exatamente esse número de conteúdo + a CTA, ignorando a heurística.

## Fluxo (sempre nesta ordem)

1. **Roteiro** — escreva `SCRIPT.md` com o nº de cenas que o "Plano de cenas" acima determinou (não force 6–9), do primeiro princípio ao avançado, com exemplo real. Narração curta por cena. Veja [references/pipeline.md](references/pipeline.md).
2. **Revisão de texto** — **antes** de gerar narração e slides, revise o texto de cada cena. Cada frase tem **duas formas**: (a) **tela** (`caption` + literais dentro de `html(p)`) → PT-BR com acentuação correta, termos em inglês na **grafia original**; (b) **fala** (`txt/sN.txt`) → mesma frase com siglas/URLs expandidas (ex.: "SKILL.md" → "SKILL ponto M D") **e termos em inglês reescritos foneticamente** (ex.: `deploy` → "deplói", `design` → "dizáin", `skill` → "skiu"). Varra a acentuação palavra a palavra; na dúvida sobre uma pronúncia (PT ou inglês), gere um WAV de teste e peça o usuário ouvir. Checklist + léxico de inglês em [references/revisao-texto.md](references/revisao-texto.md).
3. **Projeto** — crie **tudo dentro de `~/projetos/output/<nome>/`** (pasta única do usuário): `cd ~/projetos/output && npx hyperframes init <nome> --example blank --non-interactive`. Todo o conteúdo (projeto, assets, áudios, `index.html` e os MP4 finais) vive nessa pasta. Copie `design.md` (house style) para a raiz.
4. **Fontes** — `node fetch-fonts.mjs` (baixa .woff2 subset latin → `assets/fonts/fonts.css`). Script em [scripts/fetch-fonts.mjs](scripts/fetch-fonts.mjs).
5. **Narração** — escreva `assets/txt/sN.txt` (já na **forma-fala** revisada no passo 2) e gere os WAVs com Kokoro voz `pf_dora`, `--speed 0.98`. Template em [scripts/narration-template.sh](scripts/narration-template.sh). Meça as durações com `ffprobe`.
6. **Composição** — adapte [scripts/composition-template.mjs](scripts/composition-template.mjs) (copie como `build-index.mjs`). O gerador é **data-driven**: edite o array `SCENES[]` — uma entrada por cena de conteúdo, cada uma `{ audio, caption, html(p), anim(at,p) }` (use o prefixo `p` nos ids); todo texto de tela (`caption` + `html(p)`) usa a **forma-tela** revisada no passo 2. O **nº de cenas = nº de itens em `SCENES[]`** (dinâmico). A **CTA do INEMA.CLUB já vem anexada como última cena** (`const CTA` + `ALL = [...SCENES, CTA]`) — não remover. Cada cena já ganha **mid-scene activity** (câmera Ken Burns embutida) pra não virar slideshow. **Componha o movimento a partir do vocabulário `M.*`** (`reveal/sweep/type/float/pulse/glow/countUp…`), não tweens soltos — ver [references/motion.md](references/motion.md). Mídia (vídeo/imagem/música): ver [references/clips-midia.md](references/clips-midia.md). Rode `node build-index.mjs` (16:9) e `node build-index.mjs --vertical` (9:16) — ambos escrevem `index.html` (renderize logo após cada geração).
7. **Validar** — `npx hyperframes lint` (0 erros) e `npx hyperframes inspect --samples 16` (0 problemas de layout). Corrija seguindo [references/gotchas.md](references/gotchas.md).
8. **Render** — `--quality draft` para conferir (extraia frames e mostre ao usuário), depois `--quality high`. Os MP4 saem na **raiz do próprio projeto** (que já está em `~/projetos/output/<nome>/`) — todo o conteúdo numa pasta só. **Um arquivo por formato, e só** — o render do HyperFrames já é a entrega final. Gere as duas versões:
   ```bash
   node build-index.mjs           && npx hyperframes render --quality high --output <nome>-16x9.mp4
   node build-index.mjs --vertical && npx hyperframes render --quality high --output <nome>-9x16.mp4
   ```
   **Não criar uma segunda cópia comprimida** (ex.: `-FINAL.mp4`) ao lado do render — isso gera dois arquivos iguais e confunde. Comprimir é **opt-in**: só quando o usuário pedir um arquivo mais leve (upload). E mesmo aí, **substitua o original** (nunca deixe os dois):
   ```bash
   # SÓ se o usuário pedir pra comprimir — sobrescreve o mesmo nome, não cria um segundo:
   ffmpeg -nostdin -y -i <nome>-16x9.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k <nome>-16x9.tmp.mp4 && mv -f <nome>-16x9.tmp.mp4 <nome>-16x9.mp4
   ```

## Regras de ouro (não-negociáveis)
- **Tudo em `~/projetos/output/<nome>/`** — o projeto inteiro (assets, áudios, `index.html` e os MP4 finais) mora nessa pasta única. Init com `cd ~/projetos/output && npx hyperframes init <nome>`. Nunca espalhar em `renders/` local.
- **Saída única por formato — ou um, ou o outro, nunca os dois.** Cada formato entrega **exatamente UM** MP4: `<nome>-16x9.mp4` e `<nome>-9x16.mp4`. **Proibido** deixar uma segunda cópia comprimida ao lado (ex.: `<nome>-16x9-FINAL.mp4`) — são o mesmo vídeo e só confundem. Por padrão **não comprimir** (o render já é a entrega). Se o usuário pedir arquivo mais leve, comprima **sobrescrevendo o mesmo nome** (ver passo 8) — o resultado continua sendo um único arquivo por formato.
- **Sem silêncio no fim**: os loops de ambiente usam `ambientRepeat(ciclo)` (no template) para não ultrapassar `TOTAL` — assim `tl.duration()` = duração real e o render não sobra cauda muda. Não voltar para `Math.ceil(...)+1`.
- **CTA INEMA.CLUB é sempre a última cena** — anexada pelo gerador (`ALL = [...SCENES, CTA]`). Nunca remover nem mudar de posição.
- **Mid-scene activity, não slideshow**: toda cena tem movimento contínuo (câmera Ken Burns embutida); nas cenas longas, some atividade extra (contador, pulso, drift) ao longo da fala — não deixe o quadro parado depois da entrada.
- **Transições**: corte limpo (`fade`) é o padrão. Especiais (`push/zoom/wipe/slideUp/fadeBlack`, via `transIn` na cena) só em 2–3 momentos-chave (recomendação oficial HyperFrames), não em toda cena. Catálogo em [references/motion.md](references/motion.md).
- **Animar o `.scene-inner`**, nunca o wrapper `.clip` (o framework força `opacity:1` no clip ativo).
- **Cenas e captions em tracks alternados** (1/3 e 2/4) para não dar overlap nas bordas (erro de float).
- **Decorativos off-canvas** (ghost/bg-layer): `data-layout-ignore`.
- **Safe zones no 9:16**: conteúdo no topo-esquerda/centro; base e lateral-direita livres da UI do app (legenda/perfil + botões). O template já aplica nos overrides `body.v`. Ajustar por plataforma em [references/safe-zones.md](references/safe-zones.md).
- **Fallback SVG**: imagem raster (servidor/API, ex.: flux2-klein) é opcional — sem ela, usar **SVG** (ícone/diagrama sempre pode ser SVG; fundo vira SVG flat). Não travar o vídeo. Ver [references/clips-midia.md](references/clips-midia.md).
- **Fontes locais** via `@font-face` (NÃO usar Google Fonts CDN — some no render).
- **Timing é fonte única**: o gerador tira `data-start/duration` E os tempos dos tweens do campo `audio` de cada cena → áudio e animação sempre batidos.
- **Root sem `data-duration`**: a duração da composição vem de `tl.duration()` (contrato HyperFrames). Não adicione `data-duration` no elemento root.
- **Revisar texto antes de gerar áudio/slides**: acentuação PT-BR varrida palavra a palavra, e termos em inglês na **grafia original na tela** mas **foneticamente reescritos na forma-fala** (`txt/sN.txt`, ex.: `deploy`→"deplói"). Acento/pronúncia errados contaminam tela **e** locução de uma vez. Ver [references/revisao-texto.md](references/revisao-texto.md).
- Sempre **conferir frames** com o usuário antes do render final (não consigo ouvir o áudio — pedir pra ele validar a locução).

## Identidade visual (house style)
Paleta dark premium: bg `#0D1321`, painel `#1D2D44`, borda `#3E5C76`, texto `#F0EBD8`, secundário `#748CAB`, **accent âmbar `#FFC300`**, código `#2EC4B6`. Fontes: **Sora** (títulos 700/800), **Inter** (corpo), **JetBrains Mono** (código/URLs). Detalhes em [references/house-style.md](references/house-style.md).

## CTA INEMA.CLUB (cena final padrão)
A última cena mostra "CONTINUA EM" + **INEMA.CLUB** (INEMA creme, .CLUB âmbar, com glow) + URL `🌐 inema.club`, narração curta ("Isso é conteúdo do INEMA ponto CLUB. Acesse: inema ponto club."). Já vem pronta no template (`scene9()` / `case 9`).
