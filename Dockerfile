FROM node:12.14.1 as build-stage

WORKDIR /app
COPY ./package*.json /app/

RUN npm install
COPY . /app/

RUN npm run config:generate
RUN npm run build -- --output-path=./dist/out

FROM nginx:1.15

COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf
