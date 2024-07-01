
import { Response } from './../Models/ServerResponse/ServerResponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../Models/UserModel';

@Injectable({
  providedIn: 'root'
})

export class UserServiceService {

  private apiUrl = `${environment.ApiUrl}User`
  
  constructor(private http: HttpClient) {}

   GetUsers() : Observable<Response<User[]>>{

    return this.http.get<Response<User[]>>(this.apiUrl);
 
   }
   
   CreateUser(userdata: User) : Observable<Response<User[]>>{

    return this.http.post<Response<User[]>>(`${this.apiUrl}`, userdata);
 
   }
}
