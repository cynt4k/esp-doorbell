const JsSIP = require('jssip');
const NodeWebSocket = require('jssip-node-websocket');

let socket = new NodeWebSocket('ws://' + process.env.WS_SERVER);
let config = {
    sockets: [ socket ],
    uri: 'SIP:' + process.env.SIP_USER + '@' + process.env.SIP_SERVER,
    password: process.env.SIP_PASSWORD,
    register: true
};

let phone = new JsSIP.UA(config);

export let init = async (): Promise<any> => new Promise(async (resolve, reject) => {

    phone.start();

    phone!.on('registered', (e) => {
        return resolve();
    });

    phone!.on('registrationFailed' , (e) => {
        return reject(e);
    });
});

export { phone };