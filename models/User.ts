import { Schema, model, models, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin" | "rider";
  backupEmail?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["customer", "admin", "rider"],
      default: "customer",
    },
    backupEmail: { type: String, default: "" },
  },
  { timestamps: true },
);

export const User: Model<IUser> =
  models.User || model<IUser>("User", UserSchema);
