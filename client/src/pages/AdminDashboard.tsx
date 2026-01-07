import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, UserPlus, Plus, CreditCard, Copy, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [newUserMobile, setNewUserMobile] = useState("");
  const [newUserNickname, setNewUserNickname] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserCredits, setNewUserCredits] = useState("0");
  const [editingCredits, setEditingCredits] = useState<{ [key: string]: string }>({});

  // Check admin status
  const { data: adminCheck, isLoading: adminCheckLoading } = trpc.admin.isAdmin.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch all users
  const { data: usersData, refetch: refetchUsers } = trpc.admin.getAllUsers.useQuery(
    undefined,
    { enabled: adminCheck?.isAdmin }
  );

  // Create user mutation
  const createUserMutation = trpc.admin.createUser.useMutation({
    onSuccess: (data) => {
      toast.success("用户创建成功！");
      setCreateUserOpen(false);
      setNewUserMobile("");
      setNewUserNickname("");
      setNewUserEmail("");
      setNewUserCredits("0");
      refetchUsers();
      
      // Copy booking URL to clipboard
      const bookingUrl = `${window.location.origin}/b/${data.accessSlug}`;
      navigator.clipboard.writeText(bookingUrl);
      toast.success("预约链接已复制到剪贴板");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Add credits mutation
  const addCreditsMutation = trpc.admin.addCredits.useMutation({
    onSuccess: () => {
      toast.success("课时添加成功");
      refetchUsers();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Set credits mutation
  const setCreditsMutation = trpc.admin.setCredits.useMutation({
    onSuccess: () => {
      toast.success("课时已更新");
      refetchUsers();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Activate unlimited mutation
  const activateUnlimitedMutation = trpc.admin.activateUnlimited.useMutation({
    onSuccess: () => {
      toast.success("无限制会员已激活（12周）");
      refetchUsers();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete user mutation
  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("用户已删除");
      refetchUsers();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateUser = () => {
    if (!newUserMobile || !newUserNickname || !newUserEmail) {
      toast.error("请填写完整信息");
      return;
    }

    createUserMutation.mutate({
      mobileNumber: newUserMobile,
      nickname: newUserNickname,
      email: newUserEmail,
      bulkCredits: parseInt(newUserCredits) || 0,
    });
  };

  const handleAddCredits = (mobileNumber: string, amount: number) => {
    addCreditsMutation.mutate({ mobileNumber, amount });
  };

  const handleSetCredits = (mobileNumber: string, credits: number) => {
    setCreditsMutation.mutate({ mobileNumber, credits });
    setEditingCredits((prev) => {
      const updated = { ...prev };
      delete updated[mobileNumber];
      return updated;
    });
  };

  const handleEditCredits = (mobileNumber: string, currentCredits: number) => {
    setEditingCredits((prev) => ({
      ...prev,
      [mobileNumber]: currentCredits.toString(),
    }));
  };

  const handleCancelEdit = (mobileNumber: string) => {
    setEditingCredits((prev) => {
      const updated = { ...prev };
      delete updated[mobileNumber];
      return updated;
    });
  };

  const handleActivateUnlimited = (mobileNumber: string) => {
    if (confirm("确定要为该用户激活12周无限制会员吗？")) {
      activateUnlimitedMutation.mutate({ mobileNumber });
    }
  };

  const handleCopyBookingUrl = (accessSlug: string) => {
    const bookingUrl = `${window.location.origin}/b/${accessSlug}`;
    navigator.clipboard.writeText(bookingUrl);
    toast.success("预约链接已复制");
  };

  if (loading || adminCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>需要登录</CardTitle>
            <CardDescription>请先登录以访问管理后台</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = getLoginUrl()} className="w-full">
              登录
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">权限不足</CardTitle>
            <CardDescription>您没有访问管理后台的权限</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const now = Date.now();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container max-w-6xl py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
              <p className="text-sm text-gray-600 mt-1">用户管理与课时充值</p>
            </div>
            <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  创建用户
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建新用户</DialogTitle>
                  <DialogDescription>填写用户信息以创建新的预约账户</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">手机号</Label>
                    <Input
                      id="mobile"
                      placeholder="13800138000"
                      value={newUserMobile}
                      onChange={(e) => setNewUserMobile(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nickname">昵称</Label>
                    <Input
                      id="nickname"
                      placeholder="张三"
                      value={newUserNickname}
                      onChange={(e) => setNewUserNickname(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits">初始课时</Label>
                    <Input
                      id="credits"
                      type="number"
                      placeholder="0"
                      value={newUserCredits}
                      onChange={(e) => setNewUserCredits(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateUser}
                    disabled={createUserMutation.isPending}
                  >
                    {createUserMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        创建中...
                      </>
                    ) : (
                      "创建用户"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-6">
        {/* Users List */}
        <div className="space-y-4">
          {usersData?.users.map((user) => {
            const hasUnlimited = user.unlimitedExpiry && user.unlimitedExpiry > now;
            
            return (
              <Card key={user.mobileNumber}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{user.nickname}</CardTitle>
                      <CardDescription className="mt-1 space-y-1">
                        <div>手机号：{user.mobileNumber}</div>
                        <div>邮箱：{user.email}</div>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyBookingUrl(user.accessSlug)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制链接
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (window.confirm(`确定要删除用户 ${user.nickname} 吗？此操作将同时删除该用户的所有预约记录，且无法恢复。`)) {
                            deleteUserMutation.mutate({ mobileNumber: user.mobileNumber });
                          }
                        }}
                        disabled={deleteUserMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Credit Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">课时状态</p>
                      {hasUnlimited ? (
                        <div className="mt-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-purple-600">无限制会员</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            有效期至：{user.unlimitedExpiry ? format(new Date(user.unlimitedExpiry), "yyyy年MM月dd日", { locale: zhCN }) : ""}
                          </p>
                        </div>
                      ) : editingCredits[user.mobileNumber] !== undefined ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number"
                            min="0"
                            value={editingCredits[user.mobileNumber]}
                            onChange={(e) =>
                              setEditingCredits((prev) => ({
                                ...prev,
                                [user.mobileNumber]: e.target.value,
                              }))
                            }
                            className="w-24 h-8"
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              handleSetCredits(
                                user.mobileNumber,
                                parseInt(editingCredits[user.mobileNumber]) || 0
                              )
                            }
                            disabled={setCreditsMutation.isPending}
                          >
                            保存
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelEdit(user.mobileNumber)}
                          >
                            取消
                          </Button>
                        </div>
                      ) : (
                        <p
                          className="text-lg font-bold text-gray-900 mt-1 cursor-pointer hover:text-blue-600"
                          onClick={() => handleEditCredits(user.mobileNumber, user.bulkCredits)}
                        >
                          {user.bulkCredits} 次
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddCredits(user.mobileNumber, 10)}
                        disabled={addCreditsMutation.isPending}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        +10
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleActivateUnlimited(user.mobileNumber)}
                        disabled={activateUnlimitedMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <CreditCard className="w-4 h-4 mr-1" />
                        激活无限制
                      </Button>
                    </div>
                  </div>

                  {/* Booking URL */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800 mb-1">预约链接：</p>
                    <code className="text-xs text-blue-900 break-all">
                      {window.location.origin}/b/{user.accessSlug}
                    </code>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {usersData?.users.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>暂无用户，点击上方按钮创建第一个用户</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
