interface AppFooterProps {
  className?: string;
}

export default function AppFooter({ className = '' }: AppFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t border-slate-200 bg-slate-50 py-6 mt-12 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">SecureAuth</p>
            <p className="text-xs text-slate-600">
              © {currentYear} SecureAuth. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
