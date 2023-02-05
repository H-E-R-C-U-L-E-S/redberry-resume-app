import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resume-creator',
  templateUrl: './resume-creator.component.html',
  styleUrls: ['./resume-creator.component.css'],
})
export class ResumeCreatorComponent implements OnInit {
  @ViewChild('upload_button') button_upload!: ElementRef<HTMLElement>;

  step: any = 1;
  imageURL = '';

  spinnerData!: any;

  generalInfoForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern('[\u10A0-\u10FF]*'),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern('[\u10A0-\u10FF]*'),
    ]),
    about: new FormControl(''),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('[A-Za-z0-9._-]+@redberry.ge'),
    ]),
    phone: new FormControl('', [Validators.required]),
  });

  experienceForm = new FormGroup({
    position: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    employer: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    jobStartDate: new FormControl('', [Validators.required]),
    jobEndDate: new FormControl('', [Validators.required]),
  });

  educationForm = new FormGroup({
    school: new FormControl('', [Validators.required, Validators.minLength(2)]),
    degree: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private http: HttpClient) {
    this.getDegrees().subscribe((data) => {
      this.spinnerData = data;
    });
  }

  goToPage(pageName: string): void {
    this.router.navigate([`${pageName}`]);
  }

  clickUploadButton() {
    this.button_upload.nativeElement.click();
  }

  showImgPreview(e: any) {
    if (e.target.files && e.target.files.length > 0) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = (event: any) => {
        this.imageURL = event.target.result;
      };
    }
  }

  getDegrees() {
    return this.http.get('https://resume.redberryinternship.ge/api/degrees');
  }

  nextForm() {
    console.log(this.generalInfoForm.controls['phone'].value);

    if (this.step == 1) {
      this.generalInfoForm.markAllAsTouched();
      if (this.generalInfoForm.valid && this.imageURL.length > 0) {
        this.step += 1;
      }
    } else if (this.step == 2) {
      this.experienceForm.markAllAsTouched();
      if (this.experienceForm.valid) {
        this.step += 1;
      }
    }
  }

  previousForm() {
    this.step -= 1;
  }

  sendForm() {
    this.educationForm.markAllAsTouched();
    if (this.educationForm.valid) {
      alert('good job');
    }
  }

  ngOnInit(): void {}
}
