// ============================================================================
// TEMPLATE DE COMPOSIÇÃO (HyperFrames) — adapte para cada novo vídeo.
// Exemplo: vídeo "Skills no Claude Code" (9 cenas; a 9ª é a CTA INEMA.CLUB).
//
// COMO ADAPTAR a um novo assunto:
//   1. AUDIO[]    -> durações REAIS (ffprobe) dos WAVs, na ordem das cenas
//                    (mantenha a última = narração da CTA s9).
//   2. CAPTIONS[] -> uma legenda curta por cena.
//   3. sceneN()   -> HTML de cada cena (reaproveite as classes CSS já definidas).
//   4. anim(i,t)  -> tweens GSAP por cena (case N).
//   5. BODIES     -> liste as funções sceneN na ordem.
//   6. scene9()/case 9 = CTA INEMA.CLUB -> NÃO remover (assinatura padrão).
// CSS dark premium, camada de fundo, captions, barra de progresso, overrides
// 9:16 (body.v) e a CTA já estão prontos. Em geral só se mexe nas cenas + AUDIO[].
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

const AUDIO = [10.944, 14.464, 13.760, 17.237333, 10.858667, 13.525333, 11.114667, 8.170667, 3.840];
const LEAD = 0.5;   // visual estabelece antes da voz
const TAIL = 0.9;   // segura depois da voz
const FADE = 0.45;

// Timing por cena
let t = 0;
const S = AUDIO.map((a, i) => {
  const dur = LEAD + a + TAIL;
  const o = { i: i + 1, start: round(t), dur: round(dur), audioStart: round(t + LEAD), audioDur: round(a), end: round(t + dur) };
  t += dur;
  return o;
});
const TOTAL = round(t);
function round(n) { return Math.round(n * 1000) / 1000; }

const CAPTIONS = [
  "Skills no Claude Code — do básico ao avançado",
  "Uma Skill = uma pasta + um arquivo SKILL.md",
  "name + description — a description é o gatilho",
  "Divulgação progressiva: carrega só quando precisa",
  "Onde vivem: .claude/skills (projeto ou global)",
  "Avançado: scripts, referências e templates",
  "Este vídeo foi feito pela Skill HyperFrames",
  "Comece com um SKILL.md. Agora é com você.",
  "Mais conteúdo em inema.club",
];

// ---------- CONTEÚDO HTML POR CENA ----------
function scene1() {
  return `
    <div class="eyebrow" id="s1-eyebrow"><span class="dot"></span>CLAUDE CODE · SKILLS</div>
    <h1 class="title">
      <span class="word" id="s1-w1">Skills</span>
      <span class="word accent" id="s1-w2">no Claude&nbsp;Code</span>
    </h1>
    <div class="rule" id="s1-rule"></div>
    <p class="subhead" id="s1-sub">do primeiro princípio ao avançado<span class="cursor" id="s1-cur"></span></p>
    <div class="reg tl" id="s1-r1"></div><div class="reg br" id="s1-r2"></div>`;
}
function scene2() {
  return `
    <div class="grid2">
      <div class="left">
        <div class="folder" id="s2-folder">
          <div class="folder-tab"></div>
          <div class="folder-body"><span class="mono">minha-skill/</span></div>
          <div class="file-card" id="s2-file">
            <div class="file-dot"></div><span class="mono">SKILL.md</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="kicker" id="s2-k">O PRIMEIRO PRINCÍPIO</div>
        <h2 class="h2" id="s2-h">Uma pasta.<br/>Um arquivo.</h2>
        <div class="chips">
          <span class="chip" id="s2-c1">criar vídeos</span>
          <span class="chip" id="s2-c2">revisar código</span>
          <span class="chip" id="s2-c3">desenhar UI</span>
        </div>
        <p class="lead" id="s2-lead">É conhecimento <b>empacotado</b>.</p>
      </div>
    </div>`;
}
function scene3() {
  return `
    <div class="kicker center" id="s3-k">ANATOMIA DO SKILL.md</div>
    <div class="code" id="s3-code">
      <div class="code-bar"><i></i><i></i><i></i><span class="mono dim">SKILL.md</span></div>
      <pre class="mono"><span class="ln" id="s3-l1"><span class="punc">---</span></span>
<span class="ln" id="s3-l2"><span class="key">name:</span> <span class="val">youtube-thumbnail</span></span>
<span class="ln" id="s3-l3"><span class="key">description:</span> <span class="val">Cria thumbnails. <span class="hl"><span class="marker" id="s3-mark"></span>Use quando o usuário pedir…</span></span></span>
<span class="ln" id="s3-l4"><span class="punc">---</span></span></pre>
    </div>
    <div class="tagrow">
      <span class="tag" id="s3-t1"><b>name</b> = identidade</span>
      <span class="tag accent2" id="s3-t2"><b>description</b> = quando usar</span>
      <span class="arrow-note" id="s3-note">↑ o gatilho</span>
    </div>`;
}
function scene4() {
  return `
    <div class="kicker center" id="s4-k">O CONCEITO-CHAVE · DIVULGAÇÃO PROGRESSIVA</div>
    <div class="layers">
      <div class="layer" id="s4-L1"><span class="lnum">1</span><div class="ltxt"><b>name + description</b><span class="lsub">sempre na memória</span></div><span class="lbadge">always</span></div>
      <div class="layer" id="s4-L2"><span class="lnum">2</span><div class="ltxt"><b>SKILL.md completo</b><span class="lsub">carrega quando a tarefa combina</span></div><span class="lbadge">on match</span></div>
      <div class="layer" id="s4-L3"><span class="lnum">3</span><div class="ltxt"><b>referências · scripts</b><span class="lsub">só sob demanda</span></div><span class="lbadge">on demand</span></div>
    </div>
    <div class="meter" id="s4-meter"><div class="meter-label mono">contexto</div><div class="meter-bar"><div class="meter-fill" id="s4-fill"></div></div><div class="meter-val mono" id="s4-val">leve</div></div>`;
}
function scene5() {
  return `
    <div class="kicker center" id="s5-k">ONDE VIVEM · COMO INSTALAR</div>
    <div class="paths">
      <div class="pathcard" id="s5-p1">
        <div class="ptag mono">GLOBAL</div>
        <div class="ppath mono">~/.claude/skills/</div>
        <div class="pdesc">vale em qualquer projeto</div>
      </div>
      <div class="pathcard" id="s5-p2">
        <div class="ptag mono accentbg">PROJETO</div>
        <div class="ppath mono">.claude/skills/</div>
        <div class="pdesc">só neste repositório</div>
      </div>
    </div>
    <div class="term" id="s5-term"><span class="prompt mono">$</span> <span class="mono cmd" id="s5-cmd">npx skills add &lt;skill&gt;</span><span class="cursor" id="s5-cur"></span></div>`;
}
function scene6() {
  return `
    <div class="grid2">
      <div class="left">
        <div class="kicker" id="s6-k">NÍVEL AVANÇADO</div>
        <h2 class="h2" id="s6-h">Muito mais<br/>que texto.</h2>
        <ul class="bullets">
          <li id="s6-b1"><span class="bdot"></span>scripts que o Claude executa</li>
          <li id="s6-b2"><span class="bdot"></span>referências carregadas sob demanda</li>
          <li id="s6-b3"><span class="bdot"></span>paletas &amp; templates reutilizáveis</li>
        </ul>
        <p class="lead" id="s6-lead">Um <b>fluxo de trabalho</b> inteiro — não só uma dica.</p>
      </div>
      <div class="right">
        <div class="tree" id="s6-tree">
          <div class="trow root mono" id="s6-r0">hyperframes/</div>
          <div class="trow mono" id="s6-r1">├─ SKILL.md</div>
          <div class="trow mono" id="s6-r2">├─ references/<span class="dim">*.md</span></div>
          <div class="trow mono run" id="s6-r3">├─ scripts/<span class="dim">*.mjs</span> <span class="runtag">run</span></div>
          <div class="trow mono" id="s6-r4">└─ palettes/<span class="dim">*.md</span></div>
        </div>
      </div>
    </div>`;
}
function scene7() {
  return `
    <p class="meta-top" id="s7-top">Quer um exemplo real?</p>
    <h2 class="h2 center" id="s7-h">Este vídeo foi feito<br/>por uma <span class="accent">Skill</span>.</h2>
    <div class="badge" id="s7-badge"><div class="badge-halo" id="s7-halo"></div><span class="badge-name">HyperFrames</span></div>
    <div class="flow mono" id="s7-flow"><span class="fitem" id="s7-f1">HTML</span><span class="farr" id="s7-a1">→</span><span class="fitem big" id="s7-f2">🎬</span><span class="farr" id="s7-a2">→</span><span class="fitem" id="s7-f3">vídeo</span></div>`;
}
function scene8() {
  return `
    <p class="closer-sub" id="s8-sub">Skills transformam o Claude Code num especialista sob medida.</p>
    <h1 class="closer" id="s8-h">Comece com um<br/><span class="accent">SKILL.md</span></h1>
    <div class="rule center" id="s8-rule"></div>
    <p class="sig mono" id="s8-sig">agora é com você</p>`;
}

function scene9() {
  return `
    <div class="cta-eyebrow" id="s9-eye">CONTINUA EM</div>
    <div class="cta-brand" id="s9-brand"><span class="b1">INEMA</span><span class="bdotsep">.</span><span class="b2">CLUB</span></div>
    <div class="rule center" id="s9-rule"></div>
    <div class="cta-url mono" id="s9-url"><span class="cta-globe">🌐</span>inema.club</div>
    <div class="reg tl" id="s9-r1"></div><div class="reg br" id="s9-r2"></div>`;
}

const BODIES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7, scene8, scene9];

// ---------- ANIMAÇÃO POR CENA (retorna código GSAP, t = início absoluto) ----------
function anim(i, t) {
  const e = (sel) => JSON.stringify(sel);
  const L = [];
  const P = (s) => L.push(s);
  // entrada/saída do inner (comum)
  P(`tl.fromTo("#scene-inner-${i}",{opacity:0},{opacity:1,duration:${FADE},ease:"power2.out"},${t});`);
  P(`tl.to("#scene-inner-${i}",{opacity:0,duration:${FADE},ease:"power2.in"},${round(S[i-1].end - FADE)});`);
  P(`tl.set("#scene-inner-${i}",{opacity:0},${round(S[i-1].end)});`);
  const at = (d) => round(t + d);
  switch (i) {
    case 1:
      P(`tl.from("#s1-eyebrow",{y:-24,opacity:0,duration:.55,ease:"power3.out"},${at(0.15)});`);
      P(`tl.from("#s1-w1",{y:70,opacity:0,duration:.7,ease:"power4.out"},${at(0.35)});`);
      P(`tl.from("#s1-w2",{y:70,opacity:0,duration:.7,ease:"power4.out"},${at(0.55)});`);
      P(`tl.fromTo("#s1-rule",{scaleX:0},{scaleX:1,duration:.7,ease:"expo.out",transformOrigin:"left center"},${at(0.95)});`);
      P(`tl.from("#s1-sub",{y:20,opacity:0,duration:.6,ease:"power2.out"},${at(1.15)});`);
      P(`tl.fromTo("#s1-cur",{opacity:1},{opacity:0,duration:.5,repeat:18,yoyo:true,ease:"none"},${at(1.6)});`);
      P(`tl.from(["#s1-r1","#s1-r2"],{opacity:0,scale:.5,duration:.6,stagger:.12,ease:"back.out(2)"},${at(0.5)});`);
      break;
    case 2:
      P(`tl.from("#s2-folder",{x:-60,opacity:0,scale:.9,duration:.7,ease:"power3.out"},${at(0.2)});`);
      P(`tl.from("#s2-file",{y:40,opacity:0,duration:.6,ease:"back.out(1.6)"},${at(0.9)});`);
      P(`tl.from("#s2-k",{y:-16,opacity:0,duration:.5,ease:"power2.out"},${at(0.5)});`);
      P(`tl.from("#s2-h",{x:40,opacity:0,duration:.6,ease:"power3.out"},${at(0.7)});`);
      P(`tl.from(["#s2-c1","#s2-c2","#s2-c3"],{y:24,opacity:0,duration:.5,stagger:.13,ease:"back.out(1.7)"},${at(1.4)});`);
      P(`tl.from("#s2-lead",{opacity:0,y:16,duration:.55,ease:"power2.out"},${at(2.1)});`);
      break;
    case 3:
      P(`tl.from("#s3-k",{y:-16,opacity:0,duration:.5,ease:"power2.out"},${at(0.2)});`);
      P(`tl.from("#s3-code",{y:36,opacity:0,duration:.6,ease:"power3.out"},${at(0.4)});`);
      P(`tl.from(["#s3-l1","#s3-l2","#s3-l3","#s3-l4"],{x:-18,opacity:0,duration:.4,stagger:.12,ease:"power2.out"},${at(0.7)});`);
      P(`tl.fromTo("#s3-mark",{scaleX:0},{scaleX:1,duration:.7,ease:"power2.inOut",transformOrigin:"left center"},${at(2.0)});`);
      P(`tl.from(["#s3-t1","#s3-t2"],{y:20,opacity:0,duration:.5,stagger:.14,ease:"back.out(1.6)"},${at(2.4)});`);
      P(`tl.from("#s3-note",{opacity:0,y:10,duration:.5,ease:"power2.out"},${at(2.9)});`);
      break;
    case 4:
      P(`tl.from("#s4-k",{y:-16,opacity:0,duration:.5,ease:"power2.out"},${at(0.2)});`);
      P(`tl.from("#s4-L1",{x:-40,opacity:0,duration:.55,ease:"power3.out"},${at(0.6)});`);
      P(`tl.to("#s4-L1",{"--lit":1,borderColor:"var(--accent)",duration:.4},${at(1.0)});`);
      P(`tl.from("#s4-L2",{x:-40,opacity:0,duration:.55,ease:"power3.out"},${at(1.9)});`);
      P(`tl.from("#s4-L3",{x:-40,opacity:0,duration:.55,ease:"power3.out"},${at(3.2)});`);
      P(`tl.fromTo("#s4-fill",{scaleX:0},{scaleX:.26,duration:1.1,ease:"power2.out",transformOrigin:"left center"},${at(1.0)});`);
      P(`tl.from("#s4-meter",{opacity:0,y:18,duration:.5,ease:"power2.out"},${at(0.8)});`);
      break;
    case 5:
      P(`tl.from("#s5-k",{y:-16,opacity:0,duration:.5,ease:"power2.out"},${at(0.2)});`);
      P(`tl.from("#s5-p1",{x:-50,opacity:0,duration:.6,ease:"power3.out"},${at(0.5)});`);
      P(`tl.from("#s5-p2",{x:50,opacity:0,duration:.6,ease:"power3.out"},${at(0.7)});`);
      P(`tl.from("#s5-term",{y:30,opacity:0,duration:.55,ease:"power3.out"},${at(1.6)});`);
      P(`tl.fromTo("#s5-cmd",{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0% 0 0)",duration:1.1,ease:"steps(22)"},${at(2.0)});`);
      P(`tl.fromTo("#s5-cur",{opacity:1},{opacity:0,duration:.5,repeat:10,yoyo:true,ease:"none"},${at(3.1)});`);
      break;
    case 6:
      P(`tl.from("#s6-k",{y:-16,opacity:0,duration:.5,ease:"power2.out"},${at(0.2)});`);
      P(`tl.from("#s6-h",{x:-30,opacity:0,duration:.6,ease:"power3.out"},${at(0.4)});`);
      P(`tl.from(["#s6-b1","#s6-b2","#s6-b3"],{x:-24,opacity:0,duration:.5,stagger:.16,ease:"power2.out"},${at(0.9)});`);
      P(`tl.from("#s6-lead",{opacity:0,y:16,duration:.55,ease:"power2.out"},${at(2.0)});`);
      P(`tl.from("#s6-tree",{x:40,opacity:0,duration:.6,ease:"power3.out"},${at(0.6)});`);
      P(`tl.from(["#s6-r0","#s6-r1","#s6-r2","#s6-r3","#s6-r4"],{x:18,opacity:0,duration:.4,stagger:.12,ease:"power2.out"},${at(0.9)});`);
      P(`tl.fromTo("#s6-r3",{backgroundColor:"rgba(46,196,182,0)"},{backgroundColor:"rgba(46,196,182,.14)",duration:.5,repeat:5,yoyo:true,ease:"sine.inOut"},${at(2.2)});`);
      break;
    case 7:
      P(`tl.from("#s7-top",{y:-16,opacity:0,duration:.5,ease:"power2.out"},${at(0.2)});`);
      P(`tl.from("#s7-h",{y:30,opacity:0,duration:.6,ease:"power3.out"},${at(0.5)});`);
      P(`tl.from("#s7-badge",{scale:.4,opacity:0,duration:.7,ease:"back.out(1.8)"},${at(1.4)});`);
      P(`tl.fromTo("#s7-halo",{scale:.6,opacity:.7},{scale:1.5,opacity:0,duration:1.6,repeat:4,ease:"sine.out"},${at(1.7)});`);
      P(`tl.from(["#s7-f1","#s7-a1","#s7-f2","#s7-a2","#s7-f3"],{y:20,opacity:0,duration:.45,stagger:.14,ease:"back.out(1.6)"},${at(2.5)});`);
      break;
    case 8:
      P(`tl.from("#s8-sub",{y:-16,opacity:0,duration:.55,ease:"power2.out"},${at(0.2)});`);
      P(`tl.from("#s8-h",{scale:.85,opacity:0,duration:.8,ease:"power3.out"},${at(0.6)});`);
      P(`tl.fromTo("#s8-rule",{scaleX:0},{scaleX:1,duration:.7,ease:"expo.out"},${at(1.3)});`);
      P(`tl.from("#s8-sig",{opacity:0,letterSpacing:"0.5em",duration:.9,ease:"power2.out"},${at(1.6)});`);
      break;
    case 9:
      P(`tl.from("#s9-eye",{y:-18,opacity:0,duration:.5,ease:"power2.out"},${at(0.2)});`);
      P(`tl.from("#s9-brand",{scale:.7,opacity:0,duration:.7,ease:"back.out(1.7)"},${at(0.5)});`);
      P(`tl.fromTo("#s9-rule",{scaleX:0},{scaleX:1,duration:.6,ease:"expo.out"},${at(1.1)});`);
      P(`tl.from("#s9-url",{y:20,opacity:0,duration:.55,ease:"power2.out"},${at(1.3)});`);
      P(`tl.fromTo("#s9-brand",{filter:"drop-shadow(0 0 0px rgba(255,195,0,0))"},{filter:"drop-shadow(0 0 26px rgba(255,195,0,.55))",duration:1.1,repeat:4,yoyo:true,ease:"sine.inOut"},${at(1.4)});`);
      P(`tl.from(["#s9-r1","#s9-r2"],{opacity:0,scale:.5,duration:.6,stagger:.12,ease:"back.out(2)"},${at(0.6)});`);
      break;
  }
  // caption
  P(`tl.fromTo("#cap-${i}",{opacity:0,y:14},{opacity:1,y:0,duration:.5,ease:"power2.out"},${at(0.35)});`);
  P(`tl.to("#cap-${i}",{opacity:0,duration:.4,ease:"power2.in"},${round(S[i-1].end - 0.55)});`);
  return L.join("\n      ");
}

// ---------- MONTAGEM ----------
const scenesHTML = S.map((s, idx) => `
    <section id="s${s.i}" class="scene clip" data-start="${s.start}" data-duration="${s.dur}" data-track-index="${s.i % 2 === 1 ? 1 : 3}">
      <div class="scene-inner" id="scene-inner-${s.i}">${BODIES[idx]()}</div>
    </section>`).join("");

const captionsHTML = S.map((s, idx) => `
    <div class="caption clip" id="cap-${s.i}" data-start="${s.start}" data-duration="${s.dur}" data-track-index="${s.i % 2 === 1 ? 2 : 4}">${CAPTIONS[idx]}</div>`).join("");

const audioHTML = S.map((s) => `
    <audio id="a${s.i}" data-start="${s.audioStart}" data-duration="${s.audioDur}" data-track-index="20" src="assets/audio/s${s.i}.wav"></audio>`).join("");

const animJS = S.map((s) => anim(s.i, s.start)).join("\n      ");

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
      .layer#s4-L2 .lbadge{background:var(--accent2)}
      .layer#s4-L3 .lbadge{background:var(--code)}
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

      /* cena 9 CTA (INEMA.CLUB) */
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
      body.v .scene{padding:170px 70px 240px}
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
      /* cena 9 */
      body.v .cta-brand{font-size:116px}
      body.v .cta-url{font-size:42px}
      /* caption no vertical: sobe pra não cortar */
      body.v .caption{bottom:150px;max-width:940px;font-size:33px;padding:16px 32px}
      /* glows reposicionados pro frame alto */
      body.v #glow{top:-200px;left:-160px;width:900px;height:900px}
      body.v #glow2{bottom:-300px;right:-200px;width:1000px;height:1000px}
      body.v .ghost{font-size:380px;top:520px}
    </style>
  </head>
  <body class="${VERT ? "v" : ""}">
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
      <div class="bg-layer" data-layout-ignore>
        <div id="glow"></div><div id="glow2"></div><div id="grid"></div>
        <div class="ghost" id="ghost" data-layout-ignore>SKILL.md</div><div id="grain"></div>
      </div>
${scenesHTML}
${captionsHTML}
      <div id="progress"></div>
${audioHTML}
      <script>
        window.__timelines = window.__timelines || {};
        const tl = gsap.timeline({ paused: true });
        const TOTAL = ${TOTAL};
        // ambiente
        tl.to("#glow",{scale:1.22,opacity:.55,duration:4.5,yoyo:true,repeat:Math.ceil(TOTAL/4.5)+1,ease:"sine.inOut"},0);
        tl.to("#glow2",{scale:1.18,duration:6,yoyo:true,repeat:Math.ceil(TOTAL/6)+1,ease:"sine.inOut"},0);
        tl.to("#ghost",{x:120,duration:TOTAL,ease:"none"},0);
        tl.to("#grid",{backgroundPositionX:"+=128",backgroundPositionY:"+=128",duration:18,repeat:Math.ceil(TOTAL/18)+1,ease:"none"},0);
        tl.fromTo("#progress",{scaleX:0},{scaleX:1,duration:TOTAL,ease:"none"},0);
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
console.log(`${OUT} gerado · ${W}x${H} · TOTAL = ${TOTAL}s · ${S.length} cenas`);
S.forEach(s => console.log(`  s${s.i}: start=${s.start} dur=${s.dur} audio@${s.audioStart} (${s.audioDur}s)`));
