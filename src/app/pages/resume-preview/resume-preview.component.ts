import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resume-preview',
  templateUrl: './resume-preview.component.html',
  styleUrls: ['./resume-preview.component.css'],
  providers: [DatePipe]
})
export class ResumePreviewComponent implements OnInit {
  data: any;

  constructor(private sharedService: SharedService, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.sharedService.currentData.subscribe(data => {
      this.data = data;
    });
  }

  formatedDate(d: any) {
    return this.datePipe.transform(d, 'yyyy/MM/dd') as string;
  }
}
