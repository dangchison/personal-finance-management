import { Chakra_Petch, Roboto_Mono, Saira } from "next/font/google";

/** Font của thế giới "máy dò" — dùng chung cho landing và trang đăng nhập/đăng ký. */
export const pfDisplay = Chakra_Petch({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-pf-display",
});

export const pfMono = Roboto_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-pf-mono",
});

export const pfBody = Saira({
  subsets: ["latin", "vietnamese"],
  variable: "--font-pf-body",
});

export const pfFontVars = `${pfDisplay.variable} ${pfMono.variable} ${pfBody.variable}`;
