interface LampInformation {
    name: string;
    groupId: number;
    groupName: string;
    roomId: number;
}

export default interface Lamp {
    mac: string;
    ip: string;
    network: string;
    connected: boolean;
    type?: string;
    information?: LampInformation;
}
