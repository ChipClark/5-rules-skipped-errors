import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatSelectModule, MatTabsModule, MatRadioModule, MatMenuModule, MatTooltipModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { VendorPipe } from './pipe/vendor.pipe';
import { DescriptionPipe } from './pipe/description.pipe';
import { SearchPipe } from './pipe/search.pipe';
import { MaterialModule }  from './material/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    MatButtonModule, MatCheckboxModule, MatRadioModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatTabsModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
