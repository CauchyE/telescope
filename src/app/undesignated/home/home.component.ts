import { Component, OnInit } from "@angular/core";
import { StateService } from "../../core/services/state.service";

@Component({
  selector: "app-undesignated-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  forms: {
    url: string;
    chainID: string;
  };

  constructor(private state: StateService) {
    this.forms = {
      url: "",
      chainID: ""
    };
  }

  ngOnInit() {}

  submit() {
    this.state.update({
      designatedHost: {
        url: this.forms.url,
        chainID: this.forms.chainID
      }
    });
  }
}
