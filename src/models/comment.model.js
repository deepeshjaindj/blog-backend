import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

export { Comment };
