import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-designated-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() { }

  async onSubmit(hash: string) {
    await this.router.navigate(['transactions'], {
      queryParams: { hash: hash }
    });
  }
}
