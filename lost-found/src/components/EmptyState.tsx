import { Search, Package } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-posts' | 'no-results';
}

export function EmptyState({ type }: EmptyStateProps) {
  const Icon = type === 'no-results' ? Search : Package;
  
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-foreground">
        {type === 'no-results' ? 'ไม่พบผลลัพธ์' : 'ยังไม่มีโพสต์'}
      </h3>
      <p className="text-sm text-muted-foreground">
        {type === 'no-results' 
          ? 'ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรอง' 
          : 'เป็นคนแรกที่ลงประกาศ!'}
      </p>
    </div>
  );
}
