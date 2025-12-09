import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-succesful-register',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './succesful-register.component.html',
  styleUrl: './succesful-register.component.css'
})
export class SuccesfulRegisterComponent {
  email: string = "";

  constructor(private router: Router) {
    this.email = this.router.getCurrentNavigation()?.extras?.state?.['email'] || "";
  }

  ngOnInit() {}

}
