import { ChatHeader, ChatInput, ChatMessages } from "@/components";
import { useOutletContext } from "react-router-dom"


const ChatOutlet = () => {
    const { activeUser, messages } = useOutletContext();
    return (
    <>
          <ChatHeader activeUser={activeUser} />
          <ChatMessages messages={messages} activeUser={activeUser} />
          <ChatInput  activeUser={activeUser} /></>
  )
}
export default ChatOutlet