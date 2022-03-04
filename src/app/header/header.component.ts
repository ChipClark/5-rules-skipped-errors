import { ApiService } from './../api.service';
import { tap, delay } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    protected sanitizer: DomSanitizer
  ) { }

  @Input() chrome!: boolean;
  public pagetitle!: string;
  public searchTerm: any;

  ngOnInit() {
    this.setTitle();
  }

  getTitle(title: string): SafeHtml {
    let tempHTML = title;
    tempHTML = '<a href="/" class="header-tag" >' + title + '</a>';
    return this.sanitizer.bypassSecurityTrustHtml(tempHTML);
  }

  sanitizeScript(sanitizer: DomSanitizer) { }

  setTitle(): void {
    this.apiService.titleSource.pipe(
      delay(10),
      tap(() => this.pagetitle)
    ).subscribe(result => {
      this.pagetitle = result; // this set's the pagetitle to the default observable value
    });
  }

}
