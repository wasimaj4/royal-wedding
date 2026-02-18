"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import GoldOrnament from "./GoldOrnament";
import QRCodeDisplay from "./QRCodeDisplay";

interface RSVPPageProps {
  onBack: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, delay, ease: "easeOut" },
  }),
};

export default function RSVPPage({ onBack }: RSVPPageProps) {
  const { t, isRTL } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvpId, setRsvpId] = useState("");
  const [qrPayload, setQrPayload] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    attendance: "",
    companion: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setRsvpId(data.rsvpId);
        setQrPayload(data.qrPayload);
      }
    } catch (error) {
      console.error("RSVP submission error:", error);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="min-h-screen parchment-bg flex flex-col items-center justify-center relative px-6 py-16"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Soft vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(62,39,35,0.08)_100%)]" />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        onClick={onBack}
        className={`fixed top-4 ${isRTL ? "right-20" : "left-4"} z-40 px-4 py-2 text-sm font-serif tracking-wider text-gold-dark/60 hover:text-gold transition-colors duration-300
          ${isRTL ? "font-arabic" : ""}`}
      >
        ← {t.invitation}
      </motion.button>

      <div className="max-w-lg w-full relative z-10">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="gold-frame gold-frame-inner"
            >
              {/* Title */}
              <motion.div custom={0.2} variants={fadeInUp} className="text-center mb-8">
                <GoldOrnament type="top" />
                <h1
                  className={`text-3xl sm:text-4xl text-gold-dark mt-6 mb-3 ${
                    isRTL ? "font-arabic-decorative" : "font-script"
                  }`}
                >
                  {t.rsvpTitle}
                </h1>
                <p className={`text-sm text-gold-dark/60 leading-relaxed max-w-sm mx-auto ${isRTL ? "font-arabic" : "font-body"}`}>
                  {t.rsvpSubtitle}
                </p>
              </motion.div>

              <motion.div custom={0.4} variants={fadeInUp}>
                <div className="gold-divider-simple mb-8" />
              </motion.div>

              {/* Form */}
              <motion.form custom={0.6} variants={fadeInUp} onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label
                    className={`block text-sm tracking-[0.15em] uppercase text-gold-dark/60 mb-2 ${
                      isRTL ? "font-arabic text-right" : "font-serif"
                    }`}
                  >
                    {t.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-4 py-3 bg-parchment-dark/20 border border-gold/30 text-deep-brown
                      focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30
                      transition-all duration-500 text-lg
                      ${isRTL ? "font-arabic text-right" : "font-body"}`}
                    placeholder={isRTL ? "الاسم الكامل" : "Your full name"}
                  />
                </div>

                {/* Attendance */}
                <div>
                  <label
                    className={`block text-sm tracking-[0.15em] uppercase text-gold-dark/60 mb-3 ${
                      isRTL ? "font-arabic text-right" : "font-serif"
                    }`}
                  >
                    {t.attendance}
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attendance: "yes" })}
                      className={`flex-1 py-3 px-4 border text-sm tracking-wider transition-all duration-500
                        ${
                          formData.attendance === "yes"
                            ? "border-gold bg-gold/10 text-gold-dark"
                            : "border-gold/30 text-gold-dark/50 hover:border-gold/50"
                        }
                        ${isRTL ? "font-arabic" : "font-body"}`}
                    >
                      {t.attendanceYes}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attendance: "no" })}
                      className={`flex-1 py-3 px-4 border text-sm tracking-wider transition-all duration-500
                        ${
                          formData.attendance === "no"
                            ? "border-gold bg-gold/10 text-gold-dark"
                            : "border-gold/30 text-gold-dark/50 hover:border-gold/50"
                        }
                        ${isRTL ? "font-arabic" : "font-body"}`}
                    >
                      {t.attendanceNo}
                    </button>
                  </div>
                </div>

                {/* Companion */}
                <div>
                  <label
                    className={`block text-sm tracking-[0.15em] uppercase text-gold-dark/60 mb-3 ${
                      isRTL ? "font-arabic text-right" : "font-serif"
                    }`}
                  >
                    {t.companion}
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, companion: "yes" })}
                      className={`flex-1 py-3 px-4 border text-sm tracking-wider transition-all duration-500
                        ${
                          formData.companion === "yes"
                            ? "border-gold bg-gold/10 text-gold-dark"
                            : "border-gold/30 text-gold-dark/50 hover:border-gold/50"
                        }
                        ${isRTL ? "font-arabic" : "font-body"}`}
                    >
                      {t.companionYes}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, companion: "no" })}
                      className={`flex-1 py-3 px-4 border text-sm tracking-wider transition-all duration-500
                        ${
                          formData.companion === "no"
                            ? "border-gold bg-gold/10 text-gold-dark"
                            : "border-gold/30 text-gold-dark/50 hover:border-gold/50"
                        }
                        ${isRTL ? "font-arabic" : "font-body"}`}
                    >
                      {t.companionNo}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={!formData.fullName || !formData.attendance || !formData.companion || isSubmitting}
                  className={`w-full py-4 mt-4 border-2 border-gold text-gold-dark tracking-[0.25em] uppercase text-sm
                    hover:bg-gold hover:text-white transition-all duration-700 ease-in-out
                    disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold-dark
                    shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.25)]
                    ${isRTL ? "font-arabic" : "font-serif font-semibold"}`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {isRTL ? "جارٍ الإرسال..." : "Sending..."}
                    </span>
                  ) : (
                    t.submit
                  )}
                </motion.button>
              </motion.form>
            </motion.div>
          ) : (
            /* ── Confirmation Message + QR Code ──────── */
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="gold-frame gold-frame-inner text-center"
            >
              <GoldOrnament type="top" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="mt-8"
              >
                {/* Elegant checkmark */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-gold flex items-center justify-center">
                  <motion.svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                  >
                    <motion.path
                      d="M10 20 L17 27 L30 13"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1, duration: 1 }}
                    />
                  </motion.svg>
                </div>

                <h2
                  className={`text-3xl sm:text-4xl text-gold-dark mb-4 ${
                    isRTL ? "font-arabic-decorative" : "font-script"
                  }`}
                >
                  {t.confirmationTitle}
                </h2>

                <p
                  className={`text-base text-gold-dark/70 leading-relaxed max-w-sm mx-auto mb-8 ${
                    isRTL ? "font-arabic" : "font-body"
                  }`}
                >
                  {t.confirmationMessage}
                </p>

                {/* QR Code Section */}
                {qrPayload && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}
                  >
                    <div className="gold-divider-simple mb-6" />

                    <p className={`text-sm text-gold-dark/50 mb-4 tracking-wider ${
                      isRTL ? "font-arabic" : "font-serif"
                    }`}>
                      {isRTL
                        ? "رمز الدخول الخاص بك — يُرجى حفظه"
                        : "Your personal entry pass — please save it"}
                    </p>

                    <QRCodeDisplay
                      data={qrPayload}
                      size={180}
                      guestName={formData.fullName}
                      rsvpId={rsvpId}
                    />

                    <p className={`text-xs text-gold-dark/40 mt-4 leading-relaxed max-w-xs mx-auto ${
                      isRTL ? "font-arabic" : "font-body italic"
                    }`}>
                      {isRTL
                        ? "يُرجى تقديم رمز QR هذا عند الدخول"
                        : "Please present this QR code at the entrance"}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              <div className="mt-8">
                <GoldOrnament type="bottom" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
