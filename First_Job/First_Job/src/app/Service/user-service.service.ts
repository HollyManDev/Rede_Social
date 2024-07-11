
import { Response } from './../Models/ServerResponse/ServerResponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../Models/UserModel';
import { UserContent } from '../Models/UserContentModel';
import { Message } from '../Models/MessageModel';
import { ConversationModel } from '../Models/Conversation';
import { UsersConversationsParticipants } from '../Models/usersConversationsParticipants';
import { Participant } from '../Models/ConversationParticipant';

@Injectable({  
  providedIn: 'root'
}) 

export class UserServiceService {

  private idUSER: number = 0;

  private apiUrl = `${environment.ApiUrl}`
  
  constructor(private http: HttpClient) {}

   GetUsers() : Observable<Response<User[]>>{

    return this.http.get<Response<User[]>>(`${this.apiUrl}User`);
 
   }
   
   CreateUser(userdata: User) : Observable<Response<User[]>>{

    return this.http.post<Response<User[]>>(`${this.apiUrl}User`, userdata);
 
   }

   AuthenticateUser(userCredentials: User): Observable<Response<User>> {

   
    return this.http.post<Response<User>>(`${this.apiUrl}User/authenticate`, userCredentials);
    
  }

  UserMessage(userMessage: Message): Observable<Message> {

    return this.http.post<Message>(`${this.apiUrl}Message`, userMessage);
  }
  
  SetUserAuthenticated(id: number){
     
    this.idUSER = id;
  }
  
  GetUserAuthenticated(){
     
    return this.idUSER;
  }

 
  
  getUserContent(userId: number, participantId: number): Observable<Response<UserContent>> {
    const url = `${this.apiUrl}UserContent/${userId}/content/${participantId}`;
    return this.http.get<Response<UserContent>>(url);
  }

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Document/upload`, formData);
  }
  

  CreateConversation(userConversation: ConversationModel) : Observable<Response<ConversationModel>>{

    return this.http.post<Response<ConversationModel>>(`${this.apiUrl}Conversation`, userConversation);
 
   }
   
   AddParticipants(participants: Participant) : Observable<Response<Participant>>{

    return this.http.post<Response<Participant>>(`${this.apiUrl}participants`, participants);
 
   }

   GetConversations(userId: number) : Observable<Response<UsersConversationsParticipants>>{

    return this.http.get<Response< UsersConversationsParticipants>>(`${this.apiUrl}UserConversationParticipant/User/${userId}/ConversationsWithParticipants`);
 
   }

  
  
}
