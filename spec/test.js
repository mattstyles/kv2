
import test from 'ava'
import KV from '../'

/**
 * Note that currently all of these tests pull from the same underlying
 * etcd instance, meaning that they are not encapsulated, store state
 * will spill from test to test.
 */

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

test( 'kv2 should set a value', async t => {
  let kv = KV({
    store: 'etcd',
    url: 'http://0.0.0.0:2379'
  })

  t.is( await kv.get( 'fred' ), null )
  await kv.set( 'fred', 'baz' )
  t.is( await kv.get( 'fred' ), 'baz' )
})
