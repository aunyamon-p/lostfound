import express from "express";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  verifyToken,
} from "../controllers/post.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getPosts);

router.post(
  "/",
  verifyToken,
  upload.array("images", 5),
  createPost
);

router.put(
  "/:id",
  verifyToken,
  upload.array("images", 5),
  updatePost
);

router.delete("/:id", verifyToken, deletePost);

export default router;
