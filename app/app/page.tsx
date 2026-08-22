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
  Award
} from "lucide-react";

// Types
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

// Products Catalog from Candy Location
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
  // State
  const [activeTab, setActiveTab] = useState<"menu" | "deals" | "loyalty" | "orders" | "profile">("menu");
  const [serviceType, setServiceType] = useState<"delivery" | "pickup">("delivery");
  const [selectedBranch, setSelectedBranch] = useState("فرع 1 - الرئيسي");
  const [activeCat, setActiveCat] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"apple_pay" | "card" | "cash">("apple_pay");
  
  // User Data (Simulated Database)
  const [user, setUser] = useState<{ name: string; phone: string; points: number; stamps: number } | null>({
    name: "عميل كاندي لوكيشن",
    phone: "0501234567",
    points: 120,
    stamps: 4
  });
  
  const [phoneInput, setPhoneInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "support"; text: string }[]>([
    { sender: "support", text: "أهلاً بك في الدعم المباشر لكاندي لوكيشن 🍬! كيف نقدر نساعدك؟" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Cart Calculations
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const deliveryFee = serviceType === "delivery" ? 15 : 0;
  const finalTotal = Math.max(0, cartTotal - discount + deliveryFee);
  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Add to Cart
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

  // Update Qty
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

  // Apply Coupon
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

  // Send Support Message
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

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || !nameInput) return;
    setUser({
      name: nameInput,
      phone: phoneInput,
      points: 50,
      stamps: 1
    });
    setIsAuthOpen(false);
    alert(`مرحباً بك يا ${nameInput}! تم تسجيل الدخول وإضافة 50 نقطة ترحيبية 🎁`);
  };

  // Checkout Handler
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderSuccess(true);
    setCart([]);
    setIsCartOpen(false);
    if (user) {
      setUser((prev) => prev ? { ...prev, points: prev.points + 20, stamps: Math.min(6, prev.stamps + 1) } : null);
    }
  };

  // Filtered Products
  const filteredProducts = activeCat === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCat);

  return (
    <div className="candy-app-container">
      <div className="app-frame">
        {/* App Top Header */}
        <header className="app-top-header">
          <div className="header-user-info" onClick={() => setIsAuthOpen(true)}>
            <div className="user-avatar-btn">
              <User size={20} />
            </div>
            <div className="header-meta">
              <span className="header-greeting">مرحباً بك 👋</span>
              <span className="header-name">{user ? user.name : "تسجيل الدخول"}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setIsChatOpen(true)}
              className="user-avatar-btn"
              style={{ background: "#e8f8ec", borderColor: "#a7f3d0", color: "#059669" }}
            >
              <MessageCircle size={20} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="user-avatar-btn"
              style={{ position: "relative" }}
            >
              <ShoppingBag size={20} />
              {totalCartCount > 0 && <span className="cart-count-badge">{totalCartCount}</span>}
            </button>
          </div>
        </header>

        {/* Service Type Toggle (Delivery / Pickup) */}
        <div className="service-toggle-wrapper">
          <div className="service-toggle">
            <button
              className={`toggle-btn ${serviceType === "delivery" ? "active" : ""}`}
              onClick={() => setServiceType("delivery")}
            >
              <Truck size={16} /> توصيل للمنزل
            </button>
            <button
              className={`toggle-btn ${serviceType === "pickup" ? "active" : ""}`}
              onClick={() => setServiceType("pickup")}
            >
              <MapPin size={16} /> استلام من الفرع
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="app-content">
          {orderSuccess && (
            <div style={{ margin: "12px 18px", padding: "16px", background: "#def1f4", borderRadius: "16px", border: "1.5px solid #aed8e0", display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircle size={32} color="#1b383e" />
              <div>
                <strong style={{ color: "#1b383e", display: "block" }}>تم إرسال طلبك بنجاح! 🍬✨</strong>
                <span style={{ fontSize: "0.8rem", color: "#2f5961" }}>تمت إضافة ختم جديد لبطاقة الولاء الخاصة بك.</span>
              </div>
              <button onClick={() => setOrderSuccess(false)} style={{ marginRight: "auto" }}><X size={16} /></button>
            </div>
          )}

          {/* Promo Slider (Banners) */}
          <div className="promo-slider">
            <div className="promo-banner" style={{ background: "linear-gradient(135deg, #1e3c42 0%, #2f5961 100%)" }}>
              <span className="promo-badge">عرض اليوم 🌟</span>
              <div>
                <div className="promo-title">خصم 10% على كل أصناف الحلا</div>
                <div className="promo-sub">استخدم كود: CANDY10 عند الدفع</div>
              </div>
            </div>

            <div className="promo-banner" style={{ background: "linear-gradient(135deg, #a45a16 0%, #d97706 100%)" }}>
              <span className="promo-badge">توصيل مجاني 🛵</span>
              <div>
                <div className="promo-title">للطلبات فوق 100 ريال</div>
                <div className="promo-sub">عبر جميع فروع كاندي لوكيشن</div>
              </div>
            </div>
          </div>

          {/* Loyalty Stamp Card */}
          <div className="loyalty-card">
            <div className="loyalty-top">
              <div className="loyalty-title">
                <Award size={18} /> بطاقة ولاء كاندي (ختم كل طلب)
              </div>
              <span className="loyalty-points">{user ? user.points : 0} نقطة</span>
            </div>
            <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
              اجمع 6 أختام واحصل على بوكس حلا مجاناً! 🎁
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
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 5-Tab Bar (Biteo Signature Navigation) */}
        <nav className="app-bottom-nav">
          <button
            className={`nav-tab-item ${activeTab === "menu" ? "active" : ""}`}
            onClick={() => setActiveTab("menu")}
          >
            <ShoppingBag size={20} />
            <span>المنيو</span>
          </button>
          <button
            className={`nav-tab-item ${activeTab === "deals" ? "active" : ""}`}
            onClick={() => { setActiveTab("deals"); setActiveCat("sweets"); }}
          >
            <Flame size={20} />
            <span>العروض</span>
          </button>
          <button
            className={`nav-tab-item ${activeTab === "loyalty" ? "active" : ""}`}
            onClick={() => setActiveTab("loyalty")}
          >
            <Gift size={20} />
            <span>المكافآت</span>
          </button>
          <button
            className={`nav-tab-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setIsCartOpen(true)}
          >
            <div style={{ position: "relative" }}>
              <Tag size={20} />
              {totalCartCount > 0 && <span className="cart-count-badge" style={{ top: -6, right: -10 }}>{totalCartCount}</span>}
            </div>
            <span>السلة</span>
          </button>
          <button
            className={`nav-tab-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setIsAuthOpen(true)}
          >
            <User size={20} />
            <span>حسابي</span>
          </button>
        </nav>

        {/* 🛒 Shopping Cart & Checkout Modal */}
        {isCartOpen && (
          <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-header">
                <div className="sheet-title">سلة الطلبات ({totalCartCount})</div>
                <button className="sheet-close" onClick={() => setIsCartOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                  <ShoppingBag size={48} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                  <p>سلتك فارغة حالياً</p>
                  <button className="btn-primary" style={{ marginTop: "16px" }} onClick={() => setIsCartOpen(false)}>
                    تصفح المنيو
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "200px", overflowY: "auto" }}>
                    {cart.map((item) => (
                      <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px dashed var(--border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "1.6rem" }}>{item.product.emoji}</span>
                          <div>
                            <div style={{ fontSize: "0.9rem", fontWeight: "700" }}>{item.product.name}</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--primary)" }}>{item.product.price * item.qty} ر.س</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button className="add-food-btn" style={{ width: "26px", height: "26px" }} onClick={() => updateQty(item.product.id, -1)}>
                            <Minus size={14} />
                          </button>
                          <span style={{ fontWeight: "800", fontSize: "0.9rem" }}>{item.qty}</span>
                          <button className="add-food-btn" style={{ width: "26px", height: "26px" }} onClick={() => updateQty(item.product.id, 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Input */}
                  <div className="coupon-row">
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="أدخل كود الخصم (مثال: CANDY10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="apply-coupon-btn" onClick={handleApplyCoupon}>
                      تطبيق
                    </button>
                  </div>

                  {/* Payment Methods Selection */}
                  <div style={{ marginTop: "12px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--text)" }}>طريقة الدفع:</span>
                    <div className="payment-grid">
                      <div
                        className={`payment-option ${paymentMethod === "apple_pay" ? "selected" : ""}`}
                        onClick={() => setPaymentMethod("apple_pay")}
                      >
                        <Wallet size={20} /> Apple Pay
                      </div>
                      <div
                        className={`payment-option ${paymentMethod === "card" ? "selected" : ""}`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <CreditCard size={20} /> بطاقة مدى
                      </div>
                      <div
                        className={`payment-option ${paymentMethod === "cash" ? "selected" : ""}`}
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <Banknote size={20} /> الدفع عند الاستلام
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div style={{ background: "var(--bg-card2)", padding: "12px", borderRadius: "12px", marginTop: "12px" }}>
                    <div className="info-row"><span>المجموع الفرعي:</span><span>{cartTotal} ر.س</span></div>
                    {discount > 0 && <div className="info-row" style={{ color: "#16a34a" }}><span>الخصم:</span><span>- {discount.toFixed(1)} ر.س</span></div>}
                    <div className="info-row"><span>رسوم التوصيل:</span><span>{deliveryFee === 0 ? "مجاناً" : `${deliveryFee} ر.س`}</span></div>
                    <div className="info-row" style={{ borderTop: "1.5px solid var(--border)", paddingTop: "8px", fontWeight: "800", fontSize: "1rem" }}>
                      <span>الإجمالي النهائي:</span>
                      <span style={{ color: "var(--primary)" }}>{finalTotal.toFixed(1)} ر.س</span>
                    </div>
                  </div>

                  {/* Checkout Action Button */}
                  <button className="checkout-btn" onClick={handleCheckout}>
                    <span>تأكيد الطلب 🛍️</span>
                    <span>{finalTotal.toFixed(1)} ر.س</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* 👤 Login / Profile Modal */}
        {isAuthOpen && (
          <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-header">
                <div className="sheet-title">الملف الشخصي والعملاء 🍬</div>
                <button className="sheet-close" onClick={() => setIsAuthOpen(false)}><X size={18} /></button>
              </div>

              {user ? (
                <div>
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#def1f4", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#1b383e", fontWeight: "900", fontSize: "1.4rem" }}>
                      {user.name.charAt(0)}
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "800" }}>{user.name}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", direction: "ltr" }}>{user.phone}</p>
                  </div>

                  <div style={{ background: "var(--bg-card2)", padding: "14px", borderRadius: "12px", marginBottom: "16px" }}>
                    <div className="info-row"><span>رصيد نقاط كاندي:</span><strong style={{ color: "var(--primary)" }}>{user.points} نقطة</strong></div>
                    <div className="info-row"><span>الأختام المكتملة:</span><strong>{user.stamps} من 6</strong></div>
                    <div className="info-row"><span>نوع العضوية:</span><span style={{ color: "#d97706", fontWeight: "800" }}>عميل VIP 🌟</span></div>
                  </div>

                  <button className="btn-primary" style={{ background: "#ef4444" }} onClick={() => setUser(null)}>
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    سجل دخولك برقم الجوال للوصول لبطاقة الولاء والعروض الحصرية:
                  </p>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: "700" }}>الاسم الكريم</label>
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="مثال: محمد"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                      style={{ width: "100%", marginTop: "4px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: "700" }}>رقم الجوال</label>
                    <input
                      type="tel"
                      className="coupon-input"
                      placeholder="05xxxxxxxx"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      required
                      style={{ width: "100%", marginTop: "4px" }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: "10px" }}>
                    دخول ومتابعة 🚀
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 💬 Live Direct Support Chat Modal */}
        {isChatOpen && (
          <div className="modal-overlay" onClick={() => setIsChatOpen(false)}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ height: "70%" }}>
              <div className="sheet-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }}></div>
                  <div className="sheet-title">خدمة التواصل المباشر 💬</div>
                </div>
                <button className="sheet-close" onClick={() => setIsChatOpen(false)}><X size={18} /></button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "240px", overflowY: "auto", padding: "10px", background: "#f8fafc", borderRadius: "12px" }}>
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: msg.sender === "user" ? "flex-start" : "flex-end",
                      background: msg.sender === "user" ? "#2f5961" : "#ffffff",
                      color: msg.sender === "user" ? "#ffffff" : "#1b383e",
                      padding: "8px 14px",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      maxWidth: "80%",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <input
                  type="text"
                  className="coupon-input"
                  placeholder="اكتب استفسارك للفرع مباشرة..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="apply-coupon-btn">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

