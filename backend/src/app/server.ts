import dotenv from 'dotenv';

switch(process.env.NODE_ENV) {
    case 'test': dotenv.config({ path: '.env-test' }); break;
    case 'dev': dotenv.config({ path: '.env-dev' }); break;
    case 'production': dotenv.config({ path: '.env-prod' }); break;
    default: console.error('No environment specified - exit'); process.exit(1);
}

process.env.TZ = "Europe/Berlin";

import app from "./app";
import { Calling, initAsterisk as asterisk } from './misc/sip';
import { initMqtt as mqtt } from './misc/mqtt';

(async() => {

    try {
        const result = await asterisk();
        console.log('Asterisk connected');
    } catch (err) {
        console.log('Check your SIP client: ' + err);
        process.exit(1);
    }

    try {
        const result = await mqtt();
        console.log('Mqtt connection established');
    } catch (err) {
        console.log('Check your mqtt connection: ' + err);
        process.exit(1);
    }

    try {
        const result = await app.listen(app.get('port'));
        console.log('Server status:\n\t- PORT: ' + app.get('port') + '\n\t- Mode: ' + app.get('env'));
    } catch (err) {
        console.log('Check your express server: ' + err);
        process.exit(1);
    }
})();