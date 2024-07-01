import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/UserModel';
import { UserServiceService } from 'src/app/Service/user-service.service';

@Component({
  selector: 'app-user-crud',
  templateUrl: './user-crud.component.html',
  styleUrls: ['./user-crud.component.scss']
})
export class UserCrudComponent {

  constructor(private userService: UserServiceService, private route: Router){}
  
  createUser(userdata: User){
      
    this.userService.CreateUser(userdata).subscribe(data =>{
            
            //this.route.navigate(['/MainUI/ '])
    });
 }
}
