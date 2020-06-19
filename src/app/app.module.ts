import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
//, MatCheckboxModule, MatSelectModule, MatTabsModule, MatRadioModule, MatMenuModule, MatTooltipModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { VendorPipe } from './pipe/vendor.pipe';
import { DescriptionPipe } from './pipe/description.pipe';
import { SearchPipe } from './pipe/search.pipe';
import { VendorsPipe } from './pipe/vendors.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    VendorPipe,
    DescriptionPipe,
    SearchPipe,
    VendorsPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatButtonModule,
    NgbModule,
    AppRoutingModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
