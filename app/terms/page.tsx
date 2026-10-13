import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Total Apparel",
  description: "The terms governing the use of the Total Apparel website and services.",
};

const sections = [
  {
    heading: "Use of This Website",
    body: "This website is provided for informational and business inquiry purposes. By using it, you agree to use it lawfully and not to interfere with its operation or security.",
  },
  {
    heading: "Quotations & Orders",
    body: "Product information and pricing shown on this website are indicative only. All manufacturing engagements, quotations, and orders are subject to a separate written agreement between you and Total Apparel.",
  },
  {
    heading: "Intellectual Property",
    body: "All content on this website, including text, images, and branding, is the property of Total Apparel and may not be reproduced without prior written permission.",
  },
  {
    heading: "Limitation of Liability",
    body: "Total Apparel is not liable for any indirect or consequential loss arising from the use of this website. Content is provided on an \"as is\" basis.",
  },
  {
    heading: "Contact",
    body: "For questions about these terms, please contact us at id@totaltexbd.com.",
  },
];

export default function TermsPage() {
  return (
    <main className="w-full min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A227] mb-4">
          Legal
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black mb-8">
          Terms of Service
        </h1>
        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-lg font-bold text-black mb-2">{s.heading}</h2>
              <p className="text-sm leading-relaxed text-gray-600">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
