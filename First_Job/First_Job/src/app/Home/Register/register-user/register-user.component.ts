import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/Service/user-service.service';
import { User } from 'src/app/Models/UserModel';
import Swal from 'sweetalert2';
import { Department } from 'src/app/Models/Department';



@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  userForm!: FormGroup;
  action: string = '';
  typeButton: string = '';
  userEdition!: User;
  departments: Department[]=[];
  dep!: Department;
  depName: string = '';
  deptId: number = 0;

  constructor(private userService: UserServiceService, private router: Router) {}

  ngOnInit(): void {
    
    this.initializeUserFormForAdd();

    this.action = this.userService.GetActionRequired();
    this.userEdition = this.userService.GetUserEdition();

      this.userService.GetDepartments().subscribe(userData => {
     
        if(userData.data){
          this.departments = userData.data;
          this.departments = this.departments.filter(dep => dep.status === true);
        }
     
      if(this.userEdition){
        this.depName = this.getDepFromUser(this.userEdition.departmentId);
      }
   

      if(this.action === 'Edit'){

        this.typeButton = 'Save'
       
        this.initializeUserFormEdit();

    } else{
      
      if(this.action === 'Add'){
        
          this.typeButton = 'Add'
  
          this.initializeUserFormForAdd();
      }
    
    }  
    
    });       
        
  }

  getDepFromUser(departmentId: number): string {
    const department = this.departments.find(dep => dep.id === departmentId);
    return department ? department.department : 'Unknown Department';
  }
 
  getDepId(departmentId: number): number {
    const department = this.departments.find(dep => dep.id === departmentId);
    return department ? department.id : 0;
  }

  initializeUserFormEdit() {
    this.userForm = new FormGroup({
      id: new FormControl(this.userEdition.id),
      firstname: new FormControl(this.userEdition.firstname, [Validators.required]),
      lastname: new FormControl(this.userEdition.lastname, [Validators.required]),
      gender: new FormControl(this.userEdition.gender, [Validators.required]),
      age: new FormControl(this.userEdition.age, [Validators.required]),
      department: new FormControl(this.depName, [Validators.required]),
      email: new FormControl(this.userEdition.email, [Validators.required]),
      password: new FormControl(this.userEdition.password, [Validators.required]),
      status: new FormControl(true),
    });
  }

  initializeUserFormForAdd(){
    
    this.userForm = new FormGroup({
      id: new FormControl(0),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      status: new FormControl(true)
    });

  }

  submit() {

    if (this.userForm.valid) {

      const userData: User = this.userForm.value;
          
        if(this.action === 'Add' && this.typeButton === 'Add'){
                   
          userData.departmentId = this.dep.id;
          userData.acess = 'staff';

          this.userService.CreateUser(userData).subscribe(
        
            (response) => {
                
              this.showSuccessMessage();
              
              this.router.navigate(['/HomeMain/AllUsers'])
    
            },
            (error) => {
    
              console.error('Erro ao criar usuário:', error);
    
            }
          );
        }
        else{

            if(this.action === 'Edit' && this.typeButton === 'Save'){
              
              this.deptId = this.getDeptIdByName(this.depName);
              
              if( userData.firstname === this.userEdition.firstname && userData.lastname === this.userEdition.lastname &&
                  userData.gender === this.userEdition.gender && userData.age === this.userEdition.age && userData.email === this.userEdition.email
                   && this.userEdition.departmentId === this.deptId && userData.password === this.userEdition.password){

                        this.showSuccessMessage2();
                  }
                  else{
              
                    if(this.deptId != 0){
                        
                      //Aqui estou passando o id do departamento que foi selecionado no frontEnd
                        userData.departmentId = this.deptId;
                        userData.acess = 'staff';
                        
                      this.userService.UpdateUser(userData).subscribe(
        
                        (response) => {
                        
                          this.router.navigate(['/HomeMain/AllUsers']);
                          this.showSuccessMessage1();
                
                        },
                        (error) => {
                
                          console.error('Erro ao Editaruser:', error);
                
                        }
                      );
        
                    }
                    
                  }
             
            }
        }
    
    } else {
   
    }
  }

  
  getDepartmentName(dep: Department): void{
    
          const dept: Department ={
            id: dep.id,
            department: dep.department,
            status: dep.status
          }
          this.depName = dep.department;
           this.dep = dep;
  }

 
  getDeptIdByName(dep: string): number{
    let id = 0;   
  for(let i of this.departments){
      
      if(i.department === dep){

        id = i.id;
      }
  }
     return id;
}


  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Data Saved Sucessfully',
      showConfirmButton: false,
      timer: 2000 // Tempo em milissegundos (2 segundos)
    });
  }

  showSuccessMessage1() {
    Swal.fire({
      icon: 'success',
      title: 'Data Updated Sucessfully',
      showConfirmButton: false,
      timer: 2000 // Tempo em milissegundos (2 segundos)
    });
  }
  showSuccessMessage2() {
    Swal.fire({
      icon: 'warning', 
      title: 'Make sure that you have changed at least one place!',
      showConfirmButton: false,
      timer: 3000 // Tempo em milissegundos (2 segundos)
    });
  }
  
  
}
