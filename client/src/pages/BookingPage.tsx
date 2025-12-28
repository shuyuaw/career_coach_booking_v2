import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, CalendarIcon, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function BookingPage() {
  const [, params] = useRoute("/b/:slug");
  const slug = params?.slug || "";

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");

  // Fetch user data
  const { data: user, isLoading: userLoading } = trpc.booking.getUserBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  // Fetch user's bookings
  const { data: bookingsData, refetch: refetchBookings } = trpc.booking.getUserBookings.useQuery(
    { userId: user?.mobileNumber || "" },
    { enabled: !!user?.mobileNumber }
  );

  // Fetch available slots when date is selected
  const [dateRange, setDateRange] = useState<{ start: number; end: number } | null>(null);

  useEffect(() => {
    if (selectedDate) {
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);
      setDateRange({ start: start.getTime(), end: end.getTime() });
    }
  }, [selectedDate]);

  const { data: slotsData, isLoading: slotsLoading } = trpc.booking.getAvailableSlots.useQuery(
    { startDate: dateRange?.start || 0, endDate: dateRange?.end || 0 },
    { enabled: !!dateRange }
  );

  // Create booking mutation
  const createBookingMutation = trpc.booking.createBooking.useMutation({
    onSuccess: (data) => {
      setMeetingUrl(data.meetingUrl);
      setShowConfirmation(true);
      setSelectedSlot(null);
      setSelectedDate(undefined);
      refetchBookings();
      toast.success("预约成功！");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Cancel booking mutation
  const cancelBookingMutation = trpc.booking.cancelBooking.useMutation({
    onSuccess: () => {
      refetchBookings();
      toast.success("已取消预约");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleBooking = () => {
    if (!selectedSlot || !user) return;

    createBookingMutation.mutate({
      userId: user.mobileNumber,
      startTime: selectedSlot,
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!user) return;

    if (confirm("确定要取消这次预约吗？")) {
      cancelBookingMutation.mutate({
        bookingId,
        userId: user.mobileNumber,
      });
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">未找到用户</CardTitle>
            <CardDescription>请检查您的预约链接是否正确</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const now = Date.now();
  const hasUnlimited = user.unlimitedExpiry && user.unlimitedExpiry > now;
  const creditsText = hasUnlimited && user.unlimitedExpiry
    ? `无限制会员（有效期至 ${format(new Date(user.unlimitedExpiry), "yyyy年MM月dd日", { locale: zhCN })}）`
    : `剩余课时：${user.bulkCredits} 次`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container max-w-4xl py-4">
          <h1 className="text-2xl font-bold text-gray-900">职业教练预约系统</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">你好，{user.nickname}</span>
            <span className="text-gray-400">·</span>
            <span className={hasUnlimited ? "text-purple-600 font-medium" : "text-blue-600 font-medium"}>
              {creditsText}
            </span>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl py-6 space-y-6">
        {/* Confirmation Card */}
        {showConfirmation && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <CardTitle className="text-green-900">预约成功！</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-green-800">您的教练课程已预约成功，请准时参加。</p>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-2">腾讯会议链接：</p>
                <a
                  href={meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {meetingUrl}
                </a>
              </div>
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="w-full"
              >
                继续预约
              </Button>
            </CardContent>
          </Card>
        )}

        {/* My Bookings */}
        {bookingsData && bookingsData.bookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>我的预约</CardTitle>
              <CardDescription>查看和管理您的课程预约</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookingsData.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.startTime ? format(new Date(Number(booking.startTime)), "yyyy年MM月dd日 HH:mm", {
                            locale: zhCN,
                          }) : ""}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.creditTypeUsed === "bulk" ? "单次课时" : "无限制会员"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelBookingMutation.isPending}
                    >
                      取消预约
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Interface */}
        <Card>
          <CardHeader>
            <CardTitle>选择时间</CardTitle>
            <CardDescription>选择日期和时间段预约您的教练课程（每次60分钟）</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date Picker */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">选择日期</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                locale={zhCN}
                className="rounded-md border w-full"
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">选择时间段</h3>
                {slotsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : slotsData && slotsData.slots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {slotsData.slots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        className="h-auto py-3"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {format(new Date(slot), "HH:mm", { locale: zhCN })}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <XCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>当天没有可用时间段</p>
                  </div>
                )}
              </div>
            )}

            {/* Booking Button */}
            {selectedSlot && (
              <Button
                onClick={handleBooking}
                disabled={createBookingMutation.isPending}
                className="w-full h-12 text-base"
                size="lg"
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    预约中...
                  </>
                ) : (
                  "确认预约"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-medium text-blue-900 mb-2">预约须知</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 每次课程时长为60分钟</li>
              <li>• 需提前24小时预约或取消</li>
              <li>• 无限制会员每周最多预约3次课程</li>
              <li>• 课程将通过腾讯会议进行</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
