import { Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostType } from '@/types/post';
import { cn } from '@/lib/utils';

interface TypeFilterProps {
  selected: PostType | 'all';
  onSelect: (type: PostType | 'all') => void;
}

const types = [
  { id: 'all' as const, label: 'ทั้งหมด' },
  { id: 'lost' as const, icon: Search, label: 'ของหาย' },
  { id: 'found' as const, icon: Eye, label: 'เจอของ' },
];

export function TypeFilter({ selected, onSelect }: TypeFilterProps) {
  return (
    <div className="inline-flex rounded-lg bg-muted p-1">
      {types.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          className={cn(
            'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all',
            selected === id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => onSelect(id)}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </button>
      ))}
    </div>
  );
}
