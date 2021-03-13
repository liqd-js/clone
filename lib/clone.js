'use strict';

//https://github.com/pvorb/clone/blob/master/clone.js

function clonable( obj )
{
    return ( obj && typeof obj === 'object' );
}

function clone_object( obj, proto, nodes )
{
    if( nodes.has( obj )){ return nodes.get( obj )}

    let clone;

    if( Array.isArray( obj ))
    {
        clone = new Array( obj.length );

        for( let i = 0; i < obj.length; ++i )
        {
            clone[i] = clonable( obj[i] ) ? clone_object( obj[i], proto, nodes ) : obj[i];
        }
    }
    else if( obj instanceof Set )
    {
        clone = new Set();

        for( let value of obj )
        {
            clone.add( clonable( value ) ? clone_object( value, proto, nodes ) : value );
        }
    }
    else if( obj instanceof Map )
    {
        clone = new Set();

        for( let [ key, value ] of obj.entries())
        {
            clone.set( clonable( key ) ? clone_object( key, proto, nodes ) : key, clonable( value ) ? clone_object( value, proto, nodes ) : value );
        }
    }
    // TODO instanceof Promise
    else
    {
        clone = proto ? Object.create( Object.getPrototypeOf( obj )) : new Object();

        for( let property in obj )
        {
            clone[property] = clonable( obj[property] ) ? clone_object( obj[property], proto, nodes ) : obj[property];
        }

        // TODO Object.getOwnPropertySymbols
    }
    
    nodes.set( obj, clone );

    return clone;
}

const clone = module.exports = function clone( obj, proto = false )
{
    return clonable( obj ) ? clone_object( obj, proto, new Map() ) : obj;
}