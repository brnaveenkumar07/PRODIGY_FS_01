import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { authAPI } from '@/lib/api';
import { ArrowLeft, Trash2, AlertCircle, Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data.users);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch users');
      setTimeout(() => navigate('/dashboard'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setSelectedUserId(id);
    setSelectedUserName(name);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserId) return;

    setDeleting(true);
    try {
      await authAPI.deleteUser(selectedUserId);
      setUsers(users.filter((user) => user.id !== selectedUserId));
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
      setSelectedUserName(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-600 font-medium">Loading admin panel...</p>
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
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg" />
            <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
          </div>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            size="sm"
            className="gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600">Admins</p>
                <p className="text-3xl font-bold text-red-600">{users.filter(u => u.role === 'ADMIN').length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600">Regular Users</p>
                <p className="text-3xl font-bold text-green-600">{users.filter(u => u.role === 'USER').length}</p>
              </div>
            </CardContent>
        </Card>
        </div>

        {/* Users Table */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>Manage all registered users in the system</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-200">
                      <TableHead className="text-slate-700 font-semibold">User</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Email</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Role</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Joined</TableHead>
                      <TableHead className="text-right text-slate-700 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-slate-200 hover:bg-blue-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 bg-blue-100">
                              <AvatarFallback className="text-xs font-bold text-blue-700 bg-blue-100">
                                {user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-slate-900">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-700">{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.role === 'ADMIN'
                                ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-700">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleDeleteClick(user.id, user.name)}
                            variant="destructive"
                            size="sm"
                            disabled={deleting}
                            className="gap-2 bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-0 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-slate-900">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-900">{selectedUserName}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <AlertDialogCancel disabled={deleting} className="border-slate-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
