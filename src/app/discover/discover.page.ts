import { Component, OnInit } from '@angular/core';
import { WifiService } from '../wifi.service';
import { LoadingController } from '@ionic/angular';
import { LampsService } from '../lamps/lamps.service';
import { Location } from '@angular/common';
import Lamp from '../lamps/lamp.interface';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage {
  devices: Array<Lamp>;

  constructor(
    private location: Location,
    private loadingCtrl: LoadingController,
    private lampsService: LampsService,
    private wifiService: WifiService) { }


  createLoader(): Promise<any> {
    return this.loadingCtrl.create({
      message: 'Searching for devices on your network...'
    });
  }

  discover() {
    this
      .createLoader()
      .then((loader) => {
        loader.present();
        this
          .wifiService
          .getConnectedDevices()
          .then((devices: Array<any>) => {
            const espDevices = devices = devices.filter(device => device.mac.startsWith('cc:50:e3'));
            const infoPromises = espDevices.map(device => this.lampsService.getLampInformation(device));
            Promise
              .all(infoPromises)
              .then((lamps) => {
                console.log('Found lamps', lamps);
                this.devices = lamps;
                loader.dismiss();
              })
              .catch(error => {
                this.devices = [];
                loader.dismiss();
              });
          })
          .catch(error => {
            alert(error);
            loader.dismiss();
          });
      });
  }

  saveDevice(device: Lamp) {
    console.log('saveDevice ::', device);
    this.lampsService.addLamp(device);
    this.location.back();
  }

}
