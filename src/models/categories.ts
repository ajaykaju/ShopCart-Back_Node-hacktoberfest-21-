import mongoose, { Document, Schema } from "mongoose";

export interface CategoryDocument extends Document {
  pId: string;
  title: string;
  parent: string;
  path: string;
  price: number;
}

const categorySchema: Schema = new Schema(
  {
    pId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    parent: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Categories = mongoose.model<CategoryDocument>(
  "Categories",
  categorySchema
);

export default Categories;
