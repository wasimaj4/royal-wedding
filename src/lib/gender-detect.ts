// Common Arabic and English name patterns for gender detection

const MALE_ARABIC = new Set([
  "محمد", "أحمد", "احمد", "علي", "عمر", "حسن", "حسين", "خالد", "يوسف", "إبراهيم", "ابراهيم",
  "عبدالله", "عبد الله", "مصطفى", "كريم", "طارق", "سعيد", "سعد", "فهد", "ماجد", "سلطان",
  "ناصر", "فيصل", "بلال", "أنس", "انس", "زياد", "رامي", "وليد", "باسم", "هاني", "رائد",
  "عادل", "صالح", "جمال", "نبيل", "وسيم", "وسام", "عمار", "ياسر", "ياسين", "حمزة", "أيمن",
  "ايمن", "سامر", "سامي", "رشيد", "منير", "عماد", "شريف", "عبدالرحمن", "عبد الرحمن",
  "عبدالعزيز", "عبد العزيز", "معاذ", "أسامة", "اسامة", "تامر", "نزار", "مروان", "فادي",
  "غسان", "هشام", "إياد", "اياد", "بشار", "رياض", "زيد", "زيدان", "ادم", "آدم",
  "مالك", "رعد", "حيدر", "جواد", "عباس", "اسماعيل", "إسماعيل", "داوود", "داود",
  "رضوان", "سليمان", "موسى", "هارون", "لؤي", "نواف", "تركي", "بندر", "ثامر",
  "عثمان", "معتصم", "معتز", "طلال", "منصور", "حاتم", "أشرف", "اشرف", "عصام",
  "نادر", "قاسم", "شادي", "مازن", "أمجد", "امجد", "رامز", "وائل", "باسل",
]);

const FEMALE_ARABIC = new Set([
  "فاطمة", "عائشة", "مريم", "خديجة", "زينب", "نور", "سارة", "سارا", "هدى", "ليلى", "ليلا",
  "أمينة", "امينة", "سمية", "سميرة", "لينا", "دينا", "رنا", "منى", "سلمى", "ريم", "ريما",
  "هبة", "غادة", "عبير", "سهام", "نوال", "لمياء", "لميس", "ميسون", "رغد", "جنى",
  "هيا", "لجين", "تالا", "رزان", "دلال", "نسرين", "ناديا", "نادية", "ياسمين", "سوسن",
  "رشا", "أمل", "امل", "سحر", "وفاء", "نجوى", "مها", "بثينة", "هناء", "اسراء", "إسراء",
  "رانيا", "دانة", "دانا", "شيماء", "حنان", "إيمان", "ايمان", "صفاء", "سناء", "زهراء",
  "آلاء", "الاء", "بتول", "مرح", "ملاك", "حلا", "ديما", "رنيم", "تسنيم", "لارا",
  "نورة", "نوره", "أسماء", "اسماء", "رقية", "سمر", "شهد", "جنان", "لين", "سيلين",
  "مسرة", "ماسة", "روان", "تسنيم", "رؤى", "بيان", "حور", "عفاف", "مياسة",
  "نبيلة", "سعاد", "رجاء", "كوثر", "اعتدال", "سهير", "منال", "أنيسة", "انيسة",
  "ريان", "رايان",
]);

const MALE_ENGLISH = new Set([
  "mohammed", "muhammad", "mohamed", "ahmad", "ahmed", "ali", "omar", "hassan", "hussein",
  "khaled", "khalid", "youssef", "yosef", "ibrahim", "abdullah", "mustafa", "karim",
  "tarek", "tariq", "said", "saad", "fahd", "majed", "sultan", "nasser", "faisal",
  "bilal", "anas", "ziad", "rami", "walid", "waleed", "bassem", "hani", "raed",
  "adel", "saleh", "jamal", "nabil", "wasim", "wassim", "wissam", "ammar", "yasser",
  "yassin", "hamza", "ayman", "samer", "sami", "rashid", "munir", "imad", "sharif", "sherif",
  "abdulrahman", "muath", "osama", "tamer", "nizar", "marwan", "fadi", "ghassan",
  "hisham", "iyad", "bashar", "riad", "zaid", "adam", "malik", "raad", "haider",
  "jawad", "abbas", "ismail", "dawood", "ridwan", "sulaiman", "musa", "haroun",
  "louai", "nawaf", "turki", "bandar", "thamer", "othman", "talal", "mansour",
  "hatem", "ashraf", "essam", "nader", "qasim", "shadi", "mazen", "amjad", "ramez",
  "wael", "basel", "john", "james", "david", "michael", "robert", "william", "richard",
  "thomas", "mark", "steven", "paul", "daniel", "peter", "andrew", "george", "brian",
  "kevin", "jason", "jeff", "jeffrey", "ryan", "nick", "nicholas", "chris", "christopher",
  "matt", "matthew", "tim", "timothy", "alex", "alexander", "sam", "samuel", "ben",
  "benjamin", "jack", "jake", "luke", "noah", "max", "leon", "jan", "pieter", "henk",
  "rob", "bart", "joost", "jeroen", "dennis", "rick", "ruben", "daan", "sem", "liam",
]);

const FEMALE_ENGLISH = new Set([
  "fatima", "aisha", "aysha", "maryam", "mariam", "khadija", "zainab", "noor", "nour",
  "sarah", "sara", "huda", "layla", "leila", "lila", "amina", "sumaya", "samira",
  "lina", "dina", "rana", "mona", "salma", "reem", "reema", "heba", "ghada", "abeer",
  "siham", "nawal", "lamia", "lamees", "maysoon", "raghad", "jana", "haya", "lujain",
  "tala", "razan", "dalal", "nasreen", "nadia", "yasmin", "yasmine", "sawsan", "rasha",
  "amal", "sahar", "wafa", "najwa", "maha", "hanaa", "israa", "rania", "dana",
  "shimaa", "hanan", "iman", "safaa", "sanaa", "zahra", "alaa", "batoul", "marah",
  "malak", "hala", "dima", "raneem", "tasneem", "tasnim", "lara", "noura", "asma",
  "ruqaya", "samar", "shahd", "jinan", "leen", "celine", "selin", "masah", "masa",
  "rowan", "rawan", "ruaa", "bayan", "hoor", "afaf", "nabila", "suad", "rajaa",
  "kawthar", "suhair", "manal", "anisa", "rayan", "mary", "sarah", "jennifer", "jessica",
  "lisa", "ashley", "emily", "emma", "anna", "sophie", "maria", "laura", "julia",
  "nicole", "rachel", "michelle", "amanda", "stephanie", "rebecca", "katherine",
  "hannah", "megan", "natalie", "victoria", "claire", "charlotte", "olivia", "eva",
  "linda", "anne", "anke", "marieke", "sanne", "femke", "fleur", "iris", "lisa",
  "jasmijn", "esther", "miriam", "meseret",
]);

export type Gender = "male" | "female" | "unknown";

export function detectGender(name: string): Gender {
  if (!name) return "unknown";

  const cleaned = name.trim();
  // Try Arabic detection first
  const arabicFirst = cleaned.split(/\s+/)[0];

  if (MALE_ARABIC.has(arabicFirst)) return "male";
  if (FEMALE_ARABIC.has(arabicFirst)) return "female";

  // Try English detection (lowercase)
  const englishFirst = cleaned.split(/\s+/)[0].toLowerCase();

  if (MALE_ENGLISH.has(englishFirst)) return "male";
  if (FEMALE_ENGLISH.has(englishFirst)) return "female";

  // Arabic name ending heuristics
  // Names ending in ة (ta marbuta) are usually female
  if (arabicFirst.endsWith("ة") || arabicFirst.endsWith("ه")) return "female";
  // Names ending in اء are usually female
  if (arabicFirst.endsWith("اء")) return "female";

  // English name ending heuristics
  if (englishFirst.endsWith("a") || englishFirst.endsWith("ah") || englishFirst.endsWith("een")) {
    // Could be female, but not certain enough to auto-assign
  }

  return "unknown";
}
