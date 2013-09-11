/**
 * A jQuery plugin for detecting when the content of a DOM element
 * has changed.
 *
 * Authored by : Knight W. Fu
 * Copyright : I don't care, do whatever you will with it. If you
 * want, claim it for your own.
 *
 * Minimum Version ( uses Object.defineProperty on DOM elements )
 * 
 * Ff : 4 ( Gecko 2 )
 * Ch : 5
 * IE : 9 ( 8 untested, but might work )
 * Op : 11.6/12
 * Sa : 5.1
 *
 * Note: this plugin wraps the native innerHTML,
 * appendChild, removeChild, insertAdjacentElement, insertAdjacentHTML,
 * insertAdjacentText, insertBefore, replaceChild ( Gecko )
 *
 * and a lot of other IE functions (which we will not mention).
 *
 * Note: This also wraps WebkitMutationEvent, which deprecates more 
 * than 90% of the code written here.
 *
 */
(function( $ )
{
   // use mutation observer via webkit or base feature supported
   // see http://mzl.la/11I6MPa - the MDN page for MutationObserver
   var MutationObserver = MutationObserver || WebKitMutationObserver;

   // if MutationObserver is supported one way or another
   if( typeof MutationObserver == 'function' )
   {
      // define a new content type
      MutationEvent = new $.CustomEvent.EventType( 'contentchange',
      {
         process : function( data )
         {
            var eventTarget = data.target;

            eventTarget.mutObsCount =
               eventTarget.mutObsCount? eventTarget.mutObsCount + 1 
               : 1;

            if( target.mutationObserver )
            {
               // we want the minimum config; that way, it would
               // least likely to cause serious impacts
               var mutationConfig = {
                  childList : true,

                  attributes : true,

                  characterData : true
               };

               eventTarget.mutationObserver = new MutationObserver(
                  function( mutations )
                  {
                     var index = mutations.length;

                     while( --index >= 0 )
                     {
                        var mutationRecord = mutations[ index ];

                        // if the mutation event type is childlist
                        if( mutationRecord.type == 'childList' )
                        {
                           // trigger the content change event
                           $.CustomEvent.trigger
                              ( eventTarget,
                                // the target element

                                'contentchange',
                                // the event name

                                {
                                   cancellable : false,

                                   oldValue : mutationRecord.oldValue,

                                   trigger : 'change node-tree',

                                   newValue : target.childNodes
                                 }
                                 // data associated with the
                                 // mutation

                                 // we are not providing any methods to
                                 // execute, because principly, the observer
                                 // is called when the action has already
                                 // been performed
                               );
                        }
                     }

                  } );

               target.mutationObserver.observe( eventTarget, mutationConfig );
            }
         },

         cancellable : false,
         // this event is not cancellable

         cleanup : function( data )
         {
            // if there are no more mutataion observers, then
            // we should simply call cleanup by calling the disconnect
            // method of the mutation observer, and then delete it
            if( --eventTarget.mutObsCount == 0 )
            {
               eventTarget.mutationObserver.disconnect();
               delete eventTarget.mutationObserver;
            }
         }
         // method to call when an event listener is removed
      });

      $.CustomEvent.register( MutationEvent );
      return;
   }

   // defining a function for taking a Node and wrapping event
   // listening mutators and properties
   function wrapMuts( nodeTarget )
   {
      if( nodeTarget.processed )
         return;

      // set the nodeTarget's processed property
      nodeTarget.processed = true;

      var tagName = nodeTarget.tagName || 'baseMethods',
          // cache the tag name of the target element, or if
          // it doesn't exist, use the baseMethods
          
          clone = nodeTarget._clone = nodeTarget.cloneNode();
          // and make a clone

      var methodNames = defaults.methodNames,
          // get the names of the methods
          
          index = methodNames.length,
          // and keep an index set initially to the length
          // to be used later for iterating the list

          methods = ( defaults[ tagName ] !== undefined )?
             defaults[ tagName ] : (defaults[ tagName ] = {}) && false;
          // and get the cached method if they exist, or
          // simply set the value of method to false
      
      // clone the innerHTML
      clone.innerHTML = nodeTarget.innerHTML;

      // clone the dir attribute
      if( nodeTarget.dir !== undefined )
         clone.dir = nodeTarget.dir;

      // for each method named in the list...
      while( --index >= 0 )
      {
         var methodName = methodNames[ index ],
             // get the name of the method     
             
             method = ( methods )? 
                methods[ methodName ] :
                ( typeof nodeTarget[ methodName ] == 'function' )?
                   defaults[ tagName ][ methodName ] = 
                      nodeTarget[ methodName ] : 
                   false;
             // and get the method from the cache if cache
             // exists, or if it doesn't, cache the method in {defaults}
             // so other HTML element with the same tag name can just
             // access the cache instead (which might be faster) 

         // in the rare event that the method name is actually NOT
         // supported, don't do anything
         if( !method ) continue;

         // otherwise, override the method to account for triggering
         // of the event
         nodeTarget[ methodName ] = function()
         {
            // store the argument
            var args = arguments;
            
            // trigger the pre- and post-contentchange events with
            $.CustomEvent.trigger
               ( nodeTarget,
                 // the target element

                 'contentchange',
                 // the event name

                 {
                    cancellable : true,

                    trigger : methodName,

                    params  : args
                 },
                 // any additional data associated

                 function()
                 {
                    // first invoke the methods on the 
                    // clone (so the clone can have the
                    // same attributes as the target)
                    method.apply( clone, args );

                    // then invoke the original method 
                    // on the target element
                    return method.apply( 
                       nodeTarget, args );
                 }
                 // a closure wrapper for the original
                 // method
                );
         }

      }

      // if we don't have the ability to redefine the properties of
      // HTML elements via defineProperty, then skip this step
      if( typeof Object.defineProperty != 'function' ) return;
      
      var propertyNames = defaults.propertyNames,
          // get the names of the methods

          methods = ( defaults[ tagName ] !== undefined )?
             defaults[ tagName ] : false;
          // and get the cached method if they exist, or
          // simply set the value of method to false

      // reset index initially to the length of the
      // propertyNames list, to be used later for
      // to be used later for iterating the list
      index = propertyNames.length;

      while( --index >= 0 )
      {
            Object.setPropertyDescriptor( nodeTarget, 
               propertyNames[ index ] );
      }

   }

   // define a set property descriptor that uses defineProperty to
   // set a property descriptor
   Object.setPropertyDescriptor = 
      function( eventTarget, propertyName, handler )
      {
         var propertyObj = 
            Object.getOwnPropertyDescriptor( eventTarget, propertyName ),
             // get the property object via descriptor

             clone = eventTarget._clone;
             // cache the clone

         // if the property descriptor gives us nothing, then
         // the property is not supported; do nothing 
         if( propertyObj == undefined ) 
            return false;

         // it should not have value
         delete propertyObj.value;

         // it should not be writable
         delete propertyObj.writable;

         // the setter with trigger
         propertyObj.set = function( value )
         {
            // trigger the pre- and post-contentchange events with
            $.CustomEvent.trigger
               ( eventTarget,
                 // the target element

                 'contentchange',
                 // the event name

                 {
                    cancellable : true,

                    trigger : 'set ' + propertyName,

                    newValue : value,

                    oldValue : clone[ propertyName ]
                 },
                 // any additional data associated

                 function()
                 {
                    // set the property on the clone
                    clone[ propertyName ] = value;
                    
                    // and normalize the clone's inner content
                    if( clone.normalize )
                       clone.normalize();

                    // then set the target element's 
                    // inner content
                    var childNodes = clone.childNodes || clone.children,

                        index = -1,

                        length = childNodes.length,

                        tagName = eventTarget.tagName || 'baseMethods';

                    // clear target element's inner content
                    while( eventTarget.childNodes.length )
                    {
                       defaults[ tagName ].removeChild.call( eventTarget,
                          eventTarget.childNodes[ 0 ] ); 
                    }

                    // and successively add the inner content of the
                    // clone
                    while( ++index < length )
                    {
                       defaults[ tagName ].appendChild.call( eventTarget,
                          childNodes[ index ] );
                    }

                    clone[ propertyName ] = value;
                 }
                 // a closure wrapper for the setter
                );
         }

         // the getter which...
         propertyObj.get = function( )
         {
            // just returns the same property on the clone
            return clone[ propertyName ];
         }

         // now override the existing property
         Object.defineProperty( eventTarget, propertyName, propertyObj );

         console.log( eventTarget[ propertyName ] );

      };

   // define a list of names that
   var defaults = {
      methodNames : [ // Gecko-Webikit 
                'appendChild', 

                'insertAdjacentElement', 

                'insertAdjacentHTML',

                'insertAdjacentText',

                'insertBefore',

                'removeChild',

                'replaceChild',

                'normalize',

                // MS-IE
                'applyElement',

                'replaceAdjacentText',

                'removeNode',

                'replaceNode',

                'swapNode'

              ],

      propertyNames : [
         'innerHTML',

         'outerHTML',

         'innerText',

         'outerText',

         'textContent'
      ],
      
      // HTMLElement
      baseMethods : {
      }
   },

   ChangeEvent = $.CustomEvent.EventType( 'contentchange',
   {
      // get a handler in there that is called when the user adds
      // another event handler
      process : function( data )
      {
         // process the events
         var targetElement = data.target;

         // now wrap the mutators
         wrapMuts( nodeTarget );
      },

      cleanup : function( data )
      {

      }
   });
   
   // fill out each of the methods based on the handling for
   // HTMLElement
   var methodNames = defaults.methodNames, 

       index = methodNames.length,

       baseMethods = defaults.baseMethods;

   while( --index >= 0 )
   {
      var methodName = methodNames[ index ],
          
          method = HTMLElement.prototype[ methodName ];

      if( typeof method == 'function' )
         baseMethods[ methodName ] = method;
   }

   $.CustomEvent.register( ChangeEvent );


})( $ );
/* IE prototypes for element that we should pay attention to
Change Events

Properties:
LOG: dir                        // reading direction
LOG: innerHTML 
LOG: outerHTML 
LOG: innerText 
LOG: outerText 
LOG: textContent 

Methods
LOG: insertAdjacentHTML 
LOG: applyElement 
LOG: insertAdjacentElement 
LOG: insertAdjacentText 
LOG: replaceAdjacentText 
LOG: removeNode 
LOG: replaceNode 
LOG: swapNode 
LOG: appendChild 
LOG: insertBefore 
LOG: normalize 
LOG: removeChild 
LOG: replaceChild 

LOG: currentStyle 
LOG: runtimeStyle 
LOG: className 
LOG: contentEditable 
LOG: dir                        // reading direction
LOG: disabled 
LOG: id 
LOG: innerHTML 
LOG: isContentEditable 
LOG: outerHTML 
LOG: style 
LOG: title*
LOG: filters*
LOG: innerText 
LOG: onbeforepaste 
LOG: onfilterchange 
LOG: outerText 
LOG: insertAdjacentHTML 
LOG: addFilter 
LOG: applyElement 
LOG: clearAttributes 
LOG: insertAdjacentElement 
LOG: insertAdjacentText 
LOG: mergeAttributes 
LOG: removeBehavior 
LOG: removeFilter 
LOG: replaceAdjacentText 
LOG: removeNode 
LOG: replaceNode 
LOG: swapNode 
LOG: removeAttribute 
LOG: removeAttributeNS 
LOG: removeAttributeNode 
LOG: setAttribute 
LOG: setAttributeNS 
LOG: setAttributeNode 
LOG: setAttributeNodeNS 
LOG: textContent 
LOG: appendChild 
LOG: insertBefore 
LOG: normalize 
LOG: removeChild 
LOG: replaceChild 

* not sure what these does
*/
