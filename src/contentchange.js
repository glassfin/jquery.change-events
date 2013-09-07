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
   // TODO: Write something for MutationEvents

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
            $.CustomEvent.trigger( eventTarget,
                                   // the target element

                                   'contentchange',
                                   // the event name

                                   {
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

         // if the targetElement has already been processed
         // then return immediately 
         if( targetElement.processed )
            return;

         var tagName = targetElement.tagName || 'baseMethods',
             // cache the tag name of the target element, or if
             // it doesn't exist, use the baseMethods
             
             clone = targetElement._clone = targetElement.cloneNode();
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
         clone.innerHTML = targetElement.innerHTML;

         // clone the dir attribute
         if( targetElement.dir !== undefined )
            clone.dir = targetElement.dir;

         // for each method named in the list...
         while( --index >= 0 )
         {
            var methodName = methodNames[ index ],
                // get the name of the method     
                
                method = ( methods )? 
                   methods[ methodName ] :
                   ( typeof targetElement[ methodName ] == 'function' )?
                      defaults[ tagName ][ methodName ] = 
                         targetElement[ methodName ] : 
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
            targetElement[ methodName ] = function()
            {
               // store the argument
               var args = arguments;
               
               // trigger the pre- and post-contentchange events with
               $.CustomEvent.trigger( targetElement,
                                      // the target element

                                      'contentchange',
                                      // the event name

                                      {
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
                                            targetElement, args );
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
               Object.setPropertyDescriptor( targetElement, 
                  propertyNames[ index ] );
         }

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

   $('p').contentchange( function( event )
   {
      console.log( 'hello' );
   });

   $('p').html('no!');

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
