import { Injectable } from '@morgan-stanley/needle';
import { BluetoothHelper } from 'ble-helper';
import { from, merge, Observable, of } from 'rxjs';
import { filter, map, mergeMap, share, switchMap, tap } from 'rxjs/operators';
import { HeartRateResult } from './contracts';
import { HEART_RATE_CHARACTERISTIC, HEART_RATE_SERVICE, parseHeartRate } from './heart-rate-helper';
import { isDefined } from './type-guards';

@Injectable()
export class HeartRateDevice {
    constructor(private helper: BluetoothHelper) {}

    public connect(connectionRetries = 5): Observable<HeartRateResult> {
        return this.helper.requestDevice([HEART_RATE_SERVICE]).pipe(
            filter(isDefined),
            mergeMap((device) => this.subscribeToUpdates(device, connectionRetries).pipe(share())),
        );
    }

    private subscribeToUpdates(device: BluetoothDevice, connectionRetries: number): Observable<HeartRateResult> {
        let retries = 0;

        return merge(of(device), this.helper.createDeviceDisconnectionStream(device)).pipe(
            filter(() => retries++ < connectionRetries),
            switchMap((device) => this.helper.connectServer(device)),
            switchMap((server) => this.helper.getService(server, HEART_RATE_SERVICE)),
            switchMap((service) => from(service.getCharacteristic(HEART_RATE_CHARACTERISTIC))),
            switchMap((characteristic) => this.helper.getNotifications(characteristic)),
            tap(() => (retries = 0)),
            map((data) => parseHeartRate(data)),
        );
    }
}
