import jwt from "jsonwebtoken";
import Post from "../models/post.js";
import User from "../models/user.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "ไม่พบ token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token ไม่ถูกต้อง" });
  }
};

export const getPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
};

export const createPost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "ผู้ใช้ไม่ถูกต้อง" });

    const images = req.files
  ? req.files.map(file => `/uploads/${file.filename}`)
  : [];

const postData = {
  ...req.body,
  images,
  authorId: user._id,
  authorName: user.name,
};
    const post = await Post.create(postData);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "ไม่พบโพสต์" });
    if (post.authorId.toString() !== req.user.id)
      return res.status(403).json({ message: "ไม่มีสิทธิ์แก้ไขโพสต์นี้" });
    const newImages = req.files
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];
    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }
    post.type = req.body.type;
    post.category = req.body.category;
    post.title = req.body.title;
    post.description = req.body.description;
    post.location = req.body.location;
    post.date = req.body.date;
    post.contact = req.body.contact;
    post.images = [...existingImages, ...newImages];
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "ไม่พบโพสต์" });
    if (post.authorId.toString() !== req.user.id)
      return res.status(403).json({ message: "ไม่มีสิทธิ์ลบโพสต์นี้" });

    await post.deleteOne();
    res.json({ message: "ลบโพสต์สำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

