FROM node:6

WORKDIR /opt

COPY deadleaves .

RUN apt-get update

RUN apt-get -y install python-dev python-pip gcc build-essential python-lxml \
  libfontconfig1-dev libfreetype6-dev

RUN npm install -g bower
RUN npm install && bower install --allow-root
RUN ln -s /usr/local/bin/pip2.7 /usr/local/bin/pip

RUN pip install -r requirements.txt
