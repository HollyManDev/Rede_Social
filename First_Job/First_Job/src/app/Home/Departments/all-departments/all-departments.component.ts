import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Department } from 'src/app/Models/Department';
import { UserServiceService } from 'src/app/Service/user-service.service';
import { CrudDepartmentComponent } from '../DepartmentCrud/crud-department/crud-department.component';

@Component({
  selector: 'app-all-departments',
  templateUrl: './all-departments.component.html',
  styleUrls: ['./all-departments.component.scss']
})
export class AllDepartmentsComponent implements OnInit {

  departments: Department[] = [];
  dep: Department[] = [];
  dataSource: MatTableDataSource<Department> = new MatTableDataSource<Department>([]);
  displayedColumns: string[] = ['Id', 'Department', 'Status', 'Edit', 'Remove'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserServiceService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.GetDepartments().subscribe(userData => {
    
      if(userData.data){
        this.departments = userData.data;
        this.updateUserList();
      }
    });
  }

  openModal(): void {
    const dialogRef = this.dialog.open(CrudDepartmentComponent, {
      height: '40%',
      width: '30%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal foi fechado. Resultado:', result);
      // Aqui você pode realizar ações com base no resultado do modal
    });
  }
  search(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim().toLowerCase();
  
    // Defina o filtro do MatTableDataSource
    this.dataSource.filter = value;
  
    // Se o filtro não estiver vazio, faz o filtro
    if (value) {
      this.dataSource.filterPredicate = (data: Department, filter: string) => {
        return data.department.toLowerCase().includes(filter);
      };
    } else {
      // Se o valor de filtro estiver vazio, mostre todos os dados
      this.dataSource.filterPredicate = () => true;
    }
  
    // Atualize a lista de departamentos
    this.updateUserList();
  }
  
  addDep(): void {
    this.userService.SetActionRequired('Add');
    this.openModal();
  }

  editDepartment(dep: Department) {
    this.userService.SetActionRequired('Edit');
    this.userService.SetDepartmentEdition(dep);
    this.openModal();
  }

  async removeDepartment(dep: Department) {
    if (dep.status !== true) {
      this.alreadyDeleted();
    } else {
      const confirmed = await this.confirmDelete();
      if (confirmed) {
        this.userService.DeleteDepartment(dep).subscribe(
          (response) => {
            this.userService.GetDepartments().subscribe(userData => {
             
              if(userData.data){
                this.departments = userData.data;
                this.updateUserList();
              }
            });
            this.router.navigate(['/HomeMain/AllDepartments']);
            this.showSuccessMessage();
          },
          (error) => {
            console.error('Erro ao deletar departamento:', error);
          }
        );
      }
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
      title: 'Cannot delete, it is already unavailable!',
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
    this.dataSource.data = this.departments; // Atualiza os dados da tabela
    if (this.paginator) {
      this.dataSource.paginator = this.paginator; // Conecta o paginator ao dataSource
    }
  }
}
