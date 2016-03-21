function progressbar(text1,text2,text3,text4)
{

var progVal=0;
if((text1!==null||text1!=="")&&(text1!==null||text1!=="")&&(text1!==null||text1!=="")&&(text1!==null||text1!=="")){
		progVal=80;
	}
else if((text1!==null||text1!=="")&&(text2==null||text2=="")&&(text3==null||text3=="")&&(text4==null||text4=="")){
		progVal=20;
	}
	else if((text1==null||text1=="")&&(text2!==null||text2!=="")&&(text3==null||text3=="")&&(text4==null||text4=="")){
		progVal=20;
	}
else if((text1==null||text1=="")&&(text2==null||text2=="")&&(text3!==null||text3!=="")&&(text4==null||text4=="")){
		progVal=20;
	}
	else if((text1==null||text1=="")&&(text2==null||text2=="")&&(text3==null||text3=="")&&(text4!==null||text4!=="")){
		progVal=20;
	}
else if((text1!==null||text1!=="")&&(text2!==null||text2!=="")&&(text3==null||text3=="")&&(text4==null||text4=="")){
		progVal=40;
	}
else if((text1!==null||text1!=="")&&(text2==null||text2=="")&&(text3!==null||text3!=="")&&(text4==null||text4=="")){
		progVal=40;
	}
	else if((text1!==null||text1!=="")&&(text2==null||text2=="")&&(text3==null||text3=="")&&(text4!==null||text4!=="")){
		progVal=40;
	}
	else if((text1==null||text1=="")&&(text2!==null||text2!=="")&&(text3!==null||text3!=="")&&(text4==null||text4=="")){
		progVal=40;
	}
	else if((text1==null||text1=="")&&(text2!==null||text2!=="")&&(text3==null||text3=="")&&(text4!==null||text4!=="")){
		progVal=40;
	}
	else if((text1==null||text1=="")&&(text2==null||text2=="")&&(text3!==null||text3!=="")&&(text4!==null||text4!=="")){
		progVal=40;
	}
	else if((text1!==null||text1!=="")&&(text2!==null||text2!=="")&&(text3!==null||text3!=="")&&(text4==null||text4=="")){
		progVal=60;
	}
	else if((text1!==null||text1!=="")&&(text2!==null||text2!=="")&&(text3==null||text3=="")&&(text4!==null||text4!=="")){
		progVal=60;
	}
	else if((text1!==null||text1!=="")&&(text2==null||text2=="")&&(text3!==null||text3!=="")&&(text4!==null||text4!=="")){
		progVal=60;
	}
	else if((text1==null||text1=="")&&(text2!==null||text2!=="")&&(text3!==null||text3!=="")&&(text4!==null||text4!=="")){
		progVal=60;
	}
	document.getElementById("progress-bar").style.width=progVal;
}