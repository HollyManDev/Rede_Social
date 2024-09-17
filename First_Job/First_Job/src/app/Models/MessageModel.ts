export interface Message {
    id: number;
    content: string;
    sentAt: string;
    idConversation: number;
    status: boolean;
    myStatus: boolean;
    userId: number;
    seen: boolean;

  }  