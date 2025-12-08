import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';

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

}
