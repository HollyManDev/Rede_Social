import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/Service/user-service.service';
import { User } from 'src/app/Models/UserModel';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  userForm!: FormGroup;

  constructor(private userService: UserServiceService, private router: Router) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      id: new FormControl(0),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      status: new FormControl(true)
    });
  }

  submit() {
    if (this.userForm.valid) {

      const userData: User = this.userForm.value;

      this.userService.CreateUser(userData).subscribe(
        
        (response) => {
            
          this.showSuccessMessage();

        },
        (error) => {

          console.error('Erro ao criar usuário:', error);

        }
      );
    } else {
   
    }
  }
  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Data Saved Sucessfully',
      showConfirmButton: false,
      timer: 2000 // Tempo em milissegundos (2 segundos)
    });
  }
  
}
