const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

// 索引：加快查询速度
historySchema.index({ user: 1, viewedAt: -1 });
historySchema.index({ user: 1, food: 1 });

module.exports = mongoose.model('History', historySchema);
