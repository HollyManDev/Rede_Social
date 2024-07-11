import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/UserModel';
import { UserServiceService } from 'src/app/Service/user-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss']
})
export class LoginUserComponent implements OnInit {

  userForm!: FormGroup;

  constructor(private userService: UserServiceService, private router: Router) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    this.userForm.patchValue({
      email: 'djamb@gmail.com',
      password: 'djamb12'
    })
  }
  submit() {

    if (this.userForm.valid) {

      const userData: User = this.userForm.value;

      this.userService.AuthenticateUser(userData).subscribe(

        (response) => {
  
          if (response.data) {
            
            
            this.userService.SetUserAuthenticated(response.data.id);
            this.showSuccessMessage();
            this.router.navigate(['/MainUI'])

          } else {

            this.showErrorMessage('Invalid Credentials');

          }
        },
        
            (error) => {
          console.error('Error from User authentication:', error);
          this.showErrorMessage('Error authenticating user. Please try again later.');
        }
      );
    } else {
      this.showErrorMessage('Please fill out all required fields.');
   
      this.userForm.markAllAsTouched();
    }
  }
  
  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Authenticated Successfully',
      showConfirmButton: false,
      timer: 2000 // 2 segundos
    });
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: message,
      showConfirmButton: false,
      timer: 2000 
    });
  }
}
