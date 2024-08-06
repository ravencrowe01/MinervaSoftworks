import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SetDisplayComponent } from "./set-display/set-display.component";
import { ForgeryCalculatorComponent } from './forgery-calculator/forgery-calculator.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    SetDisplayComponent,
    ForgeryCalculatorComponent,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Corvids Tools';
}
