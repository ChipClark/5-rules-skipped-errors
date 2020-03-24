import { NgModule, Input } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorsComponent } from './vendors/vendors.component';

const routes: Routes = [
  { path: 'root', component: VendorsComponent },
  { path: '', component: VendorsComponent, pathMatch: 'full' },
  { path: 'vendors', component: VendorsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  @Input() vendors: VendorsComponent;
 }
