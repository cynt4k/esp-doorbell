import { asterisk } from './init';
import { IAsteriskResponse, ICall } from '../../types/asterisk';

export namespace Calling {
    export let call = (): Promise<any> => new Promise((resolve, reject) => {
        let options: ICall = <ICall>{
            channel: process.env.CALL_CHANNEL || 'local/200',
            callerid: process.env.CALL_ID || 'Haustür',
            actionid: 123,
            number: process.env.CALL_NUMBER || 300,
            timeout: process.env.CALL_TIMEOUT || 8000
        };

        asterisk
            .on('resp_' + options.actionid, (response: IAsteriskResponse) => {
                if (response.Response === 'Error') {
                    return resolve(false);
                } else if (response.Response === 'Success') {
                    return resolve(true);
                }
            });

        asterisk.action({
            Action: 'Originate',
            Channel: options.channel,
            Context: 'default',
            Priority: '1',
            CallerID: options.callerid,
            Exten: options.number,
            Timeout: options.timeout,
            ActionID: options.actionid
        });
    });
}