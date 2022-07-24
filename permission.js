export class Permissions {
    constructor() {
        this._stream = null;
    }

    async request(constraint) {
        try {
            this._stream = await navigator.mediaDevices.getUserMedia(constraint)
            console.log('stream: ', this._stream)
            for (const track of this._stream.getTracks()) {
                track.stop();
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    granted() {
        return !!this._stream
    }
}
