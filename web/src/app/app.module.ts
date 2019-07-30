import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserIdleModule } from 'angular-user-idle';

import { HttpClientModule } from '@angular/common/http';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import {
  MatToolbarModule,
  MatCardModule,
  MatGridListModule,
  MatButtonModule,
  MatIconModule,
  MatSelectModule,
  MatFormFieldModule,
  MatBottomSheetModule
} from '@angular/material';

import { TimeComponent } from './components/time/time.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BookPageComponent } from './components/book-page/book-page.component';
import { BookWindowComponent } from './components/book-window/book-window.component';
import { SchedulePageComponent } from './components/schedule-page/schedule-page.component';
import { ScheduleListComponent } from './components/schedule-list/schedule-list.component';
import { KeyboardSheetComponent } from './components/keyboard-sheet/keyboard-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    TimeComponent,
    MainPageComponent,
    BookPageComponent,
    BookWindowComponent,
    SchedulePageComponent,
    ScheduleListComponent,
    KeyboardSheetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UserIdleModule.forRoot({ idle: 60, timeout: 1, ping: 30 }),
    HttpClientModule,
    ScrollDispatchModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatBottomSheetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
