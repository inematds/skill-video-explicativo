# House style — dark premium (padrão do usuário)

Copie isto como `design.md` na raiz do projeto de vídeo e ajuste só se o usuário pedir outro mood.

## Paleta (dark / premium)
- `--bg`: `#0D1321` (azul-noite, nunca #000 puro)
- `--bg2`: `#1D2D44` (painéis/cards)
- `--bg3`: `#3E5C76` (bordas/divisores)
- `--fg`: `#F0EBD8` (texto, branco-creme quente)
- `--muted`: `#748CAB` (secundário)
- `--accent`: `#FFC300` (âmbar — destaque ÚNICO dominante)
- `--accent2`: `#FCA311` (âmbar quente p/ gradientes)
- `--code`: `#2EC4B6` (verde-água, só código/valores)

Regra: UM accent dominante (âmbar). Fundo idêntico em todas as cenas.

## Tipografia
- Títulos: **Sora** 700–800 (geométrica), 72–172px (16:9) / 104–118px (9:16).
- Corpo/legenda: **Inter** 400–600, 28–40px.
- Código/URL/labels: **JetBrains Mono**.
- Sempre embutir `.woff2` local (subset latin cobre PT-BR). Nunca CDN.

## Composição de vídeo (não é web!)
- 8–10 elementos por cena; nunca fundo chapado.
- Camada de fundo persistente (`data-layout-ignore`): glow radial âmbar respirando, ghost text gigante driftando, grid hairline, grão.
- Escala grande: headline 64–172px, corpo 28–42px, decorativos 12–25% opacidade, bordas 2–4px.
- Movimento: **linguagem definida** — toda cena compõe do vocabulário `M.*` (entradas 0.4–0.7s, easing-assinatura, stagger 0.08–0.14s, mid-scene activity, ritmo ≥3 eventos/cena). Detalhes em [motion.md](motion.md). Toda decoração tem motion ambiente.
- Captions no rodapé (Inter 600, fundo translúcido). Barra de progresso âmbar no rodapé.

## Formatos
- 16:9 → 1920×1080. 9:16 → 1080×1920 (overrides via `body.v` no gerador).
- Sempre gerar AS DUAS versões por padrão.

## CTA final (INEMA.CLUB)
"CONTINUA EM" + **INEMA.CLUB** (INEMA `--fg`, ".CLUB" `--accent`, glow drop-shadow) + `🌐 inema.club` (mono). Narração: "Isso é conteúdo do INEMA ponto CLUB. Acesse: inema ponto club."
