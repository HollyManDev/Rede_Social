import { ConversationModel } from "./Conversation";
import { teste } from "./teste";
import { User } from "./UserModel";

export interface UsersConversationsParticipants {
 
    allConversation: ConversationModel []; // Corrigido para allConversations
    allParticipants: User[];
}
