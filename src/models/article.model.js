import mongoose, { Schema } from 'mongoose';

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  coverImage: {
    type: String, // Cloudinary URL
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    }
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like',
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
}, {
  timestamps: true,
});

const Article = mongoose.model('Article', articleSchema);

export { Article };
