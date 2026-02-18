import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { SuccesfulRegisterComponent } from './succesful-register/succesful-register.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { CourseHubComponent } from './course-hub/course-hub.component';
import { CourseContentComponent } from './course-content/course-content.component';
import { noAuthGuard } from './guards/no-auth-guard';
import { registrationGuard } from './guards/registration-guard';
import { UnitHubComponent } from './unit-hub/unit-hub.component';
import { LessonHubComponent } from './lesson-hub/lesson-hub.component';
import { LessonContentComponent } from './lesson-content/lesson-content.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './guards/auth-guard';
import { ProfilePageComponent } from './profile-page/profile-page.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },

  { path: 'register', component: RegisterPageComponent },
  {
    path: 'register/success',
    component: SuccesfulRegisterComponent,
    canActivate: [registrationGuard],
  },
  { path: 'login', component: LoginPageComponent, canActivate: [noAuthGuard] },
  { path: 'tos', component: TermsOfServiceComponent },
  { path: 'my/courses', component: CourseHubComponent },
  { path: 'my/courses/:id', component: UnitHubComponent },
  { path: 'my/courses/:courseId/units/:unitId', component: LessonHubComponent },
  {
    path: 'my/courses/:courseId/units/:unitId/lessons/:id',
    component: LessonContentComponent,
  },
  
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'profile', component: ProfilePageComponent, /*canActivate: [authGuard] */},
];
