# لوحة تحكم الدعم الفني · Tech Support Dashboard

<div dir="rtl" align="right">

واجهة ويب حديثة لإدارة عمليات الدعم الفني والمؤسسات التعليمية — تذاكر، تقارير، تدقيق، مواعيد، ومحتوى مجتمعي — مع تجربة استخدام عربية (RTL) ولوحة جانبية موحّدة.

</div>

<p align="center">
  <a href="https://nextjs.org/" title="Next.js">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 15" />
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/i18next-26A69A?style=flat-square&logo=i18next&logoColor=white" alt="i18next" />
</p>

---

## المزايا الرئيسية

| | |
|:---|:---|
| 🏠 **الرئيسية** | نظرة عامة سريعة على لوحة التحكم |
| 🎓 **إدارة الجامعات** | إدارة المؤسسات التعليمية المرتبطة بالنظام |
| 💾 **النسخ الاحتياطي** | إدارة النسخ الاحتياطي والموارد التخزينية |
| 👥 **الحسابات** | إدارة المستخدمين والصلاحيات |
| 💬 **تذاكر الدعم الفني** | متابعة طلبات الدعم والتواصل |
| 📜 **سجلات التدقيق** | مراجعة الأنشطة وسجل النظام |
| 🗂️ **الحالات السريرية** | عرض وإدارة الحالات المرتبطة بالعمل |
| 📅 **المواعيد** | جدولة ومتابعة المواعيد |
| 🌐 **المحتوى المجتمعي** | المحتوى والتفاعلات المجتمعية |
| 📎 **المرفقات** | رفع وعرض الملفات والمرفقات |
| 📊 **التقارير** | تقارير ولوحات بيانات تشغيلية |
| 🔔 **الإشعارات** | تنبيهات وحديثات للمستخدمين |
| ⭐ **التقييمات** | تقييمات الأداء والجودة |
| 👤 **الملف الشخصي** | إعدادات الحساب والهوية |

> صفحات إضافية في المشروع (مثل المراقبة، التشخيص، والرسائل) توسّع نطاق النظام حسب المسارات المتاحة في `src/app/`.

---

## التقنيات المستخدمة

- **Next.js (App Router)** — تطبيق ويب سريع مع توجيه حديث
- **React 19** — واجهة تفاعلية
- **Redux Toolkit** — إدارة حالة مركزية للبيانات والجلسات
- **Axios** — طلبات HTTP للواجهات الخلفية
- **Tailwind CSS 4** — تنسيق سريع ومتسق
- **Recharts** — رسوم بيانية للتقارير
- **Framer Motion** — حركات وانتقالات سلسة
- **i18next / react-i18next** — دعم تعدد اللغات
- **Lucide React & Heroicons** — أيقونات واجهة موحّدة
- **Headless UI** — مكوّنات قابلة للوصول

---

## المتطلبات

- [Node.js](https://nodejs.org/) **18+** (يُنصح بأحدث إصدار LTS)
- مدير حزم: `npm` أو `yarn` أو `pnpm` أو `bun`

---

## التشغيل السريع

```bash
# تثبيت الاعتمادات
npm install

# بيئة التطوير (http://localhost:3000)
npm run dev
```

```bash
# بناء الإنتاج
npm run build

# تشغيل نسخة الإنتاج محلياً
npm start
```

```bash
# فحص جودة الكود
npm run lint
```

---

## هيكل المشروع (مختصر)

```
src/
├── app/              # صفحات ومسارات Next.js (App Router)
├── components/       # مكوّنات واجهة مشتركة (مثل الشريط الجانبي)
├── redux/            # مخازن وتخفيضات Redux
├── api/              # طبقة الاتصال بالواجهات البرمجية
└── ...
```

---

## النشر

يمكن نشر التطبيق على [Vercel](https://vercel.com/) أو أي منصة تدعم تطبيقات Node.js. راجع [توثيق نشر Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

---

## الترخيص

هذا المستودع **خاص** (`"private": true` في `package.json`) — الاستخدام والتوزيع يخضع لسياسة مؤسستك.

---

<p align="center">
  مبني بـ <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white" height="18" alt="Next.js" /> — لوحة تحكم <strong>ITSUPPORT</strong>
</p>
