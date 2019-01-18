import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Lamp from '../lamp.interface';
import { staticPresets, animatedPresets } from '../config/presets';
import { LampsService } from '../lamps.service';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { EditModalComponent } from './edit-modal/edit-modal.component';

@Component({
  selector: 'app-lamp',
  templateUrl: './lamp.page.html',
  styleUrls: ['./lamp.page.scss'],
})
export class LampPage implements OnInit {
  lamp: Lamp;
  staticPresets = staticPresets;
  animatedPresets = animatedPresets;
  range = { min: 135, max: 255 };
  rgbColorStr = `rgb(${this.range.min}, ${this.range.min}, ${this.range.min})`;
  rgbColor = {
    r: this.range.min,
    g: this.range.min,
    b: this.range.min
  };

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    public lampsService: LampsService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (!this.lampsService.lamps.length) {
        this
          .lampsService
          .init()
          .then(() => {
            this.lamp = this.lampsService.getLampByMac(params.mac);
          });
      } else {
        this.lamp = this.lampsService.getLampByMac(params.mac);
      }
    });
  }

  delete() {
    this.lampsService.deleteLamp(this.lamp.mac);
    this.location.back();
  }

  buildGradient(colors) {
    let output = 'linear-gradient(90deg, ';
    const last = colors[colors.length - 1];
    for (const color of colors) {
      if (color !== last) {
        output += color + ', ';
      } else {
        output += color + ')';
        break;
      }
    }
    return output;
  }

  setLightPreset(id: number) {
    this.lampsService.setLightPreset(this.lamp, id)
      .then(() => { })
      .catch(e => console.error(e));
  }

  setPower(on: boolean) {
    this.lampsService.setPower(this.lamp, on)
      .then(() => { })
      .catch(e => console.error(e));
  }

  onRGBChange(color: string, value: number) {
    console.log('range', this.range);
    console.log('onRGBChange', color, value);
    this.rgbColor[color] = value;
    this.rgbColorStr = `rgb(${this.rgbColor.r}, ${this.rgbColor.g}, ${this.rgbColor.b})`;
  }

  setRGBColor() {
    this.lampsService.setRGBColor(this.lamp,
      this.rgbColor.r,
      this.rgbColor.g,
      this.rgbColor.b);
  }

  setBrightness(type: string, value: number) {
    console.log(type, value);
    if (type === 'luminance') {
      this.lampsService.setLuminance(this.lamp, value);
    }
  }
  edit() {
    this.modalCtrl.create({
      component: EditModalComponent,
      componentProps: { lamp: this.lamp },
      backdropDismiss: true
    })
    .then((modal) => {
      modal.present();
    });
  }
}
