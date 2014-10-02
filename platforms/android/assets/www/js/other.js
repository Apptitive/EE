
document.addEventListener("deviceready", deviceready, false);

function updateProgressbar(obj){
    console.log('updateProgressbar');
    console.log(obj['riskhazard'].status);
	//$('.progresss_right div.done')
	var count = 0;
	if(obj['riskhazard'].status == true){
		//$('.progresss_right div.riskhazard').addClass('done');
		count++;
	}
	if(obj['assesment'].status == true){
		count++;//$('.progresss_right div.assesment').addClass('done');
	}
	if(obj['photo'].arr && obj['photo'].arr.length > 0){
		count++;//$('.progresss_right div.photo').addClass('done');
	}
	if(obj['clientdiscussion'].status == true){
		count++;//$('.progresss_right div.clientdiscussion').addClass('done');
	}
	if(obj['maintenance'].status == true){
		count++;//$('.progresss_right div.maintenance').addClass('done');
	}
	if(obj['lineitem'].status == true){
		count++;//$('.progresss_right div.lineitem').addClass('done');
	}
	if(obj['freetext'].status == true){
		count++;//$('.progresss_right div.report').addClass('done');
	}
	$('.progresss_right div').remove('div.done');
	for(i=0; i<count ; i++){
		//$('.progresss_right div')[i].css('background-color', 'rgb(255, 165, 0)');		
		$('.progresss_right').append('<div class="pr1 done"></div>');
		$('.done').css('width',$('.progresss_right').width()/7)
	}
    if(count <= 6){
        $('.progressbar div.number').html(((count)*14)+'%');    
    }else{
        $('.progressbar div.number').html('100%'); 
    }
	
	
}
function onConfirm(buttonIndex) {
    alert('You selected button ' + buttonIndex);
}

// Show a custom confirmation dialog
//
function showConfirm() {
    navigator.notification.confirm(
        'You are the winner!',  // message
        onConfirm,              // callback to invoke with index of button pressed
        'Game Over',            // title
        'Restart,Exit'          // buttonLabels
    );
}
function getStorage(name) {
    var value = window.localStorage.getItem(name);
    if(!value) return undefined;
    return value;
}

function setStorage(name, value) {
    window.localStorage.setItem(name, value);
}

function showAlert() {
	if(isMobile()){
		 navigator.notification.alert(
        'Provide your email and password.',  // message
        alertDismissed,         // callback
        'Login',            // title
        'Ok'                  // buttonName
    	);
	}else{
		alert('Provide your email and password.');
	}
   
}
function showMessage(msg,header) {
	if(isMobile()){
		 navigator.notification.alert(
	        msg,  // message
	        alertDismissed,         // callback
	        header,            // title
	        'Ok'                  // buttonName
    	);
	}else{
		alert(msg);
	}
   
}

function showDefaultError(){
	
	if(isMobile()){
		 navigator.notification.alert(
	        'Server error! Try again.',  // message
	        alertDismissed,         // callback
	        'Error',            // title
	        'Ok'                  // buttonName
    	);
	}else{
		alert('Server error! Try again');
	}
}
function alertDismissed() {
   
}

function isMobile() {
    ///<summary>Detecting whether the browser is a mobile browser or desktop browser</summary>
    ///<returns>A boolean value indicating whether the browser is a mobile browser or not</returns>

    if (sessionStorage.desktop) // desktop storage 
        return false;
    else if (localStorage.mobile) // mobile storage
        return true;

    // alternative
    var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile']; 
    for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

    // nothing found.. assume desktop
    return false;
}
function signuperror(){
	if(isMobile()){
		navigator.notification.alert(
		        'Unable to signup,Try again.',  // message
		        alertDismissed,         // callback
		        'Error',            // title
		        'Ok'                  // buttonName
	    	);
	}else{
		alert('Server error! Try again');
	}
}
function allTrue(obj)
{
  for(var o in obj)
      if(!obj[o]) return false;

  return true;
}
function formatDate(date){
	return date.getDate()+"-"+monthArray[date.getMonth()] +"-"+date.getFullYear();
}
function formDateDM(dateStr){
	var d = dateStr.replace(/[^0-9]/g,'');
	var dateMilisecond = new Date(parseInt(d));
	return dateMilisecond.getDate()+"-"+(dateMilisecond.getMonth()+1);
}
/**
 * Convert an image 
 * to a base64 string
 * @param  {String}   url         
 * @param  {Function} callback    
 * @param  {String}   [outputFormat=image/png]           
 */
function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        //console.log(dataURL.split('base64,')[1]);
        dataURL = dataURL.split('base64,')[1];

        callback.call(this, dataURL);
        canvas = null; 
    };
    img.src = url;
}


function deviceready() {	
	console.log("deviceready");	
	eeDb.open();
    eeDb.createJobTbl();

    $(document).bind('backbutton', onPressBack);
}

function createDb () {
	// body...
	eeDb.createJobTbl();
	//eeDb.createLineItemTbl();
	//
}

function onPressBack(e) {
    e.preventDefault();
    var scope = angular.element('[ng-controller=mainCtrl]').scope();
    var page = scope.pageContent.page;
    switch(page){
    	case 'jobdetail':
    		scope.showHome();
           setTimeout(function(){
             scope.$apply();
           },200)
    	break;
    	case 'home':
    		 navigator.notification.confirm(
                    'Do you want to quit', 
                    onConfirmQuit, 
                    'QUIT TITLE', 
                    'OK,Cancel'  
                );
    	break;
    	case 'login':
    		 navigator.notification.confirm(
                    'Do you want to quit', 
                    onConfirmQuit, 
                    'QUIT TITLE', 
                    'OK,Cancel'  
                );
    	break;
    	default:
    		scope.showJobDetail(scope.pageContent.jobid);
    	break;
    }
   /* navigator.notification.confirm(
                        'Do you want to quit', 
                        onConfirmQuit, 
                        'QUIT TITLE', 
                        'OK,Cancel'  
                    );*/

}

function onConfirmQuit(button){
	var mainScope = angular.element('[ng-controller=mainCtrl]').scope();
	var note  =  mainScope.pageContent.globalnote;
       if(button == "1"){       	
            setStorage('globalnote',note);
            navigator.app.exitApp();           
        }
}

