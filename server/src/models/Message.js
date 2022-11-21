const { Schema, default: mongoose } = require('mongoose');

const messageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  roomId: { type: Schema.Types.ObjectId, required: true },
  text: { type: String, required: true, maxLength: 255 },
  replyToId: { type: Schema.Types.ObjectId },
  reports: {
    userId: { type: String },
    madeAt: { type: Date, default: Date.now() }
  }
});

// static methods

messageSchema.statics.getAll = (page = 0, size = 10) => mongoose.model('Message').find({ limit: size, skip: page * size });

messageSchema.statics.getAllFromRoomId = (roomId, page = 0, limit = 10) => mongoose.model('Message').find({ roomId }, { limit, skip: limit * page });

messageSchema.statics.getById = (id) => mongoose.model('Message').findById(id);

messageSchema.statics.insert = (userId, roomId, text, replyToId) => {
  let newMessage = {
    userId, roomId, text, report: {}
  };

  if (replyToId) { newMessage = { ...newMessage, replyToId }; }

  return mongoose.model('Message').create(newMessage);
};

// instance methods

messageSchema.methods.updateText = function updateText(text) {
  this.text = text;
  return this.save();
};

messageSchema.methods.report = function report(userId) {
  this.report = { userId };
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);
