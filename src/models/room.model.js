import {model, Schema} from 'mongoose';

const roomSchema = new Schema({
  roomId: {type: String, required: true},
  connectionId: {type: String, required: true},
});

const Room = model('Room', roomSchema);
export default Room;
