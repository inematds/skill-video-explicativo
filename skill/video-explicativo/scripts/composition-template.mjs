// ============================================================================
// TEMPLATE DE COMPOSIÇÃO (HyperFrames) — data-driven, N de cenas DINÂMICO.
//
// COMO FUNCIONA:
//   - `SCENES[]` = cenas de CONTEÚDO. O nº de itens aqui = nº de cenas.
//     NÃO existe número fixo: o roteiro/plano define quantas cenas entram
//     (ver SKILL.md › "Plano de cenas"). Range saudável: 4–12 de conteúdo.
//   - `CTA` (INEMA.CLUB) é SEMPRE anexada como a ÚLTIMA cena, automaticamente
//     (`ALL = [...SCENES, CTA]`). Não remover — é a assinatura padrão.
//   - Cada cena é um objeto: { audio, caption, html(p), anim(at,p) }
//       audio   -> duração REAL do WAV (ffprobe), em segundos
//       caption -> legenda curta da cena
//       html(p) -> HTML da cena; use o prefixo `p` nos ids (ex.: id="${p}-h")
//       anim(at,p) -> array de strings GSAP; `at(d)` = tempo absoluto (início+d)
//   - mid-scene activity: a câmera Ken Burns (zoom/pan lento) já roda em TODA
//     cena por baixo da coreografia → nunca vira "slideshow" parado. Some
//     atividade contínua extra nas cenas longas (contadores, pulsos, drift).
//
// COMO ADAPTAR a um novo assunto:
//   1. SCENES[] -> uma entrada por beat do roteiro (audio real + caption + html + anim).
//   2. CTA.audio -> duração real do WAV da narração da CTA.
//   3. MUSIC -> (opcional) caminho de um leito sonoro; fica baixo o vídeo todo.
//   Reaproveite as classes CSS já definidas. Transições: corte limpo é o padrão;
//   shader transitions só em 2–3 momentos-chave (ver references/pipeline.md).
//
// Uso: `node build-index.mjs` (16:9) e `node build-index.mjs --vertical` (9:16).
// Fonte única de verdade do timing -> áudio e timeline GSAP sempre batidos.
// ============================================================================
import { writeFileSync, readFileSync } from "node:fs";

// @font-face local (caminhos relativos à raiz do projeto)
const FONT_CSS = readFileSync(new URL("./assets/fonts/fonts.css", import.meta.url), "utf8")
  .replace(/\.\/fonts\//g, "assets/fonts/");

// Formato: padrão 16:9; passe --vertical para 9:16 (Shorts)
const VERT = process.argv.includes("--vertical");
const W = VERT ? 1080 : 1920;
const H = VERT ? 1920 : 1080;
const OUT = "index.html"; // sempre index.html; o modo é definido por --vertical (renderize logo após gerar)

const LEAD = 0.5;   // visual estabelece antes da voz
const TAIL = 0.9;   // segura depois da voz
const FADE = 0.45;

// Leito sonoro opcional (baixo, o vídeo inteiro). null = sem música.
// ex.: const MUSIC = "assets/audio/bg.mp3";  (use um arquivo >= duração do vídeo)
const MUSIC = null;
const MUSIC_VOL = 0.14;

// Título persistente do 9:16 (fica no TOPO o vídeo inteiro e SOME na CTA). Tipografia da casa (Sora + âmbar).
// DUAS LINHAS: l1 = a PERSONA/assunto (impactante) · l2 = a CURIOSIDADE (gancho de retenção → o vídeo
// entrega a resposta). Use <b> p/ a palavra âmbar em cada linha. Só aparece no 9:16 (oculto no 16:9).
// REGRA: no 9:16, sempre defina o TITLE (l1 obrigatório; l2 = gancho, recomendado). null = sem título.
const TITLE = null;   // ex.: { l1: "PROFISSIONAL <b>LIBERAL</b>", l2: "por que ainda faz tudo <b>sozinho?</b>" }

// ---------- CENAS DE CONTEÚDO (N dinâmico) ----------
const SCENES = [
  {
    audio: 10.944,
    caption: "Skills no Claude Code — do básico ao avançado",
    html: (p) => `
      <div class="eyebrow" id="${p}-eyebrow"><span class="dot"></span>CLAUDE CODE · SKILLS</div>
      <h1 class="title">
        <span class="word" id="${p}-w1">Skills</span>
        <span class="word accent" id="${p}-w2">no Claude&nbsp;Code</span>
      </h1>
      <div class="rule" id="${p}-rule"></div>
      <p class="subhead" id="${p}-sub">do primeiro princípio ao avançado<span class="cursor" id="${p}-cur"></span></p>
      <div class="reg tl" id="${p}-r1"></div><div class="reg br" id="${p}-r2"></div>`,
    anim: (at, p) => [
      M.reveal(`#${p}-eyebrow`, at(0.15), { y: -24, d: .55 }),
      M.reveal(`#${p}-w1`, at(0.35), { y: 70, d: .7, ease: "power4.out" }),
      M.reveal(`#${p}-w2`, at(0.55), { y: 70, d: .7, ease: "power4.out" }),
      M.sweep(`#${p}-rule`, at(0.95)),
      M.reveal(`#${p}-sub`, at(1.15), { y: 20, d: .6, ease: EASE.soft }),
      M.blink(`#${p}-cur`, at(1.6), { times: 18 }),
      M.reveal([`#${p}-r1`, `#${p}-r2`], at(0.5), { scale: .5, d: .6, stagger: .12, ease: "back.out(2)" }),
    ],
  },
  {
    audio: 14.464,
    caption: "Uma Skill = uma pasta + um arquivo SKILL.md",
    html: (p) => `
      <div class="grid2">
        <div class="left">
          <div class="folder" id="${p}-folder">
            <div class="folder-tab"></div>
            <div class="folder-body"><span class="mono">minha-skill/</span></div>
            <div class="file-card" id="${p}-file">
              <div class="file-dot"></div><span class="mono">SKILL.md</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="kicker" id="${p}-k">O PRIMEIRO PRINCÍPIO</div>
          <h2 class="h2" id="${p}-h">Uma pasta.<br/>Um arquivo.</h2>
          <div class="chips">
            <span class="chip" id="${p}-c1">criar vídeos</span>
            <span class="chip" id="${p}-c2">revisar código</span>
            <span class="chip" id="${p}-c3">desenhar UI</span>
          </div>
          <p class="lead" id="${p}-lead">É conhecimento <b>empacotado</b>.</p>
        </div>
      </div>`,
    anim: (at, p) => [
      M.reveal(`#${p}-folder`, at(0.2), { x: -60, scale: .9, d: .7 }),
      M.reveal(`#${p}-file`, at(0.9), { y: 40, d: .6, ease: EASE.back }),
      M.reveal(`#${p}-k`, at(0.5), { y: -16, d: .5, ease: EASE.soft }),
      M.reveal(`#${p}-h`, at(0.7), { x: 40, d: .6 }),
      M.reveal([`#${p}-c1`, `#${p}-c2`, `#${p}-c3`], at(1.4), { y: 24, d: .5, stagger: .13, ease: "back.out(1.7)" }),
      M.reveal(`#${p}-lead`, at(2.1), { y: 16, d: .55, ease: EASE.soft }),
      M.float(`#${p}-file`, at(2.6)),   // mid-scene activity: o arquivo "respira"
    ],
  },
  {
    audio: 13.760,
    caption: "name + description — a description é o gatilho",
    html: (p) => `
      <div class="kicker center" id="${p}-k">ANATOMIA DO SKILL.md</div>
      <div class="code" id="${p}-code">
        <div class="code-bar"><i></i><i></i><i></i><span class="mono dim">SKILL.md</span></div>
        <pre class="mono"><span class="ln" id="${p}-l1"><span class="punc">---</span></span>
<span class="ln" id="${p}-l2"><span class="key">name:</span> <span class="val">youtube-thumbnail</span></span>
<span class="ln" id="${p}-l3"><span class="key">description:</span> <span class="val">Cria thumbnails. <span class="hl"><span class="marker" id="${p}-mark"></span>Use quando o usuário pedir…</span></span></span>
<span class="ln" id="${p}-l4"><span class="punc">---</span></span></pre>
      </div>
      <div class="tagrow">
        <span class="tag" id="${p}-t1"><b>name</b> = identidade</span>
        <span class="tag accent2" id="${p}-t2"><b>description</b> = quando usar</span>
        <span class="arrow-note" id="${p}-note">↑ o gatilho</span>
      </div>`,
    anim: (at, p) => [
      M.reveal(`#${p}-k`, at(0.2), { y: -16, d: .5, ease: EASE.soft }),
      M.reveal(`#${p}-code`, at(0.4), { y: 36, d: .6 }),
      M.reveal([`#${p}-l1`, `#${p}-l2`, `#${p}-l3`, `#${p}-l4`], at(0.7), { x: -18, d: .4, stagger: .12, ease: EASE.soft }),
      M.sweep(`#${p}-mark`, at(2.0), { d: .7, ease: "power2.inOut" }),   // highlight na frase-gatilho
      M.reveal([`#${p}-t1`, `#${p}-t2`], at(2.4), { y: 20, d: .5, stagger: .14, ease: EASE.back }),
      M.reveal(`#${p}-note`, at(2.9), { y: 10, d: .5, ease: EASE.soft }),
    ],
  },
  {
    audio: 17.237333,
    caption: "Divulgação progressiva: carrega só quando precisa",
    transIn: "zoom",   // momento-chave: entra com zoom no conceito central
    html: (p) => `
      <div class="kicker center" id="${p}-k">O CONCEITO-CHAVE · DIVULGAÇÃO PROGRESSIVA</div>
      <div class="layers">
        <div class="layer" id="${p}-L1"><span class="lnum">1</span><div class="ltxt"><b>name + description</b><span class="lsub">sempre na memória</span></div><span class="lbadge">always</span></div>
        <div class="layer" id="${p}-L2"><span class="lnum">2</span><div class="ltxt"><b>SKILL.md completo</b><span class="lsub">carrega quando a tarefa combina</span></div><span class="lbadge">on match</span></div>
        <div class="layer" id="${p}-L3"><span class="lnum">3</span><div class="ltxt"><b>referências · scripts</b><span class="lsub">só sob demanda</span></div><span class="lbadge">on demand</span></div>
      </div>
      <div class="meter" id="${p}-meter"><div class="meter-label mono">contexto</div><div class="meter-bar"><div class="meter-fill" id="${p}-fill"></div></div><div class="meter-val mono" id="${p}-val">leve</div></div>`,
    anim: (at, p) => [
      M.reveal(`#${p}-k`, at(0.2), { y: -16, d: .5, ease: EASE.soft }),
      M.reveal(`#${p}-L1`, at(0.6), { x: -40, d: .55 }),
      M.raw(`tl.to("#${p}-L1",{"--lit":1,borderColor:"var(--accent)",duration:.4},${at(1.0)});`),
      M.reveal(`#${p}-L2`, at(1.9), { x: -40, d: .55 }),
      M.reveal(`#${p}-L3`, at(3.2), { x: -40, d: .55 }),
      M.bar(`#${p}-fill`, at(1.0), .26),   // contexto "leve" subindo
      M.reveal(`#${p}-meter`, at(0.8), { y: 18, d: .5, ease: EASE.soft }),
    ],
  },
  {
    audio: 10.858667,
    caption: "Onde vivem: .claude/skills (projeto ou global)",
    html: (p) => `
      <div class="kicker center" id="${p}-k">ONDE VIVEM · COMO INSTALAR</div>
      <div class="paths">
        <div class="pathcard" id="${p}-p1">
          <div class="ptag mono">GLOBAL</div>
          <div class="ppath mono">~/.claude/skills/</div>
          <div class="pdesc">vale em qualquer projeto</div>
        </div>
        <div class="pathcard" id="${p}-p2">
          <div class="ptag mono accentbg">PROJETO</div>
          <div class="ppath mono">.claude/skills/</div>
          <div class="pdesc">só neste repositório</div>
        </div>
      </div>
      <div class="term" id="${p}-term"><span class="prompt mono">$</span> <span class="mono cmd" id="${p}-cmd">npx skills add &lt;skill&gt;</span><span class="cursor" id="${p}-cur"></span></div>`,
    anim: (at, p) => [
      M.reveal(`#${p}-k`, at(0.2), { y: -16, d: .5, ease: EASE.soft }),
      M.reveal(`#${p}-p1`, at(0.5), { x: -50, d: .6 }),
      M.reveal(`#${p}-p2`, at(0.7), { x: 50, d: .6 }),
      M.reveal(`#${p}-term`, at(1.6), { y: 30, d: .55 }),
      M.type(`#${p}-cmd`, at(2.0)),        // comando digitando
      M.blink(`#${p}-cur`, at(3.1)),
    ],
  },
  {
    audio: 13.525333,
    caption: "Avançado: scripts, referências e templates",
    html: (p) => `
      <div class="grid2">
        <div class="left">
          <div class="kicker" id="${p}-k">NÍVEL AVANÇADO</div>
          <h2 class="h2" id="${p}-h">Muito mais<br/>que texto.</h2>
          <ul class="bullets">
            <li id="${p}-b1"><span class="bdot"></span>scripts que o Claude executa</li>
            <li id="${p}-b2"><span class="bdot"></span>referências carregadas sob demanda</li>
            <li id="${p}-b3"><span class="bdot"></span>paletas &amp; templates reutilizáveis</li>
          </ul>
          <p class="lead" id="${p}-lead">Um <b>fluxo de trabalho</b> inteiro — não só uma dica.</p>
        </div>
        <div class="right">
          <div class="tree" id="${p}-tree">
            <div class="trow root mono" id="${p}-r0">hyperframes/</div>
            <div class="trow mono" id="${p}-r1">├─ SKILL.md</div>
            <div class="trow mono" id="${p}-r2">├─ references/<span class="dim">*.md</span></div>
            <div class="trow mono run" id="${p}-r3">├─ scripts/<span class="dim">*.mjs</span> <span class="runtag">run</span></div>
            <div class="trow mono" id="${p}-r4">└─ palettes/<span class="dim">*.md</span></div>
          </div>
        </div>
      </div>`,
    anim: (at, p) => [
      M.reveal(`#${p}-k`, at(0.2), { y: -16, d: .5, ease: EASE.soft }),
      M.reveal(`#${p}-h`, at(0.4), { x: -30, d: .6 }),
      M.reveal([`#${p}-b1`, `#${p}-b2`, `#${p}-b3`], at(0.9), { x: -24, d: .5, stagger: .16, ease: EASE.soft }),
      M.reveal(`#${p}-lead`, at(2.0), { y: 16, d: .55, ease: EASE.soft }),
      M.reveal(`#${p}-tree`, at(0.6), { x: 40, d: .6 }),
      M.reveal([`#${p}-r0`, `#${p}-r1`, `#${p}-r2`, `#${p}-r3`, `#${p}-r4`], at(0.9), { x: 18, d: .4, stagger: .12, ease: EASE.soft }),
      M.tint(`#${p}-r3`, at(2.2)),         // destaque pulsando na linha "run"
    ],
  },
  {
    audio: 11.114667,
    caption: "Este vídeo foi feito pela Skill HyperFrames",
    transIn: "push",   // momento-chave: empurra pra revelar o exemplo real
    html: (p) => `
      <p class="meta-top" id="${p}-top">Quer um exemplo real?</p>
      <h2 class="h2 center" id="${p}-h">Este vídeo foi feito<br/>por uma <span class="accent">Skill</span>.</h2>
      <div class="badge" id="${p}-badge"><div class="badge-halo" id="${p}-halo"></div><span class="badge-name">HyperFrames</span></div>
      <div class="flow mono" id="${p}-flow"><span class="fitem" id="${p}-f1">HTML</span><span class="farr" id="${p}-a1">→</span><span class="fitem big" id="${p}-f2">🎬</span><span class="farr" id="${p}-a2">→</span><span class="fitem" id="${p}-f3">vídeo</span></div>`,
    anim: (at, p) => [
      M.reveal(`#${p}-top`, at(0.2), { y: -16, d: .5, ease: EASE.soft }),
      M.reveal(`#${p}-h`, at(0.5), { y: 30, d: .6 }),
      M.reveal(`#${p}-badge`, at(1.4), { scale: .4, y: 0, d: .7, ease: EASE.pop }),
      M.ping(`#${p}-halo`, at(1.7)),       // halo pulsando no badge
      M.reveal([`#${p}-f1`, `#${p}-a1`, `#${p}-f2`, `#${p}-a2`, `#${p}-f3`], at(2.5), { y: 20, d: .45, stagger: .14, ease: EASE.back }),
    ],
  },
  {
    audio: 8.170667,
    caption: "Comece com um SKILL.md. Agora é com você.",
    html: (p) => `
      <p class="closer-sub" id="${p}-sub">Skills transformam o Claude Code num especialista sob medida.</p>
      <h1 class="closer" id="${p}-h">Comece com um<br/><span class="accent">SKILL.md</span></h1>
      <div class="rule center" id="${p}-rule"></div>
      <p class="sig mono" id="${p}-sig">agora é com você</p>`,
    anim: (at, p) => [
      M.reveal(`#${p}-sub`, at(0.2), { y: -16, d: .55, ease: EASE.soft }),
      M.reveal(`#${p}-h`, at(0.6), { scale: .85, y: 0, d: .8 }),
      M.sweep(`#${p}-rule`, at(1.3)),
      M.reveal(`#${p}-sig`, at(1.6), { letter: "0.5em", y: 0, d: .9, ease: EASE.soft }),
    ],
  },
];

// ---------- CTA INEMA.CLUB (SEMPRE a última cena — anexada automaticamente) ----------
const CTA = {
  audio: 3.840,
  caption: "Mais conteúdo em inema.club",
  transIn: "fadeBlack",   // dip-to-black antes da CTA INEMA.CLUB (quebra forte, intencional)
  html: (p) => `
    <div class="cta-eyebrow" id="${p}-eye">CONTINUA EM</div>
    <div class="cta-brand" id="${p}-brand"><span class="b1">INEMA</span><span class="bdotsep">.</span><span class="b2">CLUB</span></div>
    <div class="rule center" id="${p}-rule"></div>
    <div class="cta-url mono" id="${p}-url"><span class="cta-globe">🌐</span>inema.club</div>
    <div class="reg tl" id="${p}-r1"></div><div class="reg br" id="${p}-r2"></div>`,
  anim: (at, p) => [
    M.reveal(`#${p}-eye`, at(0.2), { y: -18, d: .5, ease: EASE.soft }),
    M.reveal(`#${p}-brand`, at(0.5), { scale: .7, y: 0, d: .7, ease: "back.out(1.7)" }),
    M.sweep(`#${p}-rule`, at(1.1), { d: .6 }),
    M.reveal(`#${p}-url`, at(1.3), { y: 20, d: .55, ease: EASE.soft }),
    M.glow(`#${p}-brand`, at(1.4)),       // marca INEMA.CLUB com glow âmbar pulsando
    M.reveal([`#${p}-r1`, `#${p}-r2`], at(0.6), { scale: .5, d: .6, stagger: .12, ease: "back.out(2)" }),
  ],
};

// CTA garantida no fim. NÃO inverter esta ordem.
const ALL = [...SCENES, CTA];

// ---------- TIMING (fonte única) ----------
let t = 0;
const S = ALL.map((sc, i) => {
  const dur = LEAD + sc.audio + TAIL;
  const o = { i: i + 1, start: round(t), dur: round(dur), audioStart: round(t + LEAD), audioDur: round(sc.audio), end: round(t + dur) };
  t += dur;
  return o;
});
const TOTAL = round(t);
function round(n) { return Math.round(n * 1000) / 1000; }

// ---------- VOCABULÁRIO DE MOVIMENTO (estilo da casa — ver references/motion.md) ----------
// Toda cena compõe a partir daqui → o movimento fica CONSISTENTE (não tweens soltos).
const J = (s) => JSON.stringify(s);
const VMOVE = VERT ? 0.7 : 1;          // (d) deslocamentos menores no 9:16 (tela estreita)
const mv = (v) => Math.round(v * VMOVE);
const EASE = { out: "power3.out", soft: "power2.out", in: "power2.in", back: "back.out(1.6)", expo: "expo.out", pop: "back.out(1.8)" };
const M = {
  // entrada padrão (a base do estilo): desloca + fade, ease-assinatura, stagger opcional
  reveal(sel, at, o = {}) {
    const f = ["opacity:0"];
    if (o.x) f.push(`x:${mv(o.x)}`);
    if (o.y) f.push(`y:${mv(o.y)}`);
    if (o.scale != null) f.push(`scale:${o.scale}`);
    if (o.letter) f.push(`letterSpacing:${J(o.letter)}`);
    const extra = o.stagger ? `,stagger:${o.stagger}` : "";
    return `tl.from(${J(sel)},{${f.join(",")},duration:${o.d ?? 0.55},ease:"${o.ease ?? EASE.out}"${extra}},${at});`;
  },
  sweep(sel, at, o = {}) { return `tl.fromTo(${J(sel)},{scaleX:0},{scaleX:1,duration:${o.d ?? 0.7},ease:"${o.ease ?? EASE.expo}",transformOrigin:"left center"},${at});`; },
  type(sel, at, o = {}) { return `tl.fromTo(${J(sel)},{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0% 0 0)",duration:${o.d ?? 1.1},ease:"steps(${o.steps ?? 22})"},${at});`; },
  blink(sel, at, o = {}) { return `tl.fromTo(${J(sel)},{opacity:1},{opacity:0,duration:${o.d ?? 0.5},repeat:${o.times ?? 10},yoyo:true,ease:"none"},${at});`; },
  float(sel, at, o = {}) { return `tl.to(${J(sel)},{y:"-=${mv(o.dist ?? 10)}",duration:${o.d ?? 1.6},repeat:${o.repeat ?? 4},yoyo:true,ease:"sine.inOut"},${at});`; },
  pulse(sel, at, o = {}) { return `tl.fromTo(${J(sel)},{scale:1},{scale:${o.s ?? 1.08},duration:${o.d ?? 0.35},repeat:${(o.times ?? 3) * 2 - 1},yoyo:true,ease:"sine.inOut"},${at});`; },
  glow(sel, at, o = {}) { const c = o.color ?? "255,195,0"; return `tl.fromTo(${J(sel)},{filter:"drop-shadow(0 0 0px rgba(${c},0))"},{filter:"drop-shadow(0 0 ${o.blur ?? 26}px rgba(${c},.55))",duration:${o.d ?? 1.1},repeat:${o.times ?? 4},yoyo:true,ease:"sine.inOut"},${at});`; },
  ping(sel, at, o = {}) { return `tl.fromTo(${J(sel)},{scale:.6,opacity:.7},{scale:1.5,opacity:0,duration:${o.d ?? 1.6},repeat:${o.times ?? 4},ease:"sine.out"},${at});`; },
  tint(sel, at, o = {}) { const c = o.color ?? "46,196,182"; return `tl.fromTo(${J(sel)},{backgroundColor:"rgba(${c},0)"},{backgroundColor:"rgba(${c},${o.a ?? 0.14})",duration:${o.d ?? 0.5},repeat:${o.times ?? 5},yoyo:true,ease:"sine.inOut"},${at});`; },
  bar(sel, at, to, o = {}) { return `tl.fromTo(${J(sel)},{scaleX:0},{scaleX:${to},duration:${o.d ?? 1.1},ease:"${o.ease ?? EASE.soft}",transformOrigin:"left center"},${at});`; },
  // contador subindo (mid-scene activity de dados) — determinístico no render
  countUp(sel, at, to, o = {}) { return `tl.to({v:${o.from ?? 0}},{v:${to},duration:${o.d ?? 1.2},ease:"${o.ease ?? EASE.soft}",onUpdate(){var e=document.querySelector(${J(sel)});if(e)e.textContent=Math.round(this.targets()[0].v)+${J(o.suffix ?? "")};}},${at});`; },
  set(sel, at, props) { return `tl.to(${J(sel)},{${props},duration:${0.4}},${at});`; },
  raw(s) { return s; },        // escape hatch p/ algo fora do vocabulário
};

// ---------- TRANSIÇÕES (corte limpo = 'fade'; especiais em 2–3 momentos — ver motion.md) ----------
// Transform vai no CLIP (.scene) — o framework só força opacity:1 nele, não o transform.
// A opacidade vai no .scene-inner. Assim não conflita com a câmera Ken Burns (que é no inner).
// Cada boundary é definido pelo `transIn` da cena que ENTRA (a cena que sai usa o mesmo tipo).
const TRANS = {
  fade: {
    in: (c, n, at, d) => [`tl.fromTo(${J(n)},{opacity:0},{opacity:1,duration:${d},ease:"power2.out"},${at});`],
    out: (c, n, at, d) => [`tl.to(${J(n)},{opacity:0,duration:${d},ease:"power2.in"},${at});`],
  },
  push: {
    in: (c, n, at, d) => [`tl.set(${J(n)},{opacity:1},${at});`, `tl.fromTo(${J(c)},{xPercent:110},{xPercent:0,duration:${d},ease:"power3.out"},${at});`],
    out: (c, n, at, d) => [`tl.to(${J(c)},{xPercent:-110,duration:${d},ease:"power3.in"},${at});`],
  },
  slideUp: {
    in: (c, n, at, d) => [`tl.set(${J(n)},{opacity:1},${at});`, `tl.fromTo(${J(c)},{yPercent:110},{yPercent:0,duration:${d},ease:"power3.out"},${at});`],
    out: (c, n, at, d) => [`tl.to(${J(c)},{yPercent:-110,duration:${d},ease:"power3.in"},${at});`],
  },
  zoom: {
    in: (c, n, at, d) => [`tl.fromTo(${J(n)},{opacity:0},{opacity:1,duration:${d},ease:"power2.out"},${at});`, `tl.fromTo(${J(c)},{scale:0.7},{scale:1,duration:${d},ease:"power3.out"},${at});`],
    out: (c, n, at, d) => [`tl.to(${J(n)},{opacity:0,duration:${d},ease:"power2.in"},${at});`, `tl.to(${J(c)},{scale:1.35,duration:${d},ease:"power3.in"},${at});`],
  },
  wipe: {
    in: (c, n, at, d) => [`tl.set(${J(n)},{opacity:1},${at});`, `tl.fromTo(${J(c)},{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0% 0 0)",duration:${d},ease:"power2.inOut"},${at});`],
    out: (c, n, at, d) => [`tl.to(${J(c)},{clipPath:"inset(0 0 0 100%)",duration:${d},ease:"power2.inOut"},${at});`],
  },
  fadeBlack: {     // dip-to-black via overlay #tdip (mais forte — use em quebras de capítulo / antes da CTA)
    in: (c, n, at, d) => [`tl.fromTo(${J(n)},{opacity:0},{opacity:1,duration:${round(d * 0.6)},ease:"power2.out"},${round(at + d * 0.4)});`, `tl.fromTo("#tdip",{opacity:1},{opacity:0,duration:${d},ease:"power2.out"},${at});`],
    out: (c, n, at, d) => [`tl.to(${J(n)},{opacity:0,duration:${round(d * 0.6)},ease:"power2.in"},${at});`, `tl.fromTo("#tdip",{opacity:0},{opacity:1,duration:${d},ease:"power2.in"},${at});`],
  },
};

// ---------- ANIMAÇÃO POR CENA ----------
function emitScene(sc, idx) {
  const s = S[idx];
  const i = s.i;
  const p = `s${i}`;
  const at = (d) => round(s.start + d);
  const dur = round(s.end - s.start);
  const clip = `#s${i}`, inner = `#scene-inner-${i}`;
  const inType = TRANS[sc.transIn] ? sc.transIn : "fade";        // transição que ENTRA nesta cena
  const next = ALL[idx + 1];
  const outType = next && TRANS[next.transIn] ? next.transIn : "fade"; // saída = transIn da próxima
  const L = [];
  // mid-scene activity: câmera Ken Burns (zoom/pan lento) a cena INTEIRA → não vira slide
  L.push(`tl.fromTo(${J(inner)},{scale:1,yPercent:0},{scale:1.05,yPercent:-1.6,duration:${dur},ease:"sine.inOut"},${s.start});`);
  // transição de entrada / saída
  for (const line of TRANS[inType].in(clip, inner, s.start, FADE)) L.push(line);
  for (const line of TRANS[outType].out(clip, inner, round(s.end - FADE), FADE)) L.push(line);
  L.push(`tl.set(${J(inner)},{opacity:0},${round(s.end)});`);
  // coreografia da cena
  for (const line of sc.anim(at, p)) L.push(line);
  // caption
  L.push(`tl.fromTo("#cap-${i}",{opacity:0,y:14},{opacity:1,y:0,duration:.5,ease:"power2.out"},${at(0.35)});`);
  L.push(`tl.to("#cap-${i}",{opacity:0,duration:.4,ease:"power2.in"},${round(s.end - 0.55)});`);
  return L.join("\n      ");
}

// ---------- MONTAGEM ----------
const scenesHTML = S.map((s, idx) => `
    <section id="s${s.i}" class="scene clip" data-start="${s.start}" data-duration="${s.dur}" data-track-index="${s.i % 2 === 1 ? 1 : 3}">
      <div class="scene-inner" id="scene-inner-${s.i}">${ALL[idx].html(`s${s.i}`)}</div>
    </section>`).join("");

const captionsHTML = S.map((s, idx) => `
    <div class="caption clip" id="cap-${s.i}" data-start="${s.start}" data-duration="${s.dur}" data-track-index="${s.i % 2 === 1 ? 2 : 4}">${ALL[idx].caption}</div>`).join("");

const audioHTML = S.map((s) => `
    <audio id="a${s.i}" data-start="${s.audioStart}" data-duration="${s.audioDur}" data-track-index="20" src="assets/audio/s${s.i}.wav"></audio>`).join("");

const musicHTML = MUSIC ? `
    <audio id="bgm" data-start="0" data-duration="${TOTAL}" data-track-index="21" data-volume="${MUSIC_VOL}" src="${MUSIC}"></audio>` : "";

const animJS = S.map((s, idx) => emitScene(ALL[idx], idx)).join("\n      ");

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      ${FONT_CSS}
      :root{
        --bg:#0D1321; --bg2:#1D2D44; --bg3:#3E5C76;
        --fg:#F0EBD8; --muted:#748CAB; --accent:#FFC300; --accent2:#FCA311; --code:#2EC4B6;
      }
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{width:${W}px;height:${H}px;overflow:hidden;background:var(--bg);color:var(--fg);
        font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
      .mono{font-family:"JetBrains Mono",ui-monospace,monospace}
      #root{position:relative;width:${W}px;height:${H}px;overflow:hidden}

      /* ---- background persistente ---- */
      .bg-layer{position:absolute;inset:0;z-index:0;pointer-events:none}
      #glow{position:absolute;top:-260px;left:-180px;width:1100px;height:1100px;border-radius:50%;
        background:radial-gradient(circle,rgba(255,195,0,.20),rgba(255,195,0,0) 62%);filter:blur(8px)}
      #glow2{position:absolute;bottom:-360px;right:-240px;width:1200px;height:1200px;border-radius:50%;
        background:radial-gradient(circle,rgba(46,196,182,.10),rgba(46,196,182,0) 62%)}
      #grid{position:absolute;inset:-2px;opacity:.5;
        background-image:linear-gradient(rgba(116,140,171,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(116,140,171,.07) 1px,transparent 1px);
        background-size:64px 64px}
      .ghost{position:absolute;font-family:Sora,sans-serif;font-weight:800;color:rgba(255,195,0,.04);
        font-size:520px;line-height:.8;letter-spacing:-.03em;top:240px;left:-40px;white-space:nowrap;user-select:none}
      #grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:overlay;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
      #progress{position:absolute;left:0;bottom:0;height:6px;width:100%;transform:scaleX(0);transform-origin:left center;
        background:linear-gradient(90deg,var(--accent),var(--accent2));z-index:40;box-shadow:0 0 18px rgba(255,195,0,.5)}
      #tdip{position:absolute;inset:0;background:#000;opacity:0;z-index:38;pointer-events:none}
      /* título persistente do assunto (SÓ 9:16; some na CTA) — persona (l1) + gancho de retenção (l2) */
      #toptitle{position:absolute;top:0;left:0;right:0;z-index:34;display:none;flex-direction:column;align-items:center;
        gap:12px;padding:50px 54px 0;pointer-events:none;text-align:center}
      #toptitle .tt-l1{font-family:Sora,sans-serif;font-weight:800;font-size:58px;letter-spacing:.02em;line-height:1.0;
        text-transform:uppercase;color:var(--fg);text-shadow:0 4px 26px rgba(0,0,0,.85)}
      #toptitle .tt-l1 b{color:var(--accent)}
      #toptitle .tt-l2{font-family:Sora,sans-serif;font-weight:700;font-size:40px;line-height:1.05;color:var(--fg);
        text-shadow:0 3px 22px rgba(0,0,0,.9)}
      #toptitle .tt-l2 b{color:var(--accent)}
      #toptitle .tt-l2::before{content:"";display:block;width:74px;height:5px;margin:0 auto 16px;border-radius:4px;
        background:linear-gradient(90deg,var(--accent),var(--accent2))}
      body.v #toptitle{display:flex}

      /* ---- cena base ---- */
      .scene{position:absolute;inset:0;z-index:10;display:flex;flex-direction:column;justify-content:center;
        padding:120px 150px 150px}
      .scene-inner{position:relative;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center}
      .kicker{font-family:"JetBrains Mono",monospace;font-size:22px;letter-spacing:.28em;color:var(--accent);
        text-transform:uppercase;margin-bottom:26px;font-weight:600}
      .kicker.center{text-align:center}
      .h2{font-family:Sora,sans-serif;font-weight:800;font-size:92px;line-height:1.02;letter-spacing:-.02em}
      .h2.center{text-align:center}
      .lead{font-size:34px;color:var(--muted);margin-top:30px}.lead b{color:var(--fg)}
      .accent{color:var(--accent)}.accent2{color:var(--accent2)}.dim{color:var(--muted)}

      /* cena 1 */
      .eyebrow{display:inline-flex;align-items:center;gap:14px;font-family:"JetBrains Mono",monospace;
        font-size:26px;letter-spacing:.3em;color:var(--muted);font-weight:600}
      .eyebrow .dot{width:14px;height:14px;border-radius:50%;background:var(--accent);box-shadow:0 0 16px var(--accent)}
      .title{font-family:Sora,sans-serif;font-weight:800;font-size:172px;line-height:.95;letter-spacing:-.03em;margin:24px 0}
      .title .word{display:block}
      .rule{height:7px;width:520px;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:6px;margin:10px 0 30px}
      .rule.center{margin:34px auto}
      .subhead{font-size:40px;color:var(--muted)}
      .cursor{display:inline-block;width:18px;height:38px;background:var(--accent);margin-left:10px;vertical-align:-4px;border-radius:2px}
      .reg{position:absolute;width:48px;height:48px;border:3px solid var(--bg3)}
      .reg.tl{top:0;left:0;border-right:none;border-bottom:none}
      .reg.br{bottom:0;right:0;border-left:none;border-top:none}

      /* layout 2 colunas */
      .grid2{display:grid;grid-template-columns:1fr 1fr;gap:90px;align-items:center;width:100%}
      .grid2 .right{display:flex;flex-direction:column}

      /* cena 2 folder */
      .folder{position:relative;width:520px;height:360px;margin:0 auto}
      .folder-tab{position:absolute;top:6px;left:0;width:210px;height:54px;background:var(--accent2);border-radius:16px 16px 0 0}
      .folder-body{position:absolute;top:46px;left:0;width:520px;height:300px;background:linear-gradient(160deg,#24395a,var(--bg2));
        border:2px solid var(--bg3);border-radius:8px 22px 22px 22px;display:flex;align-items:flex-end;padding:26px;font-size:30px;color:var(--muted)}
      .file-card{position:absolute;top:120px;left:120px;display:flex;align-items:center;gap:16px;background:#0a1b2e;
        border:2px solid var(--accent);border-radius:14px;padding:24px 34px;font-size:34px;color:var(--fg);
        box-shadow:0 24px 60px rgba(0,0,0,.5)}
      .file-dot{width:16px;height:16px;border-radius:50%;background:var(--accent);box-shadow:0 0 14px var(--accent)}
      .chips{display:flex;gap:18px;margin-top:38px;flex-wrap:wrap}
      .chip{background:rgba(116,140,171,.12);border:2px solid var(--bg3);border-radius:999px;padding:16px 30px;
        font-size:28px;color:var(--fg);font-weight:600}
      .kicker:not(.center){display:inline-block}

      /* cena 3 código */
      .code{width:1360px;margin:8px auto 0;background:#0a1626;border:2px solid var(--bg3);border-radius:18px;overflow:hidden;
        box-shadow:0 30px 80px rgba(0,0,0,.5)}
      .code-bar{display:flex;align-items:center;gap:12px;padding:20px 28px;background:#0c1a2c;border-bottom:2px solid var(--bg3)}
      .code-bar i{width:16px;height:16px;border-radius:50%;background:#2a3f5c}
      .code-bar .dim{margin-left:18px;font-size:24px}
      .code pre{padding:34px 40px;font-size:33px;line-height:1.6;color:var(--fg);white-space:pre}
      .code .key{color:var(--accent)}.code .val{color:var(--code)}.code .punc{color:var(--muted)}
      .code .ln{display:block;position:relative}
      .code .hl{position:relative;color:var(--fg)}
      .marker{position:absolute;left:-6px;right:-6px;top:1px;bottom:1px;background:rgba(255,195,0,.30);
        border-radius:6px;transform:scaleX(0);transform-origin:left center;z-index:-1}
      .tagrow{display:flex;align-items:center;gap:26px;justify-content:center;margin-top:46px;flex-wrap:wrap}
      .tag{background:rgba(116,140,171,.12);border:2px solid var(--bg3);border-radius:12px;padding:16px 28px;font-size:28px}
      .tag b{color:var(--accent)}.tag.accent2{border-color:var(--accent)}.tag.accent2 b{color:var(--accent2)}
      .arrow-note{font-family:"JetBrains Mono",monospace;color:var(--accent);font-size:26px}

      /* cena 4 camadas */
      .layers{display:flex;flex-direction:column;gap:24px;width:1180px;margin:0 auto}
      .layer{--lit:0;display:flex;align-items:center;gap:30px;background:linear-gradient(90deg,rgba(255,195,0,calc(.06*var(--lit))),rgba(29,45,68,.7));
        border:2px solid var(--bg3);border-radius:18px;padding:30px 40px}
      .lnum{width:64px;height:64px;flex:none;border-radius:50%;background:var(--bg2);border:2px solid var(--bg3);
        display:flex;align-items:center;justify-content:center;font-family:Sora;font-weight:800;font-size:32px;color:var(--accent)}
      .ltxt{display:flex;flex-direction:column;flex:1}
      .ltxt b{font-size:40px;font-family:Sora;font-weight:700}
      .lsub{font-size:26px;color:var(--muted);margin-top:4px}
      .lbadge{font-family:"JetBrains Mono",monospace;font-size:22px;color:var(--bg);background:var(--accent);
        padding:8px 18px;border-radius:999px;font-weight:700}
      .layers .layer:nth-child(2) .lbadge{background:var(--accent2)}
      .layers .layer:nth-child(3) .lbadge{background:var(--code)}
      .meter{display:flex;align-items:center;gap:24px;width:1180px;margin:38px auto 0}
      .meter-label{font-size:24px;color:var(--muted)}
      .meter-bar{flex:1;height:22px;background:var(--bg2);border:2px solid var(--bg3);border-radius:999px;overflow:hidden}
      .meter-fill{height:100%;width:100%;transform:scaleX(0);transform-origin:left center;
        background:linear-gradient(90deg,var(--code),var(--accent));border-radius:999px}
      .meter-val{font-size:26px;color:var(--code);font-weight:700}

      /* cena 5 paths */
      .paths{display:grid;grid-template-columns:1fr 1fr;gap:40px;width:1180px;margin:0 auto}
      .pathcard{background:linear-gradient(160deg,#22364f,var(--bg2));border:2px solid var(--bg3);border-radius:20px;padding:44px}
      .ptag{display:inline-block;font-size:22px;letter-spacing:.2em;color:var(--bg);background:var(--muted);
        padding:8px 18px;border-radius:8px;font-weight:700;margin-bottom:24px}
      .ptag.accentbg{background:var(--accent)}
      .ppath{font-size:46px;color:var(--fg);font-weight:600}
      .pdesc{font-size:28px;color:var(--muted);margin-top:18px}
      .term{width:1180px;margin:40px auto 0;background:#0a1626;border:2px solid var(--bg3);border-radius:14px;
        padding:30px 38px;font-size:38px;display:flex;align-items:center}
      .term .prompt{color:var(--code);margin-right:18px}
      .term .cmd{color:var(--fg)}

      /* cena 6 bullets + tree */
      .bullets{list-style:none;margin:34px 0 0;display:flex;flex-direction:column;gap:22px}
      .bullets li{display:flex;align-items:center;gap:20px;font-size:34px;color:var(--fg)}
      .bdot{width:16px;height:16px;flex:none;border-radius:4px;background:var(--accent);box-shadow:0 0 12px var(--accent);transform:rotate(45deg)}
      .tree{background:#0a1626;border:2px solid var(--bg3);border-radius:18px;padding:40px 44px;box-shadow:0 30px 80px rgba(0,0,0,.5)}
      .trow{font-size:38px;line-height:1.9;color:var(--fg);border-radius:8px;padding:0 12px}
      .trow.root{color:var(--accent);font-weight:700}
      .runtag{font-family:"JetBrains Mono";font-size:22px;color:var(--bg);background:var(--code);padding:4px 14px;border-radius:8px;margin-left:14px;font-weight:700}

      /* cena 7 meta */
      .meta-top{text-align:center;font-size:34px;color:var(--muted)}
      .badge{position:relative;width:560px;height:130px;margin:48px auto;display:flex;align-items:center;justify-content:center;
        background:linear-gradient(120deg,#22364f,var(--bg2));border:2px solid var(--accent);border-radius:22px;
        box-shadow:0 24px 70px rgba(0,0,0,.5)}
      .badge-name{font-family:Sora;font-weight:800;font-size:60px;letter-spacing:-.01em;
        background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
      .badge-halo{position:absolute;inset:-2px;border-radius:22px;border:2px solid var(--accent);opacity:.6}
      .flow{display:flex;align-items:center;justify-content:center;gap:34px;font-size:52px;color:var(--fg)}
      .flow .farr{color:var(--accent)}
      .flow .big{font-size:72px}

      /* cena 8 fecho */
      .closer-sub{text-align:center;font-size:34px;color:var(--muted);margin-bottom:20px}
      .closer{text-align:center;font-family:Sora;font-weight:800;font-size:128px;line-height:1.02;letter-spacing:-.02em}
      .sig{text-align:center;font-size:30px;color:var(--accent);letter-spacing:.3em;text-transform:uppercase;margin-top:20px}

      /* cena CTA (INEMA.CLUB) */
      .cta-eyebrow{text-align:center;font-family:"JetBrains Mono",monospace;font-size:26px;letter-spacing:.36em;
        color:var(--muted);text-transform:uppercase;margin-bottom:30px}
      .cta-brand{text-align:center;font-family:Sora;font-weight:800;font-size:150px;line-height:.95;letter-spacing:-.02em}
      .cta-brand .b1{color:var(--fg)}.cta-brand .b2{color:var(--accent)}.cta-brand .bdotsep{color:var(--accent)}
      .cta-url{display:flex;align-items:center;justify-content:center;gap:16px;font-size:46px;color:var(--muted);margin-top:32px}
      .cta-globe{font-size:38px;filter:grayscale(.2)}

      /* caption */
      .caption{position:absolute;left:50%;transform:translateX(-50%);bottom:64px;z-index:30;
        max-width:1500px;text-align:center;font-size:36px;font-weight:600;color:var(--fg);
        background:rgba(10,18,30,.72);border:1px solid var(--bg3);border-radius:14px;padding:18px 40px;
        backdrop-filter:blur(6px);text-shadow:0 2px 10px rgba(0,0,0,.6)}

      /* =================== OVERRIDES 9:16 (Shorts) =================== */
      /* SAFE ZONES p/ redes sociais (9:16): MENSAGEM no meio; base (~360px) e lateral-direita livres
         da UI do app (legenda/@perfil + botões). Mídia/ilustração entra como FAIXA DE TOPO (direita→esquerda);
         se não houver imagem, usar ícone SVG no topo (fallback). Ver references/safe-zones.md. */
      body.v .scene{padding:170px 80px 360px}
      body.v .grid2{grid-template-columns:1fr;gap:54px}
      body.v .kicker{margin-bottom:20px;font-size:20px}
      body.v .h2{font-size:74px}
      body.v .lead{font-size:30px;margin-top:24px}
      /* cena 1 */
      body.v .eyebrow{font-size:22px}
      body.v .title{font-size:118px;margin:20px 0}
      body.v .rule{width:360px;margin-bottom:24px}
      body.v .subhead{font-size:34px}
      /* cena 2 */
      body.v .folder{width:440px;height:300px}
      body.v .folder-body{width:440px;height:254px}
      body.v .file-card{font-size:30px;top:110px;left:96px}
      body.v .chips{margin-top:30px;gap:14px}
      body.v .chip{font-size:26px;padding:14px 24px}
      /* cena 3 */
      body.v .code{width:940px}
      body.v .code pre{font-size:23px;padding:26px 30px;line-height:1.6}
      body.v .code-bar .dim{font-size:20px}
      body.v .tagrow{gap:16px;margin-top:36px}
      body.v .tag{font-size:23px;padding:12px 20px}
      body.v .arrow-note{font-size:22px}
      /* cena 4 */
      body.v .layers{width:940px;gap:18px}
      body.v .layer{padding:22px 26px;gap:22px}
      body.v .lnum{width:54px;height:54px;font-size:28px}
      body.v .ltxt b{font-size:34px}
      body.v .lsub{font-size:22px}
      body.v .lbadge{font-size:18px;padding:6px 14px}
      body.v .meter{width:940px;margin-top:30px}
      /* cena 5 */
      body.v .paths{grid-template-columns:1fr;gap:26px;width:940px}
      body.v .pathcard{padding:36px}
      body.v .ppath{font-size:42px}
      body.v .pdesc{font-size:26px}
      body.v .term{width:940px;font-size:31px;margin-top:34px}
      /* cena 6 */
      body.v .bullets{margin-top:28px;gap:18px}
      body.v .bullets li{font-size:30px}
      body.v .tree{padding:32px 34px}
      body.v .trow{font-size:30px;line-height:1.85}
      /* cena 7 */
      body.v .meta-top{font-size:30px}
      body.v .h2.center{font-size:78px}
      body.v .badge{width:480px;height:118px;margin:42px auto}
      body.v .badge-name{font-size:54px}
      body.v .flow{font-size:44px;gap:24px}
      body.v .flow .big{font-size:60px}
      /* cena 8 */
      body.v .closer-sub{font-size:30px}
      body.v .closer{font-size:104px}
      body.v .sig{font-size:28px}
      /* cena CTA */
      body.v .cta-brand{font-size:116px}
      body.v .cta-url{font-size:42px}
      /* caption OCULTA no 9:16 — base livre p/ a UI do app; o conteúdo da tela já comunica. Ver references/safe-zones.md */
      body.v .caption{display:none}
      /* glows reposicionados pro frame alto */
      body.v #glow{top:-200px;left:-160px;width:900px;height:900px}
      body.v #glow2{bottom:-300px;right:-200px;width:1000px;height:1000px}
      body.v .ghost{font-size:380px;top:520px}
    </style>
  </head>
  <body class="${VERT ? "v" : ""}">
    <div id="root" data-composition-id="main" data-start="0" data-width="${W}" data-height="${H}">
      <div class="bg-layer" data-layout-ignore>
        <div id="glow"></div><div id="glow2"></div><div id="grid"></div>
        <div class="ghost" id="ghost" data-layout-ignore>SKILL.md</div><div id="grain"></div>
      </div>
      ${TITLE ? `<div id="toptitle" data-layout-ignore><span class="tt-l1">${TITLE.l1}</span>${TITLE.l2 ? `<span class="tt-l2">${TITLE.l2}</span>` : ""}</div>` : ""}
${scenesHTML}
${captionsHTML}
      <div id="progress"></div>
      <div id="tdip"></div>
${audioHTML}${musicHTML}
      <script>
        window.__timelines = window.__timelines || {};
        const tl = gsap.timeline({ paused: true });
        const TOTAL = ${TOTAL};
        // repete um loop SEM ultrapassar TOTAL (senão tl.duration() estoura e sobra
        // silêncio no fim do render — o HyperFrames usa tl.duration() como fim).
        const ambientRepeat = (cycle) => Math.max(0, Math.floor(TOTAL / cycle) - 1);
        // ambiente (movimento de fundo persistente)
        tl.to("#glow",{scale:1.22,opacity:.55,duration:4.5,yoyo:true,repeat:ambientRepeat(4.5),ease:"sine.inOut"},0);
        tl.to("#glow2",{scale:1.18,duration:6,yoyo:true,repeat:ambientRepeat(6),ease:"sine.inOut"},0);
        tl.to("#ghost",{x:120,duration:TOTAL,ease:"none"},0);
        tl.to("#grid",{backgroundPositionX:"+=128",backgroundPositionY:"+=128",duration:18,repeat:ambientRepeat(18),ease:"none"},0);
        tl.fromTo("#progress",{scaleX:0},{scaleX:1,duration:TOTAL,ease:"none"},0);
        ${TITLE ? `tl.fromTo("#toptitle",{opacity:0,y:-18},{opacity:1,y:0,duration:.6,ease:"power2.out"},0.35);
        tl.to("#toptitle",{opacity:0,y:-18,duration:.5,ease:"power2.in"},${round(S[S.length - 1].start - 0.3)});` : ""}
        // cenas
      ${animJS}
        // sentinela: estende a timeline até o fim da composição
        tl.set({}, {}, TOTAL);
        window.__timelines["main"] = tl;
      </script>
    </div>
  </body>
</html>
`;

writeFileSync(new URL("./" + OUT, import.meta.url), html);
console.log(`${OUT} gerado · ${W}x${H} · TOTAL = ${TOTAL}s · ${S.length} cenas (${SCENES.length} conteúdo + CTA)`);
S.forEach((s, idx) => console.log(`  s${s.i}${idx === S.length - 1 ? " [CTA]" : ""}: start=${s.start} dur=${s.dur} audio@${s.audioStart} (${s.audioDur}s)`));
