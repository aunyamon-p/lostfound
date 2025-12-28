import { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  CreditCard, 
  BookOpen, 
  Laptop, 
  Package, 
  MoreHorizontal, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Phone
} from 'lucide-react';
import { Post, Category } from '@/types/post';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostCardProps {
  post: Post;
  onView: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  isOwner?: boolean;
}

const categoryIcons: Record<Category, React.ComponentType<{ className?: string }>> = {
  card: CreditCard,
  school: BookOpen,
  it: Laptop,
  other: Package,
};

export function PostCard({ post, onView, onEdit, onDelete, isOwner }: PostCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const CategoryIcon = categoryIcons[post.category];

  const getImageSrc = (img: string | File) => {
  if (typeof img === "string") {
    return img.startsWith("http")
      ? img
      : `http://localhost:5000${img}`;
  }
  return URL.createObjectURL(img);
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-xl bg-card transition-card cursor-pointer',
        'border border-border hover:border-foreground/10',
        'shadow-card hover:shadow-card-hover',
        'animate-fade-in'
      )}
      onClick={() => onView(post)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {post.images && post.images.length > 0 ? (
          <>
            <img
              src={getImageSrc(post.images[currentImage])}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            {post.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <CategoryIcon className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Type Badge */}
        <div
          className={cn(
            'absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium',
            post.type === 'lost'
              ? 'bg-lost/90 text-lost-foreground'
              : 'bg-found/90 text-found-foreground'
          )}
        >
          {post.type === 'lost' ? 'ของหาย' : 'เจอของ'}
        </div>

        {/* Status Badge */}
        {post.status === 'resolved' && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-foreground/80 px-2 py-1 text-xs text-background">
            <CheckCircle className="h-3 w-3" />
            เสร็จสิ้น
          </div>
        )}

        {/* Owner Actions */}
        {isOwner && (
          <div
            className="absolute right-3 top-3"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="h-7 w-7 bg-background/80 backdrop-blur-sm"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(post)}>
                  แก้ไข
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete?.(post)}
                >
                  ลบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground line-clamp-1">{post.title}</h3>
        </div>

        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
          {post.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {post.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {post.contact}
          </span>
        </div>
      </div>
    </article>
  );
}
