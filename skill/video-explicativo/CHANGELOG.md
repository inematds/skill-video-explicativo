# Changelog — video-explicativo

Versionamento: **`v1.yy.xxx`** — `yy` = recurso (feature), `xxx` = correção (bug).

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
