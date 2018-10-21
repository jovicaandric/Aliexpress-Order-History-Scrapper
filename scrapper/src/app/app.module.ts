import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import {
  MatToolbarModule,
  MatInputModule,
  MatButtonModule,
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatIconModule,
  MatChipsModule
} from '@angular/material';
import { FilterOrdersPipe } from './pipes/filter-orders.pipe';
import { DateFilterPipe } from './pipes/date-filter.pipe'

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    FilterOrdersPipe,
    DateFilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatIconModule,
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
