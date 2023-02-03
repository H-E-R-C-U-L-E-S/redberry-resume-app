import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeCreatorComponent } from './pages/resume-creator/resume-creator.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'resume-creator', component: ResumeCreatorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
