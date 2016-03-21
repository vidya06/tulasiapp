function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = "Time Left "+minutes + ":" + seconds;
if (--timer < 300) {
            document.getElementById("time").style.color = "red";
        }
        if (--timer < 0) {
            timer = 0;
            timeUp();
        }
    }, 1000);
}
window.onload = function startTimer1() {
    var twentyfiveMinutes = 60 * 25,
     display = document.querySelector('#time');
    startTimer(twentyfiveMinutes, display);
};

function timeUp(){
	window.location.href='style/Thankyou.html';
}
function getTime(){
	var timeRem=document.getElementById("time").innerHTML;
	console.log("timeRem",timeRem);
}   