import { Component, OnInit } from '@angular/core';
import { LampsService } from '../lamps/lamps.service';
import { Router } from '@angular/router';
import Lamp from '../lamps/lamp.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(public lampsService: LampsService, private router: Router) {}

  ngOnInit() {
    this
      .lampsService
      .init()
      .then(lamps => {
      })
      .catch(e => console.error(e));
  }

  configure() {
    this.router.navigate(['configure']);
  }

  openLamp(lamp: Lamp) {
    this.router.navigateByUrl('lamp/' + lamp.mac);
  }
}
