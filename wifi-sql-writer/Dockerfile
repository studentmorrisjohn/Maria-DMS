FROM debian:bullseye-slim

RUN apt update && apt upgrade -y && apt install -y gcc libmariadb-dev libmariadb3

RUN apt-get install python3 -y && apt install python3-pip -y

# Copies files from the host into the container
COPY wifi_sqlwriter.py /

# Installs paho-MQTT and mariadb libraries for python
RUN pip3 install paho-mqtt mariadb

# Tells Docker to run the python code and where it is located
ENTRYPOINT [ "python3", "wifi_sqlwriter.py" ]