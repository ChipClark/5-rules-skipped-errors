import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { VendorPipe } from './pipe/vendor.pipe';
import { DescriptionPipe } from './pipe/description.pipe';
import { SearchPipe } from './pipe/search.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    VendorPipe,
    DescriptionPipe,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ScrollDispatchModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
