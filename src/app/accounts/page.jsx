"use client";

import useAccountsPage from "./useAccountsPage";
import { PageHeader, Card, Button } from "@/components/ui";
import { UsersRound, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";

// 🔹 الأدوار المتاحة في الواجهة
const roleOrder = ["university_admin"];

export default function AccountsPage() {
  const {
    activeRole,
    setActiveRole,
    formData,
    isEditing,
    loading,
    error,
    operationLoading,
    operationError,
    displayedUsers,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel,
    roleLabels,
    addActionLabels,
    universities,
    uuidRegex,
  } = useAccountsPage();
  
  // 🔹 الأدوار المتاحة للعرض
  const availableRoles = roleOrder;

  const inputBaseClass = "w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5 disabled:bg-[#ecf4ff]/60 disabled:cursor-not-allowed disabled:opacity-70";
  const selectBaseClass = inputBaseClass;
  const textareaBaseClass = `${inputBaseClass} min-h-[100px] resize-y`;
  const formGridClass = "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4";

  return (
    <div dir="rtl" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <PageHeader
        title={`إدارة ${roleLabels[activeRole] || ""}`}
        description="قم بمتابعة المستخدمين، تعديل بياناتهم، وضبط الصلاحيات عبر لوحة واحدة منظمة."
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={UsersRound}
            onClick={() => setActiveRole(activeRole)}
            disabled={loading}
          >
            تحديث القائمة
          </Button>
        }
      />

      <Card tone="outline" padding="p-4">
        <div className="flex flex-wrap items-center gap-3">
          {availableRoles.map((roleKey) => (
            <Button
              key={roleKey}
              type="button"
              variant={activeRole === roleKey ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveRole(roleKey)}
            >
              {roleLabels[roleKey]}
            </Button>
          ))}
        </div>
      </Card>

      <Card 
        title={isEditing ? "تعديل بيانات مدير الجامعة" : addActionLabels[activeRole] || "إضافة مدير جامعة"}
        icon={UsersRound}
        padding="p-4 sm:p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#0f1f3f] mb-3 pb-2 border-b border-[#d6e4ff]">المعلومات الأساسية</h3>
              <div className={formGridClass}>
                <div>
                  <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">
                    اسم المستخدم <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="username"
                    placeholder="اسم المستخدم"
                    value={formData.username ?? ""}
                    onChange={handleChange}
                    className={inputBaseClass}
                    required
                    disabled={isEditing}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={formData.email ?? ""}
                    onChange={handleChange}
                    className={inputBaseClass}
                    required
                    disabled={isEditing}
                  />
                </div>
                {isEditing && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">الاسم الأول</label>
                      <input
                        name="first_name"
                        placeholder="الاسم الأول"
                        value={formData.first_name ?? ""}
                        onChange={handleChange}
                        className={inputBaseClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">اسم العائلة</label>
                      <input
                        name="last_name"
                        placeholder="اسم العائلة"
                        value={formData.last_name ?? ""}
                        onChange={handleChange}
                        className={inputBaseClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">كلمة المرور (اختياري)</label>
                      <input
                        name="password"
                        type="password"
                        placeholder="اتركه فارغاً للحفاظ على كلمة المرور الحالية"
                        value={formData.password ?? ""}
                        onChange={handleChange}
                        className={inputBaseClass}
                      />
                    </div>
                    <div className="flex items-center gap-2 p-3 border border-[#d6e4ff] rounded-xl bg-[#ecf4ff]/60">
                      <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active !== undefined ? formData.is_active : true}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-[#8aa7d6] text-[#2f87f5] focus:ring-2 focus:ring-[#2f87f5] cursor-pointer"
                      />
                      <label htmlFor="is_active" className="text-sm font-medium text-[#0f1f3f] cursor-pointer">
                        الحساب نشط
                      </label>
                    </div>
                  </>
                )}
                {!isEditing && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">
                        كلمة المرور <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="password"
                        type="password"
                        placeholder="كلمة المرور"
                        value={formData.password ?? ""}
                        onChange={handleChange}
                        className={inputBaseClass}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">
                        تأكيد كلمة المرور <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="password_confirm"
                        type="password"
                        placeholder="تأكيد كلمة المرور"
                        value={formData.password_confirm ?? ""}
                        onChange={handleChange}
                        className={inputBaseClass}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#0f1f3f] mb-3 pb-2 border-b border-[#d6e4ff]">معلومات إضافية</h3>
              <div className={formGridClass}>
                <div>
                  <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">تاريخ الميلاد</label>
                  <input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth ?? ""}
                    onChange={handleChange}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">الجنس</label>
                  <select
                    name="gender"
                    value={formData.gender ?? ""}
                    onChange={handleChange}
                    className={selectBaseClass}
                  >
                    <option value="">اختر الجنس</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#0f1f3f] mb-3 pb-2 border-b border-[#d6e4ff]">معلومات الوظيفة</h3>
              <div className={formGridClass}>
                <RoleSpecificFields
                  activeRole={activeRole}
                  formData={formData}
                  handleChange={handleChange}
                  universities={universities}
                  uuidRegex={uuidRegex}
                  inputClassName={inputBaseClass}
                  selectClassName={selectBaseClass}
                  textareaClassName={textareaBaseClass}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#d6e4ff]">
            <Button type="submit" disabled={loading || operationLoading} icon={UsersRound}>
              {loading || operationLoading
                ? "جارٍ الحفظ..."
                : isEditing
                ? "حفظ التعديلات"
                : addActionLabels[activeRole] || "إضافة"}
            </Button>

            {isEditing && (
              <Button type="button" variant="ghost" onClick={handleCancel}>
                إلغاء
              </Button>
            )}
          </div>

          {(error || operationError) && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error || operationError}
            </div>
          )}
        </form>
      </Card>

      <Card title={`قائمة ${roleLabels[activeRole] || ""}`} icon={UsersRound}>
        {/* بطاقات لجميع الشاشات */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {displayedUsers?.length ? (
            displayedUsers.map((user, index) => {
              const rawId = user?.user_id ?? user?.id ?? user?.original_user_id ?? "";
              const displayId = rawId ? String(rawId) : "غير متوفر";
              const hasValidUuid = user?.has_valid_uuid ?? (rawId ? uuidRegex.test(String(rawId)) : false);
              const displayName = user?.username || user?.email || "غير معروف";
              const email = user?.email || "—";
              const rowKey = `${displayId}-${index}`;

              return (
                <div key={rowKey} className="bg-white rounded-xl border border-[#d6e4ff]/70 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="space-y-3">
                    {/* Header with Icon and Name */}
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4d9dff] to-[#155fba] flex items-center justify-center flex-shrink-0">
                        <UsersRound className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-[#0f1f3f] break-words line-clamp-2 mb-1">
                          {displayName}
                        </h3>
                        <p className="text-xs text-[#6b7a94] break-all line-clamp-1" title={email}>
                          📧 {email}
                        </p>
                      </div>
                    </div>

                    {/* UUID Warning */}
                    {!hasValidUuid && (
                      <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200">
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="break-words">المعرف ليس UUID صحيح</span>
                      </div>
                    )}

                    {/* User Details */}
                    <div className="pt-2 border-t border-[#d6e4ff]/50">
                      <RoleTableCells activeRole={activeRole} user={user} isCard={true} />
                    </div>

                    {/* UUID Display */}
                    {displayId && displayId !== "غير متوفر" && (
                      <div className="text-xs text-[#6b7a94] bg-[#ecf4ff]/60 px-2.5 py-1.5 rounded-lg border border-[#d6e4ff]/50">
                        <span className="font-medium block mb-1">المعرّف:</span>
                        <span className="font-mono text-[10px] break-all word-break-all leading-relaxed">
                          {displayId}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-[#d6e4ff]/30">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="flex-1 min-w-0"
                      >
                        تعديل
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        className="flex-1 min-w-0"
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full px-4 py-12 text-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <UsersRound className="h-10 w-10 text-[#2f87f5]" />
                <p className="text-base font-semibold text-[#0f1f3f]">لا توجد سجلات متاحة حالياً</p>
                <p className="text-sm text-[#6b7a94]">ابدأ بإضافة {roleLabels[activeRole] || ""}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function RoleSpecificFields({
  activeRole,
  formData,
  handleChange,
  universities,
  uuidRegex,
  inputClassName,
  selectClassName,
  textareaClassName,
}) {

  if (activeRole === "university_admin") {
    return (
      <>
        <div>
          <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">
            الجامعة <span className="text-red-500">*</span>
          </label>
          <select
            name="university"
            value={formData.university ?? ""}
            onChange={handleChange}
            className={selectClassName}
            required
          >
            <option value="">اختر الجامعة</option>
            {universities
              ?.map((u) => {
                const uniId = u.id;
                if (!uniId || !uuidRegex.test(uniId)) {
                  console.warn("⚠️ تم تجاهل جامعة بدون UUID صحيح:", u);
                  return null;
                }
                return (
                  <option key={uniId} value={uniId}>
                    {u.name}
                  </option>
                );
              })
              .filter(Boolean)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">القسم</label>
          <input
            name="department"
            placeholder="القسم"
            value={formData.department ?? ""}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">المنصب</label>
          <input
            name="position"
            placeholder="المنصب"
            value={formData.position ?? ""}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">رقم الهاتف</label>
          <input
            name="phone_number"
            type="tel"
            placeholder="رقم الهاتف"
            value={formData.phone_number ?? ""}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">العنوان</label>
          <textarea
            name="address"
            placeholder="العنوان"
            value={formData.address ?? ""}
            onChange={handleChange}
            className={textareaClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#3f4a5f] mb-1.5">رابط صورة الملف الشخصي</label>
          <input
            name="profile_picture"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.profile_picture ?? ""}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>
      </>
    );
  }

  return null;
}


function RoleTableCells({ activeRole, user, isCard = false }) {
  if (isCard) {
    // عرض كبطاقة
    if (activeRole === "university_admin") {
      return (
        <div className="space-y-2 text-sm text-[#3f4a5f]">
          {user?.university_name && (
            <div className="flex items-start gap-2">
              <span className="text-base flex-shrink-0 mt-0.5">🏫</span>
              <div className="flex-1 min-w-0">
                <span className="font-medium break-words line-clamp-2">{user.university_name}</span>
              </div>
            </div>
          )}
          {user?.department && (
            <div className="flex items-start gap-2">
              <span className="text-base flex-shrink-0 mt-0.5">📁</span>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-[#6b7a94] block mb-0.5">القسم</span>
                <span className="break-words line-clamp-2">{user.department}</span>
              </div>
            </div>
          )}
          {user?.position && (
            <div className="flex items-start gap-2">
              <span className="text-base flex-shrink-0 mt-0.5">💼</span>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-[#6b7a94] block mb-0.5">المنصب</span>
                <span className="break-words line-clamp-2">{user.position}</span>
              </div>
            </div>
          )}
          {user?.phone_number && (
            <div className="flex items-start gap-2">
              <span className="text-base flex-shrink-0 mt-0.5">📞</span>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-[#6b7a94] block mb-0.5">رقم الهاتف</span>
                <span className="break-words">{user.phone_number}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  }

  return null;
}

