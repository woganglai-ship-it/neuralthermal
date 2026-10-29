/* Chip data, layout generators and media list for the chip thermal lab.
   Specs researched 2026-10-28; every row carries its sources. "(2°)" = secondary source (retailer / press summary),
   dieEst = die area not from a primary source. Values not found are left empty — never filled by guess.
   Simulation templates are GENERIC schematic layouts (block fractions chosen for illustration, not vendor floorplans). */
var UCR = 'https://sheldonucr.github.io/commercial_thermal_map_dataset/';
var W30 = 'https://en.wikipedia.org/wiki/GeForce_RTX_30_series', W40 = 'https://en.wikipedia.org/wiki/GeForce_RTX_40_series', W50 = 'https://en.wikipedia.org/wiki/GeForce_RTX_50_series',
  WADA = 'https://en.wikipedia.org/wiki/Ada_Lovelace_(microarchitecture)', WBW = 'https://en.wikipedia.org/wiki/Blackwell_(microarchitecture)',
  HWC = 'https://hwcooling.net/en/ampere-gpu-deep-dive-whats-new-in-geforce-rtx-3000-architecture/2',
  NV40 = 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/', NV50 = 'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/',
  IS = 'https://www.intel.com/content/www/us/en/products/sku/', WAL = 'https://en.wikipedia.org/wiki/Alder_Lake',
  DT = { zh: '桌面 CPU', en: 'Desktop CPU' }, LT = { zh: '笔记本 CPU', en: 'Laptop CPU' },
  RPL = { p: 8, e: 4, gpuW: 0.13, aspect: 2.2 }, ADL = { p: 8, e: 2, gpuW: 0.14, aspect: 1.95 }, ADLP = { p: 6, e: 2, gpuW: 0.3, aspect: 1.93, gpuName: 'Iris Xe 96 EU' },
  ARL = { p: 8, e: 4, lpe: 0, mm: { c: 117.2, g: 23, s: 86.6, i: 24.5 } }, MTL = { p: 6, e: 2, lpe: 2, mm: { c: 69.7, g: 44.3, s: 100.2, i: 27.4 } },
  GD = { zh: '桌面 GPU', en: 'Desktop GPU' }, GL = { zh: '笔记本 GPU', en: 'Laptop GPU' }, DC = { zh: '数据中心加速器', en: 'Data-centre accelerator' };
window.TML_CATALOG = {
  chips: [
    /* --- the 8 processors of the UCR dataset (specs as listed on the project page) --- */
    { id: 'i5-3337u', ucr: true, name: 'Intel Core i5-3337U', type: { zh: '笔记本 CPU', en: 'Laptop CPU' }, arch: 'Ivy Bridge · 22 nm', cores: '2C / 4T · 3 MB L3 · HD 4000', clock: '1.8 / 2.7 GHz', tdp: '17 W', tdpW: 17, tj: 'Tj 105 °C', tjC: 105, die: { zh: '双核 GT2 硅片 118.1 mm²（对应关系为推断）', en: 'dual-core GT2 die 118.1 mm² (mapping inferred)' }, dieMm2: 118.1, dieEst: true, cpu: { p: 2, e: 0, gpuW: 0.3, aspect: 1.6, gpuName: 'HD 4000' }, R: 1.5, Ta: 40, src: [UCR, IS + '72055/specifications.html', 'https://www.anandtech.com/show/5876'] },
    { id: 'i7-8650u', ucr: true, name: 'Intel Core i7-8650U', type: { zh: '笔记本 CPU', en: 'Laptop CPU' }, arch: 'Kaby Lake-R · 14 nm', cores: '4C / 8T', clock: '1.9 / 4.2 GHz', tdp: '15 W', tdpW: 15, tj: '', die: '', src: [UCR] },
    { id: 'r7-4800u', ucr: true, name: 'AMD Ryzen 7 4800U', type: { zh: '笔记本 APU', en: 'Laptop APU' }, arch: 'Zen 2 · 7 nm', cores: '8C / 16T', clock: '1.8 / 4.2 GHz', tdp: '15 W', tdpW: 15, tj: '', die: '', src: [UCR] },
    { id: 'r7-7730u', ucr: true, name: 'AMD Ryzen 7 7730U', type: { zh: '笔记本 APU', en: 'Laptop APU' }, arch: 'Zen 3 · 7 nm', cores: '8C / 16T', clock: '2.0 / 4.5 GHz', tdp: '15 W', tdpW: 15, tj: '', die: { zh: '仅视频，数据未公开', en: 'video only, data not public' }, src: [UCR] },
    { id: 'rai5-340', ucr: true, name: 'AMD Ryzen AI 5 340', type: { zh: '笔记本 APU', en: 'Laptop APU' }, arch: 'Zen 5 · 4 nm', cores: { zh: '4C / 8T + iGPU + NPU ≈50 TOPS', en: '4C / 8T + iGPU + NPU ~50 TOPS' }, clock: { zh: '≈3.0 / 4.0 GHz（估）', en: '~3.0 / 4.0 GHz (est.)' }, tdp: '28–45 W', tdpW: 28, tj: '', die: { zh: '仅视频，数据未公开', en: 'video only, data not public' }, src: [UCR] },
    { id: 'rtx4060', ucr: true, name: 'NVIDIA GeForce RTX 4060', type: { zh: '桌面 GPU', en: 'Desktop GPU' }, arch: 'Ada AD107 · TSMC 4N', cores: '24 SM / 3,072 CUDA', clock: '1.83 / 2.46 GHz', tdp: 'TBP 115 W', tdpW: 115, tj: 'GPU 90 °C', die: { zh: '146 mm²（另说 159）· 18.9 B · 128-bit', en: '146 mm² (159 elsewhere) · 18.9 B · 128-bit' }, dieMm2: 146, gpu: { gpc: 2, mc: 4 }, tjC: 90, src: [UCR, W40, WADA, NV40 + 'rtx-4060-4060ti/'] },
    { id: 'coral', ucr: true, name: 'Google Coral M.2 Edge TPU', type: { zh: 'AI 加速器', en: 'AI accelerator' }, arch: 'Edge TPU', cores: { zh: '每颗 4 TOPS', en: '4 TOPS per Edge TPU' }, clock: '', tdp: { zh: '≈2 W / 颗', en: '~2 W each' }, tdpW: 2, tj: '', die: '', src: [UCR] },
    { id: 'sd680', ucr: true, name: 'Qualcomm Snapdragon 680 (SM6225)', type: { zh: '手机 SoC', en: 'Phone SoC' }, arch: '6 nm (TSMC)', cores: '4× A73 + 4× A53', clock: '2.4 / 1.9 GHz', tdp: '≈6–8 W', tdpW: 7, tj: '', die: { zh: '仅视频，数据未公开', en: 'video only, data not public' }, src: [UCR] },

    /* --- Intel (specs from intel.com product pages, researched 2026-10-29; cpu = {p, pOn, e: E-clusters of 4, eOn, gpuW} drives the generic ring-bus layout,
           tiles = {...} the generic Foveros tile layout. Die of SKUs cut from a larger die is inferred where marked dieEst) --- */
    { id: 'i9-14900k', name: 'Intel Core i9-14900K', type: DT, arch: 'Raptor Lake-S Refresh · Intel 7', cores: '8P + 16E / 32T · 36 MB L3', clock: 'P 3.2 / 5.6 · max 6.0 GHz', tdp: '125 W / 253 W', tdpW: 253, tj: 'Tj 100 °C', tjC: 100, die: { zh: '单片 23.8×10.8 mm = 257 mm²（开盖实测 13900）', en: 'monolithic 23.8×10.8 mm = 257 mm² (delidded 13900)' }, dieMm2: 257, cpu: RPL, src: [IS + '236773/intel-core-i9-processor-14900k-36m-cache-up-to-6-00-ghz/specifications.html', 'https://locuza.substack.com/p/info-snack-alder-lake-m-raptor-lake'] },
    { id: 'i9-13900k', name: 'Intel Core i9-13900K', type: DT, arch: 'Raptor Lake-S · Intel 7', cores: '8P + 16E / 32T · 36 MB L3', clock: 'P 3.0 / 5.4 · max 5.8 GHz', tdp: '125 W / 253 W', tdpW: 253, tj: 'Tj 100 °C', tjC: 100, die: '8P+16E · 257 mm²', dieMm2: 257, cpu: RPL, src: [IS + '230496/specifications.html', 'https://www.hwcooling.net/en/intel-core-i5-14400f-refresh-in-the-most-popular-range-review/'] },
    { id: 'i7-14700k', name: 'Intel Core i7-14700K', type: DT, arch: 'Raptor Lake-S Refresh · Intel 7', cores: '8P + 12E / 28T · 33 MB L3', clock: 'P 3.4 / 5.5 · max 5.6 GHz', tdp: '125 W / 253 W', tdpW: 253, tj: 'Tj 100 °C', tjC: 100, die: { zh: '推断为 8P+16E 硅片（257 mm²）启用 12 个 E 核：只有这块硅片有 12 个以上 E 核', en: 'inferred 8P+16E die (257 mm²) with 12 E-cores on: the only die with more than 8 E-cores' }, dieMm2: 257, dieEst: true, cpu: { p: 8, e: 4, eOn: 3, gpuW: 0.13, aspect: 2.2 }, src: [IS + '236783/specifications.html'] },
    { id: 'i5-14400', name: 'Intel Core i5-14400', type: DT, arch: 'Raptor Lake-S Refresh · Intel 7', cores: '6P + 4E / 16T · 20 MB L3', clock: 'P 2.5 / 4.7 GHz', tdp: '65 W / 148 W', tdpW: 148, tj: 'Tj 100 °C', tjC: 100, die: { zh: '两种硅片版本；这里按 C0（Alder Lake 8P+8E，215.25 mm²）启用 6P+4E', en: 'two die versions; modelled as C0 (Alder Lake 8P+8E, 215.25 mm²) with 6P+4E on' }, dieMm2: 215.25, dieEst: true, cpu: { p: 8, pOn: 6, e: 2, eOn: 1, gpuW: 0.14, aspect: 1.95 }, src: [IS + '236788/specifications.html', 'https://www.hwcooling.net/en/intel-core-i5-14400f-refresh-in-the-most-popular-range-review/', WAL] },
    { id: 'i9-12900k', name: 'Intel Core i9-12900K', type: DT, arch: 'Alder Lake-S · Intel 7', cores: '8P + 8E / 24T · 30 MB L3', clock: 'P 3.2 / 5.1 · max 5.2 GHz', tdp: '125 W / 241 W', tdpW: 241, tj: 'Tj 100 °C', tjC: 100, die: '8P+8E · 20.5×10.5 mm = 215.25 mm²', dieMm2: 215.25, cpu: ADL, src: [IS + '134599/specifications.html', WAL] },
    { id: 'i7-12700k', name: 'Intel Core i7-12700K', type: DT, arch: 'Alder Lake-S · Intel 7', cores: '8P + 4E / 20T · 25 MB L3', clock: 'P 3.6 / 4.9 · max 5.0 GHz', tdp: '125 W / 190 W', tdpW: 190, tj: 'Tj 100 °C', tjC: 100, die: { zh: '推断为 8P+8E 硅片（215.25 mm²）启用 4 个 E 核', en: 'inferred 8P+8E die (215.25 mm²) with 4 E-cores on' }, dieMm2: 215.25, dieEst: true, cpu: { p: 8, e: 2, eOn: 1, gpuW: 0.14, aspect: 1.95 }, src: [IS + '134594/specifications.html', WAL] },
    { id: 'i5-12600k', name: 'Intel Core i5-12600K', type: DT, arch: 'Alder Lake-S · Intel 7', cores: '6P + 4E / 16T · 20 MB L3', clock: 'P 3.7 / 4.9 GHz', tdp: '125 W / 150 W', tdpW: 150, tj: 'Tj 100 °C', tjC: 100, die: { zh: '推断为 8P+8E 硅片（215.25 mm²）启用 6P+4E：6P+0E 硅片没有 E 核', en: 'inferred 8P+8E die (215.25 mm²) with 6P+4E on: the 6P+0E die has no E-cores' }, dieMm2: 215.25, dieEst: true, cpu: { p: 8, pOn: 6, e: 2, eOn: 1, gpuW: 0.14, aspect: 1.95 }, src: [IS + '134589/specifications.html', WAL] },
    { id: 'i5-12400', name: 'Intel Core i5-12400', type: DT, arch: 'Alder Lake-S · Intel 7', cores: '6P / 12T · 18 MB L3', clock: 'P 2.5 / 4.4 GHz', tdp: '65 W / 117 W', tdpW: 117, tj: 'Tj 100 °C', tjC: 100, die: { zh: '6P+0E 硅片 15.47×10.19 mm = 157.74 mm²（对应关系为推断）', en: '6P+0E die 15.47×10.19 mm = 157.74 mm² (mapping inferred)' }, dieMm2: 157.74, dieEst: true, cpu: { p: 6, e: 0, gpuW: 0.2, aspect: 1.52 }, src: [IS + '134586/specifications.html', WAL] },
    { id: 'i7-12700h', name: 'Intel Core i7-12700H', type: LT, arch: 'Alder Lake-P · Intel 7', cores: '6P + 8E / 20T · 24 MB · 96 EU', clock: 'P 2.3 / 4.7 GHz', tdp: '45 W / 115 W', tdpW: 45, tj: 'Tj 100 °C', tjC: 100, die: { zh: 'Alder Lake-P 6P+8E · 20.45×10.62 mm = 217.18 mm²', en: 'Alder Lake-P 6P+8E · 20.45×10.62 mm = 217.18 mm²' }, dieMm2: 217.18, cpu: ADLP, R: 1.0, Ta: 40, src: [IS + '132228/specifications.html', WAL] },
    { id: 'i7-1260p', name: 'Intel Core i7-1260P', type: LT, arch: 'Alder Lake-P · Intel 7', cores: '4P + 8E / 16T · 18 MB · 96 EU', clock: 'P 2.1 / 4.7 GHz', tdp: '28 W / 64 W', tdpW: 28, tj: 'Tj 100 °C', tjC: 100, die: { zh: '推断为 Alder Lake-P 硅片（217.18 mm²）启用 4 个 P 核', en: 'inferred Alder Lake-P die (217.18 mm²) with 4 P-cores on' }, dieMm2: 217.18, dieEst: true, cpu: { p: 6, pOn: 4, e: 2, gpuW: 0.3, aspect: 1.93, gpuName: 'Iris Xe 96 EU' }, R: 1.3, Ta: 40, src: [IS + '226254/specifications.html', WAL] },
    { id: 'u9-285k', name: 'Intel Core Ultra 9 285K', type: DT, arch: 'Arrow Lake-S · N3B compute tile', cores: '8P + 16E / 24T · 4 Xe · NPU 13 TOPS', clock: 'P 3.7 / 5.5–5.7 GHz', tdp: '125 W / 250 W', tdpW: 250, tj: { zh: '最高工作温度 105 °C', en: 'max operating 105 °C' }, tjC: 105, die: { zh: '计算 117.2 + GPU 23 + SoC 86.6 + IO 24.5 mm²', en: 'compute 117.2 + GPU 23 + SoC 86.6 + IO 24.5 mm²' }, dieMm2: 251.3, tiles: ARL, src: [IS + '241060/intel-core-ultra-9-processor-285k-36m-cache-up-to-5-70-ghz/specifications.html', 'https://en.wikipedia.org/wiki/Arrow_Lake_(microprocessor)'] },
    { id: 'u7-265k', name: 'Intel Core Ultra 7 265K', type: DT, arch: 'Arrow Lake-S', cores: '8P + 12E / 20T · 4 Xe · NPU 13 TOPS', clock: 'P 3.9 / 5.4 · max 5.5 GHz', tdp: '125 W / 250 W', tdpW: 250, tj: { zh: '最高工作温度 105 °C', en: 'max operating 105 °C' }, tjC: 105, die: { zh: '按 285K 同一组 tile 计算（对应关系未公开）', en: 'modelled with the 285K tile set (mapping not published)' }, dieMm2: 251.3, dieEst: true, tiles: { p: 8, e: 4, eOn: 3, lpe: 0, mm: ARL.mm }, src: [IS + '241063/specifications.html', 'https://en.wikipedia.org/wiki/Arrow_Lake_(microprocessor)'] },
    { id: 'u9-185h', name: 'Intel Core Ultra 9 185H', type: LT, arch: 'Meteor Lake · Intel 4', cores: '6P + 8E + 2LPE / 22T · 8 Xe · NPU 11 TOPS', clock: 'P 2.3 / 5.1 GHz', tdp: '45 W / 115 W', tdpW: 45, tj: { zh: '最高工作温度 110 °C', en: 'max operating 110 °C' }, tjC: 110, die: { zh: '计算 69.7 + GPU 44.3 + SoC 100.2 + IO 27.4 mm²', en: 'compute 69.7 + GPU 44.3 + SoC 100.2 + IO 27.4 mm²' }, dieMm2: 241.6, tiles: MTL, R: 1.0, Ta: 40, src: [IS + '236849/specifications.html', 'https://en.wikipedia.org/wiki/Meteor_Lake'] },
    { id: 'u7-155h', name: 'Intel Core Ultra 7 155H', type: LT, arch: 'Meteor Lake · Intel 4', cores: '6P + 8E + 2LPE / 22T · 8 Xe', clock: 'P 1.4 / 4.8 GHz', tdp: '28 W / 115 W', tdpW: 28, tj: { zh: '最高工作温度 110 °C', en: 'max operating 110 °C' }, tjC: 110, die: { zh: '计算 69.7 + GPU 44.3 + SoC 100.2 + IO 27.4 mm²', en: 'compute 69.7 + GPU 44.3 + SoC 100.2 + IO 27.4 mm²' }, dieMm2: 241.6, tiles: MTL, R: 1.2, Ta: 40, src: [IS + '236847/intel-core-ultra-7-processor-155h-24m-cache-up-to-4-80-ghz/specifications.html', 'https://en.wikipedia.org/wiki/Meteor_Lake'] },
    { id: 'u5-125h', name: 'Intel Core Ultra 5 125H', type: LT, arch: 'Meteor Lake · Intel 4', cores: '4P + 8E + 2LPE / 18T · 7 Xe · NPU 11 TOPS', clock: 'P 1.2 / 4.5 GHz', tdp: '28 W / 115 W', tdpW: 28, tj: { zh: '最高工作温度 110 °C', en: 'max operating 110 °C' }, tjC: 110, die: { zh: '按同一组 Meteor Lake tile 计算，启用 4 个 P 核（推断）', en: 'modelled with the same Meteor Lake tiles, 4 P-cores on (inferred)' }, dieMm2: 241.6, dieEst: true, tiles: { p: 6, pOn: 4, e: 2, lpe: 2, mm: MTL.mm }, R: 1.2, Ta: 40, src: [IS + '236848/specifications.html', 'https://en.wikipedia.org/wiki/Meteor_Lake'] },
    { id: 'u9-288v', name: 'Intel Core Ultra 9 288V', type: LT, arch: 'Lunar Lake · TSMC N3B', cores: '4P + 4LPE / 8T · Arc 140V 8 Xe2 · NPU 48 TOPS', clock: 'P 3.3 / 5.1 GHz', tdp: '30 W / 37 W', tdpW: 37, tj: 'Tj 100 °C', tjC: 100, die: { zh: '计算 140 + 平台控制 46 mm² · 内存在封装上', en: 'compute 140 + PCD 46 mm² · memory on package' }, dieMm2: 186, template: 'laptop', src: [IS + '240961/specifications.html', 'https://en.wikipedia.org/wiki/Lunar_Lake'] },
    { id: 'u7-258v', name: 'Intel Core Ultra 7 258V', type: LT, arch: 'Lunar Lake · TSMC N3B', cores: '4P + 4LPE · Arc 140V 8 Xe2 · NPU 47 TOPS', clock: 'P 2.2 / 4.8 GHz', tdp: '17 W / 37 W', tdpW: 37, tj: { zh: '最高工作温度 100 °C', en: 'max operating 100 °C' }, tjC: 100, die: { zh: '计算 140 + 平台控制 46 mm² · 内存在封装上', en: 'compute 140 + PCD 46 mm² · memory on package' }, dieMm2: 186, template: 'laptop', src: [IS + '240957/intel-core-ultra-7-processor-258v-12m-cache-up-to-4-80-ghz/specifications.html', 'https://en.wikipedia.org/wiki/Lunar_Lake'] },
    { id: 'u5-226v', name: 'Intel Core Ultra 5 226V', type: LT, arch: 'Lunar Lake · TSMC N3B', cores: '4P + 4LPE / 8T · Arc 130V 7 Xe2 · NPU 40 TOPS', clock: 'P 2.1 / 4.5 GHz', tdp: '17 W / 37 W', tdpW: 17, tj: 'Tj 100 °C', tjC: 100, die: { zh: '按同一组 Lunar Lake tile 计算', en: 'modelled with the same Lunar Lake tiles' }, dieMm2: 186, dieEst: true, template: 'laptop', src: [IS + '240960/specifications.html', 'https://en.wikipedia.org/wiki/Lunar_Lake'] },
    { id: 'x-8592', name: 'Intel Xeon Platinum 8592+', type: { zh: '服务器 CPU', en: 'Server CPU' }, arch: 'Emerald Rapids · Intel 7', cores: '64C / 128T · 320 MB', clock: '1.9 / 3.9 GHz', tdp: '350 W', tdpW: 350, tj: { zh: 'DTS 最高 98 °C', en: 'DTS max 98 °C' }, die: '', src: ['https://www.intel.com/content/www/us/en/products/sku/237261/intel-xeon-platinum-8592-processor-320m-cache-1-90-ghz/specifications.html'] },
    { id: 'x-6980p', name: 'Intel Xeon 6980P', type: { zh: '服务器 CPU', en: 'Server CPU' }, arch: 'Granite Rapids-AP · Intel 3', cores: '128C / 256T · 504 MB L3', clock: '2.0 / 3.9 GHz (2°)', tdp: '500 W (2°)', tdpW: 500, tj: { zh: '来源不一（80 / 95 °C）', en: 'sources conflict (80 / 95 °C)' }, die: '', src: ['https://www.scan.co.uk/products/intel-xeon-6980p-fclga7529-granite-rapids-128-cores-256-threads-2ghz-39ghz-turbo-504mb-cache-500w-oe', 'https://www.phoronix.com/review/intel-xeon-6980p-performance/11'] },
    /* --- AMD --- */
    { id: 'r9-7950x', name: 'AMD Ryzen 9 7950X', type: { zh: '桌面 CPU', en: 'Desktop CPU' }, arch: 'Zen 4 · CCD N5 / IOD N6', cores: '16C / 32T · 64 MB L3', clock: '4.5 / 5.7 GHz', tdp: 'TDP 170 W', tdpW: 170, tj: '', die: { zh: '2 × CCD 66.3 mm²（另说 ≈71）+ IOD', en: '2 × CCD 66.3 mm² (≈71 elsewhere) + IOD' }, src: ['https://en.wikipedia.org/wiki/Zen_4', 'https://www.techpowerup.com/298338/amd-zen-4-dies-transistor-counts-cache-sizes-and-latencies-detailed'] },
    { id: 'r7-7800x3d', name: 'AMD Ryzen 7 7800X3D', type: { zh: '桌面 CPU', en: 'Desktop CPU' }, arch: 'Zen 4 + 3D V-Cache', cores: '8C / 16T · 96 MB L3', clock: '4.2 / 5.0 GHz', tdp: '120 W', tdpW: 120, tj: '', die: '1 CCD + V-Cache + IOD', src: ['https://en.wikipedia.org/wiki/Zen_4'] },
    { id: 'r9-9950x', name: 'AMD Ryzen 9 9950X', type: { zh: '桌面 CPU', en: 'Desktop CPU' }, arch: 'Zen 5 · CCD N4 / IOD N6', cores: '16C / 32T · 64 MB L3', clock: '4.3 / 5.7 GHz', tdp: 'TDP 170 W · PPT 230 W', tdpW: 230, tj: '95 °C (2°)', tjC: 95, die: { zh: '2 × CCD ≈70.6 mm² + IOD ≈122 mm² (2°)', en: '2 × CCD ~70.6 mm² + IOD ~122 mm² (2°)' }, dieMm2: 263.2, dieEst: true, template: 'chiplet', src: ['https://en.wikipedia.org/wiki/Zen_5', 'https://www.geektopia.es/es/product/amd/ryzen-9-9950x/'] },
    { id: 'r7-9800x3d', name: 'AMD Ryzen 7 9800X3D', type: { zh: '桌面 CPU', en: 'Desktop CPU' }, arch: 'Zen 5 + 3D V-Cache', cores: '8C / 16T · 96 MB L3', clock: '4.7 / 5.2 GHz', tdp: '120 W · PPT 162 W (2°)', tdpW: 162, tj: '95 °C (2°)', tjC: 95, die: '1 CCD + V-Cache + IOD', src: ['https://shop-us-en.amd.com/amd-ryzen-7-9800x3d-processor/', 'https://en.wikipedia.org/wiki/Zen_5'] },
    { id: 'epyc-9654', name: 'AMD EPYC 9654', type: { zh: '服务器 CPU', en: 'Server CPU' }, arch: 'Zen 4 Genoa', cores: '96C / 192T', clock: '2.4 / 3.7 GHz', tdp: '360 W', tdpW: 360, tj: '', die: '12 CCD + 1 IOD', src: ['https://en.wikipedia.org/wiki/Zen_4'] },
    { id: 'epyc-9965', name: 'AMD EPYC 9965', type: { zh: '服务器 CPU', en: 'Server CPU' }, arch: 'Zen 5c Turin Dense · IOD N6', cores: '192C / 384T · 384 MB L3', clock: '2.25 / 3.7 GHz', tdp: '500 W (450–500)', tdpW: 500, tj: '', die: '12 CCD × 16C + IOD', src: ['https://www.amd.com/en/products/processors/server/epyc/9005-series/amd-epyc-9965.html', 'https://en.wikipedia.org/wiki/Zen_5'] },
    { id: 'hx370', name: 'AMD Ryzen AI 9 HX 370', type: { zh: '笔记本 APU', en: 'Laptop APU' }, arch: 'Strix Point · TSMC N4P', cores: '4 Zen 5 + 8 Zen 5c · Radeon 890M 16 CU', clock: '2.0 / 5.1 GHz', tdp: '28 W (15–54 W)', tdpW: 28, tj: '', die: { zh: '单片 232.5 mm²', en: 'monolithic 232.5 mm²' }, dieMm2: 232.5, template: 'apu', src: ['https://en.wikipedia.org/wiki/Zen_5'] },
    { id: 'mi300x', name: 'AMD Instinct MI300X', type: { zh: '数据中心加速器', en: 'Data-centre accelerator' }, arch: 'CDNA 3 · XCD 5 nm / IOD 6 nm', cores: '304 CU', clock: '', tdp: '750 W', tdpW: 750, tj: '', die: { zh: '8 XCD 堆叠在 4 IOD 上；封装 76.8×72.0 mm；192 GB HBM3', en: '8 XCD stacked on 4 IOD; package 76.8×72.0 mm; 192 GB HBM3' }, src: ['https://instinct.docs.amd.com/projects/system-acceptance/en/latest/gpus/mi300x.html', 'https://www.techinsights.com/blog/amd-instinct-mi300x-processor-floorplan-analysis'] },
    /* --- NVIDIA (researched 2026-10-29; gpu = {gpc, on: enabled GPCs, mc: 32-bit memory controllers, mcOn, hbm: HBM stack sites} drives the generic GPU layout) --- */
    { id: 'rtx3060', name: 'NVIDIA GeForce RTX 3060 12 GB', type: GD, arch: 'Ampere GA106 · Samsung 8 nm', cores: '28 SM / 3,584 CUDA', clock: '1.32 / 1.78 GHz', tdp: '170 W', tdpW: 170, tj: '', die: '276 mm² · 13.25 B · 12 GB 192-bit', dieMm2: 276, gpu: { gpc: 3, mc: 6, gpcEst: true }, src: [W30] },
    { id: 'rtx3070', name: 'NVIDIA GeForce RTX 3070', type: GD, arch: 'Ampere GA104 · Samsung 8 nm', cores: '46 SM / 5,888 CUDA', clock: '1.50 / 1.73 GHz', tdp: '220 W', tdpW: 220, tj: '', die: '392.5 mm² · 17.4 B · 256-bit', dieMm2: 392.5, gpu: { gpc: 6, mc: 8 }, src: [W30, HWC] },
    { id: 'rtx3080', name: 'NVIDIA GeForce RTX 3080 10 GB', type: GD, arch: 'Ampere GA102 · Samsung 8 nm', cores: '68 SM / 8,704 CUDA', clock: '1.44 / 1.71 GHz', tdp: '320 W', tdpW: 320, tj: '', die: { zh: '628.4 mm² · 28.3 B · 10 GB GDDR6X 320-bit（7 个 GPC 启用 6 个）', en: '628.4 mm² · 28.3 B · 10 GB GDDR6X 320-bit (6 of 7 GPCs enabled)' }, dieMm2: 628.4, gpu: { gpc: 7, on: 6, mc: 12, mcOn: 10 }, src: [W30, HWC, 'https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3080-3080ti/'] },
    { id: 'rtx3090', name: 'NVIDIA GeForce RTX 3090', type: GD, arch: 'Ampere GA102 · Samsung 8 nm', cores: '82 SM / 10,496 CUDA', clock: '1.40 / 1.70 GHz', tdp: '350 W', tdpW: 350, tj: '', die: '628.4 mm² · 28.3 B · 24 GB GDDR6X 384-bit', dieMm2: 628.4, gpu: { gpc: 7, mc: 12 }, src: [W30, HWC, 'https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3090-3090ti/'] },
    { id: 'rtx4060ti', name: 'NVIDIA GeForce RTX 4060 Ti', type: GD, arch: 'Ada AD106 · TSMC 4N', cores: '34 SM / 4,352 CUDA', clock: '2.31 / 2.54 GHz', tdp: '160 W (8 GB) / 165 W (16 GB)', tdpW: 160, tj: 'GPU 90 °C', tjC: 90, die: { zh: '190 mm²（另说 188）· 22.9 B · 128-bit', en: '190 mm² (188 elsewhere) · 22.9 B · 128-bit' }, dieMm2: 190, gpu: { gpc: 3, mc: 4 }, src: [W40, WADA, NV40 + 'rtx-4060-4060ti/'] },
    { id: 'rtx4070', name: 'NVIDIA GeForce RTX 4070', type: GD, arch: 'Ada AD104 · TSMC 4N', cores: '46 SM / 5,888 CUDA', clock: '1.92 / 2.48 GHz', tdp: '200 W', tdpW: 200, tj: 'GPU 90 °C', tjC: 90, die: '294.5 mm² · 35.8 B · 12 GB 192-bit', dieMm2: 294.5, gpu: { gpc: 5, mc: 6 }, src: [W40, WADA, NV40 + 'rtx-4070-family/'] },
    { id: 'rtx4070s', name: 'NVIDIA GeForce RTX 4070 SUPER', type: GD, arch: 'Ada AD104 · TSMC 4N', cores: '56 SM / 7,168 CUDA', clock: '1.98 / 2.48 GHz', tdp: '220 W', tdpW: 220, tj: 'GPU 90 °C', tjC: 90, die: '294.5 mm² · 12 GB 192-bit', dieMm2: 294.5, gpu: { gpc: 5, mc: 6 }, src: [W40, NV40 + 'rtx-4070-family/'] },
    { id: 'rtx4070tis', name: 'NVIDIA GeForce RTX 4070 Ti SUPER', type: GD, arch: 'Ada AD103 · TSMC 4N', cores: '66 SM / 8,448 CUDA', clock: '2.34 / 2.61 GHz', tdp: '285 W', tdpW: 285, tj: 'GPU 90 °C', tjC: 90, die: '378.6 mm² · 45.9 B · 16 GB 256-bit', dieMm2: 378.6, gpu: { gpc: 7, mc: 8 }, src: [W40, WADA, NV40 + 'rtx-4070-family/'] },
    { id: 'rtx4080s', name: 'NVIDIA GeForce RTX 4080 SUPER', type: GD, arch: 'Ada AD103 · TSMC 4N', cores: '80 SM / 10,240 CUDA', clock: '2.21 / 2.55 GHz', tdp: '320 W', tdpW: 320, tj: 'GPU 90 °C', tjC: 90, die: '378.6 mm² · 16 GB GDDR6X 256-bit', dieMm2: 378.6, gpu: { gpc: 7, mc: 8 }, src: [W40, NV40 + 'rtx-4080-family/'] },
    { id: 'rtx4090', name: 'NVIDIA GeForce RTX 4090', type: GD, arch: 'Ada AD102 · TSMC 4N', cores: '128 SM / 16,384 CUDA', clock: '2.23 / 2.52 GHz', tdp: '450 W', tdpW: 450, tj: { zh: 'GPU 上限 90 °C (2°)', en: 'max GPU 90 °C (2°)' }, tjC: 90, die: '608.5 mm² · 76.3 B', dieMm2: 608.5, gpu: { gpc: 12, mc: 12 }, src: [W40, WADA, 'https://www.techspot.com/review/2544-nvidia-geforce-rtx-4090/'] },
    { id: 'rtx5060', name: 'NVIDIA GeForce RTX 5060', type: GD, arch: 'Blackwell GB206 · TSMC 4N', cores: '30 SM / 3,840 CUDA', clock: '2.28 / 2.50 GHz', tdp: '145 W', tdpW: 145, tj: 'GPU 89 °C', tjC: 89, die: '181 mm² · 21.9 B · 8 GB GDDR7 128-bit', dieMm2: 181, gpu: { gpc: 3, mc: 4 }, src: [W50, WBW, NV50 + 'rtx-5060-family/'] },
    { id: 'rtx5060ti', name: 'NVIDIA GeForce RTX 5060 Ti', type: GD, arch: 'Blackwell GB206 · TSMC 4N', cores: '36 SM / 4,608 CUDA', clock: '2.41 / 2.57 GHz', tdp: '180 W', tdpW: 180, tj: 'GPU 87 °C', tjC: 87, die: '181 mm² · 8 / 16 GB GDDR7 128-bit', dieMm2: 181, gpu: { gpc: 3, mc: 4 }, src: [W50, WBW, NV50 + 'rtx-5060-family/'] },
    { id: 'rtx5070', name: 'NVIDIA GeForce RTX 5070', type: GD, arch: 'Blackwell GB205 · TSMC 4N', cores: '48 SM / 6,144 CUDA', clock: '2.16 / 2.51 GHz', tdp: '250 W', tdpW: 250, tj: 'GPU 85 °C', tjC: 85, die: '263 mm² · 31.1 B · 12 GB GDDR7 192-bit', dieMm2: 263, gpu: { gpc: 5, mc: 6 }, src: [W50, WBW, NV50 + 'rtx-5070-family/'] },
    { id: 'rtx5070ti', name: 'NVIDIA GeForce RTX 5070 Ti', type: GD, arch: 'Blackwell GB203 · TSMC 4N', cores: '70 SM / 8,960 CUDA', clock: '2.30 / 2.45 GHz', tdp: '300 W', tdpW: 300, tj: 'GPU 88 °C', tjC: 88, die: '378 mm² · 45.6 B · 16 GB GDDR7 256-bit', dieMm2: 378, gpu: { gpc: 7, mc: 8 }, src: [W50, WBW, NV50 + 'rtx-5070-family/'] },
    { id: 'rtx5080', name: 'NVIDIA GeForce RTX 5080', type: GD, arch: 'Blackwell GB203 · TSMC 4N', cores: '84 SM / 10,752 CUDA', clock: '2.30 / 2.62 GHz', tdp: '360 W', tdpW: 360, tj: 'GPU 88 °C', tjC: 88, die: '378 mm² · 45.6 B · 16 GB GDDR7 256-bit', dieMm2: 378, gpu: { gpc: 7, mc: 8 }, src: [W50, WBW, NV50 + 'rtx-5080/'] },
    { id: 'rtx5090', name: 'NVIDIA GeForce RTX 5090', type: GD, arch: 'Blackwell GB202 · TSMC 4N', cores: '170 SM / 21,760 CUDA', clock: '2.01 / 2.41 GHz', tdp: '575 W', tdpW: 575, tj: 'GPU 90 °C', tjC: 90, die: '750 mm² · 92.2 B · 32 GB GDDR7 512-bit', dieMm2: 750, gpu: { gpc: 12, mc: 16 }, src: [W50, WBW, NV50 + 'rtx-5090/'] },
    { id: 'rtx4090m', name: 'NVIDIA GeForce RTX 4090 Laptop GPU', type: GL, arch: 'Ada AD103 · TSMC 4N', cores: '76 SM / 9,728 CUDA', clock: '0.93–1.62 / 1.46–2.04 GHz', tdp: '80–150 W', tdpW: 150, tj: '', die: '378.6 mm² · 16 GB 256-bit', dieMm2: 378.6, gpu: { gpc: 7, mc: 8 }, R: 0.3, Ta: 40, src: [W40] },
    { id: 'rtx5090m', name: 'NVIDIA GeForce RTX 5090 Laptop GPU', type: GL, arch: 'Blackwell', cores: '10,496 CUDA', clock: '', tdp: '95–150 W', tdpW: 150, tj: '', die: { zh: '24 GB GDDR7 · 896 GB/s；硅片型号官方未列出', en: '24 GB GDDR7 · 896 GB/s; die not listed officially' }, src: [W50, 'https://www.nvidia.com/en-us/geforce/laptops/50-series/'] },
    { id: 'rtx5070m', name: 'NVIDIA GeForce RTX 5070 Laptop GPU', type: GL, arch: 'Blackwell', cores: '4,608 CUDA', clock: '', tdp: '50–100 W', tdpW: 100, tj: '', die: { zh: '8 / 12 GB GDDR7 · 384 GB/s；硅片型号官方未列出', en: '8 / 12 GB GDDR7 · 384 GB/s; die not listed officially' }, src: [W50, 'https://www.nvidia.com/en-us/geforce/laptops/50-series/'] },
    { id: 'rtxpro6000', name: 'NVIDIA RTX PRO 6000 Blackwell (Workstation)', type: { zh: '工作站 GPU', en: 'Workstation GPU' }, arch: 'Blackwell GB202', cores: '', clock: '', tdp: '600 W', tdpW: 600, tj: '', die: { zh: 'GB202 750 mm² (2°) · 96 GB GDDR7 ECC · 1,792 GB/s', en: 'GB202 750 mm² (2°) · 96 GB GDDR7 ECC · 1,792 GB/s' }, dieMm2: 750, dieEst: true, gpu: { gpc: 12, mc: 16 }, src: ['https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/', WBW] },
    { id: 'l40s', name: 'NVIDIA L40S', type: DC, arch: 'Ada AD102 (2°)', cores: '', clock: '', tdp: '350 W', tdpW: 350, tj: '', die: { zh: 'AD102 608.5 mm² (2°) · 48 GB GDDR6 ECC', en: 'AD102 608.5 mm² (2°) · 48 GB GDDR6 ECC' }, dieMm2: 608.5, dieEst: true, gpu: { gpc: 12, mc: 12 }, R: 0.1, src: ['https://www.nvidia.com/en-us/data-center/l40s/', WADA] },
    { id: 'a100', name: 'NVIDIA A100 80 GB SXM', type: DC, arch: 'Ampere GA100 · TSMC N7', cores: '108 SM (of 128) / 6,912 CUDA', clock: '', tdp: { zh: '400 W（定制散热最高 500 W）', en: '400 W (up to 500 W with custom cooling)' }, tdpW: 400, tj: '', die: '826 mm² · 54.2 B · 80 GB HBM2e 2,039 GB/s', dieMm2: 826, gpu: { gpc: 8, hbm: 6 }, src: ['https://www.nvidia.com/en-us/data-center/a100/', 'https://en.wikipedia.org/wiki/Ampere_(microarchitecture)'] },
    { id: 'h100', name: 'NVIDIA H100 SXM5', type: DC, arch: 'Hopper GH100 · TSMC 4N', cores: '132 SM (of 144) · 8 GPC', clock: 'boost 1.98 GHz', tdp: '700 W', tdpW: 700, tj: '', die: { zh: '814 mm² · 80 B · 50 MB L2 · 5 / 6 个 HBM3 堆叠启用 · 80 GB', en: '814 mm² · 80 B · 50 MB L2 · 5 of 6 HBM3 stacks enabled · 80 GB' }, dieMm2: 814, gpu: { gpc: 8, hbm: 6, hbmOn: 5 }, src: ['https://en.wikipedia.org/wiki/Hopper_(microarchitecture)', 'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/'] },
    { id: 'h200', name: 'NVIDIA H200 SXM', type: { zh: '数据中心加速器', en: 'Data-centre accelerator' }, arch: 'Hopper GH100', cores: '132 SM', clock: '', tdp: { zh: '最高 700 W (2°)', en: 'up to 700 W (2°)' }, tdpW: 700, tj: '', die: { zh: '同 GH100 · 141 GB HBM3e', en: 'as GH100 · 141 GB HBM3e' }, src: ['https://en.wikipedia.org/wiki/Hopper_(microarchitecture)', 'https://inferencex.semianalysis.com/chips/h200'] },
    { id: 'b200', name: 'NVIDIA B200', type: { zh: '数据中心加速器', en: 'Data-centre accelerator' }, arch: 'Blackwell · TSMC 4NP', cores: { zh: '2 颗光罩极限硅片 · 208 B', en: '2 reticle-limit dies · 208 B' }, clock: '', tdp: { zh: '来源不一：1,000 / 1,200 W (2°)', en: 'sources conflict: 1,000 / 1,200 W (2°)' }, tdpW: 1000, tj: '', die: { zh: '192 GB HBM3e', en: '192 GB HBM3e' }, src: ['https://en.wikipedia.org/wiki/Blackwell_(microarchitecture)', 'https://www.tweaktown.com/news/97059/nvidias-full-spec-blackwell-b200-ai-gpu-uses-1200w-of-power-up-from-700w-on-hopper-h100/index.html'] },
    /* --- Apple / Qualcomm --- */
    { id: 'm3max', name: 'Apple M3 Max', type: { zh: '笔记本 SoC', en: 'Laptop SoC' }, arch: 'TSMC N3B', cores: '10–12P + 4E · 30/40 GPU', clock: 'P ≤ 4.05 · E ≤ 2.75 GHz', tdp: '', tj: '', die: '92 B', src: ['https://en.wikipedia.org/wiki/Apple_M3'] },
    { id: 'm4max', name: 'Apple M4 Max', type: { zh: '笔记本 SoC', en: 'Laptop SoC' }, arch: 'TSMC N3E', cores: '10–12P + 4E · 32/40 GPU', clock: '', tdp: { zh: '62 / 70 W（维基；Apple 未公布）', en: '62 / 70 W (Wikipedia; not published by Apple)' }, tdpW: 70, tj: '', die: '', src: ['https://en.wikipedia.org/wiki/Apple_M4'] },
    { id: 'x-elite', name: 'Snapdragon X Elite X1E-84-100', type: { zh: '笔记本 SoC', en: 'Laptop SoC' }, arch: 'Oryon · 4 nm', cores: '12C · 42 MB', clock: '3.8 all-core / 4.2 GHz', tdp: '', tj: '', die: '', src: ['https://www.tomshardware.com/qualcomm-snapdragon-x-series-everything-we-know'] },
    { id: 'sd8g3', name: 'Snapdragon 8 Gen 3', type: { zh: '手机 SoC', en: 'Phone SoC' }, arch: 'TSMC 4 nm', cores: '1× X4 + 5× A720 + 2× A520 · Adreno 750', clock: '3.3 / 3.2 / 3.0 / 2.3 GHz', tdp: '', tj: '', die: '', src: ['https://notebookcheck.net/Qualcomm-Snapdragon-8-Gen-3-Processor-Benchmarks-and-Specs.762133.0.html'] },
  ]
};

/* Generic layout templates for the simplified simulation (fractions of the domain; schematic, not vendor floorplans). */
function grid(x, y, w, h, nx, ny, k, n, gap, start) {
  var out = [], g = gap == null ? 0.006 : gap, cw = (w - g * (nx - 1)) / nx, ch = (h - g * (ny - 1)) / ny;
  for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++) out.push({ k: k, n: n + ' ' + ((start || 0) + j * nx + i + 1), r: [x + i * (cw + g), y + j * (ch + g), cw, ch] });
  return out;
}
var CORE = { zh: '核心', en: 'core' };
window.TML_TEMPLATES = {
  laptop: { aspect: 1.4, mono: true, R: 1.2, Ta: 40, ihs: false,
    note: { zh: '模板：笔记本单片 SoC，P / E 核、GPU、NPU、内存接口（示意）。热阻按轻薄本估计。', en: 'Template: thin-laptop SoC with P / E cores, GPU, NPU, memory interface (schematic). Resistance assumed for a thin laptop.' },
    blocks: [].concat(grid(0.02, 0.04, 0.34, 0.44, 2, 2, 'core', 'P'), grid(0.02, 0.52, 0.34, 0.44, 2, 2, 'ecore', 'E'),
      [{ k: 'gpu', n: 'GPU', r: [0.38, 0.04, 0.36, 0.60] }, { k: 'npu', n: 'NPU', r: [0.76, 0.04, 0.22, 0.44] }, { k: 'cache', n: { zh: '缓存', en: 'cache' }, r: [0.38, 0.66, 0.36, 0.30] }, { k: 'io', n: 'IO / IMC', r: [0.76, 0.52, 0.22, 0.44] }]),
    loads: { all: { name: { zh: 'CPU 满载', en: 'CPU load' }, share: { core: 0.65, ecore: 0.15, cache: 0.08, io: 0.07, gpu: 0.05 } }, gpu: { name: { zh: 'GPU 负载', en: 'GPU load' }, share: { gpu: 0.7, core: 0.12, io: 0.1, cache: 0.08 } }, npu: { name: { zh: 'NPU 推理', en: 'NPU inference' }, share: { npu: 0.6, io: 0.2, cache: 0.1, core: 0.1 } } } },
  apu: { aspect: 1.35, mono: true, R: 1.5, Ta: 40, ihs: false,
    note: { zh: '模板：4 大核 + 8 小核、16 CU 核显、NPU（示意）。', en: 'Template: 4 big + 8 compact cores, 16-CU iGPU, NPU (schematic).' },
    blocks: [].concat(grid(0.02, 0.04, 0.26, 0.42, 2, 2, 'core', 'Zen 5'), grid(0.02, 0.52, 0.26, 0.44, 4, 2, 'ecore', 'Zen 5c'),
      [{ k: 'cache', n: 'L3', r: [0.30, 0.04, 0.12, 0.92] }, { k: 'gpu', n: 'Radeon 890M', r: [0.44, 0.04, 0.34, 0.62] }, { k: 'npu', n: 'XDNA NPU', r: [0.80, 0.04, 0.18, 0.40] }, { k: 'io', n: 'IO / IMC', r: [0.44, 0.70, 0.54, 0.26] }]),
    loads: { all: { name: { zh: 'CPU 满载', en: 'CPU load' }, share: { core: 0.5, ecore: 0.3, cache: 0.08, io: 0.07, gpu: 0.05 } }, gpu: { name: { zh: '游戏（GPU 为主）', en: 'gaming (GPU-heavy)' }, share: { gpu: 0.6, core: 0.2, io: 0.1, cache: 0.1 } }, npu: { name: { zh: 'NPU 推理', en: 'NPU inference' }, share: { npu: 0.6, io: 0.2, cache: 0.1, core: 0.1 } } } },
  chiplet: { aspect: 1.15, R: 0.15, Ta: 30, ihs: true,
    note: { zh: '模板：2 个 CCD（每个 8 核 + L3）+ 1 个 IOD，按面积比例摆在铜盖下；硅片之间无硅，靠铜盖横向导热。', en: 'Template: 2 CCDs (8 cores + L3 each) + 1 IOD in area proportion under the lid; no silicon between dies, the copper lid spreads heat.' },
    blocks: [].concat(grid(0.10, 0.08, 0.30, 0.13, 4, 1, 'core', 'CCD0 core'), [{ k: 'cache', n: 'CCD0 L3', r: [0.10, 0.215, 0.30, 0.085] }], grid(0.10, 0.31, 0.30, 0.13, 4, 1, 'core', 'CCD0 core', null, 4),
      grid(0.10, 0.52, 0.30, 0.13, 4, 1, 'core2', 'CCD1 core'), [{ k: 'cache2', n: 'CCD1 L3', r: [0.10, 0.655, 0.30, 0.085] }], grid(0.10, 0.75, 0.30, 0.13, 4, 1, 'core2', 'CCD1 core', null, 4),
      [{ k: 'io', n: 'IOD', r: [0.52, 0.22, 0.40, 0.55] }]),
    loads: { all: { name: { zh: '16 核满载', en: '16-core load' }, share: { core: 0.36, core2: 0.36, cache: 0.05, cache2: 0.05, io: 0.18 } }, one: { name: { zh: '只用 CCD0（8 线程，约 60% 功耗）', en: 'CCD0 only (8 threads, ~60 % power)' }, pf: 0.6, share: { core: 0.7, cache: 0.08, io: 0.22 } } } },
};

/* Generic Intel ring-bus die (monolithic): P-cores and 4-core E-clusters in two rows around the ring / L3 strip,
   system agent + memory controller on the left, iGPU on the right. Positions are SCHEMATIC; counts follow the spec. */
var CPU_LOADS = {
  all: { name: { zh: '全核满载', en: 'all-core load' }, share: { core: 0.62, ecore: 0.26, cache: 0.06, io: 0.04, gpu: 0.02 } },
  one: { name: { zh: '单个 P 核突发（约 15% 功耗）', en: 'single P-core burst (~15 % power)' }, pf: 0.15, share: { core: 1 }, only: [0] },
  gpu: { name: { zh: '核显负载（约 40% 功耗）', en: 'iGPU load (~40 % power)' }, pf: 0.4, share: { gpu: 0.7, cache: 0.1, io: 0.1, core: 0.1 } }
};
window.TML_CPU = function (g) {
  var B = [], gap = 0.008, pOn = g.pOn == null ? g.p : g.pOn, eOn = g.eOn == null ? g.e : g.eOn;
  var x0 = 0.09, x1 = 1 - g.gpuW - 0.01, ringH = 0.16, rowH = (1 - ringH - 2 * gap) / 2;
  var units = Math.ceil(g.p / 2) + Math.ceil(g.e / 2), uw = (x1 - x0 - gap * (units - 1)) / units;
  var rows = [[0, Math.ceil(g.p / 2), Math.ceil(g.e / 2)], [rowH + ringH + 2 * gap, Math.floor(g.p / 2), Math.floor(g.e / 2)]], pi = 0, ei = 0;
  rows.forEach(function (r) {
    var x = x0;
    for (var i = 0; i < r[1]; i++, pi++, x += uw + gap) B.push({ k: pi < pOn ? 'core' : 'coreoff', n: 'P' + (pi + 1), r: [x, r[0], uw, rowH] });
    for (i = 0; i < r[2]; i++, ei++, x += uw + gap) B.push({ k: ei < eOn ? 'ecore' : 'ecoreoff', n: 'E' + (ei + 1), s: 'E×4', r: [x, r[0], uw, rowH] });
  });
  B.push({ k: 'cache', n: { zh: '环形总线 / L3', en: 'ring / L3' }, s: 'L3', r: [x0, rowH + gap, x1 - x0, ringH] });
  B.push({ k: 'io', n: { zh: '系统代理 / 内存控制器', en: 'system agent / IMC' }, s: 'SA', r: [0, 0, x0 - gap, 1] });
  B.push({ k: 'gpu', n: g.gpuName || { zh: '核显', en: 'iGPU' }, r: [x1 + gap, 0, 1 - x1 - gap, 1] });
  var ld = JSON.parse(JSON.stringify(CPU_LOADS)), wP = pOn, wE = 0.8 * eOn; /* an active 4-core E-cluster draws ~0.8× a P-core (assumed) */
  ld.all.share.core = 0.88 * wP / (wP + wE); ld.all.share.ecore = 0.88 * wE / (wP + wE);
  return { aspect: g.aspect || 2, mono: true, ihs: true, R: 0.15, Ta: 30, blocks: B, loads: ld,
    note: { zh: '按核心数生成的环形总线布局（示意）。', en: 'Ring-bus layout generated from core counts (schematic).' } };
};

/* Generic Intel Foveros tile package: compute / GPU / SoC / IO tiles sized by their published areas, no silicon in between. */
window.TML_TILES = function (g) {
  var m = g.mm, tot = m.c + m.g + m.s + m.i, fill = 0.62, f = function (a) { return a / tot * fill; }, B = [], gap = 0.006;
  var pOn = g.pOn == null ? g.p : g.pOn, eOn = g.eOn == null ? g.e : g.eOn;
  var hS = 0.84, wL = (f(m.c) + f(m.i)) / hS, wR = (f(m.g) + f(m.s)) / hS, sp = (1 - wL - wR) / 3;
  var xL = sp, xR = 2 * sp + wL, yT = 0.08, hC = f(m.c) / wL, hI = f(m.i) / wL, hG = f(m.g) / wR, hSo = f(m.s) / wR;
  /* compute tile: P-cores and E-clusters around an L3 strip */
  var cy = yT, units = Math.ceil(g.p / 2) + Math.ceil(g.e / 2), uw = (wL - gap * (units + 1)) / units, rh = (hC - 0.2 * hC - 3 * gap) / 2, pi = 0, ei = 0;
  [[cy + gap, Math.ceil(g.p / 2), Math.ceil(g.e / 2)], [cy + hC - gap - rh, Math.floor(g.p / 2), Math.floor(g.e / 2)]].forEach(function (r) {
    var x = xL + gap;
    for (var i = 0; i < r[1]; i++, pi++, x += uw + gap) B.push({ k: pi < pOn ? 'core' : 'coreoff', n: 'P' + (pi + 1), r: [x, r[0], uw, rh] });
    for (i = 0; i < r[2]; i++, ei++, x += uw + gap) B.push({ k: ei < eOn ? 'ecore' : 'ecoreoff', n: 'E' + (ei + 1), s: 'E×4', r: [x, r[0], uw, rh] });
  });
  B.push({ k: 'cache', n: { zh: '环形总线 / L3', en: 'ring / L3' }, s: 'L3', r: [xL + gap, cy + gap * 2 + rh, wL - 2 * gap, hC - 2 * rh - 4 * gap] });
  B.push({ k: 'io', n: { zh: 'IO tile（PCIe / 雷电）', en: 'IO tile (PCIe / Thunderbolt)' }, s: 'IO', r: [xL, yT + hC + 0.04, wL, hI] });
  B.push({ k: 'gpu', n: { zh: 'GPU tile', en: 'GPU tile' }, s: 'GPU', r: [xR, yT, wR, hG] });
  /* SoC tile: memory controller, NPU, media / display and (Meteor Lake) LP-E cores */
  var sy = yT + hG + 0.04, sh = hSo, cw = (wR - 3 * gap) / 2, ch = (sh - 3 * gap) / 2;
  B.push({ k: 'mc', n: { zh: '内存控制器', en: 'memory controller' }, s: 'IMC', r: [xR + gap, sy + gap, cw, ch] });
  B.push({ k: 'npu', n: 'NPU', r: [xR + 2 * gap + cw, sy + gap, cw, ch] });
  B.push({ k: 'media', n: { zh: '媒体 / 显示', en: 'media / display' }, s: { zh: '媒体', en: 'media' }, r: [xR + gap, sy + 2 * gap + ch, cw, ch] });
  B.push({ k: g.lpe ? 'lpe' : 'soc', n: g.lpe ? { zh: 'LP-E 核 ×' + g.lpe, en: 'LP-E cores ×' + g.lpe } : { zh: 'SoC 其他', en: 'SoC other' }, s: g.lpe ? 'LP-E' : 'SoC', r: [xR + 2 * gap + cw, sy + 2 * gap + ch, cw, ch] });
  return { aspect: 1.5, mono: false, ihs: true, R: 0.15, Ta: 30, blocks: B,
    loads: {
      all: { name: { zh: 'CPU 满载', en: 'CPU load' }, share: { core: 0.82 * pOn / (pOn + 0.8 * eOn), ecore: 0.82 * 0.8 * eOn / (pOn + 0.8 * eOn), cache: 0.06, mc: 0.05, lpe: 0.01, soc: 0.01, io: 0.03, gpu: 0.03 } },
      one: { name: { zh: '单个 P 核突发（约 15% 功耗）', en: 'single P-core burst (~15 % power)' }, pf: 0.15, share: { core: 1 }, only: [0] },
      gpu: { name: { zh: '核显负载（约 50% 功耗）', en: 'iGPU load (~50 % power)' }, pf: 0.5, share: { gpu: 0.6, mc: 0.12, core: 0.1, cache: 0.06, media: 0.04, io: 0.04, lpe: 0.04, soc: 0.04 } },
      npu: { name: { zh: 'NPU 推理（约 25% 功耗）', en: 'NPU inference (~25 % power)' }, pf: 0.25, share: { npu: 0.55, mc: 0.2, lpe: 0.1, soc: 0.1, cache: 0.05, core: 0.1 } },
      video: { name: { zh: '视频播放（约 10% 功耗）', en: 'video playback (~10 % power)' }, pf: 0.1, share: { media: 0.45, mc: 0.2, lpe: 0.25, soc: 0.25, gpu: 0.1 } }
    },
    note: { zh: '各 tile 面积按公开数据，位置为示意；tile 之间无硅，靠铜盖横向导热。', en: 'Tile areas from published data, positions schematic; no silicon between tiles, the lid spreads heat.' } };
};

/* Module kinds: legend name, short label and floorplan colour (shared by every template). */
window.TML_KINDS = {
  core: { n: { zh: 'CPU 核心（P 核）', en: 'CPU core (P-core)' }, c: '#3B6FD6' }, core2: { n: { zh: 'CPU 核心（CCD1）', en: 'CPU core (CCD1)' }, c: '#5A86E0' },
  ecore: { n: { zh: '能效核', en: 'E-core' }, c: '#2AA6A6' }, cache: { n: { zh: '缓存', en: 'cache' }, c: '#8A5BE0' }, cache2: { n: { zh: '缓存（CCD1）', en: 'cache (CCD1)' }, c: '#A07EE8' },
  gpu: { n: { zh: '核显', en: 'iGPU' }, c: '#3FA21C' }, npu: { n: 'NPU', c: '#C2477F' }, soc: { n: { zh: 'SoC / 低功耗岛', en: 'SoC / low-power island' }, c: '#D08A1E' },
  io: { n: { zh: 'IO / PCIe / 显示', en: 'IO / PCIe / display' }, c: '#7C8790' },
  gpc: { n: { zh: 'GPC（SM / 光追 / Tensor 核）', en: 'GPC (SMs, RT, Tensor cores)' }, c: '#3FA21C' },
  coreoff: { n: { zh: 'P 核（本型号未启用）', en: 'P-core (disabled on this SKU)' }, c: '#9AA5AE' }, ecoreoff: { n: { zh: 'E 核簇（本型号未启用）', en: 'E-cluster (disabled on this SKU)' }, c: '#B7C0C7' },
  lpe: { n: { zh: '低功耗 E 核', en: 'LP E-core' }, c: '#5FC7C7' },   gpcoff: { n: { zh: 'GPC（本型号未启用）', en: 'GPC (disabled on this SKU)' }, c: '#9AA5AE' },
  l2: { n: { zh: 'L2 缓存', en: 'L2 cache' }, c: '#8A5BE0' }, fe: { n: { zh: '前端 / GigaThread 调度', en: 'front end / GigaThread' }, c: '#2AA6A6' },
  mc: { n: { zh: '内存 / 显存控制器 + PHY', en: 'memory controller + PHY' }, c: '#D08A1E' }, mcoff: { n: { zh: '显存控制器（未启用）', en: 'memory controller (disabled)' }, c: '#B7C0C7' },
  media: { n: { zh: '媒体引擎（编解码）+ 显示', en: 'media engine (codec) + display' }, c: '#C2477F' },
  nvl: { n: 'NVLink', c: '#3B6FD6' }
};

/* Generic NVIDIA-style GPU floorplan from public counts (GPCs, 32-bit memory controllers or HBM sites).
   Block positions are SCHEMATIC: GPCs in two rows around an L2 strip, memory PHYs on the edges, host / media at top and bottom. */
window.TML_GPU = function (g) {
  var on = g.on == null ? g.gpc : g.on, B = [], gap = 0.006, hbm = !!g.hbm;
  var ex = 0.075, top = 0.07, bot = 0.06, x0 = ex, x1 = 1 - ex, y0 = top, y1 = 1 - bot, l2h = hbm ? 0.09 : 0.13;
  var rows = [Math.ceil(g.gpc / 2), Math.floor(g.gpc / 2)], ry = [[y0, (y1 - y0 - l2h) / 2 - gap], [y0 + (y1 - y0 + l2h) / 2 + gap, (y1 - y0 - l2h) / 2 - gap]], idx = 0;
  rows.forEach(function (n, r) {
    if (!n) return; var cw = (x1 - x0 - gap * (n - 1)) / n;
    for (var i = 0; i < n; i++, idx++) { var off = idx >= on; B.push({ k: off ? 'gpcoff' : 'gpc', n: 'GPC ' + (idx + 1), r: [x0 + i * (cw + gap), ry[r][0], cw, ry[r][1]] }); }
  });
  var ly = y0 + (y1 - y0 - l2h) / 2;
  if (hbm) { B.push({ k: 'l2', n: 'L2', r: [x0, ly, (x1 - x0) / 2 - gap / 2, l2h] }, { k: 'l2', n: 'L2', r: [0.5 + gap / 2, ly, (x1 - x0) / 2 - gap / 2, l2h] }); }
  else B.push({ k: 'l2', n: 'L2', r: [x0, ly, (x1 - x0) * 0.78, l2h] }, { k: 'fe', n: 'GigaThread', s: 'FE', r: [x0 + (x1 - x0) * 0.78 + gap, ly, (x1 - x0) * 0.22 - gap, l2h] });
  /* memory PHYs: half on each side edge */
  var m = hbm ? g.hbm : g.mc, mOn = hbm ? (g.hbmOn == null ? m : g.hbmOn) : (g.mcOn == null ? m : g.mcOn), per = [Math.ceil(m / 2), Math.floor(m / 2)], j = 0;
  per.forEach(function (n, side) {
    var h = (1 - gap * (n - 1)) / n;
    for (var i = 0; i < n; i++, j++) { var off = j >= mOn; B.push({ k: off ? 'mcoff' : 'mc', n: hbm ? 'HBM ' + (j + 1) : 'MC ' + (j + 1), r: [side ? 1 - ex + gap : 0, i * (h + gap), ex - gap, h] }); }
  });
  if (hbm) {
    B.push({ k: 'nvl', n: 'NVLink', r: [x0, 0, (x1 - x0) * 0.7, top - gap] }, { k: 'io', n: 'PCIe', r: [x0 + (x1 - x0) * 0.7 + gap, 0, (x1 - x0) * 0.3 - gap, top - gap] },
      { k: 'nvl', n: 'NVLink', r: [x0, y1 + gap, (x1 - x0) * 0.7, bot - gap] }, { k: 'media', n: 'NVDEC / JPEG', s: 'NVDEC', r: [x0 + (x1 - x0) * 0.7 + gap, y1 + gap, (x1 - x0) * 0.3 - gap, bot - gap] });
  } else {
    B.push({ k: 'io', n: { zh: 'PCIe 接口', en: 'PCIe' }, s: 'PCIe', r: [x0, 0, (x1 - x0) * 0.5, top - gap] }, { k: 'media', n: 'NVENC / NVDEC', s: 'NV-ENC', r: [x0 + (x1 - x0) * 0.5 + gap, 0, (x1 - x0) * 0.5 - gap, top - gap] },
      { k: 'io', n: { zh: '显示输出', en: 'display' }, s: 'DISP', r: [x0, y1 + gap, x1 - x0, bot - gap] });
  }
  var loads = hbm ? {
    train: { name: { zh: 'AI 训练（算力满载）', en: 'AI training (compute-bound)' }, share: { gpc: 0.78, l2: 0.07, mc: 0.10, nvl: 0.04, io: 0.01 } },
    infer: { name: { zh: '大模型推理（显存带宽受限）', en: 'LLM inference (bandwidth-bound)' }, share: { gpc: 0.55, l2: 0.15, mc: 0.25, nvl: 0.04, io: 0.01 } },
    comm: { name: { zh: '多卡通信（NVLink 繁忙）', en: 'multi-GPU comms (NVLink busy)' }, share: { gpc: 0.5, l2: 0.12, mc: 0.16, nvl: 0.2, io: 0.02 } }
  } : {
    game: { name: { zh: '游戏（光栅 + 光追）', en: 'gaming (raster + RT)' }, share: { gpc: 0.735, l2: 0.08, mc: 0.13, fe: 0.015, media: 0.01, io: 0.03 } },
    ai: { name: { zh: 'AI / 计算（Tensor 核满载）', en: 'AI / compute (Tensor cores busy)' }, share: { gpc: 0.81, l2: 0.08, mc: 0.09, fe: 0.01, io: 0.01 } },
    mem: { name: { zh: '显存带宽受限', en: 'memory-bound' }, share: { gpc: 0.465, l2: 0.18, mc: 0.30, fe: 0.015, io: 0.04 } },
    video: { name: { zh: '视频编码（NVENC，约 25% 功耗）', en: 'video encode (NVENC, ~25 % power)' }, pf: 0.25, share: { media: 0.35, mc: 0.2, l2: 0.1, gpc: 0.25, fe: 0.05, io: 0.05 } }
  };
  return { aspect: g.aspect || 1.3, mono: true, ihs: false, R: hbm ? 0.045 : null, Ta: hbm ? 30 : 35, blocks: B, loads: loads,
    note: { zh: (hbm ? 'HBM 堆叠在硅片外，未建模；默认功耗为整个模块额定值（含 HBM）' : '默认功耗为整卡功耗（含显存、供电损耗）') + '，芯片本身略低，结果偏保守。' + (g.gpcEst ? 'GA106 的 GPC 数未在一手资料中核实。' : ''),
      en: (hbm ? 'HBM stacks sit beside the die and are not modelled; default power is the whole module rating (incl. HBM)' : 'Default power is total board power (incl. memory and VRM losses)') + ', so results are conservative.' + (g.gpcEst ? ' GA106 GPC count not verified from a primary source.' : '') } };
};

