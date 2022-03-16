import { Component } from '@angular/core';
import { HeartRateDevice } from '../../src';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(private hrDevice: HeartRateDevice) {}

    public connect() {
        this.hrDevice.connect().subscribe((value) => console.log(value.heartRate));
    }
}
