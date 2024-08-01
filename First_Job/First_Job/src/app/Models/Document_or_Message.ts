export interface  Document_or_Message{
        id: number;
        content_or_FileName: string;
        sentAt_or_UploadedAt: string;
        idConversation: number;
        status: boolean;
        userId: number;
        type: string;
        doawloaded: boolean;
}