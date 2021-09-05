#ifndef mqttClient_h
#define mqttClient_h

#include <PubSubClient.h>

class MqttClient : public PubSubClient
{

public:
    MqttClient(const char *id, const char *server, uint16_t port, const char username[], const char password[], const char *topic, Client &client);
};

#endif