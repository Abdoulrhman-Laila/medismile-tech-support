# 🔧 إعداد ملف Environment Variables

## خطوات الإعداد

### 1. إنشاء ملف `.env.local`

قم بإنشاء ملف `.env.local` في المجلد الرئيسي للمشروع (`tech-support-dashboard/`) وأضف التالي:

```env
# Production API Base URL
NEXT_PUBLIC_API_BASE_URL=https://medismile1-production.up.railway.app/api/v1
```

### 2. للتطوير المحلي

إذا كنت تريد استخدام Backend محلي، استخدم:

```env
# Local Development API Base URL
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### 3. ملاحظات مهمة

- ملف `.env.local` موجود في `.gitignore` ولن يتم رفعه إلى Git
- بعد إنشاء أو تعديل ملف `.env.local`، يجب إعادة تشغيل Next.js dev server
- جميع ملفات API تستخدم `NEXT_PUBLIC_API_BASE_URL` تلقائياً
- إذا لم يتم تحديد المتغير، سيتم استخدام `http://127.0.0.1:8000/api/v1` كقيمة افتراضية

### 4. الملفات التي تستخدم API_BASE_URL

- `src/api/axios.js` - للجامعات
- `src/api/accountsAxios.js` - للحسابات
- `src/api/coursesAxios.js` - للمقررات

جميع هذه الملفات تستخدم `process.env.NEXT_PUBLIC_API_BASE_URL` بشكل تلقائي.









