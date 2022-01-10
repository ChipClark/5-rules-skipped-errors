import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {

  constructor(
    private apiService: ApiService,
  ) { }

  // TabIndex:number = 0;

  @Input() chrome: boolean;
  public pagetitle: string;

  ngOnInit() {
    this.setTitle();
  }

  setTitle(): void {
    this.apiService.titleSource.subscribe(result => {
      this.pagetitle = result; // this set's the pagetitle to the default observable value
    });
  }

}
