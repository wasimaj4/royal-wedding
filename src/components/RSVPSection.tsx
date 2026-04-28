"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    attendance: "",
    companion: "",
    plusOneName: "",
    songSuggestion: "",
    _website: "",        // honeypot (invisible to users)
    _email_confirm: "",  // honeypot (invisible to users)
  });

  // ── Admin mode: ?admin=1 in URL skips duplicate guards ──
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "1") {
        setIsAdmin(true);
        return; // skip localStorage check for admin
      }
    }
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) {
        setAlreadyDone(true);
      }
    } catch {
      // localStorage unavailable — ignore
    }
  }, []);

  // ── Live guest counter ──
  const [guestCount, setGuestCount] = useState<number | null>(null);

  const fetchCount = useCallback(() => {
    fetch("/api/rsvp/count")
      .then((r) => r.json())
      .then((d) => { if (typeof d.totalGuests === "number") setGuestCount(d.totalGuests); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30_000); // refresh every 30s
    return () => clearInterval(interval);
  }, [fetchCount]);

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
        body: JSON.stringify({ ...formData, admin: isAdmin || undefined }),
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
        setAlreadyDone(true);
        try { localStorage.setItem(STORAGE_KEY, data.existingId || "done"); } catch {}
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
    isRTL ? "font-arabic-label text-right text-text-muted" : "font-body text-text-muted"
  }`;
  const labelCls3 = `block text-xs tracking-[0.15em] uppercase mb-3 ${
    isRTL ? "font-arabic-label text-right text-text-muted" : "font-body text-text-muted"
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
            className={`text-2xl sm:text-3xl mb-3 ${
              isRTL ? "font-arabic-label font-semibold text-text-primary" : "font-serif tracking-[0.15em] uppercase text-text-primary"
            }`}
          >
            {t.rsvpSectionTitle}
          </motion.h2>

          <motion.p
            custom={0.2}
            variants={fadeInUp}
            className={`text-sm leading-relaxed max-w-sm mx-auto ${
              isRTL ? "font-arabic-label text-text-secondary" : "font-body text-text-secondary"
            }`}
          >
            {t.rsvpSubtitle}
          </motion.p>

          {/* Live guest counter */}
          {guestCount !== null && guestCount > 0 && (
            <motion.div
              custom={0.35}
              variants={fadeInUp}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-white/60 backdrop-blur-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className={`text-xs ${
                isRTL ? "font-arabic-label text-text-secondary" : "font-body text-text-secondary"
              }`}>
                <span className="font-bold text-accent-dark">{guestCount}</span>{" "}
                {t.guestCounterJoining}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* ── WhatsApp Quick RSVP ── */}
        {!alreadyDone && !submitted && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.25}
            variants={fadeInUp}
            className="mb-8"
          >
            <div
              className="relative overflow-hidden rounded-lg p-5 sm:p-6 text-center"
              style={{
                background: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(37,211,102,0.2)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 4px 20px rgba(37,211,102,0.06)",
              }}
            >
              <p
                className={`text-sm font-semibold mb-1 ${
                  isRTL
                    ? "font-arabic-label text-text-primary"
                    : "font-body text-text-primary"
                }`}
              >
                {t.whatsappQuickTitle}
              </p>
              <p
                className={`text-xs mb-4 ${
                  isRTL
                    ? "font-arabic-label text-text-muted"
                    : "font-body text-text-muted"
                }`}
              >
                {t.whatsappQuickDesc}
              </p>

              <a
                href={`https://wa.me/31647264549?text=${encodeURIComponent(
                  isRTL
                    ? "السلام عليكم! يسعدني تأكيد حضوري لحفل الزفاف. اسمي: "
                    : "Hi! I'm coming to the wedding. My name is: "
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  boxShadow: "0 4px 14px rgba(37,211,102,0.3)",
                }}
              >
                {/* WhatsApp icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t.whatsappQuickBtn}
              </a>

              <p
                className={`text-[11px] mt-3 ${
                  isRTL
                    ? "font-arabic-label text-text-muted/60"
                    : "font-body text-text-muted/60"
                }`}
              >
                {t.whatsappQuickOr}
              </p>
            </div>
          </motion.div>
        )}

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
              <p className={`text-sm leading-relaxed ${isRTL ? "font-arabic-label text-text-secondary" : "font-body text-text-secondary"}`}>
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
                    className={`form-input ${isRTL ? "font-arabic-label text-right" : "font-body"}`}
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
                        } ${isRTL ? "font-arabic-label" : "font-body"}`}
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
                              } ${isRTL ? "font-arabic-label" : "font-body"}`}
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
                              className={`form-input ${isRTL ? "font-arabic-label text-right" : "font-body"}`}
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
                          className={`form-input ${isRTL ? "font-arabic-label text-right" : "font-body"}`}
                          placeholder={t.songPlaceholder}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Honeypot fields (invisible to real users, catches bots) ── */}
                <div aria-hidden="true" tabIndex={-1} style={{ position: "absolute", left: "-9999px", top: "-9999px", height: 0, width: 0, overflow: "hidden" }}>
                  <input
                    type="text"
                    name="_website"
                    autoComplete="off"
                    tabIndex={-1}
                    value={formData._website}
                    onChange={(e) => setFormData({ ...formData, _website: e.target.value })}
                  />
                  <input
                    type="email"
                    name="_email_confirm"
                    autoComplete="off"
                    tabIndex={-1}
                    value={formData._email_confirm}
                    onChange={(e) => setFormData({ ...formData, _email_confirm: e.target.value })}
                  />
                </div>

                {/* ── Error ── */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 border border-damascus-rose/30 bg-damascus-rose/5 text-damascus-rose text-sm text-center"
                    role="alert"
                  >
                    <p className={isRTL ? "font-arabic-label" : "font-body"}>
                      {submitError}
                    </p>
                  </motion.div>
                )}

                {/* ── Submit ── */}
                <motion.button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full btn-primary mt-4 ${
                    isRTL ? "font-arabic-label font-semibold" : "font-serif font-semibold"
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

                {/* RSVP deadline */}
                <p
                  className={`text-center text-sm sm:text-base font-bold leading-relaxed mt-3 ${
                    isRTL ? "font-arabic-label text-text-primary/85" : "font-body text-text-primary/85"
                  }`}
                >
                  {t.rsvpDeadline}
                </p>

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
                  isRTL ? "font-arabic-label text-text-secondary" : "font-body text-text-secondary"
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
                  <div className="section-divider mb-8" />

                  {/* ── Premium Entry Pass Card ── */}
                  <motion.div
                    className="mx-auto max-w-[280px] rounded-2xl px-5 py-6 sm:px-6 sm:py-7 text-center"
                    style={{
                      background: "#f8f5f0",
                      border: "1px solid rgba(196,162,101,0.3)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Entry Pass title */}
                    <p
                      className={`text-xs sm:text-[13px] font-medium tracking-wider mb-4 ${
                        isRTL ? "font-arabic-label text-text-primary/80" : "font-body uppercase text-text-primary/80"
                      }`}
                    >
                      {isRTL ? "\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062F\u062E\u0648\u0644" : "Entry Pass"}
                    </p>

                    <QRCodeDisplay
                      data={qrPayload}
                      size={160}
                      guestName={formData.fullName}
                      rsvpId={rsvpId}
                    />

                    {/* Present at entrance subtitle */}
                    <p
                      className={`text-[11px] sm:text-xs mt-4 leading-relaxed max-w-[220px] mx-auto ${
                        isRTL ? "font-arabic-label text-text-primary/55" : "font-body text-text-primary/55"
                      }`}
                    >
                      {isRTL ? "\u064A\u0631\u062C\u0649 \u0625\u0628\u0631\u0627\u0632 \u0627\u0644\u0631\u0645\u0632 \u0639\u0646\u062F \u0627\u0644\u062F\u062E\u0648\u0644" : "Please present this code at the entrance"}
                    </p>
                  </motion.div>

                  {/* Cancellation notice */}
                  <div className="mt-6 pt-5 border-t border-border/40 max-w-xs mx-auto">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8, duration: 0.8 }}
                      className={`text-sm sm:text-base font-bold leading-relaxed ${
                        isRTL ? "font-arabic-label text-text-primary/85" : "font-body text-text-primary/85"
                      }`}
                    >
                      {t.cancellationNotice}
                    </motion.p>
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
                  isRTL ? "font-arabic-label text-text-secondary" : "font-body text-text-secondary"
                }`}
              >
                {t.declineMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Children-welcome note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className={`mt-10 text-[13px] sm:text-sm font-medium text-center text-[#A93226] ${
            isRTL ? "font-arabic-label" : "font-body"
          }`}
        >
          {t.noChildrenNotice}
        </motion.p>
      </div>
    </section>
  );
}
