import { ConversationModel } from "./Conversation";
import { teste } from "./teste";
import { User } from "./UserModel";

export interface UsersConversationsParticipants {
 
    allConversations1: ConversationModel []; // Corrigido para allConversations
    allParticipants: User[];
}
