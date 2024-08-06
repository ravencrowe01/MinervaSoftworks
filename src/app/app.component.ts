import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SetDisplayComponent } from "../set-display/set-display.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    SetDisplayComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MinervaSoftworks';
}
