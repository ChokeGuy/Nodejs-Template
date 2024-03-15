import mongoose from "mongoose";
import MongooseDelete, { SoftDeleteDocument } from "mongoose-delete";
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

interface ProductType extends SoftDeleteDocument {
  id: number;
  name: string;
  image: string;
  description?: string;
  price: number;
  color: string;
  slug: string;
  deleted?: boolean;
  deletedAt?: Date;
  category: mongoose.Schema.Types.ObjectId;
}

// Create a schema and model for your data
const productSchema = new mongoose.Schema<ProductType>(
  {
    id: Number,
    name: { type: String, maxLength: 255, required: true, index: true },
    image: { type: String, maxLength: 600, required: true },
    description: { type: String, maxLength: 255 },
    price: { type: Number, min: 0, required: true },
    color: { type: String, maxLength: 255, required: true },
    slug: { type: String, slug: "name", unique: true },
    deleted: Boolean,
    deletedAt: { type: Date, default: null },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(MongooseDelete, {
  overrideMethods: ["find", "countDocuments"],
});

const Product = mongoose.model<ProductType>("Product", productSchema);

export { Product };
