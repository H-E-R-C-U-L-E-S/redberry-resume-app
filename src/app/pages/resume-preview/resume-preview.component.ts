import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared-service';

@Component({
  selector: 'app-resume-preview',
  templateUrl: './resume-preview.component.html',
  styleUrls: ['./resume-preview.component.css']
})
export class ResumePreviewComponent implements OnInit {
  data: any;

  constructor(private sharedService: SharedService) { }
  ngOnInit(): void {
    this.sharedService.currentData.subscribe(data => {
      this.data = data;
    });
  }

}
