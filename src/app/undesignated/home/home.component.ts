import { Component, OnInit } from '@angular/core';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-undesignated-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private state: StateService) { }

  ngOnInit() { }

  onSubmit(url: string, chainID: string) {
    console.log(url);
    console.log(chainID);
    this.state.update({
      designatedHost: {
        url: url,
        chainID: chainID,
      }
    });
  }
}
