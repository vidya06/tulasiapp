// index.js

var REST_DATA = 'api/favorites';
var KEY_ENTER = 13;
var defaultItems = [
	
];
var docId="sample";
/*var redis = require("redis");*/
/*var client = redis.creahttps://hub.jazz.net/code/edit/edit.html#/code/file/tul1-OrionContent/tul1%2520%257C%2520tulasiapp/public/scripts/index.jsteClient();*/
/*window.onload = function startTimer() {
    var twentyfiveMinutes = 60 * 25,
        display = document.querySelector('#time');
    startTimer(twentyfiveMinutes, display);*/
   
   
   	
  /* function do(documents,function){
   	
   	console.log("Get method invoked.. ");
   	
   }*/
  
/* function do()
 {
 	app.get(name);
 }*/
 function loadItemsEval(){
	xhrGet(REST_DATA, function(data){
		
		//stop showing loading message
		//stopLoadingMessage();
		console.log(data);
		console.log(data.id);
		var receivedItems = data || [];
		var items = [];
		var i;
	
		/*var node = document.getElementById('content');
		var row = node.parentNode.parentNode;*/
		
	
		// Make sure the received items have correct format
		for(i = 0; i < receivedItems.length; ++i){
			var item = receivedItems[i];
			if(item && 'id' in item){
				items.push(item);
			}
		}
		var hasItems = items.length;
		console.log("length", items.length);
		if(!hasItems){
			items = defaultItems;
		}
		for(i = 0; i < items.length; ++i){
			addItemEval(items[i], !hasItems);
		}
		if(!hasItems){
			var table = document.getElementById('details');
			var nodes = [];
			for(i = 0; i < table.rows.length; ++i){
				nodes.push(table.rows[i].firstChild.firstChild);
			}
			function save(){
				if(nodes.length){
					saveChange(nodes.shift(), save);
				}
			}
			save();
		}
	}, function(err){
		console.error(err);
	});
	
}  
function setRowContentEval(item, row)
{
	var id = item && item.id;
	var a1=item.a1;
	var attachments = item.attachements;
	for(var i = 0; i < attachments.length; ++i){
				var attachment = attachments[i];
			

var str = attachment.url;
var start = str.indexOf("my_sample_db");  
var end=str.length;
var content="";
					var link=str.substring(start, end);  
					console.log(link);
				xhrGet2(REST_DATA+"/attack?link=" + link, function(data){
		console.log("response data in index.js "+data);
		
		content=data;	
		var innerHTML = "<td class='content'><button class='link' style='cursor: pointer; white-space: nowrap;' value="+id+" onclick='showAns(this)'><font color='white'>"+item.name+"</font></button></td><td class='content'><table border=\"0\">";
		
		var valueTextArea="";
		if(item.value)
		{
			valueTextArea="<textarea id='valText' onkeydown='onKey(event)'></textarea>";
		}
		else{
			valueTextArea="<textarea id='valText' onkeydown='onKey(event)'>"+item.a1+"</textarea>";
			valueTextArea="<div id="+id+" style='display: none;'>"+
			"<!DOCTYPE html><html>"+
"<head><title>Evaluation - "+item.name+"</title><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>"+
	"<meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no'/>"+
	"<meta name='apple-mobile-web-app-capable' content='yes' />"+
	"<link rel='stylesheet' href='/style/style.css' />"+
	"<script type='text/javascript'  src='/scripts/timer.js'></script>"+
	"<script type='text/javascript'  src='/scripts/util.js'></script></head><body>"+
	"<h1>ANSWERS</h1>"+
"<div style='text-align:left;'><p class='content'>1.What was your favourite subject in college. Why?"+
"<br><br><textarea rows='5' cols='55' readonly>"+item.a1+"</textarea></p></div><br>"+
"<div style='text-align:left;'><p class='content'>2.You are trying to switch on the television. It does not power on. What could be the possible reasons?"+
"<br><br><textarea rows='5' cols='55' readonly>"+item.a2+"</textarea></p></div><br>"+
"<div style='text-align:left;'><p class='content'>3.How many squares are there on a chess board. Explain your reasoning?"+
"<br><br><textarea rows='5' cols='55' readonly>"+item.a3+"</textarea></p></div><br>"+
"<div style='text-align:left;'><p class='content'>4.Write a summary of what you just heard from below audio?"+
"<br></br><textarea rows='5' cols='55' readonly>"+item.a4+"</textarea></p></div><br>"+
"<div style='text-align:left;'><p class='content'>5.Describe your first day at IBM "+
"<br></br><audio controls><source src="+content+" type='audio/mpeg'></audio></p></div><br>"+
"</body></html>"
			+"</div>";
		}
		
		innerHTML+="<tr border=\"0\" ><td class='content'>"+valueTextArea+"</td></tr>";
		          
		
	
		
	row.innerHTML = innerHTML+"</table></td>";
});
}
}
function addItemEval(item, isNew){
	
	var row = document.createElement('tr');
	row.className = "tableRows";
	var id = item && item.id;
	if(id){
		row.setAttribute('data-id', id);
	}
	
	
	
	if(item) // if not a new row
	{
		setRowContentEval(item, row);
	}
	else //if new row
	{
		row.innerHTML = "<td class='content'><textarea id='nameText' onkeydown='onKey(event)' placeholder=\"Enter a title for your favourites...\"></textarea></td><td class='content'><table border=\"0\"><tr border=\"0\"><td class='content'><textarea id='valText'  onkeydown='onKey(event)' placeholder=\"Enter a description...\"></textarea></td></tr></table>"+attachButton+"</td>" +
		    "<td class = 'contentAction'><span class='deleteBtn' onclick='deleteItem(this)' title='delete me'></span></td>";
	}

	var table = document.getElementById('details');
	table.lastChild.appendChild(row);
	row.isNew = !item || isNew;
	
	if(row.isNew)
	{
		var textarea = row.firstChild.firstChild;
		textarea.focus();
	}
	
}

function test(mail,n1,n2,n3,n4,t,tname){
	var con = {
				name: mail,
				a1: n1,
				a2: n2,
				a3: n3,
				a4: n4,
				time: t,
				testname: tname
			};
		

	xhrPost(REST_DATA, con , function(item){
		//docId= "08a6993ae7328e5271ae9c518df6a866";
					//row.setAttribute('data-id', item.content.id);
					docId = item.content.id;
					var blobUrl=sendURLBlob();
		if(blobUrl!==null  && blobUrl!==""){
			xhrAttach(REST_DATA+"/attach?id="+docId,blobUrl, function(item){	

		console.log('Item id - ' + item.id);
		console.log('attached: ', item);
//		row.setAttribute('data-id', item.id);
//		removeProgressIndicator(row);
//		setRowContent(item, row);
	}, function(err){
		console.error(err);
	});
//client.set("idVal", docId);
					/*storeId(docId);*/
					console.log("printing id",docId);
					/*if(!docId===null && !docId==='undefined'){
					 window.location.href='style/QA.html';
				 }*/

   /* <%Session["docId"] = "' + docId + '"; %>;*/
				} 
	
}/*,function(err){
					console.error(err);
				}*/);
			}

function update(mail,n1,n2,n3,n4,t,tname){
	var data = {
				a1: n1,
				a2: n2,
				a3: n3,
				a4: n4,
				time: t,
				testname: tname
		
			}; 
			/*data.id = "08a6993ae7328e5271ae9c518df6a866";*/
			
			data.id=docId;
			console.log("docId",docId);
			console.log("data.id",data.id);
			 deleteItem(data.id);
			test(mail,n1,n2,n3,n4,t,tname);
		
		}
				/*xhrPut(REST_DATA, data, function(){
					console.log('updated: ', data);
				});*/



function loadItems(email){
	var matched="";
	var name=email;
	xhrGet(REST_DATA, function(data){

		//stop showing loading message
		//stopLoadingMessage();
		
		var receivedItems = data || [];
		var items = [];
		var i;
		
				/*console.log(receivedItems.length);*/
		// Make sure the received items have correct format
		for(i = 0; i < receivedItems.length; ++i){
			var item = receivedItems[i];
			/*if(item && 'name' in item){
				items.push(item);
			}*/
			//alert(item);
			//var name = GetURLParameter('name');
			
			console.log("printing email"+item.name);
		/*	console.log("printing name" + item.name);*/
			if(item.name === name)
			{
				console.log("inside item present : "+name);
			   /*  var a1 = document.getElementById("a1").innerHTML; 
				 var a2 = document.getElementById("a2").innerHTML; 
				 var a3 = document.getElementById("a3").innerHTML; 
				 var a4 = document.getElementById("a4").innerHTML;*/ 
				 matched=item.name;
				 docId = item.id;
				 console.log("printing id again "+docId);
				 /*console("d")*/
				 /*alert(matched.a1);*/
				break;
				/*alert(item.name);
				alert(item.id);
				*/
			}
			
		}
		
		/*var hasItems = items.length;
		if(!hasItems){
			items = defaultItems;
		}
		for(i = 0; i < items.length; ++i){
			addItem(items[i], !hasItems);
		}
		if(!hasItems){
			var table = document.getElementById('notes');
			var nodes = [];
			for(i = 0; i < table.rows.length; ++i){
				nodes.push(table.rows[i].firstChild.firstChild);
			}
			function save(){
				if(nodes.length){
					saveChange(nodes.shift(), save);
				}
			}
			save();
		}*/
	}, function(err){
		console.error(err);
	});
	console.log("returning matched" +matched);
	return matched;
}

function startProgressIndicator(row)
{	
	row.innerHTML="<td class='content'>Uploading file... <img height=\"50\" width=\"50\" src=\"images/loading.gif\"></img></td>";	
}

function removeProgressIndicator(row)
{
	row.innerHTML="<td class='content'>uploaded...</td>";
}

function addNewRow(table)
{
	var newRow = document.createElement('tr');
	table.appendChild(newRow);
	return table.lastChild;
}

function uploadFile(node)
{
	
	
	var file = node.previousSibling.files[0];
	
	//if file not selected, throw error
	if(!file)
	{
		alert("File not selected for upload... \t\t\t\t \n\n - Choose a file to upload. \n - Then click on Upload button.");
		return;
	}
	
	var row = node.parentNode.parentNode;
	
	var form = new FormData();
	form.append("file", file);
	
	//var id = row.getAttribute('data-id');
	var id=docId;
	console.log("id in attach index "+id);
	var queryParams = "id=" + (id==null?-1:id);
	queryParams+= "&name="+row.firstChild.firstChild.value;
	queryParams+="&value="+row.firstChild.nextSibling.firstChild.firstChild.firstChild.firstChild.firstChild.value;
	
	
	var table = row.firstChild.nextSibling.firstChild;	
	var newRow = addNewRow(table);	
	
	startProgressIndicator(newRow);
	
	xhrAttach(REST_DATA+'/attach1?id='+ id, form, function(item){	
		console.log('Item id - ' + item.id);
		console.log('attached: ', item);
		row.setAttribute('data-id', item.id);
		removeProgressIndicator(row);
		setRowContent(item, row);
	}, function(err){
		console.error(err);
	});
	
}

var attachButton = "<br><input width=\"100\" type=\"submit\" value=\"Upload\" onClick='test()'>";

function setRowContent(item, row)
{
	var attachments = item.attachements;
	for(var i = 0; i < attachments.length; ++i){
				var attachment = attachments[i];
			

var str = attachment.url;
var start = str.indexOf("my_sample_db");  
var end=str.length;
var content="";
					var link=str.substring(start, end);  
					console.log(link);
					xhrGet2(REST_DATA+"/attack?link=" + link, function(data){
		console.log("response data in index.js "+data);
		
		content=data;
		var innerHTML = "<td class='content'><textarea id='nameText' onkeydown='onKey(event)'>"+item.name+"</textarea></td><td class='content'><table border=\"0\">";	
		
		var valueTextArea = "<textarea id='valText' onkeydown='onKey(event)' placeholder=\"Enter a description...\"></textarea>";		
		if(item.value)
		{
			valueTextArea="<textarea id='valText' onkeydown='onKey(event)'>"+item.value+"</textarea>";
		}
		
		innerHTML+="<tr border=\"0\" ><td class='content'>"+valueTextArea+"</td></tr>";
		          
		//var blobAsDataUrl2;
		
		if(attachments && attachments.length>0)
		{
			
			
				if(attachment.content_type.indexOf("image/")==0)
				{
					innerHTML+= "<tr border=\"0\" ><td class='content'>"+attachment.key+"<br><img width=\"200\" src=\""+attachment.url+"\" onclick='window.open(\""+attachment.url+"\")'></img></td></tr>" ;


				} else if(attachment.content_type.indexOf("audio/")==0)
				{
					
					
innerHTML+= "<tr border=\"0\" ><td class='content'>"+attachment.key+"<br><audio controls><source src="+content+" type='audio/wav'></audio> </td></tr>" ;

				} else if(attachment.content_type.indexOf("video/")==0)
				{
					innerHTML+= "<tr border=\"0\" ><td class='content'>"+attachment.key+"<br><VIDEO  height=\"100\" width=\"200\" src=\""+attachment.url+"\" controls></VIDEO></td></tr>" ;


				} else if(attachment.content_type.indexOf("text/")==0 || attachment.content_type.indexOf("application/")==0)
				{
					innerHTML+= "<tr border=\"0\" ><td class='content'><a href=\""+attachment.url+"\" target=\"_blank\">"+attachment.key+"</a></td></tr>" ;

				} 
			}	
			
		
		
		row.innerHTML = innerHTML+"</table>"+attachButton+"</td><td class = 'contentAction'><span class='deleteBtn' onclick='deleteItem(this)' title='delete me'></span></td>";
					});
	}

	
}

function addItem(item, isNew){
	
	var row = document.createElement('tr');
	row.className = "tableRows";
	var id = item && item.id;
	if(id){
		row.setAttribute('data-id', id);
	}
	
	
	
	if(item) // if not a new row
	{
		setRowContent(item, row);
	}
	else //if new row
	{
		row.innerHTML = "<td class='content'><textarea id='nameText' onkeydown='onKey(event)' placeholder=\"Enter a title for your favourites...\"></textarea></td><td class='content'><table border=\"0\"><tr border=\"0\"><td class='content'><textarea id='valText'  onkeydown='onKey(event)' placeholder=\"Enter a description...\"></textarea></td></tr></table>"+attachButton+"</td>" +
		    "<td class = 'contentAction'><span class='deleteBtn' onclick='deleteItem(this)' title='delete me'></span></td>";
	}

	var table = document.getElementById('notes');
	table.lastChild.appendChild(row);
	row.isNew = !item || isNew;
	
	if(row.isNew)
	{
		var textarea = row.firstChild.firstChild;
		textarea.focus();
	}
	
}

function deleteItem(deleteItem){
	//var row = deleteBtnNode.parentNode.parentNode;
	//if(row.getAttribute('data-id'))
	var idDelete=deleteItem;
	console.log("delete item id " +idDelete);
	if(idDelete)
	{
		xhrDelete(REST_DATA + '?id=' + idDelete , function(){
			//row.remove();
		}, function(err){
			console.error(err);
		});
	}	
}


function onKey(evt){
	
	if(evt.keyCode == KEY_ENTER && !evt.shiftKey){
		
		evt.stopPropagation();
		evt.preventDefault();
		var nameV, valueV;
		var row ; 		
		
		if(evt.target.id==="nameText")
		{
			row = evt.target.parentNode.parentNode;
			nameV = evt.target.value;
			valueV = row.firstChild.nextSibling.firstChild.firstChild.firstChild.firstChild.firstChild.value ;
			
		}
		else
		{
			row = evt.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
			nameV = row.firstChild.firstChild.value;
			valueV = evt.target.value;
		}
		
		var data = {
				name: nameV,
				value: valueV
			};			
		
			if(row.isNew){
				delete row.isNew;
				xhrPost(REST_DATA, data, function(item){
					row.setAttribute('data-id', item.id);
				}, function(err){
					console.error(err);
				});
			}else{
				data.id = row.getAttribute('data-id');
				xhrPut(REST_DATA, data, function(){
					console.log('updated: ', data);
				}, function(err){
					console.error(err);
				});
			}
		
	
		if(row.nextSibling){
			row.nextSibling.firstChild.firstChild.focus();
		}else{
			addItem();
		}
	}
}

function saveChange(contentNode, callback){
	var row = contentNode.parentNode.parentNode;
	
	var data = {
		name: row.firstChild.firstChild.value,
		value:row.firstChild.nextSibling.firstChild.value		
	};
	
	if(row.isNew){
		delete row.isNew;
		xhrPost(REST_DATA, data, function(item){
			row.setAttribute('data-id', item.id);
			callback && callback();
		}, function(err){
			console.error(err);
		});
	}else{
		data.id = row.getAttribute('data-id');
		xhrPut(REST_DATA, data, function(){
			console.log('updated: ', data);
		}, function(err){
			console.error(err);
		});
	}
}

function toggleServiceInfo(){
	var node = document.getElementById('vcapservices');
	node.style.display = node.style.display == 'none' ? '' : 'none';
}

function toggleAppInfo(){
	var node = document.getElementById('appinfo');
	node.style.display = node.style.display == 'none' ? '' : 'none';
}


function showLoadingMessage()
{
	document.getElementById('loadingImage').innerHTML = "Loading data "+"<img height=\"100\" width=\"100\" src=\"images/loading.gif\"></img>";
}
function stopLoadingMessage()
{
	document.getElementById('loadingImage').innerHTML = "";
}

showLoadingMessage();
//updateServiceInfo();
loadItems();


//*************************************************************************************************************************

function sendId(){
	var sendDocId=docId;
	return sendDocId;
}
