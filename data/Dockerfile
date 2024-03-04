FROM mongo:latest

# ENV MONGO_INITDB_ROOT_USERNAME root
# ENV MONGO_INITDB_ROOT_PASSWORD root
ENV MONGO_INITDB_DATABASE mydatabase
ENV MONGO_INITDB_PORT 27017

COPY ./data/products.json /tmp/products.json
COPY ./data/importscript.sh /docker-entrypoint-initdb.d/

ADD ./data/import-data.js /docker-entrypoint-initdb.d/