export const PRODUCT_CATEGORIES = [
  { value: "BUDDHA", zh: "佛公", en: "Buddha", description: "护身佑福，庄严慈悲" },
  { value: "GUANYIN", zh: "观音", en: "Guanyin", description: "慈悲护佑，平安吉祥" },
  { value: "FORTUNE_BEAN", zh: "福豆", en: "Fortune Bean", description: "福气满满，好运相随" },
  { value: "LEAF", zh: "叶子", en: "Leaf", description: "生生不息，叶叶平安" },
  { value: "RUYI", zh: "如意", en: "Ruyi", description: "万事如意，心愿得偿" },
  { value: "BANGLE", zh: "手镯", en: "Bangle", description: "温润贴身，岁月相伴" },
  { value: "OTHER", zh: "其他", en: "Other", description: "" },
] as const;

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number]["value"];

export const PRODUCT_CATEGORY_VALUES = PRODUCT_CATEGORIES.map((c) => c.value) as [
  ProductCategoryValue,
  ...ProductCategoryValue[],
];

export function categoryLabel(value: string) {
  return PRODUCT_CATEGORIES.find((c) => c.value === value) ?? null;
}
