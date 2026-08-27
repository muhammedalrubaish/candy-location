"use client";

/* ============================================================
   تطبيق «موقع الحلا | كاندي لوكيشن»
   نفس فكرة وبنية وتصميم تطبيق «بايتيو» بالكامل
   (شاشات، سلة، عروض، نقاط، محفظة، حساب) مع ألوان هوية كاندي لوكيشن.
   ============================================================ */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import "./app.css";

/* ── الأنواع ── */
interface OptChoice { name: string; price: number }
interface OptGroup { title: string; max: number; choices: OptChoice[] }
interface Product {
  id: number;
  cat: string;
  name: string;
  desc: string;
  price: number;
  cal: number;
  rating: number;
  emoji: string;
  badge?: string;
  opts?: OptGroup[];
}
interface CartItem {
  key: string;
  id: number;
  name: string;
  emoji: string;
  price: number;
  qty: number;
  customLabel?: string;
}
interface PastOrder {
  id: number;
  items: { name: string; qty: number }[];
  total: number;
  date: string;
  status: "pending" | "delivered";
}
type Tab = "home" | "orders" | "offers" | "points" | "profile";

/* ── الأقسام ── */
const CATEGORIES = [
  { key: "sweets", name: "حلا وكيك", emoji: "🍫" },
  { key: "vine", name: "ورق عنب", emoji: "🍃" },
  { key: "families", name: "أسر منتجة", emoji: "🍰" },
  { key: "savory", name: "موالح", emoji: "🥨" },
  { key: "popcorn", name: "فشار", emoji: "🍿" },
  { key: "drinks", name: "مشروبات", emoji: "🧋" },
];

const SIZE_GROUP: OptGroup = {
  title: "اختر الحجم",
  max: 1,
  choices: [
    { name: "وسط", price: 0 },
    { name: "كبير (عائلي)", price: 15 },
  ],
};
const EXTRAS_GROUP: OptGroup = {
  title: "إضافات كاندي",
  max: 3,
  choices: [
    { name: "صوص شوكولاتة بلجيكي", price: 5 },
    { name: "مكسرات مشكلة", price: 7 },
    { name: "كراميل مملح", price: 5 },
  ],
};
const DRINK_GROUP: OptGroup = {
  title: "أضف مشروب",
  max: 1,
  choices: [
    { name: "موهيتو بلوبيري", price: 12 },
    { name: "ليمون بالنعناع", price: 10 },
    { name: "ماء بارد", price: 2 },
  ],
};

/* ── قائمة الأصناف ── */
const MENU: Product[] = [
  { id: 1, cat: "sweets", name: "بوكس حلا الجمعات الملكي", desc: "تشكيلة فاخرة من الكيك والكراميل والشوكولاتة البلجيكية", price: 65, cal: 520, rating: 4.9, emoji: "🍫", badge: "الأكثر طلباً", opts: [SIZE_GROUP, EXTRAS_GROUP, DRINK_GROUP] },
  { id: 2, cat: "sweets", name: "تشيز كيك التوت الطازج", desc: "قاعدة بسكويت مقرمشة مع كريمة الجبن وصوص التوت", price: 42, cal: 430, rating: 4.8, emoji: "🍰", badge: "مميز", opts: [SIZE_GROUP, EXTRAS_GROUP] },
  { id: 3, cat: "sweets", name: "تارت الفراولة والشوكولاتة", desc: "تارت مقرمش بحشوة الكريمة والفراولة الطازجة", price: 38, cal: 390, rating: 4.7, emoji: "🍓", opts: [EXTRAS_GROUP] },
  { id: 4, cat: "sweets", name: "كنافة نابلسية بالقشطة", desc: "كنافة ذهبية بالسمن البلدي وقطر الزعفران", price: 45, cal: 610, rating: 4.9, emoji: "🥮", badge: "توصية الشيف", opts: [SIZE_GROUP] },
  { id: 5, cat: "vine", name: "ورق عنب بدبس الرمان", desc: "ورق عنب ذائب محشو بالخلطة الخاصة مع صوص الرمان", price: 38, cal: 340, rating: 4.8, emoji: "🍃", badge: "الأكثر طلباً", opts: [SIZE_GROUP] },
  { id: 6, cat: "vine", name: "ورق عنب باللحم", desc: "محشي على نار هادئة بلحم بلدي طري ونكهة الليمون", price: 48, cal: 460, rating: 4.7, emoji: "🫒", opts: [SIZE_GROUP] },
  { id: 7, cat: "vine", name: "ملفوف حامض حلو", desc: "ملفوف طري مستوي على نار هادئة بخلطة دبس الرمان", price: 36, cal: 310, rating: 4.6, emoji: "🥬" },
  { id: 8, cat: "families", name: "كيكة الزعفران اللذيذة", desc: "كيكة إسفنجية مسقية بحليب الزعفران الفاخر من أسر منتجة", price: 45, cal: 460, rating: 4.9, emoji: "🧁", badge: "أسر منتجة", opts: [SIZE_GROUP, EXTRAS_GROUP] },
  { id: 9, cat: "families", name: "معمول التمر البيتي", desc: "معمول طري محشو بعجوة المدينة — صناعة أسر منتجة", price: 32, cal: 380, rating: 4.8, emoji: "🍪", badge: "أسر منتجة" },
  { id: 10, cat: "families", name: "بسبوسة القشطة", desc: "بسبوسة هشة بالقشطة الطازجة وجوز الهند", price: 28, cal: 420, rating: 4.6, emoji: "🍮" },
  { id: 11, cat: "savory", name: "ميني ساندوتش وموالح مشكلة", desc: "بوكس موالح مشكل: ميني برجر، شاورما، وفطاير طازجة", price: 55, cal: 410, rating: 4.8, emoji: "🥨", badge: "جديد", opts: [SIZE_GROUP, DRINK_GROUP] },
  { id: 12, cat: "savory", name: "سمبوسة الجبن المقرمشة", desc: "سمبوسة ذهبية بحشوة الجبن الذائب والزعتر", price: 26, cal: 300, rating: 4.7, emoji: "🥟" },
  { id: 13, cat: "savory", name: "فطاير مشكلة (12 قطعة)", desc: "جبن، زعتر، لحم بعجين وسبانخ — طازجة يومياً", price: 40, cal: 520, rating: 4.7, emoji: "🥐", opts: [DRINK_GROUP] },
  { id: 14, cat: "popcorn", name: "فشار كاندي سولتد كراميل", desc: "فشار مقرمش مغطى بطبقة غنية من الكراميل المملح", price: 18, cal: 220, rating: 4.8, emoji: "🍿", badge: "مفضل الصغار", opts: [SIZE_GROUP] },
  { id: 15, cat: "popcorn", name: "فشار الشوكولاتة الغامقة", desc: "فشار بطبقة شوكولاتة داكنة ورشة ملح البحر", price: 20, cal: 260, rating: 4.6, emoji: "🍫" },
  { id: 16, cat: "drinks", name: "موهيتو بلوبيري منعش", desc: "توت أزرق طبيعي مع الليمون والنعناع الطازج", price: 16, cal: 140, rating: 4.7, emoji: "🧋" },
  { id: 17, cat: "drinks", name: "قهوة كاندي المختصة", desc: "حبوب مختصة بتحميص وسط مع لمسة كراميل", price: 14, cal: 90, rating: 4.8, emoji: "☕" },
  { id: 18, cat: "drinks", name: "ليمون بالنعناع", desc: "عصير ليمون طازج مخفوق بالنعناع والثلج", price: 12, cal: 110, rating: 4.6, emoji: "🍹" },
];

/* ── شرائح الواجهة الرئيسية ── */
const BANNERS = [
  { id: 1, tag: "🔥 عرض اليوم", title: "بوكس حلا الجمعات", sub: "تشكيلة الكيك والشوكولاتة بـ 65 ريال فقط", btn: "اطلب الآن", emoji: "🍫", itemId: 1 },
  { id: 2, tag: "⭐ الأكثر طلباً", title: "ورق عنب بدبس الرمان", sub: "طعم بيتي أصيل من مطبخ كاندي لوكيشن", btn: "اكتشف", emoji: "🍃", itemId: 5 },
  { id: 3, tag: "🆕 جديد في القائمة", title: "بوكس الموالح المشكل", sub: "ميني برجر وشاورما وفطاير طازجة", btn: "جرّب الآن", emoji: "🥨", itemId: 11 },
];

/* ── العروض ── */
const OFFERS = [
  { id: 1, itemId: 1, title: "بوكس حلا الجمعات الشامل", desc: "تشكيلة كيك وشوكولاتة وكراميل + مشروبين باردين للعائلة", price: 79, oldPrice: 105, badge: "🔥 الأكثر توفيراً", tag: "وفر 25%", emoji: "🍫" },
  { id: 2, itemId: 5, title: "عرض ورق العنب العائلي", desc: "صحن ورق عنب كبير بدبس الرمان + ملفوف حامض حلو", price: 65, oldPrice: 84, badge: "كلاسيك أصيل", tag: "وفر 22%", emoji: "🍃" },
  { id: 3, itemId: 11, title: "بوكس الموالح والفطاير", desc: "ميني ساندوتش وفطاير مشكلة تكفي 4 أشخاص مع المشروبات", price: 85, oldPrice: 110, badge: "جديد وحصري", tag: "عرض خاص", emoji: "🥨" },
  { id: 4, itemId: 8, title: "ركن الأسر المنتجة", desc: "كيكة الزعفران + معمول التمر البيتي بسعر مخفّض", price: 68, oldPrice: 89, badge: "دعم الأسر المنتجة", tag: "توفير مميز", emoji: "🧁" },
  { id: 5, itemId: 14, title: "بوكس الفشار المشكل", desc: "كراميل مملح + شوكولاتة داكنة + جبن — ثلاث نكهات", price: 39, oldPrice: 56, badge: "توفير 30%", tag: "وفر 30%", emoji: "🍿" },
];

/* ── الفروع ── */
const BRANCHES = [
  { name: "الفرع الرئيسي — حي المروج", addr: "طريق الملك عبدالعزيز", open: "مفتوح حتى 12:00 ص", phone: "0579772057" },
  { name: "فرع حي الياسمين", addr: "شارع أنس بن مالك", open: "مفتوح حتى 12:30 ص", phone: "0579772057" },
  { name: "فرع حي الروضة", addr: "شارع حفصة بنت عمر", open: "مفتوح حتى 1:00 ص", phone: "0579772057" },
  { name: "التوصيل السريع — المستودع المركزي", addr: "تغطية جميع الأحياء", open: "توصيل فوري بالمناديب", phone: "0579772057" },
];

const ADDRESSES = [
  "المنزل — حي المروج، الرياض",
  "العمل — حي العليا، الرياض",
  "حي الياسمين، الرياض",
  "حي الروضة، الرياض",
];

const DELIVERY_FEE = 10;
const COUPON_VALUE = 15;
const POINTS_DISCOUNT = 20;
const CURRENCY = "ريال";

const LS = {
  user: "candy_user_v1",
  cart: "candy_cart_v1",
  wallet: "candy_wallet_v1",
  points: "candy_points_v1",
  orders: "candy_orders_v1",
  welcome: "candy_welcome_seen_v1",
};

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* تجاهل */ }
}

const Chev = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size} height={size}><polyline points="15 18 9 12 15 6" /></svg>
);

export default function CandyApp() {
  /* ── حالة عامة ── */
  const [splashGone, setSplashGone] = useState(false);
  const [ready, setReady] = useState(false);

  const [user, setUser] = useState<{ phone: string; name: string; gender: string } | null>(null);
  const [authStep, setAuthStep] = useState<"phone" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("male");

  const [tab, setTab] = useState<Tab>("home");
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">("delivery");
  const [branch, setBranch] = useState(BRANCHES[0].name);
  const [address, setAddress] = useState(ADDRESSES[0]);
  const [catFilter, setCatFilter] = useState("all");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponApplied, setCouponApplied] = useState(false);
  const [pointsUsed, setPointsUsed] = useState(false);
  const [note, setNote] = useState("");

  const [wallet, setWallet] = useState(0);
  const [points, setPoints] = useState(0);
  const [orders, setOrders] = useState<PastOrder[]>([]);

  const [modal, setModal] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  /* حالة نافذة الصنف */
  const [currentItem, setCurrentItem] = useState<Product | null>(null);
  const [chosen, setChosen] = useState<Record<string, string[]>>({});
  const [qty, setQty] = useState(1);

  /* البحث */
  const [query, setQuery] = useState("");
  const [searchCat, setSearchCat] = useState("all");
  const searchRef = useRef<HTMLInputElement>(null);

  /* شحن المحفظة */
  const [topupAmount, setTopupAmount] = useState(100);

  /* شرائح البانر */
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannersRef = useRef<HTMLDivElement>(null);

  const [lastOrderId, setLastOrderId] = useState<number | null>(null);

  /* ── تحميل الحالة المحفوظة ── */
  useEffect(() => {
    setUser(readLS(LS.user, null));
    setCart(readLS<CartItem[]>(LS.cart, []));
    setWallet(readLS(LS.wallet, 0));
    setPoints(readLS(LS.points, 120));
    setOrders(readLS<PastOrder[]>(LS.orders, []));
    setReady(true);
    const t = setTimeout(() => setSplashGone(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { if (ready) writeLS(LS.cart, cart); }, [cart, ready]);
  useEffect(() => { if (ready) writeLS(LS.wallet, wallet); }, [wallet, ready]);
  useEffect(() => { if (ready) writeLS(LS.points, points); }, [points, ready]);
  useEffect(() => { if (ready) writeLS(LS.orders, orders); }, [orders, ready]);

  /* نافذة الترحيب بالكوبون لأول مرة بعد الدخول */
  useEffect(() => {
    if (!ready || !user || !splashGone) return;
    if (readLS(LS.welcome, false)) return;
    const t = setTimeout(() => { setModal("welcome"); writeLS(LS.welcome, true); }, 900);
    return () => clearTimeout(t);
  }, [ready, user, splashGone]);

  /* ── رسائل التنبيه ── */
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  /* ── حسابات السلة ── */
  const subTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const fee = cart.length === 0 || deliveryMode === "pickup" ? 0 : DELIVERY_FEE;
  const discount = couponApplied ? COUPON_VALUE : 0;
  const pointsDisc = pointsUsed ? POINTS_DISCOUNT : 0;
  const grandTotal = Math.max(0, subTotal + fee - discount - pointsDisc);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  /* ── حالة الفرع (يفتح 10 صباحاً ويغلق 1 فجراً) ── */
  const [branchOpen, setBranchOpen] = useState(true);
  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      setBranchOpen(h >= 10 || h < 1);
    };
    check();
    const t = setInterval(check, 60000);
    return () => clearInterval(t);
  }, []);

  /* ── تسجيل الدخول ── */
  const submitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 9) { showToast("❌ أدخل رقم جوال صحيح"); return; }
    setAuthStep("profile");
  };
  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().split(" ").length < 2) { showToast("❌ اكتب الاسم الثنائي من فضلك"); return; }
    const u = { phone: phone.startsWith("0") ? phone : "0" + phone, name: fullName.trim(), gender };
    setUser(u);
    writeLS(LS.user, u);
    setAuthStep("phone");
    showToast(`🎉 أهلاً بك ${u.name.split(" ")[0]} في كاندي لوكيشن`);
  };
  const logout = () => {
    setUser(null);
    try { window.localStorage.removeItem(LS.user); } catch { /* تجاهل */ }
    setModal(null);
    setEditOpen(false);
    setTab("home");
  };

  /* ── نافذة الصنف ── */
  const openItem = (id: number) => {
    const item = MENU.find((m) => m.id === id);
    if (!item) return;
    setCurrentItem(item);
    setChosen({});
    setQty(1);
    setModal("item");
  };

  const toggleChoice = (group: OptGroup, choice: OptChoice) => {
    setChosen((prev) => {
      const cur = prev[group.title] || [];
      const has = cur.includes(choice.name);
      let next: string[];
      if (has) next = cur.filter((c) => c !== choice.name);
      else if (group.max === 1) next = [choice.name];
      else if (cur.length >= group.max) { showToast(`الحد الأقصى ${group.max} من «${group.title}»`); return prev; }
      else next = [...cur, choice.name];
      return { ...prev, [group.title]: next };
    });
  };

  const optsExtra = useMemo(() => {
    if (!currentItem?.opts) return { price: 0, label: "" };
    let price = 0;
    const labels: string[] = [];
    currentItem.opts.forEach((g) => {
      (chosen[g.title] || []).forEach((name) => {
        const c = g.choices.find((x) => x.name === name);
        if (c) { price += c.price; labels.push(c.name); }
      });
    });
    return { price, label: labels.join("، ") };
  }, [currentItem, chosen]);

  const modalTotal = currentItem ? (currentItem.price + optsExtra.price) * qty : 0;

  const addToCartFromModal = () => {
    if (!currentItem) return;
    const unit = currentItem.price + optsExtra.price;
    const key = `${currentItem.id}|${optsExtra.label}`;
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.key === key);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { key, id: currentItem.id, name: currentItem.name, emoji: currentItem.emoji, price: unit, qty, customLabel: optsExtra.label || undefined }];
    });
    setModal(null);
    showToast(`✅ تمت إضافة ${currentItem.name} إلى السلة`);
  };

  const quickAdd = (id: number) => {
    const item = MENU.find((m) => m.id === id);
    if (!item) return;
    const key = `${item.id}|`;
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.key === key);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { key, id: item.id, name: item.name, emoji: item.emoji, price: item.price, qty: 1 }];
    });
    showToast(`✅ ${item.name} أُضيف للسلة`);
  };

  const changeCartQty = (idx: number, delta: number) => {
    setCart((prev) => {
      const copy = [...prev];
      const it = copy[idx];
      if (!it) return prev;
      const q = it.qty + delta;
      if (q <= 0) copy.splice(idx, 1);
      else copy[idx] = { ...it, qty: q };
      return copy;
    });
  };

  const clearCart = () => {
    if (!cart.length) return;
    setCart([]);
    setCouponApplied(false);
    setPointsUsed(false);
    showToast("🗑️ تم تفريغ السلة");
  };

  /* ── إتمام الطلب ── */
  const placeOrder = () => {
    if (!cart.length) return;
    const id = 1000 + orders.length + Math.floor(Math.random() * 90);
    const order: PastOrder = {
      id,
      items: cart.map((c) => ({ name: c.name, qty: c.qty })),
      total: grandTotal,
      date: new Date().toISOString(),
      status: "pending",
    };
    setOrders((prev) => [order, ...prev]);
    setPoints((p) => p - (pointsUsed ? 200 : 0) + Math.round(grandTotal / 2));
    setCart([]);
    setCouponApplied(false);
    setPointsUsed(false);
    setNote("");
    setLastOrderId(id);
    setModal("success");
  };

  const reorder = (o: PastOrder) => {
    const items: CartItem[] = [];
    o.items.forEach((line) => {
      const p = MENU.find((m) => m.name === line.name);
      if (p) items.push({ key: `${p.id}|`, id: p.id, name: p.name, emoji: p.emoji, price: p.price, qty: line.qty });
    });
    if (!items.length) { showToast("❌ تعذّر إعادة الطلب"); return; }
    setCart(items);
    setTab("orders");
    showToast("🔄 تمت إعادة إضافة الطلب للسلة");
  };

  const cancelOrder = (id: number) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    showToast(`✅ تم إلغاء طلب #${id}`);
  };

  /* ── المحفظة ── */
  const doTopup = () => {
    setWallet((w) => w + topupAmount);
    setModal(null);
    showToast(`✅ تم شحن ${topupAmount} ${CURRENCY} إلى محفظتك`);
  };

  /* ── البحث ── */
  const searchResults = useMemo(() => {
    const q = query.trim();
    return MENU
      .filter((m) => searchCat === "all" || m.cat === searchCat)
      .filter((m) => !q || m.name.includes(q) || m.desc.includes(q));
  }, [query, searchCat]);

  const homeItems = useMemo(
    () => (catFilter === "all" ? MENU : MENU.filter((m) => m.cat === catFilter)),
    [catFilter]
  );

  const onBannerScroll = () => {
    const el = bannersRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setBannerIdx(Math.abs(i) % BANNERS.length);
  };

  const activeOrder = orders.find((o) => o.status === "pending");

  /* ── بطاقة صنف ── */
  const ItemCard = ({ item }: { item: Product }) => (
    <div className="item-card" onClick={() => openItem(item.id)}>
      <div className="item-info">
        <h4 className="item-name">{item.name}</h4>
        <p className="item-desc">{item.desc}</p>
        <div className="item-footer">
          <span className="item-price">{item.price} {CURRENCY}</span>
          <button className="add-btn" title="إضافة للسلة" onClick={(e) => { e.stopPropagation(); quickAdd(item.id); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        </div>
      </div>
      <div className="item-img-wrap">
        <div className="item-img-placeholder">{item.emoji}</div>
        {item.badge && <span className="item-badge">{item.badge}</span>}
      </div>
    </div>
  );

  /* ============================================================
     الواجهة
     ============================================================ */
  return (
    <>
      {/* شاشة البداية */}
      <div className={`splash ${splashGone ? "hide" : ""}`}>
        <Image src="/logo.webp" alt="كاندي لوكيشن" width={220} height={220} className="splash-logo" priority style={{ borderRadius: 36, objectFit: "cover", width: "56%", height: "auto", maxWidth: 240 }} />
        <div className="splash-loader"><span /><span /><span /></div>
      </div>

      {/* شاشة تسجيل الدخول */}
      <div className={`auth-screen ${ready && !user ? "open" : ""}`}>
        <div className="auth-bg-deco" />
        <div className="auth-card">
          <Image src="/logo.webp" alt="كاندي لوكيشن" width={120} height={120} className="auth-logo" style={{ borderRadius: 28, objectFit: "cover" }} />
          <h2 className="auth-title">مرحباً بك في كاندي لوكيشن <span className="ico">👋</span></h2>
          <p className="auth-sub">{authStep === "phone" ? "أدخل رقم جوالك للمتابعة والطلب" : "أكمل بياناتك لتجربة أفضل"}</p>

          {authStep === "phone" ? (
            <form className="auth-phone-form" onSubmit={submitPhone}>
              <input type="tel" className="auth-phone-input" placeholder="5xxxxxxxx" inputMode="numeric" maxLength={10}
                     value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} required />
              <button type="submit" className="btn-primary">تسجيل الدخول</button>
            </form>
          ) : (
            <form className="auth-phone-form" onSubmit={submitProfile}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text)", textAlign: "right", margin: "0 0 4px" }}>الاسم الثنائي *</label>
              <input type="text" className="auth-phone-input" placeholder="مثال: محمد الربيش" style={{ marginBottom: 10 }}
                     value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text)", textAlign: "right", margin: "8px 0 4px" }}>تحديد الجنس *</label>
              <div className="gender-select-wrap">
                <button type="button" className={`gender-opt ${gender === "male" ? "active" : ""}`} onClick={() => setGender("male")}><span>👨</span> <span>ذكر</span></button>
                <button type="button" className={`gender-opt ${gender === "female" ? "active" : ""}`} onClick={() => setGender("female")}><span>👩</span> <span>أنثى</span></button>
              </div>
              <button type="submit" className="btn-primary">حفظ ومتابعة إلى كاندي <span className="ico">🚀</span></button>
            </form>
          )}

          <p className="auth-terms">بمتابعتك توافق على <a href="https://candylocation.com/" target="_blank" rel="noopener noreferrer">شروط الاستخدام</a> و<a href="https://candylocation.com/" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a></p>
        </div>
      </div>

      {/* هيكل التطبيق */}
      <div id="app">
        <div className="status-bar" />

        <div id="screens">
          {/* ==================== الرئيسية ==================== */}
          <div className={`screen ${tab === "home" ? "active" : ""}`} id="screen-home">
            <div className="home-header">
              <div className="header-top">
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button className="icon-btn" title="بحث عن صنف" onClick={() => { setQuery(""); setSearchCat("all"); setModal("search"); setTimeout(() => searchRef.current?.focus(), 200); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  </button>
                </div>

                <div className="logo-wrap">
                  <Image src="/logo.webp" alt="كاندي لوكيشن" width={38} height={38} className="cand-logo-round" />
                  <div className="logo-fallback">
                    <span className="logo-text">كاندي لوكيشن</span>
                    <span className="logo-sub">موقع الحلا</span>
                  </div>
                </div>

                <div className="avatar-wrap" title="حسابي" onClick={() => setTab("profile")}>
                  <div className="avatar">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                </div>
              </div>

              <div className={`branch-status ${branchOpen ? "open" : "closed"}`}>
                <span className="branch-dot" />
                <span>{branchOpen ? "الفروع مفتوحة الآن — نستقبل طلبك" : "الفروع مغلقة — أوقات العمل من 10 صباحاً حتى 1 فجراً"}</span>
              </div>

              <div className="home-mode-toggle">
                <button className={`h-mode-btn ${deliveryMode === "delivery" ? "active" : ""}`} onClick={() => setDeliveryMode("delivery")}>
                  <span><span className="ico">🛵</span> توصيل للعنوان</span>
                  <span className="h-mode-sub">رسوم التوصيل: {DELIVERY_FEE} {CURRENCY}</span>
                </button>
                <button className={`h-mode-btn ${deliveryMode === "pickup" ? "active" : ""}`} onClick={() => setDeliveryMode("pickup")}>
                  <span><span className="ico">🏪</span> استلام من الفرع</span>
                  <span className="h-mode-sub">بدون رسوم (مجاناً)</span>
                </button>
              </div>

              <button className="location-bar" onClick={() => setModal(deliveryMode === "delivery" ? "location" : "branch")}>
                <div className="location-info">
                  <span className="location-label">{deliveryMode === "delivery" ? "موقع التوصيل المحدد" : "الفرع المختار للاستلام"}</span>
                  <span className="location-name">
                    {deliveryMode === "delivery" ? address : branch}{" "}
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </div>
                <div className="location-pin">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
              </button>
            </div>

            <div className="scroll-content">
              {/* الشرائح الإعلانية */}
              <div className="banner-section">
                <div className="banners" id="banners" ref={bannersRef} onScroll={onBannerScroll}>
                  {BANNERS.map((b, i) => (
                    <div key={b.id} className={`banner banner-${i + 1}`} onClick={() => openItem(b.itemId)}>
                      <div className="banner-content">
                        <span className="banner-tag">{b.tag}</span>
                        <h3>{b.title}</h3>
                        <p>{b.sub}</p>
                        <button className="banner-btn">{b.btn}</button>
                      </div>
                      <div className="banner-img"><span className="banner-emoji">{b.emoji}</span></div>
                    </div>
                  ))}
                </div>
                <div className="banner-dots">
                  {BANNERS.map((b, i) => <span key={b.id} className={`dot ${i === bannerIdx ? "active" : ""}`} />)}
                </div>
              </div>

              {/* الأقسام */}
              <div className="section">
                <div className="section-header"><h2 className="section-title">أقسام كاندي</h2></div>
                <div className="categories-scroll">
                  {[{ key: "all", name: "الكل", emoji: "🍽️" }, ...CATEGORIES].map((c) => (
                    <button key={c.key} className={`cat-pill ${catFilter === c.key ? "active" : ""}`} onClick={() => setCatFilter(c.key)}>
                      <span className="cat-icon">{c.emoji}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* الأصناف */}
              <div className="section">
                <div className="section-header">
                  <h2 className="section-title">
                    {catFilter === "all" ? "قائمة أصناف الحلا اللذيذة" : CATEGORIES.find((c) => c.key === catFilter)?.name}
                  </h2>
                </div>
                <div className="items-grid">
                  {homeItems.map((item) => <ItemCard key={item.id} item={item} />)}
                </div>
              </div>

              <div style={{ height: 90 }} />
            </div>
          </div>

          {/* ==================== الطلبات والسلة ==================== */}
          <div className={`screen ${tab === "orders" ? "active" : ""}`} id="screen-orders">
            <div className="page-header"><h1>الطلبات والسلة</h1></div>

            <div className="scroll-content">
              {activeOrder && (
                <div className="active-order-bar" style={{ margin: "8px 20px 14px", position: "static" }} onClick={() => showToast("🛵 طلبك قيد التحضير — سنبلغك فور خروجه من الفرع")}>
                  <div className="aob-left">
                    <div className="aob-pulse" />
                    <div>
                      <div className="aob-status" style={{ fontWeight: 800 }}>جارٍ التحضير — طلب #{activeOrder.id}</div>
                      <div className="aob-eta" style={{ fontSize: 11, color: "var(--primary)", fontWeight: 700 }}>متوقع خلال ~25 دقيقة</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="aob-label">تتبع مباشر</span>
                    <Chev size={18} />
                  </div>
                </div>
              )}

              <div className="section">
                <div className="section-header">
                  <h2 className="section-title"><span className="ico">🛒</span> السلة الحالية</h2>
                  {cart.length > 0 && <button className="see-all" style={{ color: "#ef4444" }} onClick={clearCart}>تفريغ السلة</button>}
                </div>

                {cart.length === 0 ? (
                  <div className="empty-state" style={{ padding: "24px 16px", display: "flex" }}>
                    <div className="empty-icon">🛒</div>
                    <h3>سلتك فارغة حالياً</h3>
                    <p>اختر أصنافك المفضلة من الرئيسية أو العروض</p>
                    <button className="btn-primary" onClick={() => setTab("home")}>تصفح القائمة والطلب <span className="ico">🍬</span></button>
                  </div>
                ) : (
                  <div>
                    <div className="cart-items">
                      {cart.map((item, idx) => (
                        <div className="cart-item" key={item.key}>
                          <div className="cart-item-emoji">{item.emoji}</div>
                          <div className="cart-item-info">
                            <h4 className="cart-item-name">{item.name}</h4>
                            {item.customLabel && <span className="cart-item-custom">{item.customLabel}</span>}
                            <span className="cart-item-price">{item.price * item.qty} {CURRENCY}</span>
                          </div>
                          <div className="cart-item-qty">
                            <button className="qty-sm-btn" onClick={() => changeCartQty(idx, -1)}>−</button>
                            <span className="qty-sm-val">{item.qty}</span>
                            <button className="qty-sm-btn" onClick={() => changeCartQty(idx, 1)}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="coupon-row">
                      <button className="coupon-btn" onClick={() => setModal("coupons")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                        <span>{couponApplied ? "كوبون CANDY15 مفعّل" : "أضف كوبون خصم"}</span>
                      </button>
                      {couponApplied && <span className="coupon-discount">-{COUPON_VALUE} {CURRENCY}</span>}
                    </div>

                    <div className="price-summary">
                      <div className="price-row"><span>المجموع</span><span>{subTotal} {CURRENCY}</span></div>
                      <div className="price-row"><span>رسوم التوصيل</span><span>{fee === 0 ? "مجاناً" : `${fee} ${CURRENCY}`}</span></div>
                      {couponApplied && <div className="price-row"><span className="discount-label">خصم الكوبون</span><span className="discount-val">-{COUPON_VALUE} {CURRENCY}</span></div>}
                      {pointsUsed && <div className="price-row"><span className="discount-label">نقاط كاندي</span><span className="discount-val">-{POINTS_DISCOUNT} {CURRENCY}</span></div>}
                      <div className="price-divider" />
                      <div className="price-row total-row"><span>الإجمالي النهائي</span><span>{grandTotal} {CURRENCY}</span></div>
                    </div>

                    <div className="order-note-card">
                      <label className="order-note-label" htmlFor="order-note">
                        <span className="ico">📝</span> ملاحظات على الطلب <span className="order-note-optional">(اختياري)</span>
                      </label>
                      <textarea className="notes-input" id="order-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)}
                                placeholder="مثال: تغليف هدية، تقليل السكر، اتصل بي عند الوصول..." />
                    </div>

                    <button className="btn-checkout" onClick={() => setModal("applepay")}>
                      <span> Pay إتمام الطلب عبر Apple Pay</span>
                      <span className="checkout-total-badge">{grandTotal} {CURRENCY}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="section" style={{ marginTop: 16 }}>
                <div className="section-header"><h2 className="section-title"><span className="ico">📦</span> الطلبات السابقة</h2></div>
                <div className="past-orders">
                  {orders.length === 0 ? (
                    <p className="past-orders-empty">لا توجد طلبات سابقة بعد</p>
                  ) : (
                    orders.map((o) => (
                      <div className="past-order-card" key={o.id}>
                        <div className="past-order-header">
                          <span className="past-order-num">طلب #{o.id}</span>
                          <span className="past-order-date">{new Date(o.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}</span>
                        </div>
                        <div className="past-order-items">{o.items.map((i) => `${i.name} × ${i.qty}`).join("، ")}</div>
                        <div className="past-order-footer">
                          <span className="past-order-total">{o.total} {CURRENCY}</span>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {o.status === "pending" && (
                              <button className="reorder-btn" style={{ background: "#FEE2E2", color: "#DC2626", borderColor: "#FECACA" }} onClick={() => cancelOrder(o.id)}>❌ إلغاء الطلب</button>
                            )}
                            <button className="reorder-btn" onClick={() => reorder(o)}>🔄 إعادة الطلب</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ height: 90 }} />
            </div>
          </div>

          {/* ==================== العروض ==================== */}
          <div className={`screen ${tab === "offers" ? "active" : ""}`} id="screen-offers">
            <div className="page-header"><h1>عروض كاندي لوكيشن</h1></div>
            <div className="scroll-content">
              <p style={{ padding: "0 20px 10px", fontSize: 13, color: "var(--text-secondary)" }}>استمتع بأقوى العروض وبوكسات الحلا التوفيرية الحصرية</p>

              <div className="offers-grid-vertical">
                {OFFERS.map((o) => (
                  <div className="offer-rect-card" key={o.id} style={{ cursor: "pointer" }} onClick={() => openItem(o.itemId)}>
                    <div className="offer-rect-img-wrap">
                      <div className="offer-rect-emoji">{o.emoji}</div>
                      <span className="offer-rect-badge">{o.badge}</span>
                      <span className="offer-rect-discount-tag">{o.tag}</span>
                    </div>
                    <div className="offer-rect-body">
                      <h3 className="offer-rect-title">{o.title}</h3>
                      <p className="offer-rect-desc">{o.desc}</p>
                      <div className="offer-rect-footer">
                        <div className="offer-rect-pricing">
                          <span className="offer-rect-price">{o.price} {CURRENCY}</span>
                          <span className="offer-rect-old-price">{o.oldPrice} {CURRENCY}</span>
                        </div>
                        <button className="offer-rect-btn" onClick={(e) => { e.stopPropagation(); quickAdd(o.itemId); }}>اطلب العرض <span className="ico">⚡</span></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ height: 90 }} />
            </div>
          </div>

          {/* ==================== نقاطي والكوبونات ==================== */}
          <div className={`screen ${tab === "points" ? "active" : ""}`} id="screen-points">
            <div className="page-header"><h1>نقاطي والكوبونات</h1></div>
            <div className="scroll-content">
              <div className="loyalty-card">
                <div className="loyalty-header">
                  <div>
                    <h3>نقاط كاندي</h3>
                    <p>اجمع نقاطك مع كل طلب واستبدلها بأصناف حلا مجانية</p>
                  </div>
                  <div className="points-circle">
                    <span className="points-num">{points}</span>
                    <span className="points-label-sm">نقطة</span>
                  </div>
                </div>
                <div className="points-progress-wrap">
                  <div className="points-progress-bar">
                    <div className="points-progress-fill" style={{ width: `${Math.min(100, (points / 500) * 100)}%` }} />
                  </div>
                  <div className="points-progress-labels">
                    <span>{points} / 500 نقطة</span>
                    <span><span className="ico">🎁</span> بوكس حلا مجاني</span>
                  </div>
                </div>
                <div className="points-tiers">
                  <div className="tier"><span className="tier-icon">🥉</span><span className="tier-name">برونزي</span></div>
                  <div className="tier"><span className="tier-icon">🥈</span><span className="tier-name">فضي</span></div>
                  <div className="tier"><span className="tier-icon">🥇</span><span className="tier-name">ذهبي</span></div>
                  <div className="tier"><span className="tier-icon">💎</span><span className="tier-name">بلاتيني</span></div>
                </div>
              </div>

              <div className="section">
                <div className="section-header"><h2 className="section-title"><span className="ico">🎫</span> كوبونات وقسائم الخصم</h2></div>
                <div className="coupons-list">
                  <div className="coupon-card" onClick={() => { setCouponApplied(true); setTab("orders"); showToast("🎉 تم تفعيل كوبون CANDY15"); }}>
                    <div className="coupon-left">
                      <span className="coupon-code">CANDY15</span>
                      <span className="coupon-desc">خصم 15 {CURRENCY} على طلبك القادم</span>
                      <span className="coupon-exp">ساري حتى نهاية الشهر</span>
                    </div>
                    <div className="coupon-right"><span className="coupon-val">15<br /><small>{CURRENCY}</small></span></div>
                  </div>
                  <div className="coupon-card" onClick={() => { setDeliveryMode("pickup"); showToast("🛵 تم تفعيل التوصيل المجاني"); }}>
                    <div className="coupon-left">
                      <span className="coupon-code">FREE-SHIP</span>
                      <span className="coupon-desc">توصيل مجاني لطلبك</span>
                      <span className="coupon-exp">كوبون ترويجي</span>
                    </div>
                    <div className="coupon-right coupon-ship"><span className="coupon-val"><span className="ico">🛵</span><br /><small>مجاني</small></span></div>
                  </div>
                  <div className="coupon-card coupon-used">
                    <div className="coupon-left">
                      <span className="coupon-code">WELCOME20</span>
                      <span className="coupon-desc">خصم ترحيبي 20%</span>
                      <span className="coupon-exp">مُستخدم</span>
                    </div>
                    <div className="coupon-right"><span className="coupon-val">20%</span></div>
                  </div>
                </div>
              </div>

              <div style={{ height: 90 }} />
            </div>
          </div>

          {/* ==================== حسابي ==================== */}
          <div className={`screen ${tab === "profile" ? "active" : ""}`} id="screen-profile">
            <div className="page-header"><h1>حسابي</h1></div>
            <div className="scroll-content">
              <div className="profile-card">
                <div className="profile-avatar-big">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div className="profile-info">
                  <h3>{user ? user.name : "عميل كاندي"}</h3>
                  <p>{user ? user.phone : "05xxxxxxxx"}</p>
                </div>
                <button className="profile-edit-btn" onClick={() => setEditOpen(true)}>
                  <span>تعديل</span><Chev size={14} />
                </button>
              </div>

              {/* المحفظة الرقمية */}
              <div className="wallet-card" style={{ margin: "12px 20px" }}>
                <div className="wallet-card-header">
                  <span className="wallet-label">💳 محفظتي الرقمية</span>
                  <div className="wallet-logo">كاندي</div>
                </div>
                <div className="wallet-balance">
                  <span className="balance-amount">{wallet.toFixed(2)}</span>
                  <span className="balance-currency">{CURRENCY}</span>
                </div>
                <div className="wallet-actions">
                  <button className="wallet-action-btn" onClick={() => setModal("topup")}>شحن المحفظة</button>
                  <button className="wallet-action-btn" onClick={() => setTab("points")}>نقاطي</button>
                </div>
                <div className="wallet-card-deco" />
              </div>

              <div className="settings-group">
                <div className="settings-title">الحساب</div>
                <div className="settings-list">
                  <button className="settings-row" onClick={() => setEditOpen(true)}>
                    <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <span className="settings-label">تعديل بياناتي</span><Chev />
                  </button>
                  <button className="settings-row" onClick={() => setTab("orders")}>
                    <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /></svg>
                    <span className="settings-label">طلباتي</span><Chev />
                  </button>
                  <button className="settings-row" onClick={() => setModal("topup")}>
                    <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                    <span className="settings-label">المحفظة</span>
                    <span className="settings-badge">{wallet.toFixed(2)} {CURRENCY}</span><Chev />
                  </button>
                  <button className="settings-row" onClick={() => setTab("points")}>
                    <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    <span className="settings-label">نقاطي</span>
                    <span className="settings-badge">{points} نقطة</span><Chev />
                  </button>
                  <button className="settings-row" onClick={() => setModal("location")}>
                    <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span className="settings-label">عناويني</span><Chev />
                  </button>
                  <button className="settings-row" onClick={() => setModal("branch")}>
                    <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    <span className="settings-label">فروع كاندي لوكيشن</span>
                    <span className="settings-badge">{BRANCHES.length}</span><Chev />
                  </button>
                </div>
              </div>

              <div className="settings-group">
                <div className="settings-title">مساعدة</div>
                <div className="settings-list">
                  <button className="settings-row" onClick={() => setModal("support")}>
                    <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>
                    <span className="settings-label">اتصل بنا</span><Chev />
                  </button>
                  <button className="settings-row" onClick={() => setModal("faq")}>
                    <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    <span className="settings-label">الأسئلة الشائعة</span><Chev />
                  </button>
                  <button className="settings-row" onClick={() => setModal("about")}>
                    <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    <span className="settings-label">عن التطبيق</span><Chev />
                  </button>
                </div>
              </div>

              <div className="app-version">الإصدار 1.0.0 — كاندي لوكيشن © 2026</div>
              <div style={{ height: 90 }} />
            </div>
          </div>
        </div>

        {/* ==================== الشريط السفلي ==================== */}
        <nav className="bottom-nav">
          <button className={`nav-item ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            <span>الرئيسية</span>
          </button>
          <button className={`nav-item nav-cart ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>
            <div className="cart-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <span>الطلبات</span>
          </button>
          <button className={`nav-item nav-offers ${tab === "offers" ? "active" : ""}`} onClick={() => setTab("offers")}>
            <div className="offers-center-icon"><span className="flame-glyph">🍬</span></div>
            <span>العروض</span>
          </button>
          <button className={`nav-item ${tab === "points" ? "active" : ""}`} onClick={() => setTab("points")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            <span>نقاطي</span>
          </button>
          <button className={`nav-item ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <span>حسابي</span>
          </button>
        </nav>
      </div>

      {/* ==================== النوافذ ==================== */}

      {/* نافذة الصنف */}
      <div className={`modal-overlay ${modal === "item" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          {currentItem && (
            <>
              <div className="modal-item-img"><span className="modal-emoji">{currentItem.emoji}</span></div>
              <h2 className="modal-item-name">{currentItem.name}</h2>
              <p className="modal-item-desc">{currentItem.desc}</p>
              <div className="modal-item-meta">
                <span className="modal-cal">{currentItem.cal} سعرة</span>
                <div className="modal-stars">⭐ {currentItem.rating}</div>
              </div>

              {currentItem.opts && currentItem.opts.length > 0 && (
                <>
                  <div className="modal-section-title">خيارات الطلب الإضافية</div>
                  <div className="custom-opts">
                    {currentItem.opts.map((g) => (
                      <div className="opt-group" key={g.title}>
                        <div className="opt-group-head">
                          <div className="opt-group-title">{g.title}</div>
                          <div className="opt-group-hint">{g.max === 1 ? "اختر خياراً واحداً" : `اختر حتى ${g.max} خيارات`}</div>
                        </div>
                        {g.choices.map((c) => {
                          const active = (chosen[g.title] || []).includes(c.name);
                          return (
                            <label className={`opt-row ${active ? "selected" : ""}`} key={c.name}>
                              <input type="checkbox" className="opt-check" checked={active} onChange={() => toggleChoice(g, c)} />
                              <span className="opt-label">{c.name}</span>
                              <span className="opt-price">{c.price > 0 ? `+${c.price} ${CURRENCY}` : "مجاناً"}</span>
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="modal-qty-row">
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span className="qty-val">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
                </div>
                <button className="btn-add-to-cart" onClick={addToCartFromModal}>إضافة للسلة — {modalTotal} {CURRENCY}</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* نافذة البحث */}
      <div className={`modal-overlay ${modal === "search" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>🔍 البحث في قائمة كاندي</h3>
            <button className="icon-btn" onClick={() => setModal(null)}>✕</button>
          </div>
          <div className="search-modal-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input ref={searchRef} type="text" className="search-modal-input" value={query} onChange={(e) => setQuery(e.target.value)}
                   placeholder="ابحث باسم الصنف أو القسم (مثال: كنافة، ورق عنب، فشار...)" />
          </div>
          <div className="search-cat-chips">
            {[{ key: "all", name: "كل الأقسام", emoji: "🍽️" }, ...CATEGORIES].map((c) => (
              <button key={c.key} className={`search-cat-chip ${searchCat === c.key ? "active" : ""}`} onClick={() => setSearchCat(c.key)}>{c.emoji} {c.name}</button>
            ))}
          </div>
          <div className="search-results-note">{searchResults.length} صنف مطابق</div>
          <div className="items-grid" style={{ maxHeight: 360, overflowY: "auto", paddingBottom: 10 }}>
            {searchResults.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>

      {/* نافذة الكوبونات */}
      <div className={`modal-overlay ${modal === "coupons" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <h2 style={{ textAlign: "center", marginBottom: 6 }}>كوبونات الخصم</h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 13, marginBottom: 18 }}>اختر الكوبون المناسب لطلبك</p>
          <div className="coupons-list">
            <div className="coupon-card" onClick={() => { setCouponApplied(true); setModal(null); showToast("🎉 تم تطبيق كوبون CANDY15"); }}>
              <div className="coupon-left">
                <span className="coupon-code">CANDY15</span>
                <span className="coupon-desc">خصم 15 {CURRENCY} على طلبك</span>
                <span className="coupon-exp">ساري حتى نهاية الشهر</span>
              </div>
              <div className="coupon-right"><span className="coupon-val">15<br /><small>{CURRENCY}</small></span></div>
            </div>
            <div className="coupon-card" onClick={() => { setPointsUsed(true); setModal(null); showToast(`🎁 تم استبدال 200 نقطة بخصم ${POINTS_DISCOUNT} ${CURRENCY}`); }}>
              <div className="coupon-left">
                <span className="coupon-code">POINTS-{POINTS_DISCOUNT}</span>
                <span className="coupon-desc">استبدل 200 نقطة بخصم {POINTS_DISCOUNT} {CURRENCY}</span>
                <span className="coupon-exp">رصيدك: {points} نقطة</span>
              </div>
              <div className="coupon-right"><span className="coupon-val">{POINTS_DISCOUNT}<br /><small>{CURRENCY}</small></span></div>
            </div>
          </div>
          <button className="btn-secondary" style={{ marginTop: 14 }} onClick={() => { setCouponApplied(false); setPointsUsed(false); setModal(null); }}>إزالة الخصومات</button>
        </div>
      </div>

      {/* شحن المحفظة */}
      <div className={`modal-overlay ${modal === "topup" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <h2 style={{ textAlign: "center", marginBottom: 8 }}>شحن المحفظة</h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>اختر المبلغ أو أدخل مبلغاً مخصصاً</p>
          <div className="topup-amounts">
            {[50, 100, 200, 500].map((amt) => (
              <button key={amt} className={`topup-amt ${topupAmount === amt ? "active" : ""}`} onClick={() => setTopupAmount(amt)}>{amt} {CURRENCY}</button>
            ))}
          </div>
          <input type="number" className="custom-amount-input" placeholder="أو أدخل مبلغاً..."
                 onChange={(e) => setTopupAmount(Math.max(0, Number(e.target.value) || 0))} />
          <div className="topup-pay-opts">
            <button className="pay-opt active topup-pay"><span className="pay-icon"> Apple Pay</span></button>
            <button className="pay-opt topup-pay"><span className="pay-icon mada-icon">mada</span></button>
            <button className="pay-opt topup-pay"><span className="pay-icon stc-icon">STC Pay</span></button>
          </div>
          <button className="btn-checkout" onClick={doTopup}>شحن {topupAmount} {CURRENCY} الآن</button>
        </div>
      </div>

      {/* Apple Pay */}
      <div className={`modal-overlay ${modal === "applepay" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet apple-pay-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" style={{ background: "#C7C7CC" }} />
          <div className="apple-pay-header">
            <div className="apple-pay-logo">Pay</div>
            <button onClick={() => setModal(null)} style={{ color: "#007AFF", fontSize: 15, fontWeight: 600 }}>إلغاء</button>
          </div>
          <div className="apple-pay-card-row">
            <div className="apple-pay-card-info">
              <span style={{ fontSize: 24 }}>💳</span>
              <div>
                <div>مدى (Mada) ···· 4821</div>
                <div style={{ fontSize: 11, color: "#8E8E93", fontWeight: "normal" }}>البطاقة الافتراضية</div>
              </div>
            </div>
            <span style={{ color: "#007AFF", fontSize: 13 }}>✓</span>
          </div>
          <div className="apple-pay-summary">
            <div className="apple-pay-line"><span>المتجر:</span><span style={{ fontWeight: 600, color: "#000" }}>كاندي لوكيشن</span></div>
            <div className="apple-pay-line"><span>{deliveryMode === "delivery" ? "العنوان:" : "الفرع:"}</span><span>{deliveryMode === "delivery" ? address : branch}</span></div>
            <div className="apple-pay-line"><span>المجموع الفرعي:</span><span>{subTotal.toFixed(2)} ر.س</span></div>
            <div className="apple-pay-line"><span>رسوم التوصيل:</span><span>{fee.toFixed(2)} ر.س</span></div>
            <div className="apple-pay-total"><span>الإجمالي للدفع:</span><span style={{ color: "var(--primary)" }}>{grandTotal.toFixed(2)} ر.س</span></div>
          </div>
          <button className="apple-pay-action-btn" onClick={placeOrder}>
            <span>انقر مرتين للموافقة والدفع</span>
          </button>
        </div>
      </div>

      {/* تأكيد الطلب */}
      <div className={`modal-overlay ${modal === "success" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet success-modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">🎉</div>
          <h2>تم استلام طلبك!</h2>
          <p>طلبك رقم <strong>#{lastOrderId}</strong> قيد التحضير الآن</p>
          <p className="success-eta">الوصول المتوقع: ~25 دقيقة</p>
          <button className="btn-primary" onClick={() => { setModal(null); setTab("orders"); }}>تتبع طلبي</button>
          <button className="btn-secondary" onClick={() => { setModal(null); setTab("home"); }}>العودة للرئيسية</button>
        </div>
      </div>

      {/* نافذة الترحيب */}
      <div className={`modal-overlay ${modal === "welcome" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet welcome-modal" onClick={(e) => e.stopPropagation()}>
          <div className="welcome-confetti">🎉</div>
          <div className="welcome-brand">كاندي لوكيشن</div>
          <h2 className="welcome-title">أهلاً وسهلاً! 👋</h2>
          <p className="welcome-sub">يسعدنا انضمامك لعائلة موقع الحلا<br />هديتنا لك كوبون خصم خاص</p>
          <div className="welcome-coupon">
            <div className="welcome-coupon-inner">
              <div className="welcome-coupon-label">كوبون الترحيب</div>
              <div className="welcome-coupon-code">WELCOME20</div>
              <div className="welcome-coupon-desc">خصم 20% على طلبك الأول</div>
              <div className="welcome-coupon-exp">⏱ ينتهي خلال 7 أيام</div>
              <button className="welcome-copy-btn" onClick={() => { navigator.clipboard?.writeText("WELCOME20"); showToast("📋 تم نسخ الكود"); }}>📋 انسخ الكود</button>
            </div>
            <div className="welcome-coupon-deco" />
          </div>
          <button className="btn-primary welcome-start-btn" onClick={() => setModal(null)}>ابدأ الطلب الآن <span className="ico">🛵</span></button>
        </div>
      </div>

      {/* اختيار العنوان */}
      <div className={`modal-overlay ${modal === "location" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>📍 حدد موقع التوصيل</h3>
            <button className="icon-btn" onClick={() => setModal(null)}>✕</button>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>اختر أحد عناوينك المحفوظة</p>
          {ADDRESSES.map((a) => (
            <button key={a} className={`branch-pick-card ${address === a ? "active" : ""}`} onClick={() => { setAddress(a); setModal(null); showToast("📍 تم تحديث عنوان التوصيل"); }}>
              <span className="branch-pick-name">{a}</span>
              <span className="branch-pick-addr">توصيل خلال 25–40 دقيقة</span>
            </button>
          ))}
          <button className="btn-primary" onClick={() => setModal(null)}>تأكيد العنوان والتوصيل هنا <span className="ico">🛵</span></button>
        </div>
      </div>

      {/* اختيار الفرع */}
      <div className={`modal-overlay ${modal === "branch" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>🏪 اختر الفرع الأقرب إليك</h3>
            <button className="icon-btn" onClick={() => setModal(null)}>✕</button>
          </div>
          {BRANCHES.map((b) => (
            <button key={b.name} className={`branch-pick-card ${branch === b.name ? "active" : ""}`} onClick={() => { setBranch(b.name); setModal(null); showToast("🏪 تم اختيار الفرع"); }}>
              <span className="branch-pick-name">{b.name}</span>
              <span className="branch-pick-addr">📍 {b.addr}</span>
              <span className="branch-pick-meta">
                <span className="branch-pick-open">{b.open}</span>
                <span className="branch-pick-phone">📞 {b.phone}</span>
              </span>
            </button>
          ))}
          <button className="btn-primary" onClick={() => setModal(null)}>تأكيد الفرع المختار</button>
        </div>
      </div>

      {/* الدعم */}
      <div className={`modal-overlay ${modal === "support" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <div className="support-wrap">
            <div className="soon-icon">💬</div>
            <h3 className="soon-title">الدعم والمساعدة</h3>
            <p className="soon-text">فريق كاندي لوكيشن جاهز لخدمتك — تواصل معنا بالطريقة الأنسب لك</p>
            <a className="support-row" href="https://wa.me/966579772057" target="_blank" rel="noopener noreferrer">
              <span className="support-ico">📱</span>
              <span className="support-body">
                <span className="support-label">واتساب كاندي لوكيشن</span>
                <span className="support-value" dir="ltr">057 977 2057</span>
              </span>
              <Chev />
            </a>
            <a className="support-row" href="https://candylocation.com/" target="_blank" rel="noopener noreferrer">
              <span className="support-ico">🌐</span>
              <span className="support-body">
                <span className="support-label">الموقع الإلكتروني</span>
                <span className="support-value" dir="ltr">candylocation.com</span>
              </span>
              <Chev />
            </a>
            <button className="btn-primary" onClick={() => setModal(null)}>إغلاق</button>
          </div>
        </div>
      </div>

      {/* الأسئلة الشائعة */}
      <div className={`modal-overlay ${modal === "faq" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>الأسئلة الشائعة</h3>
            <button className="icon-btn" onClick={() => setModal(null)}>✕</button>
          </div>
          <div className="faq-list">
            <details className="faq-item"><summary>كم تستغرق مدة التوصيل؟</summary><p>عادةً من ٢٥ إلى ٤٠ دقيقة حسب المسافة وازدحام الطلبات.</p></details>
            <details className="faq-item"><summary>كم رسوم التوصيل؟</summary><p>{DELIVERY_FEE} {CURRENCY} داخل المدينة، والاستلام من الفرع مجاني.</p></details>
            <details className="faq-item"><summary>ما أوقات العمل؟</summary><p>يومياً من ١٠ صباحاً حتى ١ فجراً في جميع الفروع.</p></details>
            <details className="faq-item"><summary>كيف أستخدم نقاط كاندي؟</summary><p>تُجمع النقاط تلقائياً مع كل طلب وتُستبدل خصماً من شاشة السلة.</p></details>
            <details className="faq-item"><summary>هل تتوفر طلبات المناسبات والجمعات؟</summary><p>نعم، بوكسات الحلا والموالح متوفرة بأحجام عائلية — تواصل معنا عبر واتساب.</p></details>
          </div>
          <button className="btn-primary" style={{ marginTop: 14 }} onClick={() => setModal("support")}>لم أجد إجابتي — تواصل معنا</button>
        </div>
      </div>

      {/* عن التطبيق */}
      <div className={`modal-overlay ${modal === "about" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <div className="soon-wrap">
            <div className="soon-icon">🍬</div>
            <h3 className="soon-title">كاندي لوكيشن | موقع الحلا</h3>
            <p className="soon-text">
              متجر وتطبيق كاندي لوكيشن لأصناف الحلا والموالح وورق العنب ومنتجات الأسر المنتجة.
              <br />صُنعت بحب من أنامل سعودية وبأعلى جودة ✨
            </p>
            <div className="soon-badge"><span className="ico">📱</span> الإصدار 1.0.0</div>
            <button className="btn-primary" onClick={() => setModal(null)}>حسناً</button>
          </div>
        </div>
      </div>

      {/* تأكيد تسجيل الخروج */}
      <div className={`modal-overlay ${modal === "logout" ? "open" : ""}`} onClick={() => setModal(null)}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <div style={{ textAlign: "center", fontSize: 40, marginBottom: 10 }}>🚪</div>
          <h3 style={{ textAlign: "center", fontSize: 18, fontWeight: 800, marginBottom: 8 }}>تأكيد تسجيل الخروج</h3>
          <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setModal(null)}>إلغاء</button>
            <button className="btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={logout}>تسجيل الخروج</button>
          </div>
        </div>
      </div>

      {/* صفحة تعديل بياناتي */}
      <div className={`edit-profile-screen ${editOpen ? "open" : ""}`}>
        <div className="edit-profile-head">
          <button className="icon-btn" title="رجوع" onClick={() => setEditOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <h2>تعديل بياناتي</h2>
          <div className="edit-head-actions">
            <button className="icon-btn danger" title="تسجيل الخروج" onClick={() => setModal("logout")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            </button>
          </div>
        </div>
        <div className="edit-profile-body">
          <label className="edit-label" htmlFor="ep-name">الاسم الثنائي</label>
          <input type="text" className="edit-input" id="ep-name" value={user?.name || ""}
                 onChange={(e) => setUser((u) => (u ? { ...u, name: e.target.value } : u))} />
          <label className="edit-label" htmlFor="ep-phone">الجوال</label>
          <input type="tel" className="edit-input" id="ep-phone" value={user?.phone || ""} readOnly />
          <p className="edit-hint">رقم الجوال هو هويّة حسابك ولا يمكن تغييره من هنا</p>
          <button className="btn-primary" style={{ marginTop: 18 }} onClick={() => { if (user) writeLS(LS.user, user); setEditOpen(false); showToast("✅ تم حفظ بياناتك"); }}>
            حفظ التعديلات
          </button>
        </div>
      </div>

      {/* التنبيهات */}
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  );
}
