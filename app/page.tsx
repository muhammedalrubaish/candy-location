"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Store,
  PhoneCall,
  Bot,
  Layers,
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  Boxes,
  MapPin,
  Truck,
  MessageSquare,
  Smartphone,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  ShoppingCart,
  ChevronLeft
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "mobile_app" | "architecture" | "contacts" | "products" | "bot_preview">("mobile_app");
  const [botMessage, setBotMessage] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("الفرع الأول (الرئيسي)");
  const [cart, setCart] = useState<{ id: number; name: string; price: number; count: number; image: string }[]>([
    { id: 1, name: "بوكس حلا الجمعات الفاخر", price: 85, count: 1, image: "🍫" },
    { id: 3, name: "ورق عنب بدبس الرمان (راهي)", price: 45, count: 1, image: "🍃" }
  ]);
  const [appScreen, setAppScreen] = useState<"shop" | "cart" | "branch_select" | "order_success">("shop");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "أهلاً بك في كاندي لوكيشن 🍬✨ كيف أقدر أخدمك اليوم؟ يمكنك السؤال عن أصناف الحلا، مواقع الفروع، أو الطلب والتوصيل!" }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!botMessage.trim()) return;

    const userText = botMessage;
    const newChat = [...chatLog, { sender: "user" as const, text: userText }];
    setChatLog(newChat);
    setBotMessage("");

    // Simulate smart bot response
    setTimeout(() => {
      let reply = "مرحباً بك! يمكنك تصفح الأصناف عبر متجرنا candylocation.com أو زيارة أحد فروعنا الثلاثة.";
      if (userText.includes("فرع") || userText.includes("فروع") || userText.includes("موقع")) {
        reply = "📍 لدينا 3 فروع في خدمتكم + رقم موحد للمبيعات والتوصيل السريع!";
      } else if (userText.includes("حلا") || userText.includes("ورق عنب") || userText.includes("اسر") || userText.includes("منيو")) {
        reply = "🍰 أصنافنا تشمل: أسر منتجة، حلا فاخر، ورق عنب، موالح، فشار بنكهات مميزة ومشروبات باردة.";
      } else if (userText.includes("توصيل") || userText.includes("طلب")) {
        reply = "🛵 التوصيل متاح مباشرة عبر خط التوصيل المخصص أو الطلب أونلاين عبر الموقع!";
      } else if (userText.includes("موظف") || userText.includes("انسان") || userText.includes("مساعدة")) {
        reply = "🔄 يتم الآن تحويلك إلى خدمة العملاء البشريين على الرقم المخصص...";
      }

      setChatLog((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <div style={{ position: "relative", width: "52px", height: "52px", borderRadius: "12px", overflow: "hidden", border: "2px solid #aed8e0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <Image
                src="/logo.webp"
                alt="شعار كاندي لوكيشن"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <div>
              <div className="brand-title">كاندي لوكيشن | Candy Location</div>
              <div className="brand-subtitle">المركز الرقمي وبوابة التجهيز للتطبيق المستقبلي</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <a
              href="/app"
              className="btn-primary"
              style={{ width: "auto", margin: 0, background: "linear-gradient(135deg, #1b383e 0%, #2f5961 100%)", boxShadow: "0 4px 12px rgba(47, 89, 97, 0.25)" }}
            >
              <Smartphone size={16} /> فتح التطبيق بالشاشة الكاملة
            </a>
            <a
              href="https://candylocation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ width: "auto", margin: 0, background: "#def1f4", color: "#1b383e", border: "1.5px solid #aed8e0" }}
            >
              متجر سلة <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <div style={{ position: "relative", width: "100px", height: "100px", borderRadius: "24px", overflow: "hidden", border: "3px solid #aed8e0", boxShadow: "0 8px 24px rgba(93, 169, 183, 0.25)" }}>
            <Image
              src="/logo.webp"
              alt="شعار كاندي لوكيشن"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
        <div className="hero-tag">
          <Sparkles size={16} /> المنظومة الرقمية ومعلومات المشروع الحالية
        </div>
        <h1>
          بوابة بيانات ومعلومات <span>موقع الحلا</span>
        </h1>
        <p>
          منصة تفاعلية لعرض كافة البيانات التشغيلية المحدثة، تمهيداً لبناء وتطوير تطبيق الجوال المخصص والأنظمة السحابية المتكاملة.
        </p>

        {/* Navigation Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "mobile_app" ? "active" : ""}`}
            onClick={() => setActiveTab("mobile_app")}
            style={{ borderColor: activeTab === "mobile_app" ? "var(--color-primary-reverse)" : "#88b2ba" }}
          >
            <Smartphone size={18} /> 📱 محاكي تطبيق الجوال (جديد)
          </button>
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <Layers size={18} /> نظرة عامة والمعطيات
          </button>
          <button
            className={`tab-btn ${activeTab === "architecture" ? "active" : ""}`}
            onClick={() => setActiveTab("architecture")}
          >
            <Boxes size={18} /> خطة التطبيق والربط
          </button>
          <button
            className={`tab-btn ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            <PhoneCall size={18} /> أرقام التواصل والسنترال
          </button>
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <ShoppingBag size={18} /> الأقسام والمخزون
          </button>
          <button
            className={`tab-btn ${activeTab === "bot_preview" ? "active" : ""}`}
            onClick={() => setActiveTab("bot_preview")}
          >
            <Bot size={18} /> تجربة محاكي الواتساب
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-wrapper flex-1">
        {/* Tab 0: Mobile App Simulator */}
        {activeTab === "mobile_app" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
            <div style={{ textAlign: "center", maxWidth: "700px" }}>
              <div className="card-badge status-ready" style={{ display: "inline-block", marginBottom: "0.5rem" }}>
                محاكي تطبيق الجوال الحصري لـ كاندي لوكيشن (Candy Location App)
              </div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--text-title)", marginBottom: "0.5rem" }}>
                تجربة حية لتطبيق التسوق وربط الفروع بالسلة
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                يمكنك التفاعل مع التطبيق أدناه: تصفح المنتجات، تغيير الفروع الـ 3، إضافة للسلة، تجربة عملية الشراء ومحاكاة الربط مع متجر سلة.
              </p>
            </div>

            {/* Mobile Phone Mockup Container */}
            <div style={{
              width: "100%",
              maxWidth: "390px",
              height: "780px",
              background: "#1e293b",
              borderRadius: "44px",
              padding: "12px",
              boxShadow: "0 25px 60px -15px rgba(47, 89, 97, 0.4), 0 0 0 1px rgba(255,255,255,0.1)",
              position: "relative",
              display: "flex",
              flexDirection: "column"
            }}>
              {/* Phone Speaker & Dynamic Island */}
              <div style={{
                position: "absolute",
                top: "18px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "110px",
                height: "24px",
                background: "#0f172a",
                borderRadius: "20px",
                zIndex: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}>
                <div style={{ width: "10px", height: "10px", background: "#1e293b", borderRadius: "50%" }}></div>
                <div style={{ width: "40px", height: "4px", background: "#334155", borderRadius: "4px" }}></div>
              </div>

              {/* Phone Screen Inside */}
              <div style={{
                flex: 1,
                background: "#f8fafc",
                borderRadius: "36px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                position: "relative"
              }}>
                {/* Mobile Header */}
                <div style={{
                  background: "linear-gradient(135deg, #1b383e 0%, #2f5961 100%)",
                  color: "#ffffff",
                  padding: "42px 16px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ position: "relative", width: "34px", height: "34px", borderRadius: "8px", overflow: "hidden", background: "#fff", border: "1.5px solid #aed8e0" }}>
                      <Image src="/logo.webp" alt="Candy Location" fill style={{ objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "800", lineHeight: "1.2" }}>كاندي لوكيشن</div>
                      <div
                        onClick={() => setAppScreen("branch_select")}
                        style={{ fontSize: "0.72rem", color: "#aed8e0", display: "flex", alignItems: "center", gap: "3px", cursor: "pointer" }}
                      >
                        <MapPin size={11} /> {selectedBranch} ▾
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => setAppScreen(appScreen === "cart" ? "shop" : "cart")}
                      style={{
                        position: "relative",
                        background: "rgba(255,255,255,0.15)",
                        border: "none",
                        color: "#fff",
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      <ShoppingCart size={18} />
                      {cart.reduce((acc, c) => acc + c.count, 0) > 0 && (
                        <span style={{
                          position: "absolute",
                          top: "-4px",
                          right: "-4px",
                          background: "#e11d48",
                          color: "#fff",
                          fontSize: "0.68rem",
                          fontWeight: "bold",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {cart.reduce((acc, c) => acc + c.count, 0)}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile Body Content */}
                <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* SCREEN 1: SHOP */}
                  {appScreen === "shop" && (
                    <>
                      {/* Banner */}
                      <div style={{
                        background: "linear-gradient(135deg, #def1f4 0%, #c2e4ea 100%)",
                        borderRadius: "16px",
                        padding: "12px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        border: "1px solid #aed8e0"
                      }}>
                        <div>
                          <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#1b383e" }}>توصيل فوري لجميع الفروع 🛵</div>
                          <div style={{ fontSize: "0.68rem", color: "#2f5961", marginTop: "2px" }}>حلويات طازجة يومياً من أفضل الأسر المنتجة</div>
                        </div>
                        <span style={{ fontSize: "1.8rem" }}>🍬</span>
                      </div>

                      {/* Quick Filter Categories */}
                      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                        {["الكل", "🍫 حلا فاخر", "🍃 ورق عنب", "🍰 أسر منتجة", "🥨 موالح", "🍿 فشارات"].map((cat, i) => (
                          <div
                            key={i}
                            style={{
                              background: i === 0 ? "var(--color-primary-reverse)" : "#ffffff",
                              color: i === 0 ? "#ffffff" : "#475569",
                              border: "1px solid #e2e8f0",
                              borderRadius: "20px",
                              padding: "4px 10px",
                              fontSize: "0.72rem",
                              fontWeight: "700",
                              whiteSpace: "nowrap",
                              cursor: "pointer"
                            }}
                          >
                            {cat}
                          </div>
                        ))}
                      </div>

                      {/* Product Feed */}
                      <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#1e293b", marginTop: "4px" }}>
                        الأصناف الأكثر طلباً ✨
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {[
                          { id: 1, name: "بوكس حلا الجمعات", price: 85, badge: "أسر منتجة", icon: "🍫" },
                          { id: 2, name: "تشيز كيك التوت الفاخر", price: 38, badge: "الأعلى تقييماً", icon: "🍰" },
                          { id: 3, name: "ورق عنب بدبس الرمان", price: 45, badge: "طازج يومياً", icon: "🍃" },
                          { id: 4, name: "بوكس موالح مشكل ميني", price: 65, badge: "مناسبات", icon: "🥨" },
                          { id: 5, name: "فشار كراميل وكرانشي", price: 22, badge: "سناك", icon: "🍿" },
                          { id: 6, name: "مشروب موهيتو بارد منعش", price: 18, badge: "بارد", icon: "🧋" }
                        ].map((prod) => {
                          const inCart = cart.find(c => c.id === prod.id);
                          return (
                            <div
                              key={prod.id}
                              style={{
                                background: "#ffffff",
                                borderRadius: "14px",
                                border: "1px solid #e2e8f0",
                                padding: "10px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                              }}
                            >
                              <div style={{ height: "65px", background: "#f1f5f9", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", position: "relative" }}>
                                {prod.icon}
                                <span style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(255,255,255,0.9)", fontSize: "0.6rem", padding: "1px 5px", borderRadius: "4px", fontWeight: "700", color: "#0f766e" }}>
                                  {prod.badge}
                                </span>
                              </div>
                              <div style={{ marginTop: "8px" }}>
                                <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#1e293b", lineHeight: "1.3", minHeight: "32px" }}>
                                  {prod.name}
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                                  <span style={{ fontSize: "0.85rem", fontWeight: "900", color: "#2f5961" }}>
                                    {prod.price} <small style={{ fontSize: "0.65rem" }}>ر.س</small>
                                  </span>

                                  {inCart ? (
                                    <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "#def1f4", borderRadius: "6px", padding: "2px 4px" }}>
                                      <button
                                        onClick={() => {
                                          if (inCart.count === 1) {
                                            setCart(cart.filter(c => c.id !== prod.id));
                                          } else {
                                            setCart(cart.map(c => c.id === prod.id ? { ...c, count: c.count - 1 } : c));
                                          }
                                        }}
                                        style={{ border: "none", background: "none", cursor: "pointer", display: "flex", color: "#1b383e" }}
                                      >
                                        <Minus size={12} />
                                      </button>
                                      <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>{inCart.count}</span>
                                      <button
                                        onClick={() => setCart(cart.map(c => c.id === prod.id ? { ...c, count: c.count + 1 } : c))}
                                        style={{ border: "none", background: "none", cursor: "pointer", display: "flex", color: "#1b383e" }}
                                      >
                                        <Plus size={12} />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setCart([...cart, { id: prod.id, name: prod.name, price: prod.price, count: 1, image: prod.icon }])}
                                      style={{
                                        background: "var(--color-primary-reverse)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        width: "26px",
                                        height: "26px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer"
                                      }}
                                    >
                                      <Plus size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* SCREEN 2: CART */}
                  {appScreen === "cart" && (
                    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: "800" }}>سلة المشتريات 🛍️</div>
                        <button
                          onClick={() => setAppScreen("shop")}
                          style={{ background: "none", border: "none", color: "#2f5961", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}
                        >
                          + إضافة المزيد
                        </button>
                      </div>

                      {cart.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 10px", color: "#94a3b8" }}>
                          <ShoppingCart size={40} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
                          <p style={{ fontSize: "0.85rem" }}>السلة فارغة حالياً</p>
                          <button
                            onClick={() => setAppScreen("shop")}
                            className="btn-primary"
                            style={{ marginTop: "12px", fontSize: "0.78rem", padding: "6px 14px" }}
                          >
                            تصفح المنتجات
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                            {cart.map((item) => (
                              <div
                                key={item.id}
                                style={{
                                  background: "#ffffff",
                                  borderRadius: "12px",
                                  padding: "8px 10px",
                                  border: "1px solid #e2e8f0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between"
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ fontSize: "1.4rem" }}>{item.image}</span>
                                  <div>
                                    <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#1e293b" }}>{item.name}</div>
                                    <div style={{ fontSize: "0.72rem", color: "#2f5961", fontWeight: "bold" }}>{item.price} ر.س</div>
                                  </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "#f1f5f9", borderRadius: "6px", padding: "2px 6px" }}>
                                    <button
                                      onClick={() => {
                                        if (item.count === 1) {
                                          setCart(cart.filter(c => c.id !== item.id));
                                        } else {
                                          setCart(cart.map(c => c.id === item.id ? { ...c, count: c.count - 1 } : c));
                                        }
                                      }}
                                      style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}
                                    >
                                      <Minus size={11} />
                                    </button>
                                    <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>{item.count}</span>
                                    <button
                                      onClick={() => setCart(cart.map(c => c.id === item.id ? { ...c, count: c.count + 1 } : c))}
                                      style={{ border: "none", background: "none", cursor: "pointer", display: "flex" }}
                                    >
                                      <Plus size={11} />
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => setCart(cart.filter(c => c.id !== item.id))}
                                    style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Branch & Order Summary */}
                          <div style={{ background: "#ffffff", borderRadius: "12px", padding: "10px", border: "1px solid #e2e8f0", fontSize: "0.75rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span style={{ color: "#64748b" }}>الفرع المختار:</span>
                              <span style={{ fontWeight: "700" }}>{selectedBranch}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span style={{ color: "#64748b" }}>المجموع الفرعي:</span>
                              <span>{cart.reduce((sum, i) => sum + i.price * i.count, 0)} ر.س</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span style={{ color: "#64748b" }}>رسوم التوصيل:</span>
                              <span style={{ color: "#16a34a", fontWeight: "bold" }}>مجاناً</span>
                            </div>
                            <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "6px", display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "0.85rem", color: "#1b383e" }}>
                              <span>الإجمالي النهائي:</span>
                              <span>{cart.reduce((sum, i) => sum + i.price * i.count, 0)} ر.س</span>
                            </div>
                          </div>

                          <button
                            onClick={() => setAppScreen("order_success")}
                            style={{
                              background: "linear-gradient(135deg, #1b383e 0%, #2f5961 100%)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "10px",
                              padding: "10px",
                              fontWeight: "700",
                              fontSize: "0.85rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              cursor: "pointer",
                              boxShadow: "0 4px 10px rgba(47, 89, 97, 0.3)"
                            }}
                          >
                            <CreditCard size={15} /> إتمام الطلب والدفع (سلة API)
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* SCREEN 3: BRANCH SELECT */}
                  {appScreen === "branch_select" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ fontSize: "0.95rem", fontWeight: "800" }}>اختر الفرع الأقرب إليك 📍</div>
                      <p style={{ fontSize: "0.72rem", color: "#64748b" }}>
                        يتم توجيه وتجهيز الطلب مباشرة من خلال الفرع المحدد أو خط التوصيل:
                      </p>

                      {[
                        { name: "الفرع الأول (الرئيسي)", address: "حي المروج - طريق الملك عبدالعزيز", status: "مفتوح حتى 12:00 ص" },
                        { name: "الفرع الثاني", address: "حي الياسمين - شارع أنس بن مالك", status: "مفتوح حتى 12:30 ص" },
                        { name: "الفرع الثالث", address: "حي الروضة - شارع حفصة بنت عمر", status: "مفتوح حتى 1:00 ص" },
                        { name: "خدمة التوصيل السريع (المستودع)", address: "تغطية شاملة لكافة الأحياء", status: "توصيل فوري 🛵" }
                      ].map((b, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedBranch(b.name);
                            setAppScreen("shop");
                          }}
                          style={{
                            background: selectedBranch === b.name ? "#def1f4" : "#ffffff",
                            border: `1.5px solid ${selectedBranch === b.name ? "var(--color-primary-reverse)" : "#e2e8f0"}`,
                            borderRadius: "12px",
                            padding: "10px 12px",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: "0.82rem", fontWeight: "800", color: "#1e293b" }}>{b.name}</div>
                            {selectedBranch === b.name && <CheckCircle2 size={15} color="#2f5961" />}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "2px" }}>{b.address}</div>
                          <div style={{ fontSize: "0.65rem", color: "#0d9488", fontWeight: "bold", marginTop: "4px" }}>{b.status}</div>
                        </div>
                      ))}

                      <button
                        onClick={() => setAppScreen("shop")}
                        style={{
                          background: "#e2e8f0",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          marginTop: "6px"
                        }}
                      >
                        رجوع للمتجر
                      </button>
                    </div>
                  )}

                  {/* SCREEN 4: ORDER SUCCESS */}
                  {appScreen === "order_success" && (
                    <div style={{ textAlign: "center", padding: "20px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircle2 size={32} />
                      </div>
                      <div style={{ fontSize: "1rem", fontWeight: "900", color: "#166534" }}>تم استقبال طلبك بنجاح! 🍬🎉</div>
                      <p style={{ fontSize: "0.72rem", color: "#64748b", lineHeight: "1.5" }}>
                        رقم الطلب: <strong style={{ color: "#1e293b" }}>#CL-8492</strong><br />
                        الفرع المسؤول: <strong>{selectedBranch}</strong><br />
                        تمت المزامنة فوراً مع نظام المستودع وسلة.
                      </p>

                      <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "10px", padding: "8px 12px", width: "100%", fontSize: "0.7rem", textAlign: "right" }}>
                        <div>💬 تم إرسال فاتورة وتتبع الطلب إلى واتساب الخاص بك.</div>
                        <div style={{ marginTop: "4px", color: "#25d366", fontWeight: "bold" }}>📱 خط التواصل الموحد: 0579772057</div>
                      </div>

                      <button
                        onClick={() => {
                          setCart([]);
                          setAppScreen("shop");
                        }}
                        className="btn-primary"
                        style={{ width: "100%", fontSize: "0.8rem", padding: "8px" }}
                      >
                        العودة للرئيسية والتسوق
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Bottom Navigation Bar */}
                <div style={{
                  background: "#ffffff",
                  borderTop: "1px solid #e2e8f0",
                  padding: "8px 16px 14px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center"
                }}>
                  <div
                    onClick={() => setAppScreen("shop")}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", color: appScreen === "shop" ? "var(--color-primary-reverse)" : "#94a3b8", cursor: "pointer", fontSize: "0.65rem", fontWeight: "700" }}
                  >
                    <Store size={18} />
                    <span>المتجر</span>
                  </div>

                  <div
                    onClick={() => setAppScreen("branch_select")}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", color: appScreen === "branch_select" ? "var(--color-primary-reverse)" : "#94a3b8", cursor: "pointer", fontSize: "0.65rem", fontWeight: "700" }}
                  >
                    <MapPin size={18} />
                    <span>الفروع</span>
                  </div>

                  <div
                    onClick={() => setAppScreen("cart")}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", color: appScreen === "cart" ? "var(--color-primary-reverse)" : "#94a3b8", cursor: "pointer", fontSize: "0.65rem", fontWeight: "700" }}
                  >
                    <ShoppingCart size={18} />
                    <span>السلة</span>
                  </div>

                  <div
                    onClick={() => setActiveTab("bot_preview")}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", color: "#94a3b8", cursor: "pointer", fontSize: "0.65rem", fontWeight: "700" }}
                  >
                    <MessageSquare size={18} />
                    <span>الوكيل</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid-cards">
            <div className="card">
              <div className="card-header">
                <div className="card-icon"><Store /></div>
                <div>
                  <div className="card-title">الموقع والهوية الرقمية</div>
                  <div className="card-badge status-ready">نشط ومحدث</div>
                </div>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">الدومين الرسمي:</span>
                  <span className="info-val">candylocation.com</span>
                </div>
                <div className="info-row">
                  <span className="info-label">المنصة الحالية:</span>
                  <span className="info-val">سلة (باقة بلس 99 ر.س)</span>
                </div>
                <div className="info-row">
                  <span className="info-label">الشعار اللفظي:</span>
                  <span className="info-val">أنسى الدنيا معنا، وتذوق من أجمل أصناف الحلويات</span>
                </div>
                <div className="info-row">
                  <span className="info-label">إنستقرام:</span>
                  <span className="info-val">@candylocationn</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon"><PhoneCall /></div>
                <div>
                  <div className="card-title">منظومة الاتصال الحالية</div>
                  <div className="card-badge status-planned">5 أرقام جوال</div>
                </div>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">رقم الموقع الرسمي:</span>
                  <span className="info-val" dir="ltr">0579772057</span>
                </div>
                <div className="info-row">
                  <span className="info-label">فروع المتجر:</span>
                  <span className="info-val">3 فروع (أرقام مباشرة)</span>
                </div>
                <div className="info-row">
                  <span className="info-label">خط التوصيل:</span>
                  <span className="info-val">1 رقم خاص للمناديب</span>
                </div>
                <div className="info-row">
                  <span className="info-label">الهدف المستقبلي:</span>
                  <span className="info-val">سنترال سحابي برقم موحد</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon"><Boxes /></div>
                <div>
                  <div className="card-title">إدارة العمليات والمخزون</div>
                  <div className="card-badge status-planned">إدارة مزدوجة</div>
                </div>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">مسؤول متجر سلة:</span>
                  <span className="info-val">إدارة المنتجات الإلكترونية</span>
                </div>
                <div className="info-row">
                  <span className="info-label">مسؤول المستودع:</span>
                  <span className="info-val">إدارة المخزون الفعلي</span>
                </div>
                <div className="info-row">
                  <span className="info-label">الحل المستهدف:</span>
                  <span className="info-val">مزامنة آلية عبر API سلة</span>
                </div>
                <div className="info-row">
                  <span className="info-label">الهدف:</span>
                  <span className="info-val">تفادي تعارض الكميات</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Architecture */}
        {activeTab === "architecture" && (
          <div className="grid-cards">
            <div className="card">
              <div className="card-header">
                <div className="card-icon"><Store /></div>
                <div className="card-title">1. تطبيق الجوال المستقبلي</div>
              </div>
              <div className="card-body">
                <p>تطبيق فائق السرعة مبني بأحدث التقنيات مع تجربة مستخدم سلسة:</p>
                <ul style={{ paddingRight: "1.2rem", marginTop: "8px", lineHeight: "1.8" }}>
                  <li>تصفح تفاعلي لأقسام الحلا والموالح.</li>
                  <li>تحديد تلقائي للفرع الأقرب للعميل.</li>
                  <li>خيارات استلام من الفرع أو التوصيل الفوري.</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon"><PhoneCall /></div>
                <div className="card-title">2. السنترال السحابي الموحد</div>
              </div>
              <div className="card-body">
                <p>تحويل كافة الاتصالات الواردة للرقم الموحد عبر نظام رد آلي (IVR):</p>
                <ul style={{ paddingRight: "1.2rem", marginTop: "8px", lineHeight: "1.8" }}>
                  <li>توجيه المتصل للفروع الثلاثة حسب الرغبة.</li>
                  <li>تحويل فوري لقسم التوصيل والمناديب.</li>
                  <li>تسجيل وتوثيق المكالمات وقياس جودة الخدمة.</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon"><Bot /></div>
                <div className="card-title">3. وكيل واتساب الهجين</div>
              </div>
              <div className="card-body">
                <p>مساعد ذكي يجمع بين الذكاء الاصطناعي والدعم البشري:</p>
                <ul style={{ paddingRight: "1.2rem", marginTop: "8px", lineHeight: "1.8" }}>
                  <li>ردود فورية على استفسارات الأسعار والقوائم.</li>
                  <li>تتبع حالة الطلبات ومواعيد العمل.</li>
                  <li>تحويل سلس للموظف البشري في الحالات الخاصة.</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon"><Boxes /></div>
                <div className="card-title">4. ربط API سلة والمستودع</div>
              </div>
              <div className="card-body">
                <p>ربط سحابي متزامن بين المتجر والمستودع الفعلي:</p>
                <ul style={{ paddingRight: "1.2rem", marginTop: "8px", lineHeight: "1.8" }}>
                  <li>تحديث فوري لكميات المخزون فور أي عملية بيع.</li>
                  <li>منع نفاذ المنتجات أو بيع كميات غير متوفرة.</li>
                  <li>لوحة موحدة لمدير المستودع ومدير المتجر.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Contacts */}
        {activeTab === "contacts" && (
          <div className="grid-cards">
            <div className="card" style={{ borderTop: "4px solid #5da9b7" }}>
              <div className="card-header">
                <div className="card-icon"><PhoneCall /></div>
                <div>
                  <div className="card-title">الرقم الموحد والموقع</div>
                  <div className="card-badge status-ready">الرقم الرئيسي</div>
                </div>
              </div>
              <div className="card-body">
                <p>الرقم الأساسي المعتمد للمتجر الإلكتروني والموقع:</p>
                <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--primary-dark)", margin: "10px 0", direction: "ltr", textAlign: "right" }}>
                  +966 57 977 2057
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  يعمل كواجهة للواتساب والموقع وسيتم دمجه مع السنترال السحابي الموحد.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon"><MapPin /></div>
                <div>
                  <div className="card-title">أرقام الفروع الـ 3</div>
                  <div className="card-badge status-planned">3 فروع</div>
                </div>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">الفرع الأول:</span>
                  <span className="info-val">مخصص للطلبات والاستلام</span>
                </div>
                <div className="info-row">
                  <span className="info-label">الفرع الثاني:</span>
                  <span className="info-val">مخصص للطلبات والاستلام</span>
                </div>
                <div className="info-row">
                  <span className="info-label">الفرع الثالث:</span>
                  <span className="info-val">مخصص للطلبات والاستلام</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "8px" }}>
                  يتم التحويل التلقائي إليها عبر الرقم الموحد دون حاجة العميل لحفظ أرقام متعددة.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon"><Truck /></div>
                <div>
                  <div className="card-title">رقم التوصيل والمناديب</div>
                  <div className="card-badge status-ready">رقم تشغيلي</div>
                </div>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">الاستخدام:</span>
                  <span className="info-val">تنسيق وتوجيه مناديب التوصيل</span>
                </div>
                <div className="info-row">
                  <span className="info-label">التكامل:</span>
                  <span className="info-val">تحويل مباشر لطلبات التوصيل</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "8px" }}>
                  ربط ذكي لتوزيع الطلبات حسب الأحياء والمناطق القريبة من الفروع.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Products */}
        {activeTab === "products" && (
          <div className="grid-cards">
            {[
              { name: "اسر منتجة", desc: "أجود أصناف الحلويات والمعجنات المنزلية المختارة بعناية فائقة", icon: "🍰" },
              { name: "حلا", desc: "كيكات فاخرة، بوكسات الجمعات، وحلويات شرقية وغربية متنوعة", icon: "🍫" },
              { name: "ورق عنب", desc: "ورق عنب وملفوف بخلطات ودبس رمان وصوصات شهية", icon: "🍃" },
              { name: "موالح", desc: "ميني ساندوتشات، معجنات، وفطاير طازجة للمناسبات", icon: "🥨" },
              { name: "فشارات", desc: "فشار بنكهات مبتكرة تناسب كافة الأذواق والجمعات", icon: "🍿" },
              { name: "مشروبات", desc: "مشروبات منعشة وباردة متميزة تكمل تجربة الحلا", icon: "🧋" }
            ].map((cat, idx) => (
              <div key={idx} className="card">
                <div className="card-header">
                  <div className="card-icon" style={{ fontSize: "1.6rem" }}>{cat.icon}</div>
                  <div className="card-title">{cat.name}</div>
                </div>
                <div className="card-body">
                  <p>{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: WhatsApp Simulator */}
        {activeTab === "bot_preview" && (
          <div className="simulator-box">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              <div className="card-icon" style={{ background: "#25d366", color: "white" }}>
                <MessageSquare />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>محاكي وكيل واتساب الذكي (Candy Location Hybrid Bot)</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  جرّب التفاعل الذكي: اسأل عن الفروع، المنيو، التوصيل، أو اطلب تحويل لموظف بشري!
                </p>
              </div>
            </div>

            <div style={{ background: "#efeae2", borderRadius: "12px", padding: "1.5rem", minHeight: "260px", maxHeight: "380px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
              {chatLog.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-start" : "flex-end",
                    background: msg.sender === "user" ? "#d9fdd3" : "#ffffff",
                    padding: "10px 16px",
                    borderRadius: "12px",
                    maxWidth: "75%",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    fontSize: "0.95rem",
                    lineHeight: "1.5"
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
              <input
                type="text"
                value={botMessage}
                onChange={(e) => setBotMessage(e.target.value)}
                placeholder="اكتب رسالتك للتجربة (مثال: ايش عندكم حلا؟ أو وين فروعكم؟)"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  fontFamily: "inherit",
                  fontSize: "0.95rem"
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "auto", margin: 0, padding: "0 24px" }}
              >
                <Send size={18} /> إرسال
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div>
          جميع الحقوق محفوظة لـ <strong>كاندي لوكيشن (Candy Location)</strong> © 2026
        </div>
        <div style={{ marginTop: "6px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          المركز الرقمي التفاعلي - تمهيداً لتطوير التطبيق المخصص والأنظمة السحابية
        </div>
      </footer>
    </div>
  );
}

