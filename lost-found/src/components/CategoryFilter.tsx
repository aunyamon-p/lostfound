import { CreditCard, BookOpen, Laptop, Package, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/post';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selected: Category | 'all';
  onSelect: (category: Category | 'all') => void;
}

const categories = [
  { id: 'all' as const, icon: LayoutGrid, label: 'ทั้งหมด' },
  { id: 'card' as const, icon: CreditCard, label: 'บัตร' },
  { id: 'school' as const, icon: BookOpen, label: 'การเรียน' },
  { id: 'it' as const, icon: Laptop, label: 'IT' },
  { id: 'other' as const, icon: Package, label: 'อื่นๆ' },
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant={selected === id ? 'default' : 'secondary'}
          size="sm"
          className={cn(
            'flex-shrink-0 gap-2 rounded-full transition-all',
            selected === id && 'shadow-md'
          )}
          onClick={() => onSelect(id)}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}
