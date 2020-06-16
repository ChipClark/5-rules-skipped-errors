import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [
    MatButtonModule
    ]
})
export class MaterialModule   {
  // cityMenu: FormGroup;
  //   cityController: FormControl;

  // staffMenu: FormGroup;
  //   staffController: FormControl;


  constructor(
    private fb: FormBuilder
  ) {
    this.addMenus();
    }

  ngAfterViewInit() {

  }


  addMenus() {
    // this.cityMenu = this.fb.group({
    //   cityController: null
    // });
    // this.staffMenu = this.fb.group({
    //   staffController: null
    // });


  }


}

