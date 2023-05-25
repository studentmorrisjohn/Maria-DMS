docker-compose -f docker-compose-base.yml -f docker-compose-wifi.yml down
docker-compose -f docker-compose-base.yml -f docker-compose-wifi.yml build
docker-compose -f docker-compose-base.yml -f docker-compose-wifi.yml up -d
