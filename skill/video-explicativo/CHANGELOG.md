# Changelog — video-explicativo

Versionamento: **`v1.yy.xxx`** — `yy` = recurso (feature), `xxx` = correção (bug).

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
