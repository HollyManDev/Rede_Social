import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { User } from 'src/app/Models/UserModel';
import { UserServiceService } from 'src/app/Service/user-service.service';
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
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['Id', 'Lastname', 'Firstname', 'Gender', 'Age', 'Department', 'Email', 'Status', 'Edit', 'Remove'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserServiceService, private router: Router) { }

  ngOnInit(): void {
    this.userAuthenticated = this.userService.GetUserAuthenticated();
    this.getUsers();

    this.userService.GetDepartments().subscribe(userData => {
          
      if(userData.data){
        this.dep = userData.data;
      }
    });
  }

  getUsers() {
    this.userService.GetUsers().subscribe(userData => {
       if(userData.data){
        this.allUsers = userData.data;
        this.allUsers = this.allUsers.filter(user => user.acess === 'staff');
        this.updateUserList();
       }
    });
  }

  getDepartmentName(departmentId: number): string {
    const department = this.dep.find(dep => dep.id === departmentId);
    return department ? department.department : 'Unknown Department';
  }

  addUser(): void {
    this.userService.SetActionRequired('Add');
    this.router.navigate(['/Register']);
  }

  editUser(user: User) {
    this.userService.SetActionRequired('Edit');
    this.userService.SetUserEdition(user);
    this.router.navigate(['/Register']);
  }


  search(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim().toLowerCase();

    this.dataSource.filter = value;

    if (value) {
      this.dataSource.filterPredicate = (data: User, filter: string) => {
        return data.lastname.toLowerCase().includes(filter) ||
               data.firstname.toLowerCase().includes(filter) ||
               data.email.toLowerCase().includes(filter);
      };
    } else {
      this.dataSource.filterPredicate = () => true;
    }

    this.updateUserList();
  }
  
  async removeUser(user: User) {
    if (user.status !== true) {
      this.alreadyDeleted();
    } else {
      const confirmed = await this.confirmDelete();
      if (confirmed) {
        this.userService.DeleteUser(user).subscribe(
          (response) => {
            this.getUsers();
            this.showSuccessMessage();
          },
          (error) => {
            console.error('Erro ao deletar usuário:', error);
          }
        );
      }
    }
  }

  updateUserList() {
    this.users = this.allUsers.filter(user => user.id !== this.userAuthenticated);
    this.dataSource.data = this.users; // Atualiza os dados da tabela
    if (this.paginator) {
      this.dataSource.paginator = this.paginator; // Conecta o paginator ao dataSource
    }
  }

  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Data Deleted Successfully',
      showConfirmButton: false,
      timer: 2000 // Tempo em milissegundos (2 segundos)
    });
  }

  alreadyDeleted() {
    Swal.fire({
      icon: 'error',
      title: 'Cannot Delete, it is already unavailable!',
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
