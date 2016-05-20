
'use strict'

const url = require( 'url' )
const req = require( 'superagent' )

module.exports = function etcd( endpoint ) {

  const uri = endpoint + '/v2/keys/'

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
    }
  }
}
