import {Permissions} from "./permission.js"
import {MediaDeviceManager} from "./MediaDeviceManager.js";

const STREAM_KEY = ""
const INGEST_ENDPOINT = "";

;(async (IVSBroadcastClient) => {
    const config = {
        streamConfig: IVSBroadcastClient.BASIC_LANDSCAPE,
        ingestEndpoint: INGEST_ENDPOINT
    }
    const client = IVSBroadcastClient.create(config);
    const permissions = new Permissions()
    const mediaDeviceManager = new MediaDeviceManager()

    await permissions.request({video: true, audio: true})
    if (!permissions.granted()) return alert('Permissions denied')

    await mediaDeviceManager.list()

    const [camera] = mediaDeviceManager.getListOf('videoinput')
    const [microphone] = mediaDeviceManager.getListOf('audioinput')
    const cameraStream = await mediaDeviceManager.getStream('video', camera.deviceId)
    const microphoneStream = await mediaDeviceManager.getStream('audio', microphone.deviceId)

    client.addVideoInputDevice(cameraStream, 'camera1', {index: 0});
    client.addAudioInputDevice(microphoneStream, 'mic1', {index: 0});
    client.attachPreview(document.getElementById("preview"));

    client.on("activeStateChange", (ev) => {
        console.log("activeStateChange", ev)
    })

    client.on("connectionStateChange", (ev) => {
        console.log("connectionStateChange", ev)
    })

    client.on("clientError", (ev) => {
        console.log("clientError", ev)
    })



    async function startStream(event) {
        if (event.target.textContent === "Stop stream") {
            await client.stopBroadcast()
            event.target.textContent = "Start stream"
            return;
        }
        event.target.disabled = true
        try {
            await client.startBroadcast(STREAM_KEY)
            event.target.textContent = "Stop stream"
            console.log("Streaming started")
        } catch (error) {
            console.error('Something drastically failed while broadcasting!', error);
        } finally {
            event.target.disabled = false
        }
    }

    document.getElementById('stream-btn').addEventListener('click', startStream);

})(window.IVSBroadcastClient)


