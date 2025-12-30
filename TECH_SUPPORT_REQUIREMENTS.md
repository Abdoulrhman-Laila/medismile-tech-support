# 📋 متطلبات ربط دورة حياة الدعم التقني (Tech Support)

## 🔍 تحليل المشروع الحالي

### ✅ ما هو موجود حالياً:

#### 1. **APIs موجودة:**
- ✅ `src/api/accountsApi.js` - APIs إدارة حسابات الدعم التقني
  - `fetchTechSupport()` - جلب قائمة الدعم التقني
  - `getTechSupportDetails()` - تفاصيل عضو دعم تقني
  - `createTechSupport()` - إنشاء عضو دعم تقني
  - `updateTechSupport()` - تحديث عضو دعم تقني
  - `deleteTechSupport()` - حذف عضو دعم تقني
- ✅ `src/api/accountsAxios.js` - Axios instance للمصادقة
- ✅ `src/api/axios.js` - Axios instance للجامعات
- ✅ `src/api/coursesAxios.js` - Axios instance للمقررات

#### 2. **Redux Slices موجودة:**
- ✅ `src/redux/slices/authSlice.js` - إدارة المصادقة
- ✅ `src/redux/slices/accountsSlice.js` - إدارة الحسابات (يشمل الدعم التقني)
- ✅ `src/redux/store.js` - Redux store

#### 3. **الصفحات الموجودة:**
- ✅ `src/app/accounts/page.jsx` - صفحة إدارة الحسابات (تشمل الدعم التقني)
- ✅ `src/app/login/page.jsx` - صفحة تسجيل الدخول
- ✅ `src/app/page.js` - الصفحة الرئيسية

#### 4. **المكونات الموجودة:**
- ✅ `src/components/ProtectedRoute.jsx` - حماية الصفحات
- ✅ `src/components/Sidebar.jsx` - القائمة الجانبية
- ✅ `src/components/AppLayout.jsx` - تخطيط التطبيق

---

## ❌ ما هو مفقود ويحتاج إلى إضافته:

### 1. **APIs مفقودة (يجب إنشاؤها):**

#### أ) **وحدة الدعم الفني (Support Tickets):**
```
src/api/supportApi.js
```
**الوظائف المطلوبة:**
- `fetchTickets()` - GET /api/support/tickets/
- `getTicketDetails(ticketId)` - GET /api/support/tickets/<ticket_id>/
- `createTicket(data)` - POST /api/support/tickets/
- `updateTicket(ticketId, data)` - PATCH /api/support/tickets/<ticket_id>/
- `fetchTicketResponses(ticketId)` - GET /api/support/tickets/<ticket_id>/responses/
- `addTicketResponse(ticketId, data)` - POST /api/support/tickets/<ticket_id>/responses/
- `getSupportAnalytics()` - GET /api/support/analytics/overview/

#### ب) **وحدة التقارير (Reports):**
```
src/api/reportsApi.js
```
**الوظائف المطلوبة:**
- `fetchReports(params)` - GET /api/reports/
- `getReportDetails(reportId)` - GET /api/reports/<report_id>/
- `createReport(data)` - POST /api/reports/
- `updateReportStatus(reportId, isActive)` - PATCH /api/reports/<report_id>/
- `fetchStudentReports(studentId)` - GET /api/reports/students/<student_id>/
- `fetchUniversityReports(universityId)` - GET /api/reports/universities/<university_id>/

#### ج) **وحدة التدقيق (Audit):**
```
src/api/auditApi.js
```
**الوظائف المطلوبة:**
- `fetchAuditLogs(params)` - GET /api/audit/logs/
- `getAuditStatistics()` - GET /api/audit/statistics/

#### د) **وحدة الحالات السريرية (Cases) - للقراءة فقط:**
```
src/api/casesApi.js
```
**الوظائف المطلوبة:**
- `fetchCases(params)` - GET /api/cases/
- `getCaseDetails(caseId)` - GET /api/cases/<case_id>/

#### هـ) **وحدة المواعيد (Appointments) - للقراءة فقط:**
```
src/api/appointmentsApi.js
```
**الوظائف المطلوبة:**
- `fetchAppointments(params)` - GET /api/appointments/
- `getAppointmentDetails(appointmentId)` - GET /api/appointments/<appointment_id>/

#### و) **وحدة الإشعارات (Notifications) - للقراءة فقط:**
```
src/api/notificationsApi.js
```
**الوظائف المطلوبة:**
- `fetchNotifications(params)` - GET /api/notifications/
- `getNotificationDetails(notificationId)` - GET /api/notifications/<notification_id>/
- `getUnreadCount()` - GET /api/notifications/actions/unread-count/
- `markAllAsRead()` - POST /api/notifications/actions/mark-all-read/
- `toggleReadStatus(notificationId)` - POST /api/notifications/<notification_id>/actions/toggle-read/

#### ز) **وحدة التقييمات (Evaluations) - للقراءة فقط:**
```
src/api/evaluationsApi.js
```
**الوظائف المطلوبة:**
- `fetchEvaluations(params)` - GET /api/evaluations/
- `getEvaluationDetails(evaluationId)` - GET /api/evaluations/<evaluation_id>/
- `getStudentStatistics(studentId)` - GET /api/evaluations/students/<student_id>/statistics/

#### ح) **وحدة المحتوى المجتمعي (Community) - للقراءة فقط:**
```
src/api/communityApi.js
```
**الوظائف المطلوبة:**
- `fetchContent(params)` - GET /api/community/
- `getContentDetails(contentId)` - GET /api/community/<content_id>/
- `getTrendingContent()` - GET /api/community/trending/

#### ط) **وحدة المرفقات (Attachments) - للقراءة فقط:**
```
src/api/attachmentsApi.js
```
**الوظائف المطلوبة:**
- `fetchAttachments(params)` - GET /api/attachments/
- `getAttachmentDetails(attachmentId)` - GET /api/attachments/<attachment_id>/
- `downloadAttachment(attachmentId)` - GET /api/attachments/<attachment_id>/download/
- `previewAttachment(attachmentId)` - GET /api/attachments/<attachment_id>/preview/

#### ي) **وحدة الذكاء الاصطناعي (AI) - للقراءة فقط:**
```
src/api/aiApi.js
```
**الوظائف المطلوبة:**
- `fetchDiagnoses(params)` - GET /api/ai/diagnoses/
- `getDiagnosisDetails(diagnosisId)` - GET /api/ai/diagnoses/<diagnosis_id>/

---

### 2. **Axios Instances مفقودة (يجب إنشاؤها):**

#### أ) **Support Axios:**
```
src/api/supportAxios.js
```
- Axios instance خاص بوحدة الدعم الفني
- إضافة Token تلقائياً
- معالجة الأخطاء

#### ب) **Reports Axios:**
```
src/api/reportsAxios.js
```
- Axios instance خاص بوحدة التقارير
- إضافة Token تلقائياً
- معالجة الأخطاء

#### ج) **Audit Axios:**
```
src/api/auditAxios.js
```
- Axios instance خاص بوحدة التدقيق
- إضافة Token تلقائياً
- معالجة الأخطاء

#### د) **Cases Axios:**
```
src/api/casesAxios.js
```
- Axios instance خاص بوحدة الحالات
- إضافة Token تلقائياً
- معالجة الأخطاء

#### هـ) **Appointments Axios:**
```
src/api/appointmentsAxios.js
```
- Axios instance خاص بوحدة المواعيد
- إضافة Token تلقائياً
- معالجة الأخطاء

#### و) **Notifications Axios:**
```
src/api/notificationsAxios.js
```
- Axios instance خاص بوحدة الإشعارات
- إضافة Token تلقائياً
- معالجة الأخطاء

#### ز) **Evaluations Axios:**
```
src/api/evaluationsAxios.js
```
- Axios instance خاص بوحدة التقييمات
- إضافة Token تلقائياً
- معالجة الأخطاء

#### ح) **Community Axios:**
```
src/api/communityAxios.js
```
- Axios instance خاص بوحدة المحتوى المجتمعي
- إضافة Token تلقائياً
- معالجة الأخطاء

#### ط) **Attachments Axios:**
```
src/api/attachmentsAxios.js
```
- Axios instance خاص بوحدة المرفقات
- إضافة Token تلقائياً
- معالجة الأخطاء

#### ي) **AI Axios:**
```
src/api/aiAxios.js
```
- Axios instance خاص بوحدة الذكاء الاصطناعي
- إضافة Token تلقائياً
- معالجة الأخطاء

---

### 3. **Redux Slices مفقودة (يجب إنشاؤها):**

#### أ) **Support Slice:**
```
src/redux/slices/supportSlice.js
```
**الحالة الأولية:**
```javascript
{
  tickets: [],
  currentTicket: null,
  responses: [],
  analytics: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    priority: null,
    category: null,
  }
}
```

**Thunks المطلوبة:**
- `fetchTickets` - جلب قائمة التذاكر
- `getTicketDetails` - تفاصيل تذكرة
- `createTicket` - إنشاء تذكرة (للمستخدمين العاديين)
- `updateTicket` - تحديث تذكرة (للدعم الفني فقط)
- `fetchTicketResponses` - جلب ردود التذكرة
- `addTicketResponse` - إضافة رد
- `getSupportAnalytics` - إحصائيات الدعم

#### ب) **Reports Slice:**
```
src/redux/slices/reportsSlice.js
```
**الحالة الأولية:**
```javascript
{
  reports: [],
  currentReport: null,
  studentReports: [],
  universityReports: [],
  loading: false,
  error: null,
  filters: {
    student_id: null,
    university_id: null,
    report_type: null,
    is_active: true,
  }
}
```

**Thunks المطلوبة:**
- `fetchReports` - جلب قائمة التقارير
- `getReportDetails` - تفاصيل تقرير
- `createReport` - إنشاء تقرير
- `updateReportStatus` - تحديث حالة التقرير (إخفاء/إظهار)
- `fetchStudentReports` - تقارير طالب محدد
- `fetchUniversityReports` - تقارير جامعة محددة

#### ج) **Audit Slice:**
```
src/redux/slices/auditSlice.js
```
**الحالة الأولية:**
```javascript
{
  logs: [],
  statistics: null,
  loading: false,
  error: null,
  filters: {
    user_id: null,
    action: null,
    content_type: null,
    start_date: null,
    end_date: null,
    search: null,
  }
}
```

**Thunks المطلوبة:**
- `fetchAuditLogs` - جلب سجلات التدقيق
- `getAuditStatistics` - إحصائيات التدقيق

#### د) **Cases Slice (للقراءة فقط):**
```
src/redux/slices/casesSlice.js
```
**الحالة الأولية:**
```javascript
{
  cases: [],
  currentCase: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    priority: null,
    is_public: null,
  }
}
```

**Thunks المطلوبة:**
- `fetchCases` - جلب قائمة الحالات
- `getCaseDetails` - تفاصيل حالة

#### هـ) **Appointments Slice (للقراءة فقط):**
```
src/redux/slices/appointmentsSlice.js
```
**الحالة الأولية:**
```javascript
{
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    case_id: null,
  }
}
```

**Thunks المطلوبة:**
- `fetchAppointments` - جلب قائمة المواعيد
- `getAppointmentDetails` - تفاصيل موعد

#### و) **Notifications Slice (للقراءة فقط):**
```
src/redux/slices/notificationsSlice.js
```
**الحالة الأولية:**
```javascript
{
  notifications: [],
  currentNotification: null,
  unreadCount: 0,
  loading: false,
  error: null,
  filters: {
    type: null,
    status: null,
    is_read: null,
    appointment_id: null,
  },
  pagination: {
    page: 1,
    page_size: 20,
    count: 0,
    next: null,
    previous: null,
  }
}
```

**Thunks المطلوبة:**
- `fetchNotifications` - جلب قائمة الإشعارات
- `getNotificationDetails` - تفاصيل إشعار
- `getUnreadCount` - عدد الإشعارات غير المقروءة
- `markAllAsRead` - تعليم جميع الإشعارات كمقروءة
- `toggleReadStatus` - تبديل حالة القراءة

#### ز) **Evaluations Slice (للقراءة فقط):**
```
src/redux/slices/evaluationsSlice.js
```
**الحالة الأولية:**
```javascript
{
  evaluations: [],
  currentEvaluation: null,
  studentStatistics: null,
  loading: false,
  error: null,
  filters: {
    student_id: null,
    target_type: null,
    status: null,
  }
}
```

**Thunks المطلوبة:**
- `fetchEvaluations` - جلب قائمة التقييمات
- `getEvaluationDetails` - تفاصيل تقييم
- `getStudentStatistics` - إحصائيات طالب

#### ح) **Community Slice (للقراءة فقط):**
```
src/redux/slices/communitySlice.js
```
**الحالة الأولية:**
```javascript
{
  content: [],
  currentContent: null,
  trendingContent: [],
  loading: false,
  error: null,
  filters: {
    type: null,
    category: null,
    university: null,
    featured: null,
    status: null,
    order_by: null,
  }
}
```

**Thunks المطلوبة:**
- `fetchContent` - جلب قائمة المحتوى
- `getContentDetails` - تفاصيل محتوى
- `getTrendingContent` - المحتوى الرائج

#### ط) **Attachments Slice (للقراءة فقط):**
```
src/redux/slices/attachmentsSlice.js
```
**الحالة الأولية:**
```javascript
{
  attachments: [],
  currentAttachment: null,
  loading: false,
  error: null,
  filters: {
    case_session_id: null,
  }
}
```

**Thunks المطلوبة:**
- `fetchAttachments` - جلب قائمة المرفقات
- `getAttachmentDetails` - تفاصيل مرفق

#### ي) **AI Slice (للقراءة فقط):**
```
src/redux/slices/aiSlice.js
```
**الحالة الأولية:**
```javascript
{
  diagnoses: [],
  currentDiagnosis: null,
  loading: false,
  error: null,
  filters: {
    case_id: null,
    status: null,
  }
}
```

**Thunks المطلوبة:**
- `fetchDiagnoses` - جلب قائمة التشخيصات
- `getDiagnosisDetails` - تفاصيل تشخيص

---

### 4. **تحديث Redux Store:**
```
src/redux/store.js
```
**يجب إضافة:**
- `support: supportReducer`
- `reports: reportsReducer`
- `audit: auditReducer`
- `cases: casesReducer`
- `appointments: appointmentsReducer`
- `notifications: notificationsReducer`
- `evaluations: evaluationsReducer`
- `community: communityReducer`
- `attachments: attachmentsReducer`
- `ai: aiReducer`

---

### 5. **الصفحات المفقودة (يجب إنشاؤها):**

#### أ) **صفحة إدارة الدعم الفني:**
```
src/app/support/page.jsx
```
**المميزات:**
- عرض قائمة تذاكر الدعم
- فلترة حسب الحالة، الأولوية، الفئة
- إنشاء تذكرة جديدة (للمستخدمين العاديين)
- عرض تفاصيل التذكرة
- الرد على التذاكر
- عرض إحصائيات الدعم

#### ب) **صفحة إدارة التقارير:**
```
src/app/reports/page.jsx
```
**المميزات:**
- عرض قائمة التقارير
- فلترة حسب الطالب، الجامعة، نوع التقرير
- إنشاء تقرير جديد
- عرض تفاصيل التقرير
- إخفاء/إظهار التقارير

#### ج) **صفحة التدقيق:**
```
src/app/audit/page.jsx
```
**المميزات:**
- عرض سجلات التدقيق
- فلترة حسب المستخدم، الإجراء، التاريخ
- عرض إحصائيات التدقيق
- تصدير السجلات

#### د) **صفحة الحالات السريرية (للقراءة فقط):**
```
src/app/cases/page.jsx
```
**المميزات:**
- عرض قائمة الحالات
- فلترة حسب الحالة، الأولوية
- عرض تفاصيل الحالة
- عرض السجل الكامل (History)

#### هـ) **صفحة المواعيد (للقراءة فقط):**
```
src/app/appointments/page.jsx
```
**المميزات:**
- عرض قائمة المواعيد
- فلترة حسب الحالة، الحالة
- عرض تفاصيل الموعد

#### و) **صفحة الإشعارات:**
```
src/app/notifications/page.jsx
```
**المميزات:**
- عرض قائمة الإشعارات
- فلترة حسب النوع، الحالة، القراءة
- عرض تفاصيل الإشعار
- تعليم جميع الإشعارات كمقروءة
- عداد الإشعارات غير المقروءة

#### ز) **صفحة التقييمات (للقراءة فقط):**
```
src/app/evaluations/page.jsx
```
**المميزات:**
- عرض قائمة التقييمات
- فلترة حسب الطالب، نوع الهدف، الحالة
- عرض تفاصيل التقييم
- عرض إحصائيات الطالب

#### ح) **صفحة المحتوى المجتمعي (للقراءة فقط):**
```
src/app/community/page.jsx
```
**المميزات:**
- عرض قائمة المحتوى
- فلترة حسب النوع، الفئة، الجامعة
- عرض تفاصيل المحتوى
- عرض المحتوى الرائج

#### ط) **صفحة المرفقات (للقراءة فقط):**
```
src/app/attachments/page.jsx
```
**المميزات:**
- عرض قائمة المرفقات
- فلترة حسب جلسة العلاج
- عرض تفاصيل المرفق
- تحميل ومعاينة المرفقات

#### ي) **صفحة تشخيصات AI (للقراءة فقط):**
```
src/app/ai-diagnoses/page.jsx
```
**المميزات:**
- عرض قائمة التشخيصات
- فلترة حسب الحالة، حالة التشخيص
- عرض تفاصيل التشخيص

---

### 6. **المكونات المفقودة (يجب إنشاؤها):**

#### أ) **مكونات الدعم الفني:**
```
src/components/support/
  - TicketCard.jsx - بطاقة تذكرة
  - TicketForm.jsx - نموذج إنشاء/تحديث تذكرة
  - TicketDetails.jsx - تفاصيل التذكرة
  - ResponseList.jsx - قائمة الردود
  - ResponseForm.jsx - نموذج إضافة رد
  - SupportAnalytics.jsx - إحصائيات الدعم
  - TicketFilters.jsx - فلاتر التذاكر
```

#### ب) **مكونات التقارير:**
```
src/components/reports/
  - ReportCard.jsx - بطاقة تقرير
  - ReportForm.jsx - نموذج إنشاء تقرير
  - ReportDetails.jsx - تفاصيل التقرير
  - ReportFilters.jsx - فلاتر التقارير
```

#### ج) **مكونات التدقيق:**
```
src/components/audit/
  - AuditLogCard.jsx - بطاقة سجل تدقيق
  - AuditFilters.jsx - فلاتر السجلات
  - AuditStatistics.jsx - إحصائيات التدقيق
```

#### د) **مكونات مشتركة:**
```
src/components/shared/
  - DataTable.jsx - جدول بيانات قابل لإعادة الاستخدام
  - FilterBar.jsx - شريط الفلاتر
  - Pagination.jsx - التصفح
  - StatusBadge.jsx - شارة الحالة
  - PriorityBadge.jsx - شارة الأولوية
  - EmptyState.jsx - حالة فارغة
  - LoadingState.jsx - حالة التحميل
  - ErrorState.jsx - حالة الخطأ
```

---

### 7. **تحديثات مطلوبة على الملفات الموجودة:**

#### أ) **تحديث Sidebar:**
```
src/components/Sidebar.jsx
```
**إضافة عناصر القائمة:**
- إدارة الدعم الفني (`/support`)
- إدارة التقارير (`/reports`)
- التدقيق (`/audit`)
- الحالات السريرية (`/cases`) - للقراءة فقط
- المواعيد (`/appointments`) - للقراءة فقط
- الإشعارات (`/notifications`)
- التقييمات (`/evaluations`) - للقراءة فقط
- المحتوى المجتمعي (`/community`) - للقراءة فقط
- المرفقات (`/attachments`) - للقراءة فقط
- تشخيصات AI (`/ai-diagnoses`) - للقراءة فقط

#### ب) **تحديث الصفحة الرئيسية:**
```
src/app/page.js
```
**إضافة روابط سريعة:**
- إدارة الدعم الفني
- إدارة التقارير
- التدقيق

#### ج) **تحديث accountsAxios:**
```
src/api/accountsAxios.js
```
**إضافة endpoints عامة:**
- `accounts/system/tech-support/create/` - في قائمة publicEndpoints (إذا لزم الأمر)

---

### 8. **ملفات مساعدة مفقودة:**

#### أ) **Utilities:**
```
src/lib/utils/
  - dateUtils.js - دوال التعامل مع التواريخ
  - formatUtils.js - دوال التنسيق
  - validationUtils.js - دوال التحقق
  - constants.js - الثوابت المشتركة
```

#### ب) **Constants:**
```
src/lib/constants/
  - ticketStatus.js - حالات التذاكر
  - ticketPriority.js - أولويات التذاكر
  - ticketCategory.js - فئات التذاكر
  - reportTypes.js - أنواع التقارير
  - auditActions.js - أنواع إجراءات التدقيق
  - caseStatus.js - حالات الحالات
  - appointmentStatus.js - حالات المواعيد
  - notificationTypes.js - أنواع الإشعارات
  - evaluationStatus.js - حالات التقييمات
  - contentTypes.js - أنواع المحتوى
  - attachmentTypes.js - أنواع المرفقات
```

---

### 9. **تحديثات على المصادقة:**

#### أ) **تحديث authSlice:**
```
src/redux/slices/authSlice.js
```
**التحقق من:**
- تسجيل إجراء `login` في Audit Log (إذا كان متاحاً)
- تسجيل إجراء `logout` في Audit Log (إذا كان متاحاً)

#### ب) **تحديث ProtectedRoute:**
```
src/components/ProtectedRoute.jsx
```
**التحقق من:**
- صلاحيات الدعم التقني
- إعادة التوجيه المناسبة

---

### 10. **ملفات التكوين:**

#### أ) **تحديث env.example:**
```
env.example
```
**التحقق من:**
- ✅ تم تحديث base URL (بدون `/v1`)

#### ب) **تحديث ENV_SETUP.md:**
```
ENV_SETUP.md
```
**التحقق من:**
- ✅ تم تحديث التوثيق

---

## 📊 ملخص المتطلبات:

### **ملفات API جديدة (10 ملفات):**
1. `src/api/supportApi.js`
2. `src/api/reportsApi.js`
3. `src/api/auditApi.js`
4. `src/api/casesApi.js`
5. `src/api/appointmentsApi.js`
6. `src/api/notificationsApi.js`
7. `src/api/evaluationsApi.js`
8. `src/api/communityApi.js`
9. `src/api/attachmentsApi.js`
10. `src/api/aiApi.js`

### **Axios Instances جديدة (10 ملفات):**
1. `src/api/supportAxios.js`
2. `src/api/reportsAxios.js`
3. `src/api/auditAxios.js`
4. `src/api/casesAxios.js`
5. `src/api/appointmentsAxios.js`
6. `src/api/notificationsAxios.js`
7. `src/api/evaluationsAxios.js`
8. `src/api/communityAxios.js`
9. `src/api/attachmentsAxios.js`
10. `src/api/aiAxios.js`

### **Redux Slices جديدة (10 ملفات):**
1. `src/redux/slices/supportSlice.js`
2. `src/redux/slices/reportsSlice.js`
3. `src/redux/slices/auditSlice.js`
4. `src/redux/slices/casesSlice.js`
5. `src/redux/slices/appointmentsSlice.js`
6. `src/redux/slices/notificationsSlice.js`
7. `src/redux/slices/evaluationsSlice.js`
8. `src/redux/slices/communitySlice.js`
9. `src/redux/slices/attachmentsSlice.js`
10. `src/redux/slices/aiSlice.js`

### **الصفحات الجديدة (10 صفحات):**
1. `src/app/support/page.jsx`
2. `src/app/reports/page.jsx`
3. `src/app/audit/page.jsx`
4. `src/app/cases/page.jsx`
5. `src/app/appointments/page.jsx`
6. `src/app/notifications/page.jsx`
7. `src/app/evaluations/page.jsx`
8. `src/app/community/page.jsx`
9. `src/app/attachments/page.jsx`
10. `src/app/ai-diagnoses/page.jsx`

### **المكونات الجديدة (~20 مكون):**
- مكونات الدعم الفني (6 مكونات)
- مكونات التقارير (4 مكونات)
- مكونات التدقيق (3 مكونات)
- مكونات مشتركة (7 مكونات)

### **ملفات مساعدة (~10 ملفات):**
- Utilities
- Constants

### **تحديثات على الملفات الموجودة:**
- `src/redux/store.js` - إضافة 10 reducers جديدة
- `src/components/Sidebar.jsx` - إضافة 10 عناصر قائمة
- `src/app/page.js` - إضافة روابط سريعة
- `src/api/accountsAxios.js` - تحديث publicEndpoints (إذا لزم الأمر)

---

## 🎯 الأولويات:

### **المرحلة 1 - الأساسيات (الأولوية العالية):**
1. ✅ تحديث base URL (تم)
2. إنشاء APIs الأساسية:
   - Support API
   - Reports API
   - Audit API
3. إنشاء Axios Instances:
   - Support Axios
   - Reports Axios
   - Audit Axios
4. إنشاء Redux Slices:
   - Support Slice
   - Reports Slice
   - Audit Slice
5. تحديث Redux Store
6. إنشاء الصفحات الأساسية:
   - Support Page
   - Reports Page
   - Audit Page
7. تحديث Sidebar

### **المرحلة 2 - الوحدات الإضافية (الأولوية المتوسطة):**
1. APIs للقراءة فقط:
   - Cases API
   - Appointments API
   - Notifications API
   - Evaluations API
   - Community API
   - Attachments API
   - AI API
2. Redux Slices للقراءة فقط
3. الصفحات للقراءة فقط
4. المكونات المشتركة

### **المرحلة 3 - التحسينات (الأولوية المنخفضة):**
1. المكونات المتقدمة
2. Utilities و Constants
3. التحسينات على UX/UI

---

## 📝 ملاحظات مهمة:

1. **الصلاحيات:**
   - الدعم التقني يمكنه عرض جميع البيانات (قراءة فقط)
   - الدعم التقني يمكنه إنشاء/تحديث التقارير
   - الدعم التقني يمكنه إدارة تذاكر الدعم
   - الدعم التقني يمكنه عرض سجلات التدقيق

2. **الأمان:**
   - جميع APIs تتطلب Token
   - التحقق من الصلاحيات في كل طلب
   - حماية البيانات الحساسة

3. **الأداء:**
   - استخدام Pagination للقوائم الكبيرة
   - استخدام Caching عند الحاجة
   - تحسين استعلامات Redux

4. **التجربة:**
   - Loading States
   - Error Handling
   - Empty States
   - Success Messages

---

**آخر تحديث:** يناير 2025



