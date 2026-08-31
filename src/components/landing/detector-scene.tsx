"use client";

/**
 * Mặt cắt máy dò: các vòng detector đồng tâm, track cong toả từ tâm,
 * thanh calorimeter đỏ ở vành ngoài. Toàn bộ hình học tính sẵn ở module
 * scope (thuần hàm, không random) nên SSR ổn định.
 */

const CX = 300;
const CY = 300;

function polar(r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

function fmt(n: number): string {
  return n.toFixed(1);
}

/** Track cong kiểu hạt tích điện trong từ trường: cubic bezier lệch góc dần. */
function trackPath(angle: number, reach: number, curl: number): string {
  const [x0, y0] = polar(6, angle);
  const [x1, y1] = polar(reach * 0.35, angle + curl * 0.3);
  const [x2, y2] = polar(reach * 0.72, angle + curl * 0.72);
  const [x3, y3] = polar(reach, angle + curl);
  return `M ${fmt(x0)} ${fmt(y0)} C ${fmt(x1)} ${fmt(y1)}, ${fmt(x2)} ${fmt(y2)}, ${fmt(x3)} ${fmt(y3)}`;
}

/** Thanh calorimeter: đoạn thẳng hướng tâm, vẽ bằng stroke để animate như bar. */
function caloBar(angle: number, innerR: number, len: number) {
  const [x1, y1] = polar(innerR, angle);
  const [x2, y2] = polar(innerR + len, angle);
  return { x1: fmt(x1), y1: fmt(y1), x2: fmt(x2), y2: fmt(y2) };
}

// Track chi tiêu (vàng): góc, tầm bay, độ cong — mỗi track một danh mục.
const EXPENSE_TRACKS = [
  { angle: 24, reach: 236, curl: 38 },
  { angle: 58, reach: 190, curl: -52 },
  { angle: 96, reach: 214, curl: 44 },
  { angle: 132, reach: 168, curl: -64 },
  { angle: 168, reach: 226, curl: 30 },
  { angle: 204, reach: 158, curl: 72 },
  { angle: 238, reach: 200, curl: -40 },
  { angle: 276, reach: 176, curl: 56 },
  { angle: 312, reach: 144, curl: -78 },
  { angle: 342, reach: 208, curl: 34 },
];

// Track động lượng thấp: cuộn xoắn ngắn gần tâm, tạo mật độ va chạm.
const SOFT_TRACKS = [
  { angle: 40, reach: 96, curl: 118 },
  { angle: 84, reach: 78, curl: -132 },
  { angle: 150, reach: 108, curl: 96 },
  { angle: 196, reach: 84, curl: -110 },
  { angle: 254, reach: 100, curl: 124 },
  { angle: 296, reach: 72, curl: -96 },
  { angle: 328, reach: 112, curl: 88 },
];

// Track ngân sách (cyan): cứng, gần như thẳng, xuyên tới buồng ngoài.
const INCOME_TRACKS = [
  { angle: 350, reach: 282, curl: 4 },
  { angle: 8, reach: 282, curl: -3 },
];

// Calorimeter: cụm thanh đỏ ở cung 20°–110° (phía trên bên phải).
const CALO_BARS = [
  { angle: 26, len: 58 },
  { angle: 34, len: 42 },
  { angle: 42, len: 66 },
  { angle: 54, len: 30 },
  { angle: 62, len: 50 },
  { angle: 74, len: 72 },
  { angle: 82, len: 38 },
  { angle: 94, len: 54 },
  { angle: 102, len: 26 },
];

const CALO_INNER = 216;

// Vệt hit nhỏ trên các vòng tracker (chấm dữ liệu).
const HITS = [
  { r: 64, angle: 30 }, { r: 64, angle: 118 }, { r: 64, angle: 244 },
  { r: 92, angle: 62 }, { r: 92, angle: 170 }, { r: 92, angle: 318 },
  { r: 120, angle: 20 }, { r: 120, angle: 96 }, { r: 120, angle: 206 },
  { r: 120, angle: 282 }, { r: 148, angle: 140 }, { r: 148, angle: 348 },
];

// Nhãn leader-line (desktop): node ghim vào cuối track/thanh đo, kẻ tới chữ.
const LABELS: {
  node: [number, number];
  elbow: [number, number];
  text: [number, number];
  anchor: "start" | "end";
  value: string;
  color: string;
}[] = [
  {
    node: polar(282, 5),
    elbow: [352, 56],
    text: [358, 62],
    anchor: "start",
    value: "NGÂN SÁCH 18.000.000",
    color: "var(--track-cyan)",
  },
  {
    node: polar(CALO_INNER + 72, 74),
    elbow: [560, 158],
    text: [566, 150],
    anchor: "end",
    value: "ĐÃ DÙNG 69%",
    color: "var(--energy-red)",
  },
  {
    node: polar(226, 198),
    elbow: [196, 552],
    text: [204, 570],
    anchor: "start",
    value: "ĂN UỐNG 4.300.000",
    color: "var(--track-yellow)",
  },
  {
    node: polar(214, 140),
    elbow: [508, 496],
    text: [560, 516],
    anchor: "end",
    value: "DI CHUYỂN 1.620.000",
    color: "var(--track-yellow)",
  },
];

function TrackPaths({ glow }: { glow?: boolean }) {
  const mul = glow ? 2.6 : 1;
  return (
    <>
      {SOFT_TRACKS.map((t, i) => (
        <path
          key={`s${i}`}
          className="pf-track pf-track-expense"
          d={trackPath(t.angle, t.reach, t.curl)}
          fill="none" stroke="var(--track-yellow)"
          strokeWidth={1.2 * mul} strokeLinecap="round"
          opacity={glow ? 0.35 : 0.55}
        />
      ))}
      {EXPENSE_TRACKS.map((t, i) => (
        <path
          key={`e${i}`}
          className="pf-track pf-track-expense"
          d={trackPath(t.angle, t.reach, t.curl)}
          fill="none" stroke="var(--track-yellow)"
          strokeWidth={1.8 * mul} strokeLinecap="round"
          opacity={glow ? 0.5 : 0.9}
        />
      ))}
      {INCOME_TRACKS.map((t, i) => (
        <path
          key={`i${i}`}
          className="pf-track pf-track-income"
          d={trackPath(t.angle, t.reach, t.curl)}
          fill="none" stroke="var(--track-cyan)"
          strokeWidth={2.6 * mul} strokeLinecap="round"
          opacity={glow ? 0.5 : 1}
        />
      ))}
      {CALO_BARS.map((b, i) => {
        const seg = caloBar(b.angle, CALO_INNER, b.len);
        return (
          <line
            key={`c${i}`}
            className="pf-calo"
            x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
            stroke="var(--energy-red)" strokeWidth={13 * (glow ? 1.8 : 1)}
            opacity={glow ? 0.45 : 1}
          />
        );
      })}
    </>
  );
}

export function DetectorScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      role="img"
      aria-label="Mặt cắt máy dò: các khoản chi trong tháng hiện thành đường bay quanh tâm, kèm thanh đo ngân sách"
      className={className}
    >
      <defs>
        <filter id="pf-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <radialGradient id="pf-vignette" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ring-steel)" stopOpacity="0.22" />
          <stop offset="55%" stopColor="var(--ring-steel)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--ring-steel)" stopOpacity="0" />
        </radialGradient>
        <pattern id="pf-mesh" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="var(--ring-steel)" opacity="0.55" />
        </pattern>
      </defs>

      {/* Nền sâu phía sau máy dò */}
      <circle className="pf-ring" cx={CX} cy={CY} r={292} fill="url(#pf-vignette)" />

      {/* Vành buồng ngoài (muon chambers) */}
      <circle
        className="pf-ring"
        cx={CX} cy={CY} r={282}
        fill="none" stroke="var(--ring-steel)" strokeWidth={10}
        strokeDasharray="34 30" opacity={0.32}
      />
      <circle
        className="pf-ring"
        cx={CX} cy={CY} r={258}
        fill="none" stroke="var(--ring-steel)" strokeWidth={4}
        strokeDasharray="6 18" opacity={0.4}
      />

      {/* Vành calorimeter nền + vân thép */}
      <circle
        className="pf-ring"
        cx={CX} cy={CY} r={216}
        fill="none" stroke="var(--steel)" strokeWidth={26} opacity={0.55}
      />
      <circle
        className="pf-ring"
        cx={CX} cy={CY} r={216}
        fill="none" stroke="url(#pf-mesh)" strokeWidth={26} opacity={0.5}
      />
      <circle
        className="pf-ring"
        cx={CX} cy={CY} r={188}
        fill="none" stroke="var(--ring-steel)" strokeWidth={12}
        strokeDasharray="16 10" opacity={0.45}
      />

      {/* Các vòng tracker trong */}
      {[64, 92, 120, 148].map((r, i) => (
        <circle
          key={r}
          className="pf-ring"
          cx={CX} cy={CY} r={r}
          fill="none" stroke="var(--ring-steel)"
          strokeWidth={i === 3 ? 2 : 1.5}
          strokeDasharray={i % 2 === 0 ? "10 8" : "3 9"}
          opacity={0.5 - i * 0.04}
        />
      ))}

      {/* Ống beam + tâm va chạm */}
      <circle className="pf-ring" cx={CX} cy={CY} r={20} fill="none" stroke="var(--ring-steel)" strokeWidth={1.5} opacity={0.8} />
      <circle className="pf-vertex" cx={CX} cy={CY} r={5} fill="var(--track-yellow)" />
      <circle className="pf-vertex-halo" cx={CX} cy={CY} r={11} fill="none" stroke="var(--track-yellow)" strokeWidth={1} opacity={0.5} />

      {/* Hit chấm dữ liệu */}
      {HITS.map((h, i) => {
        const [x, y] = polar(h.r, h.angle);
        return (
          <circle
            key={i}
            className="pf-hit"
            cx={fmt(x)} cy={fmt(y)} r={2.2}
            fill="var(--track-cyan)" opacity={0.7}
          />
        );
      })}

      {/* Lớp bloom phía dưới (desktop) rồi lớp nét chính */}
      <g filter="url(#pf-glow)" className="max-lg:hidden" aria-hidden="true">
        <TrackPaths glow />
      </g>
      <TrackPaths />

      {/* Nhãn leader-line (desktop) */}
      <g className="pf-scene-labels max-lg:hidden" aria-hidden="true">
        {LABELS.map((l, i) => (
          <g key={i}>
            <polyline
              points={`${fmt(l.node[0])},${fmt(l.node[1])} ${l.elbow[0]},${l.elbow[1]}`}
              fill="none" stroke={l.color} strokeWidth={1} opacity={0.65}
            />
            <circle cx={fmt(l.node[0])} cy={fmt(l.node[1])} r={3} fill="none" stroke={l.color} strokeWidth={1.2} />
            <text
              x={l.text[0]} y={l.text[1]}
              textAnchor={l.anchor}
              fill={l.color}
              style={{ fontFamily: "var(--font-pf-mono), monospace", fontSize: 13, letterSpacing: "0.08em" }}
            >
              {l.value}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
