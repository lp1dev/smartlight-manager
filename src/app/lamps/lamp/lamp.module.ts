import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LampPage } from './lamp.page';
import { EditModalComponent } from './edit-modal/edit-modal.component';

const routes: Routes = [
  {
    path: '',
    component: LampPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LampPage, EditModalComponent],
  entryComponents: [EditModalComponent]
})
export class LampPageModule {}
