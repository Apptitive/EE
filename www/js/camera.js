var totPic = 0;
var imgList = [];


function capturePhoto() {
	navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
	    destinationType: Camera.DestinationType.DATA_URL, saveToPhotoAlbum: true
	});
}

function loadPhoto(){
	navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
    destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM });
}

function onSuccess(imageUrl) {
	imgList.push(imageUrl);
	console.log(imgList);
	//alert('Successfully imageUrl');
	var div = $('<div class="img">');
	var img = $('<img>');
	img.attr('src', 'data:image/jpeg;base64,'+imageUrl);
	
	div.append(img);
	div.append('<div class="removeImg" onclick="removeImg(this)"></div>')
	$("#imageulr1").append(div);
		totPic++;
	
}

function onFail(message) {
    alert('Failed because: ' + message);
}