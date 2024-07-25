
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
import { Department } from '../Models/Department';

@Injectable({  
  providedIn: 'root'
}) 

export class UserServiceService {

  private idUSER: number = 0;
  private action: string = '';
  private users!: User;
  private dep!: Department;

  private apiUrl = `${environment.ApiUrl}`
  
  constructor(private http: HttpClient) {}

   GetUsers() : Observable<Response<User[]>>{

    return this.http.get<Response<User[]>>(`${this.apiUrl}User`);
 
   }
   GetDepartments() : Observable<Response<Department[]>>{

    return this.http.get<Response<Department[]>>(`${this.apiUrl}Department`);
 
   }
   
   CreateUser(userdata: User) : Observable<Response<User[]>>{

    return this.http.post<Response<User[]>>(`${this.apiUrl}User`, userdata);
 
   }
    
   UpdateUser(userdata: User) : Observable<Response<User[]>>{

    return this.http.put<Response<User[]>>(`${this.apiUrl}User`, userdata);
 
   }
     
   DeleteUser(user: User) : Observable<Response<User[]>>{

    return this.http.put<Response<User[]>>(`${this.apiUrl}User/DeleteUser`, user);
 
   }

   AuthenticateUser(userCredentials: User): Observable<Response<User>> {

   
    return this.http.post<Response<User>>(`${this.apiUrl}User/authenticate`, userCredentials);
    
  }

  CreateDepartment(department: Department) : Observable<Response<Department[]>>{
         console.log('agora estou aqui ', department)
    return this.http.post<Response<Department[]>>(`${this.apiUrl}Department`, department);
 
   }
     
   UpdateDepartment(department: Department) : Observable<Response<Department[]>>{

    return this.http.put<Response<Department[]>>(`${this.apiUrl}Department`, department);
 
   }
   DeleteDepartment(department: Department) : Observable<Response<Department[]>>{

    return this.http.put<Response<Department[]>>(`${this.apiUrl}Department/Delete`, department);
 
   }
    
  UserMessage(userMessage: Message): Observable<Message> {

    return this.http.post<Message>(`${this.apiUrl}Message`, userMessage);
  }
  
  SetUserAuthenticated(id: number): void{
     
    this.idUSER = id;
  }
  
  GetUserAuthenticated(): number{
     
    return this.idUSER;
  }

   SetActionRequired(actionreq: string): void{
     
    this.action = actionreq;
  }
  
  GetActionRequired(): string{
     
    return this.action;
  }

  SetUserEdition(userEdition: User): void{
     
    this.users = userEdition;
  }
  
  GetUserEdition(): User{
     
    return this.users;
  }
  
  SetDepartmentEdition(depEdition: Department): void{
     
    this.dep = depEdition;
  }
  
  GetDepartmentEdition(): Department{
     
    return this.dep;
  }
  
  getUserContent(userId: number, participantId: number): Observable<Response<UserContent>> {
    const url = `${this.apiUrl}UserContent/${userId}/content/${participantId}`;
    return this.http.get<Response<UserContent>>(url);
  }

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Document/upload`, formData);
  }
  

  CreateConversation(userConversation: ConversationModel) : Observable<Response<number>>{

    return this.http.post<Response<number>>(`${this.apiUrl}Conversation`, userConversation);
 
   }
   
   AddParticipants(participants: Participant) : Observable<Response<Participant>>{

    return this.http.post<Response<Participant>>(`${this.apiUrl}participants`, participants);
 
   }

   GetConversations(userId: number) : Observable<Response<UsersConversationsParticipants>>{

    return this.http.get<Response< UsersConversationsParticipants>>(`${this.apiUrl}UserConversationParticipant/User/${userId}/ConversationsWithParticipants`);
    
   }

   downloadDocument(documentId: number): Observable<Blob> {
    const url = `${this.apiUrl}Document/download/${documentId}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  
}
