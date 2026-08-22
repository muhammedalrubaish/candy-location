"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./app.css";
import {
  ShoppingBag,
  Gift,
  Tag,
  PhoneCall,
  User,
  MapPin,
  Truck,
  Plus,
  Minus,
  Trash2,
  X,
  CreditCard,
  Wallet,
  Banknote,
  Send,
  Sparkles,
  CheckCircle,
  MessageCircle,
  ExternalLink,
  ChevronLeft,
  Search,
  Star,
  Flame,
  Award,
  ArrowRight,
  ShieldCheck,
  Smartphone
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  cal: number;
  emoji: string;
  desc: string;
  badge?: string;
}

interface CartItem {
  product: Product;
  qty: number;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "بوكس حلا الجمعات الملكي", category: "sweets", price: 65, cal: 520, emoji: "🍫", desc: "تشكيلة فاخرة من الكيك والكراميل والشوكلت البلجيكي", badge: "الأكثر طلباً" },
  { id: 2, name: "ورق عنب بدبس الرمان والليمون", category: "vine_leaves", price: 38, cal: 340, emoji: "🍃", desc: "ورق عنب ذايب محشو بالخلطة الخاصة مع صوص الرمان", badge: "مميز" },
  { id: 3, name: "كيكة الزعفران اللذيذة", category: "home_made", price: 45, cal: 460, emoji: "🍰", desc: "كيكة إسفنجية مسقية بحليب الزعفران الفاخر من أسر منتجة", badge: "أسر منتجة" },
  { id: 4, name: "ميني ساندوتش وموالح مشكلة", category: "savory", price: 55, cal: 410, emoji: "🥨", desc: "بوكس موالح مشكل ميني برجر، شاورما، وفطاير طازجة", badge: "جديد" },
  { id: 5, name: "فشار كاندي سولتيد كراميل", category: "popcorn", price: 18, cal: 220, emoji: "🍿", desc: "فشار مقرمش مغطى بطبقة غنية من الكراميل المملح" },
  { id: 6, name: "موهيتو بلوبيري منعش", category: "drinks", price: 16, cal: 140, emoji: "🧋", desc: "مشروب منعش بنكهة التوت الأزرق الطبيعي مع الليمون والنعناع" },
  { id: 7, name: "تارت الفراولة والشوكولاتة", category: "sweets", price: 42, cal: 390, emoji: "🍓", desc: "تارت مقرمش بحشوة الكريمة والفراولة الطازجة" },
  { id: 8, name: "ملفوف حامض حلو", category: "vine_leaves", price: 36, cal: 310, emoji: "🥬", desc: "ملفوف طري ومستوي على نار هادئة بخلطة دبس الرمان" }
];

export default function CandyMobileApp() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // App States
  const [activeTab, setActiveTab] = useState<"menu" | "deals" | "loyalty" | "orders" | "profile">("menu");
  const [serviceType, setServiceType] = useState<"delivery" | "pickup">("delivery");
  const [activeCat, setActiveCat] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"apple_pay" | "card" | "cash">("apple_pay");
  
  // Auth State
  const [user, setUser] = useState<{ name: string; phone: string; points: number; stamps: number } | null>(null);
  const [authStep, setAuthStep] = useState<"phone" | "otp">("phone");
  const [phoneInput, setPhoneInput] = useState("0579772057");
  const [nameInput, setNameInput] = useState("محمد");
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "support"; text: string }[]>([
    { sender: "support", text: "أهلاً بك في كاندي لوكيشن 🍬! كيف نقدر نخدمك اليوم بخصوص الطلبات أو الفروع؟" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Cart Calculations
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const deliveryFee = serviceType === "delivery" ? 15 : 0;
  const finalTotal = Math.max(0, cartTotal - discount + deliveryFee);
  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "CANDY10" || couponCode.toUpperCase() === "BITEO") {
      setDiscount(cartTotal * 0.1);
      alert("🎉 تم تطبيق كود الخصم 10% بنجاح!");
    } else if (couponCode.toUpperCase() === "FREE") {
      setDiscount(deliveryFee);
      alert("🎉 تم تطبيق خصم التوصيل المجاني!");
    } else {
      alert("❌ كود الخصم غير صحيح. جرّب: CANDY10");
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "support", text: "تم استلام رسالتك وسيتم الرد عليك فوراً من قبل مسؤول الفرع والتوصيل 💬✨" }
      ]);
    }, 800);
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    setAuthStep("otp");
    setOtpCode(["1", "2", "3", "4"]);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: nameInput || "عميل كاندي المميز",
      phone: phoneInput,
      points: 150,
      stamps: 4
    });
    setAuthStep("phone");
    setIsAuthOpen(false);
    alert(`🎉 مرحباً بك يا ${nameInput || "عميلنا الكريم"}! تم تسجيل الدخول بنجاح وتفعيل بطاقة الولاء.`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderSuccess(true);
    setCart([]);
    setIsCartOpen(false);
    if (user) {
      setUser((prev) => prev ? { ...prev, points: prev.points + 25, stamps: Math.min(6, prev.stamps + 1) } : null);
    }
  };

  const filteredProducts = activeCat === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCat);

  return (
    <div className="candy-app-container">
      {/* 🚀 Splash Screen Overlay */}
      <div className={`splash-overlay ${!showSplash ? "hidden" : ""}`}>
        <div className="splash-logo-box">
          <Image
            src="/logo.webp"
            alt="شعار كاندي لوكيشن"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className="splash-title">كاندي لوكيشن | Candy Location</div>
        <div className="splash-sub">أنسى الدنيا معنا، وتذوق من أجمل أصناف الحلويات ✨</div>
        <div className="splash-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="app-frame">
        {/* Top Header with Brand Logo */}
        <header className="app-top-header">
          <div className="header-brand-group" onClick={() => setIsAuthOpen(true)}>
            <div className="header-logo-box">
              <Image
                src="/logo.webp"
                alt="شعار كاندي لوكيشن"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <div className="header-meta">
              <span className="header-greeting">مرحباً بك 👋</span>
              <span className="header-name">{user ? user.name : "تسجيل الدخول (برقم الجوال)"}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => setIsChatOpen(true)}
              className="user-avatar-btn"
              style={{ background: "#e8f8ec", borderColor: "#a7f3d0", color: "#059669" }}
              title="التواصل المباشر"
            >
              <MessageCircle size={22} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="user-avatar-btn"
              style={{ position: "relative" }}
              title="سلة الطلبات"
            >
              <ShoppingBag size={22} />
              {totalCartCount > 0 && <span className="cart-count-badge">{totalCartCount}</span>}
            </button>
          </div>
        </header>

        {/* 🌟 Welcome Brand Banner with Logo */}
        <div className="app-welcome-hero">
          <div className="welcome-box">
            <div className="welcome-logo-thumb">
              <Image
                src="/logo.webp"
                alt="شعار كاندي لوكيشن"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <div className="welcome-text">
              <h2>موقع الحلا (Candy Location)</h2>
              <p>صُنعت بحب من أنامل سعودية وبأعلى جودة 🍬✨</p>
            </div>
          </div>
        </div>

        {/* Service Type Toggle (Delivery / Pickup) */}
        <div className="service-toggle-wrapper">
          <div className="service-toggle">
            <button
              className={`toggle-btn ${serviceType === "delivery" ? "active" : ""}`}
              onClick={() => setServiceType("delivery")}
            >
              <Truck size={18} /> توصيل للمنزل
            </button>
            <button
              className={`toggle-btn ${serviceType === "pickup" ? "active" : ""}`}
              onClick={() => setServiceType("pickup")}
            >
              <MapPin size={18} /> استلام من الفرع
            </button>
          </div>
        </div>

        {/* App Main Content Feed */}
        <div className="app-content">
          {orderSuccess && (
            <div style={{ margin: "12px 20px", padding: "16px 20px", background: "#def1f4", borderRadius: "16px", border: "1.5px solid #aed8e0", display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircle size={32} color="#1b383e" />
              <div>
                <strong style={{ color: "#1b383e", display: "block", fontSize: "1rem" }}>تم تأكيد طلبك بنجاح! 🍬✨</strong>
                <span style={{ fontSize: "0.82rem", color: "#2f5961" }}>تم تحديث نقاطك وإضافة ختم جديد إلى بطاقة الولاء.</span>
              </div>
              <button onClick={() => setOrderSuccess(false)} style={{ marginRight: "auto" }}><X size={18} /></button>
            </div>
          )}

          {/* Promo Slider (Banners) */}
          <div className="promo-slider">
            <div className="promo-banner" style={{ background: "linear-gradient(135deg, #1e3c42 0%, #2f5961 100%)" }}>
              <span className="promo-badge">عرض خاص 🌟</span>
              <div>
                <div className="promo-title">خصم 10% على كل أصناف الحلا</div>
                <div className="promo-sub">استخدم كود: CANDY10 عند الدفع</div>
              </div>
            </div>

            <div className="promo-banner" style={{ background: "linear-gradient(135deg, #a45a16 0%, #d97706 100%)" }}>
              <span className="promo-badge">توصيل مجاني 🛵</span>
              <div>
                <div className="promo-title">للطلبات فوق 100 ريال</div>
                <div className="promo-sub">عبر جميع فروع كاندي لوكيشن الثلاثة</div>
              </div>
            </div>
          </div>

          {/* Loyalty Stamp Card */}
          <div className="loyalty-card">
            <div className="loyalty-top">
              <div className="loyalty-title">
                <Award size={20} /> بطاقة ولاء كاندي (ختم كل طلب)
              </div>
              <span className="loyalty-points">{user ? user.points : 0} نقطة</span>
            </div>
            <div style={{ fontSize: "0.8rem", opacity: 0.95 }}>
              اجمع 6 أختام من طلباتك واحصل على بوكس حلا مجاناً! 🎁
            </div>
            <div className="loyalty-stamps">
              {[1, 2, 3, 4, 5, 6].map((slot) => {
                const isStamped = user && slot <= user.stamps;
                const isFree = slot === 6;
                return (
                  <div
                    key={slot}
                    className={`stamp-slot ${isStamped ? "stamped" : ""} ${isFree ? "free-reward" : ""}`}
                  >
                    {isFree ? "🎁" : isStamped ? "🍬" : slot}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categories Bar */}
          <div className="categories-bar">
            {[
              { id: "all", name: "الكل 🌟" },
              { id: "sweets", name: "حلا 🍫" },
              { id: "vine_leaves", name: "ورق عنب 🍃" },
              { id: "home_made", name: "أسر منتجة 🍰" },
              { id: "savory", name: "موالح 🥨" },
              { id: "popcorn", name: "فشار 🍿" },
              { id: "drinks", name: "مشروبات 🧋" }
            ].map((cat) => (
              <button
                key={cat.id}
                className={`cat-pill ${activeCat === cat.id ? "active" : ""}`}
                onClick={() => setActiveCat(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid Feed */}
          <div className="products-feed">
            {filteredProducts.map((p) => (
              <div key={p.id} className="food-card">
                <div>
                  <div className="food-img-wrapper">
                    {p.badge && <span className="food-badge">{p.badge}</span>}
                    <span>{p.emoji}</span>
                  </div>
                  <div className="food-name">{p.name}</div>
                  <div className="food-desc">{p.desc}</div>
                </div>

                <div className="food-bottom">
                  <div className="food-price">
                    {p.price} <span>ر.س</span>
                  </div>
                  <button className="add-food-btn" onClick={() => addToCart(p)}>
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="app-bottom-nav">
          <div className="nav-inner-wrapper">
            <button
              className={`nav-tab-item ${activeTab === "menu" ? "active" : ""}`}
              onClick={() => setActiveTab("menu")}
            >
              <ShoppingBag size={22} />
              <span>المنيو</span>
            </button>
            <button
              className={`nav-tab-item ${activeTab === "deals" ? "active" : ""}`}
              onClick={() => { setActiveTab("deals"); setActiveCat("sweets"); }}
            >
              <Flame size={22} />
              <span>العروض</span>
            </button>
            <button
              className={`nav-tab-item ${activeTab === "loyalty" ? "active" : ""}`}
              onClick={() => setActiveTab("loyalty")}
            >
              <Gift size={22} />
              <span>المكافآت</span>
            </button>
            <button
              className={`nav-tab-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setIsCartOpen(true)}
            >
              <div style={{ position: "relative" }}>
                <Tag size={22} />
                {totalCartCount > 0 && <span className="cart-count-badge" style={{ top: -8, right: -12 }}>{totalCartCount}</span>}
              </div>
              <span>السلة</span>
            </button>
            <button
              className={`nav-tab-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setIsAuthOpen(true)}
            >
              <User size={22} />
              <span>حسابي</span>
            </button>
          </div>
        </nav>

        {/* 🛒 Cart Modal */}
        {isCartOpen && (
          <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-header">
                <div className="sheet-title">سلة الطلبات ({totalCartCount})</div>
                <button className="sheet-close" onClick={() => setIsCartOpen(false)}><X size={20} /></button>
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                  <ShoppingBag size={52} style={{ margin: "0 auto 14px", opacity: 0.4 }} />
                  <p style={{ fontWeight: "700" }}>سلتك فارغة حالياً</p>
                  <button className="btn-primary" style={{ marginTop: "18px" }} onClick={() => setIsCartOpen(false)}>
                    تصفح المنيو
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "220px", overflowY: "auto" }}>
                    {cart.map((item) => (
                      <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px dashed var(--border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "1.8rem" }}>{item.product.emoji}</span>
                          <div>
                            <div style={{ fontSize: "0.95rem", fontWeight: "800" }}>{item.product.name}</div>
                            <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: "700" }}>{item.product.price * item.qty} ر.س</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button className="add-food-btn" style={{ width: "28px", height: "28px" }} onClick={() => updateQty(item.product.id, -1)}>
                            <Minus size={16} />
                          </button>
                          <span style={{ fontWeight: "900", fontSize: "0.95rem" }}>{item.qty}</span>
                          <button className="add-food-btn" style={{ width: "28px", height: "28px" }} onClick={() => updateQty(item.product.id, 1)}>
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="coupon-row">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="أدخل كود الخصم (مثال: CANDY10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="apply-coupon-btn" onClick={handleApplyCoupon}>
                      تطبيق
                    </button>
                  </div>

                  <div style={{ marginTop: "14px" }}>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800", color: "var(--text)" }}>طريقة الدفع:</span>
                    <div className="payment-grid">
                      <div
                        className={`payment-option ${paymentMethod === "apple_pay" ? "selected" : ""}`}
                        onClick={() => setPaymentMethod("apple_pay")}
                      >
                        <Wallet size={22} /> Apple Pay
                      </div>
                      <div
                        className={`payment-option ${paymentMethod === "card" ? "selected" : ""}`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <CreditCard size={22} /> بطاقة مدى
                      </div>
                      <div
                        className={`payment-option ${paymentMethod === "cash" ? "selected" : ""}`}
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <Banknote size={22} /> الدفع عند الاستلام
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-card2)", padding: "14px", borderRadius: "14px", marginTop: "14px" }}>
                    <div className="info-row"><span>المجموع الفرعي:</span><strong>{cartTotal} ر.س</strong></div>
                    {discount > 0 && <div className="info-row" style={{ color: "#16a34a" }}><span>الخصم:</span><strong>- {discount.toFixed(1)} ر.س</strong></div>}
                    <div className="info-row"><span>رسوم التوصيل:</span><strong>{deliveryFee === 0 ? "مجاناً" : `${deliveryFee} ر.س`}</strong></div>
                    <div className="info-row" style={{ borderTop: "1.5px solid var(--border)", paddingTop: "10px", fontWeight: "900", fontSize: "1.05rem" }}>
                      <span>الإجمالي النهائي:</span>
                      <span style={{ color: "var(--primary)" }}>{finalTotal.toFixed(1)} ر.س</span>
                    </div>
                  </div>

                  <button className="checkout-btn" onClick={handleCheckout}>
                    <span>تأكيد الطلب 🛍️</span>
                    <span>{finalTotal.toFixed(1)} ر.س</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* 📱 Mock Phone Login & OTP Modal */}
        {isAuthOpen && (
          <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-header">
                <div className="sheet-title">تسجيل الدخول برقم الجوال 🍬</div>
                <button className="sheet-close" onClick={() => setIsAuthOpen(false)}><X size={20} /></button>
              </div>

              {user ? (
                <div>
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: "#def1f4", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#1b383e", fontWeight: "900", fontSize: "1.6rem" }}>
                      {user.name.charAt(0)}
                    </div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "900" }}>{user.name}</h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", direction: "ltr" }}>{user.phone}</p>
                  </div>

                  <div style={{ background: "var(--bg-card2)", padding: "16px", borderRadius: "14px", marginBottom: "18px" }}>
                    <div className="info-row"><span>رصيد نقاط كاندي:</span><strong style={{ color: "var(--primary)" }}>{user.points} نقطة</strong></div>
                    <div className="info-row"><span>الأختام المكتملة:</span><strong>{user.stamps} من 6</strong></div>
                    <div className="info-row"><span>نوع العضوية:</span><span style={{ color: "#d97706", fontWeight: "800" }}>عميل VIP 🌟</span></div>
                  </div>

                  <button className="btn-primary" style={{ background: "#ef4444", width: "100%" }} onClick={() => setUser(null)}>
                    تسجيل الخروج
                  </button>
                </div>
              ) : authStep === "phone" ? (
                <form onSubmit={handleRequestOtp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ textAlign: "center", marginBottom: "8px" }}>
                    <Smartphone size={40} style={{ color: "var(--primary)", margin: "0 auto 8px" }} />
                    <h4 style={{ fontSize: "1.1rem", fontWeight: "800" }}>أدخل رقم الجوال</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>سنرسل لك رمز تحقق سريع (تسجيل وهمي فوري)</p>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "800" }}>الاسم الكريم</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="مثال: محمد"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                      style={{ marginTop: "4px" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "800" }}>رقم الجوال</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="05xxxxxxxx"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      required
                      style={{ marginTop: "4px" }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", marginTop: "10px" }}>
                    إرسال رمز التحقق 📲
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "center" }}>
                  <ShieldCheck size={44} style={{ color: "#10b981", margin: "0 auto 4px" }} />
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "800" }}>أدخل رمز التحقق</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    تم إرسال رمز التحقق الوهمي إلى <span style={{ direction: "ltr", display: "inline-block", fontWeight: "800" }}>{phoneInput}</span>
                  </p>

                  <div className="otp-box-grid">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        className="otp-digit"
                        value={digit}
                        readOnly
                      />
                    ))}
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px" }}>
                    تأكيد والدخول 🚀
                  </button>

                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", cursor: "pointer", marginTop: "6px" }}
                    onClick={() => setAuthStep("phone")}
                  >
                    تغيير رقم الجوال
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 💬 Direct Live Support Modal */}
        {isChatOpen && (
          <div className="modal-overlay" onClick={() => setIsChatOpen(false)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ height: "75%" }}>
              <div className="sheet-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }}></div>
                  <div className="sheet-title">خدمة التواصل المباشر 💬</div>
                </div>
                <button className="sheet-close" onClick={() => setIsChatOpen(false)}><X size={20} /></button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "260px", overflowY: "auto", padding: "12px", background: "#f8fafc", borderRadius: "14px" }}>
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: msg.sender === "user" ? "flex-start" : "flex-end",
                      background: msg.sender === "user" ? "#2f5961" : "#ffffff",
                      color: msg.sender === "user" ? "#ffffff" : "#1b383e",
                      padding: "10px 16px",
                      borderRadius: "14px",
                      fontSize: "0.9rem",
                      maxWidth: "82%",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      lineHeight: "1.5"
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="اكتب استفسارك للفرع أو التوصيل..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="apply-coupon-btn">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

