const AmiClient = require('asterisk-ami-client');

const client = new AmiClient({
    reconnect: true,
    keepAlive: true,
    emitEventsByTpyes: true,
    emitResponsesById: true
});

export let initAsterisk = (): Promise<any> => new Promise(async (resolve, reject) => {
    try {
        const res = await client.connect(process.env.ASTERISK_USER, process.env.ASTERISK_PASSWORD, { host: process.env.ASTERISK_SERVER, port: process.env.ASTERISK_PORT });
        return resolve();
    } catch (e) {
        return reject(e);
    }
});

export { client as asterisk };
