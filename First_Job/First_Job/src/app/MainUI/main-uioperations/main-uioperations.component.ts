import { User } from './../../Models/UserModel';
import { UserServiceService } from './../../Service/user-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-uioperations',
  templateUrl: './main-uioperations.component.html',
  styleUrls: ['./main-uioperations.component.scss']
})
export class MainUIOperationsComponent  implements OnInit{
  users: User [] = [];
  all_Users : User [] = [];
  selectedUser = '';
    clicked = false
     constructor(private  userService : UserServiceService ) {}
  

     ngOnInit(): void {
        
         this.userService.GetUsers().subscribe(Udata =>{
      
            this.all_Users = Udata.data;
            this.users = Udata.data;

         });
     }
    
     chatUser(i: User){
          
      this.selectedUser = `${i.firstname}  ${i.lastname}`;
      this.clicked = true;
           
     }
     search(event: Event): void {
      const target = event.target as HTMLInputElement;
      const value = target.value.toLowerCase();
    
      this.users = this.all_Users.filter(userData => {
        return (userData.firstname.toLowerCase().includes(value)) || (userData.lastname.toLowerCase().includes(value));
      });
    }
    
}

