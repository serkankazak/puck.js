var kb = require( "ble_hid_keyboard" );

NRF.setServices( undefined, { hid : kb.report } );

var count_start = 0;
var state = 0;
var sec = 0;
var tid = null;
var pid = null;
var pc = 0;

function btnPressed () {

  if ( state ) {

    try {
      kb.tap( kb.KEY.N, 0, function () { } );
    } catch (e) {
      console.log(e);
    }
  }

  count_start += 1;
  
  if ( count_start == 3 && sec < 4 ) {

    count_start = 0;

    if ( state == 0 ) {
      pid = setInterval( function () {
        digitalPulse( LED3, 1, 100 ); if ( pc > 2 ) { clearInterval( pid ); pc = 0; } else { pc += 1; }
      }, 200 );
      state = 1;
      if (tid) { clearInterval( tid ); }
      tid = null;
      sec = 0;
    } else {
      pid = setInterval( function () {
        digitalPulse( LED2, 1, 100 ); if ( pc > 2 ) { clearInterval( pid ); pc = 0; } else { pc += 1; }
      }, 200 );
      state = 0;
      if (tid) { clearInterval( tid ); }
      tid = null;
      sec = 0;
    }

  } else if ( count_start == 1 && !tid ) {
  
    tid = setInterval( function () {

      sec += 1;
      console.log( sec + ', ' + Puck.getBatteryPercentage() + ', ' + Puck.getTemperature() );

      if ( sec > 4 ) {
        clearInterval(tid);
        tid = null;
        sec = 0;
        count_start = 0;
      }

    }, 250 );
      
  }

}

setWatch( btnPressed, BTN1, { repeat: true, edge: 'rising', debounce : 24.99961853027 } );
