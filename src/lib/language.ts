"use client";
import { useLocal } from "./store";
export const languages = [
  "English",
  "isiZulu",
  "Sesotho",
  "Setswana",
  "isiXhosa",
];
const labels: Record<string, string[]> = {
  "Career World": [
    "Umhlaba wemisebenzi",
    "Lefatše la mesebetsi",
    "Lefatshe la ditiro",
    "Ihlabathi lemisebenzi",
  ],
  "My Future": ["Ikusasa lami", "Bokamoso ba ka", "Isagwe ya me", "Ikamva lam"],
  "Discover Me": ["Ngizithole", "Itsebe", "Ikitse", "Zazi"],
  "Wellness Space": [
    "Indawo yenhlalakahle",
    "Sebaka sa boiketlo",
    "Lefelo la boitekanelo",
    "Indawo yempilo-ntle",
  ],
  "Future Games": [
    "Imidlalo yekusasa",
    "Lipapali tsa bokamoso",
    "Metshameko ya isagwe",
    "Imidlalo yekamva",
  ],
  "Opportunity Hub": ["Amathuba", "Menyetla", "Ditšhono", "Amathuba"],
  "Career Toolkit": [
    "Amathuluzi omsebenzi",
    "Lisebelisoa tsa mosebetsi",
    "Didiriswa tsa tiro",
    "Izixhobo zomsebenzi",
  ],
  Appointments: ["Izikhathi zokubonana", "Likopano", "Dikopano", "Amadinga"],
  Events: ["Imicimbi", "Liketsahalo", "Ditiragalo", "Imisitho"],
  Settings: ["Izilungiselelo", "Litlhophiso", "Dithulaganyo", "Iisetingi"],
  Reports: ["Imibiko", "Litlaleho", "Dipegelo", "Iingxelo"],
  Schools: ["Izikole", "Likolo", "Dikolo", "Izikolo"],
  Clients: ["Amaklayenti", "Bareki", "Bareki", "Abaxumi"],
  "Resource library": [
    "Umtapo wezinsiza",
    "Laeborari ea lisebelisoa",
    "Laeborari ya didiriswa",
    "Ithala lezixhobo",
  ],
  "Choose an option to continue.": [
    "Khetha okukodwa ukuze uqhubeke.",
    "Khetha e le ’ngoe ho tsoela pele.",
    "Tlhopha e le nngwe go tswelela.",
    "Khetha enye ukuze uqhubeke.",
  ],
  "Enter a sample name and a valid email address.": [
    "Faka igama lesibonelo nekheli le-imeyili elisebenzayo.",
    "Kenya lebitso la mohlala le aterese ea imeile e nepahetseng.",
    "Tsenya leina la sekao le aterese ya imeile e e siameng.",
    "Faka igama lomzekelo nedilesi ye-imeyile echanekileyo.",
  ],
  Home: ["Ikhaya", "Lehae", "Legae", "Ikhaya"],
  Services: ["Izinsizakalo", "Litšebeletso", "Ditirelo", "Iinkonzo"],
  Discover: ["Hlola", "Sibolla", "Ribolola", "Fumanisa"],
  Resources: ["Izinsiza", "Lisebelisoa", "Didiriswa", "Izixhobo"],
  About: ["Ngathi", "Ka rona", "Ka ga rona", "Ngathi"],
  Contact: ["Xhumana", "Ikopanye", "Ikgolaganye", "Qhagamshelana"],
  "Book a session": [
    "Bhukha isikhathi",
    "Behela kopano",
    "Beela kopano",
    "Bhukisha ixesha",
  ],
  "Start exploring": [
    "Qala ukuhlola",
    "Qala ho sibolla",
    "Simolola go ribolola",
    "Qala ukuhlola",
  ],
  "Our services": [
    "Izinsizakalo zethu",
    "Litšebeletso tsa rona",
    "Ditirelo tsa rona",
    "Iinkonzo zethu",
  ],
  Next: ["Okulandelayo", "E latelang", "E e latelang", "Okulandelayo"],
  Back: ["Emuva", "Morao", "Morago", "Emva"],
  Save: ["Gcina", "Boloka", "Boloka", "Gcina"],
  Name: ["Igama", "Lebitso", "Leina", "Igama"],
  Email: ["I-imeyili", "Imeile", "Imeile", "I-imeyile"],
  Dashboard: ["Ideshibhodi", "Phanele", "Phanele", "Ideshibhodi"],
  "Choose your path": [
    "Khetha indlela yakho",
    "Khetha tsela ea hao",
    "Tlhopha tsela ya gago",
    "Khetha indlela yakho",
  ],
};
export function useLanguage() {
  const [language, set] = useLocal("language", "English");
  const i = languages.indexOf(language) - 1;
  return { language, set, t: (s: string) => labels[s]?.[i] || s };
}
