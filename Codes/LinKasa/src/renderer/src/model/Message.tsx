import User from "./User";

interface Message{
  id: string;
  text: string;
  createdAt: Date;
  userID: string;
  room: string;
  userData? : User;
}

export default Message;
