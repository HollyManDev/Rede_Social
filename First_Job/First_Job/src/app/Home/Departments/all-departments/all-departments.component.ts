import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Department } from 'src/app/Models/Department';
import { User } from 'src/app/Models/UserModel';
import { UserServiceService } from 'src/app/Service/user-service.service';
import Swal from 'sweetalert2';
import { CrudDepartmentComponent } from '../DepartmentCrud/crud-department/crud-department.component';

@Component({
  selector: 'app-all-departments',
  templateUrl: './all-departments.component.html',
  styleUrls: ['./all-departments.component.scss']
})
export class AllDepartmentsComponent {

  departments: Department[] = [];
    
  constructor(private userService: UserServiceService, private router: Router, public dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.userService.GetDepartments().subscribe(userData => {
      this.departments = userData.data;
      this.updateUserList();
    });
  }

  
  openModal(): void {

    const dialogRef = this.dialog.open(CrudDepartmentComponent, {
       height:'40%',
        width: '30%',
        disableClose: true,
        //data: ,
       //autoFocus: false
    });

    
    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal foi fechado. Resultado:', result);
      // Aqui você pode realizar ações com base no resultado do modal
    });
  }

  displayedColumns: string[] = ['Id', 'Department','Status', 'Edit', 'Remove'];
  dataSource = this.departments;

 addDep(): void{
  this.userService.SetActionRequired('Add');
   this.openModal();
 }

  editDepartment(dep: Department) {
    
      this.userService.SetActionRequired('Edit');
      this.userService.SetDepartmentEdition(dep);
     this.openModal();
    
  }

   async removeDepartment(dep: Department) {
       if(dep.status !== true){

           this.alreadyDeleted();
       }
       else{
           
    const confirmed = await this.confirmDelete();

    if(confirmed){
       
        
        this.userService.DeleteDepartment(dep).subscribe(
        
      (response) => {
        this.userService.GetDepartments().subscribe(userData => {
          this.departments = userData.data;
          this.updateUserList();
        });
          this.router.navigate(['/HomeMain/AllDepartments']);
          
          this.showSuccessMessage();

        },
      (error) => {

        console.error('Erro ao Editaruser:', error);

      }
    );
    
    }
       }
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
      title: 'Cant delete, it is already unvailable!',
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
  updateUserList() {
    
    this.dataSource = this.departments;
  }
}
