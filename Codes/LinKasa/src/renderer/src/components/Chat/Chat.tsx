import { useState, useEffect, useRef } from "react";
import { auth } from "../../config/firebase";
import { addDoc,onSnapshot,query,where,orderBy,serverTimestamp,getDoc,doc} from "firebase/firestore";
import Message from "../../model/Message";
import { messageCollection, userCollection } from "@renderer/library/Collection";
import User from "@renderer/model/User";
import { useAuthState } from "react-firebase-hooks/auth";
// import { useUserAuth } from "@renderer/library/UserAuthContext";

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState("Global");
  const [user] = useAuthState(auth);
  // const { department } = useUserAuth();

  // const departmentOptions = {
  //   "Global": ["Global"],
  //   "Customer Service and Passenger Assistance": ["Global", "Customer Service and Passenger Assistance"],
  //   "Operations and Coordination": ["Global", "Operations and Coordination"],
  //   "Security and Safety": ["Global", "Security and Staff"],
  //   "Logistics, Cargo, and Supply Chain": ["Global", "Logistics, Cargo, and Supply Chain"],
  //   "Engineering and Maintenance": ["Global", "Engineering and Maintenance"],
  //   "Executive Level": ["Global", "Executive Level"]
  // };

  // const options = departmentOptions[department] || [];

  useEffect(() => {
    const queryMessages = query(
      messageCollection,
      where("room", "==", room),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryMessages, async (snapshot) => {
      const receivedMessages: Message[] = [];
      for (const doc of snapshot.docs) {
        const messageData = doc.data() as Message;
        const userData = await getUserData(messageData.userID) as User;
        receivedMessages.push({ ...messageData, id: doc.id, userData });
      }
      setMessages(receivedMessages);
    });

    return () => unsubscribe();
  }, [room]);

  const getUserData = async (userID: string) => {
    const userDoc = await getDoc(doc(userCollection, userID));

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;

    await addDoc(messageCollection, {
      text: newMessage,
      createdAt: serverTimestamp(),
      userID: auth.currentUser?.uid,
      room,
    });

    setNewMessage("");
    scrollToBottom();
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const isFirestoreTimestamp =
      timestamp && timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined;

    let messageTime;

    if (isFirestoreTimestamp) {
      messageTime = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    } else {
      messageTime = new Date(timestamp);
    }

    const hours = messageTime.getHours();
    const minutes = messageTime.getMinutes();

    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    return formattedTime;
  };

  return (
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen w-full overflow-y-auto">
    <div className="fixed top-0 w-full bg-white p-4">
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold mb-2">{room}</h1>
        </div>
        <select
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="border p-2"
        >
          {/* {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))} */}
          <option value="Global">Global</option>
          <option value="Customer Service and Passenger Assistance">Customer Service and Passenger Assistance</option>
          <option value="Operations and Coordination">Operations and Coordination</option>
          <option value="Security and Staff">Security and Staff</option>
          <option value="Logistics, Cargo, and Supply Chain">Logistics, Cargo, and Supply Chain</option>
          <option value="Engineering and Maintenance">Engineering and Maintenance</option>
          <option value="Executive Level">Executive Level</option>
        </select>
      </div>
      <div className="flex-grow overflow-y-auto mt-40">
        <div className="space-y-4 max-h-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start ${
                message.userID === user?.uid ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <img
                src={message.userData?.profilePicture}
                alt=""
                className="w-12 h-12 rounded-full m-2 object-cover"
              />
              <div className="bg-white p-3 rounded shadow-md">
                <p className="text-sm font-semibold text-gray-800">{message.userData?.name}</p>
                <p className="text-sm font-bold text-blue-500">{message.userData?.roles}</p>
                <p className="text-sm text-gray-600">{message.text}</p>
                <p className="text-xs text-gray-400">
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center bg-white p-5">
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="border p-2 flex-grow"
          placeholder="Type your message here..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
