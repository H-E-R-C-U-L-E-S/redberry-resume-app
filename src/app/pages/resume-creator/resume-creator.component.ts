import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-resume-creator',
  templateUrl: './resume-creator.component.html',
  styleUrls: ['./resume-creator.component.css'],
})
export class ResumeCreatorComponent implements OnInit {
  @ViewChild('upload_button') button_upload!: ElementRef<HTMLElement>;

  generalForm!: FormGroup;

  firstName = new FormControl('');
  lastName = new FormControl('');

  constructor(private router: Router) {
    const some = JSON.parse(localStorage.getItem('formValue')!);
  }

  goToPage(pageName: string): void {
    this.router.navigate([`${pageName}`]);
  }

  clickUploadButton() {
    this.button_upload.nativeElement.click();
  }

  ngOnInit(): void {}
}
