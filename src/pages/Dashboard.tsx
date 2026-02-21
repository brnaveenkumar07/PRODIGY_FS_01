import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { authAPI } from '@/lib/api';
import { LogOut, Shield, Mail, Calendar, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch user data');
      setTimeout(() => navigate('/login'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg" />
            <h1 className="text-xl font-bold text-slate-900">SecureAuth Dashboard</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2 text-slate-100 hover:text-slate-900 bg-red-500"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Welcome Card */}
        {user && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
                  <p className="text-blue-100">Manage your account and access protected resources</p>
                </div>
                <Avatar className="w-10 h-10 bg-blue-700 border-2 border-blue-400 flex items-center justify-center">
                  <AvatarFallback className="bg-blue-700 text-white text-lg font-bold flex items-center justify-center">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Section */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <Card className="md:col-span-2 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <CardTitle>Account Information</CardTitle>
                </div>
                <CardDescription>Your profile details and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Full Name</p>
                  <p className="text-lg font-medium text-slate-900">{user.name}</p>
                </div>

                <Separator />

                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Email Address</p>
                  </div>
                  <p className="text-lg font-medium text-slate-900 ml-6">{user.email}</p>
                </div>

                <Separator />

                {/* Member Since */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Member Since</p>
                  </div>
                  <p className="text-lg font-medium text-slate-900 ml-6">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Role Badge */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Role</p>
                  <Badge
                    className={`w-full justify-center py-2 text-sm font-semibold ${
                      user.role === 'ADMIN'
                        ? 'bg-red-100 text-red-800 hover:bg-red-100'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                    }`}
                  >
                    {user.role}
                  </Badge>
                </div>

                <Separator />

                {/* Status indicator */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Account Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium text-green-700">Active</span>
                  </div>
                </div>

                {/* Admin Link */}
                {user.role === 'ADMIN' && (
                  <>
                    <Separator />
                    <Button
                      onClick={() => navigate('/admin')}
                      variant="default"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      Admin Panel
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
