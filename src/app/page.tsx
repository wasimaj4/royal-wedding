"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import EnvelopePage from "@/components/EnvelopePage";
import InvitationPage from "@/components/InvitationPage";
import RSVPPage from "@/components/RSVPPage";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function WeddingApp() {
  const [currentPage, setCurrentPage] = useState<"envelope" | "invitation" | "rsvp">("envelope");
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const { locale, isRTL } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale, isRTL]);

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpened(true);
    setTimeout(() => {
      setCurrentPage("invitation");
    }, 2000);
  };

  const navigateToRSVP = () => setCurrentPage("rsvp");
  const navigateToInvitation = () => setCurrentPage("invitation");

  return (
    <div className="min-h-screen parchment-bg">
      {/* Language Switcher — always visible */}
      <LanguageSwitcher />

      <AnimatePresence mode="wait">
        {currentPage === "envelope" && (
          <EnvelopePage
            key="envelope"
            onOpen={handleEnvelopeOpen}
            isOpening={isEnvelopeOpened}
          />
        )}
        {currentPage === "invitation" && (
          <InvitationPage
            key="invitation"
            onNavigateToRSVP={navigateToRSVP}
          />
        )}
        {currentPage === "rsvp" && (
          <RSVPPage
            key="rsvp"
            onBack={navigateToInvitation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <WeddingApp />
    </LanguageProvider>
  );
}
