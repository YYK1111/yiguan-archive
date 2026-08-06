import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "衣冠藏卷｜中华古籍服饰文化数字探索平台",
  description: "从古籍文字中发现服饰，以古画、壁画与文物相互印证，共同补全散落在历史中的衣冠线索。",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "衣冠藏卷",
    description: "一卷古籍，藏多少衣冠？",
    type: "website",
    images: [{ url: "/og.png", width: 1732, height: 907, alt: "衣冠藏卷：一卷古籍，藏多少衣冠？" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "衣冠藏卷",
    description: "一卷古籍，藏多少衣冠？",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
