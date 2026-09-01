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
OWN-WORLD: hai rendition cung cong tac theme voi app, mac dinh giay sang (#EEF1F4) / buong toi #0B0F14; thep, vong detector, track vang / cyan, thanh nang luong do qua token --pf-*; Chakra Petch caps + Roboto Mono tabular digits; panel vien hairline, nhan leader-line, so lieu minh hoa ghi ro.
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
