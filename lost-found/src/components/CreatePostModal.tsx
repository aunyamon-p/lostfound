import { useState, useEffect } from "react";
import {
  X,
  Upload,
  CreditCard,
  BookOpen,
  Laptop,
  Package,
  Search,
  Eye,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Post, PostType, Category } from "@/types/post";
import { cn } from "@/lib/utils";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    post: Omit<Post, "id" | "createdAt" | "status">
  ) => void | Promise<void>;
  editPost?: Post | null;
  currentUserId: string;
  currentUserName: string;
}

const types = [
  { id: "lost" as const, icon: Search, label: "ของหาย" },
  { id: "found" as const, icon: Eye, label: "เจอของ" },
];

const categories = [
  { id: "card" as const, icon: CreditCard, label: "บัตร" },
  { id: "school" as const, icon: BookOpen, label: "อุปกรณ์การเรียน" },
  { id: "it" as const, icon: Laptop, label: "IT/อุปกรณ์" },
  { id: "other" as const, icon: Package, label: "อื่นๆ" },
];

type ImageItem = {
  file?: File; // รูปใหม่
  url: string; // preview / รูปเดิม
};

export function CreatePostModal({
  open,
  onClose,
  onSubmit,
  editPost,
  currentUserId,
  currentUserName,
}: CreatePostModalProps) {
  const [type, setType] = useState<PostType>("lost");
  const [category, setCategory] = useState<Category>("other");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [contact, setContact] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);

  const getImageUrl = (img: string) => {
  if (img.startsWith("http")) return img;
  return `http://localhost:5000${img}`;
};

  /* ===== sync edit ===== */
useEffect(() => {
  if (editPost) {
    setType(editPost.type);
    setCategory(editPost.category);
    setTitle(editPost.title);
    setDescription(editPost.description);
    setLocation(editPost.location);
    setDate(editPost.date);
    setContact(editPost.contact);

    setImages(
      editPost.images.map((img) => ({
        url:
          typeof img === "string"
            ? getImageUrl(img)
            : URL.createObjectURL(img),
        file: img instanceof File ? img : undefined,
      }))
    );
  } else {
    resetForm();
  }
}, [editPost, open]);

  /* ===== upload ===== */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newImages: ImageItem[] = Array.from(e.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setType("lost");
    setCategory("other");
    setTitle("");
    setDescription("");
    setLocation("");
    setDate(new Date().toISOString().split("T")[0]);
    setContact("");
    setImages([]);
  };

  /* ===== submit ===== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const postData: Omit<Post, "id" | "createdAt" | "status"> = {
      type,
      category,
      title,
      description,
      location,
      date,
      contact,
      images: images.map((img) => img.file ?? img.url),
      authorId: currentUserId,
      authorName: currentUserName,
    };

    await onSubmit(postData);
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editPost ? "แก้ไขโพสต์" : "ลงประกาศ"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* type */}
          <div className="grid grid-cols-2 gap-2">
            {types.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setType(id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border-2 p-3",
                  type === id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>

          <div>
  <p className="mb-2 text-sm font-medium">หมวดหมู่</p>
  <div className="grid grid-cols-4 gap-2">
    {categories.map(({ id, icon: Icon, label }) => (
      <button
        key={id}
        type="button"
        onClick={() => setCategory(id)}
        className={cn(
          "flex flex-col items-center justify-center gap-1 rounded-lg border-2 p-3 text-xs",
          category === id
            ? "border-foreground bg-foreground text-background"
            : "border-border"
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </button>
    ))}
  </div>
</div>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="สิ่งของที่หาย/เจอ"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="รายละเอียด"
          />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="สถานที่"
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="ช่องทางติดต่อ"
              className="pl-10"
            />
          </div>

          {/* images */}
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img.url}
                  className="aspect-square rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 rounded bg-black/60 p-1 text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="flex aspect-square cursor-pointer items-center justify-center border-2 border-dashed">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
                <Upload />
              </label>
            )}
          </div>

          <Button type="submit" className="w-full">
            {editPost ? "บันทึกการแก้ไข" : "โพสต์"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
