import { Component } from '@angular/core';
import { helloWorld } from "../../src"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = helloWorld();
}
