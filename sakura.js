// Decoración: corazones del header, lluvia de pétalos y el árbol de cerezo.
// No toca la API ni el catálogo; si falla, la página sigue funcionando.

const SVG_NS = "http://www.w3.org/2000/svg";
const COLORES = ["#ffe0ea", "#ffc6da", "#ffb3cc", "#ff9cc0", "#f7a1c0"];

// Aleatorio con semilla: el árbol sale igual en cada visita.
function semilla(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
const r = semilla(29);

function icono(id, className, style = "") {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("style", style);
  const use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("href", "#" + id);
  svg.appendChild(use);
  return svg;
}

function div(className, style) {
  const el = document.createElement("div");
  el.className = className;
  el.setAttribute("style", style);
  return el;
}

const f1 = (v) => v.toFixed(1);

// ---------- Corazones del header (algunos rotos) ----------
function corazones() {
  const fila = document.getElementById("corazones");
  for (let i = 0; i < 28; i++) {
    if (i % 5 === 2) {
      const roto = document.createElement("span");
      roto.className = "corazon-roto";
      roto.append(icono("mitad-izq", "mitad mitad-izq"), icono("mitad-der", "mitad mitad-der"));
      fila.appendChild(roto);
    } else {
      const color = ["#ff8fb8", "#e8628f", "#ffd1e2"][i % 3];
      fila.appendChild(icono("corazon", "latido", `color:${color};animation-delay:${((i % 7) * 0.3).toFixed(1)}s`));
    }
  }
}

// ---------- Pétalo que cae girando en 3D ----------
function petalo(x, y, clase, durBase, durExtra, delay) {
  const z = 10 + r() * 12;
  const drift = div("drift", `left:${f1(x)}px;top:${f1(y)}px;animation-duration:${(1.6 + r() * 1.6).toFixed(2)}s;animation-delay:${(-r() * 3).toFixed(2)}s`);
  drift.appendChild(
    icono("petalo", "flut " + clase,
      `width:${f1(z)}px;height:${f1(z * 1.3)}px;color:${COLORES[Math.floor(r() * COLORES.length)]};` +
      `animation-duration:${(durBase + r() * durExtra).toFixed(1)}s;animation-delay:${delay.toFixed(1)}s`)
  );
  return drift;
}

function lluvia() {
  const capa = document.getElementById("lluvia");
  const ancho = window.innerWidth;
  for (let i = 0; i < 26; i++) {
    capa.appendChild(petalo(r() * ancho, -40, "flutPagina", 10, 8, -r() * 10));
  }
}

// ---------- Árbol de cerezo ----------
// Cada rama es un div rotado; sus hijas viven adentro, así el viento
// que mueve una rama arrastra a todas las que salen de ella.
function arbol() {
  const tree = document.getElementById("tree");
  const W = 660, H = 800, MAXD = 5;
  const puntos = [];

  function sesgo(g, rel) {
    rel += (-90 - (g + rel)) * 0.14;
    const ng = g + rel;
    if (ng > -8) rel -= (ng + 8) * 0.8;
    if (ng < -172) rel += (-172 - ng) * 0.8;
    return rel;
  }

  function rama(depth, len, grosor, rel, along, gx, gy, gAng, delay) {
    const dur = 0.45 + len / 240;
    const rad = (gAng * Math.PI) / 180, c = Math.cos(rad), s = Math.sin(rad);
    const punta = Math.max(1.4, grosor * 0.66);
    const tp = f1(((1 - punta / grosor) / 2) * 100);

    const nodo = div("node", `left:${f1(along)}px;top:0;transform:rotate(${f1(rel)}deg)`);
    const sway = div("sway sw" + depth, `animation-duration:${(5 + r() * 3.5).toFixed(2)}s;animation-delay:${(-r() * 7).toFixed(2)}s`);
    nodo.appendChild(sway);
    sway.appendChild(div("knot", `left:${f1(-grosor / 2)}px;top:${f1(-grosor / 2)}px;width:${f1(grosor)}px;height:${f1(grosor)}px;animation-delay:${delay.toFixed(2)}s`));
    sway.appendChild(div("bar",
      `top:${f1(-grosor / 2)}px;width:${f1(len)}px;height:${f1(grosor)}px;` +
      `clip-path:polygon(0 0,100% ${tp}%,100% ${f1(100 - tp)}%,0 100%);` +
      `animation-duration:${dur.toFixed(2)}s;animation-delay:${delay.toFixed(2)}s`));

    // Corazón tallado en el tronco
    if (depth === 0) {
      const talla = div("carve", `left:${f1(len * 0.42)}px;top:-11px;width:24px;height:22px;transform:rotate(${f1(-gAng)}deg)`);
      const svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("viewBox", "0 0 100 94");
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("class", "carve-path");
      path.setAttribute("style", `animation-delay:${(delay + dur + 1.2).toFixed(2)}s`);
      path.setAttribute("d", "M50 88C50 88 8 58 8 32 8 16 20 6 33 6c9 0 15 6 17 12 2-6 8-12 17-12 13 0 25 10 25 26 0 26-42 56-42 56z");
      svg.appendChild(path);
      talla.appendChild(svg);
      sway.appendChild(talla);
    }

    // Brillo rosa detrás de las puntas: da volumen a la copa
    if (depth >= 4) {
      const ps = depth === 5 ? 70 + r() * 40 : 50 + r() * 30;
      const px = len * (0.5 + r() * 0.5);
      sway.appendChild(div("puff", `left:${f1(px - ps / 2)}px;top:${f1(-ps / 2)}px;width:${f1(ps)}px;height:${f1(ps)}px;animation-delay:${(delay + dur + 0.6).toFixed(2)}s`));
    }

    const at = (x) => [gx + c * x, gy + s * x];
    if (depth < MAXD) {
      const cont = sesgo(gAng, (r() - 0.5) * 24);
      const e = at(len);
      sway.appendChild(rama(depth + 1, len * (0.74 + r() * 0.1), grosor * 0.7, cont, len, e[0], e[1], gAng + cont, delay + dur * 0.92));
      const lados = depth === 0 ? 1 : depth === 1 ? 2 : depth === 2 ? (r() < 0.5 ? 2 : 1) : (r() < 0.6 ? 1 : 0);
      let signo = r() < 0.5 ? -1 : 1;
      for (let k = 0; k < lados; k++) {
        signo = -signo;
        const t = 0.45 + r() * 0.45;
        const sr = sesgo(gAng, signo * (30 + r() * 26));
        const b = at(len * t);
        sway.appendChild(rama(depth + 1, len * (0.6 + r() * 0.16), grosor * 0.56, sr, len * t, b[0], b[1], gAng + sr, delay + dur * t));
      }
    }

    // Flores: primero capullo, después se abren
    const nf = [0, 0, 1, 2, 3, 5][depth];
    for (let i = 0; i < nf; i++) {
      const fx = depth === 5 ? len * (0.25 + r() * 0.9) : len * (0.35 + r() * 0.65);
      const fy = (r() - 0.5) * (14 + grosor * 2);
      const sz = depth === 5 ? 15 + r() * 15 : 13 + r() * 12;
      const d0 = delay + dur * Math.min(1, fx / len) + 0.4 + r() * 1.1;
      const flor = div("fl",
        `left:${f1(fx - sz / 2)}px;top:${f1(fy - sz / 2)}px;width:${f1(sz)}px;height:${f1(sz)}px;` +
        `color:${COLORES[Math.floor(r() * COLORES.length)]};transform:rotate(${Math.round(r() * 72)}deg)`);
      const capullo = document.createElement("span");
      capullo.className = "bud";
      capullo.style.animationDelay = d0.toFixed(2) + "s";
      flor.append(capullo, icono("sakura", "open", `animation-delay:${(d0 + 0.85).toFixed(2)}s`));
      sway.appendChild(flor);
      puntos.push([gx + c * fx - s * fy, gy + s * fx + c * fy]);
    }
    return nodo;
  }

  const bx = W / 2, by = H - 12;
  const tronco = rama(0, H * 0.25, 40, -88, 0, bx, by, -88, 0.3);
  tronco.setAttribute("style", `left:${bx}px;top:${by}px;transform:rotate(-88deg)`);

  const extra = document.createDocumentFragment();
  const alAzar = () => puntos[Math.floor(r() * puntos.length)];

  // destellos flotando
  for (let i = 0; i < 9; i++) {
    const bz = 30 + r() * 70;
    extra.appendChild(div("bokeh", `left:${f1(r() * W)}px;top:${f1(r() * H * 0.7)}px;width:${f1(bz)}px;height:${f1(bz)}px;animation-duration:${(7 + r() * 6).toFixed(1)}s;animation-delay:${(-r() * 8).toFixed(1)}s`));
  }
  // pétalos que se van juntando en el suelo
  for (let g = 0; g < 46; g++) {
    const ang = r() * Math.PI * 2, rr = Math.sqrt(r()), gz = 8 + r() * 7;
    extra.appendChild(icono("petalo", "gp",
      `left:${f1(bx + Math.cos(ang) * rr * W * 0.4)}px;top:${f1(by - 4 + Math.sin(ang) * rr * 12)}px;width:${f1(gz)}px;height:${f1(gz * 1.3)}px;` +
      `color:${COLORES[g % COLORES.length]};transform:rotate(${Math.round(r() * 360)}deg) scaleY(.55);animation-delay:${(6 + g * 0.5 + r()).toFixed(1)}s`));
  }
  extra.appendChild(tronco);
  // corazoncitos que suben desde la copa
  for (let h = 0; h < 8; h++) {
    const [x, y] = alAzar(), hz = 10 + r() * 10;
    extra.appendChild(icono("corazon", "loveHeart", `left:${f1(x)}px;top:${f1(y)}px;width:${f1(hz)}px;height:${f1(hz * 0.94)}px;animation-duration:${(5 + r() * 4).toFixed(1)}s;animation-delay:${(6 + r() * 9).toFixed(1)}s`));
  }
  // pétalos que se desprenden del árbol
  for (let j = 0; j < 26; j++) {
    const [x, y] = alAzar();
    extra.appendChild(petalo(x, y, "flutArbol", 6, 5, 5 + r() * 10));
  }

  tree.insertBefore(extra, tree.querySelector(".flare"));
}

// ---------- Pétalos que estallan al abrir el resumen ----------
// Se crean una vez; la animación CSS se reinicia sola cada vez que el modal
// pasa de hidden a visible.
function estallido() {
  const burst = document.getElementById("modal-burst");
  for (let i = 0; i < 14; i++) {
    const rayo = document.createElement("div");
    rayo.style.transform = `rotate(${Math.round((i * 360) / 14)}deg)`;
    rayo.appendChild(icono("petalo", "", `color:${COLORES[i % COLORES.length]};animation-delay:${(i % 3) * 0.08}s`));
    burst.appendChild(rayo);
  }
}

corazones();
lluvia();
arbol();
estallido();
