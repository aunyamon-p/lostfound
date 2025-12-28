import { Search, Plus, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onCreatePost: () => void;
  onSearch: () => void;
  onLogout: () => void;
  userName?: string;
}

export function Header({ onCreatePost, onSearch, onLogout, userName }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground">
            <span className="text-lg font-bold text-background">L</span>
          </div>
          <span className="hidden font-semibold sm:inline-block">Lost & Found</span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {userName && (
            <span className="mr-2 text-sm text-muted-foreground">
              สวัสดี, {userName}
            </span>
          )}
          <Button variant="icon" size="icon" onClick={onCreatePost} aria-label="สร้างโพสต์">
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant="icon" size="icon" onClick={onLogout} aria-label="ออกจากระบบ">
            <LogOut className="h-5 w-5" />
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="icon"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="เมนู"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'absolute left-0 right-0 border-b border-border bg-background md:hidden',
          'transition-all duration-300 ease-out',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <nav className="container flex flex-col gap-2 py-4">
          {userName && (
            <div className="mb-2 text-sm text-muted-foreground">
              สวัสดี, {userName}
            </div>
          )}
          <Button
            variant="ghost"
            className="justify-start gap-3"
            onClick={() => {
              onSearch();
              setMobileMenuOpen(false);
            }}
          >
            <Search className="h-5 w-5" />
            ค้นหา
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3"
            onClick={() => {
              onCreatePost();
              setMobileMenuOpen(false);
            }}
          >
            <Plus className="h-5 w-5" />
            ลงประกาศ
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3"
            onClick={() => {
              onLogout();
              setMobileMenuOpen(false);
            }}
          >
            <LogOut className="h-5 w-5" />
            ออกจากระบบ
          </Button>
        </nav>
      </div>
    </header>
  );
}
