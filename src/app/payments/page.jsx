"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  addPayment,
  editPayment,
  deletePayment,
  setSearch,
  setFilterStatus,
} from "../../redux/slices/paymentsSlice";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  X,
  Check,
  Search,
  Filter,
  XCircle,
  CreditCard,
} from "lucide-react";
import { PageHeader, Card, Button } from "@/components/ui";

export default function PaymentsPage() {
  const dispatch = useDispatch();
  const { payments, search, filterStatus } = useSelector((state) => state.payments);

  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editPay, setEditPay] = useState(null);
  const [formData, setFormData] = useState({
    university: "",
    email: "",
    amount: "",
    status: "مدفوع",
    date: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const firstInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const openForm = (p = null) => {
    if (p) {
      setEditPay(p);
      setFormData({
        university: p.university || "",
        email: p.email || "",
        amount: p.amount || "",
        status: p.status || "مدفوع",
        date: p.date || "",
      });
    } else {
      setEditPay(null);
      setFormData({ university: "", email: "", amount: "", status: "مدفوع", date: "" });
    }
    setShowForm(true);
    setTimeout(() => firstInputRef.current?.focus(), 50);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditPay(null);
  };

  const handleSave = () => {
    if (!formData.university || !formData.email || !formData.amount) {
      alert("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    if (editPay) dispatch(editPayment({ ...formData, id: editPay.id }));
    else dispatch(addPayment(formData));

    setFormData({ university: "", email: "", amount: "", status: "مدفوع", date: "" });
    setEditPay(null);
    setShowForm(false);
  };

  const confirmDeleteAction = (id) => setConfirmDelete(id);
  const doDelete = () => {
    if (confirmDelete) dispatch(deletePayment(confirmDelete));
    setConfirmDelete(null);
  };

  const filteredPayments = useMemo(() => {
    const s = (search || "").toLowerCase();
    return payments.filter((p) => {
      const matchSearch =
        p.university?.toLowerCase().includes(s) || p.email?.toLowerCase().includes(s);
      const matchStatus = filterStatus === "الكل" || p.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [payments, search, filterStatus]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (showForm) closeForm();
        if (confirmDelete) setConfirmDelete(null);
        if (showFilters) setShowFilters(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showForm, confirmDelete, showFilters]);

  const totalAmount = filteredPayments.reduce((sum, payment) => {
    const value = Number(payment.amount || 0);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);

  const headerMeta = [
    { label: "عدد الدفعات", value: filteredPayments.length },
    { label: "إجمالي المبالغ", value: `${totalAmount.toLocaleString()}$` },
    { label: "حالة الفلتر", value: filterStatus },
  ];

  const inputBaseClass = "w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5";
  const selectBaseClass = inputBaseClass;
  const formGridClass = "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4";

  const statusTone = (status) => {
    if (status === "مدفوع") return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(48,185,128,0.12)] text-[#1f8d62]";
    if (status === "قيد المراجعة") return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(248,178,60,0.16)] text-[#b4731f]";
    if (status === "مرفوض") return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(234,84,85,0.16)] text-[#a73536]";
    return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(43,164,240,0.16)] text-[#1c7db5]";
  };

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6" dir="rtl">
      <PageHeader
        title="إدارة الدفع"
        description="إدارة كاملة لمعاملات الدفع مع إمكانية التتبع السريع لكل عملية."
        meta={headerMeta}
        actions={
          <Button variant="primary" icon={PlusCircle} onClick={() => openForm(null)}>
            إضافة دفعة جديدة
          </Button>
        }
      />

      <Card tone="outline" padding="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7a94]" />
            <input
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              placeholder="بحث عن جامعة أو بريد..."
              className={`${inputBaseClass} pr-10`}
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                icon={X}
                onClick={() => dispatch(setSearch(""))}
              />
            )}
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="relative">
              <Button
                type="button"
                variant="secondary"
                icon={Filter}
                onClick={() => setShowFilters((s) => !s)}
              >
                فلتر
              </Button>
              {showFilters && (
                <div className="absolute right-0 z-30 mt-3 w-56 rounded-2xl border border-[#8aa7d6]/35 bg-white p-4 shadow-lg">
                  <label className="text-xs font-semibold text-[#6b7a94]">الحالة</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => dispatch(setFilterStatus(e.target.value))}
                    className={`${selectBaseClass} mt-2`}
                  >
                    <option value="الكل">الكل</option>
                    <option value="مدفوع">مدفوع</option>
                    <option value="قيد المراجعة">قيد المراجعة</option>
                    <option value="مرفوض">مرفوض</option>
                  </select>
                </div>
              )}
            </div>

            <Button variant="outline" icon={PlusCircle} onClick={() => openForm(null)} className="md:hidden">
              إضافة دفعة
            </Button>
          </div>
        </div>
      </Card>

      <Card title="سجل الدفعات" description="جدول تفصيلي لجميع الدفعات مع إمكانية التحرير والحذف." icon={CreditCard}>
        {/* جدول للشاشات الكبيرة */}
        <div className="hidden lg:block rounded-2xl bg-gradient-to-br from-white/98 to-[#dde8ff]/92 border border-[#d6e4ff]/45 shadow-[0_6px_18px_rgba(39,86,133,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#1d72dd] to-[#2f87f5] text-white">
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">#</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">الجامعة</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden xl:table-cell">البريد الإلكتروني</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm">المبلغ</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">الحالة</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-right text-xs sm:text-sm hidden 2xl:table-cell">التاريخ</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-center text-xs sm:text-sm">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length ? (
                  filteredPayments.map((payment, index) => (
                    <tr key={payment.id} className="border-b border-[#d6e4ff]/60 hover:bg-[#d6e4ff]/65 transition-colors even:bg-[#ecf4ff]/45">
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center font-semibold text-[#1d72dd]">{index + 1}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 font-medium text-[#0f1f3f]">{payment.university}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-[#3f4a5f] hidden xl:table-cell">{payment.email}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold text-[#0f1f3f]">{payment.amount}$</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-center">
                        <span className={statusTone(payment.status)}>{payment.status}</span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5 text-xs text-[#6b7a94] whitespace-nowrap hidden 2xl:table-cell">{payment.date}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-3.5">
                        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            icon={Pencil}
                            onClick={() => openForm(payment)}
                            className="text-xs sm:text-sm"
                          >
                            تعديل
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            onClick={() => confirmDeleteAction(payment.id)}
                            className="text-xs sm:text-sm"
                          >
                            حذف
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-[#2f87f5]" />
                        <p className="text-base sm:text-lg font-semibold text-[#0f1f3f]">لا توجد دفعات حالياً</p>
                        <p className="text-sm sm:text-base text-[#6b7a94]">ابدأ بإضافة دفعة جديدة</p>
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
          {filteredPayments.length ? (
            filteredPayments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-xl border border-[#d6e4ff]/70 p-4 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#0f1f3f]">{payment.university}</h3>
                    <p className="text-sm text-[#3f4a5f] mt-1">📧 {payment.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-semibold text-[#0f1f3f]">{payment.amount}$</span>
                    <span className={statusTone(payment.status)}>{payment.status}</span>
                  </div>
                  <p className="text-xs text-[#6b7a94]">📅 {payment.date}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      icon={Pencil}
                      onClick={() => openForm(payment)}
                      className="text-xs flex-1 sm:flex-none"
                    >
                      تعديل
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => confirmDeleteAction(payment.id)}
                      className="text-xs flex-1 sm:flex-none"
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full px-4 py-12 text-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <CreditCard className="h-10 w-10 text-[#2f87f5]" />
                <p className="text-base font-semibold text-[#0f1f3f]">لا توجد دفعات حالياً</p>
                <p className="text-sm text-[#6b7a94]">ابدأ بإضافة دفعة جديدة</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card tone="default" padding="p-4" className="md:w-fit">
        <p className="text-sm text-[#6b7a94]">
          عرض {filteredPayments.length} نتيجة بقيمة إجمالية تبلغ {totalAmount.toLocaleString()}$
        </p>
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,31,63,0.45)] backdrop-blur-sm p-4">
          <div ref={modalRef} className="w-full max-w-3xl">
            <Card
              title={editPay ? "تعديل دفعة" : "إضافة دفعة جديدة"}
              description="أدخل تفاصيل الدفعة وأكمل الحقول المطلوبة."
              actions={
                <Button variant="ghost" size="sm" icon={X} onClick={closeForm}>
                  إغلاق
                </Button>
              }
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className={formGridClass}
              >
                <input
                  ref={firstInputRef}
                  type="text"
                  placeholder="اسم الجامعة"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className={inputBaseClass}
                  required
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputBaseClass}
                  required
                />
                <input
                  type="number"
                  placeholder="المبلغ"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className={inputBaseClass}
                  required
                />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={selectBaseClass}
                >
                  <option value="مدفوع">مدفوع</option>
                  <option value="قيد المراجعة">قيد المراجعة</option>
                  <option value="مرفوض">مرفوض</option>
                </select>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={inputBaseClass}
                />

                <div className="col-span-2 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={closeForm}>
                    إلغاء
                  </Button>
                  <Button type="submit" variant="primary" icon={Check}>
                    حفظ
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,31,63,0.45)] backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            <Card
              title="تأكيد الحذف"
              description="هل أنت متأكد من حذف هذه الدفعة؟ لا يمكن التراجع عن ذلك."
              icon={XCircle}
              actions={
                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
                  إلغاء
                </Button>
              }
              footer={
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                    تراجع
                  </Button>
                  <Button variant="danger" icon={Trash2} onClick={doDelete}>
                    حذف
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
