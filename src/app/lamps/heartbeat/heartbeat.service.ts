import { Injectable } from '@angular/core';
import { ProtocolUtils } from '../config/protocol.utils';
import config from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class HeartbeatService {
  interval: any;
  time = 5000;
  socket: any;

  constructor() { }

  start() {
    // if (window['cordova']) {
    //   this.interval = setInterval(() => {
    //     this.probe();
    //   }, this.time);
    // }
  }

  stop() {
    clearInterval(this.interval);
  }

  probe() {
  }
}
