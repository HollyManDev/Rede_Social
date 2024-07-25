import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterUserComponent } from './Home/Register/register-user/register-user.component';
import { LoginUserComponent } from './Home/Login/login-user/login-user.component';
import { HomeComponent } from './Home/home/home.component';
import { HomeNavbarComponent } from './Home/HomeNavBar/home-navbar/home-navbar.component';
import { MainUIOperationsComponent } from './MainUI/main-uioperations/main-uioperations.component';
import { AllUsersComponent } from './Home/Collabotors/all-users/all-users.component';
import { AllDepartmentsComponent } from './Home/Departments/all-departments/all-departments.component';
import { CrudDepartmentComponent } from './Home/Departments/DepartmentCrud/crud-department/crud-department.component';



const routes: Routes = [


  {
    path: 'HomeMain', component: HomeComponent,
    children: [
    
      {
        path: 'HomeNavbar', component: HomeNavbarComponent
      },

      {
        path: 'AllUsers', component: AllUsersComponent,
       
      },  
      
       {
        path: 'AllDepartments', component: AllDepartmentsComponent,
    
      }
      
    ]
  },
  { path: 'CrudDepartment', component:CrudDepartmentComponent
                
  },
  
  { path: 'Register', component:RegisterUserComponent
                
  },

  {
    path: 'Login', component: LoginUserComponent
  },

  {
    path: 'MainUI', component:MainUIOperationsComponent
  },
  
  {
    path: '',pathMatch: 'full', redirectTo: 'Login'
  }
  
 
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
 