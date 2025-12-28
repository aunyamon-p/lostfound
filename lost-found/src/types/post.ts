export type PostType = 'lost' | 'found';

export type Category = 'card' | 'school' | 'it' | 'other';

export interface Post {
  id: string;
  type: PostType;
  category: Category;
  title: string;
  description: string;
  location: string;
  date: string;
  contact: string;
  images: (File | string)[];
  authorId: string;
  authorName: string;
  status: string;
  createdAt: string;
}


export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export const categoryLabels: Record<Category, string> = {
  card: 'บัตร',
  school: 'อุปกรณ์การเรียน',
  it: 'IT/อุปกรณ์',
  other: 'อื่นๆ',
};

export const categoryIcons: Record<Category, string> = {
  card: 'CreditCard',
  school: 'BookOpen',
  it: 'Laptop',
  other: 'Package',
};
