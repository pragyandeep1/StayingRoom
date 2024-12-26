$(document).ready(function() {
					
	 
	 $( "#budgt-range" ).slider({
      range: true,
      min: 1000,
      max: 1000000,
      values: [ 1000, 500000 ],
      slide: function( event, ui ) {
        $( "#budgt-amount" ).val( "Rs " + ui.values[ 0 ] + " - Rs " + ui.values[ 1 ] );
      }
    });
    $( "#budgt-amount" ).val( "Rs " + $( "#budgt-range" ).slider( "values", 0 ) +
      " - Rs " + $( "#budgt-range" ).slider( "values", 1 ) );
	
	 
	 $( "#radioset" ).buttonset();
	
	 
});