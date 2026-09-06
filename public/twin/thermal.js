/* thermal.js — BLDC 外转子马达集中参数热网络 (示意几何)
   节点: winding / stator / gearcase / housing / mosfet / cell / wheel
   与绕组温度耦合的铜损通过时间步内迭代求解, 与 L4 场景 3 的"损耗-温度自洽"一致。
   对外: window.Thermal.solve(cfg) -> {T, loss, elec, series, meta} */
(function () {
  const LOADS = {
    idle:  { pout: 0,   name: 'idle'  },
    light: { pout: 250, name: 'light' },
    cut:   { pout: 470, name: 'cut'   },
    heavy: { pout: 620, name: 'heavy' }
  };

  // 散热方案: 影响强制风冷倍率与绕组-铁心导热
  const SCHEMES = {
    stock: { cool: 1.00, r_ws: 0.30 },
    duct:  { cool: 1.32, r_ws: 0.30 },
    pot:   { cool: 1.00, r_ws: 0.16 },
    dust:  { cool: 0.55, r_ws: 0.30 }
  };

  const DUTY = {
    cont: { on: 1e9, off: 0 },
    d60:  { on: 60,  off: 30 },
    d30:  { on: 30,  off: 60 }
  };

  const P = {
    rpm0: 11000, droop: 3.1,
    fe: 45, wd: 22,             // 空载铁损 / 风阻轴承损 (W @ rpm0)
    eta_gear: 0.930,
    r_cu20: 0.0455, alpha: 0.00393, k_cu: 0.9,
    r_ds: 0.0050, p_sw: 10,
    r_bat: 0.0120,
    v_oc: 19.6, r_line: 0.006,
    wheel_frac: 0.05,
    // 热阻 K/W ("/fan" 项随风量变化)
    r_sh: 0.18, r_wa: 2.9, r_sg: 2.2,
    r_ha: 0.19, r_gh: 0.55, r_ga: 1.60,
    r_mh: 1.10, r_ma: 3.20, r_ba: 0.90, r_wha: 0.85,
    // 热容 J/K
    c_w: 95, c_s: 300, c_g: 210, c_h: 260, c_m: 55, c_b: 640, c_wh: 60,
    // 限值
    lim_w: 155, lim_m: 150, lim_b: 60, lim_g: 110, lim_h: 85
  };

  function electrical(pout, rpm, tw, scheme) {
    const shaft = pout / P.eta_gear;
    const p_gear = shaft - pout;
    const sp = rpm / P.rpm0;
    const p_fe = P.fe * Math.pow(sp, 1.5);
    const p_wd = P.wd * Math.pow(sp, 3);
    const r_cu = P.r_cu20 * (1 + P.alpha * (tw - 20));
    let I = 20, p_cu = 0, p_fet = 0, v = P.v_oc;
    for (let k = 0; k < 40; k++) {                 // 电流-损耗自洽迭代
      p_cu = P.k_cu * I * I * r_cu;
      p_fet = I * I * P.r_ds + (pout > 0 ? P.p_sw : 0);
      const p_dc = shaft + p_fe + p_wd + p_cu + p_fet;
      v = P.v_oc - I * (P.r_bat + P.r_line);
      const nI = p_dc / Math.max(v, 8);
      if (Math.abs(nI - I) < 1e-4) { I = nI; break; }
      I = I + (nI - I) * 0.6;
    }
    const p_bat = I * I * P.r_bat;
    return {
      I, v, r_cu,
      p_cu, p_fe, p_wd, p_gear, p_fet, p_bat,
      p_wheel: pout * P.wheel_frac,
      p_in: shaft + p_fe + p_wd + p_cu + p_fet + p_bat,
      p_out: pout,
      p_loss: p_cu + p_fe + p_wd + p_gear + p_fet + p_bat
    };
  }

  function solve(cfg) {
    const load = LOADS[cfg.load] || LOADS.heavy;
    const sch = SCHEMES[cfg.scheme] || SCHEMES.stock;
    const duty = DUTY[cfg.duty] || DUTY.cont;
    const Ta = cfg.ambient == null ? 25 : cfg.ambient;
    const seconds = cfg.seconds == null ? 180 : cfg.seconds;

    const rpm_on = Math.max(2000, P.rpm0 - P.droop * load.pout);
    const fan_on = Math.pow(rpm_on / P.rpm0, 0.65) * sch.cool;
    const fan_off = 0.16 * sch.cool;               // 停机后自然对流

    const T = { w: Ta, s: Ta, g: Ta, h: Ta, m: Ta, b: Ta, wh: Ta };
    const peak = Object.assign({}, T);
    const dt = 0.05;
    const steps = Math.round(seconds / dt);
    const series = [];
    let elec = electrical(load.pout, rpm_on, Ta, sch);
    let onTime = 0, energy = 0;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const cyc = duty.on + duty.off;
      const running = duty.off === 0 ? true : (t % cyc) < duty.on;
      const rpm = running ? rpm_on : 0;
      const fan = running ? fan_on : fan_off;
      const e = running ? electrical(load.pout, rpm, T.w, sch)
                        : { p_cu: 0, p_fe: 0, p_wd: 0, p_gear: 0, p_fet: 0, p_bat: 0, p_wheel: 0,
                            I: 0, v: P.v_oc, p_loss: 0, p_in: 0, p_out: 0,
                            r_cu: P.r_cu20 * (1 + P.alpha * (T.w - 20)) };
      if (running) { elec = e; onTime += dt; energy += e.p_in * dt; }

      const r_ha = P.r_ha / fan, r_ga = P.r_ga / fan, r_ma = P.r_ma / fan, r_wa = P.r_wa / fan;
      const q_ws = (T.w - T.s) / sch.r_ws;
      const q_wa = (T.w - Ta) / r_wa;
      const q_sh = (T.s - T.h) / P.r_sh;
      const q_sg = (T.s - T.g) / P.r_sg;
      const q_gh = (T.g - T.h) / P.r_gh;
      const q_ga = (T.g - Ta) / r_ga;
      const q_mh = (T.m - T.h) / P.r_mh;
      const q_ma = (T.m - Ta) / r_ma;
      const q_ha = (T.h - Ta) / r_ha;
      const q_ba = (T.b - Ta) / P.r_ba;
      const q_wha = (T.wh - Ta) / P.r_wha;

      T.w += dt * (e.p_cu - q_ws - q_wa) / P.c_w;
      T.s += dt * (e.p_fe + q_ws - q_sh - q_sg) / P.c_s;
      T.g += dt * (e.p_gear + e.p_wd + q_sg - q_gh - q_ga) / P.c_g;
      T.h += dt * (q_sh + q_gh + q_mh - q_ha) / P.c_h;
      T.m += dt * (e.p_fet - q_mh - q_ma) / P.c_m;
      T.b += dt * (e.p_bat - q_ba) / P.c_b;
      T.wh += dt * (e.p_wheel - q_wha) / P.c_wh;

      for (const k in T) if (T[k] > peak[k]) peak[k] = T[k];
      if (i % Math.max(1, Math.round(steps / 90)) === 0)
        series.push({ t, w: T.w, s: T.s, g: T.g, h: T.h, m: T.m, b: T.b });
    }

    const margin = { w: P.lim_w - T.w, g: P.lim_g - T.g };
    let worst = 'w';
    for (const k in margin) if (margin[k] < margin[worst]) worst = k;

    return {
      T: Object.assign({}, T), peak, series, elec, margin, worst,
      lim: { w: P.lim_w, g: P.lim_g },
      meta: {
        rpm: rpm_on, fan: fan_on, ambient: Ta, seconds, onTime,
        wh: energy / 3600, load: cfg.load, scheme: cfg.scheme, duty: cfg.duty,
        r_ws: sch.r_ws, r_ha: P.r_ha / fan_on, cool: sch.cool
      }
    };
  }

  window.Thermal = { solve, LOADS, SCHEMES, DUTY, P };
})();
