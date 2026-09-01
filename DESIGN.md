---
name: Máy Dò Dòng Tiền
description: Thế giới thị giác "collider event display" của toàn sản phẩm — trang công khai ("/", "/login", "/register") ở đăng ký Persuade, app sau đăng nhập ở đăng ký Operate. Hai rendition (buồng tối / bản giấy sáng) áp cho CẢ HAI đăng ký, cùng một công tắc theme, mặc định light.
colors:
  vacuum: "#0b0f14"
  steel: "#223244"
  steel-deep: "#16202e"
  ring-steel: "#3a5a7a"
  track-yellow: "#ffd23a"
  track-cyan: "#35d0ff"
  energy-red: "#ff4d4d"
  ok-green: "#43d17c"
  text-steel: "#a7b3c2"
  text-bright: "#e8eef5"
typography:
  display:
    fontFamily: "Chakra Petch, var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "2.2rem (mobile) → 3rem (sm) → 3.75rem (lg) → 4.5rem (xl)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Chakra Petch, var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "1.5rem (mobile) → 1.875rem (sm+)"
    fontWeight: 700
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Chakra Petch, var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "1.25rem → 1.5rem"
    fontWeight: 700
  body:
    fontFamily: "Saira, var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.625
  label:
    fontFamily: "Roboto Mono, ui-monospace, monospace"
    fontSize: "9px–11px"
    fontWeight: 400
    letterSpacing: "0.1em–0.16em"
rounded:
  sm: "6px"
  full: "9999px"
spacing:
  hairline: "1px"
  gutter: "16px"
  gutter-sm: "24px"
components:
  button-primary:
    backgroundColor: "{colors.track-yellow}"
    textColor: "{colors.vacuum}"
    typography: "{typography.display}"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "0 28px"
  button-outline-accent:
    backgroundColor: "transparent"
    textColor: "{colors.track-yellow}"
    typography: "{typography.display}"
    rounded: "{rounded.sm}"
    height: "44px"
    padding: "0 16px"
  button-ghost-steel:
    backgroundColor: "transparent"
    textColor: "{colors.text-steel}"
    typography: "{typography.display}"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "0 28px"
  input-field:
    backgroundColor: "{colors.vacuum}"
    textColor: "{colors.text-bright}"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "0 12px"
  input-field-label:
    textColor: "{colors.text-steel}"
    typography: "{typography.label}"
---

# Design System: Máy Dò Dòng Tiền

## Overview

**Creative North Star: "Máy Dò Dòng Tiền"**

Landing là một event display của máy gia tốc hạt áp lên dòng tiền: tâm va chạm là tiền tháng của bạn, mỗi khoản chi là một track cong toả ra ngoài, ngân sách là track cyan cứng xuyên buồng, phần đã tiêu hiện thành cụm thanh calorimeter đỏ ở vành. Mọi thứ nhìn như màn hình phân tích trong phòng điều khiển: nền chân không gần đen, thép lạnh, chữ kỹ thuật viết hoa, số mono thẳng cột, nhãn leader-line ghim vào dữ liệu. Thế giới này từ chối hero SaaS trắng, mockup iPhone và grid card đều nhau (direction contract seed 054bb55e, trong `src/app/page.tsx`).

**Phạm vi bắt buộc:** file này điều hành TOÀN BỘ sản phẩm, hai đăng ký khác nhau:

- **Persuade** — ba route công khai `/`, `/login`, `/register`. Chạy trên cùng token `:root`/`.dark` với app (các alias tên cũ `--vacuum`, `--track-yellow`… khai ở `:root` và trỏ `var(--pf-*)` nên tự đổi theo theme). Có dàn dựng GSAP, có nút đổi nền ngay trên header.
- **Operate** — app sau đăng nhập (dashboard, transactions, reports, settings, family). Chạy trên token shadcn ở `:root`/`.dark` của cùng file CSS, hai rendition: `.dark` là buồng chân không giống landing, `:root` là bản giấy sáng của chính thế giới đó. Không dàn dựng, không animation vào-trang.

Cả hai đăng ký dùng chung một bảng màu, một bộ font (`src/lib/fonts.ts`, gắn ở `<body>`), một ngôn ngữ hình (panel vuông hairline, grid thép gap-px, plaque trên viền, số mono tabular). Khác nhau ở mật độ, ở lượng chuyển động, và ở chỗ Operate phải đọc được dưới nắng nên có bản giấy.

Kiến trúc token ba tầng, xem mục Colors: tầng rendition (`--pf-*`), tầng cầu nối shadcn (`--background`, `--card`…), tầng utility (`@theme inline`). **Thứ tự khối trong `globals.css` là load-bearing**: `:root` → `.dark` → cầu nối. Format lại file làm đảo thứ tự sẽ vỡ dark mode âm thầm.

**Key Characteristics:**
- Hai rendition cùng một thế giới: bản giấy sáng (mặc định toàn sản phẩm — light cứng, không theo OS) và buồng vacuum khi người dùng bật nền tối. Landing và app cùng một công tắc.
- Viền hairline 1px thay cho bóng đổ; độ sâu đến từ lớp mờ và glow SVG.
- Màu là mã dữ liệu, không phải trang trí: vàng = chi/hành động, cyan = ngân sách, đỏ = năng lượng đã dùng, xanh lá = trạng thái tốt.
- Số VND luôn mono tabular, định dạng Việt `12.450.000 ₫`; số liệu demo luôn ghi nhãn `SỐ LIỆU MINH HOẠ`.
- Chuyển động chỉ bằng GSAP, dàn dựng như một lần đo: vẽ track, count-up, band sáng theo scroll.

## Colors

Bảng màu là buồng máy dò: bốn màu tín hiệu bão hoà nổi trên năm tầng thép-chân không desaturated.

### Primary
- **Vàng track** (#ffd23a): màu của chi tiêu và của hành động. Track chi trong SVG, số tiền chi, tâm va chạm, brandmark, và là màu nền của CTA chính duy nhất ("BẮT ĐẦU GHI — MIỄN PHÍ"). Cũng là màu `::selection` (chữ vacuum trên nền vàng).

### Secondary
- **Cyan track** (#35d0ff): màu của ngân sách và quy trình. Track ngân sách gần thẳng trong SVG, số ngân sách, chấm hit, beam nối 3 bước, viền step marker, màu hover của hành động phụ.

### Tertiary
- **Đỏ năng lượng** (#ff4d4d): phần ngân sách đã tiêu / vượt hạn mức. Chỉ xuất hiện ở cụm calorimeter và nhãn "ĐÃ DÙNG", plaque lớp ngân sách. Không dùng cho lỗi UI chung.
- **Xanh trạng thái** (#43d17c): tín hiệu "ổn" duy nhất — chấm MIỄN PHÍ 100%, plaque lớp gia đình. Xuất hiện nhỏ giọt.

### Neutral
- **Vacuum** (#0b0f14): nền toàn trang và nền ô dữ liệu. Mọi thứ khác nổi trên nó.
- **Thép sâu** (#16202e): nền band xen kẽ và nền panel, luôn dùng ở dạng mờ (`/50`–`/60`) để vacuum thấm qua.
- **Thép** (#223244): màu viền hairline chuẩn và màu "vữa" của grid gap-px.
- **Vành ring** (#3a5a7a): stroke các vòng detector, viền nút phụ, glyph. Là màu hình học, không dùng cho chữ. Token tên là `--ring-steel`, **không** phải `--ring`: nó từng tên `--ring` và đụng thẳng token focus-ring của shadcn, nên đã đổi tên.
- **Chữ thép** (#a7b3c2): màu chữ mặc định của cả thế giới — body, nhãn mono, meta.
- **Chữ sáng** (#e8eef5): heading, tên giao dịch, số trung tính. Không phải trắng thuần.

### Named Rules
**Luật mã màu vật lý.** Bốn màu tín hiệu mang nghĩa dữ liệu cố định (vàng = chi/hành động, cyan = ngân sách, đỏ = đã dùng/vượt, xanh = ổn) và nghĩa đó nhất quán từ SVG sang chữ sang nút. Không đổi vai màu giữa các section.

**Luật một nguồn sáng.** Mỗi viewport chỉ có một khối vàng đặc (CTA chính). Mọi chỗ vàng còn lại là stroke, chữ hoặc chấm. Hai khối vàng đặc cạnh nhau là sai thế giới.

**Luật cầu nối shadcn.** Khối cầu nối ở `:root` gán bộ token shadcn (`--background`, `--card`, `--primary`…) lên token `--pf-*` của thế giới, để component dùng chung render đúng ở cả hai rendition mà không cần fork. Cũng tại đây khai 10 alias tên cũ của landing (`--vacuum`, `--steel`, `--track-yellow`…) và hai khe mực `--track-yellow-ink`/`--track-cyan-ink`. Hệ quả bắt buộc: token riêng của thế giới không được trùng tên với token shadcn — đó là lý do màu vành là `--ring-steel`. Thêm token mới thì kiểm tên với danh sách shadcn trước.

## Typography

**Display Font:** Chakra Petch 500/600/700 (fallback `var(--font-geist-sans)`, system-ui)
**Body Font:** Saira variable (fallback `var(--font-geist-sans)`, system-ui)
**Label/Mono Font:** Roboto Mono 400/500/600 (fallback ui-monospace) — `font-variant-numeric: tabular-nums`

**Character:** Chakra Petch góc cạnh kỹ thuật cho tiếng nói của máy; Saira cùng họ hình học nhưng mềm hơn cho phần giải thích; Roboto Mono là kênh dữ liệu. Cả ba nạp qua `next/font` với subset `vietnamese` — dấu tiếng Việt là mặc định, không phải may rủi.

**Nguồn font duy nhất:** `src/lib/fonts.ts` export `pfDisplay`, `pfMono`, `pfBody` và chuỗi gộp `pfFontVars`. Mọi route trong thế giới bọc nội dung bằng `<div className={pfFontVars}>` (`src/app/page.tsx` cho landing, `src/components/auth/auth-shell.tsx` cho login/register). Không khai báo lại `next/font` trong từng page — thêm surface mới thì import `pfFontVars`.

### Hierarchy
- **Display** (700, 2.2rem → 3rem `sm` → 3.75rem `lg` → 4.5rem `xl`, leading 1.1, tracking-tight): H1 hero, viết HOA toàn bộ, từ khoá tô vàng ("VẾT"). Bậc 4.5rem chỉ mở ở `xl` (1280px), nơi trang đã chạy hết bề ngang.
- **Headline** (700, 1.5rem → 1.875rem, tracking-tight): H2 các section, câu thường (chỉ CTA cuối viết hoa). H1 của trang auth dùng cùng bậc này.
- **Title** (700, 1.25rem → 1.5rem): H3 trong panel và step. Bậc 1.125rem (`text-lg`) dùng cho `dt` của FAQ và tiêu đề ô câu hỏi.
- **Body** (400, 1rem, leading-relaxed, màu chữ thép): đoạn giải thích. Không có container ngoài chặn bề ngang, nên chính đoạn văn tự chặn bằng `lg:max-w-xl`/`2xl`/`3xl` (xem Layout).
- **Label** (mono, 9–13px, tracking 0.1em–0.16em, VIẾT HOA): plaque, đầu bảng, chú thích, nhãn dữ liệu, footer, nhãn field của form auth (11px / 0.14em). Bậc 9px dành riêng cho một chỗ: dấu `SỐ LIỆU MINH HOẠ`.
- **Readout** (mono 500–600, 13–16px, tabular): mọi con số tiền và mã giao dịch. Bậc 13px là giá trị số ở hàng stat hero trên mobile, lên 16px từ `sm`.

### Named Rules
**Luật số mono.** Mọi giá trị tiền, mã (GD-xxxx, TH-2026-08), phần trăm nằm trong `.pf-mono` với tabular-nums, định dạng Việt chấm-nghìn kèm `₫`. Số tiền không bao giờ đặt bằng font display hay body.

**Luật chữ hoa kỹ thuật.** Chữ viết hoa luôn đi kèm letter-spacing dương (0.1em+ cho label mono, 0.12em cho brandmark) và cỡ nhỏ; H1/CTA hoa dùng Chakra Petch đậm. Không viết hoa chữ body.

## Layout

**Không có container căn giữa.** Thế giới chạy hết bề ngang màn hình; bề rộng do padding quyết định, không do một khối `max-w-*` bọc ngoài. Thang padding chuẩn của cả ba route công khai là `px-4 sm:px-6 lg:px-10 xl:px-16` — áp thẳng lên header, từng section, và footer, mỗi khối tự mang padding của mình chứ không kế thừa từ một wrapper.

Cột chữ được chặn bằng hai cơ chế, theo thứ tự ưu tiên: (1) phân số grid `lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]` và các biến thể lệch (`0.8fr/1.2fr` cho bản ghi, `0.9fr/1.1fr` cho lớp, `1.3fr/0.7fr` cho hỏi đáp) — `minmax(0,…)` là bắt buộc để cột không phình theo nội dung không xuống dòng được; (2) `lg:max-w-*` đặt trực tiếp lên đoạn văn (`xl` → `3xl`) khi khối chỉ có một cột. Chỉ hai chỗ còn dùng `max-w` để căn giữa thật: figure máy dò trên mobile (`max-w-[320px]`/`sm:max-w-[400px]`) và đoạn dưới CTA cuối (`max-w-xl`) — cả hai là căn giữa có chủ đích, không phải container.

Trang là chuỗi section dọc xen kẽ hai nền: section mở trên vacuum, section "band" bọc `border-y` thép với nền thép sâu mờ — nhịp sáng/tối như các buồng của máy dò. Đệm dọc section 56–80px mobile, 80–112px desktop.

Mobile-first theo đúng contract: hero mobile là một cột thứ tự cố định H1 → sub → CTA → hàng số đếm → vòng detector nguyên vẹn tròn màn kế tiếp → dòng cam kết (đạt bằng `contents` + `order-*`; desktop chuyển thành grid 2 cột `1.05fr/1fr`). Header dính đỉnh (h-14, nền vacuum/85 + backdrop-blur). Trên mobile có thanh CTA dính đáy (ẩn mặc định, hiện sau khi rời hero) với `safe-area-inset-bottom`; footer chừa sẵn `pb-[calc(5.5rem+env(safe-area-inset-bottom))]` để không bị thanh này che. Desktop (lg ≥1024px): diagram 4 vòng `sticky top-24` bên trái section lớp, thanh CTA đáy biến mất.

Trang auth (`/login`, `/register`) dùng cùng thang padding và cùng logic: một cột trên mobile, từ `lg` thành `grid-cols-[1fr_minmax(0,480px)]` — máy dò bên trái, panel form bên phải khoá trần 480px. Panel form là khối duy nhất có `max-w-md` (mobile, để căn giữa), và bỏ trần đó ở `lg` (`lg:max-w-none`) vì lúc này cột grid đã chặn thay.

Điểm chạm tối thiểu 44px (h-11 cho nav link, h-12/h-13 cho CTA và field). Breakpoint có nghĩa duy nhất là `lg` (1024px) — dưới nó là thế giới ngón cái, trên nó mở khoá sticky diagram, bloom, nhãn leader-line và cột máy dò của trang auth; `sm`/`md` chỉ chỉnh cỡ chữ và số cột, `xl` (1280px) chỉ nới padding và mở bậc H1 lớn nhất.

### Named Rules
**Luật toàn khung.** Bề rộng do padding quyết định, không do container. Section mới viết `px-4 sm:px-6 lg:px-10 xl:px-16` và để nội dung chạm mép padding. Thêm một `max-w-6xl` bọc ngoài là phá thế giới: mọi grid gap-px, band `border-y` và mạch kẻ thép đang tính theo bề ngang thật của màn.

**Luật chặn chữ tại chỗ.** Dòng chữ dài được chặn ở nơi nó sống — phân số grid `minmax(0,1fr)` cho khối hai cột, `lg:max-w-*` trên chính thẻ `<p>` cho khối một cột. Không bao giờ chặn bằng một div bọc, vì div bọc sẽ kéo theo cả viền và nền của section vào trong.

## Elevation & Depth

Không có `box-shadow` ở bất kỳ đâu trong thế giới này. Độ sâu tạo bằng ba thứ: (1) viền hairline 1px màu thép tách khối khỏi nền; (2) lớp nền mờ — panel `bg-steel-deep/50`, band `/60`, header và thanh CTA đáy `bg-vacuum/85–/92` kèm `backdrop-blur-md`; (3) ánh sáng trong SVG: vignette hướng tâm (radialGradient của màu ring 0.22 → 0) và lớp bloom — toàn bộ track/thanh calo vẽ đúp một lớp phía dưới qua `filter: feGaussianBlur(6)` với stroke dày 1.8–2.6 lần, chỉ desktop (`max-lg:hidden`).

### Named Rules
**Luật không bóng đổ.** Khối nổi lên bằng viền và độ mờ, không bằng shadow. Ánh sáng duy nhất được phép là glow của chính dữ liệu (bloom SVG, vignette), và glow đó tắt trên mobile để giữ hiệu năng.

Một ngoại lệ có thật, ghi để khỏi tưởng là bug: `Input` của shadcn mang sẵn `shadow-xs` lúc nghỉ và vòng focus 3px (đều là `box-shadow`). Trên nền vacuum gần đen thì `shadow-xs` không nhìn thấy, còn vòng focus nhận màu vàng track qua cầu nối `--ring` nên đúng quy ước focus của thế giới. Ngoại lệ chỉ áp cho component đi mượn; **không** thêm `box-shadow` vào bất kỳ khối tự viết nào.

## Shapes

Ngôn ngữ hình là "panel vuông + hình học tròn của máy". Panel, bảng, band đều vuông cạnh sắc, chỉ có viền hairline. Phần tử bấm được (nút, link nền) bo nhẹ `rounded-sm` — hiện resolve ra 6px vì kế thừa `--radius: 0.625rem` từ `:root` của app qua `@theme inline` (một khớp nối có chủ đích duy nhất với hệ token app; nếu app đổi `--radius`, nút landing đổi theo). Hình tròn thuần (`rounded-full`) dành riêng cho hình học máy dò: vòng ring, chấm hit, chấm trạng thái, step marker 40px.

Từ vựng nét SVG: vòng detector là stroke đứt (`strokeDasharray` các nhịp 34/30, 16/10, 10/8, 3/9…) với opacity giảm dần ra ngoài; track là bezier cong kiểu hạt tích điện, `strokeLinecap="round"`; calorimeter là line dày 13 hướng tâm; vành calorimeter có vân mesh chấm (pattern 9×9). Hình học tính thuần hàm ở module scope — không random, SSR ổn định.

Hai hình dạng đặc trưng tái dùng được:
- **Plaque trên viền:** nhãn mono viết hoa đặt đè lên viền trên panel (`absolute -top-[9px] left-4`, nền vacuum, `px-2`) — tấm biển chỉ danh của buồng máy.
- **Grid thép gap-px:** khối nhiều ô là `grid gap-px` nền thép trong khung viền thép, ô con nền vacuum — kẻ bảng bằng khe hở 1px thay vì border từng ô. Đây là hình dạng dùng nhiều nhất của thế giới: hàng stat hero, bảng chứng cứ trang auth, lưới ba câu hỏi, bảng so sánh hai cột, danh sách hỏi đáp (`space-y-px`), chân bảng bản ghi.

Ô nhập liệu (form auth) cao 48px, bo `rounded-sm`, viền thép 1px, nền vacuum — cùng bo và cùng chiều cao với nút primary, nên field và nút xếp chồng thành một cột đều nhịp.

## Components

### Buttons
- **Shape:** bo nhẹ (6px), chữ Chakra Petch đậm tracking-wide, cao 48px (52px ở CTA cuối), padding ngang 28px.
- **Primary:** nền vàng track, chữ vacuum, viết hoa. Hover: `scale(1.02)` bằng transition CSS. Mỗi viewport một cái (Luật một nguồn sáng).
- **Outline accent** (header "Bắt đầu"): viền vàng 1px, chữ vàng, cao 44px; hover đảo — nền vàng chữ vacuum.
- **Ghost steel** (hero "ĐĂNG NHẬP"): viền ring, chữ thép; hover chuyển viền + chữ sang cyan.
- **Text link** ("Mình đã có tài khoản", "Đăng nhập"): không viền, chữ thép, hover sáng lên hoặc sang cyan.
- **Focus:** mọi phần tử bấm được có `focus-visible:outline-2` màu đúng vai (vàng cho hành động chính, cyan cho phụ), thường kèm `outline-offset-2`.

### Data readout (grid thép)
- **Style:** grid 3 cột gap-px nền thép trong khung viền thép; ô nền vacuum, padding 10–12px.
- **Nội dung ô:** nhãn mono 10px tracking 0.1em màu chữ thép, số mono semibold 13–16px màu theo mã (chi = vàng, ngân sách = cyan, còn lại = chữ sáng).
- **Bắt buộc:** kèm dòng `SỐ LIỆU MINH HOẠ` mono 9px khi dữ liệu là demo.

### Plaque panel (buồng máy)
- **Corner style:** vuông, viền hairline thép, nền thép sâu /50.
- **Plaque:** nhãn `LỚP 0x · TÊN BUỒNG` mono 11px tracking 0.16em đè lên viền trên, màu theo mã màu của lớp.
- **Mobile:** glyph 4 vòng (LayerGlyph, vòng của lớp hiện hành tô đậm màu lớp) ở góc phải trên; desktop glyph ẩn vì đã có diagram sticky.

### Log ledger (bản ghi giao dịch)
- **Style:** khung viền thép nền vacuum; đầu bảng mono 10px có mã kỳ (`TH-2026-08`) + đếm + nhãn minh hoạ; dòng chia bằng `divide-y` thép /60.
- **Dòng:** mã GD mono 11px thép → tên giao dịch chữ sáng truncate → phương thức mono (ẩn dưới sm) → số âm mono semibold vàng có dấu `−`.
- **Chân bảng:** grid thép gap-px 3 ô tổng kết.

### Lưới câu hỏi (3 ô)
- **Style:** `grid gap-px md:grid-cols-3` nền thép trong khung viền thép; ô nền vacuum, padding 20px (28px từ lg).
- **Nội dung ô:** câu hỏi Chakra Petch 1.125rem đậm màu vàng track, câu trả lời body chữ thép ngay dưới. Không đánh số, không icon.
- **Mobile:** ba ô xếp dọc, mạch kẻ 1px vẫn giữ nguyên nhờ `gap-px`.

### Bảng so sánh hai cột
- **Style:** khung viền thép; hàng đầu là `grid grid-cols-2 gap-px` mono 10px tracking 0.14em (cột trái chữ thép, cột phải vàng track) ngăn bằng `border-b`; thân bảng là `grid grid-cols-2 gap-px` nền thép.
- **Ô thân:** trái chữ thép (trạng thái cũ), phải chữ sáng (trạng thái mới) — chênh lệch sáng chính là lập luận, không dùng icon tick/chéo.
- **Reveal:** mỗi hàng bọc trong `contents` mang class `pf-reveal` để hai ô cùng hàng vào màn cùng lúc mà không phá grid.

### Danh sách hỏi đáp
- **Style:** `<dl>` với `space-y-px` nền thép trong khung viền thép; mỗi cặp là một div nền vacuum padding 20px (24px từ lg).
- **`<dt>`:** Chakra Petch đậm 1rem → 1.125rem màu chữ sáng. **`<dd>`:** body chữ thép, `mt-2`, leading-relaxed. Không accordion, không mũi tên — mở sẵn toàn bộ.

### Danh sách "chưa làm"
- **Style:** `<ul>` không bullet, `space-y-3`, chỉ có một viền trái 1px đỏ năng lượng ở `/60` và `pl-5`.
- **Item:** mono `text-sm` tracking-wide màu chữ thép.
- **Vai trò:** đây là chỗ duy nhất màu đỏ được dùng ngoài cụm calorimeter — nó đánh dấu giới hạn đã thừa nhận, không phải lỗi UI. Một viền trái mảnh, không nền đỏ, không icon cảnh báo.

### Form đăng nhập / đăng ký
- **Vỏ:** panel viền hairline thép nền thép sâu `/60`, padding 20px (28px từ sm); tiêu đề Chakra Petch 1.5rem → 1.875rem chữ sáng, mô tả body `text-sm` chữ thép.
- **Nhãn field:** mono viết HOA `text-[11px]` tracking 0.14em màu chữ thép — nhãn là nhãn máy, không phải câu.
- **Field:** shadcn `Input` cao 48px, `rounded-sm`, viền thép, nền vacuum, chữ sáng, placeholder chữ thép `/60`. Render đúng trong buồng tối nhờ Luật cầu nối shadcn, không fork component.
- **Nút ẩn/hiện mật khẩu:** nút vuông 44×44 nằm trong ô, chữ thép, hover sang vàng track, `tabIndex={-1}` để không chen vào thứ tự tab.
- **Submit:** nút primary full-width cao 48px, nền vàng track chữ vacuum, chữ viết HOA. Trạng thái loading đổi thành spinner + câu tiếng Việt thường ("Đang mở sổ...").
- **Cột trái (lg+):** `DetectorScene` dùng lại nguyên vẹn từ landing, kèm một dòng chú thích mono và lưới 3 ô chứng cứ (MIỄN PHÍ / CẦN THẺ / TIỀN TỆ). Ẩn hoàn toàn dưới `lg` — mobile chỉ còn form.

### Step marker (quy trình)
- **Style:** vòng tròn 40px viền cyan nền vacuum, số mono cyan; tiêu đề Chakra Petch; 3 bước nối bằng beam line cyan tự vẽ theo scroll (md+).

### Navigation
- **Header:** dính đỉnh, h-14, nền vacuum/85 + blur, viền dưới thép. Brandmark = ring SVG (vòng đứt ring + vòng vàng + tâm vàng) + wordmark Chakra Petch tracking 0.12em (ẩn dưới 430px). Phải: link "Đăng nhập" dạng text + nút outline accent "Bắt đầu".
- **Sticky CTA mobile:** thanh đáy cố định nền vacuum/92 + blur, viền trên thép, chứa đúng một nút primary full-width; GSAP kéo lên khi hero rời màn (xem Motion).

### DetectorScene (signature)
SVG 600×600 thuần trình bày, mọi màu lấy từ token qua `var(--*)`. Cấu tạo từ ngoài vào: vignette → vành muon đứt 34/30 → vành calorimeter thép + vân mesh → 4 vòng tracker đứt → ống beam + tâm vàng + halo → 12 chấm hit cyan → lớp bloom (desktop) → track (10 track chi vàng cong, 7 track soft xoắn gần tâm, 2 track ngân sách cyan gần thẳng) → cụm 9 thanh calo đỏ ở cung 20°–110°. Nhãn leader-line (node tròn rỗng → polyline gãy khúc → chữ mono 13px cùng màu dữ liệu) chỉ hiện desktop; mobile thay bằng legend chấm màu dưới figure. Có `role="img"` + `aria-label` mô tả nghĩa; nhóm trang trí `aria-hidden`.

### Chuyển động (motion)
Toàn bộ chuyển động entrance/scroll trên landing chạy bằng GSAP + ScrollTrigger trong một `useGSAP` scoped (`src/components/landing/landing.tsx`); không framer-motion, không Remotion, không animation CSS cho entrance. `gsap.matchMedia()` chia đúng ba nhánh: `reduced`, `desktop` (≥1024px), `mobile`.

- **Luật một lần đo.** Hero có đúng một timeline dàn dựng (ease mặc định `expo.out`): vòng ring scale-in → tâm + halo → track chi vẽ bằng stroke-dash → track ngân sách → thanh calo → chấm hit; song song copy trượt lên stagger 0.09 và số VND count-up 1.6s qua `formatNumber`. Halo tâm phập phồng lặp vô hạn nhưng `toggleActions: "play pause resume pause"` — dừng khi hero rời màn.
- **Scroll reveal, hai tầng.** Khối có dàn dựng riêng (dòng log trượt ngang như dữ liệu đổ về, panel lớp, step) giữ `gsap.from` riêng 0.5–0.8s, `power2.out`/`expo.out`, y 18–30px, trigger ở 72–82% viewport. Mọi khối nội dung còn lại dùng một cơ chế chung duy nhất: class `.pf-reveal` gom qua `ScrollTrigger.batch(".pf-reveal", { start: "top 85%" })`, `gsap.from` y 22, opacity 0, 0.6s `power2.out`, stagger 0.08, `overwrite: true`. Section mới mặc định gắn `.pf-reveal` chứ không viết timeline mới; chỉ viết timeline riêng khi thứ tự các phần tử trong khối thật sự mang nghĩa.
- **Chuyển động khác:** beam quy trình scrub 0.5 theo scroll; band diagram desktop sáng theo panel đang đọc (opacity 0.35→1, strokeWidth 4→12).
- **Trang auth không có motion.** `/login` và `/register` mượn thế giới nhưng không mượn dàn dựng: không GSAP, không entrance, `DetectorScene` đứng yên ở trạng thái tĩnh. Form phải dùng được ngay, không đợi hiệu ứng chạy xong.
- **Luật tĩnh hoàn chỉnh.** Nhánh `reduced` không phát gì cả và phải trả về trạng thái cuối đầy đủ: mọi stroke `dashoffset = 0`, mọi count-up đặt thẳng giá trị thật. Người tắt animation thấy trang hoàn chỉnh, không thấy trang thiếu.
- **Bẫy translate vs transform.** Tailwind v4 giấu thanh sticky CTA bằng property `translate` (`translate-y-[130%]`); GSAP điều khiển `transform`. Phải trung hoà `element.style.translate = "0px 0px"` trước khi `gsap.set(yPercent)`, nếu không hai property cộng dồn và thanh không bao giờ hiện đúng.

## Luật của bản app (Operate)

**Luật hai rendition.** Cùng một thế giới, hai cách in: bản giấy (`:root`, mặc định) và buồng chân không (`.dark`). Chỉ tầng token `--pf-*` được nhân bản; cầu nối + alias viết một lần ở `:root`. Toàn sản phẩm — landing lẫn app — theo cùng một class trên `<html>`, nên đổi nền ở đâu thì đâu cũng đổi. Mặc định là light CỨNG (không matchMedia): khai ở `THEME_BOOTSTRAP`, default context và `getServerSnapshot` của `theme-provider.tsx` — ba chỗ phải khớp nhau.

**Luật hai kênh token.** Chrome (nền, viền, chữ, panel) đi qua token shadcn; ngữ nghĩa dữ liệu (chi, ngân sách, vượt, ổn) đi qua `--pf-*`. Đừng lấy `--primary` để tô dữ liệu và đừng lấy `--pf-expense` để tô nút — chart là dữ liệu, nút là hành động.

**Luật mực trên nền tín hiệu.** Chữ hoặc glyph nằm TRÊN một mảng màu tín hiệu lấy `--pf-on-signal` (hằng số gần đen, khai trong khối cầu nối nên đúng cho cả hai rendition). Đừng lấy `var(--pf-bg)` — ở bản giấy nó là #eef1f4, chữ sáng trên vàng #e0a800 chỉ đạt ~1.9:1 và dấu `+` của FAB gần như tàng hình.

**Luật ba khe màu.** Mỗi vai tín hiệu có `--pf-x` (vệt đồ hoạ) và `--pf-x-ink` (chữ). Trên buồng tối hai khe trùng nhau; trên giấy `-ink` phải tối lại vì bốn màu tín hiệu nguyên bản không đọc được trên nền sáng (vàng #ffd23a trên giấy chỉ đạt ~1.4:1).

**Luật một nguồn sáng, bản app.** Mỗi viewport chỉ một *hành động* vàng đặc: FAB trên mobile, nút primary trên desktop. Vì `--primary` giờ là vàng nên mọi `<Button>` mặc định đều vàng — phải hạ xuống `outline`/`ghost` ở mọi chỗ trừ hành động chính của màn.

**Không animation vào-trang trong app.** Landing có dàn dựng; app thì không. Chỉ giữ count-up số tiền, transition hover/focus ≤150ms, và donut phình khi hover (đó là liên kết chức năng giữa legend và chart, không phải trang trí).

**Bẫy script theme trong cây React.** Theme phải được đặt bằng một `<script>` ở `<head>` (hằng `THEME_BOOTSTRAP` trong `src/components/providers/theme-provider.tsx`), và provider chỉ được cấp context chứ không render thêm element nào. Lý do: một element script nằm trong cây React của `<body>` làm lệch bộ đếm `useId` của React, khiến mọi component Radix phía sau (Dropdown, Dialog, Select) sinh id khác nhau giữa server và client và ném hydration mismatch trên mọi trang của app. Đây chính là lý do dự án tự viết theme provider thay vì dùng `next-themes` — thư viện đó render script của nó như một anh em trong body.

**Bẫy đọc log khi chẩn đoán.** Console của trình duyệt giữ lại message qua các lần điều hướng, nên một lỗi hydration đã sửa vẫn hiện lên và làm chẩn đoán sai hai lần. Cách kiểm chứng đúng: mở tab mới, hoặc so trực tiếp id trong HTML server (`fetch(location.href)` có cookie) với id trong DOM.

**Luật thang danh mục.** Donut phân bổ chi tiêu — ở bất kỳ màn nào — tô bằng `catColor(index, total)` từ `src/lib/chart-colors.ts`, không bằng bảng màu riêng. Thế giới chỉ có bốn màu tín hiệu và mỗi màu đã có nghĩa cố định, nên một danh mục ngẫu nhiên tô đỏ sẽ đọc ra là "vượt hạn mức". Danh sách phải giữ nguyên thứ tự giảm dần: thang than nguội chỉ có nghĩa khi miếng nóng nhất là miếng tiêu nhiều nhất.

**Luật một đơn vị trục.** Mọi nhãn tiền rút gọn trên trục đi qua `axisMoney` trong `src/lib/chart-axis.ts`, cùng chỗ với `AXIS_TICK` và `TOOLTIP_STYLE`. Ba chart từng tự khai ba bản và cho ra "60.0M", "60tr", "60k" cho cùng một đại lượng, mà trên `xl` hai trong ba chart nằm cạnh nhau.

**Bẫy `pt-6` của Panel.** Trong `panel.tsx`, `plaque && "pt-6"` phải đứng **sau** `className` trong `cn()`. Nơi gọi truyền `p-4` thì twMerge coi `p-4` là bản rộng hơn của `pt-6` và nuốt mất, plaque đè lên dòng nội dung đầu tiên.

**Bẫy `h-9` của TabsList.** `tabsListVariants` đặt chiều cao qua biến thể group, và Tailwind biên dịch nó thành `:is(:where(.group\/tabs)[data-orientation="…"] *)` — đặc trưng (0,2,0). Một `h-auto` trần (0,1,0) không thắng, twMerge cũng giữ cả hai vì khác modifier. Phải huỷ bằng đúng biến thể đã sinh ra nó: `group-data-[orientation=horizontal]/tabs:h-auto`. Thiếu nó thì trigger 44px bị nhét trong khung 36px, tab bị cắt và gạch chân vàng biến mất. Cùng lý do, tab đang mở tự nhận `shadow-sm` từ nhánh variant mặc định, gỡ bằng `group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none`. Cả hai chuỗi nằm trong `src/lib/tab-styles.ts`, dùng chung ba màn.

**Bẫy phần trăm bị kẹp trần.** `getBudgetProgress` trả `percentage` đã kẹp ở 100, nên vượt 300% vẫn đọc ra "100%". Chỗ nào cần nói đúng mức vượt thì tính lại từ `spent / total` ở tầng hiển thị; thanh bar vẫn dùng giá trị kẹp vì nó không vẽ được quá 100. Kèm theo: nút chặn đỏ ở mép phải bar và viền trái 2px đỏ cho dòng vượt.

**Cơ chế cuộn hít của landing.** Scroll nằm trên `window` nên `scroll-snap-type` phải đặt lên `<html>`: Landing mount thì gắn class `pf-snap` (khai ở `globals.css`, `y proximity` + `scroll-padding-top: 3.5rem` bù header), unmount thì gỡ. Mỗi section cấp 1 mang `pf-snap-target` (`scroll-snap-align: start`). Dùng `proximity`, không `mandatory` — 4/8 section cao hơn một màn ở 375px, mandatory sẽ nhốt người đọc. Root của landing giữ `overflow-x-clip`, đừng đổi thành `hidden` (sinh scroll container phụ, snap chết).

**Cơ chế highlight "Bốn lớp dò".** MỘT ScrollTrigger scrub trên cột panel, `onUpdate` map `progress → index` (mốc 40% viewport ≈ tâm diagram sticky). KHÔNG dùng trigger per-panel với `top center → bottom center`: khoảng `space-y-24` giữa các panel tạo dead-zone và cửa sổ kích hoạt lệch một lớp so với vị trí đọc — đây chính là bug "cuộn lớp 1 sáng lớp đỏ" đã sửa. Band trong JSX render đồng đều, GSAP set band active; nhánh reduced để cả 4 band đồng đều.

## Do's and Don'ts

### Do:
- **Do** bọc surface công khai mới bằng `pfFontVars` từ `src/lib/fonts.ts`; token lấy qua alias/`--pf-*` có sẵn, không khai màu cục bộ.
- **Do** cho section mới chạy hết bề ngang với `px-4 sm:px-6 lg:px-10 xl:px-16`, và chặn chữ bằng `minmax(0,1fr)` hoặc `lg:max-w-*` ngay trên đoạn văn.
- **Do** đặt tên token mới của thế giới sao cho không trùng tên token shadcn (`--ring-steel`, không phải `--ring`) — khối cầu nối đang gán đè bộ token đó.
- **Do** gắn `.pf-reveal` cho khối nội dung mới thay vì viết timeline GSAP riêng.
- **Do** ghi nhãn `SỐ LIỆU MINH HOẠ` (mono, viết hoa) cạnh mọi con số demo — đây là ràng buộc sự thật sản phẩm, không phải trang trí.
- **Do** đặt mọi số tiền trong `.pf-mono` tabular, định dạng `12.450.000 ₫`, dấu âm là `−` đứng trước.
- **Do** dùng đúng mã màu dữ liệu: vàng chi/hành động, cyan ngân sách, đỏ đã-dùng, xanh ổn.
- **Do** cho mọi phần tử tương tác cao ≥44px và có `focus-visible:outline-2` đúng màu vai.
- **Do** viết mọi animation mới bằng GSAP trong scope `useGSAP` hiện có, với nhánh reduced trả về trạng thái tĩnh hoàn chỉnh.

### Don't:
- **Don't** đặt tên token mới trùng token shadcn, và **don't** đảo thứ tự ba khối trong `globals.css` (`:root` → `.dark` → cầu nối) — cả hai đều làm vỡ hệ màu âm thầm.
- **Don't** bọc section bằng `max-w-6xl` hay bất kỳ container căn giữa nào (Luật toàn khung).
- **Don't** fork `Input`/`Button`/`Label`/`Checkbox` cho thế giới tối — cầu nối token đã lo, fork sẽ lệch khi app đổi component.
- **Don't** bịa social proof: không testimonial, không số người dùng, không logo khách, không giải thưởng (PRODUCT.md cấm tuyệt đối).
- **Don't** dùng box-shadow, nền trắng, card bo lớn hay gradient trang trí — trái Luật không bóng đổ và chất liệu thép/vacuum.
- **Don't** đặt hai khối vàng đặc trong cùng viewport (Luật một nguồn sáng).
- **Don't** thêm font mới thiếu subset `vietnamese`, hay viết hoa chữ body.
- **Don't** chép lại công thức tab, hằng số trục chart, hay bảng màu donut vào từng file — ba thứ đó đã có một nguồn (`src/lib/tab-styles.ts`, `src/lib/chart-axis.ts`, `src/lib/chart-colors.ts`). Chép là bắt đầu lệch.
- **Don't** để `<button>` chỉ có `onMouseEnter`/`onFocus` mà không có `onClick`: trình đọc màn hình đọc ra nút bấm được trong khi Enter không làm gì.
- **Don't** hứa tính năng chưa có trên UI (nhập thu nhập, recurring, ví, export, OAuth…) trong copy landing.
