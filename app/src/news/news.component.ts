import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../app/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  @Input() ticker = '';
  compNews: any[] = [];
  constructor(private api: ApiService, private modalService: NgbModal) { }

  openModal(content: any) {
    this.modalService.open(content);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.run();
  }

  public trackItem(index: number, item: any) {
    return item.trackId;
  }

  run() {
    this.api.getNews(this.ticker).subscribe((data => {
      if (data.error) {
        data = [];
      }
      for (let i = 0; i < data.length; i++) {
        if (this.hasEmptyObj(data[i]))
          continue;
        this.compNews.push(data[i]);
      }
      //console.log("compNews: ", data);
    }))
  }

  hasEmptyObj(obj: any) {
    for (let prop in obj) {
      if (obj[prop].length == 0) {
        return true;
      }
    }
    return false;
  }

}
