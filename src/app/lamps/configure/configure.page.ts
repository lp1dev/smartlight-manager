import { Component, OnInit } from '@angular/core';
import Network from '../network.interface';
import { LampsService } from '../lamps.service';
import { LoadingController } from '@ionic/angular';
import { Location } from '@angular/common';
import { WifiService } from 'src/app/wifi.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.page.html',
  styleUrls: ['./configure.page.scss'],
})
export class ConfigurePage implements OnInit {
  loader: any;
  network: Network = {
    ssid: null,
    bssid: null,
    passphrase: null,
    hidden: false
  };

  constructor(
    private location: Location,
    private wifiService: WifiService,
    private lampsService: LampsService,
    private loadingController: LoadingController) { }

    presentLoading(message: string): Promise<any> {
      return new Promise((resolve, reject) => {
        this.loadingController
        .create({
          message: message,
        })
        .then((loader) => {
          this.loader = loader;
          this.loader.present();
          resolve(this.loader);
        })
        .catch(reject);
      });

  }

  dismissLoading() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  ngOnInit() {
    this
      .presentLoading('Checking your network configuration...')
      .then(() => {
        this
        .wifiService
        .getConnectionInfo()
        .then((connectionInfo) => {
          if (!connectionInfo.SSID || connectionInfo.SSID === '<unknown ssid>') {
            alert('No network found. Please enable the location permission and ensure your local WiFi network is accessible');
          } else {
            this.network.ssid = connectionInfo.SSID.replace(/"/g, '');
            this.network.bssid = connectionInfo.BSSID;
          }
          this.dismissLoading();
        })
        .catch(e => {
          alert(e);
          this.location.back();
          this.dismissLoading();
        });
      });
  }

  configure() {
    this.presentLoading('Setting your smart device up...');
    this
      .lampsService
      .configureLamp(this.network)
      .then((result) => {
        this.dismissLoading();
        this.location.back();
      })
      .catch(error => {
        console.error(error);
        alert(error);
        this.dismissLoading();
      });
  }
}
