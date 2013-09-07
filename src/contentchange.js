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
   var nativeMethods = {
      names : [ 'appendChild', 

                'insertAdjacentElement', 

                'insertAdjacentHTML',

                'insertAdjacentText',

                'insertBefore',

                'removeChild',

                'replaceChild'
              ],
      
      // HTMLElement
      base : {
         appendChild : HTMLElement
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
            // the best we can hope for is to leave innerHTML
            // behind, and go for the other stuff: $.fn.html,
            // and the remainder of those functions
         }
      },

      cleanup : function( data )
      {

      }
   });

   $.CustomEvent.register( ChangeEvent );

   $('p').contentchange( function( event )
   {
   });

   return {
      html : $.html
   }
})( $ );


/* IE prototypes for element that we should pay attention to

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
LOG: title (not sure what the heck this does)
LOG: document 
LOG: filters 
LOG: innerText 
LOG: onbeforepaste 
LOG: onfilterchange 
LOG: outerText 
LOG: parentTextEdit 
LOG: insertAdjacentHTML 
LOG: addFilter 
LOG: applyElement 
LOG: clearAttributes 
LOG: dragDrop 
LOG: insertAdjacentElement 
LOG: insertAdjacentText 
LOG: mergeAttributes 
LOG: removeBehavior 
LOG: removeFilter 
LOG: replaceAdjacentText 
LOG: setActive 
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
*/
