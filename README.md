# 🎬 HyperFrames — Vídeos explicativos com Claude Code

Curso completo, no formato **INEMA.CLUB**, sobre a Skill **`video-explicativo`**: como criar vídeos
explicativos narrados (HTML → MP4) com o Claude Code e o framework [HyperFrames](https://github.com/heygen-com/hyperframes) —
animados, em PT-BR, renderizados **localmente, sem chave de API**, nos formatos 16:9 (YouTube) e 9:16 (Shorts/Reels).

> Este curso nasceu de um vídeo que foi, ele mesmo, **feito por uma Skill**.

## 🌐 Acesse o curso

**https://inematds.github.io/skill-video-explicativo/**

## 📚 As 4 trilhas

| Trilha | Tema | O que cobre |
|--------|------|-------------|
| 🧩 **T1 — Skills no Claude Code** | Fundamentos | O que é uma Skill, o `SKILL.md`, `name` + `description`, divulgação progressiva, onde vivem |
| 🎬 **T2 — Pipeline: HTML → MP4** | Prático | Setup, roteiro, narração TTS (Kokoro), composição em GSAP, lint/inspect, render 16:9 e 9:16 |
| 🔧 **T3 — Por dentro do skill** | Avançado | Estrutura do skill, house style dark premium, o gerador `build-index.mjs`, gotchas de produção |
| 💡 **T4 — Aplicações & Prompts** | Prático | YouTube, Shorts, onboarding, aulas, lançamentos + biblioteca de prompts prontos |

## 📦 A Skill

A Skill `video-explicativo` está incluída neste repositório:

- Pasta navegável: [`skill/video-explicativo/`](skill/video-explicativo/)
- Download: [`downloads/video-explicativo.zip`](downloads/video-explicativo.zip)

Instale copiando a pasta para `~/.claude/skills/` (global) ou `.claude/skills/` (projeto) e peça um vídeo
ao Claude Code: *"faça um vídeo explicativo sobre X, em 16:9 e 9:16, terminando com a CTA do INEMA.CLUB."*

### Stack
- **HyperFrames** (HTML → MP4 via Chrome headless + FFmpeg)
- **Kokoro** (TTS local PT-BR, voz `pf_dora`, sem chave de API)
- **GSAP** (animação das cenas)

## 🗂️ Estrutura do repositório

```
index.html                 # Landing
curso/
  index.html               # Índice das trilhas
  trilha1..4/
    index.html             # Índice da trilha (mapa + módulos)
    modulo-X-Y.html        # Páginas de módulo (16 no total)
skill/video-explicativo/   # A Skill, navegável
downloads/                 # .zip da Skill
```

---

Conteúdo do [**INEMA.CLUB**](https://inema.club) · 2026
