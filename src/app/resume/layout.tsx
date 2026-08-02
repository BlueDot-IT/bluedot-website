import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Background",
  description: "A concise current professional profile for Jason O'Neal and BlueDot IT.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
