# Revisão de texto (antes da narração e dos slides)

Etapa obrigatória **antes** de gerar os WAVs (`assets/txt/sN.txt`) e **antes** de escrever
qualquer texto na tela (campo `caption` + literais dentro de `html(p)`: títulos, chips, labels).
Acento errado contamina os **dois** lados ao mesmo tempo: vira typo visível na tela **e** muda a
tônica/pronúncia no Kokoro (ele fonemiza a partir da grafia escrita).

## Princípio: cada frase tem DUAS formas

| Forma | Onde vai | Como escrever |
|---|---|---|
| **Tela** | `caption` + texto dentro de `html(p)` | PT-BR com ortografia/acentuação **corretas**; termos em inglês na **grafia original** (`deploy`, `design`, `prompt`). |
| **Fala** | `assets/txt/sN.txt` (vai pro TTS) | Mesma frase, mas (a) siglas/URLs **expandidas** e (b) termos em inglês **reescritos foneticamente** em PT-BR. |

A forma-fala já existia em parte ("SKILL.md" → "SKILL ponto M D"). Aqui ela ganha a camada de **inglês**.

## Checklist de revisão

1. **Acentuação** — varrer **cada** palavra (á à â ã · é ê · í · ó ô õ · ú · ç · crase).
2. **Ortografia / digitação / concordância** — ler a frase inteira em voz mental.
3. **Siglas e URLs (forma-fala)** — `SKILL.md` → "SKILL ponto M D"; `.claude/skills` → "ponto claude, barra skills"; `inema.club` → "inema ponto club".
4. **Termos em inglês** — manter a grafia original **na tela**; na **forma-fala**, trocar pela grafia fonética (tabela abaixo). Na dúvida, **gerar um WAV de teste** e o usuário ouvir.

### Acentos que mais escapam (PT-BR)
vídeo · você · é · só · está · três · código · página · conteúdo · princípio · mecânica · ícone ·
áudio · após · até · também · então · número · análise · fácil · rápido · automático · específico ·
inteligência · experiência · usuário · próprio · já · não.

## Termos em inglês → grafia fonética (forma-fala)

Léxico-semente para o conteúdo INEMA (IA / dev / marketing). **Só na forma-fala** (`txt/sN.txt`);
na tela fica o original. Aproximações — quando não bater de primeira, ajustar pelo teste de WAV.

| Inglês (tela) | Forma-fala (txt) | | Inglês (tela) | Forma-fala (txt) |
|---|---|---|---|---|
| skill / skills | skiu / skiuz | | deploy | deplói |
| prompt | prompt *(testar; senão "prónpti")* | | design | dizáin |
| designer | dizáiner | | frontend | frôntend |
| backend | béquend | | framework | frêimuork |
| software | sóftuer | | hardware | rárduer |
| cloud | claud | | update | âpdeit |
| upgrade | âpgreid | | release | rilís |
| feature | fítcher | | review | rivíu |
| bug / debug | bãg / dibãg | | code | coud |
| token / tokens | tôken / tôkens | | dataset | dêitaset |
| dashboard | déshbord | | workflow | uórkflôu |
| machine learning | mâchin lârning | | deep learning | dip lârning |
| startup | stártâp | | default | difólt |
| insight | ínsait | | mindset | máindset |
| streaming | stríming | | template | témpleit |

**Geralmente NÃO precisam respelling** (o fonemizador PT já lê aceitável): `link`, `site`, `web`,
`online`, `email` (imêiu), `player`, `kit`, `chip`. Não force — respelling demais piora.

### Como testar uma pronúncia (quando em dúvida)
```bash
printf '%s\n' "a forma-fala da palavra aqui" > /tmp/probe.txt
npx -y hyperframes tts /tmp/probe.txt --voice pf_dora --speed 0.98 --output /tmp/probe.wav
```
Pedir o usuário ouvir e escolher a grafia que soa certo (eu não ouço áudio). Fixar a vencedora no `txt/sN.txt`.

## Saída da etapa
- `txt/sN.txt` revisados (acentos OK + siglas/URLs/inglês na forma-fala) → prontos pro Kokoro.
- Texto de tela revisado (acentos OK + inglês na grafia original) → pronto pra entrar em `caption` e `html(p)`.
