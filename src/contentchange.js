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
 * Op : 11.6
 * Sa : 5.1
 *
 * Note: this plugin wraps the native innerHTML,
 * appendChild, removeChild, insertAdjacentElement, insertAdjacentHTML,
 * insertAdjacentText, insertBefore, replaceChild ( Gecko )
 *
 */
(function( $ )
{
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
         'dir',

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
         var targetElement = data.target,

             tagName = targetElement.tagName,
             
             clone = targetElement.cloneNode();

         var methodNames = defaults.methodNames,
             
             index = methodNames.length,

             methods = ( defaults[ tagName ] !== undefined )?
                defaults[ tagName ] : false;
         
         // for each method named in the list
         while( --index >= 0 )
         {
            
            var methodName = methodNames[ index ],
                // get the name of the method     
                
                method = ( methods )? 
                   methods[ methodName ] :
                   ( typeof targetElement[ methodName ] == 'function' )?
                      defaults[tagName][ methodName ] = 
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
                                         // invoke the original method 
                                         return method.apply( 
                                            targetElement, args );
                                      }
                                      // a closure wrapper for the original
                                      // method
                                     );
            }

         }

         if( typeof Object.defineProperty === 'function' )
         {
            targetElement.defineProperty;

         }
      },

      cleanup : function( data )
      {

      }
   });
   
   // fill out each of the methods
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
   });

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
