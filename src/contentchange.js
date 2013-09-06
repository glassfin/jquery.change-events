(function( $ )
{
   // this is for overriding jQuery functions
   var overriders = {
      jQGetterSetter : function( fnName, getterCondition ) 
      {
         var $fn = $.fn[fnName];
         
         $.fn[ fnName ] = function()
         {
            if( getterCondition?
                  getterCondition.apply( this, arguments ) :
                  arguments.length == 0 )
               return $fn.apply( this, arguments );

            // trigger the event
         }
      }
   }

   var ChangeEvent = $.CustomEvent.EventType( 'contentchange',
   {
      setup : function()
      {
      },

      process : function( data )
      {
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
