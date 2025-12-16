"use client";

import useAccountsPage from "./useAccountsPage";
import { PageHeader, Card, Button } from "@/components/ui";
import { UsersRound, AlertCircle } from "lucide-react";

const roleOrder = ["supervisor", "patient", "student", "university_admin", "tech_support"];

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
          {roleOrder.map((roleKey) => (
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

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={formGridClass}>
            <input
              name="username"
              placeholder="اسم المستخدم"
              value={formData.username ?? ""}
              onChange={handleChange}
              className={inputBaseClass}
              required
              disabled={isEditing}
            />
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
            <input
              name="password"
              type="password"
              placeholder="كلمة المرور"
              value={formData.password ?? ""}
              onChange={handleChange}
              className={inputBaseClass}
              required={!isEditing}
            />
            <input
              name="password_confirm"
              type="password"
              placeholder="تأكيد كلمة المرور"
              value={formData.password_confirm ?? ""}
              onChange={handleChange}
              className={inputBaseClass}
              required={!isEditing}
            />
            <input
              name="first_name"
              placeholder="الاسم الأول"
              value={formData.first_name ?? ""}
              onChange={handleChange}
              className={inputBaseClass}
              required
            />
            <input
              name="last_name"
              placeholder="اسم العائلة"
              value={formData.last_name ?? ""}
              onChange={handleChange}
              className={inputBaseClass}
              required
            />

            <input
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth ?? ""}
              onChange={handleChange}
              className={inputBaseClass}
            />

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

          <div className="flex flex-wrap items-center gap-3">
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
        {/* جدول للشاشات الكبيرة */}
        <div className="hidden lg:block rounded-2xl bg-gradient-to-br from-white/98 to-[#dde8ff]/92 border border-[#d6e4ff]/45 shadow-[0_6px_18px_rgba(39,86,133,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#1d72dd] to-[#2f87f5] text-white">
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">الاسم</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden xl:table-cell">البريد الإلكتروني</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden 2xl:table-cell">المعرّف</th>
                  <RoleTableHeaders activeRole={activeRole} />
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers?.length ? (
                  displayedUsers.map((user, index) => {
                    const rawId = user?.user_id ?? user?.id ?? user?.original_user_id ?? "";
                    const displayId = rawId ? String(rawId) : "غير متوفر";
                    const hasValidUuid = user?.has_valid_uuid ?? (rawId ? uuidRegex.test(String(rawId)) : false);
                    const rowKey = `${displayId}-${index}`;
                    const fullName =
                      `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.username || "غير معروف";
                    const email = user?.email || "—";
                    const warningMessage = !hasValidUuid ? "المعرف الذي أرسله الخادم ليس UUID؛ قد تفشل العمليات." : "";

                    return (
                      <tr key={rowKey} className="border-b border-[#d6e4ff]/60 hover:bg-[#d6e4ff]/65 transition-colors even:bg-[#ecf4ff]/45">
                        <td className="px-3 py-3 sm:px-4 sm:py-3.5 font-medium text-[#0f1f3f]">{fullName}</td>
                        <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] hidden xl:table-cell">{email}</td>
                        <td className="px-3 py-3 sm:px-4 sm:py-3.5 hidden 2xl:table-cell">
                          <div className="text-xs break-all text-[#3f4a5f]">
                            {displayId || "غير متوفر"}
                          </div>
                          {warningMessage && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                              <AlertCircle className="h-3.5 w-3.5" />
                              <span className="hidden lg:inline">{warningMessage}</span>
                            </div>
                          )}
                        </td>
                        <RoleTableCells activeRole={activeRole} user={user} />
                        <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                          <div className="flex flex-wrap justify-end gap-1.5 sm:gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEdit(user)}
                              title={warningMessage}
                              className="text-xs sm:text-sm"
                            >
                              تعديل
                            </Button>
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(user)}
                              title={warningMessage}
                              className="text-xs sm:text-sm"
                            >
                              حذف
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <UsersRound className="h-10 w-10 sm:h-12 sm:w-12 text-[#2f87f5]" />
                        <p className="text-base sm:text-lg font-semibold text-[#0f1f3f]">لا توجد سجلات متاحة حالياً</p>
                        <p className="text-sm sm:text-base text-[#6b7a94] max-w-md">
                          ابدأ بإضافة {roleLabels[activeRole] || ""} أو قم بتحديث البيانات لجلب أحدث السجلات.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* بطاقات للشاشات الصغيرة والمتوسطة */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedUsers?.length ? (
            displayedUsers.map((user, index) => {
              const rawId = user?.user_id ?? user?.id ?? user?.original_user_id ?? "";
              const displayId = rawId ? String(rawId) : "غير متوفر";
              const fullName =
                `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.username || "غير معروف";
              const email = user?.email || "—";
              const rowKey = `${displayId}-${index}`;

              return (
                <div key={rowKey} className="bg-white rounded-xl border border-[#d6e4ff]/70 p-4 shadow-sm">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-base text-[#0f1f3f]">{fullName}</h3>
                      <p className="text-sm text-[#3f4a5f] mt-1">📧 {email}</p>
                    </div>
                    <RoleTableCells activeRole={activeRole} user={user} isCard={true} />
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="text-xs flex-1 sm:flex-none"
                      >
                        تعديل
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        className="text-xs flex-1 sm:flex-none"
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
  if (activeRole === "supervisor") {
    return (
      <>
        <input
          name="department"
          placeholder="القسم"
          value={formData.department ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="position"
          placeholder="المنصب"
          value={formData.position ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <select
          name="university"
          value={formData.university ?? ""}
          onChange={handleChange}
          className={selectClassName}
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
        <input
          name="phone_number"
          type="tel"
          placeholder="رقم الهاتف"
          value={formData.phone_number ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="license_number"
          placeholder="رقم الرخصة"
          value={formData.license_number ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <textarea
          name="address"
          placeholder="العنوان"
          value={formData.address ?? ""}
          onChange={handleChange}
          className={`${textareaClassName} col-span-2`}
        />
        <input
          name="profile_picture"
          type="url"
          placeholder="رابط صورة الملف الشخصي"
          value={formData.profile_picture ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
      </>
    );
  }

  if (activeRole === "patient") {
    return (
      <>
        <input
          name="phone_number"
          type="tel"
          placeholder="رقم الهاتف"
          value={formData.phone_number ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <textarea
          name="address"
          placeholder="العنوان"
          value={formData.address ?? ""}
          onChange={handleChange}
          className={`${textareaClassName} col-span-2`}
        />
        <input
          name="profile_picture"
          type="url"
          placeholder="رابط صورة الملف الشخصي"
          value={formData.profile_picture ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <textarea
          name="medical_history"
          placeholder="التاريخ الطبي"
          value={formData.medical_history ?? ""}
          onChange={handleChange}
          className={`${textareaClassName} col-span-2`}
        />
        <textarea
          name="allergies"
          placeholder="الحساسية"
          value={formData.allergies ?? ""}
          onChange={handleChange}
          className={`${textareaClassName} col-span-2`}
        />
        <textarea
          name="medications"
          placeholder="الأدوية"
          value={formData.medications ?? ""}
          onChange={handleChange}
          className={`${textareaClassName} col-span-2`}
        />
        <input
          name="emergency_contact_name"
          placeholder="اسم جهة الاتصال للطوارئ"
          value={formData.emergency_contact_name ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="emergency_contact_phone"
          placeholder="رقم جهة الاتصال للطوارئ"
          value={formData.emergency_contact_phone ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
      </>
    );
  }

  if (activeRole === "student") {
    return (
      <>
        <select
          name="university"
          value={formData.university ?? ""}
          onChange={handleChange}
          className={selectClassName}
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
        <input
          name="student_id"
          placeholder="الرقم الجامعي"
          value={formData.student_id ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="year_of_study"
          type="number"
          placeholder="السنة الدراسية"
          value={formData.year_of_study ?? ""}
          onChange={handleChange}
          className={inputClassName}
          min="1"
        />
        <input
          name="specialization"
          placeholder="التخصص"
          value={formData.specialization ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="phone_number"
          type="tel"
          placeholder="رقم الهاتف"
          value={formData.phone_number ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <textarea
          name="address"
          placeholder="العنوان"
          value={formData.address ?? ""}
          onChange={handleChange}
          className={`${textareaClassName} col-span-2`}
        />
        <input
          name="profile_picture"
          type="url"
          placeholder="رابط صورة الملف الشخصي"
          value={formData.profile_picture ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
      </>
    );
  }

  if (activeRole === "university_admin") {
    return (
      <>
        <select
          name="university"
          value={formData.university ?? ""}
          onChange={handleChange}
          className={selectClassName}
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
        <input
          name="department"
          placeholder="القسم"
          value={formData.department ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="position"
          placeholder="المنصب"
          value={formData.position ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="phone_number"
          type="tel"
          placeholder="رقم الهاتف"
          value={formData.phone_number ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <textarea
          name="address"
          placeholder="العنوان"
          value={formData.address ?? ""}
          onChange={handleChange}
          className={`${textareaClassName} col-span-2`}
        />
        <input
          name="profile_picture"
          type="url"
          placeholder="رابط صورة الملف الشخصي"
          value={formData.profile_picture ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
      </>
    );
  }

  if (activeRole === "tech_support") {
    return (
      <>
        <input
          name="department"
          placeholder="القسم"
          value={formData.department ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="position"
          placeholder="المنصب"
          value={formData.position ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <input
          name="phone_number"
          type="tel"
          placeholder="رقم الهاتف"
          value={formData.phone_number ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
        <textarea
          name="address"
          placeholder="العنوان"
          value={formData.address ?? ""}
          onChange={handleChange}
          className={`${textareaClassName} col-span-2`}
        />
        <input
          name="profile_picture"
          type="url"
          placeholder="رابط صورة الملف الشخصي"
          value={formData.profile_picture ?? ""}
          onChange={handleChange}
          className={inputClassName}
        />
      </>
    );
  }

  return null;
}

function RoleTableHeaders({ activeRole }) {
  const thClass = "px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm";
  
  if (activeRole === "supervisor") {
    return (
      <>
        <th className={`${thClass} hidden lg:table-cell`}>الجامعة</th>
        <th className={thClass}>القسم</th>
        <th className={`${thClass} hidden xl:table-cell`}>رقم الهاتف</th>
      </>
    );
  }

  if (activeRole === "patient") {
    return (
      <>
        <th className={`${thClass} hidden xl:table-cell`}>رقم الهاتف</th>
        <th className={thClass}>الجنس</th>
      </>
    );
  }

  if (activeRole === "student") {
    return (
      <>
        <th className={`${thClass} hidden lg:table-cell`}>الجامعة</th>
        <th className={thClass}>الرقم الجامعي</th>
        <th className={`${thClass} hidden xl:table-cell`}>السنة الدراسية</th>
        <th className={`${thClass} hidden 2xl:table-cell`}>التخصص</th>
      </>
    );
  }

  if (activeRole === "university_admin") {
    return (
      <>
        <th className={`${thClass} hidden lg:table-cell`}>الجامعة</th>
        <th className={thClass}>القسم</th>
        <th className={`${thClass} hidden xl:table-cell`}>المنصب</th>
        <th className={`${thClass} hidden 2xl:table-cell`}>رقم الهاتف</th>
      </>
    );
  }

  if (activeRole === "tech_support") {
    return (
      <>
        <th className={thClass}>القسم</th>
        <th className={`${thClass} hidden xl:table-cell`}>المنصب</th>
        <th className={`${thClass} hidden 2xl:table-cell`}>رقم الهاتف</th>
      </>
    );
  }

  return null;
}

function RoleTableCells({ activeRole, user, isCard = false }) {
  const tdClass = "px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f]";
  
  if (isCard) {
    // عرض كبطاقة للشاشات الصغيرة
    if (activeRole === "supervisor") {
      return (
        <div className="space-y-1.5 text-sm text-[#3f4a5f]">
          {user?.university_name && <p>🏫 {user.university_name}</p>}
          {user?.department && <p>📁 {user.department}</p>}
          {user?.phone_number && <p>📞 {user.phone_number}</p>}
        </div>
      );
    }
    if (activeRole === "patient") {
      return (
        <div className="space-y-1.5 text-sm text-[#3f4a5f]">
          {user?.phone_number && <p>📞 {user.phone_number}</p>}
          {user?.gender && <p>👤 {user.gender}</p>}
        </div>
      );
    }
    if (activeRole === "student") {
      return (
        <div className="space-y-1.5 text-sm text-[#3f4a5f]">
          {user?.university_name && <p>🏫 {user.university_name}</p>}
          {user?.student_id && <p>🎓 {user.student_id}</p>}
          {user?.year_of_study && <p>📅 السنة: {user.year_of_study}</p>}
          {user?.specialization && <p>📚 {user.specialization}</p>}
        </div>
      );
    }
    if (activeRole === "university_admin") {
      return (
        <div className="space-y-1.5 text-sm text-[#3f4a5f]">
          {user?.university_name && <p>🏫 {user.university_name}</p>}
          {user?.department && <p>📁 {user.department}</p>}
          {user?.position && <p>💼 {user.position}</p>}
          {user?.phone_number && <p>📞 {user.phone_number}</p>}
        </div>
      );
    }
    if (activeRole === "tech_support") {
      return (
        <div className="space-y-1.5 text-sm text-[#3f4a5f]">
          {user?.department && <p>📁 {user.department}</p>}
          {user?.position && <p>💼 {user.position}</p>}
          {user?.phone_number && <p>📞 {user.phone_number}</p>}
        </div>
      );
    }
    return null;
  }

  // عرض كجدول للشاشات الكبيرة
  if (activeRole === "supervisor") {
    return (
      <>
        <td className={`${tdClass} hidden lg:table-cell`}>{user?.university_name || "غير محددة"}</td>
        <td className={tdClass}>{user?.department || "—"}</td>
        <td className={`${tdClass} hidden xl:table-cell`}>{user?.phone_number || "—"}</td>
      </>
    );
  }

  if (activeRole === "patient") {
    return (
      <>
        <td className={`${tdClass} hidden xl:table-cell`}>{user?.phone_number || "—"}</td>
        <td className={tdClass}>{user?.gender || "—"}</td>
      </>
    );
  }

  if (activeRole === "student") {
    return (
      <>
        <td className={`${tdClass} hidden lg:table-cell`}>{user?.university_name || "غير محددة"}</td>
        <td className={tdClass}>{user?.student_id || "—"}</td>
        <td className={`${tdClass} hidden xl:table-cell`}>
          {user?.year_of_study === null || user?.year_of_study === undefined ? "—" : user?.year_of_study}
        </td>
        <td className={`${tdClass} hidden 2xl:table-cell`}>{user?.specialization || "—"}</td>
      </>
    );
  }

  if (activeRole === "university_admin") {
    return (
      <>
        <td className={`${tdClass} hidden lg:table-cell`}>{user?.university_name || "غير محددة"}</td>
        <td className={tdClass}>{user?.department || "—"}</td>
        <td className={`${tdClass} hidden xl:table-cell`}>{user?.position || "—"}</td>
        <td className={`${tdClass} hidden 2xl:table-cell`}>{user?.phone_number || "—"}</td>
      </>
    );
  }

  if (activeRole === "tech_support") {
    return (
      <>
        <td className={tdClass}>{user?.department || "—"}</td>
        <td className={`${tdClass} hidden xl:table-cell`}>{user?.position || "—"}</td>
        <td className={`${tdClass} hidden 2xl:table-cell`}>{user?.phone_number || "—"}</td>
      </>
    );
  }

  return null;
}

