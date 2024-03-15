import mongoose from "mongoose";

interface CategoryType extends Document {
  name: string;
  products: mongoose.Types.ObjectId[];
}

const categorySchema = new mongoose.Schema<CategoryType>(
  {
    name: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<CategoryType>("Category", categorySchema);

export default Category;
