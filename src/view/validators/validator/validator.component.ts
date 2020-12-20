import { Component, OnInit, Input } from '@angular/core';
import { Validator } from 'cosmos-client/api';

@Component({
  selector: 'view-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
})
export class ValidatorComponent implements OnInit {
  @Input()
  validator?: any; // Validator | null;

  constructor() {}

  ngOnInit(): void {}
}
