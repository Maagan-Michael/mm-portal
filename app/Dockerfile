FROM node:21-alpine3.17 as builder

ADD . /workdir

WORKDIR /workdir

RUN yarn install && yarn run build


FROM nginx:1.24.0-alpine
ADD nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /workdir/build /usr/share/nginx/html
