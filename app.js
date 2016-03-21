/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path'), fs = require('fs');

var app = express();

var db;

var cloudant;

var fileToUpload;


var dbCredentials = {
	dbName : 'my_sample_db'
};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

function initDBConnection() {
	
	if(process.env.VCAP_SERVICES) {
		var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
		if(vcapServices.cloudantNoSQLDB) {
			dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
			dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
			dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
			dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
			dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;

			cloudant = require('cloudant')(dbCredentials.url);
			
			// check if DB exists if not create
			cloudant.db.create(dbCredentials.dbName, function (err, res) {
				if (err) { console.log('could not create db ', err); }
		    });
			
			db = cloudant.use(dbCredentials.dbName);
			
		} else {
			console.warn('Could not find Cloudant credentials in VCAP_SERVICES environment variable - data will be unavailable to the UI');
		}
	} else{
		console.warn('VCAP_SERVICES environment variable not set - data will be unavailable to the UI');
		// For running this app locally you can get your Cloudant credentials 
		// from Bluemix (VCAP_SERVICES in "cf env" output or the Environment 
		// Variables section for an app in the Bluemix console dashboard).
		// Alternately you could point to a local database here instead of a 
		// Bluemix service.
		//dbCredentials.host = "REPLACE ME";
		//dbCredentials.port = REPLACE ME;
		//dbCredentials.user = "REPLACE ME";
		//dbCredentials.password = "REPLACE ME";
		//dbCredentials.url = "REPLACE ME";
	}
}

initDBConnection();

app.get('/', routes.index);

function createResponseData(id, attachments) {

	console.log(attachments);
	var responseData = {
		id : id,
		attachements : []
	};
	 
	attachments.forEach (function(item, index) {
		var attachmentData = {
			content_type : item.type,
			key : item.key,
			url : 'http://' + dbCredentials.user + ":" + dbCredentials.password
					+ '@' + dbCredentials.host + '/' + dbCredentials.dbName
					+ "/" + id + '/' + item.key
		};
		responseData.attachements.push(attachmentData);
		
	});
	return responseData;
}

function createResponseDataforpost(id, attachments) {

	console.log(attachments);
	var responseData = {
		id : id,
		attachements : []
	};
	 
	//attachments.forEach (function(item, index) {
		var attachmentData = {
			content_type : "audio/wav",
			key : "vidya.wav",
			url : 'http://' + dbCredentials.user + ":" + dbCredentials.password
					+ '@' + dbCredentials.host + '/' + dbCredentials.dbName
					+ "/" + id + '/vidya.wav'
		};
		responseData.attachements.push(attachmentData);
		
//	});
	return responseData;
}

function createResponseDataEval(id, name,a1,a2,a3,a4, value, attachments) {

	var responseData = {
		id : id,
		name : name,
		a1:a1,
		a2:a2,
		a3:a3,
		a4:a4,
		value : value,
		attachements : []
	};
	
	 
	attachments.forEach (function(item, index) {
		var attachmentData = {
			content_type : item.type,
			key : item.key,
			url : 'http://' + dbCredentials.user + ":" + dbCredentials.password
					+ '@' + dbCredentials.host + '/' + dbCredentials.dbName
					+ "/" + id + '/' + item.key
		};
		responseData.attachements.push(attachmentData);
		
	});
	return responseData;
}
var saveDocument = function(id, name, value, response) {
	
	if(id === undefined) {
		// Generated random id
		id = '';
	}
	
	db.insert({
		name : name,
		value : value
	}, id, function(err, doc) {
		if(err) {
			console.log(err);
			response.sendStatus(500);
		} else
			response.sendStatus(200);
		response.end();
	});
	
}


app.post('/style/api/favorites/attach1', multipartMiddleware, function(request, response) {

	console.log("Upload File Invoked..");
	console.log('Request: ' + JSON.stringify(request.headers));
	
	var id;
	
	db.get(request.query.id, function(err, existingdoc) {		
		
		var isExistingDoc = false;
		if (!existingdoc) {
			id = '-1';
		} else {
			id = existingdoc.id;
			isExistingDoc = true;
		}

		var name = request.query.name;
		var value = request.query.value;

		var file = request.files.file;
		var newPath = './public/uploads/' + file.name;		
		
		var insertAttachment = function(file, id, rev, name, a1, a2, a3, a4, time, testname, response) {
			
			fs.readFile(file.path, function(err, data) {
				if (!err) {
				    
					if (file) {
						  
						db.attachment.insert(id, file.name, data, file.type, {rev: rev}, function(err, document) {
							if (!err) {
								console.log('Attachment saved successfully.. ');
	
								db.get(document.id, function(err, doc) {
									console.log('Attachements from server --> ' + JSON.stringify(doc._attachments));
										
									var attachements = [];
									var attachData;
									for(var attachment in doc._attachments) {
										if(attachment == value) {
											attachData = {"key": attachment, "type": file.type};
										} else {
											attachData = {"key": attachment, "type": doc._attachments[attachment]['content_type']};
										}
										attachements.push(attachData);
									}
									var responseData = createResponseData(
											id,
											name,
											a1,
											a2,
											a3,
											a4,
											time,
											testname,
									
											attachements);
									console.log('Response after attachment: \n'+JSON.stringify(responseData));
									response.write(JSON.stringify(responseData));
									response.end();
									return;
								});
							} else {
								console.log(err);
							}
						});
					}
				}
			});
		}

		if (!isExistingDoc) {
			existingdoc = {
				name : name,
				value : value,
				create_date : new Date()
			};
			
			// save doc
			db.insert({
				name : name,
				value : value
			}, '', function(err, doc) {
				if(err) {
					console.log(err);
				} else {
					
					existingdoc = doc;
					console.log("New doc created ..");
					console.log(existingdoc);
					insertAttachment(file, existingdoc.id, existingdoc.rev, name, value, response);
					
				}
			});
			
		} else {
			console.log('Adding attachment to existing doc.');
			console.log(existingdoc);
			insertAttachment(file, existingdoc._id, existingdoc._rev, name, value, response);
		}
		
	});

});


app.post('/style/api/favorites/attach', multipartMiddleware, function(req,response) {

	console.log("Upload File Invoked..");
	console.log('Request: ' + JSON.stringify(req.headers));
	var id;
	 id=req.query.id;
	 console.log("id for attachment: "+id);
	
	//id="e1d13d3a3ea7fbfc9e8882262f0cd98c";
	
		//console.log(req.data);
        var jsonString = '';

       req.on('data', function (data) {
            jsonString += data;
       });

        req.on('end', function () {
            console.log(jsonString.substr(0, 1000));
           // jsonString=jsonString.replace(/^data:audio\/wav;base64,/, "");            
            //console.log(jsonString.substr(0, 100));
            //var audioBuffer=new Buffer(jsonString,'base64');
            //console.log(audioBuffer);
           // console.log(audioBuffer.substring(0, 100));
            /*fs.writeFile("./public/uploads/ajay.wav",audioBuffer, function(err) {
  console.log("error"+err);*/
			var filename="vidya.wav";
			
db.get(id, function(err, existingdoc) {		
		
		var isExistingDoc = false;
		if (!existingdoc) {
			id = '-1';
		} else {
			id = existingdoc.id;
			isExistingDoc = true;
		}

	//	var name = request.query.name;
	//	var value = request.query.value;

		//var file = request.files;
	//	console.log(file);		
	//	console.log(request.query.data);
//		console.log(request.file);
		var newPath = './public/uploads/'+filename;		
	
		var insertAttachment = function(file, id, rev, response) {
			


						  
						db.attachment.insert(id, filename,file,"audio/wav", {rev: rev}, function(err, document) {
							if (!err) {
								console.log('Attachment saved successfully.. ');
	
								db.get(document.id, function(err, doc) {
									console.log('Attachements from server --> ' + JSON.stringify(doc._attachments));
										
									var attachements = doc._attachments;
	/*								var attachData;
									for(var attachment in doc._attachments) {
										
											attachData = {"key": attachment, "type": doc._attachments[attachment]['content_type']};
										
										attachements.push(attachData);
									}
									
*/									console.log(attachements);
									var responseData = createResponseDataforpost(
											id,
											attachements);
									console.log('Response after attachment: \n'+JSON.stringify(responseData));
									response.write(JSON.stringify(responseData));
									response.end();
									return;
								});
							} else {
								console.log(err);
							}
						});
				
		}

		if (!isExistingDoc) {
			existingdoc = {
				create_date : new Date()
			};
			
			// save doc
			db.insert({
			}, '', function(err, doc) {
				if(err) {
					console.log(err);
				} else {
					
					existingdoc = doc;
					console.log("New doc created ..");
					console.log(existingdoc);
					insertAttachment(jsonString, existingdoc.id, existingdoc.rev, response);
					
				}
			});
			
		} else {
			console.log('Adding attachment to existing doc.');
			console.log(existingdoc);
			insertAttachment(jsonString, existingdoc._id, existingdoc._rev, response);
		}
		
	});

}); 


	/*
*/
});

app.post('/style/api/favorites', function(request, response) {

     // saveDocument(); 
	console.log("Create Invoked..");
	console.log("Name: " + request.body.name);
	console.log("Value: " + request.body.value);
	
	 var id = request.body.id;
	var name = request.body.name;
	var a1 =  request.body.a1;
	var a2 =  request.body.a2;
	var a3 =  request.body.a3;
	var a4 =  request.body.a4;
	var time = request.body.time;
	var testname = request.body.testname;
	var value = { 'name': name , 'a1' : a1 , 'a2' : a2 , 'a3' : a3 , 'a4' : a4 , 'time' : time , 'testname' : testname};
	console.log(value);
  db.insert(value,id, function(err, body, header) {
console.log(err);
console.log(body);
console.log(header);
//response.sendStatus(200); 
response.send({"Status":"ok","content":body}); 
	 
});
	//saveDocument(null, name, value, response);

});

app.delete('/style/api/favorites', function(request, response) {

	console.log("Delete Invoked..");
	//var id = request.query.id;
	var id="17ff80859bb4f55ff709db85642777ed";
	// var rev = request.query.rev; // Rev can be fetched from request. if
	// needed, send the rev from client
	console.log("Removing document of ID: " + id);
	console.log('Request Query: '+JSON.stringify(request.query));
	
	db.get(id, { revs_info: true }, function(err, doc) {
		if (!err) {
			db.destroy(doc._id, doc._rev, function (err, res) {
			     // Handle response
				 if(err) {
					 console.log(err);
					 response.sendStatus(500);
				 } else {
					 response.sendStatus(200);
				 }
			});
		}
	});

});

app.put('/style/api/favorites', function(request, response) {

	console.log("Update Invoked..");
	
	 var id = request.body.id;
	/*var name = request.body.name;*/
	var a1 =  request.body.a1;
	var a2 =  request.body.a2;
	var a3 =  request.body.a3;
	var a4 =  request.body.a4;
	var time = request.body.time;
	//var value = {'a1' : a1 , 'a2' : a2 , 'a3' : a3 , 'a4' : a4};
	/*console.log(value)*/
	
	/*console.log("ID: " + id);*/
	
	db.get(id, { revs_info: true }, function(err, doc) {
		if (!err) {
			console.log(doc);
			/*doc.name = name;
			doc.value = value;*/
			doc.a1=a1;
			doc.a2=a2;
			doc.a3=a3;
			doc.a4=a4;
			doc.time=time;
			db.insert(doc, doc.id, function(err, doc) {
				if(err) {
					console.log('Error inserting data\n'+err);
					return 500;
				}
				return 200;
			});
		}
	});
});

app.get('style/api/favorites/attack', function(request, response) {
	 var body="";
	 var link= request.query.link;
	 var options = {
  hostname: '581a94e8-d105-48b6-9119-9fff7753f02f-bluemix.cloudant.com',
  path: '/'+link,
  method: 'GET',
  auth:'581a94e8-d105-48b6-9119-9fff7753f02f-bluemix:c2a61da11914fa08683b723b8cadb241e64c5321f35ff1063c3ddba1ec7e36bc'
}; 
/*var options = {
  host: 'www.google.com',
  path: '/index.html'
};*/
var username = '581a94e8-d105-48b6-9119-9fff7753f02f-bluemix';
var password = 'c2a61da11914fa08683b723b8cadb241e64c5321f35ff1063c3ddba1ec7e36bc';
var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
console.log (auth);

// auth is: 'Basic VGVzdDoxMjM='

//var header = {'Host: 'http://581a94e8-d105-48b6-9119-9fff7753f02f-bluemix.cloudant.com/my_sample_db/545c381a3f49e374771faab758e0ff5f/vidya.wav', 'Authorization': auth};
/*var request = client.request('GET', '/', header);*/
//var req = http.get("http://581a94e8-d105-48b6-9119-9fff7753f02f-bluemix.cloudant.com/my_sample_db/545c381a3f49e374771faab758e0ff5f/vidya.wav", function(res) {
var req = http.get(options, function(res) {  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));

  // Buffer the body entirely for processing as a whole.
  var bodyChunks = [];
 
  res.on('data', function(chunk) {
    // You can process streamed parts here...
    //bodyChunks.push(chunk);
    body+=chunk;
  }).on('end', function() {
  //   body = Buffer.concat(bodyChunks);
     console.log('BODY: '+ body.substr(0, 100));
    // ...and/or process the entire body here.
    response.write(body);
			//			console.log(JSON.stringify(docList));
						console.log('ending response...');
						response.end();
  });
});

req.on('error', function(e) {
  console.log('ERROR: ' + e.message);
});

});

app.get('/style/api/favorites', function(request, response) {

	console.log("Get method invoked.. ");
	
	db = cloudant.use(dbCredentials.dbName);
	var docList = [];
	var i = 0;
	db.list(function(err, body) {
		if (!err) {
			var len = body.rows.length;
			console.log('total # of docs -> '+len);
			if(len == 0) {
				// push sample data
				// save doc
				var docName = 'sample_doc';
				var docDesc = 'A sample Document';
				db.insert({
					name : docName,
					value : 'A sample Document'
				}, '', function(err, doc) {
					if(err) {
						console.log(err);
					} else {
						
						console.log('Document : '+JSON.stringify(doc));
						var responseData = createResponseDataEval(
							doc.id,
							docName,
							docDesc,
							[]);
						docList.push(responseData);
						response.write(JSON.stringify(docList));
						console.log(JSON.stringify(docList));
						console.log('ending response...');
						response.end();
					}
				});
			} else {

				body.rows.forEach(function(document) {
					
					db.get(document.id, { revs_info: true }, function(err, doc) {
						if (!err) {
							if(doc['_attachments']) {
							
								var attachments = [];
								for(var attribute in doc['_attachments']){
								
									if(doc['_attachments'][attribute] && doc['_attachments'][attribute]['content_type']) {
										attachments.push({"key": attribute, "type": doc['_attachments'][attribute]['content_type']});
									}
									console.log(attribute+": "+JSON.stringify(doc['_attachments'][attribute]));
								}
								var responseData = createResponseDataEval(
										doc._id,
										doc.name,
										doc.a1,
										doc.a2,
										doc.a3,
										doc.a4,
										doc.value,
										attachments);
							
							} else {
								var responseData = createResponseDataEval(
										doc._id,
										doc.name,
										doc.a1,
										doc.a2,
										doc.a3,
										doc.a4,
										doc.value,
										[]);
							}	
						
							docList.push(responseData);
							i++;
							if(i >= len) {
								response.write(JSON.stringify(docList));
								console.log('ending response...');
								response.end();
							}
						} else {
							console.log(err);
						}
					});
					
				});
			}
			
		} else {
			console.log(err);
		}
	});

});






http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});

