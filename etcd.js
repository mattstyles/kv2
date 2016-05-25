
'use strict'

const util = require( 'util' )
const url = require( 'url' )
const req = require( 'superagent' )

module.exports = function etcd( opts ) {

  const uri = opts.url + '/v2/keys' + ( opts.id ? '/' + opts.id : '' ) + '/'

  return {
    get: function( key ) {
      return new Promise( ( resolve, reject ) => {
        req.get( uri + key )
          .end( ( err, res ) => {
            if ( err ) {
              // 404 is valid so return null
              if ( res.status === 404 ) {
                resolve( null )
                return
              }

              // Anything else and throw
              reject( err )
              return
            }

            // Just return the current value
            resolve( res.body.node.value )
          })
      })
    },

    set: function( key, value ) {
      if ( util.isObject( value ) ) {
        value = JSON.stringify( value )
      }

      return new Promise( ( resolve, reject ) => {
        req.put( uri + key )
          .send( 'value=' + value )
          .end( ( err, res ) => {
            if ( err ) {
              reject( err )
              return
            }

            let node = res.body.node
            let prev = res.body.prevNode

            resolve({ node, prev })
          })
      })
    },

    del: function( key ) {
      return new Promise( ( resolve, reject ) => {
        req.del( uri + key )
          .end( ( err, res ) => {
            if ( err ) {
              reject( err )
              return
            }

            let node = res.body.node
            let prev = res.body.prevNode

            resolve({ node, prev })
          })
      })
    }
  }
}
