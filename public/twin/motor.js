/* motor.js — BLDC 外转子马达数字样机 (自建示意几何, 不对应任何客户产品)
   定子/绕组/磁钢/轴与轴承按节点分组, 供页面驱动着色。
   对外暴露 window.Twin。 */

const stage = document.querySelector('three-d-stage');
const { THREE } = await stage.ready;

const BASE = {
  alu:      { color: 0x4b5158, roughness: 0.28, metalness: 0.38 },
  iron:     { color: 0x9ba1a8, roughness: 0.45, metalness: 0.34 },
  copper:   { color: 0xb3682e, roughness: 0.38, metalness: 0.34 },
  magnet:   { color: 0x767d85, roughness: 0.28, metalness: 0.36 },
  insul:    { color: 0x1c1e21, roughness: 0.62, metalness: 0.04 },
  steel:    { color: 0x8d949b, roughness: 0.34, metalness: 0.55 },
  pcb:      { color: 0x14532d, roughness: 0.62, metalness: 0.06 },
  cell:     { color: 0x2b3138, roughness: 0.5,  metalness: 0.2 },
  plastic:  { color: 0x2f343a, roughness: 0.68, metalness: 0.05 },
  accent:   { color: 0xc7d24a, roughness: 0.5,  metalness: 0.1 }
};

const motor = new THREE.Group();
motor.name = 'bldc_motor_twin';
const parts = [];   // {mesh, node, blend, group, baseColor, r}

function add(name, geo, base, pos = [0, 0, 0], rot = [0, 0, 0], opt = {}) {
  const mat = new THREE.MeshStandardMaterial(Object.assign({ name: name + '_mat' }, BASE[base]));
  const m = new THREE.Mesh(geo, mat);
  m.name = name;
  m.position.set(...pos);
  m.rotation.set(...rot);
  motor.add(m);
  parts.push({
    mesh: m, node: opt.node || 'h', blend: opt.blend == null ? 1 : opt.blend,
    group: opt.group || 'shell', baseColor: mat.color.clone(),
    r: Math.hypot(pos[0], pos[2])
  });
  return m;
}

/* ---------- 几何工具 (挤出件落在 +y, y 0..h) ---------- */
function tube(rIn, rOut, h, seg = 96) {
  const s = new THREE.Shape();
  s.absarc(0, 0, rOut, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, rIn, 0, Math.PI * 2, true);
  s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: seg });
  g.rotateX(-Math.PI / 2);
  return g;
}
function ringSegment(rIn, rOut, a0, a1, h, seg = 16) {
  const s = new THREE.Shape();
  s.absarc(0, 0, rOut, a0, a1, false);
  s.absarc(0, 0, rIn, a1, a0, true);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: seg });
  g.rotateX(-Math.PI / 2);
  return g;
}
function shell(profile, seg = 128) {
  const pts = profile.map(p => new THREE.Vector2(p[0], p[1]));
  const g = new THREE.LatheGeometry(pts, seg).toNonIndexed();
  g.computeVertexNormals();
  return g;
}
const cyl = (r, h, seg = 48) => new THREE.CylinderGeometry(r, r, h, seg);
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

function wireTurn(angle, radius, halfW, halfH, wireR, cy) {
  const dir = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
  const tan = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
  const N = 44, p = 0.4, pts = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const c = Math.cos(t), s = Math.sin(t);
    const u = halfW * Math.sign(c) * Math.pow(Math.abs(c), p);
    const v = halfH * Math.sign(s) * Math.pow(Math.abs(s), p);
    pts.push(new THREE.Vector3(dir.x * radius + tan.x * u, cy + v, dir.z * radius + tan.z * u));
  }
  const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.0);
  return new THREE.TubeGeometry(curve, 88, wireR, 5, true);
}

/* ---------- 主要尺寸 (m) ---------- */
const R_SHAFT = 0.0016;
const HUB_IN = 0.0036, HUB_OUT = 0.0050;
const YOKE_OUT = 0.0068;
const TOOTH_OUT = 0.0105, SHOE_OUT = 0.0113;
const MAG_IN = 0.0117, MAG_OUT = 0.0127;
const STACK_H = 0.010, STACK_Y0 = 0.009, STACK_CY = STACK_Y0 + STACK_H / 2;
const TEETH = 12, POLES = 14;
const phases = ['A', 'B', 'C'];

const MOUNT = { group: 'mount', node: 'g', blend: 0.7 };
const IRON = { group: 'core', node: 's', blend: 1 };
const COIL = { group: 'core', node: 'w', blend: 1 };
const MAGN = { group: 'core', node: 's', blend: 0.92 };
const SHAFT = { group: 'core', node: 'g', blend: 1 };

/* ---------- 定子座 · 安装十字 · 轴承 ---------- */
[[box(0.0360, 0.0020, 0.0055), 'mount_arm_x'], [box(0.0055, 0.0020, 0.0360), 'mount_arm_z']]
  .forEach(([g, n]) => add(n, g, 'alu', [0, 0.0010, 0], [0, 0, 0], MOUNT));
for (let i = 0; i < 4; i++) {
  const a = Math.PI / 2 * i;
  add('mount_pad_' + (i + 1), cyl(0.0028, 0.0021, 24), 'alu',
    [Math.cos(a) * 0.0152, 0.00105, Math.sin(a) * 0.0152], [0, 0, 0], MOUNT);
  add(`mount_screw_0${i + 1}`, cyl(0.0018, 0.0012, 24), 'steel',
    [Math.cos(a) * 0.0152, 0.0027, Math.sin(a) * 0.0152], [0, 0, 0], MOUNT);
}
add('mount_hub', cyl(0.0072, 0.0030), 'alu', [0, 0.0015, 0], [0, 0, 0], MOUNT);
add('stator_boss', tube(HUB_IN, HUB_OUT, 0.0195), 'alu', [0, 0.0025, 0], [0, 0, 0],
  { group: 'core', node: 's', blend: 0.82 });
add('boss_collar', tube(HUB_IN - 0.0001, 0.0032, 0.0016), 'iron', [0, 0.0205, 0], [0, 0, 0],
  { group: 'core', node: 's', blend: 0.7 });
['bearing_lower', 'bearing_upper'].forEach((n, i) => {
  add(n, tube(R_SHAFT, HUB_IN - 0.0001, 0.0040, 32), 'steel', [0, i === 0 ? 0.0038 : 0.0158, 0], [0, 0, 0], SHAFT);
});

/* ---------- 定子: 轭 · 齿 · 极靴 · 绕组 ---------- */
add('stator_yoke', tube(HUB_OUT, YOKE_OUT, STACK_H), 'iron', [0, STACK_Y0, 0], [0, 0, 0], IRON);
const toothLen = TOOTH_OUT - YOKE_OUT + 0.0004;
for (let i = 0; i < TEETH; i++) {
  const a = (i / TEETH) * Math.PI * 2;
  const idx = String(i + 1).padStart(2, '0');
  add(`stator_tooth_${idx}`, box(toothLen, STACK_H, 0.0024), 'iron',
    [Math.cos(a) * (YOKE_OUT + toothLen / 2 - 0.0004), STACK_CY, Math.sin(a) * (YOKE_OUT + toothLen / 2 - 0.0004)],
    [0, -a, 0], IRON);
  const halfArc = (Math.PI / TEETH) * 0.86;
  add(`pole_shoe_${idx}`, ringSegment(TOOTH_OUT - 0.0004, SHOE_OUT, a - halfArc, a + halfArc, STACK_H), 'iron',
    [0, STACK_Y0, 0], [0, 0, 0], { group: 'core', node: 's', blend: 0.96 });

  const ph = phases[i % 3];
  const wireR = 0.00034;
  const layers = [
    { turns: 6, r0: 0.0075, r1: 0.0101, hw: 0.00154, hh: 0.00548 },
    { turns: 5, r0: 0.0079, r1: 0.0098, hw: 0.00222, hh: 0.00616 }
  ];
  layers.forEach((L, li) => {
    for (let t = 0; t < L.turns; t++) {
      const r = L.r0 + (L.r1 - L.r0) * (t / (L.turns - 1));
      add(`winding_${ph}_${idx}_L${li + 1}_T${t + 1}`, wireTurn(a, r, L.hw, L.hh, wireR, STACK_CY), 'copper',
        [0, 0, 0], [0, 0, 0], { group: 'core', node: 'w', blend: li === 0 ? 1 : 0.94 });
    }
  });
}

/* ---------- 转子: 磁钢 · 轴 ---------- */
for (let i = 0; i < POLES; i++) {
  const a = (i / POLES) * Math.PI * 2;
  const half = (Math.PI / POLES) * 0.88;
  add(`magnet_${String(i + 1).padStart(2, '0')}`,
    ringSegment(MAG_IN, MAG_OUT - 0.0001, a - half, a + half, 0.0108), 'magnet',
    [0, STACK_Y0 - 0.0004, 0], [0, 0, 0], MAGN);
}
add('shaft', cyl(R_SHAFT, 0.0285, 32), 'steel', [0, 0.0173, 0], [0, 0, 0], SHAFT);
add('shaft_circlip', tube(R_SHAFT, 0.0031, 0.0012, 24), 'steel', [0, 0.0212, 0], [0, 0, 0], { group: 'core', node: 'g', blend: 0.85 });

/* ---------- 相线 ---------- */
[-0.5, 0, 0.5].forEach((k, i) => {
  const a = -Math.PI / 2 + k * 0.32;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(Math.cos(a) * 0.0062, 0.0075, Math.sin(a) * 0.0062),
    new THREE.Vector3(Math.cos(a) * 0.0105, 0.0050, Math.sin(a) * 0.0105),
    new THREE.Vector3(Math.cos(a) * 0.0165, 0.0032 + i * 0.0002, Math.sin(a) * 0.0165),
    new THREE.Vector3(Math.cos(a) * 0.0245 - 0.0015, 0.0028, Math.sin(a) * 0.0245),
    new THREE.Vector3(Math.cos(a) * 0.0330 - 0.0040, 0.0016, Math.sin(a) * 0.0330)
  ]);
  add(`phase_lead_${phases[i]}`, new THREE.TubeGeometry(curve, 60, 0.00085, 10, false), 'insul',
    [0, 0, 0], [0, 0, 0], { group: 'core', node: 'w', blend: 0.55 });
  const end = curve.getPoint(1);
  add(`bullet_connector_${phases[i]}`, cyl(0.0011, 0.0030, 16), 'steel',
    [end.x + 0.0015, end.y, end.z + 0.0011], [-0.4, 0, Math.PI / 2], { group: 'core', node: 'w', blend: 0.45 });
});

/* ---------- 落地居中 ---------- */
const bb = new THREE.Box3().setFromObject(motor);
const c = bb.getCenter(new THREE.Vector3());
motor.position.set(-c.x, -bb.min.y, -c.z);
motor.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
stage.setObject(motor);

/* ================= 着色 ================= */
const STOPS = [
  [0.00, 0x2b4a8f], [0.16, 0x2f8bb8], [0.34, 0x4fba93],
  [0.52, 0xc7d24a], [0.68, 0xf0a03a], [0.84, 0xdf552d], [1.00, 0xa81c26]
];
function lut(u) {
  u = Math.max(0, Math.min(1, u));
  for (let i = 1; i < STOPS.length; i++) {
    if (u <= STOPS[i][0]) {
      const [p0, c0] = STOPS[i - 1], [p1, c1] = STOPS[i];
      const f = (u - p0) / (p1 - p0);
      const r = ((c0 >> 16) & 255) + f * (((c1 >> 16) & 255) - ((c0 >> 16) & 255));
      const g = ((c0 >> 8) & 255) + f * (((c1 >> 8) & 255) - ((c0 >> 8) & 255));
      const b = (c0 & 255) + f * ((c1 & 255) - (c0 & 255));
      return [r / 255, g / 255, b / 255];
    }
  }
  return [1, 1, 1];
}

/* L2 场重建的替身: 沿半径方向的形状函数, 让节点温位展开成连续分布 */
function shape(r) {
  return 0.58 + 0.42 * Math.exp(-Math.pow(r / 0.016, 2));
}

let state = { view: 'thermal', housing: 'on', temps: null, range: [20, 130], ambient: 25 };
const HIDDEN_WHEN_OPEN = new Set();

function meshTemp(p) {
  const T = state.temps;
  if (!T) return state.ambient;
  const base = T[p.node] == null ? T.h : T[p.node];
  const rise = (base - state.ambient) * p.blend;
  const sp = p.group === 'core' ? shape(p.r) : 1;
  return state.ambient + rise * sp;
}

function apply() {
  const [t0, t1] = state.range;
  for (const p of parts) {
    const open = state.housing !== 'on' && HIDDEN_WHEN_OPEN.has(p.group);
    const ghost = state.housing === 'ghost' && HIDDEN_WHEN_OPEN.has(p.group);
    p.mesh.visible = !(state.housing === 'off' && open);
    p.mesh.material.transparent = ghost;
    p.mesh.material.opacity = ghost ? 0.17 : 1;
    p.mesh.material.depthWrite = !ghost;
    p.mesh.castShadow = !ghost;
    if (state.view === 'thermal') {
      const t = meshTemp(p);
      const [r, g, b] = lut((t - t0) / Math.max(1, t1 - t0));
      p.mesh.material.color.setRGB(r, g, b);
      p.mesh.material.metalness = Math.min(0.10, p.mesh.material.metalness);
      p.mesh.material.emissive.setRGB(0, 0, 0);
    } else {
      p.mesh.material.color.copy(p.baseColor);
      p.mesh.material.emissive.setRGB(0, 0, 0);
    }
    p.mesh.material.needsUpdate = true;
  }
}

const ANCHORS = {
  w:  [0.0098, 0.0175, 0.0000],
  s:  [0.0000, 0.0140, 0.0092],
  g:  [0.0000, 0.0060, 0.0000]
};

window.Twin = {
  stage, tool: motor, parts, lut,
  setTemps(temps, ambient, range) {
    state.temps = temps; state.ambient = ambient;
    if (range) state.range = range;
    apply();
  },
  setView(v) { state.view = v; apply(); },
  setHousing(h) { state.housing = h; apply(); },
  get state() { return state; },
  tempOf(node) { return state.temps ? state.temps[node] : state.ambient; },
  project(node, w, h) {
    const cam = stage._camera;
    if (!cam) return null;
    const a = ANCHORS[node];
    if (!a) return null;
    const v = motor.localToWorld(new THREE.Vector3(a[0], a[1], a[2])).project(cam);
    return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, z: v.z };
  },
  pick(clientX, clientY) {
    const cam = stage._camera, el = stage._renderer && stage._renderer.domElement;
    if (!cam || !el) return null;
    const r = el.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    const rc = new THREE.Raycaster();
    rc.setFromCamera(ndc, cam);
    const hits = rc.intersectObjects(parts.filter(p => p.mesh.visible && p.mesh.material.opacity > 0.5).map(p => p.mesh), false);
    if (!hits.length) return null;
    const p = parts.find(q => q.mesh === hits[0].object);
    return p ? { name: p.mesh.name, node: p.node, temp: meshTemp(p), group: p.group } : null;
  }
};
window.dispatchEvent(new Event('twin-ready'));
