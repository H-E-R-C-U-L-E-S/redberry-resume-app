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
  imageURL!: string;

  spinnerData!: any;

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
    phone: new FormControl('', [Validators.required]),
  });

  experienceForm = new FormGroup({});
  educationForm = new FormGroup({});

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
    if (e.target.files) {
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

  previousForm() {
    this.step -= 1;
  }
  nextForm() {
    this.step += 1;
  }

  ngOnInit(): void {}
}
