/* NeuralThermal review site · built from source/src (logo.js, content.js, app.js) */
/* Original NeuralThermal mark and wordmark, copied unchanged from the 019 site (src/ui.ts). Not redrawn. */
var NT = (window.NT = window.NT || {});
NT.logo = '<svg class="mark" viewBox="0 0 32 32" fill="none" stroke-linecap="round" aria-hidden="true"><g stroke="#0b6bcb" stroke-width="1.4"><path d="M2 3 L24 29"/><path d="M22 3 L6 29"/><path d="M2 3 L28 29"/><path d="M28 3 L4 29"/><path d="M23 3 L13 29"/><path d="M9 3 L29 29"/></g><path d="M11 3 L23 29" stroke="#e2580a" stroke-width="1.9"/></svg><span>Neural<svg class="t" viewBox="0 0 62 72" aria-hidden="true"><rect width="20" height="15" fill="#2FD4E8"/><rect x="21" width="20" height="15" fill="currentColor"/><rect x="42" width="20" height="15" fill="#76B900"/><rect x="21" y="15" width="20" height="57" fill="currentColor"/></svg>hermal</span>';

/* NeuralThermal review site · content (v3: about half the v2 copy, claims re-audited — see QA/audit_report.md).
   Every figure traces to the reviewed case copy in the 48-case inventory and, where available, the case's own result file.
   Text is written separately for zh and en. Evidence keys: paper = 论文报告, public = 公开数据复现, model = 自建模型. */
var NT = (window.NT = window.NT || {});

NT.evidence = {
  paper: { zh: '论文报告', en: 'Published paper' },
  public: { zh: '公开数据复现', en: 'Public-data reproduction' },
  model: { zh: '自建模型', en: 'Self-built model' }
};

NT.products = [
  {
    id: 'design', code: 'NT Design', color: 'blue',
    name: { zh: 'AI 热设计', en: 'AI Thermal Design' },
    line: { zh: '在约定参数范围内快速预测温度，先筛方案，再交求解器复核。', en: 'Fast temperature prediction within an agreed parameter range: screen first, re-check with the solver.' },
    problem: { zh: '每改一版都要重算仿真，方案多到算不完。', en: 'Every change needs another simulation, and there are more options than time.' },
    inputs: { zh: ['参数范围：几何、材料、功率、冷却', '已有仿真或测试数据（也可从零建模）', '约束：温度上限、压降预算'], en: ['Parameter ranges: geometry, materials, power, cooling', 'Existing simulation or test data (or we build the model)', 'Constraints: temperature limits, pressure budget'] },
    outputs: { zh: ['毫秒级温度场或最高温', '约定范围内的扫描与比较', '入选方案的求解器复核'], en: ['Temperature fields or peaks in milliseconds', 'Sweeps and comparisons within the agreed range', 'Solver re-checks of the shortlist'] },
    deliver: { zh: ['专用代理模型', '交互设计工具', '验证报告'], en: ['A dedicated surrogate model', 'An interactive design tool', 'A validation report'] },
    bounds: { zh: ['只在验证过的范围内使用，范围外交回求解器。', '扫工况与改几何是两类问题，分开验证。'], en: ['Used only inside the validated range; outside it, the solver takes over.', 'Operating sweeps and geometry changes are separate problems, validated separately.'] },
    pilot: { zh: '一个部件、一类变化、一个精度指标。', en: 'One part, one kind of variation, one accuracy target.' },
    cases: ['015', '021', '066', '060', '064']
  },
  {
    id: 'sensor', code: 'NTsensor', color: 'thermal',
    name: { zh: '虚拟温度传感', en: 'Virtual Temperature Sensing' },
    line: { zh: '用控制器已有的信号，估算难以直接测量的结温、绕组、磁钢和转子温度。', en: 'Estimate junction, winding, magnet and rotor temperatures from signals the controller already has.' },
    problem: { zh: '最热的位置往往难以直接测温，只能按最坏情况多留余量。', en: 'The hottest spot is often hard to measure directly, so margin is set for the worst case.' },
    inputs: { zh: ['控制器已有信号：电流、电压、转速、冷却液温度、NTC / 热电偶', '台架或现场温度记录'], en: ['Signals the controller already has: currents, voltages, speed, coolant temperature, NTCs or thermocouples', 'Bench or field temperature logs'] },
    outputs: { zh: ['逐点温度估计', '在留出测试工况上的误差报告'], en: ['Per-location temperature estimates', 'An error report on held-out test cycles'] },
    deliver: { zh: ['上位机 / 台架离线验证', '嵌入式观测器评估', '控制集成——须经您方单独验证'], en: ['Offline validation on PC or bench', 'Embedded-observer assessment', 'Control integration — only after your own validation'] },
    bounds: { zh: ['只报告在留出测试工况上实测的误差，不承诺校准过的不确定度区间。', '不承诺取消 NTC、提高保护阈值或持续功率；演示不是量产安全系统。'], en: ['We report error measured on held-out test cycles; we do not promise calibrated uncertainty bounds.', 'No promise to remove NTCs or raise protection limits or continuous power; demos are not production safety systems.'] },
    pilot: { zh: '用一段已有台架数据，先做离线估温。', en: 'Start with bench data you already have and estimate offline.' },
    cases: ['018', '020', '058', '015']
  },
  {
    id: 'workflow', code: 'NT Workflow', color: 'ai',
    name: { zh: '工程自动化', en: 'Engineering Automation' },
    line: { zh: '参数化求解、数据整理、训练评估和报告，串成可重跑的脚本流程。', en: 'Parametric solving, data handling, training, evaluation and reports as one re-runnable scripted pipeline.' },
    problem: { zh: '批量仿真、整理、训练、出报告都靠手工拼接，换产品又从头来。', en: 'Batch runs, data, training and reports are stitched by hand, and the next product starts over.' },
    inputs: { zh: ['您的求解器或我们自建的求解器', '参数范围与验收口径'], en: ['Your solver or one we build', 'Parameter ranges and acceptance criteria'] },
    outputs: { zh: ['独立划分的训练 / 验证 / 测试数据集', '可复现的训练与评估记录', '自动生成的报告'], en: ['Datasets with independent train / validation / test splits', 'Reproducible training and evaluation records', 'Generated reports'] },
    deliver: { zh: ['先以项目服务交付', '再做工具集成或私有部署'], en: ['First as a project service', 'Then tool integration or private deployment'] },
    bounds: { zh: ['只承接有现成脚本与记录支撑的流程。本站自建模型案例由这类脚本生成；论文解读类案例（如 016）不在此列。'], en: ['Only pipelines backed by existing scripts and records. The self-built cases on this site came from such scripts; paper-review cases such as 016 did not.'] },
    pilot: { zh: '选一类每月重复的仿真任务，先脚本化。', en: 'Script one simulation task you repeat every month.' },
    cases: ['060', '026', '064', '033']
  }
];

/* Cases. img = assets/img/<img>.jpg; clip = assets/video/clip-<clip>.mp4; m = metrics {v, l (label), c (condition)} */
NT.cases = [
  {
    id: '015', ind: ['cooling'], prod: ['design', 'sensor'], ev: 'model', img: 'case-h100', clip: 'h100', tool: 'h100',
    title: { zh: 'H100 液冷：三个输入，重建整颗芯片温度场', en: 'H100 liquid cooling: three inputs, the full die temperature field' },
    tag: { zh: 'GPU 液冷 · 代理模型', en: 'GPU liquid cooling · surrogate' },
    problem: { zh: '流量或进液温度变化时，芯片上哪里先热？演示用 GPU 功耗、冷却液流量和温度三个输入，在验证范围内重建稳态温度场。', en: 'When flow or inlet temperature changes, where does the die heat up first? From GPU power, coolant flow and temperature, the demo rebuilds the steady-state field within its validated range.' },
    did: { zh: '自建 H100 级模组三维导热模型（硅、TIM、铜冷板），系统边界取自 MIT 许可的开源 ThermaLoop。共 600 次仿真：POD 平均场和形状基用全部 600 张温度图拟合；神经网络只用其中 500 次训练，另 100 次网络没有见过。因此这 100 次只对网络留出，不是整个流程的独立测试。影片版本是另一套划分（600 训练 + 另采 100 测试，最大误差 0.54 K），两者不混用。', en: 'A self-built 3-D conduction model of an H100-class module (silicon, TIM, copper plate), loop boundary conditions from the MIT-licensed open-source ThermaLoop. Of 600 simulations, the POD mean and shape basis were fitted on all 600 temperature maps; the network was trained on 500 and never saw the other 100. Those 100 are held out from the network only, not an independent test of the whole pipeline. The film uses a different split (600 training + 100 separately sampled tests, max error 0.54 K); the two are not mixed.' },
    m: [
      { v: '3 → 3,600', l: { zh: '三个输入 → 整颗芯片 3,600 个点的温度', en: 'three inputs → temperature at 3,600 points on the die' }, c: { zh: '稳态、固定几何、训练范围内', en: 'steady state, fixed geometry, within the trained range' } },
      { v: '0.32 K', l: { zh: '100 个网络未训练工况的最大误差', en: 'max error on 100 cases the network was not trained on' }, c: { zh: '不是完全独立测试：POD 平均场与形状基用全部 600 张图拟合，含这 100 个工况；平均 0.05 K，对比自建求解器', en: 'not a fully independent test: the POD mean and basis were fitted on all 600 maps, including these 100; mean 0.05 K, vs our solver' } }
    ],
    bounds: { zh: '固定几何的稳态解：不是几何优化，也不是真实硬件的瞬态测温。只覆盖训练范围内的功率、流量和进液温度。', en: 'Fixed-geometry steady state: not geometry optimisation and not transient hardware measurement. Valid only within the trained power, flow and inlet range.' },
    src: { zh: 'ThermaLoop v0.3.0（Travis Walla，MIT 许可）提供回路边界；三维模型与代理模型为 NeuralThermal 自建。', en: 'Loop boundary conditions from ThermaLoop v0.3.0 (Travis Walla, MIT licence); 3-D model and surrogate by NeuralThermal.' }
  },
  {
    id: '021', ind: ['cooling'], prod: ['design'], ev: 'model', img: 'case-gb200', clip: 'gb200',
    title: { zh: '扩散模型画冷板流道', en: 'A diffusion model draws cold-plate channels' },
    tag: { zh: '冷板 · 生成式设计', en: 'Cold plate · generative design' },
    problem: { zh: '直流道冷板压不住热点，每版新流道都要再算。', en: 'Straight channels leave hot spots, and every new layout needs another run.' },
    did: { zh: '按 arXiv 2608.22787 思路自建降阶模型与数据，训练 U-Net 扩散模型按目标温度和压降生成流道：生成 5,000 个，557 个有效设计逐一评估。', en: 'After arXiv 2608.22787 we built our own reduced-order model and data and trained a U-Net diffusion model that draws channels for a target temperature and pressure drop: 5,000 drawn, 557 valid designs evaluated.' },
    m: [
      { v: '104 → 72 °C', l: { zh: 'GPU 最高温', en: 'GPU peak' }, c: { zh: '代价：压降 48 → 165 kPa', en: 'at a cost: pressure drop 48 → 165 kPa' } },
      { v: '−16 K', l: { zh: '同压降（约 50 kPa）', en: 'at the same pressure drop (≈50 kPa)' }, c: { zh: '同一降阶模型内比较', en: 'within the same reduced-order model' } }
    ],
    bounds: { zh: '2.5D 降阶模型，未做三维 CFD 复核；GB200 级布局为示意。', en: '2.5-D reduced-order model, no 3-D CFD re-check; the GB200-class layout is illustrative.' },
    src: { zh: '方法参考 arXiv 2608.22787（CC BY-NC-SA 4.0）；模型、数据和数字为自建复现。', en: 'Method after arXiv 2608.22787 (CC BY-NC-SA 4.0); model, data and figures are our reproduction.' }
  },
  {
    id: '066', ind: ['cooling'], prod: ['design'], ev: 'model', img: 'case-coldplate',
    title: { zh: '铜冷板顶 2.3 kW，还能撑多久？', en: 'A copper cold plate at 2.3 kW: how far can it go?' },
    tag: { zh: '微通道冷板 · MLP', en: 'Microchannel cold plate · MLP' },
    problem: { zh: 'GPU 功耗还在涨，翅片和压降还值不值得加？', en: 'GPU power keeps rising: are finer fins and more pressure drop still worth it?' },
    did: { zh: '自建 Rubin 级示意 GPU 与冷板求解器，3,000 个翅片设计（300 个留作测试）训练 MLP，扫描 1,180,800 种设计；最好与常见设计交求解器复核。', en: 'A self-built Rubin-class GPU and cold-plate solver; 3,000 fin designs (300 held out) trained an MLP that scanned 1,180,800 designs; best and typical designs re-checked by the solver.' },
    m: [
      { v: '0.09 K', l: { zh: '最热芯片平均误差', en: 'mean error, hottest die' }, c: { zh: '300 个测试设计', en: '300 test designs' } },
      { v: '≈2.7 kW', l: { zh: '最好翅片的功率上限', en: 'ceiling with the best fins' }, c: { zh: '按 105 °C 示意上限、60 kPa 压降预算', en: 'illustrative 105 °C limit, 60 kPa budget' } }
    ],
    bounds: { zh: 'GPU 尺寸与功耗为示意估计，不是 NVIDIA 数据。', en: 'GPU size and power are illustrative estimates, not NVIDIA data.' },
    src: { zh: '微通道四部曲第 1 期；自建求解器与 MLP。', en: 'Microchannel series, part 1; our solver and MLP.' }
  },
  {
    id: '067', ind: ['cooling', 'packaging'], prod: ['design'], ev: 'model', img: 'case-mclid', research: true,
    title: { zh: '把水道做进封装盖板', en: 'Channels in the package lid' },
    tag: { zh: '微流道盖板', en: 'Microchannel lid' },
    problem: { zh: '3.6 kW 时，盖板和两层 TIM 成了瓶颈。', en: 'At 3.6 kW the lid and two TIM layers become the bottleneck.' },
    did: { zh: '同一自建 GPU 模型上比较冷板与翅片直接做进盖板，MLP 扫 118 万种设计，关键对比交求解器复核。', en: 'On the same self-built GPU model we compared a cold plate with fins in the lid; an MLP scanned 1.18 million designs; key comparisons re-checked by the solver.' },
    m: [
      { v: '127.7 → 93.7 °C', l: { zh: '冷板 vs 盖板', en: 'cold plate vs lid' }, c: { zh: '3.6 kW，同翅片、同流量', en: '3.6 kW, same fins and flow' } }
    ],
    bounds: { zh: '设计示范，不代表我们制造或供货。', en: 'A design demonstration; we do not manufacture or supply lids.' },
    src: { zh: '微通道四部曲第 2 期；MLP 平均误差 0.14 K。', en: 'Microchannel series, part 2; MLP mean error 0.14 K.' }
  },
  {
    id: '068', ind: ['cooling', 'packaging'], prod: ['design'], ev: 'model', img: 'case-microcooler', research: true,
    title: { zh: '硅微冷却器为什么离不开歧管', en: 'Why a silicon microcooler needs a manifold' },
    tag: { zh: '硅基微冷却器', en: 'Silicon microcooler' },
    problem: { zh: '长直硅通道省掉了 TIM，压降却高得不可用。', en: 'Long straight silicon channels remove the TIM but need an unusable pressure drop.' },
    did: { zh: 'MLP 扫 107 万种通道与歧管设计，两个对比设计交求解器复核。', en: 'An MLP scanned 1.07 million channel and manifold designs; two contrasting designs re-checked by the solver.' },
    m: [
      { v: '90.5 → 67.7 °C', l: { zh: '直通道 vs 2 mm 分段歧管', en: 'straight vs 2 mm manifold segments' }, c: { zh: '3.4 kW；压降 1,096 → 7 kPa', en: '3.4 kW; pressure 1,096 → 7 kPa' } }
    ],
    bounds: { zh: '设计示范；TSMC IMC-Si 只作背景，不代表我们制造或供货。', en: 'A design demo; TSMC IMC-Si is background only. We do not manufacture or supply.' },
    src: { zh: '微通道四部曲第 3 期；MLP 平均误差 0.10 K。', en: 'Microchannel series, part 3; MLP mean error 0.10 K.' }
  },
  {
    id: '069', ind: ['cooling', 'packaging'], prod: ['design'], ev: 'model', img: 'case-inchip', research: true,
    title: { zh: '芯片内嵌微流道，该往哪儿密', en: 'Embedded microchannels: where to make them dense' },
    tag: { zh: '芯片内嵌微流道', en: 'Embedded microfluidics' },
    problem: { zh: '热点不均，同宽通道在压降预算内压不下最高温。', en: 'Uneven heat: uniform channels cannot hold the peak within the pressure budget.' },
    did: { zh: '芯片分 24 区，3,000 种布法训练 MLP，试 7,680 种，终选交求解器复核。', en: 'The die split into 24 zones; 3,000 layouts trained an MLP that tried 7,680; the final pick re-checked by the solver.' },
    m: [
      { v: '83.7 → 69.0 °C', l: { zh: '同宽 vs 分区布置', en: 'uniform vs zoned' }, c: { zh: '求解器复核；30 kPa 预算内（28.2 kPa）', en: 'solver re-check; within 30 kPa (28.2 kPa)' } }
    ],
    bounds: { zh: 'MLP 平均误差 2.66 K、最差 24.6 K，所以终选必须交求解器。设计示范，不代表我们能制造。', en: 'MLP mean error 2.66 K, worst 24.6 K, so the final pick must go to the solver. A design demo; we do not manufacture.' },
    src: { zh: '微通道四部曲第 4 期；Microsoft / Corintis 公开数字只作背景。', en: 'Microchannel series, part 4; Microsoft / Corintis figures are background only.' }
  },
  {
    id: '027', ind: ['cooling'], prod: ['design'], ev: 'model', img: null,
    title: { zh: '仿生人字纹电池冷板', en: 'A bio-inspired herringbone battery cold plate' },
    tag: { zh: '电池液冷板', en: 'Battery cold plate' },
    problem: { zh: '直流道冷板下，后段电芯总偏热。', en: 'With straight channels, the rear cells run warmer.' },
    did: { zh: '自建 2.5D 简化模型，4,000 次仿真训练网络，再梯度搜索流道形状。', en: 'A self-built 2.5-D model; 4,000 simulations trained a network, then a gradient search shaped the channels.' },
    m: [
      { v: '−52 %', l: { zh: '电芯温差', en: 'cell-to-cell spread' }, c: { zh: '泵压降 −20 %，最高温基本不变（35.1 → 35.3 °C）', en: 'pump pressure −20 %, peak essentially unchanged (35.1 → 35.3 °C)' } }
    ],
    bounds: { zh: '2.5D 简化模型，非实测。', en: '2.5-D simplified model, not measured.' },
    src: { zh: '思路参考 Srivardhan 等，IJHFF 121 (2026) 110477；原文数字未用。', en: 'Idea after Srivardhan et al., IJHFF 121 (2026) 110477; the paper’s figures are not used.' }
  },
  {
    id: '045', ind: ['cooling', 'drives'], prod: ['design'], ev: 'model', img: null,
    title: { zh: '射流冷却代理模型，出了范围还准吗？', en: 'Jet-cooling surrogates outside their range' },
    tag: { zh: 'SiC 模块射流冷却', en: 'SiC module jet cooling' },
    problem: { zh: '换了喷嘴尺寸或流量，代理模型可能离谱。', en: 'A new nozzle size or flow can throw a surrogate off.' },
    did: { zh: '自建 XM3 尺寸 SiC 模块多喷嘴射流模型，比较三种输入方式在范围外的表现。', en: 'A self-built multi-jet model of an XM3-size SiC module, comparing three input encodings outside the training range.' },
    m: [
      { v: '13 % → 4 %', l: { zh: '范围外压降误差', en: 'out-of-range pressure-drop error' }, c: { zh: '原始参数 vs 取对数输入；5 个随机种子平均', en: 'raw vs log inputs; mean of 5 seeds' } }
    ],
    bounds: { zh: '真值用公开射流关联式外推到乙二醇，换热不确定度约 ±20 %。', en: 'Truth from published jet correlations extrapolated to glycol (≈±20 % on heat transfer).' },
    src: { zh: '思路参考 Kim 等，Appl. Therm. Eng. 289 (2026)。', en: 'Idea after Kim et al., Appl. Therm. Eng. 289 (2026).' }
  },
  {
    id: '060', ind: ['packaging'], prod: ['design', 'workflow'], ev: 'model', img: 'case-hbm',
    title: { zh: 'HBM 内部的热，AI 能算准吗？', en: 'Heat inside an HBM stack: can AI get it right?' },
    tag: { zh: '单颗 8-Hi HBM · U-Net', en: 'Single 8-Hi HBM · U-Net' },
    problem: { zh: 'HBM 内部温升要分层看，每换一组功耗就要重算。', en: 'HBM temperature rise must be read layer by layer, and each new power map needs a new solve.' },
    did: { zh: '自建单颗 8-Hi HBM 导热模型，1,200 组工况（900 / 150 / 150 独立划分）训练 U-Net：九层功耗图输入，19 个高度切片输出。', en: 'A self-built conduction model of one 8-Hi HBM; 1,200 cases (independent 900 / 150 / 150 split) trained a U-Net: nine power maps in, 19 height slices out.' },
    m: [
      { v: '0.29 K', l: { zh: '场平均误差', en: 'mean field error' }, c: { zh: '150 组独立测试；最高温升误差 0.24 K', en: '150 independent tests; peak-rise error 0.24 K' } },
      { v: '80.7 %', l: { zh: '判对最热芯片层', en: 'hottest layer identified' }, c: { zh: '场误差小不等于热点总判对', en: 'low field error ≠ hot spot always right' } }
    ],
    bounds: { zh: '单颗 HBM，不计 GPU 邻近热耦合；TSV 与微凸点均匀化处理；自建模型验证，不是厂商实测。', en: 'One HBM, no GPU coupling; TSVs and micro-bumps homogenised; a self-built model check, not vendor measurement.' },
    src: { zh: '几何与材料参考 JSTS 2025、Electronics 2022、IMAPS 2013；同机 CPU 单工况预测 0.85 ms，预分解 LU 回代 2.49 ms。', en: 'Geometry and materials after JSTS 2025, Electronics 2022, IMAPS 2013; same-CPU prediction 0.85 ms per case vs 2.49 ms pre-factorised LU back-substitution.' }
  },
  {
    id: '061', ind: ['packaging'], prod: ['design'], ev: 'model', img: 'case-mi300x', clip: 'mi300x',
    title: { zh: '八颗芯粒，活该派给谁？', en: 'Eight chiplets: where should the work go?' },
    tag: { zh: 'MI300X 级芯粒 · 图神经网络', en: 'MI300X-class chiplets · GNN' },
    problem: { zh: '4 个作业放进 8 颗芯粒有 1,680 种放法，调度时来不及逐个仿真。', en: 'Four jobs on eight chiplets can be placed 1,680 ways — too many to simulate at scheduling time.' },
    did: { zh: '按公开资料自建三维热模型，图神经网络给每种放法打分；最好、按编号、最差及 12 个随机放法交求解器复核。', en: 'A self-built 3-D model from public data; a graph network scores every placement; best, by-index, worst and 12 random placements re-checked by the solver.' },
    m: [
      { v: '−8.6 K', l: { zh: '最好放法 vs 按编号放', en: 'best vs by-index placement' }, c: { zh: '75.9 → 67.3 °C，同样的作业', en: '75.9 → 67.3 °C, same jobs' } },
      { v: '0.05 K', l: { zh: '每颗芯粒平均误差', en: 'mean error per chiplet' }, c: { zh: '对比自建求解器', en: 'vs our solver' } }
    ],
    bounds: { zh: '芯粒尺寸、功耗与散热条件为估计，不是 AMD 数据。', en: 'Chiplet sizes, power and cooling are estimates, not AMD data.' },
    src: { zh: '公开资料：AMD、ROCm 文档、TechInsights；1,680 种放法 0.5 s 打分，求解器约 24 分钟。', en: 'Public sources: AMD, ROCm, TechInsights; 1,680 placements scored in 0.5 s vs ≈24 min with the solver.' }
  },
  {
    id: '064', ind: ['packaging', 'cooling'], prod: ['design', 'workflow'], ev: 'model', img: 'case-cpo', clip: 'cpo',
    title: { zh: '光引擎塞进封装，热扛得住吗？', en: 'Optical engines in the package: will the heat hold?' },
    tag: { zh: '共封装光学 CPO · U-Net', en: 'Co-packaged optics · U-Net' },
    problem: { zh: '几种芯片上限不同，冷却参数卡在谁身上？', en: 'Chips with different limits: which one sets the cooling?' },
    did: { zh: '按公开尺寸自建 CoWoS-L 示意模型，1,600 个仿真训练 U-Net，扫 1,681 个冷却方案，边界点交求解器复核。', en: 'A self-built CoWoS-L model from public dimensions; 1,600 simulations trained a U-Net that swept 1,681 cooling options; the boundary re-checked by the solver.' },
    m: [
      { v: '≥ 5.5 L/min', l: { zh: '45 °C 进水所需流量', en: 'flow needed at 45 °C inlet' }, c: { zh: '先超限的是 HBM4，不是 XPU；求解器复核', en: 'HBM4 hits its limit first, not the XPU; solver-checked' } },
      { v: '0.31 K', l: { zh: '芯片平均误差', en: 'mean chip error' }, c: { zh: '200 个测试工况', en: '200 test cases' } }
    ],
    bounds: { zh: '功耗拆分、导热与换热系数为估计（合计 2.76 kW）；示意模型，不是厂商 CAD。', en: 'Power split, conductivities and heat transfer are estimates (2.76 kW total); illustrative, not vendor CAD.' },
    src: { zh: '对象参考 Ayar Labs 与 GUC 公开方案；1,681 个方案 19 s，求解器约 33 分钟。', en: 'After the public Ayar Labs / GUC design; 1,681 options in 19 s vs ≈33 min with the solver.' }
  },
  {
    id: '026', ind: ['packaging'], prod: ['design', 'workflow'], ev: 'model', img: null,
    title: { zh: 'HBM 怎么叠才不过热？先让网络筛', en: 'Which HBM stacks overheat? Screen with a network' },
    tag: { zh: 'HBM 堆叠 · 参数扫描', en: 'HBM stack · parameter sweep' },
    problem: { zh: '27 个因素各 3 档，组合约 7.6 万亿种。', en: '27 factors at 3 levels: ≈7.6 trillion combinations.' },
    did: { zh: '自建 HBM 简化模型，13,494 组数据（2,699 组测试）训练网络，再扫 100 万种组合。', en: 'A simplified self-built HBM model; 13,494 cases (2,699 for testing) trained a network that swept 1 million combinations.' },
    m: [
      { v: '0.21 °C', l: { zh: '结温平均误差', en: 'mean junction error' }, c: { zh: '2,699 组测试；最大 1.40 °C', en: '2,699 tests; max 1.40 °C' } }
    ],
    bounds: { zh: '简化模型，档位按 HBM3 量级自定；用于约定范围内的初筛。', en: 'Simplified model with HBM3-magnitude levels; for screening within the set range.' },
    src: { zh: '思路参考 arXiv 2503.04049；100 万种组合扫描约 1.1 s。', en: 'Idea after arXiv 2503.04049; 1 million combinations in ≈1.1 s.' }
  },
  {
    id: '031', ind: ['packaging'], prod: ['design'], ev: 'model', img: 'case-warpage',
    title: { zh: '2.5D 封装，HBM 和芯粒怎么摆', en: '2.5-D packaging: where to place HBM and chiplets' },
    tag: { zh: '翘曲 · 图神经网络', en: 'Warpage · graph network' },
    problem: { zh: '每改一次布局就要跑一次有限元。', en: 'Every layout change needs another FEM run.' },
    did: { zh: '按公开资料重建叠层，用 FEM 结果训练图神经网络，入选摆法再交 FEM 复核。', en: 'A stack-up rebuilt from public data; a graph network trained on FEM; chosen layouts re-checked with FEM.' },
    m: [
      { v: '+70 %', l: { zh: '最好摆法离 220 µm 限值的余量', en: 'more margin to the 220 µm limit' }, c: { zh: '只比较摆法之间的相对差别', en: 'relative comparison between layouts only' } }
    ],
    bounds: { zh: '盖下导热胶简化为不传力，只讲相对差别。', en: 'Lid adhesive simplified as load-free, so only relative differences are claimed.' },
    src: { zh: '思路参考 WarPGNN（arXiv 2603.18581）；叠层参考 Amkor 等公开资料。', en: 'Idea after WarPGNN (arXiv 2603.18581); stack-up after Amkor and other public sources.' }
  },
  {
    id: '033', ind: ['packaging'], prod: ['design', 'workflow'], ev: 'model', img: null,
    title: { zh: 'AI 怎么知道自己算错了', en: 'How the AI knows it is wrong' },
    tag: { zh: '神经算子 · 置信评分', en: 'Neural operator · confidence score' },
    problem: { zh: '神经算子遇到没见过的工况会算错 8.5 K。', en: 'On unseen conditions the operator can be off by 8.5 K.' },
    did: { zh: '把预测代回物理方程算残差作置信分，分数差的交回求解器。', en: 'The physics residual of each prediction becomes a confidence score; low scores go back to the solver.' },
    m: [
      { v: '0.67 K', l: { zh: '复核 28 % 方案后的最大误差', en: 'max error after re-checking 28 %' }, c: { zh: '误差最大的 5 % 全部抓出', en: 'all of the worst 5 % caught' } }
    ],
    bounds: { zh: '速度只和迭代求解器比；求解器与网络为自建。', en: 'Speed compared with an iterative solver only; solver and network are our own.' },
    src: { zh: '思路参考 DeepOHeat-v1（arXiv 2504.03955）。', en: 'Idea after DeepOHeat-v1 (arXiv 2504.03955).' }
  },
  {
    id: '041', ind: ['packaging'], prod: ['design'], ev: 'model', img: null,
    title: { zh: '520 万种 TSV 排法，全部打分', en: 'All 5.2 million TSV arrangements, scored' },
    tag: { zh: 'TSV 布局 · 图神经网络', en: 'TSV layout · graph network' },
    problem: { zh: '25 个位置放 12 簇 TSV，有 520 万种排法。', en: '12 TSV clusters in 25 positions: 5.2 million options.' },
    did: { zh: '小型图神经网络给全部排法打分，键合层热阻按 IBM 公开实测标定。', en: 'A small graph network scored every arrangement; bond resistance calibrated to IBM’s public data.' },
    m: [
      { v: '173 s', l: { zh: '520 万种全部打分', en: 'to score all 5.2 million' }, c: { zh: '一种功率图；逐个求解推算约 38 天', en: 'one power map; one-by-one solving ≈38 days (estimate)' } }
    ],
    bounds: { zh: '网络只见过 5 种功率图；部分边界为假设值。', en: 'The network saw only 5 power maps; some boundaries are assumed.' },
    src: { zh: '思路参考 arXiv 2603.29268，只复现热的一半。', en: 'Idea after arXiv 2603.29268, thermal half only.' }
  },
  {
    id: '043', ind: ['packaging'], prod: ['design'], ev: 'model', img: null,
    title: { zh: 'AI 算错时，自己知道吗？', en: 'Does the AI know when it is wrong?' },
    tag: { zh: '不确定度 · 深度集成', en: 'Uncertainty · deep ensembles' },
    problem: { zh: '代理模型快，但没人敢直接信。', en: 'Surrogates are fast, but nobody trusts them blindly.' },
    did: { zh: '同一 HBM 代理模型换种子训 5 遍，分歧大就报警。', en: 'The same HBM surrogate trained 5 times; large disagreement raises a flag.' },
    m: [
      { v: '433 / 439', l: { zh: '范围外算错的设计被标出', en: 'out-of-range errors flagged' }, c: { zh: '但说不准差多少：分歧 5 °C，实际偏 17 °C', en: 'but not by how much: 5 °C spread vs 17 °C error' } }
    ],
    bounds: { zh: '压力测试功率不代表真实产品；档位之间只报出一半多。', en: 'Stress-test power is no real product; between levels only about half were flagged.' },
    src: { zh: '方法：Deep Ensembles（NeurIPS 2017）。', en: 'Method: Deep Ensembles (NeurIPS 2017).' }
  },
  {
    id: '049', ind: ['packaging'], prod: ['design'], ev: 'model', img: null,
    title: { zh: '换了布局，AI 要重新学吗？', en: 'New layout: retrain the AI?' },
    tag: { zh: '积木式求解', en: 'Composable solver' },
    problem: { zh: '代理模型往往只认训练过的布局。', en: 'Surrogates usually know only their training layout.' },
    did: { zh: '封装拆成积木，每类一个小 U-Net，积木间迭代交换温度与热流。', en: 'The package split into blocks, one small U-Net per type, exchanging temperature and heat flux.' },
    m: [
      { v: '0.22 K', l: { zh: '芯片数量变化后的积木式误差', en: 'block-wise error after the chip count changes' }, c: { zh: '整体式 0.13 → 0.95 K', en: 'monolithic 0.13 → 0.95 K' } }
    ],
    bounds: { zh: '在约 1 万未知量的小模型上，积木式反而比直接求解慢。', en: 'On our ~10k-unknown model, block-wise is slower than a direct solve.' },
    src: { zh: '思路参考 DAIST（arXiv 2610.02461）。', en: 'Idea after DAIST (arXiv 2610.02461).' }
  },
  {
    id: '057', ind: ['packaging'], prod: ['design'], ev: 'model', img: null,
    title: { zh: 'HBM 叠得越高，哪一层最烫', en: 'Taller HBM stacks: which layer runs hottest' },
    tag: { zh: 'HBM 堆叠高度 · 一维模型', en: 'HBM stack height · 1-D model' },
    problem: { zh: '从 8 层到 16 层，峰值和最热层怎么变？', en: 'From 8 to 16 layers, how do peak and hottest layer move?' },
    did: { zh: '自建一维层间 RC 模型，6,000 个堆叠训练代理模型。', en: 'A self-built 1-D layer RC model; 6,000 stacks trained a surrogate.' },
    m: [
      { v: '48.4 → 64.3 °C', l: { zh: '8 层到 16 层的峰值', en: 'peak, 8 to 16 layers' }, c: { zh: '每层 0.8 W；最热层判对 94 %', en: '0.8 W per layer; hottest layer right 94 %' } }
    ],
    bounds: { zh: '一维模型，没有面内热点。', en: '1-D model, no in-plane hot spots.' },
    src: { zh: '026 HBM 的延伸角度。', en: 'A follow-up to case 026.' }
  },
  {
    id: '040', ind: ['packaging'], prod: ['design'], ev: 'model', img: null,
    title: { zh: '硅光热串扰，隔热槽挖哪', en: 'Silicon-photonics crosstalk: where to cut trenches' },
    tag: { zh: '微环热串扰', en: 'Micro-ring crosstalk' },
    problem: { zh: '微环每变 1 K 漂约 70 pm，邻道加热会把它带偏。', en: 'A ring drifts ≈70 pm per kelvin; neighbouring heaters push it off.' },
    did: { zh: '自建 4×4 微环阵列模型，搜遍 1,820 种挖法，最优交求解器复核。', en: 'A self-built 4×4 ring-array model; all 1,820 trench layouts searched, the best re-checked.' },
    m: [
      { v: '116 vs 121 pm', l: { zh: '只挖中间 4 只 vs 全挖 16 只', en: 'middle 4 trenches vs all 16' }, c: { zh: '无槽 136 pm', en: '136 pm without trenches' } }
    ],
    bounds: { zh: '隔热槽几何为假设，没有文献对照。', en: 'Trench geometry is assumed, with no literature reference.' },
    src: { zh: '思路参考 ThermoPhoton（ICCAD 2025）。', en: 'Idea after ThermoPhoton (ICCAD 2025).' }
  },
  {
    id: '016', ind: ['packaging'], prod: ['design'], ev: 'paper', img: null,
    title: { zh: 'AI 算得准 Chiplet 吗？（论文解读）', en: 'Can AI get chiplet thermals right? (paper review)' },
    tag: { zh: '2.5D 芯粒 · 论文基准', en: '2.5-D chiplets · paper benchmark' },
    problem: { zh: '学过的封装很准，换一种封装还准吗？', en: 'Accurate on learned packages — and on a new one?' },
    did: { zh: '解读 IC-ThermBench 基准结果。', en: 'A reading of the IC-ThermBench results.' },
    m: [
      { v: '0.7 K / 14.5 K', l: { zh: '学过的范围内 / 没见过的封装', en: 'in range / unseen packages' }, c: { zh: '论文报告', en: 'reported by the paper' } },
      { v: '2.25 K', l: { zh: '补 10 个仿真迁移微调后', en: 'after fine-tuning with 10 extra simulations' }, c: { zh: '与 14.5 K 来自不同模型和评测口径，不能当作同一基线的改进', en: 'different model and protocol from the 14.5 K — not an improvement on the same baseline' } }
    ],
    bounds: { zh: '数字全部来自论文，不是我们的复现。', en: 'All figures are from the paper, not our reproduction.' },
    src: { zh: 'IC-ThermBench，arXiv:2608.23977。', en: 'IC-ThermBench, arXiv:2608.23977.' }
  },
  {
    id: '020', ind: ['drives'], prod: ['sensor'], ev: 'model', img: 'case-sic',
    title: { zh: 'SiC 模块：一个 NTC，十颗芯片的结温', en: 'SiC module: one NTC, ten junction temperatures' },
    tag: { zh: 'SiC 功率模块 · 结温估算', en: 'SiC power module · junction estimation' },
    problem: { zh: '这个模块里十颗芯片只配一个 NTC，各芯片结温不同。', en: 'In this module ten dies share one NTC, and their junction temperatures differ.' },
    did: { zh: '按数据手册外形自建三维有限体积模型，200 组参数训练网络，48 组没见过的组合测试。', en: 'A self-built 3-D finite-volume model from the datasheet outline; 200 parameter sets trained a network, 48 unseen combinations tested.' },
    m: [
      { v: '0.33 °C', l: { zh: '温度场平均误差', en: 'mean field error' }, c: { zh: '48 组未见组合；结温平均 0.83 °C', en: '48 unseen combinations; junction mean 0.83 °C' } }
    ],
    bounds: { zh: '层厚为估计；自建模型复现，不是量产保护系统，不据此提高功率或保护阈值。', en: 'Layer thicknesses estimated; a self-built reproduction, not a protection system and no basis for raising power or limits.' },
    src: { zh: '方法参考 Troldborg 等，Electronics 2026（CC BY 4.0）；外形来自 Wolfspeed 数据手册。', en: 'Method after Troldborg et al., Electronics 2026 (CC BY 4.0); outline from the Wolfspeed datasheet.' }
  },
  {
    id: '058', ind: ['drives'], prod: ['sensor'], ev: 'model', img: 'render-igbt',
    title: { zh: '最热的那颗芯片，热电偶测不到', en: 'The hottest die the thermocouples miss' },
    tag: { zh: 'IGBT 模块 · 因果时序网络', en: 'IGBT module · causal TCN' },
    problem: { zh: '在这个自建模块里，六颗并联芯片发热不均，基板热电偶离最热芯片远。', en: 'In this self-built module six paralleled dies heat unevenly, and the baseplate thermocouples sit far from the hottest.' },
    did: { zh: '自建网格 RC 仿真，只用已有 12 个热电偶，因果时序网络逐颗估结温。', en: 'A self-built grid RC simulation; from the 12 existing thermocouples, a causal TCN estimates each junction.' },
    m: [
      { v: '2.77 K', l: { zh: '逐颗结温估计误差', en: 'per-die junction error' }, c: { zh: '最热芯片 137.0 °C，最热热电偶 87.7 °C', en: 'hottest die 137.0 °C, hottest thermocouple 87.7 °C' } }
    ],
    bounds: { zh: '全部为仿真数字，不是实测或厂商数据。', en: 'Simulation figures only, not measured or vendor data.' },
    src: { zh: '方法来源 Du 等补充材料（Zenodo 22847809，CC-BY-4.0）。', en: 'Method from Du et al. supplementary material (Zenodo 22847809, CC-BY-4.0).' }
  },
  {
    id: '018', ind: ['motors'], prod: ['sensor'], ev: 'public', img: 'case-motor', clip: 'motor',
    title: { zh: '磁钢难以直接测温，AI 能当传感器吗？', en: 'Magnets are hard to measure directly: can AI be the sensor?' },
    tag: { zh: '永磁同步电机 · PINN', en: 'PMSM · PINN' },
    problem: { zh: '转子在转，磁钢难以直接测温；过热会不可逆退磁，只能提前降额。', en: 'The rotor spins, so direct sensing on the magnets is difficult; overheating demagnetises them, so drives derate early.' },
    did: { zh: '用帕德博恩大学公开台架数据（185 h，CC BY-SA 4.0），自写 4 节点热网络、前馈网络与 PINN，只用控制器已有信号。', en: 'On the public Paderborn bench dataset (185 h, CC BY-SA 4.0) we wrote a 4-node thermal network, a feed-forward network and a PINN, using only controller signals.' },
    m: [
      { v: '6.0 → 2.3 K', l: { zh: '磁钢平均误差：热网络 vs PINN', en: 'magnet mean error: thermal network vs PINN' }, c: { zh: '3 段留出台架工况（8.9 h），只给初始温度', en: '3 held-out bench profiles (8.9 h), initial temperature only' } }
    ],
    bounds: { zh: '只对数据集中这台样机负责；新设计要补台架数据并重训。', en: 'Valid for the dataset’s prototype only; a new design needs its own bench data.' },
    src: { zh: '数据：Kirchgässner 等，Paderborn University；方法参考 Bohwalli 等 2026；每次更新 21.5 µs（笔记本 CPU）。', en: 'Data: Kirchgässner et al., Paderborn University; method after Bohwalli et al. 2026; 21.5 µs per update (laptop CPU).' }
  },
  {
    id: '051', ind: ['motors', 'drives'], prod: ['sensor', 'design'], ev: 'model', img: 'case-robotdog', clip: 'robotdog',
    title: { zh: '机器狗膝关节发烫：换姿态，而不是降速', en: 'Hot robot knees: change posture, not speed' },
    tag: { zh: '机器人关节电机', en: 'Robot joint motors' },
    problem: { zh: '自建仿真里，负重行走的膝关节电机会过温停机。', en: 'In our simulation, loaded knee motors overheat and stop.' },
    did: { zh: '自建 14 节点整机热网络与步态扭矩模型，在常规步态上叠加看电机温度的残差策略。', en: 'A self-built 14-node thermal network and gait-torque model; a residual policy watching motor temperature sits on the normal gait.' },
    m: [
      { v: '483 → 1,439 m', l: { zh: '30 分钟平均行走距离', en: 'mean distance in 30 min' }, c: { zh: '120 个随机仿真场景；约七成好处来自一个固定姿态', en: '120 random simulated scenarios; ≈70 % of the gain from one fixed posture' } }
    ],
    bounds: { zh: '自建仿真，不是实机验证；负重 7 kg 时策略反而过温。', en: 'Self-built simulation, not a real-robot test; at 7 kg the policy overheated.' },
    src: { zh: '思路参考 arXiv 2605.27046；参数只对准一个公开实验点。', en: 'Idea after arXiv 2605.27046; parameters matched to a single published data point.' }
  }
];

/* Library-only entries (in the 48-case inventory; copy not reviewed yet). */
NT.listOnly = [
  { id: '002', ind: ['motors'], t: { zh: '电机热仿真早期短片', en: 'Early motor thermal film' } },
  { id: '039', ind: ['cooling'], t: { zh: '芯片微流道：怎么造（公开资料综述）', en: 'Chip microchannels: how they are made (public-source review)' }, ev: 'paper' },
  { id: '013', ind: ['cooling'], t: { zh: '散热器 PINN 与算子短片', en: 'Heat-sink PINN and operator films' } },
  { id: '032', ind: ['packaging'], t: { zh: '热布局代理模型', en: 'Thermal layout surrogate' } },
  { id: '037', ind: ['packaging'], t: { zh: 'GPU 上堆叠 DRAM（MOSAIC）', en: 'DRAM stacked on a GPU (MOSAIC)' } },
  { id: '059', ind: ['packaging'], t: { zh: '先进封装实验室（原型）', en: 'Advanced packaging lab (prototype)' } },
  { id: '044', ind: ['extended'], t: { zh: '卫星热网络', en: 'Satellite thermal network' } },
  { id: '046', ind: ['extended'], t: { zh: '稀疏传感器温度场重建', en: 'Field reconstruction from sparse sensors' } },
  { id: '047', ind: ['extended'], t: { zh: '月球车网格与热', en: 'Lunar rover mesh and heat' } },
  { id: '052', ind: ['extended'], t: { zh: 'GPU 计数器估温', en: 'GPU temperature from counters' } },
  { id: '053', ind: ['extended'], t: { zh: '电池挤压预警', en: 'Battery crush warning' } },
  { id: '054', ind: ['extended'], t: { zh: '激光熔池', en: 'Laser melt pool' } },
  { id: '055', ind: ['extended'], t: { zh: '快充电芯内部温度', en: 'Cell core temperature in fast charge' } },
  { id: '056', ind: ['extended'], t: { zh: '火箭燃烧室冷却', en: 'Rocket chamber cooling' } },
  { id: '065', ind: ['extended'], t: { zh: '在轨算力散热器', en: 'Orbital compute radiator' } }
];

NT.resources = [
  { id: '003', t: { zh: '卷积网络可视化', en: 'Convolutional networks, visualised' } },
  { id: '014', t: { zh: 'KV Cache 讲解', en: 'KV cache explained' } },
  { id: '029', t: { zh: '前馈网络（FFN）讲解', en: 'Feed-forward networks explained' } },
  { id: '030', t: { zh: 'ViT 讲解', en: 'Vision Transformer explained' } },
  { id: '034', t: { zh: '注意力论文导读', en: 'Reading the attention paper' } },
  { id: '035', t: { zh: '流形讲解', en: 'Manifolds explained' } },
  { id: '036', t: { zh: '设计出来的 vs 学出来的', en: 'Designed vs learned' } }
];

/* Industries: one statement, selected evidence (each problem → one case; problem ids are ad deep links), one CTA. */
NT.industries = [
  {
    id: 'packaging', color: 'ai', img: 'case-cpo', clip: 'cpo',
    name: { zh: '封装', en: 'Advanced Packaging' },
    long: { zh: '先进封装热设计', en: 'Advanced packaging thermal design' },
    head: { zh: '芯粒、HBM、光引擎同在一个封装里。先算清谁最先超限。', en: 'Chiplets, HBM and optics share one package. Find which one hits its limit first.' },
    problems: [
      { id: 'hbm', t: { zh: 'HBM 内部温升，每换一组功耗就要重算', en: 'HBM temperature rise needs a new solve for every power map' }, p: 'design', c: '060' },
      { id: 'placement', t: { zh: '芯粒放法太多，来不及逐个仿真', en: 'Too many chiplet placements to simulate' }, p: 'design', c: '061' },
      { id: 'cpo', t: { zh: '几种芯片上限不同，冷却卡在谁身上', en: 'Different chip limits: which one sets the cooling' }, p: 'design', c: '064' },
      { id: 'trust', t: { zh: '代理模型何时不可信、何时交回求解器', en: 'When to stop trusting a surrogate' }, p: 'workflow', c: '033' }
    ],
    note: { zh: '盖板、硅微冷却器、内嵌微流道三项为设计示范，见液冷。', en: 'Lid, silicon microcooler and embedded microchannel cases are design demos; see Liquid Cooling.' },
    tool: 'h100', cta: { zh: '用您的封装做一个小试点', en: 'Pilot it on your package' }, links: ['cooling']
  },
  {
    id: 'cooling', color: 'cool', img: 'case-gb200', clip: 'h100',
    name: { zh: '液冷', en: 'Liquid Cooling' },
    long: { zh: '液冷与冷板设计', en: 'Liquid cooling and cold plates' },
    head: { zh: '流量、压降和温度互相牵制。在约定参数范围内，先扫一遍再定方案。', en: 'Flow, pressure drop and temperature trade off. Sweep the agreed parameter range before you commit.' },
    problems: [
      { id: 'flow', t: { zh: '流量下降或水温升高时，芯片哪里先热', en: 'Where the die heats first when flow drops or water warms' }, p: 'sensor', c: '015' },
      { id: 'channels', t: { zh: '直流道压不住热点，新流道每版都要再算', en: 'Straight channels leave hot spots; every new layout needs a run' }, p: 'design', c: '021' },
      { id: 'ceiling', t: { zh: '功耗再涨，现有冷板还能撑多少 kW', en: 'How many kW the current plate can take' }, p: 'design', c: '066' },
      { id: 'battery', t: { zh: '电池冷板温差大、泵压降高', en: 'Battery plates with large cell spread' }, p: 'design', c: '027' }
    ],
    note: { zh: '微流道盖板、硅微冷却器、内嵌微流道是设计示范，我们不制造或供货。风冷散热器工具属于跨行业工具，不归为液冷。', en: 'Microchannel lids, silicon microcoolers and embedded microchannels are design demos; we do not manufacture or supply them. The air-cooled heat-sink tool is cross-industry, not liquid cooling.' },
    tool: 'h100', cta: { zh: '用您的冷板做一个小试点', en: 'Pilot it on your cold plate' }, links: ['packaging', 'drives']
  },
  {
    id: 'drives', color: 'thermal', img: 'render-ev-ctrl', clip: null,
    name: { zh: '电驱', en: 'Power Electronics & Drives' },
    long: { zh: '逆变器、控制器与功率模块', en: 'Inverters, controllers and power modules' },
    head: { zh: '模块内测点有限，各芯片结温难以直接测到。用已有测点估算每颗结温。', en: 'Modules have few sensors, so individual junctions are hard to measure. Estimate each one from the sensors you have.' },
    problems: [
      { id: 'junction', t: { zh: '多芯片模块的各芯片结温', en: 'Junction temperature of each die in a multi-die module' }, p: 'sensor', c: '020' },
      { id: 'hottest', t: { zh: '并联芯片发热不均，热电偶未必在最热处', en: 'Uneven paralleled dies; thermocouples may miss the hottest' }, p: 'sensor', c: '058' },
      { id: 'jet', t: { zh: '冷却方案换了尺寸，代理模型还准不准', en: 'Is the surrogate still right after a cooling change?' }, p: 'design', c: '045' }
    ],
    note: { zh: '本页讲控制器与功率器件；电机本体见电机页。PCS、OBC 为待评估方向，目前没有专门项目。', en: 'This page covers controllers and power devices; the machine itself is on Electric Motors. PCS and OBC are under evaluation, with no dedicated project yet.' },
    tool: 'heatsink', cta: { zh: '用您的模块数据做一个小试点', en: 'Pilot it on your module data' }, links: ['motors', 'cooling']
  },
  {
    id: 'motors', color: 'blue', img: 'case-motor', clip: 'motor',
    name: { zh: '电机', en: 'Electric Motors' },
    long: { zh: '电机与机器人关节', en: 'Motors and robot joints' },
    head: { zh: '磁钢和转子难以直接测温。用控制器已有的信号，把温度估出来。', en: 'Direct temperature sensing on magnets and rotors is difficult. Estimate it from signals the controller already has.' },
    problems: [
      { id: 'magnet', t: { zh: '磁钢温度难以直接测量，只能提前降额', en: 'Magnet temperature is hard to measure, so drives derate early' }, p: 'sensor', c: '018' },
      { id: 'joint', t: { zh: '关节电机的热限制持续力矩', en: 'Joint-motor heat limits continuous torque' }, p: 'design', c: '051' }
    ],
    note: { zh: '控制器与功率模块的结温见电驱页。', en: 'Controller and power-module junctions are on Power Electronics & Drives.' },
    tool: 'heatsink', cta: { zh: '用您的台架数据做一个小试点', en: 'Pilot it on your bench data' }, links: ['drives']
  }
];

NT.steps = [
  { t: { zh: '需求与数据评估', en: 'Needs and data review' } },
  { t: { zh: '约定试点与验收', en: 'Agree pilot and acceptance' } },
  { t: { zh: '样本、模型、复核', en: 'Samples, model, re-check' } },
  { t: { zh: '工具或部署交付', en: 'Tool or deployment' } },
  { t: { zh: '更新与维护', en: 'Updates and maintenance' } }
];

NT.tiers = [
  { t: { zh: '结果报告', en: 'Result report' }, d: { zh: '结论、误差与适用范围。', en: 'Conclusions, errors, valid range.' } },
  { t: { zh: '交互工具', en: 'Interactive tool' }, d: { zh: '像 H100 实验室，换成您的产品。', en: 'Like the H100 lab, on your product.' } },
  { t: { zh: '本地部署', en: 'On-premises' }, d: { zh: '装进您的内网，数据不出公司。', en: 'In your network; data stays in-house.' } },
  { t: { zh: '方法迁移', en: 'Method transfer' }, d: { zh: '整套流程与培训。', en: 'The full pipeline and training.' } }
];

/* NeuralThermal review site · app (v3). Hash routes so every page deep-links from file:// (index.html?lang=en#/industries/motors).
   Language: per-tab override (set by the switch) > ?lang= > saved manual choice > trusted region hint (online only) >
   browser language / locale region > English. No scroll animations (v3 brief: no unnecessary animation). */
(function () {
  var NT = window.NT;
  var EMAIL = 'tech@neuralthermal.com';
  var BUILD = '2026-10-26';

  // ------------------------------------------------------------------ language
  var ZH_REGIONS = /^(cn|hk|mo|tw)$/;
  function storage(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function session(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; }
  }
  function valid(l) { return l === 'zh' || l === 'en' ? l : null; }
  function detect() {
    var q = valid(new URLSearchParams(location.search).get('lang'));
    var s = valid(session('nt-lang-tab'));
    if (s) return { lang: s, why: 'manual' };
    if (q) return { lang: q, why: 'url' };
    var m = valid(storage('nt-lang'));
    if (m) return { lang: m, why: 'manual' };
    // Online deployments may fill <meta name="nt-geo-country"> from a trusted edge header. Empty in this local build.
    var geo = (document.querySelector('meta[name="nt-geo-country"]') || {}).content;
    if (geo) return { lang: ZH_REGIONS.test(geo.toLowerCase()) ? 'zh' : 'en', why: 'region' };
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    var first = String(list[0]).toLowerCase();
    var region = first.split('-')[1] || '';
    return { lang: first.indexOf('zh') === 0 || ZH_REGIONS.test(region) ? 'zh' : 'en', why: 'browser' };
  }
  var L = detect();
  var lang = L.lang;
  function t(o) { return o == null ? '' : typeof o === 'string' ? o : o[lang] != null ? o[lang] : o.zh; }
  function setLang(l) {
    lang = l;
    L = { lang: l, why: 'manual' };
    storage('nt-lang', l);
    session('nt-lang-tab', l);
    try {
      var u = new URL(location.href);
      u.searchParams.set('lang', l);
      history.replaceState(null, '', u.href);
    } catch (e) { /* some browsers refuse replaceState on file://; the tab override above still applies */ }
    render();
  }
  var fmtDate = function (iso) {
    return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso + 'T12:00:00'));
  };

  // ------------------------------------------------------------------ UI strings
  var U = {
    nav: { products: { zh: '产品', en: 'Products' }, industries: { zh: '行业', en: 'Industries' }, cases: { zh: '案例与演示', en: 'Cases & demos' }, engage: { zh: '合作方式', en: 'How we work' }, about: { zh: '关于', en: 'About' } },
    contact: { zh: '联系', en: 'Contact' },
    menu: { zh: '菜单', en: 'Menu' },
    switchTo: { zh: 'EN', en: '中文' },
    switchLabel: { zh: 'Switch to English', en: '切换到中文' },
    home: { zh: '首页', en: 'Home' },
    heroTitle: { zh: '把仿真和测试数据，<br>变成可反复使用的<br>热设计工具。', en: 'Turn simulation and test data<br>into thermal tools you can reuse.' },
    heroSub: { zh: 'AI 热设计 · 虚拟温度传感 · 工程自动化', en: 'AI thermal design · virtual temperature sensing · engineering automation' },
    heroCta: { zh: '选择行业', en: 'Choose your industry' },
    heroTool: { zh: '试用 H100 实验室', en: 'Try the H100 lab' },
    heroCap: { zh: '示意几何；芯片温度为自建三维模型的稳态计算结果。', en: 'Illustrative geometry; die temperature is a steady-state result of our 3-D model.' },
    s1: { zh: '四个行业', en: 'Four industries' },
    s2: { zh: '三条产品线', en: 'Three product lines' },
    s3: { zh: '证据', en: 'Evidence' },
    s4: { zh: '可以直接试用的工具', en: 'Tools you can try' },
    s5: { zh: '合作方式', en: 'How we work' },
    s5h: { zh: '先做付费小试点，再做完整工具。', en: 'A small paid pilot first, the full tool after.' },
    ctaH: { zh: '有一个具体的热问题？', en: 'Have a specific thermal problem?' },
    ctaP: { zh: '先发一段非敏感摘要：产品类型、想回答的问题、已有数据。', en: 'Send a short, non-sensitive summary: product type, the question, the data you have.' },
    writeUs: { zh: '写信给我们', en: 'Write to us' },
    more: { zh: '查看', en: 'View' },
    allCases: { zh: '全部案例', en: 'All cases' },
    moreHere: { zh: '本行业全部案例', en: 'All cases in this industry' },
    evidence: { zh: '证据类型', en: 'Evidence' },
    problem: { zh: '问题', en: 'The problem' },
    results: { zh: '结果', en: 'Results' },
    bounds: { zh: '适用边界', en: 'Limits' },
    method: { zh: '方法与来源', en: 'Method and sources' },
    research: { zh: '设计示范，非供货能力', en: 'Design demo, not a supply capability' },
    products: { zh: '相关产品', en: 'Products' },
    tool: { zh: '可以试用', en: 'Try it' },
    open: { zh: '打开工具', en: 'Open tool' },
    clip: { zh: '播放视频摘录', en: 'Play film excerpt' },
    clipNote: { zh: '视频摘录 · 无声 · 点击后加载', en: 'Film excerpt · silent · loads on click' },
    inputs: { zh: '输入', en: 'Inputs' },
    outputs: { zh: '输出', en: 'Outputs' },
    deliver: { zh: '交付', en: 'Deliverables' },
    pilot: { zh: '试点', en: 'Pilot' },
    cases: { zh: '案例', en: 'Cases' },
    filters: { zh: '筛选', en: 'Filter' },
    all: { zh: '全部', en: 'All' },
    extended: { zh: '拓展案例', en: 'Other fields' },
    search: { zh: '搜索编号或关键词', en: 'Search number or keyword' },
    noMatch: { zh: '没有符合条件的案例。', en: 'No cases match.' },
    pending: { zh: '目录项 · 待审核', en: 'Index entry · pending review' },
    count: { zh: '共 {n} 项', en: '{n} entries' },
    libTitle: { zh: '案例库', en: 'Case library' },
    libLead: { zh: '公开资料、公开数据或自建模型上的复现与示范；不是客户交付业绩。', en: 'Reproductions and demos on published work, public data or self-built models; not customer deliveries.' },
    toolsTitle: { zh: '交互工具', en: 'Interactive tools' },
    toolsLead: { zh: '在浏览器里实时计算，可离线打开。', en: 'Live calculation in your browser, offline.' },
    resTitle: { zh: '技术资源', en: 'Technical resources' },
    resLead: { zh: '讲 AI 方法本身的短片，不是案例。', en: 'Short films on the methods themselves; not cases.' },
    notFound: { zh: '没有这个页面', en: 'Page not found' },
    back: { zh: '回到首页', en: 'Back to home' },
    footNote: { zh: '', en: '' },
    footBuild: { zh: '版本日期', en: 'Build date' },
    skip: { zh: '跳到正文', en: 'Skip to content' }
  };
  function u(k) { return t(U[k]); }
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var img = function (name, alt, cls, eager) {
    return '<img class="' + (cls || '') + '" src="assets/img/' + name + '.jpg" alt="' + esc(alt) + '"' + (eager ? ' fetchpriority="high"' : '') + '>';
  };
  var link = function (path) { return '#/' + path; };
  var caseById = function (id) { return NT.cases.filter(function (c) { return c.id === id; })[0]; };
  var indById = function (id) { return NT.industries.filter(function (i) { return i.id === id; })[0]; };
  var prodById = function (id) { return NT.products.filter(function (p) { return p.id === id; })[0]; };
  var evBadge = function (ev) { return ev ? '<span class="badge ev-' + ev + '">' + t(NT.evidence[ev]) + '</span>' : ''; };
  var researchBadge = function (c) { return c.research ? '<span class="badge warn">' + u('research') + '</span>' : ''; };
  var label = function (n, s) { return '<p class="label">' + (n ? '<span class="n">' + n + '</span>' : '') + s + '</p>'; };
  var list = function (arr) { return '<ul class="ticks">' + arr.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; };
  var toolHref = function (id) { return 'tools/' + id + '/index.html?lang=' + lang; };

  var ZH_CLIPS = ['cpo', 'mi300x'];   // excerpts that also exist from the Chinese film
  function clip(name, poster, alt) {
    if (lang === 'zh' && ZH_CLIPS.indexOf(name) >= 0) { name += '-zh'; poster += '-zh'; }
    return '<figure class="clip" data-clip="' + name + '">' + img(poster, alt) +
      '<button class="play" type="button" aria-label="' + esc(u('clip') + ' · ' + alt) + '"><span aria-hidden="true">▶</span>' + u('clip') + '</button>' +
      '<figcaption>' + u('clipNote') + '</figcaption></figure>';
  }

  // Number + label + condition, always shown together.
  function metric(m, big) {
    return '<div class="metric' + (big ? ' big' : '') + '"><b>' + m.v + '</b><span class="ml">' + t(m.l) + '</span>' +
      (m.c ? '<span class="mc">' + t(m.c) + '</span>' : '') + '</div>';
  }

  // Storyboard row: text column + large picture, alternating sides.
  function story(o) {
    return '<section class="story' + (o.flip ? ' flip' : '') + (o.pic ? '' : ' nopic') + '"' + (o.id ? ' id="' + o.id + '"' : '') + '>' +
      '<div class="story-text">' + (o.label || '') + '<h3>' + o.title + '</h3>' + (o.body ? '<p class="body">' + o.body + '</p>' : '') +
      (o.metric ? metric(o.metric, true) : '') + (o.after || '') + '</div>' +
      (o.pic ? '<div class="story-pic">' + o.pic + '</div>' : '') + '</section>';
  }

  function casePic(c, eager) { return c.clip ? clip(c.clip, 'poster-' + c.clip, t(c.title)) : c.img ? img(c.img, t(c.title), 'shot', eager) : ''; }
  function evLine(c, extra) {
    return '<p class="ev-line">' + evBadge(c.ev) + researchBadge(c) + (extra || '') + '<a class="more" href="' + link('cases/' + c.id) + '">' + u('more') + ' ' + c.id + ' →</a></p>';
  }

  // ------------------------------------------------------------------ pages
  function home() {
    var inds = NT.industries.map(function (ind) {
      return '<a class="ind-tile c-' + ind.color + '" href="' + link('industries/' + ind.id) + '">' +
        '<div class="ind-pic">' + img(ind.img, t(ind.long)) + '</div>' +
        '<div class="ind-body"><h3>' + t(ind.name) + '</h3><p>' + t(ind.head) + '</p><span class="more">' + u('more') + ' →</span></div></a>';
    }).join('');
    var prods = NT.products.map(function (p) {
      return '<a class="prod-row c-' + p.color + '" href="' + link('products/' + p.id) + '"><span class="prod-code">' + p.code + '</span>' +
        '<h3>' + t(p.name) + '</h3><p>' + t(p.line) + '</p></a>';
    }).join('');
    var picks = ['064', '018'].map(function (id, i) {
      var c = caseById(id);
      return story({ label: label('', t(c.tag)), title: t(c.title), metric: c.m[0], flip: i % 2 === 1, after: evLine(c), pic: img(c.img, t(c.title), 'shot') });
    }).join('');
    return '<section class="hero"><div class="wrap hero-in">' +
      '<div class="hero-text"><h1>' + u('heroTitle') + '</h1><p class="sub">' + u('heroSub') + '</p>' +
      '<div class="actions"><a class="btn primary" href="#industries">' + u('heroCta') + '</a>' +
      '<a class="btn ghost" href="' + toolHref('h100') + '">' + u('heroTool') + '</a></div></div>' +
      '<figure class="hero-pic">' + img('case-h100', u('heroCap'), '', true) + '<figcaption>' + u('heroCap') + '</figcaption></figure></div></section>' +
      '<section class="band" id="industries"><div class="wrap">' + label('01', u('s1')) + '<div class="ind-grid">' + inds + '</div></div></section>' +
      '<section class="band alt"><div class="wrap">' + label('02', u('s2')) + '<div class="prod-list">' + prods + '</div></div></section>' +
      '<section class="band"><div class="wrap">' + label('03', u('s3')) + picks +
      '<p class="center"><a class="btn ghost" href="' + link('cases') + '">' + u('allCases') + ' →</a></p></div></section>' +
      '<section class="band alt"><div class="wrap">' + label('04', u('s4')) + toolPanels() + '</div></section>' +
      '<section class="band"><div class="wrap">' + label('05', u('s5')) + '<h2>' + u('s5h') + '</h2>' + flow() +
      '<p class="center"><a class="btn ghost" href="' + link('engage') + '">' + t(U.nav.engage) + ' →</a></p></div></section>' +
      cta();
  }

  var TOOLS = [
    { id: 'h100', img: 'tool-h100',
      name: { zh: 'H100 液冷实验室', en: 'H100 liquid-cooling lab' },
      d: { zh: '拖动功耗、流量和进液温度，实时看整颗芯片的稳态温度场，并对比物理求解。', en: 'Drag power, flow and inlet temperature; see the die’s steady-state field live and compare it with the physics solve.' },
      scope: { zh: '公开简化模型；不含客户数据，不含训练代码与训练数据。', en: 'Public simplified model; no customer data, no training code or data.' } },
    { id: 'heatsink', img: 'tool-heatsink',
      name: { zh: '散热器设计工具', en: 'Heat-sink design lab' },
      d: { zh: '选器件，改散热器与风扇，看结温、热阻、压降和重量。', en: 'Pick a device, change heat sink and fan, read junction temperature, resistance, pressure drop and mass.' },
      scope: { zh: '风冷，基于公开工程关联式；跨行业工具。', en: 'Air cooling on published correlations; cross-industry.' } }
  ];
  function toolPanels(only) {
    return TOOLS.filter(function (x) { return !only || only.indexOf(x.id) >= 0; }).map(function (x, i) {
      return '<div class="tool' + (i % 2 ? ' flip' : '') + '"><a class="tool-shot" href="' + toolHref(x.id) + '" aria-label="' + esc(t(x.name)) + '">' + img(x.img, t(x.name)) + '</a>' +
        '<div class="tool-text"><h3>' + t(x.name) + '</h3><p>' + t(x.d) + '</p><p class="scope-note">' + t(x.scope) + '</p>' +
        '<a class="btn primary" href="' + toolHref(x.id) + '">' + u('open') + ' →</a></div></div>';
    }).join('');
  }

  function flow() {
    return '<ol class="flow">' + NT.steps.map(function (s, i) { return '<li><span class="node">' + (i + 1) + '</span><b>' + t(s.t) + '</b></li>'; }).join('') + '</ol>';
  }

  function cta(text) {
    return '<section class="cta"><div class="wrap cta-in"><div><h2>' + (text || u('ctaH')) + '</h2><p>' + u('ctaP') + '</p></div>' +
      '<a class="btn primary" href="' + link('contact') + '">' + u('writeUs') + ' →</a></div></section>';
  }

  function pageHead(title, lead, crumbs) {
    return '<header class="page-head"><div class="wrap">' + (crumbs ? '<nav class="crumbs" aria-label="breadcrumb">' + crumbs + '</nav>' : '') +
      '<h1>' + title + '</h1>' + (lead ? '<p class="lead">' + lead + '</p>' : '') + '</div></header>';
  }

  function industriesIndex() {
    return pageHead(t(U.nav.industries), null) + '<section class="band"><div class="wrap"><div class="ind-grid">' + NT.industries.map(function (ind) {
      return '<a class="ind-tile c-' + ind.color + '" href="' + link('industries/' + ind.id) + '"><div class="ind-pic">' + img(ind.img, t(ind.long)) + '</div>' +
        '<div class="ind-body"><h3>' + t(ind.name) + '</h3><p>' + t(ind.head) + '</p><span class="more">' + u('more') + ' →</span></div></a>';
    }).join('') + '</div></div></section>' + cta();
  }

  function industry(ind, focus) {
    var tabs = '<nav class="ind-tabs" aria-label="' + esc(t(U.nav.industries)) + '">' + NT.industries.map(function (x) {
      return '<a href="' + link('industries/' + x.id) + '"' + (x.id === ind.id ? ' aria-current="page"' : '') + '>' + t(x.name) + '</a>';
    }).join('') + '</nav>';
    var rows = ind.problems.map(function (p, i) {
      var c = caseById(p.c), pr = prodById(p.p);
      return story({ id: 'p-' + p.id, label: label('0' + (i + 1), t(p.t)), title: t(c.title), metric: c.m[0], flip: i % 2 === 1,
        after: evLine(c, '<a class="badge prod c-' + pr.color + '" href="' + link('products/' + pr.id) + '">' + pr.code + '</a>'),
        pic: c.img ? img(c.img, t(c.title), 'shot') : '' }).replace('class="story', 'class="story' + (focus === p.id ? ' focus' : ''));
    }).join('');
    return '<header class="ind-hero c-' + ind.color + '"><div class="wrap ind-hero-in"><div>' +
      '<nav class="crumbs"><a href="#/">' + u('home') + '</a> / <a href="' + link('industries') + '">' + t(U.nav.industries) + '</a></nav>' +
      '<h1>' + t(ind.long) + '</h1><p class="lead">' + t(ind.head) + '</p></div>' +
      '<div class="ind-hero-pic">' + (ind.clip ? clip(ind.clip, 'poster-' + ind.clip, t(ind.long)) : img(ind.img, t(ind.long), '', true)) + '</div></div>' +
      '<div class="wrap">' + tabs + '</div></header>' +
      '<section class="band"><div class="wrap">' + label('', u('s3')) + rows +
      '<p class="note">' + t(ind.note) + '</p><p class="related"><a href="' + link('cases?ind=' + ind.id) + '">' + u('moreHere') + ' →</a>' +
      ind.links.map(function (id) { var x = indById(id); return '<a href="' + link('industries/' + x.id) + '">' + t(x.name) + ' →</a>'; }).join('') + '</p></div></section>' +
      '<section class="band alt"><div class="wrap">' + label('', u('tool')) + toolPanels([ind.tool]) + '</div></section>' + cta(t(ind.cta));
  }

  function caseRow(c, compact) {
    if (compact) return '<li class="case-row compact"><a href="' + link('cases/' + c.id) + '"><span class="cid">' + c.id + '</span><h3>' + t(c.title) + '</h3>' +
      '<p class="m"><b>' + c.m[0].v + '</b> ' + t(c.m[0].l) + '</p>' + evBadge(c.ev) + '</a></li>';
    return '<li class="case-row"><a href="' + link('cases/' + c.id) + '">' +
      (c.img ? img(c.img, '', 'thumb') : '<span class="thumb ph c-' + indById(c.ind[0]).color + '">' + c.id + '</span>') +
      '<div><p class="code">' + c.id + ' · ' + t(c.tag) + '</p><h3>' + t(c.title) + '</h3><p class="m"><b>' + c.m[0].v + '</b> ' + t(c.m[0].l) + '</p>' +
      '<p class="ev-line">' + evBadge(c.ev) + researchBadge(c) + c.ind.map(function (i) { return '<span class="badge">' + t(indById(i).name) + '</span>'; }).join('') + '</p></div></a></li>';
  }

  function products() {
    return pageHead(t(U.nav.products), { zh: '三条产品线，跨四个行业复用。', en: 'Three product lines, reused across four industries.' }[lang]) +
      '<section class="band"><div class="wrap"><div class="prod-list">' + NT.products.map(function (p) {
        return '<a class="prod-row c-' + p.color + '" href="' + link('products/' + p.id) + '"><span class="prod-code">' + p.code + '</span><h3>' + t(p.name) + '</h3><p>' + t(p.line) + '</p></a>';
      }).join('') + '</div></div></section>' + cta();
  }

  function product(p) {
    return pageHead(t(p.name), t(p.line), '<a href="#/">' + u('home') + '</a> / <a href="' + link('products') + '">' + t(U.nav.products) + '</a> / ' + p.code) +
      '<section class="band"><div class="wrap">' +
      '<p class="big-p">' + t(p.problem) + '</p>' +
      '<div class="io"><div>' + label('', u('inputs')) + list(t(p.inputs)) + '</div><div class="arrow" aria-hidden="true">→</div><div>' + label('', u('outputs')) + list(t(p.outputs)) + '</div></div>' +
      '<div class="two"><div>' + label('', u('deliver')) + list(t(p.deliver)) + '</div><div class="bounds-box">' + label('', u('bounds')) + list(t(p.bounds)) + '</div></div>' +
      '<div class="pilot">' + label('', u('pilot')) + '<p class="big-p">' + t(p.pilot) + '</p></div>' +
      label('', u('cases')) + '<ul class="case-rows">' + p.cases.slice(0, 3).map(function (id) { return caseRow(caseById(id), true); }).join('') + '</ul>' +
      '<p class="related"><a href="' + link('cases') + '">' + u('allCases') + ' →</a></p>' +
      '</div></section>' + cta();
  }

  var filt = { ind: 'all', prod: 'all', ev: 'all', q: '' };
  function cases(query) {
    var qi = new URLSearchParams(query || '').get('ind');
    if (qi && (indById(qi) || qi === 'extended')) filt.ind = qi;
    var chip = function (group, val, text) {
      return '<button type="button" class="chip" data-g="' + group + '" data-v="' + val + '" aria-pressed="' + (filt[group] === val) + '">' + text + '</button>';
    };
    var g = function (title, group, opts) {
      return '<div class="fgroup" role="group" aria-label="' + esc(title) + '"><span>' + title + '</span>' + chip(group, 'all', u('all')) + opts.map(function (o) { return chip(group, o[0], o[1]); }).join('') + '</div>';
    };
    return pageHead(u('libTitle'), u('libLead')) +
      '<section class="band"><div class="wrap"><div class="filters">' +
      g(t(U.nav.industries), 'ind', NT.industries.map(function (i) { return [i.id, t(i.name)]; }).concat([['extended', u('extended')]])) +
      g(t(U.nav.products), 'prod', NT.products.map(function (p) { return [p.id, p.code]; })) +
      g(u('evidence'), 'ev', Object.keys(NT.evidence).map(function (k) { return [k, t(NT.evidence[k])]; })) +
      '<label class="search"><span class="vh">' + u('search') + '</span><input id="q" type="search" placeholder="' + esc(u('search')) + '" value="' + esc(filt.q) + '"></label></div>' +
      '<p class="count" id="count" aria-live="polite"></p><ul class="case-rows" id="lib"></ul></div></section>' +
      '<section class="band alt"><div class="wrap">' + label('', u('toolsTitle')) + toolPanels() + '</div></section>' + cta();
  }
  function fillLibrary() {
    var lib = document.getElementById('lib');
    if (!lib) return;
    var q = filt.q.trim().toLowerCase();
    var hit = function (id, txt) { return !q || id.indexOf(q) >= 0 || txt.toLowerCase().indexOf(q) >= 0; };
    var rows = NT.cases.filter(function (c) {
      return (filt.ind === 'all' || c.ind.indexOf(filt.ind) >= 0) && (filt.prod === 'all' || c.prod.indexOf(filt.prod) >= 0) &&
        (filt.ev === 'all' || c.ev === filt.ev) && hit(c.id, [c.title.zh, c.title.en, c.tag.zh, c.tag.en].join(' '));
    }).map(caseRow);
    var extra = NT.listOnly.filter(function (c) {
      return (filt.ind === 'all' || c.ind.indexOf(filt.ind) >= 0) && filt.prod === 'all' && (filt.ev === 'all' || c.ev === filt.ev) && hit(c.id, c.t.zh + ' ' + c.t.en);
    }).map(function (c) {
      return '<li class="case-row idx"><span class="thumb ph">' + c.id + '</span><div><h3>' + t(c.t) + '</h3><p class="ev-line">' +
        evBadge(c.ev) + '<span class="badge muted">' + u('pending') + '</span></p></div></li>';
    });
    lib.innerHTML = rows.concat(extra).join('') || '<li class="empty">' + u('noMatch') + '</li>';
    document.getElementById('count').textContent = u('count').replace('{n}', rows.length + extra.length);
  }

  function caseDetail(c) {
    var inds = c.ind.map(function (i) { var x = indById(i); return '<a class="badge" href="' + link('industries/' + x.id) + '">' + t(x.name) + '</a>'; }).join('');
    var prods = c.prod.map(function (id) { var p = prodById(id); return '<a class="badge prod c-' + p.color + '" href="' + link('products/' + p.id) + '">' + p.code + '</a>'; }).join('');
    var pic = casePic(c, true);
    return '<header class="page-head case-head"><div class="wrap' + (pic ? ' case-head-in' : '') + '"><div>' +
      '<nav class="crumbs"><a href="#/">' + u('home') + '</a> / <a href="' + link('cases') + '">' + u('libTitle') + '</a> / ' + c.id + '</nav>' +
      '<p class="label">' + t(c.tag) + '</p><h1>' + t(c.title) + '</h1>' +
      '<p class="ev-line">' + evBadge(c.ev) + researchBadge(c) + inds + prods + '</p></div>' +
      (pic ? '<div class="case-pic">' + pic + '</div>' : '') + '</div></header>' +
      '<section class="band"><div class="wrap case-body">' +
      '<p class="big-p">' + t(c.problem) + '</p>' +
      '<div class="cb">' + label('', u('results')) + '<div class="metrics">' + c.m.map(function (m) { return metric(m); }).join('') + '</div></div>' +
      '<div class="cb bounds-box">' + label('', u('bounds')) + '<p>' + t(c.bounds) + '</p></div>' +
      '<details class="cb more-info"><summary>' + u('method') + '</summary><p>' + t(c.did) + '</p><p class="src">' + t(c.src) + '</p></details>' +
      (c.tool ? '<p><a class="btn primary" href="' + toolHref(c.tool) + '">' + u('heroTool') + ' →</a></p>' : '') +
      '</div></section>' + cta();
  }

  function tools() {
    return pageHead(u('toolsTitle'), u('toolsLead')) + '<section class="band"><div class="wrap">' + toolPanels() + '</div></section>' + cta();
  }

  function engage() {
    var x = {
      zh: { lead: '先付费做一个范围清楚的小试点，验收通过再做完整工具。价格与授权按范围商议。', can: ['热仿真建模、批量数据与代理模型', '虚拟温度传感的离线验证与嵌入式评估', '交互工具、私有部署与重训'], need: ['问题描述与想回答的问题', '参数范围（不需要图纸）', '已有数据的类型和数量', '验收口径'] },
      en: { lead: 'Start with a small, paid, clearly scoped pilot; build the full tool once it passes. Pricing and licensing are agreed per scope.', can: ['Thermal models, batch data and surrogates', 'Offline validation and embedded assessment of virtual sensing', 'Interactive tools, private deployment, retraining'], need: ['The problem and the question', 'Parameter ranges (no drawings needed)', 'What data exists and how much', 'Acceptance criteria'] }
    }[lang];
    return pageHead(t(U.nav.engage), x.lead) +
      '<section class="band"><div class="wrap">' + flow() + '</div></section>' +
      '<section class="band alt"><div class="wrap">' + label('', u('deliver')) + '<div class="tiers">' + NT.tiers.map(function (y) {
        return '<div class="tier"><b>' + t(y.t) + '</b><p>' + t(y.d) + '</p></div>'; }).join('') + '</div></div></section>' +
      '<section class="band"><div class="wrap two"><div>' + label('', { zh: '试点需要', en: 'For a pilot' }[lang]) + list(x.need) + '</div>' +
      '<div>' + label('', { zh: '我们提供', en: 'What we offer' }[lang]) + list(x.can) + '</div></div></section>' + cta();
  }

  function about() {
    var x = {
      zh: {
        lead: 'NeuralThermal 将热仿真与 AI 融合，为研发团队构建更快的设计工具和更清晰的温度洞察。',
        scope: '业务范围',
        industries: [
          ['先进封装', 'Chiplet、HBM 与 CPO 的热点分析、布局评估和热耦合建模。', 'packaging'],
          ['液冷', 'GPU 冷却、冷板与微流道的温度、流量和压降权衡。', 'cooling'],
          ['电驱', '逆变器、控制器及功率模块的结温估计与冷却评估。', 'drives'],
          ['电机', '电机与机器人关节的温度估计、热负载分析和持续性能评估。', 'motors']
        ],
        ability: '核心能力',
        capabilities: [
          ['AI 辅助设计', '结合物理仿真与代理模型，快速筛选方案，复核关键设计。'],
          ['虚拟温度传感', '利用已有测点与运行信号，估计难以直接测量的内部温度。'],
          ['工程工具交付', '将模型、交互界面与自动化流程整合，支持私有部署和持续迭代。']
        ],
        value: '为客户创造的价值',
        values: [
          ['更快做出设计决策', '减少重复求解，在同样的研发时间内比较更多方案。'],
          ['更早发现热风险', '识别热点与冷却瓶颈，为设计取舍和测试安排提供依据。'],
          ['让数据持续产生价值', '把仿真和试验积累变成团队可反复使用的工程工具。']
        ]
      },
      en: {
        lead: 'NeuralThermal combines thermal simulation and AI to give engineering teams faster design tools and clearer insight into temperature.',
        scope: 'Where we work',
        industries: [
          ['Advanced packaging', 'Hotspot analysis, layout assessment and thermal coupling for Chiplets, HBM and CPO.', 'packaging'],
          ['Liquid cooling', 'Temperature, flow and pressure-drop trade-offs for GPUs, cold plates and microchannels.', 'cooling'],
          ['Electric drives', 'Junction-temperature estimation and cooling assessment for inverters, controllers and power modules.', 'drives'],
          ['Motors', 'Temperature estimation, thermal-load analysis and sustained-performance assessment for motors and robotic joints.', 'motors']
        ],
        ability: 'What we build',
        capabilities: [
          ['AI-assisted design', 'Combine physics simulation and surrogate models to screen options quickly and verify critical designs.'],
          ['Virtual temperature sensing', 'Use existing measurements and operating signals to estimate internal temperatures that are hard to measure directly.'],
          ['Engineering tools', 'Bring models, interactive interfaces and automated workflows together, with private deployment and ongoing refinement.']
        ],
        value: 'Value for your team',
        values: [
          ['Faster design decisions', 'Reduce repeated solves and compare more options within the same development time.'],
          ['Earlier insight into thermal risk', 'Identify hotspots and cooling bottlenecks to guide design trade-offs and test planning.'],
          ['Lasting value from your data', 'Turn simulation and test results into engineering tools your team can use repeatedly.']
        ]
      }
    }[lang];
    return pageHead(t(U.nav.about), x.lead) +
      '<section class="band"><div class="wrap">' + label('', x.scope) + '<div class="two">' + x.industries.map(function (i) {
        return '<div><h3><a href="' + link('industries/' + i[2]) + '">' + i[0] + ' →</a></h3><p>' + i[1] + '</p></div>';
      }).join('') + '</div></div></section>' +
      '<section class="band alt"><div class="wrap">' + label('', x.ability) + '<div class="tiers">' + x.capabilities.map(function (i) {
        return '<div class="tier"><h3>' + i[0] + '</h3><p>' + i[1] + '</p></div>';
      }).join('') + '</div></div></section>' +
      '<section class="band"><div class="wrap">' + label('', x.value) + '<div class="tiers">' + x.values.map(function (i) {
        return '<div class="tier"><h3>' + i[0] + '</h3><p>' + i[1] + '</p></div>';
      }).join('') + '</div></div></section>' + cta();
  }

  function resources() {
    return pageHead(u('resTitle'), u('resLead')) + '<section class="band"><div class="wrap"><ul class="case-rows">' + NT.resources.map(function (r) {
      return '<li class="case-row idx"><span class="thumb ph">' + r.id + '</span><div><h3>' + t(r.t) + '</h3><p class="ev-line"><span class="badge muted">' + u('pending') + '</span></p></div></li>';
    }).join('') + '</ul></div></section>' + cta();
  }

  var CX = {
    zh: { lead: '这个页面不会把任何内容发到服务器。点击“打开邮件程序”后，您电脑上的邮件程序会带着下面的内容新建一封邮件，由您确认后发送。', ind: '行业', topic: '关注方向', pick: '请选择', other: '其他 / 不确定', msg: '简要描述（请勿写图纸、客户名或保密数据）', ph: '例如：电驱 SiC 模块，想在不加传感器的情况下估算各芯片结温；有约 20 小时台架数据。', send: '打开邮件程序', copy: '复制邮箱地址', copied: '已复制邮箱地址。', copyFail: '无法自动复制，请手动选择上面的地址。', opened: '已请求打开邮件程序；本页没有发送任何内容。如果没有弹出，请直接写信到 ', none: '本站不收集文件或 CAD。', email: '邮箱', subj: '咨询 · ', body: ['行业：', '关注方向：', '描述：'] },
    en: { lead: 'This page sends nothing to a server. “Open my email app” starts a new message in your own email program with the text below; you decide whether to send it.', ind: 'Industry', topic: 'Interest', pick: 'Please choose', other: 'Other / not sure', msg: 'Short description (no drawings, customer names or confidential data)', ph: 'For example: SiC module in a drive inverter; per-die junction estimates without new sensors; about 20 h of bench data.', send: 'Open my email app', copy: 'Copy email address', copied: 'Email address copied.', copyFail: 'Could not copy automatically; please select the address above.', opened: 'Your email app was asked to open; this page sent nothing. If nothing appeared, write to ', none: 'This site does not collect files or CAD.', email: 'Email', subj: 'Enquiry · ', body: ['Industry: ', 'Interest: ', 'Description: '] }
  };
  function contact() {
    var x = CX[lang];
    var opt = function (arr) { return '<option value="">' + x.pick + '</option>' + arr.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + '</option>'; }).join('') + '<option value="' + esc(x.other) + '">' + x.other + '</option>'; };
    return pageHead(u('contact'), x.lead) +
      '<section class="band"><div class="wrap two contact">' +
      '<form id="cf" novalidate><label>' + x.ind + '<select name="ind">' + opt(NT.industries.map(function (i) { return t(i.name); })) + '</select></label>' +
      '<label>' + x.topic + '<select name="topic">' + opt(NT.products.map(function (p) { return p.code + ' · ' + t(p.name); })) + '</select></label>' +
      '<label>' + x.msg + '<textarea name="msg" rows="5" maxlength="800" placeholder="' + esc(x.ph) + '"></textarea></label>' +
      '<button class="btn primary" type="submit">' + x.send + '</button><p class="status" id="cf-status" role="status" aria-live="polite"></p></form>' +
      '<aside class="mailbox">' + label('', x.email) + '<p class="addr"><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></p>' +
      '<button class="btn ghost" type="button" id="copy">' + x.copy + '</button><p class="note">' + x.none + '</p></aside>' +
      '</div></section>';
  }
  function bindContact() {
    var f = document.getElementById('cf');
    if (!f) return;
    var x = CX[lang];
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(f);
      var subject = x.subj + (d.get('ind') || 'NeuralThermal');
      var body = [x.body[0] + (d.get('ind') || '-'), x.body[1] + (d.get('topic') || '-'), '', x.body[2], String(d.get('msg') || '')].join('\n');
      location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      document.getElementById('cf-status').textContent = x.opened + EMAIL + '.';
    });
    document.getElementById('copy').addEventListener('click', function () {
      var s = document.getElementById('cf-status');
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(EMAIL).then(function () { s.textContent = x.copied; }, function () { s.textContent = x.copyFail; });
      else s.textContent = x.copyFail;
    });
  }

  function notFound() {
    return pageHead(u('notFound'), null) + '<section class="band"><div class="wrap"><a class="btn primary" href="#/">' + u('back') + '</a></div></section>';
  }

  // ------------------------------------------------------------------ shell
  var routes = [
    [/^$/, home, function () { return null; }],
    [/^industries$/, industriesIndex, function () { return t(U.nav.industries); }],
    [/^industries\/([\w-]+)(?:\/([\w-]+))?$/, function (m) { var i = indById(m[1]); return i ? industry(i, m[2]) : notFound(); }, function (m) { var i = indById(m[1]); return i ? t(i.long) : u('notFound'); }],
    [/^products$/, products, function () { return t(U.nav.products); }],
    [/^products\/([\w-]+)$/, function (m) { var p = prodById(m[1]); return p ? product(p) : notFound(); }, function (m) { var p = prodById(m[1]); return p ? p.code + ' · ' + t(p.name) : u('notFound'); }],
    [/^cases$/, function (m, q) { return cases(q); }, function () { return u('libTitle'); }],
    [/^cases\/(\d{3})$/, function (m) { var c = caseById(m[1]); return c ? caseDetail(c) : notFound(); }, function (m) { var c = caseById(m[1]); return c ? t(c.title) : u('notFound'); }],
    [/^tools$/, tools, function () { return u('toolsTitle'); }],
    [/^engage$/, engage, function () { return t(U.nav.engage); }],
    [/^about$/, about, function () { return t(U.nav.about); }],
    [/^resources$/, resources, function () { return u('resTitle'); }],
    [/^contact$/, contact, function () { return u('contact'); }]
  ];
  function current() {
    var h = location.hash.replace(/^#\/?/, '');
    var i = h.indexOf('?');
    return { path: (i >= 0 ? h.slice(0, i) : h).replace(/\/$/, ''), query: i >= 0 ? h.slice(i + 1) : '' };
  }
  function navHtml(path) {
    var items = ['products', 'industries', 'cases', 'engage', 'about'];
    var top = path.split('/')[0];
    if (top === 'tools') top = 'cases';
    if (top === 'resources') top = 'about';
    return '<a class="skip" href="#main">' + u('skip') + '</a><header class="nav"><div class="wrap nav-in">' +
      '<a class="brand" href="#/" aria-label="NeuralThermal">' + NT.logo + '</a>' +
      '<button class="burger" type="button" aria-expanded="false" aria-controls="nav-links"><span aria-hidden="true"></span>' + u('menu') + '</button>' +
      '<nav class="nav-links" id="nav-links">' + items.map(function (it) {
        return '<a href="' + link(it) + '"' + (top === it ? ' aria-current="page"' : '') + '>' + t(U.nav[it]) + '</a>';
      }).join('') + '<span class="nav-right"><button class="lang" type="button" id="lang" lang="' + (lang === 'zh' ? 'en' : 'zh-CN') + '" aria-label="' + esc(u('switchLabel')) + '">' + u('switchTo') + '</button>' +
      '<a class="btn primary small" href="' + link('contact') + '">' + u('contact') + '</a></span></nav></div></header>';
  }
  function footHtml() {
    return '<footer class="foot"><div class="wrap foot-in"><div class="brand dark">' + NT.logo + '</div>' +
      '<nav>' + NT.industries.map(function (i) { return '<a href="' + link('industries/' + i.id) + '">' + t(i.name) + '</a>'; }).join('') + '</nav>' +
      '<nav>' + NT.products.map(function (p) { return '<a href="' + link('products/' + p.id) + '">' + p.code + '</a>'; }).join('') + '<a href="' + link('tools') + '">' + u('toolsTitle') + '</a><a href="' + link('resources') + '">' + u('resTitle') + '</a></nav>' +
      '<div><p><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></p><p>' + u('footNote') + '</p><p>' + u('footBuild') + ': ' + fmtDate(BUILD) + '</p>' +
      '</div></div></footer>';
  }

  function render() {
    var cur = current();
    var hit = null, m = null;
    for (var i = 0; i < routes.length && !hit; i++) { m = cur.path.match(routes[i][0]); if (m) hit = routes[i]; }
    var body = hit ? hit[1](m, cur.query) : notFound();
    var title = hit ? hit[2](m) : u('notFound');
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = (title ? title + ' · ' : '') + 'NeuralThermal' + (title ? '' : (lang === 'zh' ? ' · AI 热设计' : ' · AI thermal design'));
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = lang === 'zh' ? 'NeuralThermal：AI 热设计、虚拟温度传感与工程自动化，面向封装、液冷、电驱与电机。' : 'NeuralThermal: AI thermal design, virtual temperature sensing and engineering automation for packaging, liquid cooling, power electronics and motors.';
    document.getElementById('app').innerHTML = navHtml(cur.path) + '<main id="main" tabindex="-1">' + body + '</main>' + footHtml();
    bind();
    fillLibrary();
    bindContact();
    var focus = cur.path.match(/^industries\/[\w-]+\/([\w-]+)$/);
    var target = focus ? document.getElementById('p-' + focus[1]) : null;
    if (target) target.scrollIntoView({ block: 'start' });
  }

  var pendingAnchor = null;
  function bind() {
    document.getElementById('lang').addEventListener('click', function () { setLang(lang === 'zh' ? 'en' : 'zh'); });
    var burger = document.querySelector('.burger');
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      document.getElementById('nav-links').classList.toggle('open', open);
    });
    // On-demand film excerpts: nothing is fetched until the visitor presses play.
    document.querySelectorAll('.clip .play').forEach(function (b) {
      b.addEventListener('click', function () {
        var fig = b.closest('.clip');
        var v = document.createElement('video');
        v.src = 'assets/video/clip-' + fig.dataset.clip + '.mp4';
        v.controls = true; v.muted = true; v.playsInline = true; v.autoplay = true;
        v.setAttribute('aria-label', b.getAttribute('aria-label'));
        v.poster = fig.querySelector('img').src;
        fig.replaceChild(v, fig.querySelector('img'));
        b.remove();
        v.play().catch(function () {});
      });
    });
    document.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        filt[c.dataset.g] = c.dataset.v;
        document.querySelectorAll('.chip[data-g="' + c.dataset.g + '"]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === c)); });
        fillLibrary();
      });
    });
    var q = document.getElementById('q');
    if (q) q.addEventListener('input', function () { filt.q = q.value; fillLibrary(); });
    document.querySelectorAll('a[data-anchor]').forEach(function (a) {
      a.addEventListener('click', function () { pendingAnchor = a.dataset.anchor; });
    });
    if (pendingAnchor) {
      var el = document.getElementById(pendingAnchor);
      pendingAnchor = null;
      if (el) setTimeout(function () { el.scrollIntoView(); }, 0);
    }
  }

  // In-page anchors (#industries on the home page) are not routes.
  addEventListener('hashchange', function (e) {
    var h = location.hash;
    if (h && h.indexOf('#/') !== 0) {
      var el = document.getElementById(h.slice(1));
      if (el) {
        try { history.replaceState(null, '', e.oldURL.indexOf('#') >= 0 ? e.oldURL.slice(e.oldURL.indexOf('#')) : '#/'); } catch (err) { /* file:// may refuse */ }
        el.scrollIntoView();
        return;
      }
    }
    var anchor = pendingAnchor;
    render();
    if (!current().path.match(/^industries\/[\w-]+\/[\w-]+$/) && !anchor) scrollTo(0, 0);
    var main = document.getElementById('main');
    if (main) main.focus({ preventScroll: true });
  });
  render();
})();
