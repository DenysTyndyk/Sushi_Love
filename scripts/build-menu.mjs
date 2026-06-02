import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { menuI18n } from './menu-i18n.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SET_IMAGES = {
  'set-1': '/imgs/sets_img/MiniPhila_set_1.jpg',
  'set-2': '/imgs/sets_img/Trio_set_2.jpg',
  'set-3': '/imgs/sets_img/Tempura_set_3.jpg',
  'set-4': '/imgs/sets_img/SetPhiladelphia4.png',
  'set-5': '/imgs/sets_img/SetMaki5.png',
  'set-6': '/imgs/sets_img/SetAbsolute6.png',
  'set-7': '/imgs/sets_img/Weekend_set_7.jpg',
  'set-8': '/imgs/sets_img/SetCalifornia8.png',
  'set-9': '/imgs/sets_img/SetMix9.png',
  'set-10': '/imgs/sets_img/Tokio_set_10.jpg',
  'set-11': '/imgs/sets_img/Family_set_11.jpg',
  'set-12': '/imgs/sets_img/Kombo_set_12.jpg',
  'set-13': '/imgs/sets_img/Hit_set_13.jpg',
  'set-14': '/imgs/sets_img/Topchik_set_14.jpg',
  'set-15': '/imgs/sets_img/Exotic_set_15.jpg'
};

const DRINK_IMAGES = {
  coca: '/imgs/drinks/CocaCola.jpg',
  fanta: '/imgs/drinks/Fanta.jpg',
  sprite: '/imgs/drinks/Sprite.jpg',
  cappy: '/imgs/drinks/Cappy.jpg',
  tea: '/imgs/drinks/fuzetea.jpg'
};

const ITEM_IMAGES = {
  'prem-salmon-delux': '/imgs/PremiumRolls/Delux.jpg',
  'prem-dubai': '/imgs/PremiumRolls/RollDubai.jpg',
  'futo-salmon-center': '/imgs/Rolls/FutomakiSalmon.png',
  'futo-tuna-panko': '/imgs/Rolls/FutoTunaPanko.png',
  'futo-eel-panko': '/imgs/Rolls/FutomakiEelPanko.png',
  'futo-salmon-panko': '/imgs/Rolls/FutoSalmonPanko.png',
  'futo-shrimp-panko': '/imgs/Rolls/FutomakiShrimpPanko.png',
  'futo-salmon-tartar': '/imgs/Rolls/FutoSalmonTartarPanko.png',
  'futo-cap-salmon': '/imgs/Rolls/FutoSalmonCheeseCap.png',
  'futo-cap-eel': '/imgs/Rolls/FutoEelCheeseCap.png',
  'futo-cap-shrimp': '/imgs/Rolls/FutoShrimpPanko.png',
  'cal-salmon-tobiko': '/imgs/Rolls/CaliforniaSalmonTobiko.png',
  'cal-shrimp-tobiko': '/imgs/Rolls/CaliforniaShrimpPanko.png',
  'cal-eel-sesame': '/imgs/Rolls/CaliforniaEelSesame.png',
  'cal-tuna-sesame': '/imgs/Rolls/CaliforniaTunaSesame.png',
  'ura-unagi': '/imgs/Rolls/Uramak.jpg',
  'ura-tokio': '/imgs/Rolls/TokyoRoll.png',
  'ura-three-rubies': '/imgs/Rolls/ThreeFishRoll.png',
  'phila-classic': '/imgs/PhilaRolls/PhiladelphiaClassic.png',
  'phila-baked-salmon': '/imgs/PhilaRolls/PhiladelphiaBakedSalmon.png',
  'phila-shrimp': '/imgs/PhilaRolls/PhiladelphiaShrimp.png',
  'phila-tuna': '/imgs/PhilaRolls/PhiladelphiaTuna.png',
  'phila-eel': '/imgs/PhilaRolls/PhiladelphiaEel.png',
  'phila-avocado': '/imgs/PhilaRolls/PhiladelphiaAvocado.png',
  'burger-salmon': '/imgs/Burgers/BurgerLosos.jpg',
  'burger-tuna-wakame': '/imgs/Burgers/BurgerTuna.jpg',
  'burger-shrimp-avocado': '/imgs/Burgers/BurgerShrimp.jpg',
  'shrimp-panko': '/imgs/Starters/PankoShrimp.jpg',
  'fries-large': '/imgs/Starters/Frenchfries.jpg'
};

const CATEGORY_KEYS = [
  'Zestawy',
  'Futomak',
  'Futomak z serową czapeczką',
  'Philadelphia',
  'Kalifornia',
  'Uramak',
  'Hosomak',
  'Premium rolki',
  'Sushi Burger',
  'Nigiri',
  'Przystawki / Inne',
  'Napoje'
];

const pl = {
  Zestawy: [
    {
      id: 'set-1',
      name: 'Zestaw 1 „Mini Phila 50/50”',
      price: '80 PLN',
      desc: '16 szt: Łosoś 4szt, Tuńczyk 4szt, Węgorz 4 szt, Krewetka 4szt'
    },
    {
      id: 'set-2',
      name: 'Zestaw 2 „Trio”',
      price: '105 PLN',
      desc: '24 szt: Philadelphia Łosoś 8, Unagi Węgorz 8, Futomak surimi i łosoś 8'
    },
    {
      id: 'set-3',
      name: 'Zestaw 3 „Tempura”',
      price: '150 PLN',
      desc: '32 szt: Węgorz w panko 8, Łosoś w panko 8, Krewetka w panko 8, Philadelphia opiekana 8'
    },
    {
      id: 'set-4',
      name: 'Zestaw 4 „Philadelphia”',
      price: '160 PLN',
      desc: '32 szt: Philadelphia Krewetka 8, Philadelphia Węgorz 8, Philadelphia Łosoś 8, Philadelphia Tuńczyk 8'
    },
    {
      id: 'set-5',
      name: 'Zestaw 5 „MAKI”',
      price: '100 PLN',
      desc: '36 szt: Hosomak Łosoś, Węgorz, Surimi, Ogórek, Żółta rzepa, Kanpyo — po 6 szt'
    },
    {
      id: 'set-6',
      name: 'Zestaw 6 „Absolute”',
      price: '200 PLN',
      desc: '46 szt: Unagi 8, Phila opiekana 8, Phila łosoś 8, Futo tuńczyk panko 8, Futo tartar panko 8, Hosomak łosoś 6'
    },
    {
      id: 'set-7',
      name: 'Zestaw 7 „Weekend”',
      price: '295 PLN',
      desc: '70 szt: Kalifornia węgorz w sezam 8szt, Kalifornia łosoś w tobiko 8szt, Uramak z łososiem w środku 8szt, Futomak węgorz w panko 8szt, Futomak tartar z łososia w panko 8szt, Futomak z tuńczykiem w panko 8szt, Hosomak łosoś 6szt, Hosomak ogórek 6szt, Hosomak kampyo 6szt, Nigiri łosoś 2 szt, Nigiri tuńczyk 2 szt'
    },
    {
      id: 'set-8',
      name: 'Zestaw 8 „Kalifornia”',
      price: '150 PLN',
      desc: '32 szt: Kalifornia łosoś tobiko 8, Kalifornia krewetki tobiko 8, Kalifornia tuńczyk sezam 8, Kalifornia węgorz sezam 8'
    },
    {
      id: 'set-9',
      name: 'Zestaw 9 „Mix”',
      price: '110 PLN',
      desc: '28 szt: Tartar łosoś panko 8, Phila łosoś i surimi 8, Hosomak łosoś 6, Hosomak węgorz 6'
    },
    {
      id: 'set-10',
      name: 'Zestaw 10 „Tokio”',
      price: '160 PLN',
      desc: '32 szt: Tartar łosoś panko 8, Tuńczyk panko 8, Philadelphia XL 8, Unagi węgorz 8'
    },
    {
      id: 'set-11',
      name: 'Zestaw 11 „Family”',
      price: '320 PLN',
      desc: '82 szt: Futomak krewetka w panko 8 szt, Tartar z łososia w panko 8szt, Pieczony tuńczyk w panko 8szt, Philadelphia losoś 8 szt, Philadelphia węgorz 8 szt, Kalifornia z łososiem w tobiko 8 szt, Kalifornia z węgorzem w sezam 8szt, Futomak z tuńczykiem w środku 8szt, Hosomak ogórek 6szt, Hosomak żółta rzepa 6szt, Hosomak surmi 6szt'
    },
    {
      id: 'set-12',
      name: 'Zestaw 12 „Kombo”',
      price: '140 PLN',
      desc: '32 szt: Phila łosoś 8, Phila krewetka 8, Kalifornia łosoś 8, Kalifornia węgorz 8'
    },
    {
      id: 'set-13',
      name: 'Zestaw 13 „Hit”',
      price: '115 PLN',
      desc: '24 szt: Phila łosoś 8, Kalifornia łosoś 8, Futomak tuńczyk panko 8'
    },
    {
      id: 'set-14',
      name: 'Zestaw 14 „Topchik”',
      price: '140 PLN',
      desc: '32 szt: Kalifornia łosoś 8, Phila łosoś 8, Futomak tuńczyk panko 8, Łosoś w panko 8'
    },
    {
      id: 'set-15',
      name: 'Zestaw 15 „Exotic”',
      price: '170 PLN',
      desc: '32 szt: Philadelphia classic 8, Mango krewetki panko 8, Awokado łosoś 8, Kalifornia węgorz 8'
    }
  ],
  Futomak: [
    { id: 'futo-salmon-center', name: 'Futo z łososiem w środku', price: '38 PLN', desc: 'Ryż, nori, łosoś, philadelphia, ogórek' },
    { id: 'futo-salmon-surimi', name: 'Futo z łososiem i surimi', price: '37 PLN', desc: 'Ryż, nori, surimi, ogórek, łosoś, philadelphia' },
    { id: 'futo-baked-salmon', name: 'Pieczony łosoś', price: '38 PLN', desc: 'Ryż, nori, łosoś pieczony, kanpyo, philadelphia, sezam, teriyaki' },
    { id: 'futo-wege', name: 'Wege', price: '35 PLN', desc: 'Ryż, nori, ogórek, żółta rzepa, kanpyo, philadelphia, sezam, teriyaki' },
    { id: 'futo-eel-panko', name: 'Węgorz w panko', price: '42 PLN', desc: 'Ryż, nori, węgorz pieczony, philadelphia, sezam, teriyaki' },
    { id: 'futo-tuna-panko', name: 'Tuńczyk w panko', price: '39 PLN', desc: 'Ryż, nori, tuńczyk, kanpyo, philadelphia, panko' },
    { id: 'futo-salmon-panko', name: 'Łosoś w panko', price: '39 PLN', desc: 'Ryż, nori, łosoś, ogórek, philadelphia, tempura' },
    { id: 'futo-shrimp-panko', name: 'Z krewetkami w panko', price: '42 PLN', desc: 'Ryż, nori, krewetka, ogórek, żółta rzepa, philadelphia, panko' },
    { id: 'futo-salmon-tartar', name: 'Tartar z łososia', price: '37 PLN', desc: 'Ryż, nori, tartar z łososia, chilli, ogórek, sezam' }
  ],
  'Futomak z serową czapeczką': [
    { id: 'futo-cap-salmon', name: 'Futomak łosoś z serową czapeczką', price: '49 PLN', desc: 'Łosoś, ogórek, ser cheddar, philadelphia, sezam, teriyaki' },
    { id: 'futo-cap-eel', name: 'Futomak węgorz z serową czapeczką', price: '53 PLN', desc: 'Węgorz, ogórek, ser cheddar, philadelphia, sezam, teriyaki' },
    { id: 'futo-cap-shrimp', name: 'Futomak krewetki z serową czapeczką', price: '55 PLN', desc: 'Krewetki, ogórek, ser cheddar, philadelphia, sezam, teriyaki' }
  ],
  Philadelphia: [
    { id: 'phila-classic', name: 'Philadelphia Classic', price: '39 PLN', desc: 'Ryż, nori, łosoś, philadelphia, ogórek' },
    { id: 'phila-shrimp', name: 'Philadelphia Krewetka', price: '42 PLN', desc: 'Ryż, nori, ogórek, philadelphia, krewetka, sezam, teriyaki' },
    { id: 'phila-tuna', name: 'Philadelphia Tuńczyk', price: '39 PLN', desc: 'Ryż, nori, awokado, tuńczyk, philadelphia' },
    { id: 'phila-eel', name: 'Philadelphia Węgorz', price: '40 PLN', desc: 'Ryż, nori, węgorz, ogórek, philadelphia, sezam, teriyaki' },
    { id: 'phila-baked-salmon', name: 'Philadelphia Łosoś opiekany', price: '39 PLN', desc: 'Ryż, nori, łosoś opiekany, kanpyo, sezam, teriyaki, philadelphia' },
    { id: 'phila-avocado', name: 'Philadelphia z awokado', price: '40 PLN', desc: 'Ryż, nori, łosoś, philadelphia, awokado' },
    { id: 'phila-xl', name: 'Philadelphia XL', price: '59 PLN', desc: 'Ryż, nori, podwójny łosoś, ogórek, philadelphia' }
  ],
  Kalifornia: [
    { id: 'cal-salmon-tobiko', name: 'Kalifornia z łososiem w tobiko', price: '39 PLN', desc: 'Łosoś, philadelphia, żółta rzepa, ogórek, tobiko' },
    { id: 'cal-eel-sesame', name: 'Kalifornia z węgorzem w sezamie', price: '39 PLN', desc: 'Węgorz, philadelphia, ogórek, żółta rzepa, sezam' },
    {
      id: 'cal-shrimp-tobiko',
      name: 'Kalifornia z krewetkami w panko',
      price: '40 PLN',
      desc: 'Krewetka, philadelphia, żółta rzepa, ogórek, tobiko'
    },
    { id: 'cal-tuna-sesame', name: 'Kalifornia z tuńczykiem w sezamie', price: '39 PLN', desc: 'Tuńczyk, philadelphia, ogórek, żółta rzepa, sezam' }
  ],
  Uramak: [
    { id: 'ura-unagi', name: 'Unagi', price: '38 PLN', desc: 'Ryż, nori, philadelphia, ogórek, węgorz, teriyaki, sezam' },
    { id: 'ura-tokio', name: 'Tokio', price: '58 PLN', desc: 'Ryż, nori, philadelphia, ogórek, krewetka gotowana, tobiko, łosoś' },
    { id: 'ura-three-rubies', name: 'Trzy ryby', price: '49 PLN', desc: 'Łosoś, tuńczyk, węgorz, awokado, sezam' }
  ],
  Hosomak: [
    { id: 'hoso-tuna', name: 'Hosomak Tuńczyk', price: '24 PLN', desc: 'Ryż, nori, tuńczyk' },
    { id: 'hoso-eel', name: 'Hosomak Węgorz', price: '24 PLN', desc: 'Ryż, nori, węgorz, sezam, teriyaki' },
    { id: 'hoso-salmon', name: 'Hosomak Łosoś', price: '24 PLN', desc: 'Ryż, nori, łosoś' },
    { id: 'hoso-shrimp', name: 'Hosomak Krewetka', price: '25 PLN', desc: 'Ryż, nori, krewetka, sezam, teriyaki' },
    { id: 'hoso-yellow-radish', name: 'Hosomak Żółta rzepa', price: '15 PLN', desc: 'Ryż, nori, żółta rzepa' },
    { id: 'hoso-kanpyo', name: 'Hosomak Kanpyo', price: '15 PLN', desc: 'Ryż, nori, kanpyo' },
    { id: 'hoso-cucumber', name: 'Hosomak Ogórek', price: '15 PLN', desc: 'Ryż, nori, ogórek' },
    { id: 'hoso-surimi', name: 'Hosomak Surimi', price: '15 PLN', desc: 'Ryż, nori, surimi' },
    { id: 'hoso-avocado', name: 'Hosomak Awokado', price: '19 PLN', desc: 'Ryż, nori, awokado' }
  ],
  'Premium rolki': [
    { id: 'prem-salmon-delux', name: 'Łosoś Delux', price: '80 PLN', desc: 'Ryż, nori, łosoś XL, krewetka w panko, majonez japoński' },
    { id: 'prem-dubai', name: 'Roll Dubaj', price: '80 PLN', desc: 'Ryż, nori, łosoś XL, wakame' }
  ],
  'Sushi Burger': [
    { id: 'burger-salmon', name: 'Burger z łososiem', price: '45 PLN', desc: 'Ryż, nori, philadelphia, ogórek, łosoś' },
    { id: 'burger-tuna-wakame', name: 'Burger z tuńczykiem i wakame', price: '45 PLN', desc: 'Ryż, nori, philadelphia, wakame, tuńczyk, teriyaki' },
    { id: 'burger-shrimp-avocado', name: 'Burger z krewetkami i awokado', price: '50 PLN', desc: 'Ryż, nori, philadelphia, krewetka gotowana, awokado, teriyaki, tobiko' }
  ],
  Nigiri: [
    { id: 'nigiri-tuna', name: 'Nigiri Tuńczyk', price: '22 PLN', desc: '2 szt' },
    { id: 'nigiri-salmon', name: 'Nigiri Łosoś', price: '22 PLN', desc: '2 szt' },
    { id: 'nigiri-eel', name: 'Nigiri Węgorz', price: '22 PLN', desc: '2 szt' },
    { id: 'nigiri-shrimp', name: 'Nigiri Krewetki', price: '22 PLN', desc: '2 szt' }
  ],
  'Przystawki / Inne': [
    {
      id: 'shrimp-panko',
      name: 'Krewetki w panko',
      price: '45/55 PLN',
      desc: 'Chrupiące krewetki w panierce panko',
      variantOptions: [
        { key: '6', label: '6 szt', price: '45 PLN' },
        { key: '9', label: '9 szt', price: '55 PLN' }
      ]
    },
    { id: 'fries-large', name: 'Frytki — duże opakowanie', price: '10 PLN', desc: 'Złociste frytki + ketchup' },
    { id: 'gunkan-tuna', name: 'Gunkan Tuńczyk', price: '30 PLN', desc: '2 szt' },
    { id: 'gunkan-salmon', name: 'Gunkan Łosoś', price: '30 PLN', desc: '2 szt' },
    { id: 'gunkan-eel', name: 'Gunkan Węgorz', price: '30 PLN', desc: '2 szt' },
    { id: 'gunkan-shrimp', name: 'Gunkan Krewetki', price: '30 PLN', desc: '2 szt' }
  ],
  Napoje: [
    { id: 'drink-h-033', kind: 'section', name: '0.33 l' },
    {
      id: 'drink-coca-033',
      name: 'Coca-Cola 0.33',
      price: '6 PLN',
      desc: '0.33 l',
      image: DRINK_IMAGES.coca
    },
    {
      id: 'drink-fanta-033',
      name: 'Fanta 0.33',
      price: '6 PLN',
      desc: '0.33 l',
      image: DRINK_IMAGES.fanta
    },
    {
      id: 'drink-sprite-033',
      name: 'Sprite 0.33',
      price: '6 PLN',
      desc: '0.33 l',
      image: DRINK_IMAGES.sprite
    },
    { id: 'drink-h-05', kind: 'section', name: '0.5 l' },
    {
      id: 'drink-coca-05',
      name: 'Coca-Cola 0.5',
      price: '8 PLN',
      desc: '0.5 l',
      image: DRINK_IMAGES.coca
    },
    {
      id: 'drink-fanta-05',
      name: 'Fanta 0.5',
      price: '8 PLN',
      desc: '0.5 l',
      image: DRINK_IMAGES.fanta
    },
    {
      id: 'drink-sprite-05',
      name: 'Sprite 0.5',
      price: '8 PLN',
      desc: '0.5 l',
      image: DRINK_IMAGES.sprite
    },
    {
      id: 'drink-cappy-05',
      name: 'Cappy 0.5',
      price: '8 PLN',
      desc: '0.5 l',
      image: DRINK_IMAGES.cappy
    },
    { id: 'drink-h-085', kind: 'section', name: '0.85 l' },
    {
      id: 'drink-coca-085',
      name: 'Coca-Cola 0.85',
      price: '10 PLN',
      desc: '0.85 l',
      image: DRINK_IMAGES.coca
    },
    {
      id: 'drink-fanta-085',
      name: 'Fanta 0.85',
      price: '10 PLN',
      desc: '0.85 l',
      image: DRINK_IMAGES.fanta
    },
    {
      id: 'drink-sprite-085',
      name: 'Sprite 0.85',
      price: '10 PLN',
      desc: '0.85 l',
      image: DRINK_IMAGES.sprite
    },
    {
      id: 'drink-tea',
      name: 'Herbata',
      price: '10 PLN',
      desc: 'Herbata',
      image: DRINK_IMAGES.tea
    }
  ]
};

for (const key of CATEGORY_KEYS) {
  for (const item of pl[key]) {
    if (item.kind === 'section') continue;
    const image = SET_IMAGES[item.id] ?? ITEM_IMAGES[item.id] ?? item.image;
    if (image) item.image = image;
    else delete item.image;
  }
}

function localizeItem(item, lang) {
  if (lang === 'pl') return { ...item };
  const tr = menuI18n[item.id]?.[lang];
  if (!tr) return { ...item };
  return {
    ...item,
    name: tr.name ?? item.name,
    desc: tr.desc ?? item.desc,
    ...(tr.variantOptions ? { variantOptions: tr.variantOptions } : {})
  };
}

function localizeMenu(menu, lang) {
  const out = {};
  for (const key of CATEGORY_KEYS) {
    out[key] = menu[key].map((item) => localizeItem(item, lang));
  }
  return out;
}

function moveSetCountToName(item, lang) {
  if (!item || item.kind === 'section') return item;

  const cfg =
    lang === 'en'
      ? { unit: 'pcs', re: /^(\d+)\s*pcs:\s*(.+)$/i }
      : lang === 'uk'
        ? { unit: 'шт', re: /^(\d+)\s*шт:\s*(.+)$/i }
        : { unit: 'szt', re: /^(\d+)\s*szt:\s*(.+)$/i };

  const cleanName = String(item.name || '').replace(
    /\s*\(\d+\s*(szt|pcs|шт)\)$/i,
    ''
  );
  const descText = String(item.desc || '').trim();
  const match = descText.match(cfg.re);
  if (!match) {
    return { ...item, name: cleanName };
  }

  const [, count, restDesc] = match;
  return {
    ...item,
    name: `${cleanName} (${count} ${cfg.unit})`,
    desc: restDesc.trim()
  };
}

function normalizeSetPresentation(menu, lang) {
  if (!menu.Zestawy) return menu;
  return {
    ...menu,
    Zestawy: menu.Zestawy.map((item) => moveSetCountToName(item, lang))
  };
}

const out = {
  pl: normalizeSetPresentation(pl, 'pl'),
  en: normalizeSetPresentation(localizeMenu(pl, 'en'), 'en'),
  uk: normalizeSetPresentation(localizeMenu(pl, 'uk'), 'uk')
};

const outPath = path.join(__dirname, '../src/DaneMenu/menuByLang.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`, 'utf8');

const missing = [];
for (const key of CATEGORY_KEYS) {
  for (const item of pl[key]) {
    if (item.kind === 'section') continue;
    if (!menuI18n[item.id]) missing.push(item.id);
  }
}
if (missing.length) {
  console.warn('Missing i18n for ids:', missing.join(', '));
}

console.log('Wrote', outPath);
console.log(
  'Items:',
  CATEGORY_KEYS.map((k) => `${k}: ${pl[k].length}`).join(', ')
);
