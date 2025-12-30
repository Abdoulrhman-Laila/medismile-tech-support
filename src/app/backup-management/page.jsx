
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card, Button } from "@/components/ui";
import { HardDrive, RefreshCcw } from "lucide-react";

import {
  fetchBackupsThunk,
  createBackupThunk,
  restoreBackupThunk,
  clearError,
  clearOperationError,
} from "@/redux/slices/backupSlice";

export default function BackupManagementPage() {
  const dispatch = useDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [backupForm, setBackupForm] = useState({
    backup_type: "full",
    description: "",
  });
  const [restoreType, setRestoreType] = useState("FULL");

  const {
    backups,
    loading,
    error,
    operationLoading,
    operationError,
  } = useSelector((state) => state.backups);

  /* ──────────── Load backups ──────────── */
  useEffect(() => {
    dispatch(fetchBackupsThunk());
  }, [dispatch]);

  /* ──────────── Handlers ──────────── */
  const handleCreateBackup = async () => {
    try {
      await dispatch(createBackupThunk(backupForm)).unwrap();
      setShowCreateModal(false);
      setBackupForm({ backup_type: "full", description: "" });
      dispatch(fetchBackupsThunk());
    } catch (_) {}
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;
    try {
      await dispatch(restoreBackupThunk({ backupId: selectedBackup.id, restoreType })).unwrap();
      setShowRestoreModal(false);
      setSelectedBackup(null);
      setRestoreType("FULL");
      dispatch(fetchBackupsThunk());
    } catch (_) {}
  };

  return (
    <ProtectedRoute>
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6"
        dir="rtl"
      >
        <PageHeader
          title="إدارة النسخ الاحتياطي"
          description="عرض النسخ الاحتياطية للنظام وإنشاء نسخ جديدة."
          icon={HardDrive}
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCcw}
                onClick={() => dispatch(fetchBackupsThunk())}
                disabled={loading || operationLoading}
              >
                تحديث
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={HardDrive}
                onClick={() => setShowCreateModal(true)}
                disabled={operationLoading}
              >
                إنشاء نسخة احتياطية
              </Button>
            </div>
          }
        />

        {(error || operationError) && (
          <Card tone="danger">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-red-700">
                {error || operationError}
              </p>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  if (error) dispatch(clearError());
                  if (operationError) dispatch(clearOperationError());
                }}
              >
                إغلاق
              </Button>
            </div>
          </Card>
        )}

        <Card
          title="سجل النسخ الاحتياطية"
          description="قائمة بجميع النسخ الاحتياطية التي تم إنشاؤها."
          tone="outline"
        >
          {loading && (
            <p className="text-sm text-gray-500">
              جاري تحميل النسخ الاحتياطية...
            </p>
          )}

          {!loading && backups.length === 0 && (
            <p className="text-sm text-gray-500">
              لا توجد نسخ احتياطية حتى الآن.
            </p>
          )}

          {!loading && backups.length > 0 && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-right font-semibold">النوع</th>
                    <th className="px-3 py-2 text-right font-semibold">الحالة</th>
                    <th className="px-3 py-2 text-right font-semibold">المصدر</th>
                    <th className="px-3 py-2 text-right font-semibold">أنشأه</th>
                    <th className="px-3 py-2 text-right font-semibold">الحجم الكلي</th>
                    <th className="px-3 py-2 text-right font-semibold">تاريخ الإنشاء</th>
                    <th className="px-3 py-2 text-right font-semibold">المدة</th>
                    <th className="px-3 py-2 text-right font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {backups.map((b, index) => {
                    return (
                      <tr key={b.id || `backup-${index}`} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5 text-xs text-[#1d72dd]">
                            {b.backup_type || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                            b.status === "completed" || b.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                            b.status === "failed" || b.status === "FAILED" ? "bg-red-100 text-red-800" :
                            b.status === "pending" || b.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                            b.status === "in_progress" || b.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {b.status || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2">{b.trigger_source || "—"}</td>
                        <td className="px-3 py-2">{b.created_by || "—"}</td>
                        <td className="px-3 py-2">
                          {b.total_size_display || b.total_size 
                            ? (b.total_size_display || `${(b.total_size / (1024 * 1024)).toFixed(2)} MB`)
                            : "—"}
                        </td>
                        <td className="px-3 py-2">
                          {b.created_at
                            ? new Date(b.created_at).toLocaleString("ar-SA")
                            : "—"}
                        </td>
                        <td className="px-3 py-2">
                          {b.duration_display || b.duration || "—"}
                        </td>
                        <td className="px-3 py-2">
                          {(b.status === "completed" || b.status === "COMPLETED") && (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                setSelectedBackup(b);
                                setShowRestoreModal(true);
                              }}
                              disabled={operationLoading}
                            >
                              استعادة
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal إنشاء نسخة احتياطية */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">إنشاء نسخة احتياطية جديدة</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">نوع النسخة</label>
                  <select
                    className="w-full rounded-xl border border-gray-300 px-3 py-2"
                    value={backupForm.backup_type}
                    onChange={(e) => setBackupForm({ ...backupForm, backup_type: e.target.value })}
                  >
                    <option value="full">Full</option>
                    <option value="incremental">Incremental</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الوصف (اختياري)</label>
                  <textarea
                    className="w-full rounded-xl border border-gray-300 px-3 py-2"
                    rows={3}
                    value={backupForm.description}
                    onChange={(e) => setBackupForm({ ...backupForm, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowCreateModal(false)}>إلغاء</Button>
                  <Button variant="primary" onClick={handleCreateBackup} disabled={operationLoading}>
                    إنشاء
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal استعادة نسخة احتياطية */}
        {showRestoreModal && selectedBackup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRestoreModal(false)}>
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">استعادة نسخة احتياطية</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  هل أنت متأكد من استعادة النسخة الاحتياطية؟
                  <br />
                  <span className="font-medium">المعرف: {selectedBackup.id}</span>
                </p>
                <div>
                  <label className="block text-sm font-medium mb-1">نوع الاستعادة</label>
                  <select
                    className="w-full rounded-xl border border-gray-300 px-3 py-2"
                    value={restoreType}
                    onChange={(e) => setRestoreType(e.target.value)}
                  >
                    <option value="FULL">FULL</option>
                    <option value="INCREMENTAL">INCREMENTAL</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowRestoreModal(false)}>إلغاء</Button>
                  <Button variant="primary" onClick={handleRestoreBackup} disabled={operationLoading}>
                    استعادة
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
