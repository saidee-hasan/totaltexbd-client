import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Total Apparel",
  description: "How Total Apparel collects, uses, and protects your information.",
};

const sections = [
  {
    heading: "Information We Collect",
    body: "We collect the information you provide directly to us — such as your name, business email, company, phone number, and the details of your inquiry. We do not sell your personal information.",
  },
  {
    heading: "How We Use Your Information",
    body: "Your information is used solely to respond to your inquiry, provide quotations, and manage our business relationship. We may contact you about your request or related services.",
  },
  {
    heading: "Data Retention",
    body: "Inquiry records are retained only for as long as necessary to fulfill the purpose for which they were collected or to comply with legal obligations.",
  },
  {
    heading: "Your Rights",
    body: "You may request access to, correction of, or deletion of the personal information we hold about you by contacting us at the email address below.",
  },
  {
    heading: "Contact",
    body: "For any privacy-related questions, please contact us at id@totaltexbd.com.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="w-full min-h-screen bg-white pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A227] mb-4">
          Legal
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black mb-8">
          Privacy Policy
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
