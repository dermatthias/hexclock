// hexclock clone in html5
// hallo jonas!

// inspired by this: http://thecolourclock.co.uk/

// globals
var colors60 = new Array(60);
colors60[0] = 0;
var colors24 = new Array(24);
colors24[0] = 0;
var text_x;
var text_y;
var bar_width;
var bar_height;
var bar_offset;
var hex = false;
var hex_small = false;
var t;

function get_time(type) {
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();

    if (type == 'string') {
	m=check_time(m);
	s=check_time(s);
	return h+":"+m+":"+s;
    } else if (type == 'h') {
	return h;
    } else if (type == 'm') {
	return m;
    } else if (type == 's') {
	return s;
    } else {
	return today;
    }
}

function check_time(i) {
    if (i<10) i="0" + i;
    return i;
}

function check_hex(h) {
    if (h.length == 1) return "0"+h;
    return h;
}

function not_supported() {
    $("#main").html("Sorry, your browser doesn't support the canvas tag. Try a modern browser lile Firefox 3.5+ or Google Chrome.");
}

// returns the percentage of a day already passed
function get_dayperc(date) {
    var one_day = 86400000;
    var ms = date.getTime();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return (h*3600000 + m*60000 + s*1000) / one_day;
}


function render() {
    // canvas element and context
    var canvas = document.getElementById('canvas');
    var c;
    if (canvas.getContext) {
	c = canvas.getContext('2d');
    } else {
	not_supported();
	return;
    }

    // fullscreen
    c.canvas.width  = window.innerWidth;
    c.canvas.height = window.innerHeight;

    // render the clock and background
    var r_width = parseInt(c.canvas.clientWidth);
    var r_height = parseInt(c.canvas.clientHeight);

    // concat css rgb string
    var bgcolor = "rgb(" + colors24[get_time('h')] + "," + colors60[get_time('m')] + "," + colors60[get_time('s')] + ")";

    // draw background
    c.fillStyle = bgcolor;
    c.fillRect(0,0, r_width, r_height);

    // draw radial gradient
    c.globalAlpha = 0.6;
    var my_gradient = c.createRadialGradient(r_width/2, r_height/2, 10, r_width/2, r_height/2, r_height);
    my_gradient.addColorStop(0, "white");
    my_gradient.addColorStop(1, bgcolor);
    c.fillStyle = my_gradient;
    c.fillRect(0, 0, r_width, r_height);

    // draw clock
    c.globalAlpha = 1.0;
    c.fillStyle = "rgb(255,255,255)";
    c.textBaseline = "alphabetic";
    c.textAlign = "left";
    c.font = "14em Josefin Sans, Arial, Sans Serif";
    var time = get_time('string');
    var textwidth = c.measureText("24:55:01").width / 2 ;
    text_x = (r_width / 2) - textwidth;
    text_y = r_height / 2;
    // hex time
    var htime = check_hex(get_time('h').toString(16)) + ":" + check_hex(get_time('m').toString(16)) + ":" + check_hex(get_time('s').toString(16));

    if (!hex) {
	c.fillText(time, text_x, text_y);
    } else {
	c.fillText(htime.toUpperCase(), text_x, text_y);
    }

    // draw bar
    var day_perc = get_dayperc(get_time());
    bar_width = textwidth * 2;
    bar_height = 15;
    bar_offset = 40;
    c.fillStyle = "rgba(255,255,255,0.1)";
    c.strokeStyle = "rgba(255,255,255,0.3)";
    c.fillRect(text_x, text_y + bar_offset, bar_width, bar_height);
    c.strokeRect(text_x, text_y + bar_offset, bar_width, bar_height);
    c.fillStyle = "rgba(255,255,255,0.2)";
    c.fillRect(text_x, text_y + bar_offset, bar_width * day_perc, bar_height);


    // draw hex
    if (hex_small) {
	c.fillStyle = "rgb(255,255,255)";
	c.textBaseline = "alphabetic";
	c.textAlign = "left";
	c.font = "4em Josefin Sans, Arial, Sans Serif";
	var htextwidth = c.measureText("24:55:01").width / 2 ;
	var htext_x = (r_width / 2) - htextwidth;
	var htext_y = r_height / 2 + 120;
	c.fillText(htime.toUpperCase(), htext_x, htext_y);
    }


    // start timer, calls itself infinite
    //t=setTimeout('render()',800);
}

$(document).ready(
    function () {
	// generate rgb color arrays
	var ratio1 = 256.0/24.0;
	for(var i = 1; i < colors24.length; i++) {
	    colors24[i] = Math.floor(ratio1 * i);
	}
	var ratio2 = 256.0/60.0;
	for(var j = 1; j < colors60.length; j++) {
	    colors60[j] = Math.floor(ratio2 * j);
	}

	// display switch when clicked
	$("#canvas").bind('mouseup', {foo: 'bar'}, switch_clock);
	function switch_clock(e) {
	    // the bar
	    if (e.clientX > text_x && e.clientX < text_x + bar_width
		&& e.clientY > text_y + bar_offset && e.clientY < text_y + bar_offset + bar_height) {
		hex_small = !hex_small;
	    } else {
		hex = !hex;
	    }
	}

	// call render() every x milliseconds
	setInterval(render,1000);
    });


