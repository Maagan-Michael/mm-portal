#!/bin/bash

exec 3<>/dev/tcp/127.0.0.1/8080

echo -e "GET /realms/master/.well-known/openid-configuration HTTP/1.1
host: localhost:$1
" >&3

timeout 1 cat <&3 | grep "HTTP/1.1 200 OK" || exit 1