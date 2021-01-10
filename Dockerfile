FROM arm32v7/node:12-stretch
COPY ./release /build/release
RUN cd /build/release && npm install --unsafe-perm && \
    npm start -- --config-only --force-rewrite-config \
    --config-path=data/config/config.json \
    --Server-Database-sqlite-storage='data/db/sqlite.db' \
    --Server-Database-memory-usersFile='data/db/users.db' \
    --Server-Media-folder='data/images' \
    --Server-Media-tempFolder='data/tmp'  || true