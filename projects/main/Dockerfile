FROM node:14 as build-stage

WORKDIR /root/app
COPY . /root/app/
RUN npm ci
RUN npm run build -- --prod

FROM nginx:1.15

COPY --from=build-stage /root/app/dist/main/ /usr/share/nginx/html/
