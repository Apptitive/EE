document.addEventListener("deviceready", deviceready, false);

function deviceready() {	
	console.log("deviceready");	
}

function createDb () {
	// body...
	eeDb.createJobTbl();
	//eeDb.createLineItemTbl();
	//
}