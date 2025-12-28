import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { TypeFilter } from "@/components/TypeFilter";
import { PostCard } from "@/components/PostCard";
import { PostModal } from "@/components/PostModal";
import { CreatePostModal } from "@/components/CreatePostModal";
import { EmptyState } from "@/components/EmptyState";
import { Post, PostType, Category } from "@/types/post";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost as apiDeletePost,
} from "@/service/service";

interface HomeProps {
  user: { id: string; name: string; email: string };
  onLogout: () => void;
}

export default function Home({ user, onLogout }: HomeProps) {
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<Category | "all">("all");
  const [selectedType, setSelectedType] =
    useState<PostType | "all">("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [deletePost, setDeletePost] = useState<Post | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data.map((p: any) => ({ ...p, id: p._id })));
      } catch {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดโพสต์ได้",
          variant: "destructive",
        });
      }
    };
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.location.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      const matchesType =
        selectedType === "all" || post.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [posts, searchQuery, selectedCategory, selectedType]);

  const handleCreateOrUpdatePost = async (
    post: Omit<Post, "id" | "createdAt" | "status">
  ) => {
    try {
      const formData = new FormData();

      formData.append("title", post.title);
      formData.append("description", post.description);
      formData.append("location", post.location);
      formData.append("type", post.type);
      formData.append("category", post.category);
      formData.append("date", post.date);
      formData.append("contact", post.contact);
      formData.append("authorId", post.authorId);
      formData.append("authorName", post.authorName);

      post.images.forEach((img) => {
        if (typeof img === "string") {
          formData.append("existingImages", img);
        } else {
          formData.append("images", img);
        }
      });

      if (editPost) {
        const updated = await updatePost(editPost.id, formData);
        setPosts((prev) =>
          prev.map((p) => (p.id === editPost.id ? updated : p))
        );
        toast({ title: "แก้ไขโพสต์สำเร็จ" });
      } else {
        const created = await createPost(formData);
        setPosts((prev) => [{ ...created, id: created._id }, ...prev]);
        toast({ title: "เพิ่มโพสต์สำเร็จ" });
      }

      setShowCreateModal(false);
      setEditPost(null);
    } catch {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกโพสต์ได้",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!deletePost) return;
    try {
      await apiDeletePost(deletePost.id);
      setPosts((prev) => prev.filter((p) => p.id !== deletePost.id));
      toast({ title: "ลบโพสต์สำเร็จ" });
    } catch {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบโพสต์ได้",
        variant: "destructive",
      });
    } finally {
      setDeletePost(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onCreatePost={() => {
          setEditPost(null);
          setShowCreateModal(true);
        }}
        onSearch={() => {}}
        onLogout={onLogout}
        userName={user.name}
      />

      <main className="container py-6">
        <section className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Lost & Found</h1>
          <p className="text-muted-foreground">
            ค้นหาของที่หายหรือแจ้งพบของ
          </p>
        </section>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="ค้นหาชื่อ, รายละเอียด, สถานที่..."/>
        
        <div className="my-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
          <TypeFilter selected={selectedType} onSelect={setSelectedType} />
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          {filteredPosts.length} รายการ
        </p>

        {filteredPosts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <div key={post.id} style={{ animationDelay: `${index * 50}ms` }}>
                <PostCard
                  post={post}
                  onView={setSelectedPost}
                  onEdit={(p) => {
                    setEditPost(p);
                    setShowCreateModal(true);
                  }}
                  onDelete={setDeletePost}
                  isOwner={post.authorId === user.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            type={
              searchQuery ||
              selectedCategory !== "all" ||
              selectedType !== "all"
                ? "no-results"
                : "no-posts"
            }
          />
        )}
      </main>

      <PostModal
        post={selectedPost}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      <CreatePostModal
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditPost(null);
        }}
        onSubmit={handleCreateOrUpdatePost}
        editPost={editPost || undefined}
        currentUserId={user.id}
        currentUserName={user.name}
      />

      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบโพสต์</AlertDialogTitle>
            <AlertDialogDescription>
              ต้องการลบ "{deletePost?.title}" หรือไม่
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              ลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
