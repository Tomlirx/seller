"use client";

import Link from "next/link";
import { PRODUCT_CATEGORIES, ProductCategoryValue } from "@/lib/categories";

export function CollectionFilters({ active }: { active?: ProductCategoryValue }) {
  return (
    <aside className="flex flex-col gap-6">
      <div>
        <p className="text-sm tracking-widest text-ink mb-3">品类 CATEGORIES</p>
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              href="/collections"
              className={`text-sm transition-colors ${
                !active ? "text-gold" : "text-ink-soft hover:text-gold"
              }`}
            >
              全部 All
            </Link>
          </li>
          {PRODUCT_CATEGORIES.filter((c) => c.value !== "OTHER").map((c) => (
            <li key={c.value}>
              <Link
                href={`/collections/${c.value}`}
                className={`text-sm transition-colors ${
                  active === c.value ? "text-gold" : "text-ink-soft hover:text-gold"
                }`}
              >
                {c.zh} {c.en}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
