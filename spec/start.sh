#!/bin/sh

supervisord -c /etc/supervisord.conf
sleep 5
echo "Setting base store"
etcdctl set foo bar
etcdctl mkdir net
etcdctl set net/foo netbar
npm run test-local -- -v
