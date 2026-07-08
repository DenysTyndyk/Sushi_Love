"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/shared/orderValidation.ts
var orderValidation_exports = {};
__export(orderValidation_exports, {
  BOTTLE_DEPOSIT_PLN: () => BOTTLE_DEPOSIT_PLN,
  DELIVERY_FEE_PLN: () => DELIVERY_FEE_PLN,
  DELIVERY_MIN_SUBTOTAL_PLN: () => DELIVERY_MIN_SUBTOTAL_PLN,
  EMAIL_RE: () => EMAIL_RE,
  calculateBottleDepositPln: () => calculateBottleDepositPln,
  isDeliveryAvailable: () => isDeliveryAvailable,
  validateOrderPayload: () => validateOrderPayload
});
module.exports = __toCommonJS(orderValidation_exports);

// src/shared/bottleDeposit.ts
var BOTTLE_DEPOSIT_PLN = 0.5;
function isDrinkLineId(id) {
  const base = String(id || "").split("__")[0];
  return base.startsWith("drink-") && !base.startsWith("drink-h-");
}
function countDrinkUnits(cart) {
  let units = 0;
  for (const line of cart) {
    if (!isDrinkLineId(line.id)) continue;
    const qty = Math.floor(Number(line.quantity));
    if (Number.isFinite(qty) && qty > 0) {
      units += qty;
    }
  }
  return units;
}
function calculateBottleDepositPln(cart) {
  const units = countDrinkUnits(cart);
  if (units <= 0) return 0;
  return Math.round(units * BOTTLE_DEPOSIT_PLN * 100) / 100;
}

// src/shared/deliveryFee.ts
var DELIVERY_FEE_PLN = 10;
var DELIVERY_MIN_SUBTOTAL_PLN = 80;
function isDeliveryAvailable(subtotal) {
  return Number(subtotal) >= DELIVERY_MIN_SUBTOTAL_PLN;
}

// src/shared/orderTimeRules.ts
var SCHEDULED_MIN_MINUTES = 13 * 60;
var SCHEDULED_MAX_ONLINE_MINUTES = 20 * 60;
var SCHEDULED_MAX_DAYS_AHEAD = 14;
var TIME_RE = /^(\d{1,2})[:.](\d{2})$/;
var TIME_COMPACT_RE = /^(\d{1,2})(\d{2})$/;
function parsePreferredTime(raw) {
  const s = String(raw || "").trim();
  if (!s) return null;
  let hours;
  let minutes;
  const colonMatch = s.match(TIME_RE);
  if (colonMatch) {
    hours = Number(colonMatch[1]);
    minutes = Number(colonMatch[2]);
  } else {
    const compactMatch = s.match(TIME_COMPACT_RE);
    if (!compactMatch) return null;
    hours = Number(compactMatch[1]);
    minutes = Number(compactMatch[2]);
  }
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return { hours, minutes, totalMinutes: hours * 60 + minutes };
}
function getHoursForDay(dayOfWeek) {
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return { openMinutes: 11 * 60, closeMinutes: 22 * 60 };
  }
  return { openMinutes: 12 * 60, closeMinutes: 21 * 60 };
}
function getWarsawMinutesNow(now = /* @__PURE__ */ new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Warsaw",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}
function isRestaurantOpen(now = /* @__PURE__ */ new Date()) {
  const day = getWarsawDayOfWeek(now);
  const { openMinutes, closeMinutes } = getHoursForDay(day);
  const nowMinutes = getWarsawMinutesNow(now);
  return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
}
var WEEKDAY_PART = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};
function getWarsawDayOfWeek(now = /* @__PURE__ */ new Date()) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Warsaw",
    weekday: "short"
  }).format(now);
  return WEEKDAY_PART[weekday] ?? 0;
}
function getWarsawDateString(now = /* @__PURE__ */ new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
}
function addDaysToDateString(dateStr, days) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}
function getScheduledMaxDateString(now = /* @__PURE__ */ new Date()) {
  return addDaysToDateString(getWarsawDateString(now), SCHEDULED_MAX_DAYS_AHEAD);
}
function parsePreferredDate(raw) {
  const s = String(raw || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    return null;
  }
  return s;
}
function getDayOfWeekFromDateString(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}
function getScheduledTimeStatus(preferredTime, preferredDate, now = /* @__PURE__ */ new Date()) {
  const trimmedTime = String(preferredTime || "").trim();
  if (!trimmedTime) return "idle";
  const trimmedDate = String(preferredDate || "").trim();
  if (!trimmedDate) return "invalid";
  const parsed = parsePreferredTime(trimmedTime);
  if (!parsed) return "invalid";
  const parsedDate = parsePreferredDate(trimmedDate);
  if (!parsedDate) return "invalid";
  const today = getWarsawDateString(now);
  if (parsedDate < today) return "out_of_range";
  const maxDate = getScheduledMaxDateString(now);
  if (parsedDate > maxDate) return "out_of_range";
  const dayOfWeek = getDayOfWeekFromDateString(parsedDate);
  const { openMinutes, closeMinutes } = getHoursForDay(dayOfWeek);
  const { totalMinutes } = parsed;
  if (totalMinutes < SCHEDULED_MIN_MINUTES || totalMinutes < openMinutes || totalMinutes > closeMinutes) {
    return "out_of_range";
  }
  if (parsedDate === today) {
    const nowMinutes = getWarsawMinutesNow(now);
    if (totalMinutes <= nowMinutes) {
      return "out_of_range";
    }
  }
  if (totalMinutes > SCHEDULED_MAX_ONLINE_MINUTES) {
    return "call_required";
  }
  return "ok";
}

// src/DaneMenu/menuByLang.json
var menuByLang_default = {
  pl: {
    Zestawy: [
      {
        id: "set-1",
        name: "Zestaw 1 \u201EMini Phila 50/50\u201D (16 szt)",
        price: "80 PLN",
        desc: "\u0141oso\u015B 4szt, Tu\u0144czyk 4szt, W\u0119gorz 4 szt, Krewetka 4szt",
        image: "/imgs/sets_img/MiniPhila_set_1.jpg"
      },
      {
        id: "set-2",
        name: "Zestaw 2 \u201ETrio\u201D (24 szt)",
        price: "105 PLN",
        desc: "Philadelphia \u0141oso\u015B 8, Unagi W\u0119gorz 8, Futomak surimi i \u0142oso\u015B 8",
        image: "/imgs/sets_img/Trio_set_2.jpg"
      },
      {
        id: "set-3",
        name: "Zestaw 3 \u201ETempura\u201D (32 szt)",
        price: "150 PLN",
        desc: "W\u0119gorz w panko 8, \u0141oso\u015B w panko 8, Krewetka w panko 8, Philadelphia opiekana 8",
        image: "/imgs/sets_img/Tempura_set_3.jpg"
      },
      {
        id: "set-4",
        name: "Zestaw 4 \u201EPhiladelphia\u201D (32 szt)",
        price: "160 PLN",
        desc: "Philadelphia Krewetka 8, Philadelphia W\u0119gorz 8, Philadelphia \u0141oso\u015B 8, Philadelphia Tu\u0144czyk 8",
        image: "/imgs/sets_img/SetPhiladelphia4.png"
      },
      {
        id: "set-5",
        name: "Zestaw 5 \u201EMAKI\u201D (36 szt)",
        price: "100 PLN",
        desc: "Hosomak \u0141oso\u015B, W\u0119gorz, Surimi, Og\xF3rek, \u017B\xF3\u0142ta rzepa, Kanpyo \u2014 po 6 szt",
        image: "/imgs/sets_img/SetMaki5.png"
      },
      {
        id: "set-6",
        name: "Zestaw 6 \u201EAbsolute\u201D (46 szt)",
        price: "200 PLN",
        desc: "Unagi 8, Phila opiekana 8, Phila \u0142oso\u015B 8, Futo tu\u0144czyk panko 8, Futo tartar panko 8, Hosomak \u0142oso\u015B 6",
        image: "/imgs/sets_img/SetAbsolute6.png"
      },
      {
        id: "set-7",
        name: "Zestaw 7 \u201EWeekend\u201D (70 szt)",
        price: "295 PLN",
        desc: "Kalifornia w\u0119gorz w sezam 8szt, Kalifornia \u0142oso\u015B w tobiko 8szt, Uramak z \u0142ososiem w \u015Brodku 8szt, Futomak w\u0119gorz w panko 8szt, Futomak tartar z \u0142ososia w panko 8szt, Futomak z tu\u0144czykiem w panko 8szt, Hosomak \u0142oso\u015B 6szt, Hosomak og\xF3rek 6szt, Hosomak kampyo 6szt, Nigiri \u0142oso\u015B 2 szt, Nigiri tu\u0144czyk 2 szt",
        image: "/imgs/sets_img/Weekend_set_7.jpg"
      },
      {
        id: "set-8",
        name: "Zestaw 8 \u201EKalifornia\u201D (32 szt)",
        price: "150 PLN",
        desc: "Kalifornia \u0142oso\u015B tobiko 8, Kalifornia krewetki tobiko 8, Kalifornia tu\u0144czyk sezam 8, Kalifornia w\u0119gorz sezam 8",
        image: "/imgs/sets_img/SetCalifornia8.png"
      },
      {
        id: "set-9",
        name: "Zestaw 9 \u201EMix\u201D (28 szt)",
        price: "110 PLN",
        desc: "Tartar \u0142oso\u015B panko 8, Phila \u0142oso\u015B i surimi 8, Hosomak \u0142oso\u015B 6, Hosomak w\u0119gorz 6",
        image: "/imgs/sets_img/SetMix9.png"
      },
      {
        id: "set-10",
        name: "Zestaw 10 \u201ETokio\u201D (32 szt)",
        price: "160 PLN",
        desc: "Tartar \u0142oso\u015B panko 8, Tu\u0144czyk panko 8, Philadelphia XL 8, Unagi w\u0119gorz 8",
        image: "/imgs/sets_img/Tokio_set_10.jpg"
      },
      {
        id: "set-11",
        name: "Zestaw 11 \u201EFamily\u201D (82 szt)",
        price: "320 PLN",
        desc: "Futomak krewetka w panko 8 szt, Tartar z \u0142ososia w panko 8szt, Pieczony tu\u0144czyk w panko 8szt, Philadelphia loso\u015B 8 szt, Philadelphia w\u0119gorz 8 szt, Kalifornia z \u0142ososiem w tobiko 8 szt, Kalifornia z w\u0119gorzem w sezam 8szt, Futomak z tu\u0144czykiem w \u015Brodku 8szt, Hosomak og\xF3rek 6szt, Hosomak \u017C\xF3\u0142ta rzepa 6szt, Hosomak surmi 6szt",
        image: "/imgs/sets_img/Family_set_11.jpg"
      },
      {
        id: "set-12",
        name: "Zestaw 12 \u201EKombo\u201D (32 szt)",
        price: "140 PLN",
        desc: "Phila \u0142oso\u015B 8, Phila krewetka 8, Kalifornia \u0142oso\u015B 8, Kalifornia w\u0119gorz 8",
        image: "/imgs/sets_img/Kombo_set_12.jpg"
      },
      {
        id: "set-13",
        name: "Zestaw 13 \u201EHit\u201D (24 szt)",
        price: "115 PLN",
        desc: "Phila \u0142oso\u015B 8, Kalifornia \u0142oso\u015B 8, Futomak tu\u0144czyk panko 8",
        image: "/imgs/sets_img/Hit_set_13.jpg"
      },
      {
        id: "set-14",
        name: "Zestaw 14 \u201ETopchik\u201D (32 szt)",
        price: "140 PLN",
        desc: "Kalifornia \u0142oso\u015B 8, Phila \u0142oso\u015B 8, Futomak tu\u0144czyk panko 8, \u0141oso\u015B w panko 8",
        image: "/imgs/sets_img/Topchik_set_14.jpg"
      },
      {
        id: "set-15",
        name: "Zestaw 15 \u201EExotic\u201D (32 szt)",
        price: "170 PLN",
        desc: "Philadelphia classic 8, Mango krewetki panko 8, Awokado \u0142oso\u015B 8, Kalifornia w\u0119gorz 8",
        image: "/imgs/sets_img/Exotic_set_15.jpg"
      }
    ],
    Futomak: [
      {
        id: "futo-salmon-center",
        name: "Futo z \u0142ososiem w \u015Brodku",
        price: "38 PLN",
        desc: "Ry\u017C, nori, \u0142oso\u015B, philadelphia, og\xF3rek",
        image: "/imgs/Rolls/FutomakiSalmon.png"
      },
      {
        id: "futo-salmon-surimi",
        name: "Futo z \u0142ososiem i surimi",
        price: "37 PLN",
        desc: "Ry\u017C, nori, surimi, og\xF3rek, \u0142oso\u015B, philadelphia",
        image: "/imgs/Rolls/FutomakiSalmonSurimi.jpg"
      },
      {
        id: "futo-baked-salmon",
        name: "Pieczony \u0142oso\u015B",
        price: "38 PLN",
        desc: "Ry\u017C, nori, \u0142oso\u015B pieczony, kanpyo, philadelphia, sezam, teriyaki"
      },
      {
        id: "futo-wege",
        name: "Wege",
        price: "35 PLN",
        desc: "Ry\u017C, nori, og\xF3rek, \u017C\xF3\u0142ta rzepa, kanpyo, philadelphia, sezam, teriyaki"
      },
      {
        id: "futo-eel-panko",
        name: "W\u0119gorz w panko",
        price: "42 PLN",
        desc: "Ry\u017C, nori, w\u0119gorz pieczony, philadelphia, sezam, teriyaki",
        image: "/imgs/Rolls/FutomakiEelPanko.png"
      },
      {
        id: "futo-tuna-panko",
        name: "Tu\u0144czyk w panko",
        price: "39 PLN",
        desc: "Ry\u017C, nori, tu\u0144czyk, kanpyo, philadelphia, panko",
        image: "/imgs/Rolls/FutoTunaPanko.png"
      },
      {
        id: "futo-salmon-panko",
        name: "\u0141oso\u015B w panko",
        price: "39 PLN",
        desc: "Ry\u017C, nori, \u0142oso\u015B, og\xF3rek, philadelphia, tempura",
        image: "/imgs/Rolls/FutoSalmonPanko.png"
      },
      {
        id: "futo-shrimp-panko",
        name: "Z krewetkami w panko",
        price: "42 PLN",
        desc: "Ry\u017C, nori, krewetka, og\xF3rek, \u017C\xF3\u0142ta rzepa, philadelphia, panko",
        image: "/imgs/Rolls/FutomakiShrimpPanko.png"
      },
      {
        id: "futo-salmon-tartar",
        name: "Tartar z \u0142ososia",
        price: "37 PLN",
        desc: "Ry\u017C, nori, tartar z \u0142ososia, chilli, og\xF3rek, sezam",
        image: "/imgs/Rolls/FutoSalmonTartarPanko.png"
      }
    ],
    "Futomak z serow\u0105 czapeczk\u0105": [
      {
        id: "futo-cap-salmon",
        name: "Futomak \u0142oso\u015B z serow\u0105 czapeczk\u0105",
        price: "49 PLN",
        desc: "\u0141oso\u015B, og\xF3rek, ser cheddar, philadelphia, sezam, teriyaki",
        image: "/imgs/Rolls/FutoSalmonCheeseCap.png"
      },
      {
        id: "futo-cap-eel",
        name: "Futomak w\u0119gorz z serow\u0105 czapeczk\u0105",
        price: "53 PLN",
        desc: "W\u0119gorz, og\xF3rek, ser cheddar, philadelphia, sezam, teriyaki",
        image: "/imgs/Rolls/FutoEelCheeseCap.png"
      },
      {
        id: "futo-cap-shrimp",
        name: "Futomak krewetki z serow\u0105 czapeczk\u0105",
        price: "55 PLN",
        desc: "Krewetki, og\xF3rek, ser cheddar, philadelphia, sezam, teriyaki",
        image: "/imgs/Rolls/FutoShrimpPanko.png"
      }
    ],
    Philadelphia: [
      {
        id: "phila-classic",
        name: "Philadelphia Classic",
        price: "39 PLN",
        desc: "Ry\u017C, nori, \u0142oso\u015B, philadelphia, og\xF3rek",
        image: "/imgs/PhilaRolls/PhiladelphiaClassic.png"
      },
      {
        id: "phila-shrimp",
        name: "Philadelphia Krewetka",
        price: "42 PLN",
        desc: "Ry\u017C, nori, og\xF3rek, philadelphia, krewetka, sezam, teriyaki",
        image: "/imgs/PhilaRolls/PhiladelphiaShrimp.png"
      },
      {
        id: "phila-tuna",
        name: "Philadelphia Tu\u0144czyk",
        price: "39 PLN",
        desc: "Ry\u017C, nori, awokado, tu\u0144czyk, philadelphia",
        image: "/imgs/PhilaRolls/PhiladelphiaTuna.png"
      },
      {
        id: "phila-eel",
        name: "Philadelphia W\u0119gorz",
        price: "40 PLN",
        desc: "Ry\u017C, nori, w\u0119gorz, og\xF3rek, philadelphia, sezam, teriyaki",
        image: "/imgs/PhilaRolls/PhiladelphiaEel.png"
      },
      {
        id: "phila-baked-salmon",
        name: "Philadelphia \u0141oso\u015B opiekany",
        price: "39 PLN",
        desc: "Ry\u017C, nori, \u0142oso\u015B opiekany, kanpyo, sezam, teriyaki, philadelphia",
        image: "/imgs/PhilaRolls/PhiladelphiaBakedSalmon.png"
      },
      {
        id: "phila-avocado",
        name: "Philadelphia z awokado",
        price: "40 PLN",
        desc: "Ry\u017C, nori, \u0142oso\u015B, philadelphia, awokado",
        image: "/imgs/PhilaRolls/PhiladelphiaAvocado.png"
      },
      {
        id: "phila-xl",
        name: "Philadelphia XL",
        price: "59 PLN",
        desc: "Ry\u017C, nori, podw\xF3jny \u0142oso\u015B, og\xF3rek, philadelphia",
        image: "/imgs/PhilaRolls/PhiladelphiaXL.jpg"
      }
    ],
    Kalifornia: [
      {
        id: "cal-salmon-tobiko",
        name: "Kalifornia z \u0142ososiem w tobiko",
        price: "39 PLN",
        desc: "\u0141oso\u015B, philadelphia, \u017C\xF3\u0142ta rzepa, og\xF3rek, tobiko",
        image: "/imgs/Rolls/CaliforniaSalmonTobiko.png"
      },
      {
        id: "cal-eel-sesame",
        name: "Kalifornia z w\u0119gorzem w sezamie",
        price: "39 PLN",
        desc: "W\u0119gorz, philadelphia, og\xF3rek, \u017C\xF3\u0142ta rzepa, sezam",
        image: "/imgs/Rolls/CaliforniaEelSesame.png"
      },
      {
        id: "cal-shrimp-tobiko",
        name: "Kalifornia z krewetkami w panko",
        price: "40 PLN",
        desc: "Krewetka, philadelphia, \u017C\xF3\u0142ta rzepa, og\xF3rek, tobiko",
        image: "/imgs/Rolls/CaliforniaShrimpPanko.png"
      },
      {
        id: "cal-tuna-sesame",
        name: "Kalifornia z tu\u0144czykiem w sezamie",
        price: "39 PLN",
        desc: "Tu\u0144czyk, philadelphia, og\xF3rek, \u017C\xF3\u0142ta rzepa, sezam",
        image: "/imgs/Rolls/CaliforniaTunaSesame.png"
      }
    ],
    Uramak: [
      {
        id: "ura-unagi",
        name: "Unagi",
        price: "38 PLN",
        desc: "Ry\u017C, nori, philadelphia, og\xF3rek, w\u0119gorz, teriyaki, sezam",
        image: "/imgs/Rolls/Uramak.jpg"
      },
      {
        id: "ura-tokio",
        name: "Tokio",
        price: "58 PLN",
        desc: "Ry\u017C, nori, philadelphia, og\xF3rek, krewetka gotowana, tobiko, \u0142oso\u015B",
        image: "/imgs/Rolls/TokyoRoll.png"
      },
      {
        id: "ura-three-rubies",
        name: "Trzy ryby",
        price: "49 PLN",
        desc: "\u0141oso\u015B, tu\u0144czyk, w\u0119gorz, awokado, sezam",
        image: "/imgs/Rolls/ThreeFishRoll.png"
      }
    ],
    Hosomak: [
      {
        id: "hoso-tuna",
        name: "Hosomak Tu\u0144czyk",
        price: "24 PLN",
        desc: "Ry\u017C, nori, tu\u0144czyk"
      },
      {
        id: "hoso-eel",
        name: "Hosomak W\u0119gorz",
        price: "24 PLN",
        desc: "Ry\u017C, nori, w\u0119gorz, sezam, teriyaki"
      },
      {
        id: "hoso-salmon",
        name: "Hosomak \u0141oso\u015B",
        price: "24 PLN",
        desc: "Ry\u017C, nori, \u0142oso\u015B"
      },
      {
        id: "hoso-shrimp",
        name: "Hosomak Krewetka",
        price: "25 PLN",
        desc: "Ry\u017C, nori, krewetka, sezam, teriyaki"
      },
      {
        id: "hoso-yellow-radish",
        name: "Hosomak \u017B\xF3\u0142ta rzepa",
        price: "15 PLN",
        desc: "Ry\u017C, nori, \u017C\xF3\u0142ta rzepa"
      },
      {
        id: "hoso-kanpyo",
        name: "Hosomak Kanpyo",
        price: "15 PLN",
        desc: "Ry\u017C, nori, kanpyo"
      },
      {
        id: "hoso-cucumber",
        name: "Hosomak Og\xF3rek",
        price: "15 PLN",
        desc: "Ry\u017C, nori, og\xF3rek"
      },
      {
        id: "hoso-surimi",
        name: "Hosomak Surimi",
        price: "15 PLN",
        desc: "Ry\u017C, nori, surimi"
      },
      {
        id: "hoso-avocado",
        name: "Hosomak Awokado",
        price: "19 PLN",
        desc: "Ry\u017C, nori, awokado"
      }
    ],
    "Premium rolki": [
      {
        id: "prem-salmon-delux",
        name: "\u0141oso\u015B Delux",
        price: "80 PLN",
        desc: "Ry\u017C, nori, \u0142oso\u015B XL, krewetka w panko, majonez japo\u0144ski",
        image: "/imgs/PremiumRolls/Delux.jpg"
      },
      {
        id: "prem-dubai",
        name: "Roll Dubaj",
        price: "80 PLN",
        desc: "Ry\u017C, nori, \u0142oso\u015B XL, wakame",
        image: "/imgs/PremiumRolls/RollDubai.jpg"
      }
    ],
    "Sushi Burger": [
      {
        id: "burger-king",
        name: "Sushi Burger King",
        price: "69 PLN",
        desc: "Ry\u017C, nori, ser Philadelphia, tobiko, krewetki gotowane, \u0142oso\u015B, awokado, ser cheddar",
        image: "/imgs/Burgers/BurgerKing.png"
      },
      {
        id: "burger-salmon",
        name: "Burger z \u0142ososiem",
        price: "45 PLN",
        desc: "Ry\u017C, nori, philadelphia, og\xF3rek, \u0142oso\u015B",
        image: "/imgs/Burgers/BurgerLosos.jpg"
      },
      {
        id: "burger-tuna-wakame",
        name: "Burger z tu\u0144czykiem i wakame",
        price: "45 PLN",
        desc: "Ry\u017C, nori, philadelphia, wakame, tu\u0144czyk, teriyaki",
        image: "/imgs/Burgers/BurgerTuna.jpg"
      },
      {
        id: "burger-shrimp-avocado",
        name: "Burger z krewetkami i awokado",
        price: "50 PLN",
        desc: "Ry\u017C, nori, philadelphia, krewetka gotowana, awokado, teriyaki, tobiko",
        image: "/imgs/Burgers/BurgerShrimp.jpg"
      }
    ],
    Nigiri: [
      {
        id: "nigiri-tuna",
        name: "Nigiri Tu\u0144czyk",
        price: "22 PLN",
        desc: "2 szt"
      },
      {
        id: "nigiri-salmon",
        name: "Nigiri \u0141oso\u015B",
        price: "22 PLN",
        desc: "2 szt"
      },
      {
        id: "nigiri-eel",
        name: "Nigiri W\u0119gorz",
        price: "22 PLN",
        desc: "2 szt"
      },
      {
        id: "nigiri-shrimp",
        name: "Nigiri Krewetki",
        price: "22 PLN",
        desc: "2 szt"
      }
    ],
    "Przystawki / Inne": [
      {
        id: "shrimp-panko",
        name: "Krewetki w panko",
        price: "45/55 PLN",
        desc: "Chrupi\u0105ce krewetki w panierce panko",
        variantOptions: [
          {
            key: "6",
            label: "6 szt",
            price: "45 PLN"
          },
          {
            key: "9",
            label: "9 szt",
            price: "55 PLN"
          }
        ],
        image: "/imgs/Starters/PankoShrimp.jpg"
      },
      {
        id: "fries-large",
        name: "Frytki \u2014 du\u017Ce opakowanie",
        price: "10 PLN",
        desc: "Z\u0142ociste frytki + ketchup",
        image: "/imgs/Starters/Frenchfries.jpg"
      },
      {
        id: "gunkan-tuna",
        name: "Gunkan Tu\u0144czyk",
        price: "30 PLN",
        desc: "2 szt"
      },
      {
        id: "gunkan-salmon",
        name: "Gunkan \u0141oso\u015B",
        price: "30 PLN",
        desc: "2 szt"
      },
      {
        id: "gunkan-eel",
        name: "Gunkan W\u0119gorz",
        price: "30 PLN",
        desc: "2 szt"
      },
      {
        id: "gunkan-shrimp",
        name: "Gunkan Krewetki",
        price: "30 PLN",
        desc: "2 szt"
      }
    ],
    Desery: [
      {
        id: "zestaw-tropik",
        name: "Zestaw Tropik",
        price: "100 PLN",
        desc: "32 szt: Mix 8 szt, Banan 8 szt, Kiwi 8 szt, Truskawka 8 szt",
        image: "/imgs/Desery/ZestawTropik.png"
      },
      {
        id: "sweet-roll-mix",
        name: "Rolka s\u0142odka \u2014 miks",
        price: "35 PLN",
        desc: "Papier ry\u017Cowy, kiwi, banan, truskawki, s\u0142odki serek, ry\u017C, polewa owocowa, wi\xF3rki kokosowe",
        image: "/imgs/Desery/SweetRollMix.png"
      },
      {
        id: "sweet-roll-kiwi",
        name: "Rolka s\u0142odka \u2014 kiwi",
        price: "25 PLN",
        desc: "Papier sojowy, kiwi, s\u0142odki serek, ry\u017C, wi\xF3rki kokosowe",
        image: "/imgs/Desery/SweetRollKiwi.png"
      },
      {
        id: "sweet-roll-truskawka",
        name: "Rolka s\u0142odka \u2014 truskawka",
        price: "25 PLN",
        desc: "Papier sojowy, truskawki, s\u0142odki serek, ry\u017C, polewa czekoladowa, wi\xF3rki kokosowe",
        image: "/imgs/Desery/SweetRollTruskawka.png"
      },
      {
        id: "sweet-roll-banan",
        name: "Rolka s\u0142odka \u2014 banan",
        price: "25 PLN",
        desc: "Papier sojowy, banan, s\u0142odki serek, ry\u017C, polewa czekoladowa, wi\xF3rki kokosowe",
        image: "/imgs/Desery/SweetRollBanan.png"
      },
      {
        id: "mochi",
        name: "Mochi w asortymencie",
        price: "10 PLN",
        desc: "Delikatny japo\u0144ski deser z ciasta ry\u017Cowego z mi\u0119kkim kremowym lub owocowym nadzieniem w \u015Brodku",
        image: "/imgs/Starters/Mochi.png"
      }
    ],
    Napoje: [
      {
        id: "drink-h-033",
        kind: "section",
        name: "0.33 l"
      },
      {
        id: "drink-coca-033",
        name: "Coca-Cola 0.33",
        price: "5 PLN",
        desc: "0.33 l",
        image: "/imgs/drinks/CocaCola.jpg"
      },
      {
        id: "drink-fanta-033",
        name: "Fanta 0.33",
        price: "5 PLN",
        desc: "0.33 l",
        image: "/imgs/drinks/Fanta.jpg"
      },
      {
        id: "drink-h-04",
        kind: "section",
        name: "0.4 l"
      },
      {
        id: "drink-lemonade-04",
        name: "Limonada 0.4",
        price: "6 PLN",
        desc: "0.4 l",
        image: "/imgs/drinks/Cappy.jpg"
      },
      {
        id: "drink-h-05",
        kind: "section",
        name: "0.5 l"
      },
      {
        id: "drink-coca-05",
        name: "Coca-Cola 0.5",
        price: "7 PLN",
        desc: "0.5 l",
        image: "/imgs/drinks/CocaCola.jpg"
      },
      {
        id: "drink-fanta-05",
        name: "Fanta 0.5",
        price: "7 PLN",
        desc: "0.5 l",
        image: "/imgs/drinks/Fanta.jpg"
      },
      {
        id: "drink-sprite-05",
        name: "Sprite 0.5",
        price: "7 PLN",
        desc: "0.5 l",
        image: "/imgs/drinks/Sprite.jpg"
      },
      {
        id: "drink-tea",
        name: "Herbata 0.5",
        price: "8 PLN",
        desc: "0.5 l",
        image: "/imgs/drinks/fuzetea.jpg"
      },
      {
        id: "drink-water-sparkling-05",
        name: "Woda gazowana 0.5",
        price: "3 PLN",
        desc: "0.5 l"
      },
      {
        id: "drink-water-still-05",
        name: "Woda niegazowana 0.5",
        price: "3 PLN",
        desc: "0.5 l"
      },
      {
        id: "drink-h-07",
        kind: "section",
        name: "0.7 l"
      },
      {
        id: "drink-water-still-07",
        name: "Woda niegazowana 0.7",
        price: "6 PLN",
        desc: "0.7 l"
      },
      {
        id: "drink-h-085",
        kind: "section",
        name: "0.85 l"
      },
      {
        id: "drink-coca-085",
        name: "Coca-Cola 0.85",
        price: "10 PLN",
        desc: "0.85 l",
        image: "/imgs/drinks/CocaCola.jpg"
      },
      {
        id: "drink-fanta-085",
        name: "Fanta 0.85",
        price: "10 PLN",
        desc: "0.85 l",
        image: "/imgs/drinks/Fanta.jpg"
      },
      {
        id: "drink-sprite-085",
        name: "Sprite 0.85",
        price: "10 PLN",
        desc: "0.85 l",
        image: "/imgs/drinks/Sprite.jpg"
      }
    ]
  },
  en: {
    Zestawy: [
      {
        id: "set-1",
        name: 'Set 1 "Mini Phila 50/50" (16 pcs)',
        price: "80 PLN",
        desc: "Salmon \xD74, Tuna \xD74, Eel \xD74, Shrimp \xD74",
        image: "/imgs/sets_img/MiniPhila_set_1.jpg"
      },
      {
        id: "set-2",
        name: 'Set 2 "Trio" (24 pcs)',
        price: "105 PLN",
        desc: "Philadelphia Salmon \xD78, Unagi Eel \xD78, Futomaki surimi & salmon \xD78",
        image: "/imgs/sets_img/Trio_set_2.jpg"
      },
      {
        id: "set-3",
        name: 'Set 3 "Tempura" (32 pcs)',
        price: "150 PLN",
        desc: "Eel in panko \xD78, Salmon in panko \xD78, Shrimp in panko \xD78, Baked Philadelphia \xD78",
        image: "/imgs/sets_img/Tempura_set_3.jpg"
      },
      {
        id: "set-4",
        name: 'Set 4 "Philadelphia" (32 pcs)',
        price: "160 PLN",
        desc: "Philadelphia Shrimp \xD78, Philadelphia Eel \xD78, Philadelphia Salmon \xD78, Philadelphia Tuna \xD78",
        image: "/imgs/sets_img/SetPhiladelphia4.png"
      },
      {
        id: "set-5",
        name: 'Set 5 "MAKI" (36 pcs)',
        price: "100 PLN",
        desc: "Hosomaki Salmon, Eel, Surimi, Cucumber, Yellow radish, Kanpyo \u2014 6 pcs each",
        image: "/imgs/sets_img/SetMaki5.png"
      },
      {
        id: "set-6",
        name: 'Set 6 "Absolute" (46 pcs)',
        price: "200 PLN",
        desc: "Unagi \xD78, Baked Phila \xD78, Phila salmon \xD78, Futomaki tuna panko \xD78, tartar panko \xD78, Hosomaki salmon \xD76",
        image: "/imgs/sets_img/SetAbsolute6.png"
      },
      {
        id: "set-7",
        name: 'Set 7 "Weekend" (70 pcs)',
        price: "295 PLN",
        desc: "California, uramaki, panko futomaki, hosomaki, nigiri \u2014 premium mix",
        image: "/imgs/sets_img/Weekend_set_7.jpg"
      },
      {
        id: "set-8",
        name: 'Set 8 "California" (32 pcs)',
        price: "150 PLN",
        desc: "California salmon tobiko \xD78, California shrimp tobiko \xD78, California tuna sesame \xD78, California eel sesame \xD78",
        image: "/imgs/sets_img/SetCalifornia8.png"
      },
      {
        id: "set-9",
        name: 'Set 9 "Mix" (28 pcs)',
        price: "110 PLN",
        desc: "Salmon tartar panko \xD78, Phila salmon & surimi \xD78, Hosomaki salmon \xD76, Hosomaki eel \xD76",
        image: "/imgs/sets_img/SetMix9.png"
      },
      {
        id: "set-10",
        name: 'Set 10 "Tokyo" (32 pcs)',
        price: "160 PLN",
        desc: "Salmon tartar panko \xD78, Tuna panko \xD78, Philadelphia XL \xD78, Unagi eel \xD78",
        image: "/imgs/sets_img/Tokio_set_10.jpg"
      },
      {
        id: "set-11",
        name: 'Set 11 "Family" (82 pcs)',
        price: "320 PLN",
        desc: "Futomaki shrimp in panko \xD78, Salmon tartare in panko \xD78, Baked tuna in panko \xD78, Philadelphia salmon \xD78, Philadelphia eel \xD78, California salmon tobiko \xD78, California eel sesame \xD78, Futomaki tuna inside \xD78, Hosomaki cucumber \xD76, Hosomaki yellow radish \xD76, Hosomaki surimi \xD76",
        image: "/imgs/sets_img/Family_set_11.jpg"
      },
      {
        id: "set-12",
        name: 'Set 12 "Combo" (32 pcs)',
        price: "140 PLN",
        desc: "Phila salmon \xD78, Phila shrimp \xD78, California salmon \xD78, California eel \xD78",
        image: "/imgs/sets_img/Kombo_set_12.jpg"
      },
      {
        id: "set-13",
        name: 'Set 13 "Hit" (24 pcs)',
        price: "115 PLN",
        desc: "Phila salmon \xD78, California salmon \xD78, Futomaki tuna panko \xD78",
        image: "/imgs/sets_img/Hit_set_13.jpg"
      },
      {
        id: "set-14",
        name: 'Set 14 "Topchik" (32 pcs)',
        price: "140 PLN",
        desc: "California salmon \xD78, Phila salmon \xD78, Futomaki tuna panko \xD78, Salmon panko \xD78",
        image: "/imgs/sets_img/Topchik_set_14.jpg"
      },
      {
        id: "set-15",
        name: 'Set 15 "Exotic" (32 pcs)',
        price: "170 PLN",
        desc: "Philadelphia classic \xD78, Mango shrimp panko \xD78, Avocado salmon \xD78, California eel \xD78",
        image: "/imgs/sets_img/Exotic_set_15.jpg"
      }
    ],
    Futomak: [
      {
        id: "futo-salmon-center",
        name: "Futomaki with salmon inside",
        price: "38 PLN",
        desc: "Rice, nori, salmon, cream cheese, cucumber",
        image: "/imgs/Rolls/FutomakiSalmon.png"
      },
      {
        id: "futo-salmon-surimi",
        name: "Futomaki with salmon & surimi",
        price: "37 PLN",
        desc: "Rice, nori, surimi, cucumber, salmon, cream cheese",
        image: "/imgs/Rolls/FutomakiSalmonSurimi.jpg"
      },
      {
        id: "futo-baked-salmon",
        name: "Baked salmon",
        price: "38 PLN",
        desc: "Rice, nori, baked salmon, kanpyo, cream cheese, sesame, teriyaki"
      },
      {
        id: "futo-wege",
        name: "Vegetarian",
        price: "35 PLN",
        desc: "Rice, nori, cucumber, yellow radish, kanpyo, cream cheese, sesame, teriyaki"
      },
      {
        id: "futo-eel-panko",
        name: "Eel in panko",
        price: "42 PLN",
        desc: "Rice, nori, baked eel, cream cheese, sesame, teriyaki",
        image: "/imgs/Rolls/FutomakiEelPanko.png"
      },
      {
        id: "futo-tuna-panko",
        name: "Tuna in panko",
        price: "39 PLN",
        desc: "Rice, nori, tuna, kanpyo, cream cheese, panko",
        image: "/imgs/Rolls/FutoTunaPanko.png"
      },
      {
        id: "futo-salmon-panko",
        name: "Salmon in panko",
        price: "39 PLN",
        desc: "Rice, nori, salmon, cucumber, cream cheese, tempura",
        image: "/imgs/Rolls/FutoSalmonPanko.png"
      },
      {
        id: "futo-shrimp-panko",
        name: "Shrimp in panko",
        price: "42 PLN",
        desc: "Rice, nori, shrimp, cucumber, yellow radish, cream cheese, panko",
        image: "/imgs/Rolls/FutomakiShrimpPanko.png"
      },
      {
        id: "futo-salmon-tartar",
        name: "Salmon tartare",
        price: "37 PLN",
        desc: "Rice, nori, salmon tartare, chilli, cucumber, sesame",
        image: "/imgs/Rolls/FutoSalmonTartarPanko.png"
      }
    ],
    "Futomak z serow\u0105 czapeczk\u0105": [
      {
        id: "futo-cap-salmon",
        name: "Futomaki salmon with cheese cap",
        price: "49 PLN",
        desc: "Salmon, cucumber, cheddar, cream cheese, sesame, teriyaki",
        image: "/imgs/Rolls/FutoSalmonCheeseCap.png"
      },
      {
        id: "futo-cap-eel",
        name: "Futomaki eel with cheese cap",
        price: "53 PLN",
        desc: "Eel, cucumber, cheddar, cream cheese, sesame, teriyaki",
        image: "/imgs/Rolls/FutoEelCheeseCap.png"
      },
      {
        id: "futo-cap-shrimp",
        name: "Futomaki shrimp with cheese cap",
        price: "55 PLN",
        desc: "Shrimp, cucumber, cheddar, cream cheese, sesame, teriyaki",
        image: "/imgs/Rolls/FutoShrimpPanko.png"
      }
    ],
    Philadelphia: [
      {
        id: "phila-classic",
        name: "Philadelphia Classic",
        price: "39 PLN",
        desc: "Rice, nori, salmon, cream cheese, cucumber",
        image: "/imgs/PhilaRolls/PhiladelphiaClassic.png"
      },
      {
        id: "phila-shrimp",
        name: "Philadelphia Shrimp",
        price: "42 PLN",
        desc: "Rice, nori, cucumber, cream cheese, shrimp, sesame, teriyaki",
        image: "/imgs/PhilaRolls/PhiladelphiaShrimp.png"
      },
      {
        id: "phila-tuna",
        name: "Philadelphia Tuna",
        price: "39 PLN",
        desc: "Rice, nori, avocado, tuna, cream cheese",
        image: "/imgs/PhilaRolls/PhiladelphiaTuna.png"
      },
      {
        id: "phila-eel",
        name: "Philadelphia Eel",
        price: "40 PLN",
        desc: "Rice, nori, eel, cucumber, cream cheese, sesame, teriyaki",
        image: "/imgs/PhilaRolls/PhiladelphiaEel.png"
      },
      {
        id: "phila-baked-salmon",
        name: "Philadelphia Baked Salmon",
        price: "39 PLN",
        desc: "Rice, nori, baked salmon, kanpyo, sesame, teriyaki, cream cheese",
        image: "/imgs/PhilaRolls/PhiladelphiaBakedSalmon.png"
      },
      {
        id: "phila-avocado",
        name: "Philadelphia with avocado",
        price: "40 PLN",
        desc: "Rice, nori, salmon, cream cheese, avocado",
        image: "/imgs/PhilaRolls/PhiladelphiaAvocado.png"
      },
      {
        id: "phila-xl",
        name: "Philadelphia XL",
        price: "59 PLN",
        desc: "Rice, nori, double salmon, cucumber, cream cheese",
        image: "/imgs/PhilaRolls/PhiladelphiaXL.jpg"
      }
    ],
    Kalifornia: [
      {
        id: "cal-salmon-tobiko",
        name: "California with salmon in tobiko",
        price: "39 PLN",
        desc: "Salmon, cream cheese, yellow radish, cucumber, tobiko",
        image: "/imgs/Rolls/CaliforniaSalmonTobiko.png"
      },
      {
        id: "cal-eel-sesame",
        name: "California with eel in sesame",
        price: "39 PLN",
        desc: "Eel, cream cheese, cucumber, yellow radish, sesame",
        image: "/imgs/Rolls/CaliforniaEelSesame.png"
      },
      {
        id: "cal-shrimp-tobiko",
        name: "California with shrimp in panko",
        price: "40 PLN",
        desc: "Shrimp, cream cheese, yellow radish, cucumber, tobiko",
        image: "/imgs/Rolls/CaliforniaShrimpPanko.png"
      },
      {
        id: "cal-tuna-sesame",
        name: "California with tuna in sesame",
        price: "39 PLN",
        desc: "Tuna, cream cheese, cucumber, yellow radish, sesame",
        image: "/imgs/Rolls/CaliforniaTunaSesame.png"
      }
    ],
    Uramak: [
      {
        id: "ura-unagi",
        name: "Unagi",
        price: "38 PLN",
        desc: "Rice, nori, cream cheese, cucumber, eel, teriyaki, sesame",
        image: "/imgs/Rolls/Uramak.jpg"
      },
      {
        id: "ura-tokio",
        name: "Tokyo",
        price: "58 PLN",
        desc: "Rice, nori, cream cheese, cucumber, cooked shrimp, tobiko, salmon",
        image: "/imgs/Rolls/TokyoRoll.png"
      },
      {
        id: "ura-three-rubies",
        name: "Three fish",
        price: "49 PLN",
        desc: "Salmon, tuna, eel, avocado, sesame",
        image: "/imgs/Rolls/ThreeFishRoll.png"
      }
    ],
    Hosomak: [
      {
        id: "hoso-tuna",
        name: "Hosomaki Tuna",
        price: "24 PLN",
        desc: "Rice, nori, tuna"
      },
      {
        id: "hoso-eel",
        name: "Hosomaki Eel",
        price: "24 PLN",
        desc: "Rice, nori, eel, sesame, teriyaki"
      },
      {
        id: "hoso-salmon",
        name: "Hosomaki Salmon",
        price: "24 PLN",
        desc: "Rice, nori, salmon"
      },
      {
        id: "hoso-shrimp",
        name: "Hosomaki Shrimp",
        price: "25 PLN",
        desc: "Rice, nori, shrimp, sesame, teriyaki"
      },
      {
        id: "hoso-yellow-radish",
        name: "Hosomaki Yellow radish",
        price: "15 PLN",
        desc: "Rice, nori, yellow radish"
      },
      {
        id: "hoso-kanpyo",
        name: "Hosomaki Kanpyo",
        price: "15 PLN",
        desc: "Rice, nori, kanpyo"
      },
      {
        id: "hoso-cucumber",
        name: "Hosomaki Cucumber",
        price: "15 PLN",
        desc: "Rice, nori, cucumber"
      },
      {
        id: "hoso-surimi",
        name: "Hosomaki Surimi",
        price: "15 PLN",
        desc: "Rice, nori, surimi"
      },
      {
        id: "hoso-avocado",
        name: "Hosomaki Avocado",
        price: "19 PLN",
        desc: "Rice, nori, avocado"
      }
    ],
    "Premium rolki": [
      {
        id: "prem-salmon-delux",
        name: "Salmon Delux",
        price: "80 PLN",
        desc: "Rice, nori, salmon XL, shrimp in panko, Japanese mayo",
        image: "/imgs/PremiumRolls/Delux.jpg"
      },
      {
        id: "prem-dubai",
        name: "Dubai Roll",
        price: "80 PLN",
        desc: "Rice, nori, salmon XL, wakame",
        image: "/imgs/PremiumRolls/RollDubai.jpg"
      }
    ],
    "Sushi Burger": [
      {
        id: "burger-king",
        name: "Sushi Burger King",
        price: "69 PLN",
        desc: "Rice, nori, cream cheese, tobiko, cooked shrimp, salmon, avocado, cheddar",
        image: "/imgs/Burgers/BurgerKing.png"
      },
      {
        id: "burger-salmon",
        name: "Burger with salmon",
        price: "45 PLN",
        desc: "Rice, nori, cream cheese, cucumber, salmon",
        image: "/imgs/Burgers/BurgerLosos.jpg"
      },
      {
        id: "burger-tuna-wakame",
        name: "Burger with tuna & wakame",
        price: "45 PLN",
        desc: "Rice, nori, cream cheese, wakame, tuna, teriyaki",
        image: "/imgs/Burgers/BurgerTuna.jpg"
      },
      {
        id: "burger-shrimp-avocado",
        name: "Burger with shrimp & avocado",
        price: "50 PLN",
        desc: "Rice, nori, cream cheese, cooked shrimp, avocado, teriyaki, tobiko",
        image: "/imgs/Burgers/BurgerShrimp.jpg"
      }
    ],
    Nigiri: [
      {
        id: "nigiri-tuna",
        name: "Nigiri Tuna",
        price: "22 PLN",
        desc: "2 pcs"
      },
      {
        id: "nigiri-salmon",
        name: "Nigiri Salmon",
        price: "22 PLN",
        desc: "2 pcs"
      },
      {
        id: "nigiri-eel",
        name: "Nigiri Eel",
        price: "22 PLN",
        desc: "2 pcs"
      },
      {
        id: "nigiri-shrimp",
        name: "Nigiri Shrimp",
        price: "22 PLN",
        desc: "2 pcs"
      }
    ],
    "Przystawki / Inne": [
      {
        id: "shrimp-panko",
        name: "Panko shrimp",
        price: "45/55 PLN",
        desc: "Crispy shrimp in panko coating",
        variantOptions: [
          {
            key: "6",
            label: "6 pcs",
            price: "45 PLN"
          },
          {
            key: "9",
            label: "9 pcs",
            price: "55 PLN"
          }
        ],
        image: "/imgs/Starters/PankoShrimp.jpg"
      },
      {
        id: "fries-large",
        name: "French fries (large)",
        price: "10 PLN",
        desc: "Golden fries + ketchup",
        image: "/imgs/Starters/Frenchfries.jpg"
      },
      {
        id: "gunkan-tuna",
        name: "Gunkan Tuna",
        price: "30 PLN",
        desc: "2 pcs"
      },
      {
        id: "gunkan-salmon",
        name: "Gunkan Salmon",
        price: "30 PLN",
        desc: "2 pcs"
      },
      {
        id: "gunkan-eel",
        name: "Gunkan Eel",
        price: "30 PLN",
        desc: "2 pcs"
      },
      {
        id: "gunkan-shrimp",
        name: "Gunkan Shrimp",
        price: "30 PLN",
        desc: "2 pcs"
      }
    ],
    Desery: [
      {
        id: "zestaw-tropik",
        name: "Tropic Set",
        price: "100 PLN",
        desc: "32 pcs: mixed sweet roll \xD78, banana \xD78, kiwi \xD78, strawberry \xD78",
        image: "/imgs/Desery/ZestawTropik.png"
      },
      {
        id: "sweet-roll-mix",
        name: "Sweet Roll \u2014 Mix",
        price: "35 PLN",
        desc: "Rice paper, kiwi, banana, strawberries, sweet cream cheese, rice, fruit glaze, coconut flakes",
        image: "/imgs/Desery/SweetRollMix.png"
      },
      {
        id: "sweet-roll-kiwi",
        name: "Sweet Roll \u2014 Kiwi",
        price: "25 PLN",
        desc: "Soy paper, kiwi, sweet cream cheese, rice, coconut flakes",
        image: "/imgs/Desery/SweetRollKiwi.png"
      },
      {
        id: "sweet-roll-truskawka",
        name: "Sweet Roll \u2014 Strawberry",
        price: "25 PLN",
        desc: "Soy paper, strawberries, sweet cream cheese, rice, chocolate glaze, coconut flakes",
        image: "/imgs/Desery/SweetRollTruskawka.png"
      },
      {
        id: "sweet-roll-banan",
        name: "Sweet Roll \u2014 Banana",
        price: "25 PLN",
        desc: "Soy paper, banana, sweet cream cheese, rice, chocolate glaze, coconut flakes",
        image: "/imgs/Desery/SweetRollBanan.png"
      },
      {
        id: "mochi",
        name: "Mochi \u2014 assorted",
        price: "10 PLN",
        desc: "A delicate Japanese dessert made from rice dough with a soft creamy or fruity filling inside",
        image: "/imgs/Starters/Mochi.png"
      }
    ],
    Napoje: [
      {
        id: "drink-h-033",
        kind: "section",
        name: "0.33 l"
      },
      {
        id: "drink-coca-033",
        name: "Coca-Cola 0.33",
        price: "5 PLN",
        desc: "0.33 l",
        image: "/imgs/drinks/CocaCola.jpg"
      },
      {
        id: "drink-fanta-033",
        name: "Fanta 0.33",
        price: "5 PLN",
        desc: "0.33 l",
        image: "/imgs/drinks/Fanta.jpg"
      },
      {
        id: "drink-h-04",
        kind: "section",
        name: "0.4 l"
      },
      {
        id: "drink-lemonade-04",
        name: "Lemonade 0.4",
        price: "6 PLN",
        desc: "0.4 l",
        image: "/imgs/drinks/Cappy.jpg"
      },
      {
        id: "drink-h-05",
        kind: "section",
        name: "0.5 l"
      },
      {
        id: "drink-coca-05",
        name: "Coca-Cola 0.5",
        price: "7 PLN",
        desc: "0.5 l",
        image: "/imgs/drinks/CocaCola.jpg"
      },
      {
        id: "drink-fanta-05",
        name: "Fanta 0.5",
        price: "7 PLN",
        desc: "0.5 l",
        image: "/imgs/drinks/Fanta.jpg"
      },
      {
        id: "drink-sprite-05",
        name: "Sprite 0.5",
        price: "7 PLN",
        desc: "0.5 l",
        image: "/imgs/drinks/Sprite.jpg"
      },
      {
        id: "drink-tea",
        name: "Tea 0.5",
        price: "8 PLN",
        desc: "0.5 l",
        image: "/imgs/drinks/fuzetea.jpg"
      },
      {
        id: "drink-water-sparkling-05",
        name: "Sparkling water 0.5",
        price: "3 PLN",
        desc: "0.5 l"
      },
      {
        id: "drink-water-still-05",
        name: "Still water 0.5",
        price: "3 PLN",
        desc: "0.5 l"
      },
      {
        id: "drink-h-07",
        kind: "section",
        name: "0.7 l"
      },
      {
        id: "drink-water-still-07",
        name: "Still water 0.7",
        price: "6 PLN",
        desc: "0.7 l"
      },
      {
        id: "drink-h-085",
        kind: "section",
        name: "0.85 l"
      },
      {
        id: "drink-coca-085",
        name: "Coca-Cola 0.85",
        price: "10 PLN",
        desc: "0.85 l",
        image: "/imgs/drinks/CocaCola.jpg"
      },
      {
        id: "drink-fanta-085",
        name: "Fanta 0.85",
        price: "10 PLN",
        desc: "0.85 l",
        image: "/imgs/drinks/Fanta.jpg"
      },
      {
        id: "drink-sprite-085",
        name: "Sprite 0.85",
        price: "10 PLN",
        desc: "0.85 l",
        image: "/imgs/drinks/Sprite.jpg"
      }
    ]
  },
  uk: {
    Zestawy: [
      {
        id: "set-1",
        name: "\u0421\u0435\u0442 1 \xABMini Phila 50/50\xBB (16 \u0448\u0442)",
        price: "80 PLN",
        desc: "\u043B\u043E\u0441\u043E\u0441\u044C \xD74, \u0442\u0443\u043D\u0435\u0446\u044C \xD74, \u0432\u0443\u0433\u043E\u0440 \xD74, \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430 \xD74",
        image: "/imgs/sets_img/MiniPhila_set_1.jpg"
      },
      {
        id: "set-2",
        name: "\u0421\u0435\u0442 2 \xABTrio\xBB (24 \u0448\u0442)",
        price: "105 PLN",
        desc: "\u0424\u0456\u043B\u0430\u0434\u0435\u043B\u044C\u0444\u0456\u044F \u043B\u043E\u0441\u043E\u0441\u044C \xD78, Unagi \u0432\u0443\u0433\u043E\u0440 \xD78, \u0444\u0443\u0442\u043E\u043C\u0430\u043A surimi \u0442\u0430 \u043B\u043E\u0441\u043E\u0441\u044C \xD78",
        image: "/imgs/sets_img/Trio_set_2.jpg"
      },
      {
        id: "set-3",
        name: "\u0421\u0435\u0442 3 \xABTempura\xBB (32 \u0448\u0442)",
        price: "150 PLN",
        desc: "\u0412\u0443\u0433\u043E\u0440 \u0443 \u043F\u0430\u043D\u043A\u043E \xD78, \u043B\u043E\u0441\u043E\u0441\u044C \u0443 \u043F\u0430\u043D\u043A\u043E \xD78, \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430 \u0443 \u043F\u0430\u043D\u043A\u043E \xD78, \u0444\u0456\u043B\u0430\u0434\u0435\u043B\u044C\u0444\u0456\u044F \u0437\u0430\u043F\u0435\u0447\u0435\u043D\u0430 \xD78",
        image: "/imgs/sets_img/Tempura_set_3.jpg"
      },
      {
        id: "set-4",
        name: "\u0421\u0435\u0442 4 \xABPhiladelphia\xBB (32 \u0448\u0442)",
        price: "160 PLN",
        desc: "\u0424\u0456\u043B\u0430\u0434\u0435\u043B\u044C\u0444\u0456\u044F \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430 \xD78, \u0424\u0456\u043B\u0430\u0434\u0435\u043B\u044C\u0444\u0456\u044F \u0432\u0443\u0433\u043E\u0440 \xD78, \u0424\u0456\u043B\u0430\u0434\u0435\u043B\u044C\u0444\u0456\u044F \u043B\u043E\u0441\u043E\u0441\u044C \xD78, \u0424\u0456\u043B\u0430\u0434\u0435\u043B\u044C\u0444\u0456\u044F \u0442\u0443\u043D\u0435\u0446\u044C \xD78",
        image: "/imgs/sets_img/SetPhiladelphia4.png"
      },
      {
        id: "set-5",
        name: "\u0421\u0435\u0442 5 \xABMAKI\xBB (36 \u0448\u0442)",
        price: "100 PLN",
        desc: "\u0425\u043E\u0441\u043E\u043C\u0430\u043A \u043B\u043E\u0441\u043E\u0441\u044C, \u0432\u0443\u0433\u043E\u0440, surimi, \u043E\u0433\u0456\u0440\u043E\u043A, \u0436\u043E\u0432\u0442\u0430 \u0440\u0435\u0434\u044C\u043A\u0430, kanpyo \u2014 \u043F\u043E 6 \u0448\u0442",
        image: "/imgs/sets_img/SetMaki5.png"
      },
      {
        id: "set-6",
        name: "\u0421\u0435\u0442 6 \xABAbsolute\xBB (46 \u0448\u0442)",
        price: "200 PLN",
        desc: "Unagi \xD78, \u0444\u0456\u043B\u0430 \u0437\u0430\u043F\u0435\u0447\u0435\u043D\u0430 \xD78, \u0444\u0456\u043B\u0430 \u043B\u043E\u0441\u043E\u0441\u044C \xD78, \u0444\u0443\u0442\u043E\u043C\u0430\u043A \u0442\u0443\u043D\u0435\u0446\u044C \u043F\u0430\u043D\u043A\u043E \xD78, \u0442\u0430\u0440\u0442\u0430\u0440 \u043F\u0430\u043D\u043A\u043E \xD78, \u0445\u043E\u0441\u043E\u043C\u0430\u043A \u043B\u043E\u0441\u043E\u0441\u044C \xD76",
        image: "/imgs/sets_img/SetAbsolute6.png"
      },
      {
        id: "set-7",
        name: "\u0421\u0435\u0442 7 \xABWeekend\xBB (70 \u0448\u0442)",
        price: "295 PLN",
        desc: "\u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F, \u0443\u0440\u0430\u043C\u0430\u043A\u0456, \u0444\u0443\u0442\u043E\u043C\u0430\u043A\u0456 \u043F\u0430\u043D\u043A\u043E, \u0445\u043E\u0441\u043E\u043C\u0430\u043A\u0456, \u043D\u0456\u0433\u0456\u0440\u0456 \u2014 \u043F\u0440\u0435\u043C\u0456\u0443\u043C \u043C\u0456\u043A\u0441",
        image: "/imgs/sets_img/Weekend_set_7.jpg"
      },
      {
        id: "set-8",
        name: "\u0421\u0435\u0442 8 \xABCalifornia\xBB (32 \u0448\u0442)",
        price: "150 PLN",
        desc: "\u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u043B\u043E\u0441\u043E\u0441\u044C \u0442\u043E\u0431\u0456\u043A\u043E \xD78, \u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430 \u0442\u043E\u0431\u0456\u043A\u043E \xD78, \u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u0442\u0443\u043D\u0435\u0446\u044C \u043A\u0443\u043D\u0436\u0443\u0442 \xD78, \u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u0432\u0443\u0433\u043E\u0440 \u043A\u0443\u043D\u0436\u0443\u0442 \xD78",
        image: "/imgs/sets_img/SetCalifornia8.png"
      },
      {
        id: "set-9",
        name: "\u0421\u0435\u0442 9 \xABMix\xBB (28 \u0448\u0442)",
        price: "110 PLN",
        desc: "\u0422\u0430\u0440\u0442\u0430\u0440 \u043B\u043E\u0441\u043E\u0441\u044C \u043F\u0430\u043D\u043A\u043E \xD78, \u0444\u0456\u043B\u0430 \u043B\u043E\u0441\u043E\u0441\u044C \u0456 surimi \xD78, \u0445\u043E\u0441\u043E\u043C\u0430\u043A \u043B\u043E\u0441\u043E\u0441\u044C \xD76, \u0445\u043E\u0441\u043E\u043C\u0430\u043A \u0432\u0443\u0433\u043E\u0440 \xD76",
        image: "/imgs/sets_img/SetMix9.png"
      },
      {
        id: "set-10",
        name: "\u0421\u0435\u0442 10 \xABTokyo\xBB (32 \u0448\u0442)",
        price: "160 PLN",
        desc: "\u0422\u0430\u0440\u0442\u0430\u0440 \u043B\u043E\u0441\u043E\u0441\u044C \u043F\u0430\u043D\u043A\u043E \xD78, \u0442\u0443\u043D\u0435\u0446\u044C \u043F\u0430\u043D\u043A\u043E \xD78, Philadelphia XL \xD78, Unagi \u0432\u0443\u0433\u043E\u0440 \xD78",
        image: "/imgs/sets_img/Tokio_set_10.jpg"
      },
      {
        id: "set-11",
        name: "\u0421\u0435\u0442 11 \xABFamily\xBB (82 \u0448\u0442)",
        price: "320 PLN",
        desc: "\u0424\u0443\u0442\u043E\u043C\u0430\u043A\u0456 \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430 \u0443 \u043F\u0430\u043D\u043A\u043E \xD78, \u0422\u0430\u0440\u0442\u0430\u0440 \u0437 \u043B\u043E\u0441\u043E\u0441\u044F \u0443 \u043F\u0430\u043D\u043A\u043E \xD78, \u0417\u0430\u043F\u0435\u0447\u0435\u043D\u0438\u0439 \u0442\u0443\u043D\u0435\u0446\u044C \u0443 \u043F\u0430\u043D\u043A\u043E \xD78, \u0424\u0456\u043B\u0430\u0434\u0435\u043B\u044C\u0444\u0456\u044F \u043B\u043E\u0441\u043E\u0441\u044C \xD78, \u0424\u0456\u043B\u0430\u0434\u0435\u043B\u044C\u0444\u0456\u044F \u0432\u0443\u0433\u043E\u0440 \xD78, \u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u043B\u043E\u0441\u043E\u0441\u044C \u0442\u043E\u0431\u0456\u043A\u043E \xD78, \u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u0432\u0443\u0433\u043E\u0440 \u0443 \u043A\u0443\u043D\u0436\u0443\u0442\u0456 \xD78, \u0424\u0443\u0442\u043E\u043C\u0430\u043A\u0456 \u0437 \u0442\u0443\u043D\u0446\u0435\u043C \u0443\u0441\u0435\u0440\u0435\u0434\u0438\u043D\u0456 \xD78, \u0425\u043E\u0441\u043E\u043C\u0430\u043A\u0456 \u043E\u0433\u0456\u0440\u043E\u043A \xD76, \u0425\u043E\u0441\u043E\u043C\u0430\u043A\u0456 \u0436\u043E\u0432\u0442\u0430 \u0440\u0435\u0434\u044C\u043A\u0430 \xD76, \u0425\u043E\u0441\u043E\u043C\u0430\u043A\u0456 \u0441\u0443\u0440\u0456\u043C\u0456 \xD76",
        image: "/imgs/sets_img/Family_set_11.jpg"
      },
      {
        id: "set-12",
        name: "\u0421\u0435\u0442 12 \xABCombo\xBB (32 \u0448\u0442)",
        price: "140 PLN",
        desc: "\u0424\u0456\u043B\u0430 \u043B\u043E\u0441\u043E\u0441\u044C \xD78, \u0444\u0456\u043B\u0430 \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430 \xD78, \u043A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u043B\u043E\u0441\u043E\u0441\u044C \xD78, \u043A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u0432\u0443\u0433\u043E\u0440 \xD78",
        image: "/imgs/sets_img/Kombo_set_12.jpg"
      },
      {
        id: "set-13",
        name: "\u0421\u0435\u0442 13 \xABHit\xBB (24 \u0448\u0442)",
        price: "115 PLN",
        desc: "\u0424\u0456\u043B\u0430 \u043B\u043E\u0441\u043E\u0441\u044C \xD78, \u043A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u043B\u043E\u0441\u043E\u0441\u044C \xD78, \u0444\u0443\u0442\u043E\u043C\u0430\u043A \u0442\u0443\u043D\u0435\u0446\u044C \u043F\u0430\u043D\u043A\u043E \xD78",
        image: "/imgs/sets_img/Hit_set_13.jpg"
      },
      {
        id: "set-14",
        name: "\u0421\u0435\u0442 14 \xABTopchik\xBB (32 \u0448\u0442)",
        price: "140 PLN",
        desc: "\u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u043B\u043E\u0441\u043E\u0441\u044C \xD78, \u0444\u0456\u043B\u0430 \u043B\u043E\u0441\u043E\u0441\u044C \xD78, \u0444\u0443\u0442\u043E\u043C\u0430\u043A \u0442\u0443\u043D\u0435\u0446\u044C \u043F\u0430\u043D\u043A\u043E \xD78, \u043B\u043E\u0441\u043E\u0441\u044C \u0443 \u043F\u0430\u043D\u043A\u043E \xD78",
        image: "/imgs/sets_img/Topchik_set_14.jpg"
      },
      {
        id: "set-15",
        name: "\u0421\u0435\u0442 15 \xABExotic\xBB (32 \u0448\u0442)",
        price: "170 PLN",
        desc: "Philadelphia classic \xD78, \u043C\u0430\u043D\u0433\u043E \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430 \u043F\u0430\u043D\u043A\u043E \xD78, \u0430\u0432\u043E\u043A\u0430\u0434\u043E \u043B\u043E\u0441\u043E\u0441\u044C \xD78, \u043A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u0432\u0443\u0433\u043E\u0440 \xD78",
        image: "/imgs/sets_img/Exotic_set_15.jpg"
      }
    ],
    Futomak: [
      {
        id: "futo-salmon-center",
        name: "\u0424\u0443\u0442\u043E\u043C\u0430\u043A \u0437 \u043B\u043E\u0441\u043E\u0441\u0435\u043C \u0432\u0441\u0435\u0440\u0435\u0434\u0438\u043D\u0456",
        price: "38 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043B\u043E\u0441\u043E\u0441\u044C, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043E\u0433\u0456\u0440\u043E\u043A",
        image: "/imgs/Rolls/FutomakiSalmon.png"
      },
      {
        id: "futo-salmon-surimi",
        name: "\u0424\u0443\u0442\u043E\u043C\u0430\u043A \u0437 \u043B\u043E\u0441\u043E\u0441\u0435\u043C \u0456 surimi",
        price: "37 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, surimi, \u043E\u0433\u0456\u0440\u043E\u043A, \u043B\u043E\u0441\u043E\u0441\u044C, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440",
        image: "/imgs/Rolls/FutomakiSalmonSurimi.jpg"
      },
      {
        id: "futo-baked-salmon",
        name: "\u0417\u0430\u043F\u0435\u0447\u0435\u043D\u0438\u0439 \u043B\u043E\u0441\u043E\u0441\u044C",
        price: "38 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0437\u0430\u043F\u0435\u0447\u0435\u043D\u0438\u0439 \u043B\u043E\u0441\u043E\u0441\u044C, kanpyo, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043A\u0443\u043D\u0436\u0443\u0442, \u0442\u0435\u0440\u0456\u044F\u043A\u0456"
      },
      {
        id: "futo-wege",
        name: "\u0412\u0435\u0433\u0435",
        price: "35 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043E\u0433\u0456\u0440\u043E\u043A, \u0436\u043E\u0432\u0442\u0430 \u0440\u0435\u0434\u044C\u043A\u0430, kanpyo, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043A\u0443\u043D\u0436\u0443\u0442, \u0442\u0435\u0440\u0456\u044F\u043A\u0456"
      },
      {
        id: "futo-eel-panko",
        name: "\u0412\u0443\u0433\u043E\u0440 \u0443 \u043F\u0430\u043D\u043A\u043E",
        price: "42 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0437\u0430\u043F\u0435\u0447\u0435\u043D\u0438\u0439 \u0432\u0443\u0433\u043E\u0440, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043A\u0443\u043D\u0436\u0443\u0442, \u0442\u0435\u0440\u0456\u044F\u043A\u0456",
        image: "/imgs/Rolls/FutomakiEelPanko.png"
      },
      {
        id: "futo-tuna-panko",
        name: "\u0422\u0443\u043D\u0435\u0446\u044C \u0443 \u043F\u0430\u043D\u043A\u043E",
        price: "39 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0442\u0443\u043D\u0435\u0446\u044C, kanpyo, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043F\u0430\u043D\u043A\u043E",
        image: "/imgs/Rolls/FutoTunaPanko.png"
      },
      {
        id: "futo-salmon-panko",
        name: "\u041B\u043E\u0441\u043E\u0441\u044C \u0443 \u043F\u0430\u043D\u043A\u043E",
        price: "39 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043B\u043E\u0441\u043E\u0441\u044C, \u043E\u0433\u0456\u0440\u043E\u043A, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u0442\u0435\u043C\u043F\u0443\u0440\u0430",
        image: "/imgs/Rolls/FutoSalmonPanko.png"
      },
      {
        id: "futo-shrimp-panko",
        name: "\u041A\u0440\u0435\u0432\u0435\u0442\u043A\u0430 \u0443 \u043F\u0430\u043D\u043A\u043E",
        price: "42 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430, \u043E\u0433\u0456\u0440\u043E\u043A, \u0436\u043E\u0432\u0442\u0430 \u0440\u0435\u0434\u044C\u043A\u0430, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043F\u0430\u043D\u043A\u043E",
        image: "/imgs/Rolls/FutomakiShrimpPanko.png"
      },
      {
        id: "futo-salmon-tartar",
        name: "\u0422\u0430\u0440\u0442\u0430\u0440 \u0456\u0437 \u043B\u043E\u0441\u043E\u0441\u044F",
        price: "37 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0442\u0430\u0440\u0442\u0430\u0440 \u0456\u0437 \u043B\u043E\u0441\u043E\u0441\u044F, \u0447\u0438\u043B\u0456, \u043E\u0433\u0456\u0440\u043E\u043A, \u043A\u0443\u043D\u0436\u0443\u0442",
        image: "/imgs/Rolls/FutoSalmonTartarPanko.png"
      }
    ],
    "Futomak z serow\u0105 czapeczk\u0105": [
      {
        id: "futo-cap-salmon",
        name: "\u0424\u0443\u0442\u043E\u043C\u0430\u043A \u043B\u043E\u0441\u043E\u0441\u044C \u0456\u0437 \u0441\u0438\u0440\u043D\u043E\u044E \u0448\u0430\u043F\u043A\u043E\u044E",
        price: "49 PLN",
        desc: "\u041B\u043E\u0441\u043E\u0441\u044C, \u043E\u0433\u0456\u0440\u043E\u043A, cheddar, \u0444\u0456\u043B\u0430\u0434\u0435\u043B\u044C\u0444\u0456\u044F, \u043A\u0443\u043D\u0436\u0443\u0442, \u0442\u0435\u0440\u0456\u044F\u043A\u0456",
        image: "/imgs/Rolls/FutoSalmonCheeseCap.png"
      },
      {
        id: "futo-cap-eel",
        name: "\u0424\u0443\u0442\u043E\u043C\u0430\u043A \u0432\u0443\u0433\u043E\u0440 \u0456\u0437 \u0441\u0438\u0440\u043D\u043E\u044E \u0448\u0430\u043F\u043A\u043E\u044E",
        price: "53 PLN",
        desc: "\u0412\u0443\u0433\u043E\u0440, \u043E\u0433\u0456\u0440\u043E\u043A, cheddar, \u0444\u0456\u043B\u0430\u0434\u0435\u043B\u044C\u0444\u0456\u044F, \u043A\u0443\u043D\u0436\u0443\u0442, \u0442\u0435\u0440\u0456\u044F\u043A\u0456",
        image: "/imgs/Rolls/FutoEelCheeseCap.png"
      },
      {
        id: "futo-cap-shrimp",
        name: "\u0424\u0443\u0442\u043E\u043C\u0430\u043A \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430 \u0456\u0437 \u0441\u0438\u0440\u043D\u043E\u044E \u0448\u0430\u043F\u043A\u043E\u044E",
        price: "55 PLN",
        desc: "\u041A\u0440\u0435\u0432\u0435\u0442\u043A\u0430, \u043E\u0433\u0456\u0440\u043E\u043A, cheddar, \u0444\u0456\u043B\u0430\u0434\u0435\u043B\u044C\u0444\u0456\u044F, \u043A\u0443\u043D\u0436\u0443\u0442, \u0442\u0435\u0440\u0456\u044F\u043A\u0456",
        image: "/imgs/Rolls/FutoShrimpPanko.png"
      }
    ],
    Philadelphia: [
      {
        id: "phila-classic",
        name: "Philadelphia Classic",
        price: "39 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043B\u043E\u0441\u043E\u0441\u044C, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043E\u0433\u0456\u0440\u043E\u043A",
        image: "/imgs/PhilaRolls/PhiladelphiaClassic.png"
      },
      {
        id: "phila-shrimp",
        name: "Philadelphia \u0437 \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u043E\u044E",
        price: "42 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043E\u0433\u0456\u0440\u043E\u043A, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430, \u043A\u0443\u043D\u0436\u0443\u0442, \u0442\u0435\u0440\u0456\u044F\u043A\u0456",
        image: "/imgs/PhilaRolls/PhiladelphiaShrimp.png"
      },
      {
        id: "phila-tuna",
        name: "Philadelphia \u0437 \u0442\u0443\u043D\u0446\u0435\u043C",
        price: "39 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0430\u0432\u043E\u043A\u0430\u0434\u043E, \u0442\u0443\u043D\u0435\u0446\u044C, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440",
        image: "/imgs/PhilaRolls/PhiladelphiaTuna.png"
      },
      {
        id: "phila-eel",
        name: "Philadelphia \u0437 \u0432\u0443\u0433\u0440\u0435\u043C",
        price: "40 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0432\u0443\u0433\u043E\u0440, \u043E\u0433\u0456\u0440\u043E\u043A, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043A\u0443\u043D\u0436\u0443\u0442, \u0442\u0435\u0440\u0456\u044F\u043A\u0456",
        image: "/imgs/PhilaRolls/PhiladelphiaEel.png"
      },
      {
        id: "phila-baked-salmon",
        name: "Philadelphia \u0437\u0430\u043F\u0435\u0447\u0435\u043D\u0438\u0439 \u043B\u043E\u0441\u043E\u0441\u044C",
        price: "39 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0437\u0430\u043F\u0435\u0447\u0435\u043D\u0438\u0439 \u043B\u043E\u0441\u043E\u0441\u044C, kanpyo, \u043A\u0443\u043D\u0436\u0443\u0442, \u0442\u0435\u0440\u0456\u044F\u043A\u0456, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440",
        image: "/imgs/PhilaRolls/PhiladelphiaBakedSalmon.png"
      },
      {
        id: "phila-avocado",
        name: "Philadelphia \u0437 \u0430\u0432\u043E\u043A\u0430\u0434\u043E",
        price: "40 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043B\u043E\u0441\u043E\u0441\u044C, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u0430\u0432\u043E\u043A\u0430\u0434\u043E",
        image: "/imgs/PhilaRolls/PhiladelphiaAvocado.png"
      },
      {
        id: "phila-xl",
        name: "Philadelphia XL",
        price: "59 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043F\u043E\u0434\u0432\u0456\u0439\u043D\u0438\u0439 \u043B\u043E\u0441\u043E\u0441\u044C, \u043E\u0433\u0456\u0440\u043E\u043A, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440",
        image: "/imgs/PhilaRolls/PhiladelphiaXL.jpg"
      }
    ],
    Kalifornia: [
      {
        id: "cal-salmon-tobiko",
        name: "\u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u0437 \u043B\u043E\u0441\u043E\u0441\u0435\u043C \u0443 \u0442\u043E\u0431\u0456\u043A\u043E",
        price: "39 PLN",
        desc: "\u041B\u043E\u0441\u043E\u0441\u044C, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u0436\u043E\u0432\u0442\u0430 \u0440\u0435\u0434\u044C\u043A\u0430, \u043E\u0433\u0456\u0440\u043E\u043A, \u0442\u043E\u0431\u0456\u043A\u043E",
        image: "/imgs/Rolls/CaliforniaSalmonTobiko.png"
      },
      {
        id: "cal-eel-sesame",
        name: "\u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u0437 \u0432\u0443\u0433\u0440\u0435\u043C \u0443 \u043A\u0443\u043D\u0436\u0443\u0442\u0456",
        price: "39 PLN",
        desc: "\u0412\u0443\u0433\u043E\u0440, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043E\u0433\u0456\u0440\u043E\u043A, \u0436\u043E\u0432\u0442\u0430 \u0440\u0435\u0434\u044C\u043A\u0430, \u043A\u0443\u043D\u0436\u0443\u0442",
        image: "/imgs/Rolls/CaliforniaEelSesame.png"
      },
      {
        id: "cal-shrimp-tobiko",
        name: "\u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u0437 \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u043E\u044E \u0432 \u043F\u0430\u043D\u043A\u043E",
        price: "40 PLN",
        desc: "\u041A\u0440\u0435\u0432\u0435\u0442\u043A\u0430, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u0436\u043E\u0432\u0442\u0430 \u0440\u0435\u0434\u044C\u043A\u0430, \u043E\u0433\u0456\u0440\u043E\u043A, \u0442\u043E\u0431\u0456\u043A\u043E",
        image: "/imgs/Rolls/CaliforniaShrimpPanko.png"
      },
      {
        id: "cal-tuna-sesame",
        name: "\u041A\u0430\u043B\u0456\u0444\u043E\u0440\u043D\u0456\u044F \u0437 \u0442\u0443\u043D\u0446\u0435\u043C \u0443 \u043A\u0443\u043D\u0436\u0443\u0442\u0456",
        price: "39 PLN",
        desc: "\u0422\u0443\u043D\u0435\u0446\u044C, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043E\u0433\u0456\u0440\u043E\u043A, \u0436\u043E\u0432\u0442\u0430 \u0440\u0435\u0434\u044C\u043A\u0430, \u043A\u0443\u043D\u0436\u0443\u0442",
        image: "/imgs/Rolls/CaliforniaTunaSesame.png"
      }
    ],
    Uramak: [
      {
        id: "ura-unagi",
        name: "Unagi",
        price: "38 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043E\u0433\u0456\u0440\u043E\u043A, \u0432\u0443\u0433\u043E\u0440, \u0442\u0435\u0440\u0456\u044F\u043A\u0456, \u043A\u0443\u043D\u0436\u0443\u0442",
        image: "/imgs/Rolls/Uramak.jpg"
      },
      {
        id: "ura-tokio",
        name: "Tokyo",
        price: "58 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043E\u0433\u0456\u0440\u043E\u043A, \u0432\u0430\u0440\u0435\u043D\u0430 \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430, \u0442\u043E\u0431\u0456\u043A\u043E, \u043B\u043E\u0441\u043E\u0441\u044C",
        image: "/imgs/Rolls/TokyoRoll.png"
      },
      {
        id: "ura-three-rubies",
        name: "\u0422\u0440\u0438 \u0440\u0438\u0431\u0438",
        price: "49 PLN",
        desc: "\u041B\u043E\u0441\u043E\u0441\u044C, \u0442\u0443\u043D\u0435\u0446\u044C, \u0432\u0443\u0433\u043E\u0440, \u0430\u0432\u043E\u043A\u0430\u0434\u043E, \u043A\u0443\u043D\u0436\u0443\u0442",
        image: "/imgs/Rolls/ThreeFishRoll.png"
      }
    ],
    Hosomak: [
      {
        id: "hoso-tuna",
        name: "\u0425\u043E\u0441\u043E\u043C\u0430\u043A \u0442\u0443\u043D\u0435\u0446\u044C",
        price: "24 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0442\u0443\u043D\u0435\u0446\u044C"
      },
      {
        id: "hoso-eel",
        name: "\u0425\u043E\u0441\u043E\u043C\u0430\u043A \u0432\u0443\u0433\u043E\u0440",
        price: "24 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0432\u0443\u0433\u043E\u0440, \u043A\u0443\u043D\u0436\u0443\u0442, \u0442\u0435\u0440\u0456\u044F\u043A\u0456"
      },
      {
        id: "hoso-salmon",
        name: "\u0425\u043E\u0441\u043E\u043C\u0430\u043A \u043B\u043E\u0441\u043E\u0441\u044C",
        price: "24 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043B\u043E\u0441\u043E\u0441\u044C"
      },
      {
        id: "hoso-shrimp",
        name: "\u0425\u043E\u0441\u043E\u043C\u0430\u043A \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430",
        price: "25 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430, \u043A\u0443\u043D\u0436\u0443\u0442, \u0442\u0435\u0440\u0456\u044F\u043A\u0456"
      },
      {
        id: "hoso-yellow-radish",
        name: "\u0425\u043E\u0441\u043E\u043C\u0430\u043A \u0436\u043E\u0432\u0442\u0430 \u0440\u0435\u0434\u044C\u043A\u0430",
        price: "15 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0436\u043E\u0432\u0442\u0430 \u0440\u0435\u0434\u044C\u043A\u0430"
      },
      {
        id: "hoso-kanpyo",
        name: "\u0425\u043E\u0441\u043E\u043C\u0430\u043A kanpyo",
        price: "15 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, kanpyo"
      },
      {
        id: "hoso-cucumber",
        name: "\u0425\u043E\u0441\u043E\u043C\u0430\u043A \u043E\u0433\u0456\u0440\u043E\u043A",
        price: "15 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043E\u0433\u0456\u0440\u043E\u043A"
      },
      {
        id: "hoso-surimi",
        name: "\u0425\u043E\u0441\u043E\u043C\u0430\u043A surimi",
        price: "15 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, surimi"
      },
      {
        id: "hoso-avocado",
        name: "\u0425\u043E\u0441\u043E\u043C\u0430\u043A \u0430\u0432\u043E\u043A\u0430\u0434\u043E",
        price: "19 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0430\u0432\u043E\u043A\u0430\u0434\u043E"
      }
    ],
    "Premium rolki": [
      {
        id: "prem-salmon-delux",
        name: "\u041B\u043E\u0441\u043E\u0441\u044C Delux",
        price: "80 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043B\u043E\u0441\u043E\u0441\u044C XL, \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430 \u0432 \u043F\u0430\u043D\u043A\u043E, \u044F\u043F\u043E\u043D\u0441\u044C\u043A\u0438\u0439 \u043C\u0430\u0439\u043E\u043D\u0435\u0437",
        image: "/imgs/PremiumRolls/Delux.jpg"
      },
      {
        id: "prem-dubai",
        name: "\u0420\u043E\u043B Dubai",
        price: "80 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u043B\u043E\u0441\u043E\u0441\u044C XL, \u0432\u0430\u043A\u0430\u043C\u0435",
        image: "/imgs/PremiumRolls/RollDubai.jpg"
      }
    ],
    "Sushi Burger": [
      {
        id: "burger-king",
        name: "\u0421\u0443\u0448\u0456-\u0431\u0443\u0440\u0433\u0435\u0440 King",
        price: "69 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u0442\u043E\u0431\u0456\u043A\u043E, \u0432\u0430\u0440\u0435\u043D\u0456 \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0438, \u043B\u043E\u0441\u043E\u0441\u044C, \u0430\u0432\u043E\u043A\u0430\u0434\u043E, \u0447\u0435\u0434\u0434\u0435\u0440",
        image: "/imgs/Burgers/BurgerKing.png"
      },
      {
        id: "burger-salmon",
        name: "\u0411\u0443\u0440\u0433\u0435\u0440 \u0437 \u043B\u043E\u0441\u043E\u0441\u0435\u043C",
        price: "45 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u043E\u0433\u0456\u0440\u043E\u043A, \u043B\u043E\u0441\u043E\u0441\u044C",
        image: "/imgs/Burgers/BurgerLosos.jpg"
      },
      {
        id: "burger-tuna-wakame",
        name: "\u0411\u0443\u0440\u0433\u0435\u0440 \u0437 \u0442\u0443\u043D\u0446\u0435\u043C \u0456 \u0432\u0430\u043A\u0430\u043C\u0435",
        price: "45 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u0432\u0430\u043A\u0430\u043C\u0435, \u0442\u0443\u043D\u0435\u0446\u044C, \u0442\u0435\u0440\u0456\u044F\u043A\u0456",
        image: "/imgs/Burgers/BurgerTuna.jpg"
      },
      {
        id: "burger-shrimp-avocado",
        name: "\u0411\u0443\u0440\u0433\u0435\u0440 \u0437 \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u043E\u044E \u0442\u0430 \u0430\u0432\u043E\u043A\u0430\u0434\u043E",
        price: "50 PLN",
        desc: "\u0420\u0438\u0441, \u043D\u043E\u0440\u0456, \u0432\u0435\u0440\u0448\u043A\u043E\u0432\u0438\u0439 \u0441\u0438\u0440, \u0432\u0430\u0440\u0435\u043D\u0430 \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430, \u0430\u0432\u043E\u043A\u0430\u0434\u043E, \u0442\u0435\u0440\u0456\u044F\u043A\u0456, \u0442\u043E\u0431\u0456\u043A\u043E",
        image: "/imgs/Burgers/BurgerShrimp.jpg"
      }
    ],
    Nigiri: [
      {
        id: "nigiri-tuna",
        name: "\u041D\u0456\u0433\u0456\u0440\u0456 \u0442\u0443\u043D\u0435\u0446\u044C",
        price: "22 PLN",
        desc: "2 \u0448\u0442"
      },
      {
        id: "nigiri-salmon",
        name: "\u041D\u0456\u0433\u0456\u0440\u0456 \u043B\u043E\u0441\u043E\u0441\u044C",
        price: "22 PLN",
        desc: "2 \u0448\u0442"
      },
      {
        id: "nigiri-eel",
        name: "\u041D\u0456\u0433\u0456\u0440\u0456 \u0432\u0443\u0433\u043E\u0440",
        price: "22 PLN",
        desc: "2 \u0448\u0442"
      },
      {
        id: "nigiri-shrimp",
        name: "\u041D\u0456\u0433\u0456\u0440\u0456 \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430",
        price: "22 PLN",
        desc: "2 \u0448\u0442"
      }
    ],
    "Przystawki / Inne": [
      {
        id: "shrimp-panko",
        name: "\u041A\u0440\u0435\u0432\u0435\u0442\u043A\u0438 \u0432 \u043F\u0430\u043D\u043A\u043E",
        price: "45/55 PLN",
        desc: "\u0425\u0440\u0443\u0441\u0442\u043A\u0456 \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0438 \u0432 \u043F\u0430\u043D\u0456\u0440\u043E\u0432\u0446\u0456",
        variantOptions: [
          {
            key: "6",
            label: "6 \u0448\u0442",
            price: "45 PLN"
          },
          {
            key: "9",
            label: "9 \u0448\u0442",
            price: "55 PLN"
          }
        ],
        image: "/imgs/Starters/PankoShrimp.jpg"
      },
      {
        id: "fries-large",
        name: "\u041A\u0430\u0440\u0442\u043E\u043F\u043B\u044F \u0444\u0440\u0456 (\u0432\u0435\u043B\u0438\u043A\u0430)",
        price: "10 PLN",
        desc: "\u0417\u043E\u043B\u043E\u0442\u0438\u0441\u0442\u0430 \u043A\u0430\u0440\u0442\u043E\u043F\u043B\u044F \u0444\u0440\u0456 + \u043A\u0435\u0442\u0447\u0443\u043F",
        image: "/imgs/Starters/Frenchfries.jpg"
      },
      {
        id: "gunkan-tuna",
        name: "\u0413\u0443\u043D\u043A\u0430\u043D \u0442\u0443\u043D\u0435\u0446\u044C",
        price: "30 PLN",
        desc: "2 \u0448\u0442"
      },
      {
        id: "gunkan-salmon",
        name: "\u0413\u0443\u043D\u043A\u0430\u043D \u043B\u043E\u0441\u043E\u0441\u044C",
        price: "30 PLN",
        desc: "2 \u0448\u0442"
      },
      {
        id: "gunkan-eel",
        name: "\u0413\u0443\u043D\u043A\u0430\u043D \u0432\u0443\u0433\u043E\u0440",
        price: "30 PLN",
        desc: "2 \u0448\u0442"
      },
      {
        id: "gunkan-shrimp",
        name: "\u0413\u0443\u043D\u043A\u0430\u043D \u043A\u0440\u0435\u0432\u0435\u0442\u043A\u0430",
        price: "30 PLN",
        desc: "2 \u0448\u0442"
      }
    ],
    Desery: [
      {
        id: "zestaw-tropik",
        name: "\u0421\u0435\u0442 \xAB\u0422\u0440\u043E\u043F\u0456\u043A\xBB",
        price: "100 PLN",
        desc: "32 \u0448\u0442: \u043C\u0456\u043A\u0441 \xD78, \u0431\u0430\u043D\u0430\u043D \xD78, \u043A\u0456\u0432\u0456 \xD78, \u043F\u043E\u043B\u0443\u043D\u0438\u0446\u044F \xD78",
        image: "/imgs/Desery/ZestawTropik.png"
      },
      {
        id: "sweet-roll-mix",
        name: "\u0421\u043E\u043B\u043E\u0434\u043A\u0438\u0439 \u0440\u043E\u043B \u2014 \u043C\u0456\u043A\u0441",
        price: "35 PLN",
        desc: "\u0420\u0438\u0441\u043E\u0432\u0438\u0439 \u043F\u0430\u043F\u0456\u0440, \u043A\u0456\u0432\u0456, \u0431\u0430\u043D\u0430\u043D, \u043F\u043E\u043B\u0443\u043D\u0438\u0446\u044F, \u0441\u043E\u043B\u043E\u0434\u043A\u0438\u0439 \u0441\u0438\u0440\u043E\u043A, \u0440\u0438\u0441, \u0444\u0440\u0443\u043A\u0442\u043E\u0432\u0430 \u0433\u043B\u0430\u0437\u0443\u0440, \u043A\u043E\u043A\u043E\u0441\u043E\u0432\u0430 \u0441\u0442\u0440\u0443\u0436\u043A\u0430",
        image: "/imgs/Desery/SweetRollMix.png"
      },
      {
        id: "sweet-roll-kiwi",
        name: "\u0421\u043E\u043B\u043E\u0434\u043A\u0438\u0439 \u0440\u043E\u043B \u2014 \u043A\u0456\u0432\u0456",
        price: "25 PLN",
        desc: "\u0421\u043E\u0439\u043E\u0432\u0438\u0439 \u043F\u0430\u043F\u0456\u0440, \u043A\u0456\u0432\u0456, \u0441\u043E\u043B\u043E\u0434\u043A\u0438\u0439 \u0441\u0438\u0440\u043E\u043A, \u0440\u0438\u0441, \u043A\u043E\u043A\u043E\u0441\u043E\u0432\u0430 \u0441\u0442\u0440\u0443\u0436\u043A\u0430",
        image: "/imgs/Desery/SweetRollKiwi.png"
      },
      {
        id: "sweet-roll-truskawka",
        name: "\u0421\u043E\u043B\u043E\u0434\u043A\u0438\u0439 \u0440\u043E\u043B \u2014 \u043F\u043E\u043B\u0443\u043D\u0438\u0446\u044F",
        price: "25 PLN",
        desc: "\u0421\u043E\u0439\u043E\u0432\u0438\u0439 \u043F\u0430\u043F\u0456\u0440, \u043F\u043E\u043B\u0443\u043D\u0438\u0446\u044F, \u0441\u043E\u043B\u043E\u0434\u043A\u0438\u0439 \u0441\u0438\u0440\u043E\u043A, \u0440\u0438\u0441, \u0448\u043E\u043A\u043E\u043B\u0430\u0434\u043D\u0430 \u0433\u043B\u0430\u0437\u0443\u0440, \u043A\u043E\u043A\u043E\u0441\u043E\u0432\u0430 \u0441\u0442\u0440\u0443\u0436\u043A\u0430",
        image: "/imgs/Desery/SweetRollTruskawka.png"
      },
      {
        id: "sweet-roll-banan",
        name: "\u0421\u043E\u043B\u043E\u0434\u043A\u0438\u0439 \u0440\u043E\u043B \u2014 \u0431\u0430\u043D\u0430\u043D",
        price: "25 PLN",
        desc: "\u0421\u043E\u0439\u043E\u0432\u0438\u0439 \u043F\u0430\u043F\u0456\u0440, \u0431\u0430\u043D\u0430\u043D, \u0441\u043E\u043B\u043E\u0434\u043A\u0438\u0439 \u0441\u0438\u0440\u043E\u043A, \u0440\u0438\u0441, \u0448\u043E\u043A\u043E\u043B\u0430\u0434\u043D\u0430 \u0433\u043B\u0430\u0437\u0443\u0440, \u043A\u043E\u043A\u043E\u0441\u043E\u0432\u0430 \u0441\u0442\u0440\u0443\u0436\u043A\u0430",
        image: "/imgs/Desery/SweetRollBanan.png"
      },
      {
        id: "mochi",
        name: "\u041C\u043E\u0442\u0456 \u0432 \u0430\u0441\u043E\u0440\u0442\u0438\u043C\u0435\u043D\u0442\u0456",
        price: "10 PLN",
        desc: "\u041D\u0456\u0436\u043D\u0438\u0439 \u044F\u043F\u043E\u043D\u0441\u044C\u043A\u0438\u0439 \u0434\u0435\u0441\u0435\u0440\u0442 \u0456\u0437 \u0440\u0438\u0441\u043E\u0432\u043E\u0433\u043E \u0442\u0456\u0441\u0442\u0430 \u0437 \u043C'\u044F\u043A\u043E\u044E \u043A\u0440\u0435\u043C\u043E\u0432\u043E\u044E \u0430\u0431\u043E \u0444\u0440\u0443\u043A\u0442\u043E\u0432\u043E\u044E \u043D\u0430\u0447\u0438\u043D\u043A\u043E\u044E \u0432\u0441\u0435\u0440\u0435\u0434\u0438\u043D\u0456",
        image: "/imgs/Starters/Mochi.png"
      }
    ],
    Napoje: [
      {
        id: "drink-h-033",
        kind: "section",
        name: "0.33 l"
      },
      {
        id: "drink-coca-033",
        name: "Coca-Cola 0.33",
        price: "5 PLN",
        desc: "0.33 \u043B",
        image: "/imgs/drinks/CocaCola.jpg"
      },
      {
        id: "drink-fanta-033",
        name: "Fanta 0.33",
        price: "5 PLN",
        desc: "0.33 \u043B",
        image: "/imgs/drinks/Fanta.jpg"
      },
      {
        id: "drink-h-04",
        kind: "section",
        name: "0.4 l"
      },
      {
        id: "drink-lemonade-04",
        name: "\u041B\u0438\u043C\u043E\u043D\u0430\u0434 0.4",
        price: "6 PLN",
        desc: "0.4 \u043B",
        image: "/imgs/drinks/Cappy.jpg"
      },
      {
        id: "drink-h-05",
        kind: "section",
        name: "0.5 l"
      },
      {
        id: "drink-coca-05",
        name: "Coca-Cola 0.5",
        price: "7 PLN",
        desc: "0.5 \u043B",
        image: "/imgs/drinks/CocaCola.jpg"
      },
      {
        id: "drink-fanta-05",
        name: "Fanta 0.5",
        price: "7 PLN",
        desc: "0.5 \u043B",
        image: "/imgs/drinks/Fanta.jpg"
      },
      {
        id: "drink-sprite-05",
        name: "Sprite 0.5",
        price: "7 PLN",
        desc: "0.5 \u043B",
        image: "/imgs/drinks/Sprite.jpg"
      },
      {
        id: "drink-tea",
        name: "\u0427\u0430\u0439 0.5",
        price: "8 PLN",
        desc: "0.5 \u043B",
        image: "/imgs/drinks/fuzetea.jpg"
      },
      {
        id: "drink-water-sparkling-05",
        name: "\u0412\u043E\u0434\u0430 \u0433\u0430\u0437\u043E\u0432\u0430\u043D\u0430 0.5",
        price: "3 PLN",
        desc: "0.5 \u043B"
      },
      {
        id: "drink-water-still-05",
        name: "\u0412\u043E\u0434\u0430 \u043D\u0435\u0433\u0430\u0437\u043E\u0432\u0430\u043D\u0430 0.5",
        price: "3 PLN",
        desc: "0.5 \u043B"
      },
      {
        id: "drink-h-07",
        kind: "section",
        name: "0.7 l"
      },
      {
        id: "drink-water-still-07",
        name: "\u0412\u043E\u0434\u0430 \u043D\u0435\u0433\u0430\u0437\u043E\u0432\u0430\u043D\u0430 0.7",
        price: "6 PLN",
        desc: "0.7 \u043B"
      },
      {
        id: "drink-h-085",
        kind: "section",
        name: "0.85 l"
      },
      {
        id: "drink-coca-085",
        name: "Coca-Cola 0.85",
        price: "10 PLN",
        desc: "0.85 \u043B",
        image: "/imgs/drinks/CocaCola.jpg"
      },
      {
        id: "drink-fanta-085",
        name: "Fanta 0.85",
        price: "10 PLN",
        desc: "0.85 \u043B",
        image: "/imgs/drinks/Fanta.jpg"
      },
      {
        id: "drink-sprite-085",
        name: "Sprite 0.85",
        price: "10 PLN",
        desc: "0.85 \u043B",
        image: "/imgs/drinks/Sprite.jpg"
      }
    ]
  }
};

// src/shared/menuCatalog.ts
var menu = menuByLang_default;
var MAX_CART_LINES = 100;
var MAX_LINE_QTY = 99;
function parseMenuPrice(priceText) {
  const [firstPart] = priceText.split("/");
  const numericPrice = parseFloat(
    firstPart.replace(/[^\d.,]/g, "").replace(",", ".")
  );
  return Number.isFinite(numericPrice) ? numericPrice : NaN;
}
function menuItemBaseId(itemId) {
  const sep = itemId.indexOf("__");
  return sep === -1 ? itemId : itemId.slice(0, sep);
}
function variantKeyFromLineId(itemId) {
  const sep = itemId.indexOf("__");
  return sep === -1 ? null : itemId.slice(sep + 2);
}
function isMenuSection(row) {
  return "kind" in row && row.kind === "section";
}
function resolveLang(locale) {
  if (locale === "en" || locale === "uk") return locale;
  return "pl";
}
function findMenuItem(locale, itemId) {
  const lang = resolveLang(locale);
  const baseId = menuItemBaseId(itemId);
  const categories = menu[lang];
  for (const cat of Object.keys(categories)) {
    const row = categories[cat].find((i) => !isMenuSection(i) && i.id === baseId);
    if (row && !isMenuSection(row)) {
      return row;
    }
  }
  return null;
}
function resolveCartLineUnitPrice(lineId, lang) {
  const item = findMenuItem(lang, lineId);
  if (!item) return null;
  const variantKey = variantKeyFromLineId(lineId);
  if (variantKey) {
    const opt = item.variantOptions?.find((o) => o.key === variantKey);
    if (!opt) return null;
    const price2 = parseMenuPrice(opt.price);
    return Number.isFinite(price2) ? price2 : null;
  }
  if (item.variantOptions?.length) {
    return null;
  }
  const price = parseMenuPrice(item.price);
  return Number.isFinite(price) ? price : null;
}
function resolveCartLineName(lineId, lang) {
  const item = findMenuItem(lang, lineId);
  if (!item) return null;
  const variantKey = variantKeyFromLineId(lineId);
  if (variantKey) {
    const opt = item.variantOptions?.find((o) => o.key === variantKey);
    if (!opt) return null;
    return `${item.name} \u2014 ${opt.label}`;
  }
  if (item.variantOptions?.length) return null;
  return item.name;
}
function validateAndPriceCart(rawCart, claimedTotal, lang) {
  if (!Array.isArray(rawCart) || rawCart.length === 0) {
    return { ok: false, reason: "invalid_item" };
  }
  if (rawCart.length > MAX_CART_LINES) {
    return { ok: false, reason: "cart_too_large" };
  }
  let computedTotal = 0;
  const cart = [];
  for (const line of rawCart) {
    if (!line || typeof line !== "object") {
      return { ok: false, reason: "invalid_item" };
    }
    const id = String(line.id ?? "").trim();
    const qty = Math.floor(Number(line.quantity));
    if (!id || !Number.isFinite(qty) || qty < 1 || qty > MAX_LINE_QTY) {
      return { ok: false, reason: "invalid_quantity" };
    }
    const unitPrice = resolveCartLineUnitPrice(id, lang);
    const name = resolveCartLineName(id, lang);
    if (unitPrice == null || name == null) {
      return { ok: false, reason: "invalid_item" };
    }
    computedTotal += unitPrice * qty;
    cart.push({ id, name, price: unitPrice, quantity: qty });
  }
  const computedRounded = Math.round(computedTotal * 100) / 100;
  const claimedRounded = Math.round(Number(claimedTotal) * 100) / 100;
  if (!Number.isFinite(claimedRounded) || Math.abs(computedRounded - claimedRounded) > 1e-3) {
    return { ok: false, reason: "total_mismatch" };
  }
  return { ok: true, cart, total: computedRounded };
}

// src/types/index.ts
var ValidationError = {
  INVALID_PAYLOAD: "Invalid order payload",
  PRIVACY: "Privacy consent required",
  EMAIL: "Valid email is required",
  ADDRESS: "Address is required for delivery",
  DELIVERY_MINIMUM: "Order subtotal below delivery minimum",
  TIME: "Time is required when scheduling",
  TIME_DATE: "Date is required when scheduling",
  TIME_OUT_OF_RANGE: "Scheduled time is outside allowed window",
  TIME_CALL_REQUIRED: "Scheduled time requires phone confirmation",
  RESTAURANT_CLOSED: "Restaurant is currently closed",
  CASH_REQUIRED: "Cash amount required",
  CASH_COVER: "Cash amount must cover order total",
  CART_PRICING: "Cart items or total do not match menu prices"
};

// src/shared/orderValidation.ts
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var MAX_EXTRA_PORTIONS = 20;
function normalizeExtraQty(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, MAX_EXTRA_PORTIONS);
}
function normalizeExtras(p) {
  return {
    extraWasabi: normalizeExtraQty(p.extraWasabi),
    extraChopsticks: normalizeExtraQty(p.extraChopsticks),
    extraSoy: normalizeExtraQty(p.extraSoy),
    extraGinger: normalizeExtraQty(p.extraGinger)
  };
}
function validateOrderPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: ValidationError.INVALID_PAYLOAD };
  }
  const p = payload;
  const {
    name = "",
    phone = "",
    email = "",
    privacyAccepted,
    orderType = "delivery",
    paymentMethod = "cash",
    timeMode = "asap",
    address = "",
    streetNumber = "",
    apartmentNumber = "",
    preferredDate = "",
    preferredTime = "",
    comment = "",
    cashAmount,
    lang = "pl",
    cart = [],
    total = 0,
    currency = "PLN"
  } = p;
  if (!privacyAccepted) {
    return { ok: false, error: ValidationError.PRIVACY };
  }
  const emailTrim = String(email || "").trim().toLowerCase();
  if (!emailTrim || !EMAIL_RE.test(emailTrim)) {
    return { ok: false, error: ValidationError.EMAIL };
  }
  if (!String(name).trim() || !String(phone).trim() || !Array.isArray(cart) || cart.length === 0) {
    return { ok: false, error: ValidationError.INVALID_PAYLOAD };
  }
  const cartSubtotalClaim = p.subtotal != null ? Number(p.subtotal) : Number(total);
  const cartPricing = validateAndPriceCart(cart, cartSubtotalClaim, String(lang));
  if (!cartPricing.ok) {
    return { ok: false, error: ValidationError.CART_PRICING };
  }
  if (orderType === "delivery" && !isDeliveryAvailable(cartPricing.total)) {
    return { ok: false, error: ValidationError.DELIVERY_MINIMUM };
  }
  if (orderType === "delivery" && (!String(address || "").trim() || !String(streetNumber || "").trim())) {
    return { ok: false, error: ValidationError.ADDRESS };
  }
  if (!isRestaurantOpen()) {
    return { ok: false, error: ValidationError.RESTAURANT_CLOSED };
  }
  if (timeMode === "scheduled" && !String(preferredDate || "").trim()) {
    return { ok: false, error: ValidationError.TIME_DATE };
  }
  if (timeMode === "scheduled" && !String(preferredTime || "").trim()) {
    return { ok: false, error: ValidationError.TIME };
  }
  if (timeMode === "scheduled") {
    const timeStatus = getScheduledTimeStatus(
      String(preferredTime),
      String(preferredDate)
    );
    if (timeStatus === "invalid" || timeStatus === "out_of_range") {
      return { ok: false, error: ValidationError.TIME_OUT_OF_RANGE };
    }
    if (timeStatus === "call_required") {
      return { ok: false, error: ValidationError.TIME_CALL_REQUIRED };
    }
  }
  const bottleDeposit = calculateBottleDepositPln(cart);
  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE_PLN : 0;
  const orderTotal = Math.round((cartPricing.total + bottleDeposit + deliveryFee) * 100) / 100;
  const claimedTotal = Math.round(Number(total) * 100) / 100;
  if (!Number.isFinite(claimedTotal) || Math.abs(orderTotal - claimedTotal) > 1e-3) {
    return { ok: false, error: ValidationError.CART_PRICING };
  }
  let cashTendered = null;
  let cashChange = null;
  if (paymentMethod === "cash") {
    const rawCash = String(cashAmount ?? "").trim().replace(",", ".");
    if (!rawCash) {
      return { ok: false, error: ValidationError.CASH_REQUIRED };
    }
    cashTendered = Number(rawCash);
    if (!Number.isFinite(cashTendered) || cashTendered <= 0) {
      return { ok: false, error: ValidationError.CASH_REQUIRED };
    }
    if (cashTendered < orderTotal - 1e-3) {
      return { ok: false, error: ValidationError.CASH_COVER };
    }
    cashChange = Math.round((cashTendered - orderTotal) * 100) / 100;
  }
  return {
    ok: true,
    data: {
      name: String(name).trim(),
      phone: String(phone).trim(),
      emailTrim,
      orderType,
      paymentMethod,
      timeMode,
      address: String(address || "").trim(),
      streetNumber: String(streetNumber || "").trim(),
      apartmentNumber: String(apartmentNumber || "").trim(),
      preferredDate: String(preferredDate || "").trim(),
      preferredTime,
      comment: String(comment || "").trim(),
      extras: normalizeExtras(p),
      lang: String(lang),
      cart: cartPricing.cart,
      subtotal: cartPricing.total,
      bottleDeposit,
      deliveryFee,
      total: orderTotal,
      currency,
      cashTendered,
      cashChange
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BOTTLE_DEPOSIT_PLN,
  DELIVERY_FEE_PLN,
  DELIVERY_MIN_SUBTOTAL_PLN,
  EMAIL_RE,
  calculateBottleDepositPln,
  isDeliveryAvailable,
  validateOrderPayload
});
