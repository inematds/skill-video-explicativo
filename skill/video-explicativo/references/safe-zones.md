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

## Como o template aplica (e o que ajustar)

Nos overrides `body.v` de `scripts/composition-template.mjs`:

- `body.v .scene{padding:200px 80px 380px;justify-content:flex-start}` — ancora o conteúdo no **topo**,
  com **base de 380px livre**. Aumente o padding-bottom se mirar TikTok (base mais alta).
- `body.v .caption{bottom:330px;…}` — sobe a legenda **acima** da legenda/perfil do app.
- **Lateral direita:** mantenha texto/itens **alinhados à esquerda** (ou com margem direita), fora da coluna
  de botões. Evite elementos colados na borda direita no terço inferior.

## Princípios

1. **Topo-esquerda e centro são sagrados; base e direita-baixo são "emprestados" ao app.**
2. **Caption curta** no 9:16 — quanto menor, menos risco de bater na coluna de botões.
3. **Logo/CTA/dado-chave** ficam no terço superior/central, nunca na base.
4. O mesmo conteúdo no 16:9 usa o frame inteiro; só o ramo `body.v` muda — não mexa no layout horizontal.
