import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WifiService {

  constructor() { }

  getConnectedDevices(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (window['cordova'] && window['cordova'].plugins['hotspot']) {
        const hotspot = window['cordova'].plugins['hotspot'];
        this
          .isOn()
          .then(isOn => {
            if (!isOn) {
              reject('You need to turn the WiFi and location on to scan your network');
            } else {
              hotspot.getAllHotspotDevices(resolve, reject);
            }
          })
          .catch(reject);
      }
    });
  }

  getConnectionInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (window['cordova'] && window['cordova'].plugins['hotspot']) {
        const hotspot = window['cordova'].plugins['hotspot'];
        this
          .isOn()
          .then(isOn => {
            if (!isOn) {
              reject('You need to turn the WiFi and location on to connect with your smart devices');
            } else {
              hotspot.getConnectionInfo(resolve, reject);
            }
          })
          .catch(reject);
      }
    });
  }

  isOn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (window['cordova'] && window['cordova'].plugins['hotspot']) {
        const hotspot = window['cordova'].plugins['hotspot'];
        hotspot.isWifiOn(resolve, reject);
      }
    });
  }
}
