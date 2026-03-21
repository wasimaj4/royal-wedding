export type Locale = "en" | "ar";

export interface Translations {
  youAreInvited: string;
  groomName: string;
  brideName: string;
  and: string;
  groomParent: string;
  brideParent: string;
  groomFamily: string;
  brideFamily: string;
  heroIntro: string;
  coupleNames: string;
  invitationText: string;
  eventDate: string;
  eventLocation: string;
  eventDetails: string;
  date: string;
  dateValue: string;
  time: string;
  timeValue: string;
  womensHall: string;
  mensHall: string;
  viewOnMap: string;
  programTimeline: string;
  timeline: { time: string; event: string }[];
  quranVerse: string;
  quranReference: string;
  countdown: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  rsvpTitle: string;
  rsvpSectionTitle: string;
  rsvpSubtitle: string;
  fullName: string;
  attendance: string;
  attendanceYes: string;
  attendanceNo: string;
  companion: string;
  companionYes: string;
  companionNo: string;
  companionName: string;
  companionNamePlaceholder: string;
  songSuggestion: string;
  songPlaceholder: string;
  submit: string;
  sending: string;
  confirmationTitle: string;
  confirmationMessage: string;
  declineTitle: string;
  declineMessage: string;
  qrEntryPass: string;
  qrPresentAtEntrance: string;
  rsvpDeadline: string;
  cancellationNotice: string;
  noChildrenNotice: string;
  saveQRCode: string;
  alreadySubmitted: string;
  invitation: string;
  rsvp: string;
  playMusic: string;
  pauseMusic: string;
  metaTitle: string;
  metaDescription: string;
  tapToOpen: string;
  dressCodeTitle: string;
  dressCodeText: string;
  foodDrinksTitle: string;
  foodIntro: string;
  foodItems: string[];
  drinksIntro: string;
  drinkItems: string[];
  foodNote: string;
  faqTitle: string;
  faqItems: { question: string; answer: string }[];
  contactTitle: string;
  contactCall: string;
  contactWhatsApp: string;
}

export const translations: Record<Locale, Translations> = {
  en: {
    youAreInvited: "You Are Invited!",
    groomName: "Wasim",
    brideName: "Rayan",
    and: "&",
    groomParent: "Son of Mr. Jamal Majanni",
    brideParent: "Daughter of the late Mahmoud Samman",
    groomFamily: "Son of Mr. Jamal Majanni",
    brideFamily: "Daughter of the late Mahmoud Samman",
    heroIntro: "",
    coupleNames: "Wasim & Rayan",
    invitationText: "Together with our families, and by the grace of Allah,\nWe are honored to invite you to our wedding celebration.",
    eventDate: "Sunday, 17 May 2026",
    eventLocation: "Vlaardingen, The Netherlands",
    eventDetails: "Event Details",
    date: "Date",
    dateValue: "17 May 2026",
    time: "Time",
    timeValue: "5:00 PM",
    womensHall: "Women\u2019s Hall",
    mensHall: "Men\u2019s Hall",
    viewOnMap: "View on Map",
    programTimeline: "Program Timeline",
    timeline: [
      { time: "17:00", event: "Ceremony Begins" },
      { time: "18:00", event: "Entrance of the Couple" },
      { time: "19:30", event: "Dinner" },
      { time: "21:30", event: "Cake Cutting" },
      { time: "22:00", event: "Family Entrance & Congratulations" },
    ],
    quranVerse: "\u201CAnd among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them, and He placed between you affection and mercy.\u201D",
    quranReference: "Qur\u2019an 30:21 (Surah Ar-Rum)",
    countdown: "Counting Down to Our Special Day",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    rsvpTitle: "Event Details & RSVP",
    rsvpSectionTitle: "RSVP",
    rsvpSubtitle: "We would be truly honoured by your presence at our celebration",
    fullName: "Full Name",
    attendance: "Will you attend?",
    attendanceYes: "Yes",
    attendanceNo: "No",
    companion: "Are you bringing a companion?",
    companionYes: "Yes",
    companionNo: "No",
    companionName: "Companion Name",
    companionNamePlaceholder: "Companion's full name",
    songSuggestion: "Song suggestion (optional)",
    songPlaceholder: "A song you\u2019d love to hear",
    submit: "Send Response",
    sending: "Sending...",
    confirmationTitle: "Thank You",
    confirmationMessage: "Your response has been received. We are truly honoured and look forward to celebrating this blessed occasion with you.",
    declineTitle: "We\u2019ll Miss You",
    declineMessage: "Thank you for letting us know. We hope to celebrate with you another time.",
    qrEntryPass: "Your personal entry pass \u2014 please save it",
    qrPresentAtEntrance: "Please present this QR code at the entrance",
    noChildrenNotice: "We are honoured to welcome you — sweet dreams to your little ones",
    rsvpDeadline: "(Please confirm your attendance before 01/05/2026)",
    cancellationNotice: "Please inform us at least 15 days in advance if you cannot attend",
    saveQRCode: "Save QR Code",
    alreadySubmitted: "You have already registered, thank you",
    invitation: "Invitation",
    rsvp: "RSVP",
    playMusic: "Play music",
    pauseMusic: "Pause music",
    metaTitle: "Wasim & Rayan \u2014 Wedding Invitation",
    metaDescription: "You are cordially invited to the wedding celebration of Wasim & Rayan on 17 May 2026.",
    tapToOpen: "Tap to open the invitation",
    dressCodeTitle: "Dress Code",
    dressCodeText: "We kindly invite our guests to wear elegant attire suitable for the occasion.\nThere will be one celebration only, so the same outfit can be worn throughout the evening.",
    foodDrinksTitle: "Food & Drinks",
    foodIntro: "Traditional dishes will be served including:",
    foodItems: ["Rice", "Bulgur", "Meat", "Chicken", "Mixed nuts", "Fruits"],
    drinksIntro: "Open beverages will also be available:",
    drinkItems: ["Coffee", "Tea", "Juices", "Cola"],
    foodNote: "No alcoholic drinks will be served.",
    faqTitle: "FAQ",
    faqItems: [
      { question: "Are children invited?", answer: "We kindly ask that the event remains adults only." },
      { question: "Is the wedding mixed?", answer: "No, the celebration will be in separate sections." },
      { question: "What drinks are available?", answer: "We are offering unlimited hot and cold drinks for you — without alcohol :)" },
    ],
    contactTitle: "Contact",
    contactCall: "Call",
    contactWhatsApp: "WhatsApp",
  },
  ar: {
    youAreInvited: "نتشرف بدعوتكم لحضور حفل زفاف",
    groomName: "\u0648\u0633\u064A\u0645",
    brideName: "ريّان",
    and: "\u0648",
    groomParent: "ابن السيد جمال مجنّي",
    brideParent: "ابنة المرحوم محمود سمّان",
    groomFamily: "حرم السيد جمال مجنّي",
    brideFamily: "حرم المرحوم محمود سمّان",
    heroIntro: "مع عائلتنا وبفضل الله، يسعدنا ويشرفنا أن ندعوكم إلى حفل زفاف",
    coupleNames: "\u0648\u0633\u064A\u0645 \u0648 \u0631\u064A\u0651\u0627\u0646",
    invitationText: "\u0645\u0639 \u0639\u0627\u0626\u0644\u062A\u064A\u0646\u0627\u060C \u0648\u0628\u0641\u0636\u0644 \u0627\u0644\u0644\u0647\u060C\n\u064A\u0633\u0639\u062F\u0646\u0627 \u0648\u064A\u0634\u0631\u0651\u0641\u0646\u0627 \u0623\u0646 \u0646\u062F\u0639\u0648\u0643\u0645 \u0625\u0644\u0649 \u062D\u0641\u0644 \u0632\u0641\u0627\u0641\u0646\u0627.",
    eventDate: "\u0627\u0644\u0623\u062D\u062F\u060C \u0661\u0667 \u0623\u064A\u0627\u0631 \u0662\u0660\u0662\u0666",
    eventLocation: "\u0641\u0644\u0627\u0631\u062F\u064A\u0646\u062E\u0646\u060C \u0647\u0648\u0644\u0646\u062F\u0627",
    eventDetails: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062D\u0641\u0644",
    date: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E",
    dateValue: "\u0661\u0667 \u0623\u064A\u0627\u0631 \u0662\u0660\u0662\u0666",
    time: "\u0627\u0644\u062A\u0648\u0642\u064A\u062A",
    timeValue: "\u0665:\u0660\u0660 \u0645\u0633\u0627\u0621\u064B",
    womensHall: "\u0642\u0627\u0639\u0629 \u0627\u0644\u0646\u0633\u0627\u0621",
    mensHall: "\u0642\u0627\u0639\u0629 \u0627\u0644\u0631\u062C\u0627\u0644",
    viewOnMap: "\u0639\u0631\u0636 \u0639\u0644\u0649 \u0627\u0644\u062E\u0631\u064A\u0637\u0629",
    programTimeline: "\u0628\u0631\u0646\u0627\u0645\u062C \u0627\u0644\u062D\u0641\u0644",
    timeline: [
      { time: "١٧:٠٠", event: "بداية الحفل" },
      { time: "١٨:٠٠", event: "دخلة العرسان" },
      { time: "١٩:٣٠", event: "العشاء" },
      { time: "٢١:٣٠", event: "قطع الكاتو" },
      { time: "٢٢:٠٠", event: "دخلة الأهل والتهاني" },
    ],
    quranVerse: "\u201C\u0648\u064E\u0645\u0650\u0646\u0652 \u0622\u064A\u0627\u062A\u0650\u0647\u0650 \u0623\u064E\u0646\u0652 \u062E\u064E\u0644\u064E\u0642\u064E \u0644\u064E\u0643\u064F\u0645\u0652 \u0645\u0650\u0646\u0652 \u0623\u064E\u0646\u0641\u064F\u0633\u0650\u0643\u064F\u0645\u0652 \u0623\u064E\u0632\u0652\u0648\u0627\u062C\u064B\u0627 \u0644\u0650\u062A\u064E\u0633\u0652\u0643\u064F\u0646\u064F\u0648\u0627 \u0625\u0650\u0644\u064E\u064A\u0652\u0647\u0627\u060C \u0648\u064E\u062C\u064E\u0639\u064E\u0644\u064E \u0628\u064E\u064A\u0652\u0646\u064E\u0643\u064F\u0645\u0652 \u0645\u064E\u0648\u064E\u062F\u0651\u0629\u064B \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064B\u201D",
    quranReference: "\u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645 \u2014 \u0633\u0648\u0631\u0629 \u0627\u0644\u0631\u0648\u0645\u060C \u0627\u0644\u0622\u064A\u0629 \u0662\u0661",
    countdown: "\u0627\u0644\u0639\u062F \u0627\u0644\u062A\u0646\u0627\u0632\u0644\u064A \u0644\u064A\u0648\u0645\u0646\u0627 \u0627\u0644\u0645\u0645\u064A\u0632",
    days: "\u064A\u0648\u0645",
    hours: "\u0633\u0627\u0639\u0629",
    minutes: "\u062F\u0642\u064A\u0642\u0629",
    seconds: "\u062B\u0627\u0646\u064A\u0629",
    rsvpTitle: "تفاصيل الحفل وتأكيد الحضور",
    rsvpSectionTitle: "تأكيد الحضور",
    rsvpSubtitle: "",
    fullName: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
    attendance: "هل سوف تحضر؟",
    attendanceYes: "نعم",
    attendanceNo: "لا",
    companion: "هل لديك مرافق؟",
    companionYes: "نعم",
    companionNo: "لا",
    companionName: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0631\u0627\u0641\u0642",
    companionNamePlaceholder: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u0644\u0645\u0631\u0627\u0641\u0642",
    songSuggestion: "\u0627\u0642\u062A\u0631\u0627\u062D \u0623\u063A\u0646\u064A\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)",
    songPlaceholder: "\u0623\u063A\u0646\u064A\u0629 \u062A\u062D\u0628\u0648\u0627 \u062A\u0633\u0645\u0639\u0648\u0647\u0627",
    submit: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u062F",
    sending: "\u0639\u0645 \u064A\u0628\u0639\u062A...",
    confirmationTitle: "\u0627\u0644\u0644\u0647 \u064A\u062D\u0641\u0638\u0643\u0645",
    confirmationMessage: "\u0648\u0635\u0644 \u0631\u062F\u0643\u0645. \u0634\u0631\u0641\u062A\u0648\u0646\u0627 \u0648\u0625\u0646 \u0634\u0627\u0621 \u0627\u0644\u0644\u0647 \u0645\u0646\u062A\u0644\u0627\u0642\u0649 \u0628\u0647\u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u062D\u0644\u0648.",
    declineTitle: "\u0627\u0644\u0644\u0647 \u064A\u0628\u0627\u0631\u0643 \u0641\u064A\u0643\u0645",
    declineMessage: "\u0634\u0643\u0631\u0627\u064B \u0639\u0627\u0644\u0631\u062F. \u0625\u0646 \u0634\u0627\u0621 \u0627\u0644\u0644\u0647 \u0645\u0646\u062A\u0644\u0627\u0642\u0649 \u0628\u0645\u0646\u0627\u0633\u0628\u0629 \u062A\u0627\u0646\u064A\u0629.",
    qrEntryPass: "\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u062E\u0627\u0635\u0629 \u0641\u064A\u0643 \u2014 \u0627\u062D\u0641\u0638\u0647\u0627",
    qrPresentAtEntrance: "\u0631\u062C\u0627\u0621\u064B \u0637\u0644\u0651\u0639 \u0627\u0644\u0640 QR \u0639\u0646\u062F \u0627\u0644\u0628\u0627\u0628",
    noChildrenNotice: "نتشرف بكم و نوما هنيئا لأطفالكم",
    rsvpDeadline: "(يرجى تأكيد الحضور قبل 01/05/2026)",
    cancellationNotice: "يرجى إبلاغنا في حال حدوث ظرف يمنع حضوركم قبل 15 يوم على الأقل",
    saveQRCode: "\u062D\u0641\u0638 \u0627\u0644\u0631\u0645\u0632",
    alreadySubmitted: "تم تسجيلك مسبقًا، شكرًا لك",
    invitation: "\u0627\u0644\u062F\u0639\u0648\u0629",
    rsvp: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0636\u0648\u0631",
    playMusic: "\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0645\u0648\u0633\u064A\u0642\u0649",
    pauseMusic: "\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0645\u0648\u0633\u064A\u0642\u0649",
    metaTitle: "\u0648\u0633\u064A\u0645 \u0648 \u0631\u064A\u0627\u0646 \u2014 \u062F\u0639\u0648\u0629 \u0632\u0641\u0627\u0641",
    metaDescription: "\u064A\u0633\u0639\u062F\u0646\u0627 \u062F\u0639\u0648\u062A\u0643\u0645 \u0644\u062D\u0636\u0648\u0631 \u062D\u0641\u0644 \u0632\u0641\u0627\u0641 \u0648\u0633\u064A\u0645 \u0648\u0631\u064A\u0627\u0646 \u0628\u062A\u0627\u0631\u064A\u062E \u0661\u0667 \u0623\u064A\u0627\u0631 \u0662\u0660\u0662\u0666",
    tapToOpen: "اضغط لفتح الدعوة",
    dressCodeTitle: "لباس الحفل",
    dressCodeText: "نرحب بكم في حفل زفافنا وندعوكم لارتداء لباس أنيق يليق بالمناسبة.\nسيكون هناك احتفال واحد فقط خلال الأمسية لذلك سيكون لباس واحد طوال الحفل.",
    foodDrinksTitle: "الطعام والمشروبات",
    foodIntro: "سيتم تقديم مأكولات شرقية تتضمن:",
    foodItems: ["رز", "برغل", "لحم", "دجاج", "بعض المكسرات", "فواكه"],
    drinksIntro: "كما تتوفر مشروبات مفتوحة مثل:",
    drinkItems: ["قهوة", "شاي", "عصائر", "كولا"],
    foodNote: "لا يتم تقديم أي مشروبات كحولية.",
    faqTitle: "الأسئلة الشائعة",
    faqItems: [
      { question: "هل الأطفال مدعوون؟", answer: "نعتذر، الحفل مخصص للبالغين فقط." },
      { question: "هل الحفل مختلط؟", answer: "لا، الحفل منفصل" },
      { question: "ما هي المشروبات المتوفرة؟", answer: "نقدّم لكم مشروبات ساخنة وباردة بلا حدود — بدون كحول :)" },
    ],
    contactTitle: "تواصل معنا",
    contactCall: "اتصل بنا",
    contactWhatsApp: "واتساب",
  },
};

export function getTranslation(locale: Locale): Translations {
  return translations[locale];
}
