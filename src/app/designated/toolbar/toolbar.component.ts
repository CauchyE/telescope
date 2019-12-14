import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-designated-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  forms: {
    search: string;
  };
  constructor(private router: Router) {
    this.forms = {
      search: ""
    };
  }

  ngOnInit() {}

  async submit() {
    await this.router.navigate(["transactions"], {
      queryParams: { hash: this.forms.search }
    });
  }
}
