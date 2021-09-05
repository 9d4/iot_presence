# iot_presence
Presence machine that connects to database with web UI

## About Directories

### /board/presence
This directory contains codes for arduino (NodeMCU). You can open it in PIO(PlatformIO). 
More about them here [PlatformIO](https://platformio.org/). It's better than using Arduino Ide

### /mosquitto
This directory contains configuration file for mosquitto. Learn more [here](https://mosquitto.org/).
We use mosquitto as message broker. You can use that configuration like this.
```
mosquitto -c mosquitto.conf
```
Then the username and password would be `admin`.

### /mqtt-trigger
Just a simple javascript helper that subscribe on topic and make a HTTP Request to web server
when new message is published.

### /web
The web UI and database processor.
