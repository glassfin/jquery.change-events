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
         if( typeof Object.defineProperty === 'function' )
         {
            var targetElement = data.target,

                clone = targetElement.cloneNode();

            targetElement.defineProperty;

         }
         else
         {
            // the best we can hope for is to leave properties 
            // behind, and go for strictly methods: $.fn.html,
            // and the remainder of those functions
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
