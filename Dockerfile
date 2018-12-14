FROM node:8.12

#RUN npm install -g yarn@1.2.1

WORKDIR /opt/app-root/

COPY package.json /opt/app-root/

RUN npm install

COPY . /opt/app-root

RUN chmod -R 770 /opt/app-root \
  && chown :0 -R /opt/app-root \
  && date +"%Y-%m-%dT%H:%M:%S.%3NZ" >> /opt/app-root/.build-datetime

#RUN npm run build

CMD ["npm", "start"]
