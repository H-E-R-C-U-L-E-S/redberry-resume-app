import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-resume-completed',
  templateUrl: './resume-completed.component.html',
  styleUrls: ['./resume-completed.component.css']
})
export class ResumeCompletedComponent implements OnInit {
  constructor(private dialog: MatDialog) { }
  ngOnInit(): void {
    this.openDialog()
  }
  openDialog() {
    this.dialog.open(this.dialogContent, {
      panelClass: 'no-blur-background',
      position: { top: '10px', right: '10px' },
      hasBackdrop: false,
    });
  }
  @ViewChild('dialogContent', { static: true }) dialogContent!: TemplateRef<any>;
}
