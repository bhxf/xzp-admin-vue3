FROM fholzer/nginx-brotli
LABEL MAINTAINER="412948751@qq.com"
COPY nginx.conf /etc/nginx/nginx.conf
COPY https.conf /etc/nginx/conf.d/default.conf
COPY gzip.conf /etc/nginx/conf.d/gzip.conf
COPY dist /usr/share/nginx/html
