import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Home/home/home.component';
import { LoginUserComponent } from './Home/Login/login-user/login-user.component';
import { RegisterUserComponent } from './Home/Register/register-user/register-user.component';
import { HomeNavbarComponent } from './Home/HomeNavBar/home-navbar/home-navbar.component';
import { MainUIOperationsComponent } from './MainUI/main-uioperations/main-uioperations.component';
import { NewGroupComponent } from './MainUI/CreateGroup/new-group/new-group.component';
import { AllUsersComponent } from './Home/Collabotors/all-users/all-users.component';
import { AllDepartmentsComponent } from './Home/Departments/all-departments/all-departments.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Ensure BrowserAnimationsModule is imported
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
//import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrudDepartmentComponent } from './Home/Departments/DepartmentCrud/crud-department/crud-department.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditionComponent } from './MainUI/EditMessage/edition/edition.component';
import { ForwardComponent } from './MainUI/Foward/forward/forward.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginUserComponent,
    HomeNavbarComponent,
    MainUIOperationsComponent,
    NewGroupComponent,
    AllUsersComponent,
    AllDepartmentsComponent,  
    RegisterUserComponent,
    CrudDepartmentComponent,
    EditionComponent,
    ForwardComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, // Import BrowserAnimationsModule
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatMenuModule,
    //MatIconModule,
    MatPaginatorModule,
    HttpClientModule,
    MatCardModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
