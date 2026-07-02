# Changelog — video-explicativo

Versionamento: **`v1.yy.xxx`** — `yy` = recurso (feature), `xxx` = correção (bug).

## 1.10.3 — Título do 9:16 em 2 linhas (persona + gancho)
Evolução do título persistente (1.9.3): agora são **duas linhas** com a tipografia da casa.

- **`const TITLE = { l1, l2 }`**: **l1 = persona/assunto** (impactante), **l2 = curiosidade** (gancho de
  retenção logo abaixo, separado por régua âmbar). `<b>` = palavra âmbar em cada linha. O loop fica mais
  forte: a persona chama o público certo, o gancho segura pra resposta.
- Sora + régua âmbar (`--accent`→`--accent2`) — combina com o layout. Só 9:16; some na CTA.
- Regra de ouro atualizada. Validado no piloto Liberal v1 ("PROFISSIONAL LIBERAL" / "por que ainda faz
  tudo sozinho?").

## 1.9.3 — Título do assunto persistente no 9:16
Recurso de retenção: um **título do assunto fixo no topo** do vertical, o vídeo inteiro, sumindo na CTA.

- **`const TITLE`** novo no gerador: 1–2 palavras grandes (âmbar via `<b>`) que **chamam atenção e prendem**
  — cria o loop "título → resposta". Fica no topo o vídeo todo e **some na CTA** (fade-out em `CTA.start`).
  Renderizado **só no 9:16** (oculto no 16:9 via `body.v`).
- **Regra de ouro nova:** no 9:16, sempre definir `TITLE`; não duplicar no eyebrow da cena 1.
- Validado no piloto (Liberal v1): título "PROFISSIONAL LIBERAL" fixo, ausente na CTA.

## 1.8.3 — Voz `bella` (inemavox) como default, Kokoro vira fallback
Mudança de default de narração: a skill nasceu com Kokoro `pf_dora`, mas a voz da casa é a **`bella`**
(inemavox). Agora **bella é o padrão** e o Kokoro só entra se o inemavox falhar.

- **`narration-template.sh` reescrito:** gera cada WAV com **inemavox `bella`** (`tts_direct.py
  --engine chatterbox-vc --ref bella.wav`: Edge TTS + transferência de timbre) e faz **fallback
  automático para Kokoro `pf_dora`** por cena se o inemavox não estiver disponível. Também ficou
  **genérico** — itera sobre todos os `sN.txt` que existirem (não trava mais em 1..8).
- **Verificado end-to-end:** teste real gerou WAV de 7.48s com a bella (env conda `chatterbox` OK,
  `python3` do sistema roda o `tts_direct.py` via `edge_tts`).
- **Regra de ouro nova:** "Voz = bella (inemavox), Kokoro é fallback" — não gerar em Kokoro por
  padrão só porque é o embutido do HyperFrames.
- `SKILL.md` (Pré-requisitos + passo 5) e `references/pipeline.md` (seção Narração) atualizados.
  Curso/landing ainda citam Kokoro (superfície publicada separada) — trocar sob demanda.

## 1.7.3 — Gancho, áudio sob a voz, imagem×texto e variações
Recurso: quatro comportamentos que eram feitos "por instinto" viram **contrato explícito** na skill —
retenção da abertura, música que não briga com a voz, legibilidade de texto sobre imagem, e o que é
uma "variação".

- **Gancho de abertura (regra de ouro):** a cena 1 tem que **parar o scroll** — abrir direto no gancho
  (pergunta/tensão/número/promessa/erro comum), imagem/texto forte no 1º segundo, sem aquecimento. Os
  ~3s iniciais definem a retenção. Passo 1 (Roteiro) e `pipeline.md` (padrões de gancho) atualizados.
- **Música sempre bem baixa sob a narração (regra de ouro):** a voz manda; teto `MUSIC_VOL ~0.14`
  (0.10–0.18). Documentado o **ducking opcional** (camadas de áudio segmentadas: baixo sob a fala, mais
  alto nos vazios) em `clips-midia.md`, pra quando houver trechos sem voz.
- **Imagem nunca briga com o texto (regra de ouro):** texto sobre imagem exige **scrim** (gradiente
  escuro), **blur** na imagem, ou **bloco-painel** isolando o texto — nunca imagem crua. Três snippets
  prontos em `clips-midia.md`.
- **Variações:** nova seção no SKILL.md — variação = roteiro + narração + layout + **ângulo/arco**
  diferentes (não o mesmo vídeo re-renderizado, e não os dois formatos 16:9/9:16 que já são padrão).
  Nomeação `<nome>-vN-…`.

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
