import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["lost", "found"], required: true },
    title: { type: String, required: true },
    description: String,
    category: {type: String,enum: ["card", "school", "it", "other"],},
    location: String,
    date: Date,
    images: [{ type: String }],
    contact: {type: String,required: [true, "กรุณาระบุช่องทางการติดต่อ"],},
    authorId: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true,},
    authorName: {type: String,required: true,},
    status: {type: String,enum: ["active", "resolved"],default: "active",},
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);

