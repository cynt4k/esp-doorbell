import { MessageStatus } from './messagestatus';

export interface IMqttMessage {
    status: MessageStatus,
    message: string
}