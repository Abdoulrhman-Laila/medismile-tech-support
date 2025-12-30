"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader, Card, Button } from "@/components/ui";
import {
  fetchRooms,
  getRoomDetails,
  fetchMessages,
  clearMessagingError,
} from "@/redux/slices/messagingSlice";
import { FileText, RefreshCcw } from "lucide-react";

export default function MessagingPage() {
  const dispatch = useDispatch();
  const { rooms, currentRoom, messages, loading, error } = useSelector(
    (state) => state.messaging
  );

  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchRooms());
    if (selectedRoomId) {
      dispatch(fetchMessages(selectedRoomId));
      dispatch(getRoomDetails(selectedRoomId));
    }
  };

  const handleSelectRoom = async (room) => {
    if (!room?.id) return;
    setSelectedRoomId(room.id);
    try {
      await dispatch(getRoomDetails(room.id)).unwrap();
      await dispatch(fetchMessages(room.id)).unwrap();
    } catch (err) {
      console.error("❌ فشل جلب بيانات الغرفة أو الرسائل:", err);
    }
  };

  const sortedMessages = useMemo(
    () =>
      [...(messages || [])].sort((a, b) =>
        new Date(a.created_at || 0) - new Date(b.created_at || 0)
      ),
    [messages]
  );

  const headerMeta = [
    { label: "إجمالي الغرف", value: rooms?.length ?? 0 },
  ];

  return (
    <ProtectedRoute>
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6"
        dir="rtl"
      >
        <PageHeader
          title="المراسلات"
          description="مراقبة غرف المحادثة والرسائل بين المستخدمين (قراءة فقط)."
          icon={FileText}
          meta={headerMeta}
          actions={
            <Button variant="outline" size="sm" icon={RefreshCcw} onClick={handleRefresh}>
              تحديث
            </Button>
          }
        />

        {error && (
          <Card tone="danger">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-red-700">{error}</p>
              <Button size="xs" variant="ghost" onClick={() => dispatch(clearMessagingError())}>
                إغلاق
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* قائمة الغرف */}
          <div className="space-y-4 lg:col-span-1">
            <Card
              title="غرف المحادثة"
              tone="outline"
              className="max-h-[520px] overflow-y-auto"
            >
              {loading && rooms.length === 0 && (
                <p className="text-sm text-[#6b7a94]">جاري تحميل الغرف...</p>
              )}
              {!loading && rooms.length === 0 && (
                <p className="text-sm text-[#6b7a94]">لا توجد غرف مراسلة مسجلة.</p>
              )}
              <ul className="space-y-2 text-sm">
                {rooms.map((room) => {
                  const isActive = selectedRoomId === room.id;
                  return (
                    <li key={room.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectRoom(room)}
                        className={`w-full text-right rounded-xl border px-3 py-2.5 transition ${
                          isActive
                            ? "border-[#1d72dd] bg-[#ecf4ff]"
                            : "border-[#d6e4ff] bg-white hover:bg-[#f5f7ff]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#0f1f3f] line-clamp-1">
                            {room.name ||
                              room.title ||
                              room.id}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[#ecf4ff] px-2 py-0.5 text-[11px] text-[#1d72dd]">
                            {room.participants_count != null
                              ? `${room.participants_count} مشارك`
                              : ""}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-[#6b7a94] line-clamp-1">
                          {room.last_message_preview || ""}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          {/* تفاصيل الغرفة + الرسائل */}
          <div className="space-y-4 lg:col-span-2">
            <Card
              title={currentRoom ? "تفاصيل الغرفة" : "لا توجد غرفة محددة"}
              tone="outline"
              icon={FileText}
            >
              {currentRoom ? (
                <div className="space-y-3 text-sm">
                  <h3 className="text-base font-semibold text-[#0f1f3f]">
                    {currentRoom.name || currentRoom.title || currentRoom.id}
                  </h3>
                  <p className="text-xs text-[#6b7a94]">
                    المشاركون:
                    {" "}
                    {(currentRoom.participants || [])
                      .map((p) => p.email || p.username || p.id)
                      .join("، ") || "غير متوفر"}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[#6b7a94]">
                  اختر غرفة من القائمة اليمنى لعرض تفاصيلها والرسائل.
                </p>
              )}
            </Card>

            <Card title="الرسائل" tone="outline">
              {selectedRoomId && sortedMessages.length === 0 && !loading && (
                <p className="text-sm text-[#6b7a94]">
                  لا توجد رسائل في هذه الغرفة حتى الآن.
                </p>
              )}
              <div className="max-h-[360px] overflow-y-auto space-y-2 text-sm">
                {sortedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] text-[#6b7a94] mb-1">
                      <span>
                        {msg.sender?.email ||
                          msg.sender?.username ||
                          "مستخدم"}
                      </span>
                      <span>
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <p className="text-xs text-[#111827] whitespace-pre-line">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}



