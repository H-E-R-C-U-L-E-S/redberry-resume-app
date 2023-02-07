import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-resume-creator', templateUrl: './resume-creator.component.html',
  styleUrls: ['./resume-creator.component.css'], providers: [DatePipe]
})

export class ResumeCreatorComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;

  formPage = 1;
  form!: FormGroup;
  degreeList: any;

  constructor(private router: Router, private http: HttpClient, private datePipe: DatePipe) {
    this.getDegrees().subscribe((data) => { this.degreeList = data; });
  }

  ngOnInit(): void {

    this.createForm();

    const value = JSON.parse(localStorage.getItem('formValue')!);

    this.form.patchValue(value)
    this.form.valueChanges.subscribe(value => {
      localStorage.setItem('formValue', JSON.stringify(this.form.value));
    });

  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('[\u10A0-\u10FF]*'),]),
      surname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('[\u10A0-\u10FF]*'),]),
      image: new FormControl(null, [Validators.required]),
      about_me: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@redberry.ge$/),]),
      phone_number: new FormControl('+995 ', [Validators.required, Validators.pattern(/^\+995\d{9}$/)]),
      experiences: new FormArray([this.experienceForm()]),
      educations: new FormArray([this.educationForm()]),
    });
  }

  goToPage(pageName: string): void {
    this.router.navigate([`${pageName}`]);
  }

  clickUploadButton() {
    this.fileInput.nativeElement.click();
  }

  fileChange(event: any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0])
    reader.onload = (e: any) => {
      this.form.controls['image'].setValue(event.target.files[0])
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


  sendForm() {
    const formData = new FormData();

    formData.append('name', this.form.controls['name'].value);
    formData.append('surname', this.form.controls['surname'].value);
    formData.append('about_me', this.form.controls['about_me'].value);
    formData.append('email', this.form.controls['email'].value);
    formData.append('phone_number', this.form.controls['phone_number'].value);
    formData.append('image', this.form.controls['image'].value);

    for (let i = 0; i < this.experiences.length; i++) {
      formData.append(`experiences[${i}][position]`, this.experiences.at(i).get('position')!.value);
      formData.append(`experiences[${i}][employer]`, this.experiences.at(i).get('employer')!.value);
      formData.append(`experiences[${i}][start_date]`, this.formatedDate(this.experiences.at(i).get('start_date')!.value));
      formData.append(`experiences[${i}][due_date]`, this.formatedDate(this.experiences.at(i).get('due_date')!.value));
      formData.append(`experiences[${i}][description]`, this.experiences.at(i).get('description')!.value);
    }


    for (let i = 0; i < this.educations.length; i++) {
      formData.append(`educations[${i}][institute]`, this.educations.at(i).get('institute')!.value);
      formData.append(`educations[${i}][degree_id]`, this.educations.at(i).get('degree_id')!.value);
      formData.append(`educations[${i}][due_date]`, this.formatedDate(this.educations.at(i).get('due_date')!.value));
      formData.append(`educations[${i}][description]`, this.educations.at(i).get('description')!.value);
    }

    this.http.post("https://resume.redberryinternship.ge/api/cvs", formData)
      .subscribe(
        response => {
          console.log(response.toString)
        },
        error => {
          console.error(error)
        }
      )
  }

  formatedDate(d: any) {
    return this.datePipe.transform(d, 'yyyy/MM/dd') as string;
  }

  experienceForm() {
    return new FormGroup({
      position: new FormControl('', [Validators.required, Validators.minLength(2),]),
      employer: new FormControl('', [Validators.required, Validators.minLength(2),]),
      start_date: new FormControl(null, [Validators.required]),
      due_date: new FormControl(null, [Validators.required]),
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
      degree_id: new FormControl('', [Validators.required]),
      due_date: new FormControl(null, [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  addEducationItem() {
    if (this.form.controls['educations'].valid) {
      this.educations.push(this.educationForm());
    }
    else {
      this.form.controls['educations'].markAllAsTouched()
    }
  }

  getEducation(i: any) {
    return this.educations.at(i) as FormGroup;
  }

}
