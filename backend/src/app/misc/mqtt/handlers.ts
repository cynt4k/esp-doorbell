import { IMqttMessage, MessageStatus } from '../../types/mqtt';
import { Calling } from '../sip';

export namespace MqttHandler {
    export let handleBell = async (message: IMqttMessage) => {
        if (message.status === MessageStatus.RINGED) {
            try {
                const accepted = await Calling.call();
                if (accepted) {

                }
            } catch (err) {
                console.log(err);
            }
        }
    };

}