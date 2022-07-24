export class MediaDeviceManager {
    constructor() {
        this._devices = null;
    }

    async list() {
        this._devices = await navigator.mediaDevices.enumerateDevices();
        return this._devices;
    }

    getListOf(type) {
        return this._devices.filter((d) => d.kind === type);
    }

    async getStream(type, deviceId) {
        return await navigator.mediaDevices.getUserMedia({
            [type]: {
                deviceId
            },
        });
    }
}
