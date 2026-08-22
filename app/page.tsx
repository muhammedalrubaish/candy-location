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
  MessageSquare
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "contacts" | "products" | "bot_preview">("overview");
  const [botMessage, setBotMessage] = useState("");
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
          <a
            href="https://candylocation.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ width: "auto", margin: 0 }}
          >
            زيارة المتجر الحالي <ExternalLink size={16} />
          </a>
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

