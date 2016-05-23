#!/bin/sh

supervisord -c /etc/supervisord.conf
sleep 5
echo "Setting base store"
etcdctl set foo bar
etcdctl set bar baz
etcdctl mkdir net
etcdctl set net/foo foo
npm run test-local -- -v
