
import ava from 'ava'
import KV from '../'

const wait = async function( delay ) {
  return {
    then: cb => setTimeout( cb, delay )
  }
}

/**
 * Note that currently all of these tests pull from the same underlying
 * etcd instance, meaning that they are not encapsulated, store state
 * will spill from test to test.
 */

// As the tests rely on the same underlying store its marginally safer
// to run them serially
const test = ava.serial

/**
 * Root store namespace
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

test( 'kv2 should delete a value', async t => {
  let kv = KV({
    store: 'etcd',
    url: 'http://0.0.0.0:2379'
  })

  t.is( await kv.get( 'foo' ), 'bar' )
  await kv.del( 'foo' )
  t.is( await kv.get( 'foo' ), null )
})

test( 'kv2 should set a value with a ttl', async t => {
  let kv = KV({
    store: 'etcd',
    url: 'http://0.0.0.0:2379'
  })

  t.is( await kv.get( 'craw' ), null )
  await kv.set( 'craw', 'baz', {
    ttl: 2
  })
  let res = await kv.get( 'craw', {
    raw: true
  })
  t.is( res.node.ttl, 2 )
  t.truthy( res.node.expiration )
  await wait( 3000 )
  t.is( await kv.get( 'craw' ), null )
})

/**
 * Using an identifier namespace
 */
test( 'kv2 should grab a key from an identifier directory', async t => {
  let kv = KV({
    store: 'etcd',
    url: 'http://0.0.0.0:2379',
    id: 'net'
  })

  t.is( await kv.get( 'foo' ), 'netbar' )
})

test( 'kv2 should return null from an identifier directory when not found', async t => {
  let kv = KV({
    store: 'etcd',
    url: 'http://0.0.0.0:2379',
    id: 'net'
  })

  t.is( await kv.get( 'quux' ), null )
})

test( 'kv2 should set a value within an identifier directory', async t => {
  let kv = KV({
    store: 'etcd',
    url: 'http://0.0.0.0:2379',
    id: 'net'
  })

  t.is( await kv.get( 'freddy' ), null )
  await kv.set( 'freddy', 'netbaz' )
  t.is( await kv.get( 'freddy' ), 'netbaz' )
})

test( 'kv2 should delete a value within an identifier directory', async t => {
  let kv = KV({
    store: 'etcd',
    url: 'http://0.0.0.0:2379',
    id: 'net'
  })

  t.is( await kv.get( 'foo' ), 'netbar' )
  await kv.del( 'foo' )
  t.is( await kv.get( 'foo' ), null )
})
