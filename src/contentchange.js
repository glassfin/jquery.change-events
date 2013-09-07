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
   var ChangeEvent = $.CustomEvent.EventType( 'contentchange',
   {
      setup : function()
      {
      },

      process : function( data )
      {
         //Object. data.target
         console.log( Object.isExtensible( data.target ) );
      },

      cleanup : function( data )
      {
      },

      teardown : function()
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
