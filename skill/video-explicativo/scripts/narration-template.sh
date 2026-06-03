#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
mkdir -p audio txt

write() { printf '%s\n' "$2" > "txt/$1.txt"; }

write s1 "O que são, de verdade, as Skills no Claude Code? Em poucos minutos você vai entender, do princípio mais básico até o uso avançado. E o melhor: sem escrever uma única linha de código."
write s2 "Comece pelo essencial. Uma Skill é só uma pasta com um arquivo chamado SKILL ponto M D. Dentro dele, instruções em Markdown que ensinam o Claude a fazer algo específico: criar vídeos, revisar código, desenhar interfaces. É conhecimento empacotado."
write s3 "Todo SKILL ponto M D começa com duas linhas essenciais: name e description. A descrição é a parte mais importante de todas. É o que o Claude lê para decidir quando usar aquela skill. Quanto mais clara e específica, melhor o gatilho."
write s4 "E aqui está o conceito-chave: divulgação progressiva. O Claude não carrega tudo de uma vez. Na memória fica sempre só o nome e a descrição. Quando a tarefa combina, ele abre o SKILL ponto M D completo. E só se precisar de mais detalhe, ele lê os arquivos de referência. Assim o contexto fica leve e rápido."
write s5 "Onde elas vivem? Na pasta ponto claude, barra skills, do seu projeto. Ou na sua pasta global, para usar em qualquer lugar. Instalar é tão simples quanto copiar a pasta, ou rodar um comando."
write s6 "No nível avançado, uma Skill é muito mais que texto. Ela pode trazer scripts que o Claude executa, paletas, templates e arquivos de referência carregados sob demanda. Você empacota um fluxo de trabalho inteiro, não só uma dica."
write s7 "Quer um exemplo real? Este próprio vídeo. Ele foi inteirinho construído por uma Skill chamada HyperFrames, que ensinou o Claude a transformar HTML em vídeo. Uma skill, um fluxo, um resultado."
write s8 "Skills transformam o Claude Code num especialista sob medida. Comece simples, com um SKILL ponto M D. Depois evolua. Agora é com você."

for i in 1 2 3 4 5 6 7 8; do
  echo "=== gerando s$i ==="
  npx -y hyperframes tts "txt/s$i.txt" --voice pf_dora --speed 0.98 --output "audio/s$i.wav" 2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g' | grep -aiE "saved|error|fail|duration|wrote|->" | tail -3 || true
done
echo "=== durações ==="
for i in 1 2 3 4 5 6 7 8; do
  d=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "audio/s$i.wav" 2>/dev/null)
  echo "s$i: ${d}s"
done
