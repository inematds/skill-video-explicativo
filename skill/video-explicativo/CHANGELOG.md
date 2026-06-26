# Changelog — video-explicativo

Versionamento: **`v1.yy.xxx`** — `yy` = recurso (feature), `xxx` = correção (bug).

## 1.6.3 — Revisão de texto + pronúncia de inglês
Recurso: nova etapa **antes** de gerar narração e slides, fechando um buraco do pipeline (o texto ia
direto pra tela e pro TTS sem nenhuma revisão de acentuação/ortografia).

- **Passo 2 "Revisão de texto"** inserido no fluxo (passos renumerados; 7→8). Revisa acentuação PT-BR
  palavra a palavra e a ortografia de **todo** texto de tela (`caption` **+** literais em `html(p)`) e da
  forma-fala (`txt/sN.txt`) **antes** dos WAVs e dos slides.
- **Contrato de duas formas por frase**: **tela** (PT-BR acentuado + inglês na grafia original) vs
  **fala** (siglas/URLs expandidas + inglês reescrito foneticamente). Formaliza o que já existia em parte
  ("SKILL.md" → "SKILL ponto M D").
- **Pronúncia de termos em inglês**: como PT-BR usa muito termo em inglês e o Kokoro fonemiza pela grafia
  escrita, a forma-fala troca por grafia fonética (`deploy`→"deplói", `design`→"dizáin", `skill`→"skiu"…).
  Na dúvida, gerar WAV de teste e o usuário ouvir.
- Nova referência [`references/revisao-texto.md`](references/revisao-texto.md) (checklist + léxico inglês→PT
  + acentos que mais escapam + como testar). `SKILL.md` (regra de ouro nova) e `pipeline.md` atualizados.

## 1.5.3 — Um arquivo por formato (sem `-FINAL` duplicado)
Correção de saída confusa:

- **Saída única por formato.** O fluxo gerava dois MP4 por formato — o render cru do HyperFrames (`<nome>-16x9.mp4`, ~100-120 MB) **e** uma cópia comprimida ao lado (`<nome>-16x9-FINAL.mp4`, ~25 MB). Mesmo vídeo, dois arquivos → confunde. Agora a regra é **um arquivo por formato e só**: o render já é a entrega, **sem** segunda cópia comprimida.
- **Compressão é opt-in.** Só quando o usuário pedir arquivo mais leve. E mesmo aí, a compressão **sobrescreve o mesmo nome** (via `.tmp.mp4` + `mv -f`), nunca deixando os dois. Passo 7 (Render) e regras de ouro atualizados.

## 1.5.2 — Sem cauda muda + saída única em ~/projetos/output
Duas correções:

- **Bug do silêncio no fim:** os loops de ambiente repetiam com `Math.ceil(TOTAL/ciclo)+1`, fazendo o tween mais longo (`#grid`, ciclo 18s) ultrapassar `TOTAL` em até ~40-50s. Como o HyperFrames usa `tl.duration()` como fim, o render sobrava com cauda muda. Agora usam `ambientRepeat(ciclo) = floor(TOTAL/ciclo)-1` → nenhum loop passa de `TOTAL` e `tl.duration()` = duração real.
- **Pasta única:** todo o conteúdo (projeto, assets, áudios, `index.html` e MP4 finais) vive em `~/projetos/output/<nome>/`. Projeto é criado com `cd ~/projetos/output && npx hyperframes init <nome>`; não há mais `renders/` local. Render, init e regra de ouro atualizados.

## 1.5.1 — Layout 9:16 validado (mídia no topo, mensagem no meio)
Correção do layout vertical após teste real (caso hormozi-12-dicas):

- **Mensagem no MEIO** (não mais ancorada no topo — o `.scene-inner` recentralizava, então o "topo" não pegava).
- **Mídia/ilustração = faixa de TOPO entrando da direita→esquerda**; sem imagem → ícone SVG no topo (fallback).
- **Caption oculta no 9:16** (`display:none`) → base totalmente livre p/ a UI do app.
- `safe-zones.md` ganhou a seção "Layout validado p/ 9:16".

## 1.5.0 — Safe zones 9:16 + fallback SVG
Recurso: layout vertical respeita as zonas da UI das redes sociais, e geração de imagem passa a ter fallback SVG.

- **Safe zones (9:16):** overrides `body.v` ancoram o conteúdo no topo (base ~380px e lateral-direita livres da UI
  do app — legenda/perfil + botões), caption sobe pra `bottom:330px`. Nova ref [`references/safe-zones.md`](references/safe-zones.md) com o mapa e os knobs por plataforma.
- **Fallback SVG:** imagem raster (servidor/API, ex.: flux2-klein) vira **opcional** — sem ela, usar SVG (ícone/diagrama
  sempre pode ser SVG; fundo vira SVG flat). Documentado em [`references/clips-midia.md`](references/clips-midia.md).
- Duas novas regras de ouro no SKILL.md. Origem: caso `videoprodutor/videos/hormozi-12-dicas` (3 camadas).

## 1.4.0 — Transições entre cenas
Recurso: cardápio de transições reimplementado em GSAP (inspirado nos templates Remotion/RVE), usado nos 2–3 momentos-chave.

- Mapa `TRANS` no gerador: `fade` (default), `push`, `slideUp`, `zoom`, `wipe`, `fadeBlack`.
- Marcação por cena via `transIn` (a cena que sai usa o mesmo tipo automaticamente).
- Transform vai no **clip** (`.scene`), opacidade no `.scene-inner` → não conflita com a câmera Ken Burns.
- Overlay `#tdip` (dip-to-black) para `fadeBlack`.
- Exemplo aplica 3 momentos: zoom no conceito-chave, push no exemplo real, fade-to-black antes da CTA.
- Catálogo de transições em [`references/motion.md`](references/motion.md).

## 1.3.0 — Linguagem de movimento
Recurso: o movimento vira um **estilo definido e reutilizável**, não mais tweens improvisados cena a cena.

- **Vocabulário de movimento** (`M.*`) no gerador: `reveal`, `sweep`, `bar`, `type`, `blink`, `float`, `pulse`, `glow`, `ping`, `tint`, `countUp`. Toda cena compõe a partir dele.
- Cenas-exemplo **refatoradas** para usar o vocabulário (consistência de assinatura).
- **Movimento por formato** (`VMOVE`): deslocamentos menores no 9:16 automaticamente.
- **Ritmo** definido: ≥3 eventos de movimento distribuídos ao longo da fala.
- Nova referência [`references/motion.md`](references/motion.md); `house-style.md` aponta pra ela.

## 1.2.0 — Cenas data-driven + mid-scene activity
Recurso: o vídeo deixa de parecer slideshow e o nº de cenas passa a sair do roteiro.

- Gerador **data-driven**: `SCENES[]` define o nº de cenas (**N dinâmico**, range 4–12 + CTA).
- **Plano de cenas**: o assunto decide a quantidade; default ~1:40–2:00; override do usuário manda.
- **CTA INEMA.CLUB anexada automaticamente** como última cena (`ALL = [...SCENES, CTA]`).
- **Mid-scene activity**: câmera Ken Burns embutida em toda cena (anti-slideshow).
- **Música de fundo** opcional (`MUSIC` + `data-volume`, track 21).
- Correção de contrato: **root sem `data-duration`** (duração vem de `tl.duration()`).
- Nova referência [`references/clips-midia.md`](references/clips-midia.md) (vídeo/imagem/música + timing relativo); pegadinha do `<video>` em `gotchas.md`.
- Commits: `6a9ac06` (skill), `2917490` (README).

## 1.0.0 — Release inicial
- Skill `video-explicativo` + curso INEMA.CLUB + `.zip` empacotado.
- Pipeline HTML→MP4 (HyperFrames + Kokoro TTS local), house style dark premium âmbar, 16:9 e 9:16.
