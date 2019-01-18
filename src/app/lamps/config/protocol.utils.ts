import config from './config';
import { environment } from 'src/environments/environment';

export class ProtocolUtils {
  static instructions = {
    lampInformation: 0x2e,
    setPreset: 0xa5,
    turnOnOff: 0xa3,
    setRGBColor: 0xa1,
    setLuminance: 0xa7
  };

  static bytesToString(array: Uint8Array): string {
    let output = '';
    for (let i = 0; i < array.length; i++) {
      output += String.fromCharCode(array[i]);
    }
    return output;
  }

  static arrayToBytes(array: number[]): Uint8Array {
    const bytesArray = new Uint8Array(array.length);
    for (let i = 0; i < array.length; i++) {
      bytesArray[i] = array[i];
    }
    return bytesArray;
  }

  static forgeInstructionPacket(instruction, writeSwitch, data, finalByte = 0) {
    const header = [0xfe, 0xef];
    const messageLength = data.length + 1 + 1 + 1 + (finalByte ? 1 : 0); // data + instruction + write_switch (+ last_byte)
    const packet = header.concat([messageLength, instruction, writeSwitch]).concat(data);
    let packetSize = finalByte;
    let lastByte = 0;
    for (const byte of packet) {
      packetSize += byte;
    }
    for (const size of config.PACKET_SIZES) {
      if (size >= packetSize) {
        lastByte = size - packetSize + (finalByte ? 1 : 0);
        if (lastByte > 255) {
          continue;
        }
        packet.push(lastByte);
        if (finalByte) {
          packet.push(finalByte);
        }
        return this.arrayToBytes(packet);
      }
    }
    packet[2] -= 1;
    packet.push(finalByte);
    return this.arrayToBytes(packet);
  }

  static sendTcpData(data: Uint8Array, ip: string, waitForAnswer = false): Promise<Uint8Array> {
    if (!environment.production) {
      console.log('Sending ', data, ' to ', ip);
    }
    return new Promise((resolve, reject) => {
      const Socket = window['Socket'];
      if (Socket) {
        const socket = new Socket();
        socket.open(
          ip,
          config.TCP_PORT,
          () => {
            socket.onError = reject;
            socket.onClose = () => {
              console.warn('Socket closed');
            };
            socket.write(data);
            if (waitForAnswer) {
              socket.onData = (response) => {
                resolve(response);
                socket.close();
              };
            } else {
              socket.close();
              resolve(null);
            }
          }, reject);
      } else {
        reject('TCP Socket plugin not initialized');
      }
    });
  }

}
