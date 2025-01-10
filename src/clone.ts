'use strict';

//https://github.com/pvorb/clone/blob/master/clone.js

function clonable( obj: any ): Boolean
{
    return ( obj && typeof obj === 'object' );
}

function clone_object<T extends object>( obj: T, proto: boolean, nodes: Map<object, object> ): T
{
    if( nodes.has( obj )){ return nodes.get( obj ) as T }

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
        clone = new Map();

        for( let [ key, value ] of obj.entries())
        {
            clone.set( clonable( key ) ? clone_object( key, proto, nodes ) : key, clonable( value ) ? clone_object( value, proto, nodes ) : value );
        }
    }
    else if( obj instanceof Date )
    {
        clone = new Date( obj.getTime() );
    }
    // TODO instanceof Promise
    else
    {
        clone = proto ? Object.create( Object.getPrototypeOf( obj )) : new Object();

        for( let [ key, value ] of Object.entries( obj ))
        {
            clone[key] = clonable( value ) ? clone_object( value, proto, nodes ) : value;
        }

        // TODO Object.getOwnPropertySymbols
    }
    
    nodes.set( obj, clone );

    return clone;
}

export default function clone<T>( value: T, proto = false ): T 
{
    return ( clonable( value ) ? clone_object( value as object, proto, new Map() ) : value ) as T;
}