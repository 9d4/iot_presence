#include <MqttClient.h>

MqttClient::MqttClient(const char *id, const char *server, uint16_t port, const char username[], const char password[], const char *topic, Client &client)
    : PubSubClient(client)
{
    setServer(server, port);

    connect(id, username, password);
    // publish(boardInfoTopic, "ampas");
}
