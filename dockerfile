FROM python:alpine
MAINTAINER Daniel Randall <danny_randall@byu.edu>

# Non-secret ENV variables
ENV FLASK_APP="server.py"

# add deps
RUN apk --no-cache update
RUN apk --no-cache --virtual .build-deps add build-base libffi-dev libxml2-dev openssl-dev krb5-dev && \
    apk --no-cache add libxslt-dev openssl && \
    pip install maya flask flask_cors flask_restplus exchangelib==1.12.1 lxml && \
    apk del .build-deps

# add any required files/folders here
COPY server.py server.py
COPY dbo.py dbo.py
COPY couch.py couch.py
COPY exchange exchange
COPY web-dist web-dist

EXPOSE 5000
ENTRYPOINT flask run --host=0.0.0.0
