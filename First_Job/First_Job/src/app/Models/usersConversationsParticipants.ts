import { ConversationModel } from "./Conversation";
import { Participant } from "./ConversationParticipant";

export interface UsersConversationsParticipants{
    
    allConversations: ConversationModel[];
    allParticipants: Participant[];
}