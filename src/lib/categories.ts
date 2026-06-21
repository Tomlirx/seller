export const PRODUCT_CATEGORIES = [
  { value: "BUDDHA", zh: "佛公", en: "Buddha" },
  { value: "GUANYIN", zh: "观音", en: "Guanyin" },
  { value: "FORTUNE_BEAN", zh: "福豆", en: "Fortune Bean" },
  { value: "LEAF", zh: "叶子", en: "Leaf" },
  { value: "RUYI", zh: "如意", en: "Ruyi" },
  { value: "BANGLE", zh: "手镯", en: "Bangle" },
  { value: "OTHER", zh: "其他", en: "Other" },
] as const;

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number]["value"];

export const PRODUCT_CATEGORY_VALUES = PRODUCT_CATEGORIES.map((c) => c.value) as [
  ProductCategoryValue,
  ...ProductCategoryValue[],
];

export function categoryLabel(value: string) {
  return PRODUCT_CATEGORIES.find((c) => c.value === value) ?? null;
}
