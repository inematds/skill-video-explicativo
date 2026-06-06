# Linguagem de movimento (estilo da casa)

O movimento é **definido**, não improvisado cena a cena. Toda cena compõe a partir do
vocabulário `M` no gerador (`composition-template.mjs`) → o vídeo tem uma assinatura de
movimento consistente. Editar movimento = usar/ajustar esses presets, não escrever tween solto.

## Princípios
- **Entrada rápida, saída suave.** Entradas 0.4–0.7s; o quadro nunca "salta".
- **Um accent em movimento por vez.** Não competir por atenção — um elemento âmbar guia o olho.
- **Easing-assinatura.** Padrão `power3.out` (entrada), `expo.out` (réguas/sweeps), `back.out` (chips/badges com vida). Centralizados em `EASE`.
- **Mid-scene activity (anti-slideshow).** Câmera Ken Burns roda a cena INTEIRA por baixo; nas cenas longas, soma atividade contínua (float, pulse, contador) durante a fala. Nada de quadro morto depois da entrada.
- **Ritmo (regra prática).** Cada cena tem **≥3 eventos de movimento distribuídos ao longo da fala** — não despeje tudo nos 2s iniciais. Revele cada elemento quando a voz o mencionar.
- **Transições.** Corte limpo (crossfade do `.scene-inner`) é o padrão. Shader transitions só em **2–3 momentos-chave** (recomendação oficial HyperFrames), nunca em toda cena.

## Vocabulário (`M.*` no gerador)
Cada helper retorna uma string GSAP; chame com `M.x("#sel", at(t), { opções })`.

| Preset | Para que serve |
| --- | --- |
| `reveal(sel, at, {x,y,scale,letter,d,ease,stagger})` | **entrada padrão** — desloca + fade. Base de quase tudo. Aceita array de seletores p/ stagger. |
| `sweep(sel, at, {d,ease})` | régua/marcador/preenchimento horizontal (`scaleX 0→1`). |
| `bar(sel, at, to, {d,ease})` | barra/medidor enchendo até `to` (0–1). |
| `type(sel, at, {d,steps})` | texto/comando "digitando" (clip-path em steps). |
| `blink(sel, at, {times,d})` | cursor piscando. |
| `float(sel, at, {dist,d,repeat})` | flutuação contínua (mid-scene activity). |
| `pulse(sel, at, {s,times,d})` | ênfase: escala pulsando (sincronize com a palavra-chave da voz). |
| `glow(sel, at, {color,blur,times,d})` | brilho âmbar pulsando (marca/CTA). |
| `ping(sel, at, {times,d})` | halo expandindo e sumindo (badge). |
| `tint(sel, at, {color,a,times,d})` | fundo de um item piscando (destaque de linha). |
| `countUp(sel, at, to, {from,suffix,d})` | número subindo (data story). Determinístico no render. |
| `raw(str)` | escape hatch p/ algo fora do vocabulário (use com parcimônia). |

## Transições entre cenas (`TRANS`)
Padrão = **corte limpo** (`fade`). Use as especiais em **2–3 momentos-chave** apenas (recomendação oficial), nunca em toda cena. Marque na cena que ENTRA: `transIn: "zoom"` (a cena que sai usa o mesmo tipo automaticamente).

| Tipo | Efeito |
| --- | --- |
| `fade` | cross-dissolve (default). |
| `push` | a cena nova empurra a antiga pra fora (lateral). |
| `slideUp` | desliza de baixo pra cima. |
| `zoom` | zoom-through (sai crescendo, entra do pequeno). |
| `wipe` | varredura horizontal (clip-path). |
| `fadeBlack` | dip-to-black via overlay `#tdip` — quebra forte (quebra de capítulo / antes da CTA). |

Implementação: o transform vai no **clip** (`.scene`) e a opacidade no `.scene-inner` — o framework só força `opacity:1` no clip, então o transform passa livre e não conflita com a câmera Ken Burns (que é no inner). Para transição com shader (efeito mais pesado), ver o catálogo oficial do HyperFrames.

## Movimento por formato (16:9 vs 9:16)
O gerador escala os deslocamentos por `VMOVE` (`1` no 16:9, `0.7` no 9:16) via `mv()`. Tela
estreita = movimentos menores, sem reescrever nada: os mesmos `reveal/float` saem mais contidos
no vertical. Escalas (`scale`) e durações não mudam — só translação.

## Como adicionar movimento a uma cena
1. Na `anim: (at, p) => [...]` da cena, componha com `M.*` em vez de `tl....` cru.
2. Distribua os `at(t)` ao longo da fala (ritmo ≥3 eventos).
3. Em cena longa, feche com uma atividade contínua (`float`/`pulse`/`countUp`).
4. Precisa de algo que não existe no vocabulário? Adicione um preset novo em `M` (não um tween solto na cena) — assim o estilo cresce de forma reutilizável.
