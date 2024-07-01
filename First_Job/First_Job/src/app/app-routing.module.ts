import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterUserComponent } from './Home/Register/register-user/register-user.component';
import { LoginUserComponent } from './Home/Login/login-user/login-user.component';
import { HomeComponent } from './Home/home/home.component';
import { HomeNavbarComponent } from './Home/HomeNavBar/home-navbar/home-navbar.component';
import { MainUIOperationsComponent } from './MainUI/main-uioperations/main-uioperations.component';


const routes: Routes = [


  {
    path: 'HomeMain', component: HomeComponent,
    children: [
      
      {
        path: 'Login', component: LoginUserComponent
      },
      {
        path: 'HomeNavbar', component: HomeNavbarComponent
      }
    
    ]
  },

  {
    path: 'MainUI', component:MainUIOperationsComponent
  },

  { path: 'Register', component:RegisterUserComponent
        
  },
  
  {
    path: '',pathMatch: 'full', redirectTo: 'HomeMain'
  }
  
 
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
