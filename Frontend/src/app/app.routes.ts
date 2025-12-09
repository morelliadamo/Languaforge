import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import {SuccesfulRegisterComponent} from './succesful-register/succesful-register.component';
import { LoginPageComponent } from './login-page/login-page.component';
import {TermsOfServiceComponent} from './terms-of-service/terms-of-service.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },

  { path: 'register', component: RegisterPageComponent },
  { path: "register/success", component: SuccesfulRegisterComponent},
  { path: 'login', component: LoginPageComponent},
  { path: 'tos', component: TermsOfServiceComponent }
];
