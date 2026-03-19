"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import QRCodeDisplay from "./QRCodeDisplay";

const STORAGE_KEY = "rsvp_submitted";

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, delay, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export default function RSVPSection() {
  const { t, isRTL } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rsvpId, setRsvpId] = useState("");
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    attendance: "",
    companion: "",
    plusOneName: "",
    songSuggestion: "",
  });

  // ── Anti-abuse: check localStorage on mount ──
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) {
        setAlreadyDone(true);
      }
    } catch {
      // localStorage unavailable — ignore
    }
  }, []);

  // ── Reset companion fields when attendance changes to "no" ──
  const setAttendance = (val: string) => {
    if (val === "no") {
      setFormData((f) => ({
        ...f,
        attendance: val,
        companion: "",
        plusOneName: "",
        songSuggestion: "",
      }));
    } else {
      setFormData((f) => ({ ...f, attendance: val }));
    }
  };

  const canSubmit =
    formData.fullName.trim().length > 0 &&
    formData.attendance !== "" &&
    (formData.attendance === "no" || formData.companion !== "") &&
    !isSubmitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setRsvpId(data.rsvpId);
        setQrPayload(data.qrPayload ?? null);
        setSubmitted(true);
        try {
          localStorage.setItem(STORAGE_KEY, data.rsvpId);
        } catch {
          // ignore
        }
      } else if (data.error === "duplicate") {
        setSubmitError(t.alreadySubmitted);
      } else {
        setSubmitError(
          isRTL
            ? "صار خطأ. جرب مرة تانية"
            : "Something went wrong. Please try again."
        );
      }
    } catch {
      setSubmitError(
        isRTL
          ? "ما قدرنا نتواصل مع السيرفر. جرب بعدين"
          : "Could not reach the server. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelCls = `block text-xs tracking-[0.15em] uppercase mb-2 ${
    isRTL ? "font-arabic text-right text-text-muted" : "font-body text-text-muted"
  }`;
  const labelCls3 = `block text-xs tracking-[0.15em] uppercase mb-3 ${
    isRTL ? "font-arabic text-right text-text-muted" : "font-body text-text-muted"
  }`;

  return (
    <section className="px-6 py-20 sm:py-24" id="rsvp">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-10"
        >
          <motion.h2
            custom={0.1}
            variants={fadeInUp}
            className={`text-2xl sm:text-3xl tracking-[0.15em] uppercase mb-3 ${
              isRTL ? "font-arabic text-text-primary" : "font-serif text-text-primary"
            }`}
          >
            {t.rsvpTitle}
          </motion.h2>

          <motion.p
            custom={0.2}
            variants={fadeInUp}
            className={`text-sm leading-relaxed max-w-sm mx-auto ${
              isRTL ? "font-arabic text-text-secondary" : "font-body text-text-secondary"
            }`}
          >
            {t.rsvpSubtitle}
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {alreadyDone && !submitted ? (
            /* ── Already submitted guard ─────────── */
            <motion.div
              key="already"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rsvp-card p-8 sm:p-10 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-accent/40 flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
                  <path d="M10 20 L17 27 L30 13" stroke="#C4A265" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={`text-sm leading-relaxed ${isRTL ? "font-arabic text-text-secondary" : "font-body text-text-secondary"}`}>
                {t.alreadySubmitted}
              </p>
            </motion.div>
          ) : !submitted ? (
            <motion.div
              key="form"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.form
                custom={0.3}
                variants={fadeInUp}
                onSubmit={handleSubmit}
                className="rsvp-card p-8 sm:p-10 space-y-6"
              >
                {/* ── Full Name ── */}
                <div>
                  <label className={labelCls}>{t.fullName}</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className={`form-input ${isRTL ? "font-arabic text-right" : "font-body"}`}
                    placeholder={isRTL ? "الاسم الكامل" : "Your full name"}
                  />
                </div>

                {/* ── Attendance ── */}
                <div>
                  <label className={labelCls3}>{t.attendance}</label>
                  <div className="flex gap-3">
                    {(["yes", "no"] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        role="radio"
                        aria-checked={formData.attendance === val}
                        aria-label={val === "yes" ? t.attendanceYes : t.attendanceNo}
                        onClick={() => setAttendance(val)}
                        className={`flex-1 py-3 px-4 border text-sm tracking-wider transition-all duration-400 ${
                          formData.attendance === val
                            ? "border-accent bg-accent/8 text-accent-dark"
                            : "border-border text-text-muted hover:border-accent/40"
                        } ${isRTL ? "font-arabic" : "font-body"}`}
                      >
                        {val === "yes" ? t.attendanceYes : t.attendanceNo}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Conditional attending-only fields ── */}
                <AnimatePresence>
                  {formData.attendance === "yes" && (
                    <motion.div
                      key="attending-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="space-y-6 overflow-hidden"
                    >
                      {/* ── Companion ── */}
                      <div>
                        <label className={labelCls3}>{t.companion}</label>
                        <div className="flex gap-3">
                          {(["yes", "no"] as const).map((val) => (
                            <button
                              key={val}
                              type="button"
                              role="radio"
                              aria-checked={formData.companion === val}
                              aria-label={val === "yes" ? t.companionYes : t.companionNo}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  companion: val,
                                  plusOneName: val === "no" ? "" : formData.plusOneName,
                                })
                              }
                              className={`flex-1 py-3 px-4 border text-sm tracking-wider transition-all duration-400 ${
                                formData.companion === val
                                  ? "border-accent bg-accent/8 text-accent-dark"
                                  : "border-border text-text-muted hover:border-accent/40"
                              } ${isRTL ? "font-arabic" : "font-body"}`}
                            >
                              {val === "yes" ? t.companionYes : t.companionNo}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ── Plus-one Name (when companion = yes) ── */}
                      <AnimatePresence>
                        {formData.companion === "yes" && (
                          <motion.div
                            key="plusone"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <label className={labelCls}>{t.companionName}</label>
                            <input
                              type="text"
                              value={formData.plusOneName}
                              onChange={(e) =>
                                setFormData({ ...formData, plusOneName: e.target.value })
                              }
                              className={`form-input ${isRTL ? "font-arabic text-right" : "font-body"}`}
                              placeholder={isRTL ? t.companionNamePlaceholder : t.companionNamePlaceholder}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* ── Song Suggestion ── */}
                      <div>
                        <label className={labelCls}>{t.songSuggestion}</label>
                        <input
                          type="text"
                          value={formData.songSuggestion}
                          onChange={(e) =>
                            setFormData({ ...formData, songSuggestion: e.target.value })
                          }
                          className={`form-input ${isRTL ? "font-arabic text-right" : "font-body"}`}
                          placeholder={t.songPlaceholder}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Error ── */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 border border-damascus-rose/30 bg-damascus-rose/5 text-damascus-rose text-sm text-center"
                    role="alert"
                  >
                    <p className={isRTL ? "font-arabic" : "font-body"}>
                      {submitError}
                    </p>
                  </motion.div>
                )}

                {/* ── Submit ── */}
                <motion.button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full btn-primary mt-4 ${
                    isRTL ? "font-arabic" : "font-serif font-semibold"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2 justify-center">
                      <svg
                        className="animate-spin h-4 w-4 text-accent"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {t.sending}
                    </span>
                  ) : (
                    t.submit
                  )}
                </motion.button>
              </motion.form>
            </motion.div>
          ) : formData.attendance === "yes" ? (
            /* ── Attending confirmation (with QR) ── */
            <motion.div
              key="confirmation-yes"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rsvp-card p-8 sm:p-10 text-center"
            >
              {/* Checkmark */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-accent flex items-center justify-center">
                <motion.svg width="32" height="32" viewBox="0 0 40 40">
                  <motion.path
                    d="M10 20 L17 27 L30 13"
                    fill="none"
                    stroke="#C4A265"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                  />
                </motion.svg>
              </div>

              <h2
                className={`text-2xl sm:text-3xl mb-3 ${
                  isRTL ? "font-arabic-decorative text-text-primary" : "font-script text-text-primary"
                }`}
              >
                {t.confirmationTitle}
              </h2>

              <p
                className={`text-sm leading-relaxed max-w-sm mx-auto mb-8 ${
                  isRTL ? "font-arabic text-text-secondary" : "font-body text-text-secondary"
                }`}
              >
                {t.confirmationMessage}
              </p>

              {qrPayload && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                >
                  <div className="section-divider mb-6" />

                  <p
                    className={`text-xs mb-4 tracking-wider ${
                      isRTL ? "font-arabic text-text-muted" : "font-body text-text-muted"
                    }`}
                  >
                    {t.qrEntryPass}
                  </p>

                  <QRCodeDisplay
                    data={qrPayload}
                    size={160}
                    guestName={formData.fullName}
                    rsvpId={rsvpId}
                  />

                  <p
                    className={`text-xs mt-4 leading-relaxed max-w-xs mx-auto ${
                      isRTL ? "font-arabic text-text-muted" : "font-body text-text-muted italic"
                    }`}
                  >
                    {t.qrPresentAtEntrance}
                  </p>

                  {/* No children notice */}
                  <div className="mt-6 pt-5 border-t border-border">
                    <p
                      className={`text-xs tracking-wider ${
                        isRTL ? "font-arabic text-text-muted" : "font-body text-text-muted"
                      }`}
                    >
                      {t.noChildrenNotice}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* ── Decline confirmation (no QR) ── */
            <motion.div
              key="confirmation-no"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rsvp-card p-8 sm:p-10 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-accent/40 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 8 C14 8 9 12.5 9 18 C9 28 20 34 20 34 C20 34 31 28 31 18 C31 12.5 26 8 20 8Z"
                    stroke="#C4A265" strokeWidth="1.5" fill="none" />
                </svg>
              </div>

              <h2
                className={`text-2xl sm:text-3xl mb-3 ${
                  isRTL ? "font-arabic-decorative text-text-primary" : "font-script text-text-primary"
                }`}
              >
                {t.declineTitle}
              </h2>

              <p
                className={`text-sm leading-relaxed max-w-sm mx-auto ${
                  isRTL ? "font-arabic text-text-secondary" : "font-body text-text-secondary"
                }`}
              >
                {t.declineMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
