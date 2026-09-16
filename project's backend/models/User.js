const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "delivery"],
      default: "customer",
    },
    phone: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    loyaltyPoints: {
     type: Number,
     default: 0,
  },
  },
  
  { timestamps: true }
);

userSchema.pre("save", async function () {    // hashes the password before saving
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// compares the login attempt with the hashed one and returns true if they the same
userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;