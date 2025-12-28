import axios from 'axios';
import { Post } from '@/types/post';

const API_URL = 'http://localhost:5000/api/posts';
const AUTH_URL = 'http://localhost:5000/api/auth';

export const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  return data.map((post: any) => ({
    ...post,
    id: post._id, 
  }));
};

export const createPost = async (data: any) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("ไม่พบ token");
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updatePost = async (id: string, data: any) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('ไม่พบ token');

  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { ...res.data, id: res.data._id };
};

export const deletePost = async (id: string) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('ไม่พบ token');
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const loginAPI = async (email: string, password: string) => {
  const res = await axios.post(`${AUTH_URL}/login`, { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const registerAPI = async (name: string, email: string, password: string) => {
  const res = await axios.post(`${AUTH_URL}/register`, { name, email, password });
  if (!res.data) throw new Error("No data returned");
  localStorage.setItem("token", res.data.token);
  return res.data;
};



