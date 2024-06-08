import mongoose, { Schema } from 'mongoose';

const likeSchema = new Schema({
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

const Like = mongoose.model('Like', likeSchema);

export { Like };
