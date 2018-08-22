import mqtt, { IClientOptions } from 'mqtt';
import { MqttHandler } from './handlers';
import { IMqttMessage } from '../../types/mqtt';

const options: IClientOptions = {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD
};

const baseTopic: string = process.env.MQTT_TOPIC as string || 'doorbell';

let client: mqtt.Client;

export let initMqtt = (): Promise<any> => new Promise(async (resolve, reject) => {

    let initConnect = (): Promise<any> => new Promise((resolve, reject) => {
        client = mqtt.connect('mqtt://' + process.env.MQTT_SERVER + ':' + process.env.MQTT_PORT, options);
        client.on('connect', () => {
            client.subscribe('doorbell/status');
            client.publish('doorbell/log', JSON.stringify({ status: 'info', message: 'Controller started' }));
            return resolve();
        });
        client.on('error', (e) => reject(e));
    });

    let initHandlers = (): Promise<any> => new Promise(async (resolve, reject) => {
        client.on('message', (topic, message) => {
            if (topic.startsWith(baseTopic)) {
                topic = topic.split(baseTopic + '/')[1];

                switch(topic) {
                    case 'status': MqttHandler.handleBell(JSON.parse(message.toString())); break;
                    default: break;
                }
            }
        });
        return resolve();
    });

    try {
        let res = await initConnect();
        res = await initHandlers();
        return resolve();
    } catch (e) {
        return reject(e);
    }

});

export { client, baseTopic }
