import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume-completed',
  templateUrl: './resume-completed.component.html',
  styleUrls: ['./resume-completed.component.css']
})
export class ResumeCompletedComponent implements OnInit {
  showCard = true;

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  hideCard() {
    this.showCard = false;
  }

  goToPage(pageName: string): void {
    this.router.navigate([pageName], { replaceUrl: true });
  }

}
