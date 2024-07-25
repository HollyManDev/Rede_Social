import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/Models/UserModel';
import { UserServiceService } from 'src/app/Service/user-service.service';

import Swal from 'sweetalert2';
import { Department } from 'src/app/Models/Department';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

  users: User[] = [];
  dep: Department[] = [];
  allUsers: User[] = [];
  userAuthenticated: number = 0;

  constructor(private userService: UserServiceService, private router: Router) { }

  ngOnInit(): void {
    this.userAuthenticated = this.userService.GetUserAuthenticated();

     this.getUsers();

    this.userService.GetDepartments().subscribe(userData => {
      this.dep = userData.data;
    });
  }

  getUsers(){
    this.userService.GetUsers().subscribe(userData => {
      this.allUsers = userData.data;
      this.allUsers = this.allUsers.filter(user => user.acess === 'staff');
      
      this.updateUserList();
    });
  }
  displayedColumns: string[] = ['Id', 'Lastname', 'Firstname', 'Gender', 'Age', 'Department','Email', 'Status', 'Edit', 'Remove'];
  dataSource = this.users;


  getDepartmentName(departmentId: number): string {
    const department = this.dep.find(dep => dep.id === departmentId);
    return department ? department.department : 'Unknown Department';
  }

 addUser(): void{
  this.userService.SetActionRequired('Add');
  this.router.navigate(['/Register']);

 }

  editUser(user: User) {
      this.userService.SetActionRequired('Edit');
      this.userService.SetUserEdition(user);
      this.router.navigate(['/Register']);
  }

   async removeUser(user: User) {
       
    if(user.status !== true){
         this.alreadyDeleted();
    }
    else{
      
    const confirmed = await this.confirmDelete();
    const id = user.id;
   if(confirmed){
       
       this.userService.DeleteUser(user).subscribe(
       
     (response) => {
           
      this.getUsers();
         
         this.showSuccessMessage();

       },
     (error) => {

       console.error('Erro ao Editaruser:', error);

     }
   );
   } 
    }
  }

  updateUserList() {
    // Atualizar a lista de usuários a ser exibida na tabela
    this.users = this.allUsers.filter(user => user.id !== this.userAuthenticated);
    this.dataSource = this.users;
  }

  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Data Deleted Sucessfully',
      showConfirmButton: false,
      timer: 2000 // Tempo em milissegundos (2 segundos)
    });
  }
  
  alreadyDeleted() {
    Swal.fire({
      icon: 'error',
      title: 'Cannot Delete, it is already unvailable!',
      showConfirmButton: false,
      timer: 2000 // Tempo em milissegundos (2 segundos)
    });
  }
  
  confirmDelete(): Promise<boolean> {
    return Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      return result.isConfirmed; // Retorna true se o usuário confirmar, false se cancelar
    });
  }
}
