import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/services/shared-service';


@Component({
  selector: 'app-resume-creator', templateUrl: './resume-creator.component.html',
  styleUrls: ['./resume-creator.component.css'], providers: [DatePipe]
})

export class ResumeCreatorComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;

  formPage = 1;
  form!: FormGroup;
  degreeList: any;

  constructor(private router: Router, private http: HttpClient, private datePipe: DatePipe, private sharedService: SharedService) {
    this.getDegrees().subscribe((data) => { this.degreeList = data; });
  }

  ngOnInit(): void {
    const storedData = JSON.parse(localStorage.getItem('formData')!);

    this.createForm();

    if (storedData) {
      this.form.controls['name'].setValue(storedData.name)
      this.form.controls['surname'].setValue(storedData.surname)
      this.form.controls['image'].setValue(storedData.image)
      this.form.controls['about_me'].setValue(storedData.about_me)
      this.form.controls['email'].setValue(storedData.email)
      this.form.controls['phone_number'].setValue(storedData.phone_number)

      this.experiences.clear()
      let i = 0
      storedData.experiences.forEach((element: any) => {
        this.experiences.push(this.experienceForm())
        this.experiences.at(i).setValue(element)
        i++
      });

      this.educations.clear()
      let j = 0;
      storedData.educations.forEach((element: any) => {
        this.educations.push(this.educationForm())
        this.educations.at(j).setValue(element)
        i++
      });

      this.sharedService.updateData(this.form.value);

    }

    this.form.valueChanges.subscribe(value => {
      this.sharedService.updateData(this.form.value);
      localStorage.setItem('formData', JSON.stringify(this.form.value));
    });
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^[\u10A0-\u10FF]+$'),]),
      surname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^[\u10A0-\u10FF]+$'),]),
      image: new FormControl(null, [Validators.required]),
      about_me: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@redberry.ge$/),]),
      phone_number: new FormControl('', [Validators.required, Validators.pattern(/^(\+995)\s\d{3}\s\d{2}\s\d{2}\s\d{2}$/)]),
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
      this.form.controls['image'].setValue(e.target.result)
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
    this.form.controls['name'].markAsTouched();
    this.form.controls['surname'].markAsTouched();
    this.form.controls['image'].markAsTouched();
    this.form.controls['about_me'].markAsTouched();
    this.form.controls['email'].markAsTouched();
    this.form.controls['phone_number'].markAsTouched();
  }

  nextFormPage() {
    console.log(this.form.value);

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
    formData.append('phone_number', this.formatedPhone(this.form.controls['phone_number'].value));
    formData.append('image', this.dataURItoBlob(this.form.controls['image'].value));

    for (let i = 0; i < this.experiences.length; i++) {
      formData.append(`experiences[${i}][position]`, this.experiences.at(i).get('position')!.value);
      formData.append(`experiences[${i}][employer]`, this.experiences.at(i).get('employer')!.value);
      formData.append(`experiences[${i}][start_date]`, this.formatedDate(this.experiences.at(i).get('start_date')!.value));
      formData.append(`experiences[${i}][due_date]`, this.formatedDate(this.experiences.at(i).get('due_date')!.value));
      formData.append(`experiences[${i}][description]`, this.experiences.at(i).get('description')!.value);
    }


    for (let i = 0; i < this.educations.length; i++) {
      formData.append(`educations[${i}][institute]`, this.educations.at(i).get('institute')!.value);
      formData.append(`educations[${i}][degree_id]`, this.educations.at(i).get('degree')!.value.id);
      formData.append(`educations[${i}][due_date]`, this.formatedDate(this.educations.at(i).get('due_date')!.value));
      formData.append(`educations[${i}][description]`, this.educations.at(i).get('description')!.value);
    }

    this.http.post("https://resume.redberryinternship.ge/api/cvs", formData)
      .subscribe(
        response => {
          this.goToPage('resume-completed')
          //localStorage.clear();
        },
        error => {
          console.error(error)
        }
      )
  }

  formatedDate(d: any) {
    return this.datePipe.transform(d, 'yyyy/MM/dd') as string;
  }

  formatedPhone(p: any) {
    return p.replace(/\s/g, "");
  }

  dataURItoBlob(dataURI: any) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
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

  deleteExperienceItem() {
    this.experiences.removeAt(this.form.controls['experiences'].value.length - 1)
  }

  get educations() {
    return (this.form.get('educations') as FormArray)
  }

  educationForm() {
    return new FormGroup({
      institute: new FormControl('', [Validators.required, Validators.minLength(2),]),
      degree: new FormControl('', [Validators.required]),
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

  deleteEducationItem() {
    this.educations.removeAt(this.form.controls['educations'].value.length - 1)
  }

  getEducation(i: any) {
    return this.educations.at(i) as FormGroup;
  }

}
