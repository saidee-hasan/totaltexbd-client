"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { fetchSectionMap, SectionRecord, getApiBase } from "@/lib/api";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
}

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  value,
  onChange,
  isTextArea = false,
}: InputFieldProps) => (
  <div className="flex flex-col gap-2 relative group w-full">
    <label htmlFor={`contact-${name}`} className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 group-focus-within:text-[#C9A227] transition-colors">{label}</label>
    {isTextArea ? (
      <textarea
        id={`contact-${name}`}
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-base text-white font-medium focus:border-[#C9A227] focus:bg-white/10 outline-none transition-all placeholder-white/30 backdrop-blur-md shadow-inner resize-none"
        placeholder={placeholder}
      />
    ) : (
      <input
        id={`contact-${name}`}
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-base text-white font-medium focus:border-[#C9A227] focus:bg-white/10 outline-none transition-all placeholder-white/30 backdrop-blur-md shadow-inner"
        placeholder={placeholder}
      />
    )}
  </div>
);

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [section, setSection] = useState<SectionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    let active = true;
    fetchSectionMap().then((map) => {
      if (!active) return;
      setSection(map["contact_hero"] || null);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const content = section?.content || {};
  const headingLine1 =
    content.headingLine1 ?? (section?.title ? section.title.replace(/\s+\S+$/, "") : "");
  const headingLine2 =
    content.headingLine2 ?? (section?.title ? section.title.split(/\s+/).slice(-1)[0] : "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);

    try {
      const res = await fetch(`${getApiBase()}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          message: formData.message,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setIsSuccess(true);
      setFormData({ fullName: "", email: "", company: "", phone: "", message: "" });
    } catch {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-[#0F172A]">
        <Loader2 className="w-12 h-12 text-[#C9A227] animate-spin" />
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen relative flex items-center justify-center overflow-hidden selection:bg-[#C9A227] selection:text-white pt-24 pb-12">
      
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        {(() => {
          const heroImage = section?.image || section?.images?.[0];
          return heroImage ? (
            <Image
              src={heroImage}
              alt="Total Apparel manufacturing facility"
              fill
              sizes="100vw"
              className="object-cover opacity-80"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[#0F172A]" />
          );
        })()}
        {/* Dual Gradient for perfect text readability and moody aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/70 to-[#0F172A]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C9A227]/5 via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT: Branding & Narrative */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
           <motion.div 
             initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
           >
             <div className="inline-flex items-center gap-2 border border-[#C9A227]/30 bg-[#C9A227]/10 px-4 py-1.5 rounded-full text-[#C9A227] text-[10px] font-black tracking-[0.2em] uppercase mb-8 shadow-[0_0_20px_rgba(201,162,39,0.1)] backdrop-blur-sm">
               <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
               {content.badgeText || section?.badgeText}
             </div>
             <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-4 sm:mb-6 leading-tight">
               {headingLine1} <br/>
               <span className="text-[#C9A227] italic font-serif font-light">{headingLine2}</span>
             </h1>
             <p className="text-gray-300 text-sm sm:text-base font-normal max-w-md leading-relaxed mb-8 sm:mb-10 drop-shadow-md">
               {section?.description}
             </p>
           </motion.div>

           {/* Contact Info Cards */}
           <div className="flex flex-col sm:flex-row lg:flex-col gap-6 w-full max-w-md">
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-[#C9A227]/50 hover:bg-white/10 transition-all duration-300 group">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 bg-black/50 group-hover:bg-[#C9A227] group-hover:border-[#C9A227] transition-all duration-300 shadow-lg">
                 <MapPin className="w-5 h-5 text-[#C9A227] group-hover:text-black transition-colors" />
               </div>
               <div className="flex flex-col justify-center">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1.5 group-hover:text-gray-300 transition-colors">{content.addressLabel || "Global Headquarters"}</h4>
                 <p className="text-sm font-medium text-gray-200 whitespace-pre-line">{content.address || "123 Manufacturing Ave.\nDhaka, Bangladesh"}</p>
               </div>
             </motion.div>

             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-[#C9A227]/50 hover:bg-white/10 transition-all duration-300 group">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 bg-black/50 group-hover:bg-[#C9A227] group-hover:border-[#C9A227] transition-all duration-300 shadow-lg">
                 <Mail className="w-5 h-5 text-[#C9A227] group-hover:text-black transition-colors" />
               </div>
               <div className="flex flex-col justify-center text-left">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1.5 group-hover:text-gray-300 transition-colors">{content.emailLabel || "Direct Inquiry"}</h4>
                 <a href={`mailto:${content.email || "id@totaltexbd.com"}`} className="text-sm sm:text-base font-normal text-white hover:text-[#C9A227] transition-colors inline-block break-all">
                   {content.email || "id@totaltexbd.com"}
                 </a>
               </div>
             </motion.div>
           </div>
        </div>

        {/* RIGHT: Glassmorphic Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 w-full max-w-2xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Subtle glow inside the form card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-16"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-4xl font-serif italic text-white mb-4">{content.successTitle || "Message Sent."}</h2>
                  <p className="text-gray-400 text-base max-w-md mx-auto mb-10 font-light leading-relaxed">
                    {content.successText || "Thank you for reaching out. A member of our global team will contact you shortly."}
                  </p>
                  <button onClick={() => setIsSuccess(false)} className="px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#C9A227] hover:text-white hover:shadow-[0_0_30px_rgba(201,162,39,0.3)] transition-all duration-300">
                    {content.successButton || "Send Another Inquiry"}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  className="flex flex-col relative z-10"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="mb-10 text-center lg:text-left">
                    <h3 className="text-3xl font-medium tracking-tight text-white mb-2">{content.formTitle || "Send Inquiry"}</h3>
                    <p className="text-sm font-light text-gray-400">{content.formSubtitle || "Connect with our manufacturing specialists to discuss your next big project."}</p>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Full Name" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} />
                      <InputField label="Business Email" name="email" type="email" placeholder="john@company.com" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Company (Optional)" name="company" placeholder="Acme Corp" required={false} value={formData.company} onChange={handleInputChange} />
                      <InputField label="Phone (Optional)" name="phone" type="tel" placeholder="+1 (555) 000-0000" required={false} value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <InputField label="Message" name="message" isTextArea placeholder="How can we help you?" value={formData.message} onChange={handleInputChange} />
                  </div>

                  {isError && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 mt-6 backdrop-blur-sm">
                      <AlertCircle className="w-4 h-4" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Error submitting. Please try again.</p>
                    </motion.div>
                  )}

                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full h-14 mt-10 rounded-full bg-white text-black hover:bg-[#C9A227] hover:text-white disabled:opacity-70 transition-all duration-500 hover:shadow-[0_0_40px_rgba(201,162,39,0.3)] hover:-translate-y-1 flex items-center justify-center gap-3 text-[12px] font-bold uppercase tracking-[0.15em]"
                  >
                    {isSubmitting ? (
                      <><div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> SUBMITTING...</>
                    ) : (
                      content.submitText || "Submit Request"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
