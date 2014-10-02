/*
* Database inserting,creating, select query all sqlite task is done here
* eeDb.open- method: open database
* showCategory() - get categories from category table
* getFlowFromCat(catId) -  get flow of a category from flow tabl
* sendObj() -  send obj to mainscript.js to view that object as psot*/

var createPoLineItemTbl = "CREATE TABLE IF NOT EXISTS PoLineItemTbl ("+
    "JobId INTEGER PRIMARY KEY,  "+
     "stringObj TEXT)";
var createMaintenanceTbl = "CREATE TABLE IF NOT EXISTS MaintenanceTbl ("+
    "JobId INTEGER PRIMARY KEY,  "+
     "stringObj TEXT)";
var createClientDiscussionTbl = "CREATE TABLE IF NOT EXISTS ClientDiscussionTbl ("+
    "JobId INTEGER PRIMARY KEY,  "+
     "stringObj TEXT)";

var createJobTbl = "CREATE TABLE IF NOT EXISTS JobDetailTbl ("+
    "JobId INTEGER PRIMARY KEY,  "+
    "stringObj TEXT, "+    
    "status TEXT, "+    
    "date DATE DEFAULT (datetime('now','localtime')))";
var createPhotoTbl = "CREATE TABLE IF NOT EXISTS PhotoTbl ("+
    "Id INTEGER PRIMARY KEY,  "+
    "JobId INTEGER,  "+
    "imageUrl TEXT, "+
    "PhotoName TEXT, " +   
    "status TEXT)";
var createLineItemTbl = "CREATE TABLE IF NOT EXISTS LineItemTbl ("+
    "JobId INTEGER PRIMARY KEY,  "+
     "stringObj TEXT)";


var insertPoLineItemTbl = "INSERT INTO Posts (post_id, body, imageUrl,videoUrl, date, status, tags, title) " +
    "VALUES (?, ?, ?, ?, ?,?,?,?)";

var eeDb = {}
eeDb.db = null
eeDb.languages = ''

eeDb.open = function(){
    var shortName = 'ee';
    var version = '1.1';
    var displayName =  'Empower Estimator';
    var maxSize = 100000;
    try{
        if(!window.sqlitePlugin){
            eeDb.db = window.openDatabase(shortName,version,displayName,maxSize);
            console.log('Empower Estimator app opened DB  '+JSON.stringify(eeDb.db ))
        }else{
            
            eeDb.db = window.sqlitePlugin.openDatabase(shortName,version,displayName,maxSize); //(shortName,version,displayName,maxSize);
            console.log('Empower Estimator app opened DB  '+eeDb.db)
        }
    }catch(e){
        if(e == 2){
            alert("Invalid database version");
        }else{
             console.log("Unknowns error "+e+".");
            //alert("Unknowns error "+e+".");
        }
        return;
    }
}
function nullDataHandler(transaction, results) {
    console.log('Done------')
}
eeDb.createJobTbl = function(){
    var db = eeDb.db;
    db.transaction(
        function(transaction){
            transaction.executeSql(createJobTbl,[],function(tx,r){
                console.log('JobDetailTbl created----')
                eeDb.createPhotoTbl();
            },onError);
        }
    )
}
eeDb.createPhotoTbl = function(){
    var db = eeDb.db;
    db.transaction(
        function(transaction){
            transaction.executeSql(createPhotoTbl,[],function(tx,r){
                console.log('PhotoTbl created----')
            },onError);
        }
    )
}
eeDb.getJobById = function(id){
    console.log("in eeDb.getJobById function jobid = "+id)
   var db = eeDb.db;
    db.transaction(
        function(transaction){
            
            transaction.executeSql("select * from JobDetailTbl where JobId =?",[id],function(tx,r){
                
                var mainScope = angular.element('[ng-controller=mainCtrl]').scope();
                
                if(r.rows.length>0){                   
                    
                    mainScope.checkIfJobData(r.rows.item(0),true);
                   
                }else{
                    
                    mainScope.checkIfJobData('',false);
                }
            },onError);
        }
    ) 
}
eeDb.insertJobDetail = function(id,obj){
   // alert("called insert method")
   console.log("get job id "+id)
    var db = eeDb.db;
    db.transaction(
        function(transaction){
            transaction.executeSql("INSERT into JobDetailTbl(JobId,stringObj,status) VALUES (?,?,?)",
            [id,JSON.stringify(obj),"initial"],
            function(tx,r){
                var mainScope = angular.element('[ng-controller=mainCtrl]').scope();
                 mainScope.pageContent.jobinfo['photo'] = {};
                console.log('JobDetailTbl table Inserted---')
            },onError);
        }
    )   
}
eeDb.updateJobDetail = function(id,obj,step){
   // alert("called insert method")
    var db = eeDb.db;
    var query = '';
    query = "UPDATE JobDetailTbl SET "            
                query += "JobId="+id
                query += ", stringObj = \'"+ JSON.stringify(obj)              
                query += "\', status = \'initial\'"
                query += ",date = (datetime('now','localtime'))"
                query += " where JobId=?"

    db.transaction(
        function(transaction){
            transaction.executeSql(query,[id],
            function(){       
                console.log(step);   
                if(step){
                    var  scope = angular.element('[ng-controller=mainCtrl]').scope();  
                    scope.updateStatus(step);    
                }                    
                console.log('JobDetailTbl table Updated---')

            },onError);
        }
    )  
}
eeDb.updateJobDetailStatus =  function(id,sendStatus,step){
     var db = eeDb.db;
     var query = '';
   
    db.transaction(
        function(transaction){            
            transaction.executeSql("select * from JobDetailTbl where JobId =?",[id],function(tx,r){
                
              if(r.rows.length>0){   
                   var obj = JSON.parse(r.rows.item(0).stringObj);
                   obj[step].sendSuccess = sendStatus;
                   eeDb.updateJobDetail(obj.JobId,obj);
                }
            },onError);
        }
    ) 
    
}
eeDb.insertPhotoTbl = function(id,imageUrl,PhotoName){
   
    var db = eeDb.db;
    db.transaction(
        function(transaction){
            transaction.executeSql('INSERT into PhotoTbl(JobId,imageUrl,PhotoName,status) VALUES (?,?,?,?)',
            [id,imageUrl,PhotoName,"initial"],
            function(tx,r){
                 var mainScope = angular.element('[ng-controller=mainCtrl]').scope();
                 var temp = {jobId:id,PhotoName:PhotoName,imageUrl:imageUrl};
                    console.log(JSON.stringify(temp));
                 mainScope.sendPhotoToserver(r.insertId,temp);
                 console.log('PhotoTbl table Inserted---JobId:'+id+',imageUrl:'+imageUrl);
                 
            },onError);
        }
    )   
}
eeDb.select2weeksJob = function(){
    var db = eeDb.db;
    db.transaction(function(transaction){
        transaction.executeSql('SELECT * FROM JobDetailTbl WHERE date BETWEEN datetime("now", "-6 days") AND datetime("now", "localtime")',[],
            function(tx,r){
                 var scope = angular.element('[ng-controller=loginCtrl]').scope();
                 if(r.rows.length>0){
                    scope.syncJobdata(r);
                 }
                 
            },onError)
    })
}
eeDb.updatePhotoTbl = function(id,status){
    var db = eeDb.db;
    var query = '';
    query = 'UPDATE PhotoTbl SET '              
                query += 'status = \''+status+'\''
                query += ' where JobId=?'

    db.transaction(
        function(transaction){
            transaction.executeSql(query,[id],
            function(){
                console.log('PhotoTbl table Updated---')
            },onError);
        }
    )  
}
eeDb.getPhotoById = function(id){
    console.log("in eeDb.getPhotoById function jobid = "+id)
   var db = eeDb.db;
    db.transaction(
        function(transaction){
            
            transaction.executeSql("select * from PhotoTbl where Id =?",[id],function(tx,r){
                
                var mainScope = angular.element('[ng-controller=mainCtrl]').scope();
                
                /*if(r.rows.length>0){                   
                    
                    mainScope.checkIfJobData(r.rows.item(0),true);
                   
                }else{
                    
                    mainScope.checkIfJobData('',false);
                }*/
            },onError);
        }
    ) 
}



function onErrorPost(tx, e) {
   console.log("DEBUG - Error here in posts insert "+ e.message+', code '+ e.code)
}
function onErrorGetPost(tx, e) {
   console.log("DEBUG - Error here in getting post from post id "+ e.message+', code '+ e.code)
}
function onErrorStructure(tx, e) {
   console.log("DEBUG - Error here in structure insert "+ e.message+', code '+ e.code)
}
function onErrorLoadPagination(tx, e) {
   console.log("DEBUG - Error here in loading pagination "+ e.message+', code '+ e.code)
}
function onError(tx, e) {
    console.log("Error here in "+ e.message+', code '+ e.code)
}
function onSuccess(tx,r){
 // alert('Insertion successfull of '+ r);
   console.log('Insertion successfull of '+r.insertId)
}


function onDeleteSuccess(tr,r){
	console.log('Deleteion success of '+r.rowsAffected)
}

eeDb.updatePosts = function(updateP){
	var db = eeDb.db;
	db.transaction(
		function(transaction){
			for(i=0;i<updateP.length;i++){
				post = updateP[i]
				var ind = parseInt(post.id,10)
				query = 'UPDATE Posts SET '				
				query += 'orderPost='+post.order
				query += ', body =\''+ Encoder.htmlDecode(post.body)
				query += '\', childid ='+post.childid
				query += ', flow_id ='+post.flow_id
				query += ', parentid ='+post.parentid
				query += ', imageUrl =\''+post.imageUrl
				query += '\', date =\''+post.date
				query += '\', status =\''+post.status
				query += '\', tags =\''+post.tags
				query += '\', title =\''+post.title
				query += '\' where id=?'
				
				//console.log(query)
		
				transaction.executeSql(query,[ind],function(transaction,r){
					console.log('Update successfull '+ r.rowsAffected)
					},onError)	
							
			for(k = 0; k<post.answers.length; k++){
				postAns = post.answers[k]
				var index = parseInt(postAns.id,10)
				query = 'UPDATE answersTbl SET '
				query += 'f_post_id ='+ postAns.following_postid
				query += ', answerOrder ='+postAns.answer_order
				query += ', imageUrl =\''+postAns.imageUrl
				query += '\', title =\''+postAns.title
				query += '\' where ansId=?'
				console.log(query)
		
				transaction.executeSql(query,[index],function(transaction,r){
					console.log('Update answersTbl successfully. '+ r.rowsAffected)
					},onError)	
			}		
		}
		
	})
 
}
eeDb.updateFlows = function(updateF){
	var db = eeDb.db;
	db.transaction(
		function(transaction){
			for(i=0;i<updateF.length;i++){
				flow = updateF[i]
				var ind = parseInt(flow.id,10)
				query = 'UPDATE Flows SET '	
				query += ' count ='+ flow.count
				query += ', form = \''+Encoder.htmlDecode(flow.form)
				query += '\', imageUrl =\''+flow.imageUrl
				query += '\', activeDate =\''+flow.activeDate
				query += '\', status =\''+flow.status
				query += '\', type =\''+flow.type
				query += '\', title =\''+flow.title
				query += '\' where id=?'
				
				console.log(query)
		
				transaction.executeSql(query,[ind],function(transaction,r){
					console.log('Update successfull '+ r.rowsAffected)
					},onError)			
				
		}
	})
 
}


eeDb.clearDb = function(){
    var db = eeDb.db;
    db.transaction(
        function(transaction){
            transaction.executeSql('DROP TABLE categoryTbl',[],getCategory,onError)
            transaction.executeSql('DROP TABLE Flows',[],nullDataHandler,onError)
            transaction.executeSql('DROP TABLE alternativeTbl',[],nullDataHandler,onError)
            transaction.executeSql('DROP TABLE weightsTbl',[],getFlows,onError)
            transaction.executeSql('DROP TABLE structureTbl',[],nullDataHandler,onError)
            transaction.executeSql('DROP TABLE Posts',[],nullDataHandler,onError)
            transaction.executeSql('DROP TABLE answersTbl',[],getPost,onError)
        }
    )
}
