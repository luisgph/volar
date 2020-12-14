import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./auth.guard";
import { DispositionComponent } from './components/disposition/disposition.component';

const routes: Routes = [
    { path: 'disposition', component: DispositionComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/disposition', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
