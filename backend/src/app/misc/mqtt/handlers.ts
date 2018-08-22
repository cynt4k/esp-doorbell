import { IMqttMessage, MessageStatus } from '../../types/mqtt';
import { Calling } from '../sip';
import { client, baseTopic } from './init';

export namespace MqttHandler {
    export let handleBell = async (message: IMqttMessage) => {
        if (message.status === MessageStatus.RINGED) {
            try {
                const accepted = await Calling.call();
                if (accepted) {
                    client.publish(baseTopic + '/open', JSON.stringify(<IMqttMessage>{ status: MessageStatus.OPEN.toString(), message: 'Open the door' }));
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

}