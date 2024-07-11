import { Documents } from "./Document";
import { Document_or_Message } from "./Document_or_Message";
import { Message } from "./MessageModel";

export interface UserContent {
  userId: number;
  conversationId: number;
  messages: Message[];
  documents: Documents[];
  content: Array<{data: Document_or_Message }>;

}
