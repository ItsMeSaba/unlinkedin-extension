import eng from "./eng.json";
import kat from "./kat.json";
import jpn from "./jpn.json";
import ben from "./ben.json";
import hin from "./hin.json";
import arb from "./arb.json";
import cmn from "./cmn.json";
import ukr from "./ukr.json";
import rus from "./rus.json";
import spa from "./spa.json";
import fra from "./fra.json";
import deu from "./deu.json";
import pol from "./pol.json";

/**
 * Keywords organized by language ISO 639-3 codes
 * Each language object contains categories with their respective keywords
 */
export const keywordsByLanguages = {
  eng, // English
  kat, // Georgian
  jpn, // Japanese
  ben, // Bengali
  hin, // Hindi
  arb, // Standard Arabic
  cmn, // Mandarin Chinese
  ukr, // Ukrainian
  rus, // Russian
  spa, // Spanish
  fra, // French
  deu, // German
  pol, // Polish
};
