import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Department } from 'src/app/Models/Department';
import { UserServiceService } from 'src/app/Service/user-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-department',
  templateUrl: './crud-department.component.html',
  styleUrls: ['./crud-department.component.scss']
})
export class CrudDepartmentComponent implements OnInit {

   action: string = ''; 
   depEdition!: Department; 
   userForm!: FormGroup; 
   typeButton: string = '';
   depart: Department  [] = [];

  constructor( private dialogRef: MatDialogRef<CrudDepartmentComponent>,private userService: UserServiceService, private router: Router) {}

  ngOnInit(): void {
   
    this.userService.GetDepartments().subscribe(userData => {
    
      if(userData.data){
        this.depart = userData.data;
        this.depart = this.depart.filter(dep => dep.status === true);
      }
    });

    this.action = this.userService.GetActionRequired();
    this.depEdition = this.userService.GetDepartmentEdition();

      if(this.action === 'Edit'){

        this.typeButton = 'Save'
        this.userForm = new FormGroup({
          department: new FormControl(this.depEdition.department, [Validators.required]),
        });
    } else{
      
      if(this.action === 'Add'){
        
          this.typeButton = 'Add'
         this.initializing();
      
      }
    
    }  
        
  }

  initializing(): void{
    this.userForm = new FormGroup({
      department: new FormControl('', [Validators.required]),
    });
  }
  
  submit() {

    if (this.userForm.valid) {

      const depData:  Department = this.userForm.value;
                  
             depData.status = true;

              if(this.action === 'Edit' && this.typeButton === 'Save'){
                    
                if(this.depEdition.department === depData.department){
                      
                     this.showWarnMessage();
                }
                else{

                  //Passando o id do Departamento para actualizar
                           depData.id = this.depEdition.id;

                  this.userService.UpdateDepartment(depData).subscribe(
                    
                    (response) => {
                        
                      this.showSuccessMessage1();
                      
                      this.router.navigate(['/HomeMain/AllDepartments'])

                    },
                    (error) => {

                      console.error('Erro ao criar usuário:', error);

                    }
                  );
                }
              }
              else{
                if(this.action === 'Add' && this.typeButton === 'Add'){
                      
                  let exist = null;

                   exist = this.depart.find(dep => depData.department.trim() === dep.department.trim());
                   
                   if(exist === null || exist === undefined){
                        this.userService.CreateDepartment(depData).subscribe(
                        
                          (response) => {
                              
                            this.showSuccessMessage();
                            
                            location.reload();
      
                          },
                          (error) => {
      
                            console.error('Erro ao criar usuário:', error);
      
                          }
                        );
                   }
                   else{
                        this.showErrorExistMessage();
                   }
                
                }
              }
    } else {
      this.showErrorMessage('Please fill out all required fields.');
   
      this.userForm.markAllAsTouched();
    }
  }
  
  Close(): void{ 
    this.dialogRef.close('true');
  }
  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Department Saved Successfully',
      showConfirmButton: false,
      timer: 3000 // 2 segundos
    });
  }

  showSuccessMessage1() {
    Swal.fire({
      icon: 'success',
      title: 'Department Updated Successfully',
      showConfirmButton: false,
      timer: 3000 // 2 segundos
    });
  }
 showWarnMessage() {
    Swal.fire({
      icon: 'warning',
      title: 'Cannot update, make sure you have changed one place at least!',
      showConfirmButton: false,
      timer: 3000 // 2 segundos
    });
  }
  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: message,
      showConfirmButton: false,
      timer: 3000 
    });
  }
  
  showErrorExistMessage() {
    Swal.fire({
      icon: 'error',
      title: 'Cannot save, it is already saved!',
      showConfirmButton: false,
      timer: 2000 
    });
  }
}
