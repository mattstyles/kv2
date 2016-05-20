#!/bin/sh

supervisord -c /etc/supervisord.conf
sleep 5
etcdctl set foo bar
npm run test-local -- -v
