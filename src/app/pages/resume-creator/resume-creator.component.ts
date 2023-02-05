import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';

@Component({ selector: 'app-resume-creator', templateUrl: './resume-creator.component.html', styleUrls: ['./resume-creator.component.css'], })
export class ResumeCreatorComponent implements OnInit {

  @ViewChild('upload_button') button_upload!: ElementRef<HTMLElement>;

  formPage = 1;
  form!: FormGroup;
  spinnerData!: any


  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder) {
    this.getDegrees().subscribe((data) => { this.spinnerData = data; });
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('[\u10A0-\u10FF]*'),]),
      surname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('[\u10A0-\u10FF]*'),]),
      image: new FormControl('', [Validators.required]),
      about_me: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('[A-Za-z0-9._-]+@redberry.ge'),]),
      phone_number: new FormControl('', [Validators.required]),
      experiences: this.fb.array([this.experienceForm()]),
      educations: this.fb.array([this.educationForm()]),
    });
  }

  goToPage(pageName: string): void {
    this.router.navigate([`${pageName}`]);
  }

  clickUploadButton() {
    this.button_upload.nativeElement.click();
  }

  onImageChange(e: any) {
    if (e.target.files && e.target.files.length > 0) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => { this.form.controls['image'].setValue(event.target.result); };
    }
  }

  getDegrees() {
    return this.http.get('https://resume.redberryinternship.ge/api/degrees');
  }

  isFirstPageValid() {
    if (
      this.form.controls['name'].valid &&
      this.form.controls['surname'].valid &&
      this.form.controls['image'].valid &&
      this.form.controls['about_me'].valid &&
      this.form.controls['email'].valid &&
      this.form.controls['phone_number'].valid
    ) {
      return true;
    } else {
      return false;
    }
  }

  touchFirstPage() {
    this.form.controls['name'].markAllAsTouched();
    this.form.controls['surname'].markAllAsTouched();
    this.form.controls['image'].markAllAsTouched();
    this.form.controls['about_me'].markAllAsTouched();
    this.form.controls['email'].markAllAsTouched();
    this.form.controls['phone_number'].markAllAsTouched();
  }

  nextFormPage() {
    if (this.formPage == 1) {
      this.touchFirstPage();
      if (this.isFirstPageValid()) {
        console.log('done');

        this.formPage += 1;
      }
    } else if (this.formPage == 2) {
      this.form.controls['experiences'].markAllAsTouched();
      if (this.form.controls['experiences'].valid) {
        this.formPage += 1;
      }
    }
  }

  previousFormPage() {
    if (this.formPage != 1) {
      this.formPage -= 1;
    }
  }

  sendForm() { }

  experienceForm() {
    return new FormGroup({
      position: new FormControl('', [Validators.required, Validators.minLength(2),]),
      employer: new FormControl('', [Validators.required, Validators.minLength(2),]),
      start_date: new FormControl('', [Validators.required]),
      due_date: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  getExperience(i: any) {
    return this.experiences.at(i) as FormGroup
  }

  get experiences() {
    return (this.form.get('experiences') as FormArray)
  }

  addExperienceItem() {
    if (this.form.controls['experiences'].valid) {
      this.experiences.push(this.experienceForm());
    }
    else {
      this.form.controls['experiences'].markAllAsTouched()
    }

  }

  get educations() {
    return (this.form.get('educations') as FormArray)
  }

  educationForm() {
    return new FormGroup({
      institute: new FormControl('', [Validators.required, Validators.minLength(2),]),
      degree: new FormControl('', [Validators.required]),
      due_date: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  getEducation(i: any) {
    return this.educations.at(i) as FormGroup
  }


  addEducationItem() {
    if (this.form.controls['educations'].valid) {
      this.educations.push(this.educationForm());
    }
    else {
      this.form.controls['educations'].markAllAsTouched()
    }
  }
}
