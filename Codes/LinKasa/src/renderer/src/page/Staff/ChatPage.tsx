import Chat from "@renderer/components/Chat/Chat";
import SideBar from "@renderer/components/SideBar";


function ChatPage (){
  return (
    <>
    <div className="flex">
      <SideBar />
      <Chat />
    </div>
    </>
  )
}

export default ChatPage;
