import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import Lamp from './lamp.interface';
import Network from './network.interface';
import { ProtocolUtils } from './config/protocol.utils';

const mockLamps = '{"mac":"cc50e307cd4e","ip":"10.0.0.66' +
  '","network":"PoliceNationale","connected": "true", "information":{"name":"LAMPOS","groupId":1,"groupName":"Group1","roomId":0}}';

@Injectable({
  providedIn: 'root'
})
export class LampsService {
  static LAMPS_KEY = 'LAMPS';
  static TCP_PORT = 8080;
  static lampDataReg = /bssid=(\w+),InetAddress=(.*)./;
  lamps: Lamp[] = [];

  constructor(private storage: Storage) {
  }

  init(): Promise<Lamp[]> {
    return new Promise((resolve, reject) => {
      this
        .storage
        .get(LampsService.LAMPS_KEY)
        .then((lampsString: string) => {
          this.lamps = lampsString ? JSON.parse(lampsString) : [];
          this.lamps.forEach(lamp => lamp.connected = false);
          if (!window['cordova']) {
            this.lamps = [JSON.parse(mockLamps)];
          }
          this.lamps.forEach(lamp => {
            this
              .getLampInformation(lamp)
              .then(() => {
              });
          });
          resolve(this.lamps);
        })
        .catch(reject);
    });
  }

  addLamp(lamp: Lamp) {
    this.lamps.push(lamp);
    this
      .getLampInformation(lamp)
      .then(() => { });
    this.storage.set(LampsService.LAMPS_KEY, JSON.stringify(this.lamps));
  }

  deleteLamp(mac: string) {
    this.lamps = this.lamps.filter(l => l.mac !== mac);
    this.storage.set(LampsService.LAMPS_KEY, JSON.stringify(this.lamps));
  }

  setLampInformation(lamp: Lamp, name: string, groupId: number, groupName: string, roomId: number) {
    console.log(('A' + JSON.stringify({name, groupId, groupName, roomId})));
    const information = ('A' + JSON.stringify({name, groupId, groupName, roomId})).split('').map(c => c.charCodeAt(0));
    console.log('information', information);
    return new Promise((resolve, reject) => {
      const data = ProtocolUtils.forgeInstructionPacket(ProtocolUtils.instructions.lampInformation, 1, information);
      ProtocolUtils
        .sendTcpData(data, lamp.ip)
        .then(() => {
          lamp.connected = true;
          resolve(lamp);
        })
        .catch(reject);
    });
  }

  configureLamp(network: Network): Promise<Lamp> {
    return new Promise((resolve, reject) => {
      const espSmartconfig = window['espSmartconfig'];
      if (espSmartconfig) {
        espSmartconfig
          .startConfig(network.ssid, network.bssid, network.passphrase, network.hidden ? 'YES' : 'NO', 1, (res: string) => {
            const data = res.match(LampsService.lampDataReg);
            const lamp = { mac: data[1], ip: data[2], network: network.ssid, connected: true };
            this.addLamp(lamp);
            resolve(lamp);
          }, err => reject(err));
      } else {
        reject('The espSmartconfig module isn\'t correctly configured');
      }
    });
  }


  getLampByMac(mac: string): Lamp {
    return this.lamps.filter(l => l.mac === mac)[0];
  }

  getLampInformation(lamp: Lamp): Promise<Lamp> {
    const data = ProtocolUtils.forgeInstructionPacket(ProtocolUtils.instructions.lampInformation, 0, [0xff]);
    return new Promise((resolve, reject) => {
      ProtocolUtils
        .sendTcpData(data, lamp.ip, true)
        .then(response => {
          const responseStr = ProtocolUtils.bytesToString(response);
          lamp.connected = true;
          lamp.information = JSON.parse(responseStr.match(/{.*}/)[0]);
          resolve(lamp);
        })
        .catch(reject);
    });

  }

  setLightPreset(lamp: Lamp, presetId: number) {
    return this.sendInstruction(lamp, ProtocolUtils.instructions.setPreset, [presetId], 1);
  }

  setRGBColor(lamp, r, g, b) {
    return this.sendInstruction(lamp, ProtocolUtils.instructions.setRGBColor, [r, g, b], 1);
  }

  setLuminance(lamp, value) {
    return this.sendInstruction(lamp, ProtocolUtils.instructions.setLuminance, [value], 1);
  }

  setPower(lamp, on: boolean) {
    return this.sendInstruction(lamp, ProtocolUtils.instructions.turnOnOff, [on ? 17 : 18], 1);
  }

  sendInstruction(lamp: Lamp, instruction: number, data: number[], writeByte: number = 0) {
    const packet = ProtocolUtils.forgeInstructionPacket(instruction, writeByte, data);
    return new Promise((resolve, reject) => {
      ProtocolUtils
        .sendTcpData(packet, lamp.ip)
        .then(() => {
          lamp.connected = true;
          resolve(lamp);
        })
        .catch(reject);
    });
  }
}
