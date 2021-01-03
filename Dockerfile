FROM node:12.14.1 as build-stage

WORKDIR /root/app
COPY . /root/app/
RUN npm install

RUN npm run build --prod

FROM nginx:1.15

COPY --from=build-stage /root/app/dist/cosmoscan/ /usr/share/nginx/html
