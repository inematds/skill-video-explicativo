#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
mkdir -p audio txt

# ============================================================
#  Voz da narração
#  DEFAULT: inemavox voz "bella" (clone via chatterbox-vc: Edge → timbre da bella).
#  FALLBACK: Kokoro pf_dora (só se o inemavox/bella falhar ou não existir).
#  Regra do usuário (Nei): narração = inemavox bella. Kokoro é rede de segurança.
# ============================================================
INEMAVOX="${INEMAVOX:-$HOME/projetos/inemavox/tts_direct.py}"
BELLA_REF="${BELLA_REF:-$HOME/projetos/timesmkt3/media/voice-refs/bella.wav}"
TTS_PY="${TTS_PY:-python3}"               # roda o tts_direct.py; precisa de edge_tts (o sistema já tem)
ENGINE="${ENGINE:-chatterbox-vc}"         # Edge → clona o timbre da bella (estável p/ narração longa)
KOKORO_VOICE="${KOKORO_VOICE:-pf_dora}"   # fallback (voz PT-BR do Kokoro)

write() { printf '%s\n' "$2" > "txt/$1.txt"; }

# ---- Exemplo (forma-fala revisada): substitua pelos textos das SUAS cenas ----
write s1 "O que são, de verdade, as Skills no Claude Code? Em poucos minutos você vai entender, do princípio mais básico até o uso avançado. E o melhor: sem escrever uma única linha de código."
write s2 "Comece pelo essencial. Uma Skill é só uma pasta com um arquivo chamado SKILL ponto M D. Dentro dele, instruções em Markdown que ensinam o Claude a fazer algo específico: criar vídeos, revisar código, desenhar interfaces. É conhecimento empacotado."
write s3 "Todo SKILL ponto M D começa com duas linhas essenciais: name e description. A descrição é a parte mais importante de todas. É o que o Claude lê para decidir quando usar aquela skill. Quanto mais clara e específica, melhor o gatilho."
write s4 "E aqui está o conceito-chave: divulgação progressiva. O Claude não carrega tudo de uma vez. Na memória fica sempre só o nome e a descrição. Quando a tarefa combina, ele abre o SKILL ponto M D completo. E só se precisar de mais detalhe, ele lê os arquivos de referência. Assim o contexto fica leve e rápido."
write s5 "Onde elas vivem? Na pasta ponto claude, barra skills, do seu projeto. Ou na sua pasta global, para usar em qualquer lugar. Instalar é tão simples quanto copiar a pasta, ou rodar um comando."
write s6 "No nível avançado, uma Skill é muito mais que texto. Ela pode trazer scripts que o Claude executa, paletas, templates e arquivos de referência carregados sob demanda. Você empacota um fluxo de trabalho inteiro, não só uma dica."
write s7 "Quer um exemplo real? Este próprio vídeo. Ele foi inteirinho construído por uma Skill chamada HyperFrames, que ensinou o Claude a transformar HTML em vídeo. Uma skill, um fluxo, um resultado."
write s8 "Skills transformam o Claude Code num especialista sob medida. Comece simples, com um SKILL ponto M D. Depois evolua. Agora é com você."

# ---- Geração: bella (inemavox) → fallback Kokoro ----
gen() {  # gen s1
  local id="$1" tmp
  tmp="$(mktemp -d)"
  if [ -f "$BELLA_REF" ] && "$TTS_PY" "$INEMAVOX" \
        --text "$(cat "txt/$id.txt")" --lang pt \
        --engine "$ENGINE" --ref "$BELLA_REF" --outdir "$tmp" >"$tmp/log" 2>&1 \
        && [ -f "$tmp/generated.wav" ]; then
    mv -f "$tmp/generated.wav" "audio/$id.wav"
    echo "$id: bella (inemavox)"
  else
    echo "$id: inemavox/bella indisponível -> fallback Kokoro $KOKORO_VOICE"
    npx -y hyperframes tts "txt/$id.txt" --voice "$KOKORO_VOICE" --speed 0.98 --output "audio/$id.wav" >/dev/null 2>&1
  fi
  rm -rf "$tmp"
}

for f in $(ls txt/s*.txt 2>/dev/null | sort -V); do
  id="$(basename "$f" .txt)"
  echo "=== gerando $id ==="
  gen "$id"
done

echo "=== durações (alimente o campo audio de cada cena no build-index.mjs) ==="
for f in $(ls audio/s*.wav 2>/dev/null | sort -V); do
  id="$(basename "$f" .wav)"
  d=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$f" 2>/dev/null)
  echo "$id: ${d}s"
done
