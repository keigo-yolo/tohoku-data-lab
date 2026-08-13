/*
DATA TOHOKU — public statistics used by the dashboard.

Sources
1) Statistics Bureau of Japan
   2025 Population Census, Preliminary Population Counts
   https://www.stat.go.jp/data/kokusei/2025/kekka/pdf/outline.pdf

2) Tohoku District Transport Bureau / Japan Tourism Agency
   2025 Accommodation Travel Statistics
   https://wwwtb.mlit.go.jp/tohoku/content/000371363.pdf

Notes
- population: population as of 2025-10-01, preliminary census count.
- populationChange: population change rate from 2020 to 2025.
- density: population density in 2025.
- foreignNights: foreign guest nights, Jan-Dec 2025 cumulative.
- foreignNightsGrowth: change from Jan-Dec 2024.
- Accommodation figures use monthly second preliminary figures.
*/
window.TOHOKU_DATA = {
  meta: {
    population: {
      label: "人口",
      shortLabel: "POPULATION",
      period: "2025",
      unit: "人",
      description: "2025年10月1日現在・国勢調査人口速報集計",
      source: "総務省統計局「令和7年国勢調査 人口速報集計」",
      url: "https://www.stat.go.jp/data/kokusei/2025/kekka/pdf/outline.pdf",
      note: "人口規模",
      decimals: 0
    },
    populationChange: {
      label: "人口増減率",
      shortLabel: "POP. CHANGE",
      period: "2020 → 2025",
      unit: "%",
      description: "2020年国勢調査から2025年人口速報集計までの増減率",
      source: "総務省統計局「令和7年国勢調査 人口速報集計」",
      url: "https://www.stat.go.jp/data/kokusei/2025/kekka/pdf/outline.pdf",
      note: "0%に近いほど減少幅が小さい",
      decimals: 1
    },
    density: {
      label: "人口密度",
      shortLabel: "DENSITY",
      period: "2025",
      unit: "人/km²",
      description: "2025年人口速報集計の人口密度",
      source: "総務省統計局「令和7年国勢調査 人口速報集計」",
      url: "https://www.stat.go.jp/data/kokusei/2025/kekka/pdf/outline.pdf",
      note: "人口密度",
      decimals: 1
    },
    foreignNights: {
      label: "外国人延べ宿泊者数",
      shortLabel: "FOREIGN NIGHTS",
      period: "2025",
      unit: "人泊",
      description: "2025年1月〜12月累計・各月第2次速報値",
      source: "東北運輸局／観光庁「宿泊旅行統計調査」",
      url: "https://wwwtb.mlit.go.jp/tohoku/content/000371363.pdf",
      note: "外国人延べ宿泊者数",
      decimals: 0
    },
    foreignNightsGrowth: {
      label: "外国人宿泊 前年比",
      shortLabel: "YOY",
      period: "2025 vs 2024",
      unit: "%",
      description: "2025年1月〜12月累計の2024年同期比",
      source: "東北運輸局／観光庁「宿泊旅行統計調査」",
      url: "https://wwwtb.mlit.go.jp/tohoku/content/000371363.pdf",
      note: "前年比",
      decimals: 1
    }
  },
  prefectures: [
    { id:"aomori",    name:"青森県", en:"AOMORI",    population:1140395, populationChange:-7.9, density:118.2, foreignNights:522180,  foreignNightsGrowth:26.4 },
    { id:"iwate",     name:"岩手県", en:"IWATE",     population:1125502, populationChange:-7.0, density:73.7,  foreignNights:429120,  foreignNightsGrowth:11.1 },
    { id:"miyagi",    name:"宮城県", en:"MIYAGI",    population:2227240, populationChange:-3.2, density:305.8, foreignNights:1003880, foreignNightsGrowth:29.3 },
    { id:"akita",     name:"秋田県", en:"AKITA",     population:882100,  populationChange:-8.1, density:75.8,  foreignNights:145040,  foreignNightsGrowth:21.2 },
    { id:"yamagata",  name:"山形県", en:"YAMAGATA",  population:993127,  populationChange:-7.0, density:106.5, foreignNights:291950,  foreignNightsGrowth:14.0 },
    { id:"fukushima", name:"福島県", en:"FUKUSHIMA", population:1711937, populationChange:-6.6, density:124.2, foreignNights:380190,  foreignNightsGrowth:17.3 }
  ]
};
