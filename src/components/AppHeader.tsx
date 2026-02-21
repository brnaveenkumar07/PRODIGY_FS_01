import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onLogout: () => void;
  showAdminButton?: boolean;
  onAdminClick?: () => void;
  isAdmin?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  onLogout,
  showAdminButton = false,
  onAdminClick,
  isAdmin = false,
}: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
              isAdmin ? 'from-red-600 to-red-700' : 'from-blue-600 to-blue-700'
            }`}
          />
          <div>
            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showAdminButton && onAdminClick && (
            <Button
              onClick={onAdminClick}
              variant="outline"
              size="sm"
              className="text-slate-600 hover:text-slate-900"
            >
              Admin Panel
            </Button>
          )}
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="gap-2 text-slate-600 hover:text-slate-900"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
