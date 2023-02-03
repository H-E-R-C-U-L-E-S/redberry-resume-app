import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { ResumeCreatorComponent } from './pages/resume-creator/resume-creator.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AppComponent, WelcomePageComponent, ResumeCreatorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
