import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgDatepickerModule  } from 'ng2-datepicker';
import {
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorIntl,
    MatCheckboxModule,
    MatTooltipModule
} from '@angular/material';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { JwtModule } from "@auth0/angular-jwt";
import { ToastrModule } from 'ngx-toastr';

import { HeaderComponent } from './header/header.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

// import { AmazingTimePickerModule } from "amazing-time-picker";

import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DispositionComponent } from './components/disposition/disposition.component';
import { PnrComponent } from './components/pnr/pnr.component';
import {Spanish} from './translations/spanish';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotAuthorizedComponent,
    DispositionComponent,
    PnrComponent,
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: [],
                blacklistedRoutes: []
            }
        }),
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({maxOpened: 1, autoDismiss: true, preventDuplicates: true}),
        NgDatepickerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        BrowserAnimationsModule,
        // AmazingTimePickerModule,
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        CommonModule,
        MatTooltipModule
    ],
  providers: [
    DatePipe,
    {provide: MatPaginatorIntl, useClass: Spanish}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
