import { NgModule, Input } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { InvoicesComponent } from './invoices/invoices.component';


const routes: Routes = [
  { path: 'root', component: InvoicesComponent },
  { path: '', component: InvoicesComponent, pathMatch: 'full' },


  { path: 'invoices', component: InvoicesComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
