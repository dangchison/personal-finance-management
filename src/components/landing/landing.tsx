"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DetectorScene } from "@/components/landing/detector-scene";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { RingMark } from "@/components/brand/ring-mark";
import { formatNumber } from "@/lib/format-currency";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DEMO_TRANSACTIONS = [
  { id: "GD-0129", label: "Ăn trưa bún chả", method: "TIỀN MẶT", amount: -45000 },
  { id: "GD-0128", label: "Grab đi làm", method: "CK", amount: -32000 },
  { id: "GD-0127", label: "Siêu thị cuối tuần", method: "CK", amount: -486000 },
  { id: "GD-0126", label: "Tiền điện tháng 8", method: "CK", amount: -742000 },
  { id: "GD-0125", label: "Cà phê với khách", method: "TIỀN MẶT", amount: -68000 },
];

const LAYERS = [
  {
    id: "tracker",
    name: "LỚP 01 · BUỒNG GHI VẾT",
    title: "Ghi một khoản mất vài giây",
    body: "Bàn phím số bật sẵn, gõ 45000 là thành 45.000. Chọn tiền ra hay tiền vào, tiền mặt hay chuyển khoản, xong. Giao dịch tự xếp theo ngày, không phải nhớ tới tối.",
    color: "var(--track-yellow)",
  },
  {
    id: "calo",
    name: "LỚP 02 · BUỒNG ĐO NGÂN SÁCH",
    title: "Ngân sách đo được, không đoán",
    body: "Đặt hạn mức cho ăn uống, đi lại, mua sắm. Mỗi khoản chi nạp thẳng vào thanh đo của danh mục đó. Vượt hạn mức thì thanh chuyển đỏ, thấy ngay chứ không đợi cuối tháng.",
    color: "var(--energy-red)",
  },
  {
    id: "spectro",
    name: "LỚP 03 · BUỒNG PHÂN TÍCH",
    title: "Tiền tháng này đi đâu",
    body: "Vòng tròn phân bổ theo danh mục, dòng tiền từng ngày, sáu tháng gần đây, và năm nay so với năm ngoái. Mở báo cáo là thấy tháng này lệch chỗ nào.",
    color: "var(--track-cyan)",
  },
  {
    id: "family",
    name: "LỚP 04 · BUỒNG GIA ĐÌNH",
    title: "Sổ riêng và sổ chung, cùng một chỗ",
    body: "Tạo nhóm rồi gửi mã mời cho người nhà. Chi tiêu cá nhân vẫn riêng, chi tiêu chung xem được cả nhóm, lọc theo từng người.",
    color: "var(--ok-green)",
  },
];

const NIGHTLY_QUESTIONS = [
  {
    q: "Hôm nay tiêu bao nhiêu?",
    a: "Mở app, số chi trong ngày nằm ngay đầu danh sách, nhóm sẵn theo ngày.",
  },
  {
    q: "Còn bao nhiêu tới cuối tháng?",
    a: "Thanh ngân sách từng danh mục cho biết đã dùng bao nhiêu phần trăm.",
  },
  {
    q: "Có khoản nào bất thường không?",
    a: "Biểu đồ theo ngày làm nổi những hôm chi vọt lên so với phần còn lại.",
  },
];

const COMPARISON = [
  {
    left: "Chỉ thấy giao dịch của đúng tài khoản đó",
    right: "Tiền mặt, chuyển khoản, nhiều nguồn nằm chung một sổ",
  },
  {
    left: "Tên giao dịch là chuỗi mã của máy POS",
    right: "Bạn tự ghi một dòng, tháng sau đọc vẫn hiểu",
  },
  {
    left: "Không biết bạn định tiêu bao nhiêu",
    right: "Đặt hạn mức trước, app đo theo thời gian thực",
  },
  {
    left: "Vợ chồng mỗi người một app riêng",
    right: "Nhóm gia đình chung, lọc được từng người",
  },
];

const STEPS = [
  {
    num: "01",
    name: "HIỆU CHUẨN",
    body: "Tạo tài khoản bằng email, mất chừng một phút.",
  },
  {
    num: "02",
    name: "VẬN HÀNH",
    body: "Ghi ngay lúc trả tiền, đứng ở quán cũng ghi được.",
  },
  {
    num: "03",
    name: "ĐỌC KẾT QUẢ",
    body: "Cuối tháng mở báo cáo, xem đi đâu và cần chỉnh gì.",
  },
];

const FAQ = [
  {
    q: "Miễn phí thật hay dùng thử rồi thu tiền?",
    a: "Miễn phí. Không có gói trả phí, không có bản pro, không quảng cáo. App này viết cho chính mình dùng nên không có mô hình bán hàng phía sau.",
  },
  {
    q: "Dữ liệu chi tiêu của tôi nằm ở đâu?",
    a: "Trong cơ sở dữ liệu của app, gắn với tài khoản của bạn. Không bán, không chia sẻ cho bên thứ ba, không kết nối tài khoản ngân hàng nên app cũng không thấy được sao kê của bạn.",
  },
  {
    q: "Có phải nhập thủ công từng khoản không?",
    a: "Có. App không đọc SMS ngân hàng và không kết nối API ngân hàng. Đổi lại bạn kiểm soát được tiền mặt, thứ mà mọi app tự động đều bỏ sót.",
  },
  {
    q: "Ghi được cả tiền vào chứ?",
    a: "Được. Trong form chọn tab Tiền vào là ghi lương, thưởng hay khoản ai đó trả lại.",
  },
  {
    q: "Nhà tôi hai người dùng chung được không?",
    a: "Được. Một người tạo nhóm gia đình rồi đưa mã mời, người kia nhập mã là vào. Mỗi người vẫn có sổ riêng, phần chung xem được cả hai.",
  },
];

const NOT_YET = [
  "Chi phí định kỳ tự lặp (tiền nhà, gói cước)",
  "Ví và số dư từng tài khoản ngân hàng",
  "Mục tiêu tiết kiệm",
  "Xuất file Excel hoặc CSV",
  "Đăng nhập bằng Google",
];

function LayerGlyph({ index, color }: { index: number; color: string }) {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      {[8, 13, 18, 22].map((r, i) => (
        <circle
          key={r}
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke={i === index ? color : "var(--ring-steel)"}
          strokeWidth={i === index ? 3 : 1.2}
          strokeDasharray={i === index ? "none" : "3 4"}
          opacity={i === index ? 1 : 0.55}
        />
      ))}
      <circle cx="24" cy="24" r="2" fill={color} />
    </svg>
  );
}

export function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Scroll nằm trên window nên snap phải lên <html>, không gắn được vào div gốc
  useEffect(() => {
    document.documentElement.classList.add("pf-snap");
    return () => {
      document.documentElement.classList.remove("pf-snap");
    };
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // Chuẩn bị stroke-draw cho track và thanh calorimeter
      const drawables = root.querySelectorAll<SVGGeometryElement>(
        ".pf-hero-scene .pf-track, .pf-hero-scene .pf-calo"
      );
      drawables.forEach((el) => {
        const len = el.getTotalLength();
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len}`;
      });

      const countUps = gsap.utils.toArray<HTMLElement>(".pf-count");

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduced, desktop } = ctx.conditions as {
            reduced: boolean;
            desktop: boolean;
          };

          if (reduced) {
            // Trạng thái tĩnh hoàn chỉnh: hiện hết, số đứng yên ở giá trị thật
            drawables.forEach((el) => {
              el.style.strokeDashoffset = "0";
            });
            countUps.forEach((el) => {
              el.textContent = formatNumber(Number(el.dataset.value ?? 0));
            });
            // Không có GSAP kéo lên thì bar kẹt ở translate-y-[130%]: trung hoà
            // rồi hiện/ẩn theo cùng mốc với nhánh thường, nhưng bằng set tức thì
            // (đổi hiển thị không phải chuyển động). Hiện cố định từ đầu sẽ tạo
            // hai khối vàng đè lên hero — phá Luật một nguồn sáng.
            const bar = root.querySelector<HTMLElement>(".pf-sticky-cta");
            if (bar) {
              bar.style.translate = "0px 0px";
              const setBar = (visible: boolean) =>
                gsap.set(bar, { yPercent: visible ? 0 : 120 });
              setBar(false);
              ScrollTrigger.create({
                trigger: ".pf-hero",
                start: "bottom 45%",
                end: "bottom 45%",
                onEnter: () => setBar(true),
                onLeaveBack: () => setBar(false),
              });
              // Section cuối đã có CTA vàng đặc của nó — bar phải nhường.
              ScrollTrigger.create({
                trigger: ".pf-final",
                start: "top 60%",
                end: "top 60%",
                onEnter: () => setBar(false),
                onLeaveBack: () => setBar(true),
              });
            }
            return;
          }

          // ── Hero: một khoảnh khắc dàn dựng duy nhất ──
          const intro = gsap.timeline({ defaults: { ease: "expo.out" } });

          intro
            .from(".pf-hero-scene .pf-ring", {
              scale: 0.9,
              opacity: 0,
              transformOrigin: "50% 50%",
              duration: 0.9,
              stagger: 0.05,
            })
            .from(
              ".pf-hero-scene .pf-vertex, .pf-hero-scene .pf-vertex-halo",
              { scale: 0, transformOrigin: "50% 50%", duration: 0.5 },
              "-=0.6"
            )
            .to(
              ".pf-hero-scene .pf-track-expense",
              { strokeDashoffset: 0, duration: 1.1, ease: "power2.out", stagger: 0.04 },
              "-=0.4"
            )
            .to(
              ".pf-hero-scene .pf-track-income",
              { strokeDashoffset: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 },
              "-=0.8"
            )
            .to(
              ".pf-hero-scene .pf-calo",
              { strokeDashoffset: 0, duration: 0.6, ease: "power1.out", stagger: 0.04 },
              "-=0.6"
            )
            .from(
              ".pf-hero-scene .pf-hit",
              { scale: 0, transformOrigin: "50% 50%", duration: 0.3, stagger: 0.03 },
              "-=0.7"
            );

          gsap.from(".pf-hero-item", {
            y: 26,
            opacity: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.09,
          });

          // Số liệu count-up trong hero
          countUps.forEach((el) => {
            const target = Number(el.dataset.value ?? 0);
            const state = { v: 0 };
            el.textContent = "0";
            gsap.to(state, {
              v: target,
              duration: 1.6,
              delay: 0.5,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = formatNumber(Math.round(state.v));
              },
            });
          });

          // Tâm va chạm phập phồng nhẹ, tạm dừng khi hero ra khỏi màn
          gsap.to(".pf-hero-scene .pf-vertex-halo", {
            scale: 1.6,
            opacity: 0,
            transformOrigin: "50% 50%",
            duration: 2.2,
            repeat: -1,
            ease: "power1.out",
            scrollTrigger: {
              trigger: ".pf-hero",
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play pause resume pause",
            },
          });

          // ── Bản ghi: từng dòng trượt vào như dữ liệu đổ về ──
          gsap.from(".pf-log-row", {
            x: -18,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.09,
            scrollTrigger: { trigger: ".pf-log", start: "top 75%" },
          });

          // ── Các lớp máy dò ──
          const panels = gsap.utils.toArray<HTMLElement>(".pf-layer-panel");

          if (desktop) {
            // Diagram sticky ở ~320px từ đỉnh nên 4 trigger neo 50% viewport tạo
            // dead-zone giữa các panel: thay bằng MỘT trigger scrub trên cả cột,
            // chia progress làm 4 nấc; `current` chặn tween lặp mỗi frame.
            gsap.set(".pf-diagram-band", { opacity: 0.35, strokeWidth: 4 });
            gsap.set(".pf-diagram-band-0", { opacity: 1, strokeWidth: 12 });
            let current = 0;
            const panelCol = panels[0]?.parentElement;
            if (panelCol) {
              ScrollTrigger.create({
                trigger: panelCol,
                start: "top 40%",
                end: "bottom 40%",
                onUpdate: (self) => {
                  const i = Math.min(3, Math.max(0, Math.floor(self.progress * 4)));
                  if (i === current) return;
                  current = i;
                  gsap.to(".pf-diagram-band", {
                    opacity: 0.35,
                    strokeWidth: 4,
                    duration: 0.3,
                    overwrite: "auto",
                  });
                  gsap.to(`.pf-diagram-band-${i}`, {
                    opacity: 1,
                    strokeWidth: 12,
                    duration: 0.3,
                    overwrite: "auto",
                  });
                },
              });
            }
          }

          panels.forEach((panel) => {
            gsap.from(panel, {
              y: 30,
              opacity: 0,
              duration: 0.7,
              ease: "expo.out",
              scrollTrigger: { trigger: panel, start: "top 82%" },
            });
          });

          // ── Các khối nội dung còn lại: hiện theo lô khi lọt vào màn ──
          ScrollTrigger.batch(".pf-reveal", {
            start: "top 85%",
            onEnter: (batch) =>
              gsap.from(batch, {
                y: 22,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.08,
                overwrite: true,
              }),
          });

          // ── Quy trình: beam nối 3 bước tự vẽ theo scroll ──
          const beam = root.querySelector<SVGGeometryElement>(".pf-beam-line");
          if (beam) {
            const len = beam.getTotalLength();
            beam.style.strokeDasharray = `${len}`;
            beam.style.strokeDashoffset = `${len}`;
            gsap.to(beam, {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".pf-steps",
                start: "top 70%",
                end: "bottom 85%",
                scrub: 0.5,
              },
            });
          }

          gsap.from(".pf-step", {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: { trigger: ".pf-steps", start: "top 72%" },
          });

          // ── CTA cuối ──
          gsap.from(".pf-final > *", {
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".pf-final", start: "top 78%" },
          });

          // ── Thanh CTA dính đáy trên mobile, hiện sau khi rời hero ──
          if (!desktop) {
            // Class Tailwind giấu bar bằng property `translate`; GSAP điều khiển
            // `transform`, nên phải trung hoà translate trước khi animate.
            const bar = root.querySelector<HTMLElement>(".pf-sticky-cta");
            if (bar) bar.style.translate = "0px 0px";
            gsap.set(".pf-sticky-cta", { yPercent: 120 });
            const showBar = (visible: boolean) =>
              gsap.to(".pf-sticky-cta", {
                yPercent: visible ? 0 : 120,
                duration: 0.4,
                ease: "power3.out",
                overwrite: "auto",
              });
            ScrollTrigger.create({
              trigger: ".pf-hero",
              start: "bottom 45%",
              end: "bottom 45%",
              onEnter: () => showBar(true),
              onLeaveBack: () => showBar(false),
            });
            // Section cuối đã có CTA vàng đặc của nó — hai khối vàng cùng
            // viewport là phá Luật một nguồn sáng, bar phải nhường.
            ScrollTrigger.create({
              trigger: ".pf-final",
              start: "top 60%",
              end: "top 60%",
              onEnter: () => showBar(false),
              onLeaveBack: () => showBar(true),
            });
          }
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-(--steel) bg-(--vacuum)/85 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-16">
          <Link href="/" className="flex min-h-11 items-center gap-2.5">
            <RingMark className="h-7 w-7" />
            <span className="pf-display text-sm font-semibold tracking-[0.12em] whitespace-nowrap text-(--text-bright) max-[430px]:hidden">
              PERSONAL FINANCE
            </span>
          </Link>
          <nav className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link
              href="/login"
              className="flex h-11 items-center rounded-sm px-3 text-sm whitespace-nowrap text-(--text-steel) transition-colors hover:text-(--text-bright) focus-visible:outline-2 focus-visible:outline-(--track-yellow)"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="pf-display flex h-11 items-center rounded-sm border border-(--track-yellow) px-4 text-sm font-semibold tracking-wide whitespace-nowrap text-(--track-yellow-ink) transition-colors hover:bg-(--track-yellow) hover:text-(--pf-on-signal) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--track-yellow)"
            >
              Bắt đầu
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero — mobile xếp theo contract: H1, sub, CTA, số, rồi ring */}
        <section className="pf-hero pf-snap-target flex flex-col gap-5 px-4 pt-8 pb-16 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:px-10 lg:pt-16 lg:pb-24 xl:px-16">
          <div className="pf-hero-copy contents lg:block lg:space-y-7">
            <h1 className="pf-hero-item order-1 pf-display text-[2.2rem] leading-[1.1] font-bold tracking-tight text-(--text-bright) text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
              MỖI ĐỒNG CHI RA
              <br />
              ĐỀU ĐỂ LẠI <span className="text-(--track-yellow-ink)">VẾT</span>.
            </h1>

            <p className="pf-hero-item order-2 text-base leading-relaxed lg:max-w-2xl lg:text-lg">
              Ghi một khoản mất vài giây. Sổ này dựng lại đường đi của tiền trong tháng:
              chi theo danh mục, ngân sách còn bao nhiêu, xu hướng sáu tháng. Tiếng Việt,
              tính bằng đồng, miễn phí.
            </p>

            <div className="pf-hero-item order-3 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="pf-display flex h-12 items-center justify-center gap-2 rounded-sm bg-(--track-yellow) px-7 text-base font-bold tracking-wide text-(--pf-on-signal) transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--track-yellow)"
              >
                BẮT ĐẦU GHI — MIỄN PHÍ
              </Link>
              <Link
                href="/login"
                className="pf-display flex h-12 items-center justify-center rounded-sm border border-(--ring-steel) px-7 text-base font-semibold tracking-wide text-(--text-steel) transition-colors hover:border-(--track-cyan) hover:text-(--track-cyan-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--track-cyan)"
              >
                ĐĂNG NHẬP
              </Link>
            </div>

            <div className="pf-hero-item order-4">
              <dl className="pf-mono grid grid-cols-3 gap-px border border-(--steel) bg-(--steel) lg:max-w-2xl">
                <div className="bg-(--vacuum) p-2.5 sm:p-3">
                  <dt className="text-[10px] tracking-[0.1em] whitespace-nowrap text-(--text-steel)">CHI THÁNG NÀY</dt>
                  <dd className="mt-1 text-[13px] font-semibold whitespace-nowrap text-(--track-yellow-ink) sm:text-base">
                    <span className="pf-count" data-value="12450000">12.450.000</span> ₫
                  </dd>
                </div>
                <div className="bg-(--vacuum) p-2.5 sm:p-3">
                  <dt className="text-[10px] tracking-[0.1em] whitespace-nowrap text-(--text-steel)">NGÂN SÁCH</dt>
                  <dd className="mt-1 text-[13px] font-semibold whitespace-nowrap text-(--track-cyan-ink) sm:text-base">
                    <span className="pf-count" data-value="18000000">18.000.000</span> ₫
                  </dd>
                </div>
                <div className="bg-(--vacuum) p-2.5 sm:p-3">
                  <dt className="text-[10px] tracking-[0.1em] whitespace-nowrap text-(--text-steel)">CÒN LẠI</dt>
                  <dd className="mt-1 text-[13px] font-semibold whitespace-nowrap text-(--text-bright) sm:text-base">
                    <span className="pf-count" data-value="5550000">5.550.000</span> ₫
                  </dd>
                </div>
              </dl>
              <p className="pf-mono mt-1.5 text-[9px] tracking-[0.16em] text-(--text-steel)/80 lg:max-w-2xl lg:text-right">
                SỐ LIỆU MINH HOẠ
              </p>
            </div>

            <p className="pf-hero-item order-6 pf-mono flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs tracking-wide text-(--text-steel)">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-(--ok-green)" />
                MIỄN PHÍ 100%
              </span>
              <span>KHÔNG CẦN THẺ</span>
              <span>TIẾNG VIỆT · VND</span>
            </p>
          </div>

          <figure className="order-5 mx-auto w-full max-w-[320px] sm:max-w-[400px] lg:order-none lg:max-w-none">
            <DetectorScene className="pf-hero-scene h-auto w-full" />
            <figcaption className="pf-mono mt-2 space-y-1 text-[10px] tracking-[0.14em] text-(--text-steel)">
              <div className="flex items-center justify-between">
                <span>MẶT CẮT THÁNG 08/2026</span>
                <span>SỐ LIỆU MINH HOẠ</span>
              </div>
              <div>TÂM = TIỀN THÁNG CỦA BẠN · MỖI ĐƯỜNG BAY = MỘT KHOẢN CHI</div>
            </figcaption>
            <ul className="pf-mono mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] tracking-[0.12em] text-(--text-steel) lg:hidden">
              <li className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-(--track-yellow)" />
                CHI TIÊU THEO DANH MỤC
              </li>
              <li className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-(--track-cyan)" />
                NGÂN SÁCH
              </li>
              <li className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-(--energy-red)" />
                ĐÃ DÙNG 69%
              </li>
            </ul>
          </figure>
        </section>

        {/* Ba câu hỏi mỗi tối */}
        <section className="pf-snap-target border-y border-(--steel) bg-(--pf-subtle)/60">
          <div className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16 xl:px-16">
            <h2 className="pf-reveal pf-display text-2xl font-bold tracking-tight text-(--text-bright) text-balance sm:text-3xl">
              Ba câu hỏi bạn hay tự hỏi lúc đi ngủ
            </h2>
            <div className="mt-8 grid gap-px border border-(--steel) bg-(--steel) md:grid-cols-3">
              {NIGHTLY_QUESTIONS.map((item) => (
                <div key={item.q} className="pf-reveal bg-(--vacuum) p-5 lg:p-7">
                  <p className="pf-display text-lg font-bold text-(--track-yellow-ink)">{item.q}</p>
                  <p className="mt-3 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bản ghi tháng */}
        <section className="pf-log pf-snap-target px-4 py-14 sm:px-6 lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16 lg:px-10 lg:py-20 xl:px-16">
          <div>
            <h2 className="pf-reveal pf-display text-2xl font-bold tracking-tight text-(--text-bright) text-balance sm:text-3xl">
              Sổ tự viết, từng dòng một
            </h2>
            <p className="mt-4 leading-relaxed lg:max-w-xl">
              Không phải nhớ tới tối rồi ngồi kê lại. Trả tiền xong, mở app, gõ số, xong.
              Giao dịch tự nhóm theo ngày; tiền mặt và chuyển khoản tách riêng, chuyển khoản
              còn giữ được mã để sau này đối soát với sao kê.
            </p>
            <p className="mt-4 leading-relaxed lg:max-w-xl">
              Ghi nhầm thì sửa, ghi thừa thì xoá. Khoản đã xoá biến mất khỏi danh sách và
              khỏi mọi báo cáo.
            </p>
          </div>

          <div className="mt-8 border border-(--steel) bg-(--vacuum) lg:mt-0">
            <div className="pf-mono flex items-center justify-between border-b border-(--steel) px-4 py-2.5 text-[10px] tracking-[0.14em] text-(--text-steel)">
              <span className="text-(--track-yellow-ink)">TH-2026-08</span>
              <span>42 GIAO DỊCH</span>
              <span>SỐ LIỆU MINH HOẠ</span>
            </div>
            <ul className="divide-y divide-(--steel)/60">
              {DEMO_TRANSACTIONS.map((t) => (
                <li key={t.id} className="pf-log-row flex items-center gap-3 px-4 py-3">
                  <span className="pf-mono w-16 shrink-0 text-[11px] text-(--text-steel)">{t.id}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-(--text-bright)">{t.label}</span>
                  <span className="pf-mono hidden shrink-0 text-[10px] tracking-wide text-(--text-steel) sm:inline">
                    {t.method}
                  </span>
                  <span className="pf-mono shrink-0 text-sm font-semibold text-(--track-yellow-ink)">
                    −{formatNumber(Math.abs(t.amount))} ₫
                  </span>
                </li>
              ))}
            </ul>
            <div className="pf-mono grid grid-cols-3 gap-px border-t border-(--steel) bg-(--steel) text-center">
              <div className="bg-(--vacuum) px-2 py-3">
                <p className="text-[10px] tracking-[0.14em] text-(--text-steel)">NGÂN SÁCH</p>
                <p className="mt-1 text-sm font-semibold text-(--track-cyan-ink)">18.000.000</p>
              </div>
              <div className="bg-(--vacuum) px-2 py-3">
                <p className="text-[10px] tracking-[0.14em] text-(--text-steel)">CHI</p>
                <p className="mt-1 text-sm font-semibold text-(--track-yellow-ink)">−12.450.000</p>
              </div>
              <div className="bg-(--vacuum) px-2 py-3">
                <p className="text-[10px] tracking-[0.14em] text-(--text-steel)">CÒN LẠI</p>
                <p className="mt-1 text-sm font-semibold text-(--text-bright)">5.550.000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Các lớp máy dò */}
        <section className="pf-layers pf-snap-target border-t border-(--steel) px-4 py-16 sm:px-6 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-10 lg:py-24 xl:px-16">
          <div className="pf-layers-diagram hidden self-start lg:sticky lg:top-24 lg:block">
            <svg viewBox="0 0 400 400" className="w-full max-w-md" aria-hidden="true">
              {[70, 110, 150, 185].map((r, i) => (
                <circle
                  key={r}
                  className={`pf-diagram-band pf-diagram-band-${i}`}
                  cx="200"
                  cy="200"
                  r={r}
                  fill="none"
                  stroke={LAYERS[i].color}
                  strokeWidth={4}
                  strokeDasharray="18 8"
                  opacity={0.5}
                />
              ))}
              <circle cx="200" cy="200" r="4" fill="var(--track-yellow)" />
              <circle cx="200" cy="200" r="26" fill="none" stroke="var(--ring-steel)" strokeWidth="1" opacity="0.6" />
            </svg>
            <p className="pf-mono mt-3 max-w-md text-center text-[10px] tracking-[0.14em] text-(--text-steel)">
              4 LỚP DÒ · TỪ TÂM RA NGOÀI
            </p>
          </div>

          <div>
            <h2 className="pf-reveal pf-display text-2xl font-bold tracking-tight text-(--text-bright) text-balance sm:text-3xl">
              Bốn lớp dò, một dòng tiền
            </h2>
            <p className="mt-4 leading-relaxed lg:max-w-2xl">
              Tiền của bạn đi qua từng lớp, mỗi lớp trả lời một câu: vừa chi gì, còn bao nhiêu,
              xu hướng ra sao, và của ai trong nhà.
            </p>

            <div className="mt-10 space-y-10 lg:space-y-24">
              {LAYERS.map((layer, i) => (
                <article key={layer.id} className="pf-layer-panel relative border border-(--steel) bg-(--pf-subtle)/60 p-5 pt-7 sm:p-6 sm:pt-8">
                  <span
                    className="pf-mono absolute -top-[9px] left-4 bg-(--vacuum) px-2 text-[11px] tracking-[0.16em]"
                    style={{ color: layer.color }}
                  >
                    {layer.name}
                  </span>
                  <span className="absolute top-4 right-4 lg:hidden">
                    <LayerGlyph index={i} color={layer.color} />
                  </span>
                  <h3 className="pf-display max-w-[calc(100%-3.5rem)] text-xl font-bold text-(--text-bright) sm:text-2xl lg:max-w-none">
                    {layer.title}
                  </h3>
                  <p className="mt-3 leading-relaxed lg:max-w-3xl">{layer.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* So với app ngân hàng */}
        <section className="pf-snap-target border-y border-(--steel) bg-(--pf-subtle)/60">
          <div className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20 xl:px-16">
            <h2 className="pf-reveal pf-display text-2xl font-bold tracking-tight text-(--text-bright) text-balance sm:text-3xl">
              App ngân hàng đã có rồi, cần gì thêm sổ này
            </h2>
            <p className="pf-reveal mt-4 leading-relaxed lg:max-w-3xl">
              App ngân hàng ghi lại tiền đã đi qua tài khoản đó. Sổ này ghi lại tiền của bạn,
              gồm cả tiền mặt, và biết trước bạn định tiêu bao nhiêu.
            </p>

            <div className="mt-8 border border-(--steel)">
              <div className="pf-mono grid grid-cols-2 gap-px border-b border-(--steel) bg-(--steel) text-[10px] tracking-[0.14em]">
                <div className="bg-(--vacuum) px-4 py-3 text-(--text-steel)">APP NGÂN HÀNG</div>
                <div className="bg-(--vacuum) px-4 py-3 text-(--track-yellow-ink)">SỔ NÀY</div>
              </div>
              <div className="grid grid-cols-2 gap-px bg-(--steel)">
                {COMPARISON.map((row) => (
                  // display:contents không có box nên pf-reveal phải nằm trên 2 ô con
                  <div key={row.left} className="contents">
                    <div className="pf-reveal bg-(--vacuum) p-4 text-sm text-(--text-steel) lg:p-5">{row.left}</div>
                    <div className="pf-reveal bg-(--vacuum) p-4 text-sm text-(--text-bright) lg:p-5">{row.right}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quy trình */}
        <section className="pf-steps pf-snap-target px-4 py-14 sm:px-6 lg:px-10 lg:py-20 xl:px-16">
          <h2 className="pf-display text-2xl font-bold tracking-tight text-(--text-bright) text-balance sm:text-3xl">
            Chạy lần đo đầu tiên trong hôm nay
          </h2>

          <div className="relative mt-10">
            <svg
              className="absolute top-5 left-0 hidden h-2 w-full md:block"
              viewBox="0 0 1000 8"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line className="pf-beam-line" x1="0" y1="4" x2="1000" y2="4" stroke="var(--track-cyan)" strokeWidth="2" opacity="0.7" />
            </svg>
            <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
              {STEPS.map((step) => (
                <li key={step.num} className="pf-step relative">
                  <div className="pf-mono flex h-10 w-10 items-center justify-center rounded-full border border-(--track-cyan) bg-(--vacuum) text-sm font-semibold text-(--track-cyan-ink)">
                    {step.num}
                  </div>
                  <h3 className="pf-display mt-4 text-lg font-bold tracking-wide text-(--text-bright)">
                    {step.name}
                  </h3>
                  <p className="mt-2 leading-relaxed lg:max-w-md">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Hỏi đáp + những gì chưa có */}
        <section className="pf-snap-target border-t border-(--steel) px-4 py-14 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16 lg:px-10 lg:py-20 xl:px-16">
          <div>
            <h2 className="pf-reveal pf-display text-2xl font-bold tracking-tight text-(--text-bright) text-balance sm:text-3xl">
              Câu hỏi hay gặp
            </h2>
            <dl className="mt-8 space-y-px border border-(--steel) bg-(--steel)">
              {FAQ.map((item) => (
                <div key={item.q} className="pf-reveal bg-(--vacuum) p-5 lg:p-6">
                  <dt className="pf-display text-base font-bold text-(--text-bright) sm:text-lg">{item.q}</dt>
                  <dd className="mt-2 leading-relaxed">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 lg:mt-0">
            <h2 className="pf-reveal pf-display text-2xl font-bold tracking-tight text-(--text-bright) text-balance sm:text-3xl">
              Những gì sổ này chưa làm
            </h2>
            <p className="pf-reveal mt-4 leading-relaxed">
              Nói trước để bạn khỏi mất công thử rồi thất vọng. Các phần dưới đây chưa có:
            </p>
            <ul className="pf-reveal mt-6 space-y-3 border-l border-(--energy-red)/60 pl-5">
              {NOT_YET.map((item) => (
                <li key={item} className="pf-mono text-sm tracking-wide text-(--text-steel)">
                  {item}
                </li>
              ))}
            </ul>
            <p className="pf-reveal mt-6 text-sm leading-relaxed text-(--text-steel)">
              Nếu bạn cần đúng những thứ này thì sổ này chưa hợp. Còn nếu chỉ muốn biết
              tiền tháng này đi đâu, nó làm được ngay hôm nay.
            </p>
          </div>
        </section>

        {/* CTA cuối */}
        <section className="pf-final pf-snap-target border-t border-(--steel) px-4 py-20 text-center sm:px-6 lg:px-10 lg:py-28">
          <h2 className="pf-display text-3xl font-bold tracking-tight text-(--text-bright) text-balance sm:text-4xl lg:text-5xl">
            SẴN SÀNG CHO LẦN ĐO ĐẦU TIÊN?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed">
            Miễn phí toàn bộ. Chỉ cần email. Không quảng cáo, không thu thập gì thêm.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="pf-display flex h-13 w-full items-center justify-center rounded-sm bg-(--track-yellow) px-9 text-base font-bold tracking-wide text-(--pf-on-signal) transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--track-yellow) sm:w-auto"
            >
              TẠO TÀI KHOẢN MIỄN PHÍ
            </Link>
            <Link
              href="/login"
              className="flex h-13 w-full items-center justify-center rounded-sm px-6 text-base text-(--text-steel) transition-colors hover:text-(--track-cyan-ink) focus-visible:outline-2 focus-visible:outline-(--track-cyan) sm:w-auto"
            >
              Mình đã có tài khoản
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-(--steel) pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <div className="pf-mono flex flex-col gap-2 px-4 py-6 text-[11px] tracking-wide text-(--text-steel) sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10 xl:px-16">
          <span>PERSONAL FINANCE · SỔ DÒNG TIỀN CỦA BẠN</span>
          <span>© 2026 · MIỄN PHÍ · TIẾNG VIỆT / VND</span>
        </div>
      </footer>

      {/* CTA dính đáy — mobile; ẩn mặc định, GSAP kéo lên sau khi rời hero */}
      <div className="pf-sticky-cta fixed inset-x-0 bottom-0 z-40 translate-y-[130%] border-t border-(--steel) bg-(--vacuum)/92 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <Link
          href="/register"
          className="pf-display flex h-12 w-full items-center justify-center rounded-sm bg-(--track-yellow) text-base font-bold tracking-wide text-(--pf-on-signal) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--track-yellow)"
        >
          BẮT ĐẦU GHI — MIỄN PHÍ
        </Link>
      </div>
    </div>
  );
}
