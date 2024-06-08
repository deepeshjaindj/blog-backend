import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from '../constants.js';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  password: {
    type: String, // Encrypted String
    required: [true, 'Password is required']
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
  },
  avatar: {
    type: String, // Cloudinary URL
    required: true,
  },
  coverImage: {
    type: String, // Cloudinary URL
  },
  articles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Article'
    }
  ],
  refreshToken: {
    type: String,
  }
}, {
  timestamps: true,
});

/**
 * Middleware function to hash the user's password before saving it to the database.
 * It checks if the password field has been modified before hashing it.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log('Bcrypt password hashing failed!');
    next(error);
  }
});

// Method to compare password
userSchema.methods.isPasswordCorrect = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log('Password comparison failed! ', error);
    return null;
  }
};

// Methods to generate access and refresh tokens
userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullName: this.fullName
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY
    }
  );
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    {
      _id: this._id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY
    }
  );
};

const User = mongoose.model('User', userSchema);

export { User };
