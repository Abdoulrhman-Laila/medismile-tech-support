"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTickets,
  fetchTicketResponses,
  getTicketDetails,
  updateTicket,
  addTicketResponse,
  setFilters,
  clearCurrentTicket,
  clearError,
} from "@/redux/slices/supportSlice";
import { PageHeader, Card, Button } from "@/components/ui";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AlertTriangle, MessageCircle, Send, BarChart2, RefreshCcw } from "lucide-react";

export default function SupportPage() {
  const dispatch = useDispatch();
  const {
    tickets,
    currentTicket,
    responses,
    loading,
    error,
    operationLoading,
    operationError,
    filters,
  } = useSelector((state) => state.support);

  const [newResponse, setNewResponse] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    status: "",
    priority: "",
    assigned_to: "",
    resolution: "",
  });

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value || null }));
  };

  const handleSelectTicket = async (ticket) => {
    const id = ticket?.id;
    if (!id) return;
    dispatch(clearError());
    try {
      await dispatch(getTicketDetails(id)).unwrap();
      await dispatch(fetchTicketResponses(id)).unwrap();
    } catch (err) {
      console.error("❌ فشل تحميل تفاصيل التذكرة:", err);
    }
  };

  const handleSendResponse = async () => {
    if (!currentTicket?.id || !newResponse.trim()) return;
    try {
      await dispatch(
        addTicketResponse({
          ticketId: currentTicket.id,
          data: { message: newResponse, is_internal: isInternalNote },
        })
      ).unwrap();
      setNewResponse("");
      setIsInternalNote(false);
      await dispatch(fetchTicketResponses(currentTicket.id)).unwrap();
    } catch (err) {
      console.error("❌ فشل إرسال الرد:", err);
    }
  };

  const handleUpdateTicket = async () => {
    if (!currentTicket?.id) return;
    try {
      const updateData = {};
      if (editForm.status) updateData.status = editForm.status;
      if (editForm.priority) updateData.priority = editForm.priority;
      if (editForm.assigned_to) updateData.assigned_to = editForm.assigned_to;
      if (editForm.resolution) updateData.resolution = editForm.resolution;

      // 🔹 طباعة البيانات المرسلة للتحقق
      console.log("📤 تحديث التذكرة:", {
        ticketId: currentTicket.id,
        updateData,
      });

      await dispatch(updateTicket({ ticketId: currentTicket.id, data: updateData })).unwrap();
      
      console.log("✅ تم تحديث التذكرة بنجاح");
      setShowEditModal(false);
      setEditForm({ status: "", priority: "", assigned_to: "", resolution: "" });
      await dispatch(getTicketDetails(currentTicket.id)).unwrap();
      dispatch(fetchTickets());
      alert("✅ تم تحديث التذكرة بنجاح");
    } catch (err) {
      console.error("❌ فشل تحديث التذكرة:", err);
      alert(`❌ فشل تحديث التذكرة: ${err.message || "حدث خطأ غير متوقع"}`);
    }
  };

  const filteredTickets = useMemo(() => {
    return (tickets || []).filter((t) => {
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.category && t.category !== filters.category) return false;
      return true;
    });
  }, [tickets, filters]);

  const headerMeta = [];

  const inputBaseClass =
    "w-full rounded-xl border border-[#8aa7d6]/45 bg-white/92 px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-[#0f1f3f] shadow-[0_2px_6px_rgba(15,31,63,0.04)] outline-none transition-all focus:border-[#2f87f5] focus:shadow-[0_8px_20px_rgba(47,135,245,0.16)] focus:-translate-y-0.5";

  return (
    <ProtectedRoute>
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6"
        dir="rtl"
      >
        <PageHeader
          title="تذاكر الدعم الفني"
          description="إدارة طلبات الدعم الفني، متابعة حالاتها، والرد عليها."
          icon={AlertTriangle}
          meta={headerMeta}
          actions={
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCcw}
              onClick={() => {
                dispatch(fetchTickets());
              }}
            >
              تحديث البيانات
            </Button>
          }
        />

        {(error || operationError) && (
          <Card tone="danger">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-red-700">{error || operationError}</p>
              <Button size="xs" variant="ghost" onClick={() => dispatch(clearError())}>
                إغلاق
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* قائمة التذاكر + فلاتر */}
          <div className="space-y-4 lg:col-span-1">
            <Card
              title="تصفية التذاكر"
              tone="outline"
              icon={BarChart2}
              className="space-y-3 sm:space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  className={inputBaseClass}
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">كل الحالات</option>
                  <option value="open">مفتوحة</option>
                  <option value="in_progress">قيد المعالجة</option>
                  <option value="resolved">محلولة</option>
                  <option value="closed">مغلقة</option>
                </select>
                <select
                  className={inputBaseClass}
                  value={filters.priority || ""}
                  onChange={(e) => handleFilterChange("priority", e.target.value)}
                >
                  <option value="">كل الأولويات</option>
                  <option value="urgent">عاجلة</option>
                  <option value="medium">متوسطة</option>
                  <option value="low">منخفضة</option>
                </select>
                <select
                  className={inputBaseClass}
                  value={filters.category || ""}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  <option value="">كل الفئات</option>
                  <option value="technical">مشكلة تقنية</option>
                  <option value="account">مشكلة في الحساب</option>
                  <option value="feature">طلب ميزة</option>
                  <option value="bug">تقرير عن خطأ</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
            </Card>

            <Card
              title="قائمة التذاكر"
              tone="outline"
              className="max-h-[520px] overflow-y-auto"
            >
              {loading && (
                <p className="text-sm text-[#6b7a94]">جاري تحميل التذاكر...</p>
              )}
              {!loading && filteredTickets.length === 0 && (
                <p className="text-sm text-[#6b7a94]">لا توجد تذاكر مطابقة للفلتر الحالي.</p>
              )}
              <ul className="space-y-2">
                {filteredTickets.map((ticket) => {
                  const isActive = currentTicket?.id === ticket.id;
                  const creatorName = ticket.created_by?.full_name?.trim() ||
                    `${ticket.created_by?.first_name || ""} ${ticket.created_by?.last_name || ""}`.trim() ||
                    ticket.created_by?.username ||
                    "غير معروف";
                  const creatorEmail = ticket.created_by?.email;
                  const creatorId = ticket.created_by?.id;
                  
                  return (
                    <li key={ticket.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectTicket(ticket)}
                        className={`w-full text-right rounded-xl border px-3 py-2.5 text-sm transition ${
                          isActive
                            ? "border-[#1d72dd] bg-[#ecf4ff]"
                            : "border-[#d6e4ff] bg-white hover:bg-[#f5f7ff]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#0f1f3f] line-clamp-1">
                            {ticket.subject}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5 text-[11px] text-[#1d72dd]">
                            {ticket.priority === "urgent"
                              ? "عاجلة"
                              : ticket.priority === "medium"
                              ? "متوسطة"
                              : "منخفضة"}
                          </span>
                        </div>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center justify-between gap-2 text-[11px] text-[#6b7a94]">
                            <span>{ticket.category || "—"}</span>
                            <span>{ticket.status || "—"}</span>
                            {ticket.responses_count !== undefined && (
                              <span>💬 {ticket.responses_count}</span>
                            )}
                          </div>
                          {ticket.created_by && (
                            <div className="text-[10px] text-[#8aa7d6] space-y-0.5">
                              <div className="truncate">
                                👤 {creatorName}
                              </div>
                              {creatorEmail && (
                                <div className="truncate" title={creatorEmail}>
                                  📧 {creatorEmail}
                                </div>
                              )}
                              {creatorId && (
                                <div className="truncate font-mono" title={creatorId}>
                                  🆔 {creatorId.substring(0, 8)}...
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          {/* تفاصيل التذكرة + الردود */}
          <div className="space-y-4 lg:col-span-2">
            <Card
              title={currentTicket ? "تفاصيل التذكرة" : "لا توجد تذكرة محددة"}
              tone="outline"
              icon={MessageCircle}
            >
              {currentTicket ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b7a94]">
                      <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5">
                        {currentTicket.category || "—"}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-2 py-0.5">
                        {currentTicket.priority || "—"}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#e0f2f1] px-2 py-0.5">
                        {currentTicket.status || "—"}
                      </span>
                      {currentTicket.related_app && (
                        <span className="inline-flex items-center rounded-full bg-[#f3e8ff] px-2 py-0.5">
                          {currentTicket.related_app}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setEditForm({
                          status: currentTicket.status || "",
                          priority: currentTicket.priority || "",
                          assigned_to: currentTicket.assigned_to?.id || "",
                          resolution: currentTicket.resolution || "",
                        });
                        setShowEditModal(true);
                      }}
                    >
                      تعديل
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6b7a94]">
                    {currentTicket.created_by && (
                      <div className="space-y-1">
                        <div>
                          <span className="font-semibold">أنشأه:</span>{" "}
                          {currentTicket.created_by.full_name?.trim() ||
                            `${currentTicket.created_by.first_name || ""} ${currentTicket.created_by.last_name || ""}`.trim() ||
                            currentTicket.created_by.username ||
                            "غير معروف"}
                        </div>
                        {currentTicket.created_by.email && (
                          <div className="text-[10px] text-[#8aa7d6]">
                            📧 {currentTicket.created_by.email}
                          </div>
                        )}
                        {currentTicket.created_by.id && (
                          <div className="text-[10px] text-[#8aa7d6] font-mono">
                            🆔 {currentTicket.created_by.id}
                          </div>
                        )}
                        {currentTicket.created_by.role_name && (
                          <div className="text-[10px] text-[#8aa7d6]">
                            👤 {currentTicket.created_by.role_name}
                          </div>
                        )}
                      </div>
                    )}
                    {currentTicket.assigned_to && (
                      <div className="space-y-1">
                        <div>
                          <span className="font-semibold">معين ل:</span>{" "}
                          {currentTicket.assigned_to.full_name?.trim() ||
                            `${currentTicket.assigned_to.first_name || ""} ${currentTicket.assigned_to.last_name || ""}`.trim() ||
                            currentTicket.assigned_to.username ||
                            currentTicket.assigned_to.email ||
                            "غير معين"}
                        </div>
                        {currentTicket.assigned_to.email && (
                          <div className="text-[10px] text-[#8aa7d6]">
                            📧 {currentTicket.assigned_to.email}
                          </div>
                        )}
                        {currentTicket.assigned_to.id && (
                          <div className="text-[10px] text-[#8aa7d6] font-mono">
                            🆔 {currentTicket.assigned_to.id}
                          </div>
                        )}
                      </div>
                    )}
                    {currentTicket.created_at && (
                      <div>
                        <span className="font-semibold">تاريخ الإنشاء:</span>{" "}
                        {new Date(currentTicket.created_at).toLocaleString("ar-SA")}
                      </div>
                    )}
                    {currentTicket.updated_at && (
                      <div>
                        <span className="font-semibold">آخر تحديث:</span>{" "}
                        {new Date(currentTicket.updated_at).toLocaleString("ar-SA")}
                      </div>
                    )}
                    {currentTicket.resolved_at && (
                      <div>
                        <span className="font-semibold">تاريخ الحل:</span>{" "}
                        {new Date(currentTicket.resolved_at).toLocaleString("ar-SA")}
                      </div>
                    )}
                    {currentTicket.closed_at && (
                      <div>
                        <span className="font-semibold">تاريخ الإغلاق:</span>{" "}
                        {new Date(currentTicket.closed_at).toLocaleString("ar-SA")}
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[#0f1f3f]">
                    {currentTicket.subject}
                  </h3>
                  <p className="whitespace-pre-line text-sm text-[#3f4a5f]">
                    {currentTicket.description}
                  </p>
                  {currentTicket.resolution && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs font-semibold text-green-800 mb-1">ملخص الحل:</p>
                      <p className="text-sm text-green-700 whitespace-pre-line">
                        {currentTicket.resolution}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  اختر تذكرة من القائمة على اليسار لعرض التفاصيل والردود.
                </p>
              )}
            </Card>

            <Card
              title="الردود"
              tone="outline"
              icon={Send}
              className="space-y-3 sm:space-y-4"
            >
              {currentTicket ? (
                <>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {operationLoading && responses.length === 0 && (
                      <p className="text-sm text-[#6b7a94]">جاري تحميل الردود...</p>
                    )}
                    {responses.length === 0 && !operationLoading && (
                      <p className="text-sm text-[#6b7a94]">
                        لا توجد ردود بعد على هذه التذكرة.
                      </p>
                    )}
                    {responses.map((res) => (
                      <div
                        key={res.id}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          res.is_internal
                            ? "border-yellow-300 bg-yellow-50"
                            : "border-[#d6e4ff] bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px] text-[#6b7a94] mb-1">
                          <div className="flex items-center gap-2">
                            <span>
                              {res.author?.first_name && res.author?.last_name
                                ? `${res.author.first_name} ${res.author.last_name}`
                                : res.author?.email || "مستخدم"}
                            </span>
                            {res.is_internal && (
                              <span className="inline-flex items-center rounded-full bg-yellow-200 px-2 py-0.5 text-[10px] text-yellow-800">
                                ملاحظة داخلية
                              </span>
                            )}
                          </div>
                          <span>
                            {res.created_at
                              ? new Date(res.created_at).toLocaleString("ar-SA")
                              : ""}
                          </span>
                        </div>
                        <p className="whitespace-pre-line text-[#0f1f3f]">{res.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className={inputBaseClass}
                        placeholder="أضف ردًا على التذكرة..."
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        disabled={operationLoading}
                      />
                      <Button
                        icon={Send}
                        onClick={handleSendResponse}
                        disabled={operationLoading || !newResponse.trim()}
                      >
                        إرسال
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isInternal"
                        checked={isInternalNote}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <label htmlFor="isInternal" className="text-xs text-[#6b7a94]">
                        ملاحظة داخلية (Tech Support فقط)
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  اختر تذكرة لعرض الردود وإضافة رد جديد.
                </p>
              )}
            </Card>
          </div>
        </div>

        {/* Modal تعديل التذكرة */}
        {showEditModal && currentTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">تعديل التذكرة</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الحالة</label>
                  <select
                    className={inputBaseClass}
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="">اختر الحالة</option>
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الأولوية</label>
                  <select
                    className={inputBaseClass}
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  >
                    <option value="">اختر الأولوية</option>
                    <option value="urgent">عاجلة</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">منخفضة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">معين ل (UUID)</label>
                  <input
                    type="text"
                    className={inputBaseClass}
                    placeholder="معرف المستخدم (UUID)"
                    value={editForm.assigned_to}
                    onChange={(e) => setEditForm({ ...editForm, assigned_to: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ملخص الحل</label>
                  <textarea
                    rows={3}
                    className={inputBaseClass}
                    placeholder="ملخص الحل..."
                    value={editForm.resolution}
                    onChange={(e) => setEditForm({ ...editForm, resolution: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowEditModal(false)}>إلغاء</Button>
                  <Button variant="primary" onClick={handleUpdateTicket} disabled={operationLoading}>
                    حفظ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}



