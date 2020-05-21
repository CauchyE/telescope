import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onSubmit(query: string) {}
}
