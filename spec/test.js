
import test from 'ava'

import KV from '../'

test( 'kv2 should grab a value from the store', async t => {
  let kv = KV({
    store: 'etcd',
    url: 'http://0.0.0.0:2379'
  })

  t.is( await kv.get( 'foo' ), 'bar' )
})

test( 'kv2 should return null if the value is not found', async t => {
  let kv = KV({
    store: 'etcd',
    url: 'http://0.0.0.0:2379'
  })

  t.is( await kv.get( 'quux' ), null )
})
