import { Routes } from '@angular/router';
import { SetDisplayComponent } from './set-display/set-display.component';
import { ForgeryCalculatorComponent } from './forgery-calculator/forgery-calculator.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'museumsets', component: SetDisplayComponent },
    { path: 'forgerycalc', component: ForgeryCalculatorComponent },
    { path: 'home', component: HomeComponent },
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: '**', component: HomeComponent }
];
