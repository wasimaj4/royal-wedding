export type Locale = "en" | "ar";

export interface Translations {
  // Envelope page
  tapToOpen: string;
  
  // Invitation page
  weddingOf: string;
  groomName: string;
  brideName: string;
  and: string;
  coupleNames: string;
  
  // Event details
  eventDetails: string;
  date: string;
  dateValue: string;
  time: string;
  timeValue: string;
  womensHall: string;
  mensHall: string;
  viewOnMap: string;
  
  // Timeline
  programTimeline: string;
  timeline: { time: string; event: string }[];
  
  // Countdown
  countdown: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  
  // RSVP
  rsvpTitle: string;
  rsvpSubtitle: string;
  fullName: string;
  attendance: string;
  attendanceYes: string;
  attendanceNo: string;
  companion: string;
  companionYes: string;
  companionNo: string;
  submit: string;
  confirmationTitle: string;
  confirmationMessage: string;
  
  // Navigation
  invitation: string;
  rsvp: string;
  
  // Meta
  metaTitle: string;
  metaDescription: string;
}

export const translations: Record<Locale, Translations> = {
  en: {
    tapToOpen: "Tap to Open",
    
    weddingOf: "The Wedding of",
    groomName: "Wasim",
    brideName: "Rayan",
    and: "&",
    coupleNames: "Wasim & Rayan",
    
    eventDetails: "Event Details",
    date: "Date",
    dateValue: "17 May 2026",
    time: "Time",
    timeValue: "5:00 PM",
    womensHall: "Women's Hall",
    mensHall: "Men's Hall",
    viewOnMap: "View on Map",
    
    programTimeline: "Program Timeline",
    timeline: [
      { time: "5:00 PM", event: "Ceremony Begins" },
      { time: "6:00 PM", event: "Entrance of the Couple" },
      { time: "7:30 PM", event: "Dinner" },
      { time: "9:30 PM", event: "Cake Cutting" },
      { time: "10:00 PM", event: "Family Entrance & Congratulations" },
    ],
    
    countdown: "Counting Down to Our Special Day",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    
    rsvpTitle: "Kindly Respond",
    rsvpSubtitle: "We humbly request the honour of your presence at our celebration of love",
    fullName: "Full Name",
    attendance: "Will you attend?",
    attendanceYes: "Joyfully Accept",
    attendanceNo: "Respectfully Decline",
    companion: "One companion?",
    companionYes: "Yes",
    companionNo: "No",
    submit: "Send Response",
    confirmationTitle: "With Gratitude",
    confirmationMessage: "Your gracious response has been received. We are truly honoured and look forward to celebrating this blessed occasion with you.",
    
    invitation: "Invitation",
    rsvp: "RSVP",
    
    metaTitle: "Wasim & Rayan — Wedding Invitation",
    metaDescription: "You are cordially invited to the wedding celebration of Wasim & Rayan on 17 May 2026.",
  },
  ar: {
    tapToOpen: "اضغط للفتح",
    
    weddingOf: "حفل زفاف",
    groomName: "وسيم",
    brideName: "ريان",
    and: "و",
    coupleNames: "وسيم و ريان",
    
    eventDetails: "تفاصيل الحفل",
    date: "التاريخ",
    dateValue: "١٧ مايو ٢٠٢٦",
    time: "الوقت",
    timeValue: "٥:٠٠ مساءً",
    womensHall: "قاعة النساء",
    mensHall: "قاعة الرجال",
    viewOnMap: "عرض على الخريطة",
    
    programTimeline: "برنامج الحفل",
    timeline: [
      { time: "٥:٠٠", event: "بداية الحفل" },
      { time: "٦:٠٠", event: "دخول العروسين" },
      { time: "٧:٣٠", event: "العشاء" },
      { time: "٩:٣٠", event: "قطع الكيك" },
      { time: "١٠:٠٠", event: "دخول الأهل والتهاني" },
    ],
    
    countdown: "العد التنازلي ليومنا المميز",
    days: "أيام",
    hours: "ساعات",
    minutes: "دقائق",
    seconds: "ثواني",
    
    rsvpTitle: "نرجو تأكيد الحضور",
    rsvpSubtitle: "نتشرف بدعوتكم لحضور حفل زفافنا المبارك",
    fullName: "الاسم الكامل",
    attendance: "هل ستحضر؟",
    attendanceYes: "بكل سرور",
    attendanceNo: "أعتذر بكل احترام",
    companion: "مرافق واحد؟",
    companionYes: "نعم",
    companionNo: "لا",
    submit: "إرسال الرد",
    confirmationTitle: "مع خالص الامتنان",
    confirmationMessage: "تم استلام ردكم الكريم. نحن ممتنون لتشريفكم ونتطلع للاحتفال بهذه المناسبة المباركة معكم.",

    invitation: "الدعوة",
    rsvp: "تأكيد الحضور",
    
    metaTitle: "وسيم و ريان — دعوة زفاف",
    metaDescription: "يسعدنا دعوتكم لحضور حفل زفاف وسيم وريان بتاريخ ١٧ مايو ٢٠٢٦",
  },
};

export function getTranslation(locale: Locale): Translations {
  return translations[locale];
}
