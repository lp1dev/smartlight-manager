import { Component } from '@angular/core';
import Lamp from '../../lamp.interface';
import { NavParams, ModalController } from '@ionic/angular';
import { LampsService } from '../../lamps.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent {
  defaultLamp: string;
  lamp: Lamp;

  constructor(
    private modalCtrl: ModalController,
    private lampsService: LampsService,
    navParams: NavParams) {
    this.defaultLamp = JSON.stringify(navParams.get('lamp'));
    this.lamp = navParams.get('lamp');
    console.log(this.lamp);
  }

  cancel() {
    this.lamp = JSON.parse(this.defaultLamp);
    this.modalCtrl.dismiss();
  }

  save() {
    console.log('Saving information', JSON.stringify(this.lamp.information));
    this.lampsService.setLampInformation(
      this.lamp,
      this.lamp.information.name,
      this.lamp.information.groupId,
      this.lamp.information.groupName,
      this.lamp.information.roomId);
  }
}
