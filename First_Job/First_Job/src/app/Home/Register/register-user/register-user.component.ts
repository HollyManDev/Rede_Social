import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/UserModel';
import { UserServiceService } from 'src/app/Service/user-service.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit{

     @Output () onSubmit = new EventEmitter<User>();
      
     userForm!: FormGroup;

  ngOnInit(): void {
    
         this.userForm = new FormGroup({
            id:  new FormControl(0),
           firstname: new FormControl('', [Validators.required]), 
           lastname: new FormControl('', [Validators.required]),
           gender: new FormControl('', [Validators.required]),
           age: new FormControl('', [Validators.required]),
           email: new FormControl('', [Validators.required]),
           password: new FormControl('', [Validators.required]),
           status: new FormControl(true)  
         });
  }

  submit(){
      this.onSubmit.emit(this.userForm.value);
  }

}
