/**
 * QR menu and ordering.
 *
 * A table QR opens the menu with the table already identified, so the
 * customer never has to say where they're sitting — which is the single
 * biggest source of friction in every QR menu that doesn't do this.
 */

export type FoodType = "VEG" | "EGG" | "NON_VEG";

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number; // paise
  foodType: FoodType;
  spiceLevel?: number; // 0-3
  isAvailable: boolean;
  isBestseller?: boolean;
  prepMinutes: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
};

export type CartLine = { itemId: string; name: string; price: number; quantity: number; note?: string };

/**
 * GST on restaurant service, added on top of the menu price.
 *
 * This differs from the hardware store deliberately: store prices are listed
 * GST-inclusive and the tax is extracted for the breakdown, whereas menu
 * prices are pre-tax and GST is added at checkout — which is how restaurant
 * bills actually read in India. Don't "fix" one to match the other.
 */
export const TAX_RATE = 5;

export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const tax = Math.round((subtotal * TAX_RATE) / 100);
  return { subtotal, tax, total: subtotal + tax, count: lines.reduce((n, l) => n + l.quantity, 0) };
}

export function orderReference() {
  return `#${Math.floor(1000 + Math.random() * 9000)}`;
}

export const FOOD_LABEL: Record<FoodType, { label: string; color: string }> = {
  VEG: { label: "Veg", color: "#16A34A" },
  EGG: { label: "Egg", color: "#F59E0B" },
  NON_VEG: { label: "Non-veg", color: "#DC2626" },
};

/* ------------------------------ demo menu ------------------------------- */

export const DEMO_MENU: Record<string, MenuCategory[]> = {
  "saffron-co": [
    {
      id: "mc-1",
      name: "Starters",
      description: "Served with mint chutney",
      items: [
        { id: "mi-1", name: "Paneer tikka", description: "Charred, hung curd marinade", price: 32000, foodType: "VEG", spiceLevel: 2, isAvailable: true, isBestseller: true, prepMinutes: 15 },
        { id: "mi-2", name: "Murgh malai kebab", description: "Cream and cardamom", price: 38000, foodType: "NON_VEG", spiceLevel: 1, isAvailable: true, prepMinutes: 18 },
        { id: "mi-3", name: "Dahi ke kebab", description: "Melts, doesn't crumble", price: 29000, foodType: "VEG", spiceLevel: 1, isAvailable: true, prepMinutes: 14 },
        { id: "mi-4", name: "Tandoori mushroom", price: 30000, foodType: "VEG", spiceLevel: 2, isAvailable: false, prepMinutes: 15 },
      ],
    },
    {
      id: "mc-2",
      name: "Mains",
      description: "Portions serve two",
      items: [
        { id: "mi-5", name: "Dal makhani", description: "Twelve hours on low heat", price: 34000, foodType: "VEG", spiceLevel: 1, isAvailable: true, isBestseller: true, prepMinutes: 10 },
        { id: "mi-6", name: "Butter chicken", description: "Tomato, cashew, fenugreek", price: 46000, foodType: "NON_VEG", spiceLevel: 1, isAvailable: true, isBestseller: true, prepMinutes: 20 },
        { id: "mi-7", name: "Kadhai paneer", price: 38000, foodType: "VEG", spiceLevel: 3, isAvailable: true, prepMinutes: 18 },
        { id: "mi-8", name: "Rogan josh", description: "Kashmiri chillies, slow cooked", price: 52000, foodType: "NON_VEG", spiceLevel: 2, isAvailable: true, prepMinutes: 25 },
      ],
    },
    {
      id: "mc-3",
      name: "Breads & rice",
      items: [
        { id: "mi-9", name: "Butter naan", price: 8000, foodType: "VEG", isAvailable: true, prepMinutes: 6 },
        { id: "mi-10", name: "Laccha paratha", price: 9000, foodType: "VEG", isAvailable: true, prepMinutes: 8 },
        { id: "mi-11", name: "Jeera rice", price: 18000, foodType: "VEG", isAvailable: true, prepMinutes: 10 },
        { id: "mi-12", name: "Hyderabadi biryani", description: "Dum, with raita", price: 42000, foodType: "NON_VEG", spiceLevel: 2, isAvailable: true, isBestseller: true, prepMinutes: 25 },
      ],
    },
    {
      id: "mc-4",
      name: "Desserts",
      items: [
        { id: "mi-13", name: "Gulab jamun", description: "Two pieces, warm", price: 14000, foodType: "VEG", isAvailable: true, prepMinutes: 5 },
        { id: "mi-14", name: "Shahi tukda", price: 18000, foodType: "EGG", isAvailable: true, prepMinutes: 8 },
      ],
    },
  ],
};

export const DEMO_TABLES = [
  { id: "tb-1", label: "Table 1", seats: 2, qrCode: "saffron-t1" },
  { id: "tb-2", label: "Table 2", seats: 4, qrCode: "saffron-t2" },
  { id: "tb-7", label: "Table 7", seats: 4, qrCode: "saffron-t7" },
  { id: "tb-12", label: "Terrace 2", seats: 6, qrCode: "saffron-t12" },
];

export async function getMenu(slug: string): Promise<MenuCategory[]> {
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const business = await prisma.business.findUnique({ where: { slug }, select: { id: true } });
      if (business) {
        const categories = await prisma.menuCategory.findMany({
          where: { businessId: business.id, isActive: true },
          orderBy: { sortOrder: "asc" },
          include: { items: { orderBy: { sortOrder: "asc" } } },
        });

        if (categories.length) {
          return categories.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description ?? undefined,
            items: c.items.map((i) => ({
              id: i.id,
              name: i.name,
              description: i.description ?? undefined,
              price: i.price,
              foodType: i.foodType as FoodType,
              spiceLevel: i.spiceLevel ?? undefined,
              isAvailable: i.isAvailable,
              isBestseller: i.isBestseller,
              prepMinutes: i.prepMinutes,
            })),
          }));
        }
      }
    } catch (err) {
      console.warn("[menu] database unreachable, using demo menu:", err);
    }
  }
  if (DEMO_MENU[slug]) return DEMO_MENU[slug];

  // Only food businesses get the sample menu — a salon shouldn't have one.
  const { industryBusinessBySlug } = await import("./demo-businesses");
  const business = industryBusinessBySlug(slug);
  const foodish = ["RESTAURANT", "CAFE", "HOTEL"];

  return business && foodish.includes(business.category) ? DEMO_MENU["saffron-co"] : [];
}
