load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');
load("api_adc.js");
load("api_esp8266.js");

let baseTopic = "doorbell/";
let subbed = false;
let out_door = 12;
let countdown = 0;

GPIO.set_mode(out_door, GPIO.MODE_OUTPUT);

function mqttOpen(conn, topic, msg) {
  Timer.del(countdown);
  let obj = JSON.parse(msg);
  
  if (obj.status === 'open') {
    MQTT.pub(baseTopic + "status", JSON.stringify({ status: "open", message: "Opening door" }), 1);
    open();
    setCountdown();
  }
  
}

function open() {
  GPIO.write(out_door, 0);
  Timer.set(4000, 0, function() {
    GPIO.write(out_door, 1);
  }, 1);
}

function setup() {
    MQTT.pub(baseTopic + "status", JSON.stringify({ status: "ringed", message: "Ringed" }), 1);
    setCountdown();
}

function setCountdown() {
  countdown = Timer.set(60000, 0, function() {
    MQTT.pub(baseTopic + "log", JSON.stringify({ status: "info", message: "Going to deep sleep" }), 1);
    Timer.set(1000, 0, function() {
      ESP8266.deepSleep(0);
    }, null);
  }, null);
}


MQTT.setEventHandler(function(conn, ev, edate) {
  if (ev === MQTT.EV_CONNACK) {
    if (subbed) {
      return;
    }
    subbed = true;
    print("Connecting to topics");
    MQTT.pub(baseTopic + "log", JSON.stringify({ status: "info", message: "Controller started" }), 1);
    MQTT.sub(baseTopic + "open", mqttOpen);
    setup();
  }
}, null);

print('Waiting for mqtt to connect...');