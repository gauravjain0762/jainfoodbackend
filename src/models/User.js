const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../constants");
const addressSchema = require("./Address");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER,
    },
    addresses: [addressSchema],
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    avatarUrl: { type: String },
    refreshTokenHash: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokenHash;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
