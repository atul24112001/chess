#!/bin/bash
export PATH=$PATH:/root/.nvm/versions/node/v20.9.0/bin

POSTGRESS_DATABASE_PASSWORD="$1"
EXPRESS_SERVER_URL="https://chess.atulmorchhlay.com"
WS_SERVE_URL="ws://chess.atulmorchhlay.com/ws"
IMAGE_SERVER_EXPRESS="chess-server-express"
IMAGE_SERVER_WS="chess-server-ws"
IMAGE_CLIENT="chess-client"
DATABASE_URL="postgres://postgres:$POSTGRESS_DATABASE_PASSWORD@164.68.103.23:1001"
IMAGE_TAG="latest"
DATABASE_NETWORK="backend_bridge"
DATABASE_NAME="chess"
CLIENT_PORT=3003
SERVER_WS_PORT=8005
SERVER_EXPRESS_PORT=8006

cd ~/chess
git stash
git pull origin main

if [ $? -eq 0 ]; then
  echo "Git pull chess successful."
else
  echo "Git pull chess failed. Aborting deployment."
  exit 1
fi

echo "Running backend build"

docker stop $IMAGE_SERVER_EXPRESS
docker stop $IMAGE_SERVER_WS
docker stop $IMAGE_CLIENT

docker rm $IMAGE_SERVER_EXPRESS
docker rm $IMAGE_SERVER_WS
docker rm $IMAGE_CLIENT

docker rmi atul24112001/$IMAGE_SERVER_EXPRESS
docker rmi atul24112001/$IMAGE_SERVER_WS
docker rmi atul24112001/$IMAGE_CLIENT

cd ~/chess/apps/server
docker build -t atul24112001/$IMAGE_SERVER_EXPRESS:$IMAGE_TAG .
docker run -e DATABASE_URL=$DATABASE_URL/$DATABASE_NAME -e REDIS_PASSWORD=$POSTGRESS_DATABASE_PASSWORD -e SECRET=$POSTGRESS_DATABASE_PASSWORD -e PORT=8000 --name $IMAGE_SERVER_EXPRESS --network $DATABASE_NETWORK  -d -p $SERVER_EXPRESS_PORT:8000 atul24112001/$IMAGE_SERVER_EXPRESS:$IMAGE_TAG

cd ~/chess/apps/ws 
docker build -t atul24112001/$IMAGE_SERVER_WS:$IMAGE_TAG .
docker run -e PORT=8000 -e REDIS_PASSWORD=$POSTGRESS_DATABASE_PASSWORD --name $IMAGE_SERVER_WS --network $DATABASE_NETWORK  -d -p $SERVER_WS_PORT:8000 atul24112001/$IMAGE_SERVER_WS:$IMAGE_TAG

cd ~/chess/apps/next-client
docker build -t atul24112001/$IMAGE_CLIENT:$IMAGE_TAG .
docker run -e BASE_URL=$EXPRESS_SERVER_URL -e FRONTEND_URL=$EXPRESS_SERVER_URL --name $IMAGE_CLIENT --network $DATABASE_NETWORK  -d -p $CLIENT_PORT:3000 atul24112001/$IMAGE_CLIENT:$IMAGE_TAG



# BACKEND_IMAGE_NAME="api-generator-backend"
# FRONTEND_IMAGE_NAME="api-generator-frontend"
# DATABASE_URL="postgres://postgres:$POSTGRESS_DATABASE_PASSWORD@postgres_database:5432"
# IMAGE_TAG="latest"
# DATABASE_NETWORK="postgres_bridge"
# PORTS=(8001 8002)
# DATABASE_NAME="api_generator"
# FRONTEND_PORT=3001
 
# cd ~/api-generator
# git pull origin main

# if [ $? -eq 0 ]; then
#   echo "Git pull api generator successful."
# else
#   echo "Git pull api generator failed. Aborting deployment."
#   exit 1
# fi


# # back-end 
# echo "Running backend build"
# cd ~/api-generator/server

# for PORT in "${PORTS[@]}"
# do
  # docker stop $BACKEND_IMAGE_NAME-$PORT
  # docker rm $BACKEND_IMAGE_NAME-$PORT
# done

# docker rmi atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG
# docker build -t atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG .

# if [ $? -eq 0 ]; then
#   echo "Docker image atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG built successfully."
# else
#   echo "Docker image build failed."
#   exit 1
# fi

# for PORT in "${PORTS[@]}"
# do
#   docker run -e DATABASE_URL=$DATABASE_URL/$DATABASE_NAME --name $BACKEND_IMAGE_NAME-$PORT --network $DATABASE_NETWORK -d -p $PORT:8000 atul24112001/$BACKEND_IMAGE_NAME:$IMAGE_TAG
# done

# # Front-end 
# echo "Running fronend build"
# cd ~/api-generator/frontend
# docker stop $FRONTEND_IMAGE_NAME-$FRONTEND_PORT
# docker rm $FRONTEND_IMAGE_NAME-$FRONTEND_PORT
# docker rmi atul24112001/$FRONTEND_IMAGE_NAME:$IMAGE_TAG
# docker build -t atul24112001/$FRONTEND_IMAGE_NAME:$IMAGE_TAG .

# if [ $? -eq 0 ]; then
#   echo "Docker image atul24112001/$FRONTEND_IMAGE_NAME:$IMAGE_TAG built successfully."
# else
#   echo "Docker image build failed."
#   exit 1
# fi
# docker run --name $FRONTEND_IMAGE_NAME-$FRONTEND_PORT -d -p $FRONTEND_PORT:3000 atul24112001/$FRONTEND_IMAGE_NAME:$IMAGE_TAG

# echo "Build Successfully."