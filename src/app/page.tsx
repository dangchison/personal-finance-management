import type { Metadata } from "next";
import { Landing } from "@/components/landing/landing";
import { pfFontVars } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Personal Finance — Mỗi đồng chi ra đều để lại vết",
  description:
    "Ghi chi tiêu trong vài giây, ngân sách đo theo thời gian thực, báo cáo 6 tháng. Tiếng Việt, VND, miễn phí 100%.",
};

const DIRECTION_CONTRACT = `<!--
THESIS: Landing la mot event display cua dong tien — moi giao dich la mot track vat ly toa tu tam thu nhap; tu choi hero SaaS trang + mockup iPhone + grid card deu nhau.
OWN-WORLD: nen vacuum #0B0F14, thep #223244, vong detector #3A5A7A, track vang #FFD23A / cyan #35D0FF, thanh nang luong do #FF4D4D; Chakra Petch caps + Roboto Mono tabular digits; panel vien hairline, nhan leader-line, so lieu minh hoa ghi ro.
STORY: nguoi xem hieu "moi dong chi ra deu de lai vet", tin san pham do duoc tien cua ho, bam dang ky mien phi.
FIRST VIEWPORT (mobile-first): H1 hai dong tren cung, sub + CTA vang ngay duoi, hang so dem count-up mono, ring section nguyen ven tron man ngay ke tiep.
FORM: collider event display (challenger scientific-notation-particle-detector-event-display), seed 054bb55e.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function LandingPage() {
  return (
    <div className={pfFontVars}>
      <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
      <Landing />
    </div>
  );
}
