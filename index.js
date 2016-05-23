
'use strict'

module.exports = function kv( opts ) {

  let store = null

  if ( opts.store === 'etcd' ) {
    store = require( './etcd' )( opts.url )
  }

  return {
    get: function( key ) {
      return new Promise( ( resolve, reject ) => {
        store.get( key )
          .then( resolve )
          .catch( reject )
      })
    },

    set: function( key, value ) {
      return new Promise( ( resolve, reject ) => {
        store.set( key, value )
          .then( resolve )
          .catch( reject )
      })
    }
  }
}
