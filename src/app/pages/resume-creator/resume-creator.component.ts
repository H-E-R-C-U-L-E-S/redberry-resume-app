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

  generalInfoForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    userImg: new FormControl('', [Validators.required]),
    about: new FormControl(''),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('[A-Za-z0-9._%+-]+@redberry.ge'),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('[\\+9955]w'),
    ]),
  });

  constructor(private router: Router) {}

  goToPage(pageName: string): void {
    this.router.navigate([`${pageName}`]);
  }

  clickUploadButton() {
    this.button_upload.nativeElement.click();
  }

  ngOnInit(): void {}
}
