
'use strict'


const util = require( 'util' )
const url = require( 'url' )
const req = require( 'superagent' )
const EventEmitter = require( 'eventemitter3' )
const Rx = require( 'rx-lite' )

module.exports = function etcd( opts ) {

  const uri = opts.url + '/v2/keys' + ( opts.id ? '/' + opts.id : '' ) + '/'

  return {
    get: function( key, options ) {
      let opts = options || {
        raw: false
      }

      console.log( 'getting' )

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
            resolve( opts.raw
              ? res.body
              : res.body.node.value )
          })
      })
    },

    /**
     * @note Current version of etcd2 does not seem to support refresh properly
     */
    set: function( key, value, options ) {
      let opts = options || {
        ttl: null,
        refresh: false
      }

      if ( util.isObject( value ) ) {
        value = JSON.stringify( value )
      }

      let body = []
      if ( !opts.refresh ) {
        body.push( `value=${ value }` )
      } else {
        console.warn( 'Etcd refresh tends to kill values, this might not work correctly' )
        body.push( 'refresh=true' )
      }
      if ( opts.ttl ) {
        body.push( `ttl=${ opts.ttl }` )
      }

      return new Promise( ( resolve, reject ) => {
        req.put( uri + key )
          .send( body.join( ';' ) )
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
    },

    watch: function( key ) {
      let request = null
      let complete = false
      let source = Rx.Observable.create( observer => {
        let handler = ( err, res ) => {
          if ( err ) {
            observer.onError( err )
            return
          }

          observer.onNext({
            node: res.body.node,
            prev: res.body.prevNode
          })

          // Start watching again
          console.log( 'testing' )
          if ( !complete ) {
            request = req.get( uri + key + '?wait=true' )
              .end( handler )
          }
        }

        // Initial request
        // request.end( handler )
        request = req.get( uri + key + '?wait=true' )
          .end( handler )


        // Cleanup
        return function() {
          complete = true
          request.abort()
        }
      })

      return source
    }
  }
}
