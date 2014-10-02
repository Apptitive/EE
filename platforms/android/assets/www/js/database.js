document.addEventListener("deviceready", deviceready, false);

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
    navigator.notification.confirm(
                        'Do you want to quit', 
                        onConfirmQuit, 
                        'QUIT TITLE', 
                        'OK,Cancel'  
                    );

}

function onConfirmQuit(button){
	var mainScope = angular.element('[ng-controller=mainCtrl]').scope();
	var note  =  mainScope.pageContent.globalnote;
       if(button == "1"){       	
            setStorage('globalnote',note);
            navigator.app.exitApp();           
        }
}