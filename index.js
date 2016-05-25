
'use strict'

function promisify( named, store ) {
  let fn = function() {
    return new Promise( ( resolve, reject ) => {
      store[ named ].call( store, ...arguments )
        .then( resolve )
        .then( reject )
    })
  }
  Object.defineProperty( fn, 'name', {
    value: named
  })
  return fn
}

module.exports = function kv( opts ) {

  let store = null

  if ( opts.store === 'etcd' ) {
    store = require( './etcd' )( opts )
  }

  const wrapper = {}
  const methods = [
    'set',
    'get',
    'del'
  ]

  methods.forEach( method => {
    wrapper[ method ] = promisify( method, store )
  })

  /**
   * Returns a stream that emits new values
   */
  wrapper.watch = function watch( key, cb ) {
    if ( cb ) {
      return store
        .watch( key )
        .subscribe( cb )
    }

    return store
      .watch( key )
  }

  return wrapper
}
