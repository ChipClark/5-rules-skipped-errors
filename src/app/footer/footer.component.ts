import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [DatePipe]
})
export class FooterComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe
  ) { }

  @Input() chrome: boolean;
  public pagetitle: string;
  public myDate: Date;
  public currentYear: string;

  ngOnInit() {
    this.setDate();
    this.setTitle();
  }

  setDate(): void {
    this.myDate = new Date();
    this.currentYear = this.datePipe.transform(this.myDate, 'yyyy');
  }

  setTitle(): void {
    this.apiService.titleSource.subscribe(result => {
    this.pagetitle = result; // this set's the pagetitle to the default observable value
    });
  }


}
