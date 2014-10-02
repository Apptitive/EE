var app = angular.module('app', ['ngResource','datePicker','google-maps']); //

app.controller('mainCtrl',
	function($scope,$http,$window,$location,dataFactory,$sce) {

		$scope.loggedUser = {};
		$scope.modal_tempalte = 'views/modals.html';
		$scope.googlemap="";
		$scope.mainmenu = "views/mainmenu.html";
		$scope.header = "views/header.html";
		$scope.footer = "views/footer.html";
		$scope.login = "views/login.html";
		$scope.home = "views/home.html";
		$scope.insurer = "views/insurer.html";
		$scope.jobdetail = "views/jobdetail.html";
		$scope.riskhazard = "views/riskhazard.html";
		$scope.riskhazard = "views/riskhazard.html";
		$scope.photo_capture = "views/photo_capture.html";
		$scope.client_discuss = "views/clientdiscussion.html";
		$scope.maintenance = "views/maintenance.html";
		$scope.line_items = "views/line_items.html";
		$scope.po = "views/po.html";
		$scope.report_template = "views/report_template.html"
		$scope.map = {
			center: {
				latitude: "33.775228",
				longitude: "-118.127439"
			},
			zoom: 14
		};
		$scope.marker = {
            id:0,
            coords: {
                
            },
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {
                    $log.log('marker dragend');
                    $log.log(marker.getPosition().lat());
                    $log.log(marker.getPosition().lng());
                }
            }
        }	

		$scope.pageContent = {};
		$scope.pageContent.page = 'login';
		$scope.pageContent.jobinfo = {};
		$scope.pageContent.jobinfo.notes = '';
		$scope.showSettings =  false;
		$scope.show_form = false;
		$scope.showError = false;
		$scope.users = [{name:'naher',pass:'naher'},{name:'rayhan',pass:'12345'}];
		$scope.joblist = {};
		$scope.LineItemChargeUnit = [{"UnitID":1, "ChargeUnit1":"Sq Metre"}, {"UnitID":2, "ChargeUnit1":"Lin Metre"}, {"UnitID":3, "ChargeUnit1":"Unit"}, {"UnitID":4, "ChargeUnit1":"Hour"}, {"UnitID":5, "ChargeUnit1":"NA"}];
		$scope.pageContent.currentDate = {};
		$scope.pageContent.dateFilterJob = {};
		$scope.jobsearchForm = {
			JobId:"",
			ClaimNumber:"",
			ClientName:"",
			Suburb:""
		};
		$scope.reportForm = {};
		$scope.passwordInput = {};
		$scope.formdata = {}
		$scope.line_item_to_add = {};
		$scope.line_item_array = [];
		$scope.po_form = {};
		$scope.po_item_array = [];
		$scope.po_line_item_to_add = {};

		$scope.po_line_item_array = [];
		$scope.line_item_trade_types = [];
		$scope.po_types = [];
		$scope.po_trade_details = poTradeDetails;
		$scope.pageContent.line_item_locations =  []; //["Alfresco","Balcony","Basement","Bath room","Bedroom 1","Bedroom 2","Bedroom 3","Bedroom 4","Boundary","Carport","Cellar","Deck","Dining","Driveway","Ensuite","Entry","External","Family Room","Footpath","Garage","Garden","Gazebo","General","Guest Room","Hallway","Indoors pool","Internal","Kitchen","Laundry","Living room","Lounge room","Main dwelling External","Master bedroom","No Allowance","NOTE","Office","Other","Outdoors pool","Pantry","Patio","Pergola","Preliminary","Refer to Scope","Retaining Wall","Roof","Rumpus","Shed","Shop","Side Entry","Spa","Stair Well","Store Room","Study","Sub Floor","Sunroom","Toilet 1","Toilet 2","Verandah","Walk-in-Robe"];
		var line_item = 
		{
			line_id: "Id _1 ",
			location: "Dhaka",
			location_desc: "Banani",
			location_dim: "59 X90",
			trade: "Trade",
			sow: "Sower Document",
			charge_unit: "3",
			charge_per_unit: "45",
			units_charged: "543",
			units_cost: "343",
			materials: "No",
			total_cost: "4544",
			active: true,
			add_line: false
		}
		$scope.insurerDocuments;
		$scope.add_line_item = function(line_item_to_add){
			if(Object.keys(line_item_to_add).length>0){
				line_item_to_add.JobId = $scope.pageContent.jobid;
				$scope.pageContent.jobinfo['lineitem'].arr.push(line_item_to_add);	
				$scope.line_item_to_add = {};
			}else{
				alert("Nothing to add");
			}		
			
		};

		$scope.add_po_line_item = function(po_line_item_to_add){
			if(Object.keys(po_line_item_to_add).length > 0){
				console.log(po_line_item_to_add);
				po_line_item_to_add.JobId = $scope.pageContent.jobid;
				$scope.po_line_item_array.push(po_line_item_to_add);
				$scope.po_line_item_to_add = {};	
			}else{
				alert("Nothing to add");
			}
			
		};
		$scope.update_po_line_item = function(po_line_item_to_add){
			$scope.po_line_item_to_add = {};	
			$scope.update = false;
		}
		$scope.update_po = function(){
			$scope.po_form = {};
			$scope.updatePo =  false;
		}
		$scope.add_po_obj = function(){
			if(Object.keys($scope.po_form).length>0){
				$scope.po_form["LineItems"] = $scope.po_line_item_array;
				$scope.pageContent.jobinfo['polineitem'].arr.push($scope.po_form);	
				$scope.po_form = {};
				$scope.po_line_item_array = [];
			}else{
				alert("Nothing to add");
			}	
		};
		$scope.clear_po_obj = function(){
			$scope.po_form = {};
			$scope.updatePo =  false;
			$scope.po_line_item_array = [];
		}
		$scope.clear_line_item = function(){
			$scope.line_item_to_add = {};

		}

		$scope.clear_po_line_item = function(){
			$scope.po_line_item_to_add = {};
			$scope.update =  false;
		}

		$scope.saveNote =  function(){
			$('#notesModal').modal('hide');
			if($scope.pageContent.page=='home'){
					setStorage('globalnote',$scope.pageContent.globalnote);
			}else{
				console.log($scope.pageContent.jobinfo.notes);
				eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
			}
			
		}
		$scope.getInsurerDoc = function(){
			dataFactory.getInsurerDocs()
			.success(function (data) {

				if(!data.HasError){	
					$scope.insurerDocuments = data.Data.Results;
					console.log(JSON.stringify(data));

				}else if(data.HasError){	
					console.log(JSON.stringify(data));
				}         

			}).
			error(function(error) {
				//showDefaultError();
				$('#loadingDiv').hide();
			});
		}
		$scope.getLineItemLocations = function(){
			dataFactory.getLineItemLocations()
			.success(function (data) {

				if(!data.HasError){	
					$scope.line_item_locations = data.Data.Results;					
					setStorage('line_item_locations',JSON.stringify($scope.line_item_locations));
				}else if(data.HasError){	
					console.log(JSON.stringify(data));
				}         
				$('#loadingDiv').hide();
			}).
			error(function(error) {				
				if(getStorage('line_item_locations') && getStorage('line_item_locations').length>0){
					$scope.line_item_locations = JSON.parse(getStorage('line_item_locations'));
				}else{
					$scope.pageContent.page ="login";
					alert("Error fetching db. Login again with internet.")
				}
			});
		}
		$scope.getLineItemTradeTypes = function(){
			dataFactory.getLineItemTradeTypes()
			.success(function (data) {

				if(!data.HasError){	
					$scope.line_item_trade_types = data.Data.Results;
					//console.log(JSON.stringify(data));
					setStorage('line_item_trade_types', JSON.stringify($scope.line_item_trade_types));

				}else if(data.HasError){	
					console.log(JSON.stringify(data));
				}         
				$('#loadingDiv').hide();
			}).
			error(function(error) {
				if(getStorage('line_item_trade_types') && getStorage('line_item_trade_types').length>0){
					$scope.po_types = JSON.parse(getStorage('line_item_trade_types'));
					console.log(getStorage('line_item_trade_types'));
				}else{
					alert("Error fetching db. Login again with internet.")
				}
				$('#loadingDiv').hide();
			});
		}

		$scope.getPOTypes = function(){
			dataFactory.getPOTypes()
			.success(function (data) {

				if(!data.HasError){	
					$scope.po_types = data.Data.Results;
					console.log(JSON.stringify(data));
					setStorage('po_types', JSON.stringify(data.Data.Results));
				}else if(data.HasError){	
					console.log(JSON.stringify(data));
				} else{
					alert("Error fetching db. Login again with internet.")
				}        
				$('#loadingDiv').hide();
			}).
			error(function(error) {
				if(getStorage('po_types') && getStorage('po_types').length>0){
					$scope.po_types = JSON.parse(getStorage('po_types'));
					console.log(getStorage('po_types'));
				}
				$('#loadingDiv').hide();
			});
		}

		/*$scope.getPOTradeDetails = function(){
			dataFactory.getPOTradeDetails()
			.success(function (data) {

				if(!data.HasError){	
					$scope.po_trade_details = data.Data.Results;
					console.log(JSON.stringify(data));

				}else if(data.HasError){	
					console.log(JSON.stringify(data));
				}         

			}).
			error(function(error) {
				//showDefaultError();
				//$('#loadingDiv').hide();
			});
		}*/
		$scope.getAllDropdownList =  function(){
			$scope.getPOTypes();
			//$scope.getPOTradeDetails();
			$scope.getLineItemLocations();
			$scope.getLineItemTradeTypes();				
		}
		$scope.forgotPass = function(){
			$('#forgotModal').modal();
			$scope.clearModalMessage();
		}
		

		    

		$scope.logout = function(){
			//$window.location.reload();
			$scope.pageContent.page = 'login';
			
			//$scope.showSettings = false;
		}
			
		$scope.showHome = function(){
			console.log("in home method")			
			
			
			$scope.jobdetail = "";
			$scope.googlemap = "views/map.html";
			if(getStorage('globalnote') && getStorage('globalnote').length >0 ){
				$scope.pageContent.globalnote = getStorage('globalnote');
			}else{
				$scope.pageContent.globalnote = ""	
			}
			$scope.pageContent.page = 'home';
			set_content_height();
		}
		$scope.checkIfJobData = function(data,boolValue){
				// alert("in checkIfJobData function")
				if(boolValue == true){
					//job available
					JSON.stringify(data);
					if(data.stringObj && data.stringObj != "undefined"){
						console.log(data.stringObj);
						$scope.pageContent.jobinfo =  JSON.parse(data.stringObj);						
					}
					
					//show detail page
					showDetailPage();
				}else{
					console.log("job not in localdb. search online")
					//job not in localdb. search online
					if(navigator.onLine){
						getJobsDetailById($scope.pageContent.jobid);
					}else{
						alert("Connect to internet to get details of the job.");
						$('#loadingDiv').hide();
						return false;
					}
				}
			}
		function getJobsDetailById(id){
			
			dataFactory.jobDetailsById(id)
	    	.success(function (data) {

	    		if(!data.HasError){	
	    			console.log("in getJobsDetailById method success");	

	    			if(Object.keys(data.Data.Results).length > 0){
	    				var obj = data.Data.Results;
	    				if($scope.searchJobObj && Object.keys($scope.searchJobObj).length >0 ) {
	    					$scope.pageContent.currentDate = formDateDM(obj.InspectionDate);
	    					if(!$scope.pageContent.dateFilterJob[$scope.pageContent.currentDate]){
	    						$scope.pageContent.dateFilterJob[$scope.pageContent.currentDate] ={};
	    						$scope.pageContent.dateFilterJob[$scope.pageContent.currentDate][id] = obj;
	    					}else{
	    						jQuery.extend($scope.pageContent.dateFilterJob[$scope.pageContent.currentDate][id], obj);
	    					}
	    					$scope.formdata[id]= {};
	    				}else{
	    					jQuery.extend($scope.pageContent.dateFilterJob[$scope.pageContent.currentDate][id], obj);
	    				}
	    			}
	    			$scope.pageContent.jobinfo = $scope.pageContent.dateFilterJob[$scope.pageContent.currentDate][id];
	    			eeDb.insertJobDetail(id,$scope.pageContent.dateFilterJob[$scope.pageContent.currentDate][id]);
	    			showDetailPage();

	    		}else if(data.HasError){
	    			showMessage(data.Message);
	    			$scope.showHome();
	    			$('#loadingDiv').hide();
	    		}         

	    	}).
	    	error(function(error) {
                showDefaultError();	              
                $scope.showHome();
	    		$('#loadingDiv').hide();
            });
		}
		
		function showDetailPage(){

			$scope.insurer = "";
			$scope.jobdetail = "views/jobdetail.html";
			
			$scope.googlemap = "";
			$('.progresss_right div').remove('div.done');
			
			
			if($scope.pageContent.jobinfo.Location != ""){
				var location = $scope.pageContent.jobinfo.Location.slice(1,$scope.pageContent.jobinfo.Location.length-1).split(",");			
				$scope.map = {
					center: {
		                latitude: location[0],
		                longitude: location[1].trim()
		            },
					zoom: 14
				};
				$scope.marker = {
		            id:$scope.pageContent.jobid,
		            coords: {
		                latitude: location[0],
		                longitude: location[1].trim()
		            },
		            options: { draggable: true },
		            events: {
		                dragend: function (marker, eventName, args) {
		                    $log.log('marker dragend');
		                    $log.log(marker.getPosition().lat());
		                    $log.log(marker.getPosition().lng());
		                }
		            }
		        }	
		        setTimeout(function(){
		        	$scope.$apply()
		        },200)
			}

			
			
			
			var currenctJob = $scope.pageContent.jobinfo;
			if(currenctJob['riskhazard'] && currenctJob['riskhazard'].form){
				$scope.pageContent.form_riskhazard = currenctJob['riskhazard'].form;
				
			}else{
				$scope.pageContent.form_riskhazard = angular.copy(rinkhzardObj);
				currenctJob['riskhazard'] = {};
				currenctJob['riskhazard'].status = false;
			}
			if(currenctJob['assesment'] && currenctJob['assesment'].form){
				$scope.form_assesment = currenctJob['assesment'].form;
				
			}else{
				$scope.form_assesment = angular.copy(assesmentObj);
				currenctJob['assesment'] = {};
				currenctJob['assesment'].status = false;
			}

			if(currenctJob['clientdiscussion']){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				
			}else{
				currenctJob['clientdiscussion'] = {};
				currenctJob['clientdiscussion'].text ="";
				currenctJob['clientdiscussion'].status = false;
			}
			if(currenctJob['maintenance']){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				
			}else{
				currenctJob['maintenance'] = {};
				currenctJob['maintenance'].text ="";
				currenctJob['maintenance'].status = false;
			}
			if(currenctJob['lineitem']){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				
			}else{
				currenctJob['lineitem'] = {};
				currenctJob['lineitem'].arr=[];
				currenctJob['lineitem'].status = false;
			}
			if(currenctJob['polineitem']){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				
			}else{
				currenctJob['polineitem'] = {};
				currenctJob['polineitem'].arr=[];
				currenctJob['polineitem'].status = false;
			}
			if(currenctJob['report'] && $scope.pageContent.jobinfo['report'].form){
				$scope.reportForm = $scope.pageContent.jobinfo['report'].form;
				
			}else{
				currenctJob['report'] = {};
				$scope.reportForm = {};
				currenctJob['report'].status = false;
			}
			if(currenctJob['photo']){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				console.log(JSON.stringify(currenctJob['photo']))
				
			}else{
				currenctJob['photo'] = {};
				currenctJob['photo'].arr = [];
				currenctJob['photo'].status = false;
			}
			if(currenctJob['freetext'] && currenctJob['freetext'].text ){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				currenctJob['freetext'].text = currenctJob['freetext'].text;
				//console.log(JSON.stringify(currenctJob['freetext']))
				
			}else{
				currenctJob['freetext'] = {};
				currenctJob['freetext'].text = "";
				currenctJob['freetext'].status = false;
			}
			//$scope.pageContent.jobinfo.notes = '';
		    console.log("in showDetailPage method")
		    
		    $scope.pageContent.page = 'jobdetail';
		    
    	

			$('.riskhazard').animate({scrollTop:0},10);
			setTimeout(function(){
				var progressbarwidth = $('.progressbar').width() -158-40;
				progressbarwidth = Math.ceil(progressbarwidth/7) *7;
				$('.progresss_right').css('width',progressbarwidth); 
				$('.progressbar').css('opacity','1');  
				updateProgressbar($scope.pageContent.jobinfo);			
			},200)

			setTimeout(function(){
				$scope.$apply();				
				set_content_height();
				updateProgressbar($scope.pageContent.jobinfo);
			},100);
			$('#loadingDiv').hide();
		}
		$scope.showJobDetail = function(id,j){
			if(j){
				$scope.searchJobObj = j;
			}else{
				$scope.searchJobObj = "";
			}
			$scope.pageContent.jobid = id;
			try{
				eeDb.getJobById(id);	
			}catch(e){
				alert("error "+e);
			}
			
			$('#loadingDiv').show();
			
			
		}
		$scope.showInsurer = function(){
			$scope.insurer = "views/insurer.html";
			$scope.jobdetail = "";
			$scope.pageContent.page = 'insurer';	
			$("#loadingDiv").show();
			set_content_height();
			
			dataFactory.getInsurerDocs()
				.success(function (data) {

				if(!data.HasError){	
					$scope.insurerDocuments = data.Data.Results;
					console.log(JSON.stringify(data));
					$('#loadingDiv').hide();
				}else if(data.HasError){	
					console.log(JSON.stringify(data));
					$('#loadingDiv').hide();
				}         

			}).
			error(function(error) {
				showDefaultError();
				$('#loadingDiv').hide();
			});			
		}
		$scope.showEstimation = function(page){
		
			$scope.jobdetail = "";
			$('.riskhazard').animate({scrollTop:0},10);

			switch(page){
				case 'assessment':
					$scope.pageContent.page = 'riskhazard';					
					setTimeout(function(){
						$('.riskhazard').animate({scrollTop:$('#assessmentDiv').offset().top-162},10);
						console.log($('.riskhazard')[0].scrollTop)
					},100)
				break;
				case 'report_template':
					$scope.reportForm.estimatorName = $scope.loggedUser.username
					$scope.pageContent.page = 'report_template';
					$scope.pageContent.altPage = 'report_template'
					$scope.pageContent.pagetitle = 'Report template';
					switch($scope.pageContent.jobinfo.LossType){
						case 'Fire Damage':
							$scope.reportTemplate = "views/report_template/fire_damage.html";
							break;
						case 'Burglary Damage':
							$scope.reportTemplate = 'views/report_template/burglary_report.html';
							break;
						case 'Unknown':
							$scope.reportTemplate = 'views/report_template/water.html';
							break;
						case 'Fire Damage':
							$scope.reportTemplate = "views/report_template/fire_damage.html";
							break;
						case 'Impact Damage':
							$scope.reportTemplate = 'views/report_template/impact_tree.html';
							break;
						case 'Storm Damage':
							$scope.reportTemplate = 'views/report_template/storm.html';
							break;					
						case 'Malicious Damage':
							$scope.reportTemplate = 'views/report_template/vandalism_malicious.html';
							break;					
						case 'Water Damage':
							$scope.reportTemplate = 'views/report_template/water.html';
							break;
						case 'Glass Damage':
							$scope.reportTemplate = 'views/report_template/broken_glass.html';
							break;
						default:
							$scope.reportTemplate = "views/report_template/festooning_garage_ceiling.html";
							break;
				}					

				break;
				case 'freetext_report':
					$scope.pageContent.page = 'report_template';
					$scope.pageContent.altPage = 'freetext_report';
					$scope.pageContent.pagetitle = 'Free text report';
					setTimeout(function(){
						if($('#ReasonForReferral').val() && $('#ReasonForReferral').val().length > 600){
							$('#ReasonForReferral').css('height','180px');
						}
					},200)
					break;

				default:
					$scope.pageContent.page = page;
					break;
			}
			/*setTimeout(function(){
				var progressbarwidth = $('.progressbar').width() -158-40;
				$('.progresss_right div').css('width',progressbarwidth/8); 
				$('.progressbar').css('opacity','1');  

			},200)
*/			setTimeout(function(){
				$scope.$apply();
			},100);
			set_content_height();

		}
		$scope.saveClientdiscussion = function(){
			text  = $scope.pageContent.jobinfo['clientdiscussion'].text;
			var tempObj = {JobId:$scope.pageContent.jobid,ClientDiscussionDescription:text};
			$scope.pageContent.jobinfo['clientdiscussion'].text = text;
			//updateProgressbar($scope.pageContent.jobinfo);
			dataFactory.SaveClientDiscussionItem(tempObj)
			.success(function(data){
				if(!data.HasError){
					
					eeDb.updateJobDetailStatus(data.Data.Results.JobId,true,'clientdiscussion');
					console.log("Successfully send riskhazard ");
				}else{
					//$scope.pageContent.jobinfo['clientdiscussion'].status = false;
					//eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				}

			}).error(function(error){
				console.log("Dosnt send ClientDiscussion");
				//$scope.pageContent.jobinfo['clientdiscussion'].status = false;
				console.log($scope.pageContent.jobinfo['clientdiscussion']);
				
			});
			eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo,'clientdiscussion');
		}
		$scope.SaveMaintenanceIssue = function(){
			/*if(text.length <0 ){
				showMessage("You didn't write anything to send.","Error");
			}*/
			console.log(JSON.stringify($scope.pageContent.jobinfo['maintenance']));
				
			text  = $scope.pageContent.jobinfo['maintenance'].text;
			var tempObj = {JobId:$scope.pageContent.jobid,MaintenanceIssueDescription:text};
			//updateProgressbar($scope.pageContent.jobinfo);
			dataFactory.SaveMaintenanceIssue(tempObj)
			.success(function(data){
				if(!data.HasError){					
					console.log("Successfully send maintenance ");
					eeDb.updateJobDetailStatus(data.Data.Results.JobId,true,'maintenance');
				}else{
					//$scope.pageContent.jobinfo['maintenance'].status = false;
					//eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				}
			}).error(function(error){
				console.log("Dosnt send maintenance");
				//$scope.pageContent.jobinfo['maintenance'].status = false;
				
			});
			eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo,'maintenance');
		}
		$scope.saveLineItem = function(){
			var tempArr = [];
			var arr = $scope.pageContent.jobinfo['lineitem'].arr;
			for(obj in arr){
				item =  arr[obj];
					obj = item;
					if(item.ChargeUnit){
						obj.ChargeUnit = item.ChargeUnit.ChargeUnit1;
					}else{
						obj.ChargeUnit = null;
					}
					if(item.Trade){
						obj.Trade =  item.Trade.TradeType1;
						obj.TradeTypeID =  item.Trade.ItemID
					}else{
						obj.Trade = null;
						obj.TradeTypeID =  null
					}
					tempArr.push(obj);
				}

			console.log(JSON.stringify(tempArr));
			
			dataFactory.SaveLineItem(tempArr)
			.success(function(data){
				if(!data.HasError){
					
					console.log("Successfully send lineitem ");
					eeDb.updateJobDetailStatus(data.Data.Results.JobId,true,'lineitem');
					
				}else{
					
				}
			}).error(function(error){
				console.log("Dosnt send lineitem");
				console.log($scope.pageContent.jobinfo['lineitem']);
				
			});
			eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo,'lineitem');
			//updateProgressbar($scope.pageContent.jobinfo);
		}
		$scope.savePoLineItem = function(){
			console.log(JSON.stringify($scope.pageContent.jobinfo['polineitem']));
			var tempArr = [];
			for(obj2 in $scope.pageContent.jobinfo['polineitem'].arr){
				obj = {};
				item = $scope.pageContent.jobinfo['polineitem'].arr[obj2];
				obj.LineItems = item.LineItems;
				for(li in obj.LineItems){
					obj.LineItems[li].StartDate = item.StartDate;
					obj.LineItems[li].FinishDate = item.FinishDate;
					if(item.trade){
						obj.LineItems[li].Trade =  item.trade.TradeType1;
						obj.LineItems[li].TradeTypeID =  item.trade.ItemID
					}
						
				}
				if(item.trade){
					obj.TraderId = item.trade.TraderId;
				}
				if(obj.POType){
					obj.POType = item.POType.POTypeText;
				}
				obj.Note = item.Note;
				tempArr.push(obj)
			}		
			console.log(JSON.stringify(tempArr));
			dataFactory.SavePOLineItem(tempArr)
			.success(function(data){
				if(!data.HasError){
					//$scope.pageContent.jobinfo['polineitem'].status = true;					
					console.log("Successfully send polineitem ");
					//eeDb.updateJobDetailStatus(data.Data.Results.JobId,true,'polineitem');

				}else{
					console.log("doenst send polineitem")
				}
			}).error(function(error){
				console.log("Dosnt send polineitem");
				//$scope.pageContent.jobinfo['polineitem'].status = false;
				console.log($scope.pageContent.jobinfo['polineitem']);
				//eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
			});
			//updateProgressbar($scope.pageContent.jobinfo);
			eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo,'polineitem');
		}
		
		$scope.generateTemplate = function(){
			$scope.reportTemplate = {};			
			$scope.reportTemplate.ClaimedIncident = $("#ClaimedIncident").text();

			$scope.reportTemplate.BuildersAssessmentCause = "Inspection completed by "+$scope.reportForm.estimatorName
											+" on "+$scope.pageContent.jobinfo.DateTimeOfVisit
											+" in the presence of "+$scope.reportForm.clientName
											+" Relationship : "
			if($scope.reportForm.relation =='6'){
				$scope.reportTemplate.BuildersAssessmentCause += $scope.reportForm.otherRelation;			 
			}else{
				$scope.reportTemplate.BuildersAssessmentCause +=  $('#BuildersAssessmentCause select option:selected').text(); //$scope.reportForm.relation;		
			}
			

			$scope.reportTemplate.ResultantDamage = "We were directed to the area where the claimed damage had occurred.  Inspection of the property has revealed damage to the  "
			if($scope.reportForm.ResultantDamage =='7'){
				$scope.reportTemplate.ResultantDamage += $scope.reportForm.otherResultantDamage;			 
			}else{
				$scope.reportTemplate.ResultantDamage += $('#ResultantDamage option:selected').text();   //$scope.reportForm.ResultantDamage;		
			}						
			

			$scope.reportTemplate.Maintenance = '';
			if($scope.form_assesment.IsMaintenance=='True'){
				$scope.reportTemplate.Maintenance += 'The insured will be responsible for carrying out necessary repairs to the '
							+ $scope.reportForm.maintenance+" prior to the commencement of insurance repairs."
			}else{
				$scope.reportTemplate.Maintenance += " No maintenance issues to report relating to this claim. ";	
			}
			
			$scope.reportTemplate.ReasonForReferral = "Claim Recommendation: ";
			if($scope.pageContent.jobinfo.LossType == 'Unknown'){
				$scope.reportTemplate.ReasonForReferral +=   $('#ReasonForReferral').text();		
			}else{
				if($scope.reportForm.ReasonForReferral =='9'){
					$scope.reportTemplate.ReasonForReferral += $scope.reportForm.otherReasonForReferral;			 
				}else{
					if($scope.reportForm.ReasonForReferral =='2'|| $scope.reportForm.ReasonForReferral =='3' || $scope.reportForm.ReasonForReferral =='5' ){
						if(!$scope.reportForm.otherReasonForReferral || $scope.reportForm.otherReasonForReferral == ""){
							alert("Fill the Other text box.")
							$scope.showEstimation('report_template');
							return false;
						}else{
							$scope.reportTemplate.ReasonForReferral +=   $('#ReasonForReferral option:selected').text().replace('---',$scope.reportForm.otherReasonForReferral);		
						}
					}else{
							$scope.reportTemplate.ReasonForReferral +=   $('#ReasonForReferral option:selected').text();		
					}
				}
			}									
			
			$scope.reportTemplate.ActionFollowingIncident = "";
			if($scope.pageContent.form_riskhazard.IsMakeSafeRequired== 'True'){
				$scope.reportTemplate.ActionFollowingIncident += "A makesafe has been carried out by Power Partners to temporarily secure the property. "
			}
			if($scope.form_assesment.IsNeighbouringFence == 'True'){
				$scope.reportTemplate.ActionFollowingIncident += "  The insured’s boundary fence was damaged during the claimed event. A cost has been provided to repair the boundary fence. Costs provided are 50% half share of the boundary fence and this component of the claim is recommended for cash settlement. "
			}
			$scope.reportTemplate.WereContentsInvolved = "Contents: "+ $('#WereContentsInvolved option:selected').text();

			$scope.reportTemplate.Fracture = "Fracture: "+ $('#Fracture option:selected').text();  
			if($scope.pageContent.jobinfo.LossType == 'Burglary Damage'){
				$scope.reportTemplate.policeReport = "Police Report: ";
				if($scope.reportForm.policeReport =='2'|| $scope.reportForm.policeReport =='1'){
					if(!$scope.reportForm.otherpoliceReport || $scope.reportForm.otherpoliceReport == ""){
						alert("Fill the Number text box.")
						$scope.showEstimation('report_template');
						return false;
					}else{
						$scope.reportTemplate.policeReport +=   $('#policeReport option:selected').text().replace('---',$scope.reportForm.otherpoliceReport);		
					}
				}else{
						$scope.reportTemplate.policeReport +=   $('#policeReport option:selected').text();		
				}
			}
			$scope.reportTemplate.ConditionProperty = "Condition of property: ";
			if($scope.reportForm.ConditionProperty =='5'){
				if(!$scope.reportForm.otherConditionProperty || $scope.reportForm.otherConditionProperty == ""){
					alert("Fill the text box.")
					$scope.showEstimation('report_template');
					return false;
				}else{
					$scope.reportTemplate.ConditionProperty +=   $('#ConditionProperty option:selected').text().replace('---',$scope.reportForm.otherpoliceReport);		
				}
			}else{
					$scope.reportTemplate.ConditionProperty +=   $('#ConditionProperty option:selected').text();		
			}
			
			var html = ''
				html  += '<div class="title">Client Name:</div>'
				html += '<div><textarea id="ClientName" >'+$scope.pageContent.jobinfo.ClientName+'</textarea></div>'
				html  += '<div class="title">Assessor Contact:</div>'
				html += '<div><textarea id="AssessorContact" >'+$scope.pageContent.jobinfo.ClientName+'</textarea></div>'
				html  += '<div class="title">Claimed Incident:</div>'
				html += '<div><textarea id="claimIncident" >'+$scope.reportTemplate.ClaimedIncident+'</textarea></div>'
				if($scope.pageContent.jobinfo.LossType == 'Burglary Damage'){
					html += '<div class="title"> Police Report:</div>'
					html += '<div><textarea id="policeReport">'+$scope.reportTemplate.policeReport+'</textarea></div>'
				}
				html += '<div class="title">Maintenance</div>'
				html += '<div><textarea  id="Maintenance" >'+$scope.reportTemplate.Maintenance+'</textarea></div>'
				html += '<div class="title">Action Following Incident</div>'
				html += '<div><textarea id="ActionFollowingIncident" >'+$scope.reportTemplate.ActionFollowingIncident+'</textarea></div>'
				html += '<div class="title">Builders Assessment Cause</div>'
				html += '<div><textarea id="BuildersAssessmentCause" >'+$scope.reportTemplate.BuildersAssessmentCause+'</textarea></div>'
				html += '<div class="title">Reason ForReferral</div>'
				html += '<div><textarea id="ReasonForReferral">'+$scope.reportTemplate.ReasonForReferral+'</textarea></div>'
				html += '<div class="title">Resultant Damage</div>'
				html += '<div><textarea id="ResultantDamage">'+$scope.reportTemplate.ResultantDamage+'</textarea></div>'
				html += '<div class="title"> WereContents Involved?</div>'
				html += '<div><textarea id="WereContentsInvolved">'+$scope.reportTemplate.WereContentsInvolved+'</textarea></div>'
				if($scope.pageContent.jobinfo.LossType == 'Glass Damage'){
					html += '<div class="title">Condition of property:</div>'
					html += '<div><textarea id="ConditionProperty">'+$scope.reportTemplate.ConditionProperty+'</textarea></div>'
					html += '<div class="title"> Fracture:</div>'
					html += '<div><textarea id="Fracture">'+$scope.reportTemplate.Fracture+'</textarea></div>'
				}

				$scope.pageContent.jobinfo['freetext'].text = html;
				$scope.pageContent.jobinfo['report'].form = $scope.reportForm;

				eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				$scope.showEstimation('freetext_report');
				$scope.pageContent.jobinfo['freetext'].text = $sce.trustAsHtml(html);
		}
		$scope.saveReport = function(){
			
			var reportObj = {};
			  reportObj.ClaimedIncident = $('#claimIncident').val();
			  reportObj.Maintenance = $('#Maintenance').val();
			  reportObj.ActionFollowingIncident = $('#ActionFollowingIncident').val();
			  reportObj.BuildersAssessmentCause = $('#BuildersAssessmentCause').val();
			  reportObj.ReasonForReferral = $('#ReasonForReferral').val();
			  reportObj.ResultantDamage = $('#ResultantDamage').val();
			  reportObj.WereContentsInvolved = $('#WereContentsInvolved').val();
			  reportObj.JobID = $scope.pageContent.jobid;
			  reportObj.ClaimNo = $scope.pageContent.jobinfo.ClaimNumber;
			  reportObj.AssessorContact = $('#AssessorContact').val();

			console.log(JSON.stringify(reportObj));
			$scope.pageContent.jobinfo['freetext'].status = true;
			$scope.pageContent.jobinfo['freetext'].text = $('#freetextSave').html();
			eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo,'freetext');
			$scope.pageContent.jobinfo['freetext'].text = $sce.trustAsHtml($('#freetextSave').html());

			
			
			dataFactory.SaveBARreport(reportObj)
			.success(function(data){
				if(!data.HasError){
					//$scope.pageContent.jobinfo['freetext'].status = true;					
					console.log("Successfully send freetext ");
					//eeDb.updateJobDetailStatus(data.Data.Results.JobId,true,'freetext');
				}else{
					//$scope.pageContent.jobinfo['freetext'].status = false;	
					console.log("doesnt send freetext ");				
				}
			}).error(function(error){
				console.log("Dosnt send freetext");
				//$scope.pageContent.jobinfo['freetext'].status = false;
				
			});
			var temp = {"JobId":$scope.pageContent.jobid, "NoteDescription":$scope.pageContent.jobinfo.notes};

			dataFactory.SaveNoteByJobId(temp)
			.success(function (data) {
				/*console.log("notes send Successfully");
				console.log(JSON.stringify(data));*/
				if(!data.HasError){	
					console.log("notes send Successfully");
					//eeDb.updateJobDetailStatus(data.Data.Results.JobId,true,'notes');

				}else if(data.HasError){	
					console.log(JSON.stringify(data));
				}         

			}).
			error(function(error) {
				console.log("notes doesnt send.");
				//showDefaultError();
				//$('#loadingDiv').hide();
			});
			$scope.showHome();
			//updateProgressbar($scope.pageContent.jobinfo);
		}

		$scope.openNotes =  function(){
			$('#notesModal').modal();
		}
		$scope.modal = {message:""};
		$scope.clearModalMessage = function(){
			
			$scope.modal = {message:""};
			$scope.recoverymailsent =  false;
		}
		$scope.showNotice = function(notice){
			$scope.modal.text =  notice;
		}
		$scope.closeNotemodal = function(){
			$('#notesModal').modal('hide');   	
		}
		$scope.updateStatus =  function(step){			
				$scope.pageContent.jobinfo[step].status = true;	
				eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				updateProgressbar($scope.pageContent.jobinfo);
		}
		$scope.backNavigation = function(){
			var page = $scope.pageContent.page;
		    switch(page){
		    	case 'jobdetail':
		    		$scope.showHome();
		    	break;
		    	case 'riskhazard':
		    	case "photo_capture":
				case "client_discuss":
				case "maintenance": 
				case "line_items":
				case "po": 
				case "report_template": 
		    		 $scope.showJobDetail($scope.pageContent.jobid);
		    	break;
		    	
		    	default:
		    		$scope.showJobDetail($scope.pageContent.jobid);
		    	break;
		    }
		}
		$scope.recoverymailsent =  false;
		$scope.recoverymail = function(username){
			
			$('#loadingDiv').show();
			dataFactory.recoverPassword(username)
			.success(function (data) {

				if(!data.HasError){	
					$scope.modal.message = data.Data.Results;
					$scope.recoverymailsent =  true;

					$('#loadingDiv').hide();

				}else if(data.HasError){	
					$scope.modal.message = data.Data.Results;
					showMessage(data.Message,"Forgot Password");

					$('#loadingDiv').hide();
				}         

			}).
			error(function(error) {
	            //alert('Unable to signup,Try again')
	            showDefaultError();

	            $('#loadingDiv').hide();
	        });
			//$scope.recoverymailsent =  true;
		}
		$scope.joblist = {};
		$scope.searchForm = {};
		$scope.jobsearchForm = {
				    		JobId:"",
				    		ClaimNumber:"",
				    		ClientName:"",
				    		Suburb:""
				    	};
		$scope.searchJob = function(obj){
			$scope.joblist = {};
			$('#loadingDiv').show();
			$scope.jobsearchForm = {
				JobId:(obj.JobId)? obj.JobId:'' ,
				ClaimNumber: (obj.ClaimNumber) ? obj.ClaimNumber : '' ,
				ClientName:(obj.ClientName) ? obj.ClientName : '' ,
				Suburb:(obj.Suburb) ? obj.Suburb : '' 
			};

			console.log(JSON.stringify($scope.jobsearchForm));
			dataFactory.searchJob($scope.jobsearchForm)
			.success(function (data) {
	                //alert('success')
	                if(!data.HasError){	
	                	$scope.joblist =  data.Data.Results;
				        console.log(JSON.stringify(data))
				        $('#loadingDiv').hide();
				        $scope.searchForm = {};
				        $scope.jobsearchForm={};
				    }else if(data.HasError){	
				    	showMessage(data.Message);                	 
				    	/*$scope.jobsearchForm = {
				    		JobId:"",
				    		ClaimNumber:"",
				    		ClientName:"",
				    		Suburb:""
				    	};*/
				    	//$scope.searchForm = {};
				        $scope.jobsearchForm={};
				    	console.log(JSON.stringify(data))
				    	$('#loadingDiv').hide();
				    }         

				}).
			error(function(error) {
	               console.log('Error '+error);
	                //showDefaultError();
	                $scope.joblist = localdata.searchedJob ;
	                $('#loadingDiv').hide();
	            });
		}
		$scope.changePassword = function(userinput){
			
			$('#loadingDiv').show();
			dataFactory.changePassword(userinput.oldPassword,userinput.newPassword)
			.success(function (data) {
				console.log(JSON.stringify(data));
				if(!data.HasError){	

					showMessage(data.Message,"Change Password");
					$scope.pageContent.page = 'login';   
					$('#loadingDiv').hide();

				}else if(data.HasError){	
					showMessage(data.Message,"Change Password Error");

					$('#loadingDiv').hide();
				}         

			}).
			error(function(error) {
	            showDefaultError();
	            $('#loadingDiv').hide();
	        });
		}
		
		$scope.find_user = function(variableValue,varibaleName){
			var result = $.grep($scope.users, function(e){ 
				return e[varibaleName] == variableValue; 
			});
			return result;
		}
		
		$scope.open_remotefile = function(url){
			console.log(url);
			navigator.notification.confirm(
		        'Click OK to download and view the file.',  // message
		        function(buttonIndex){
		        	if(buttonIndex == 1){
		        		if(url.indexOf('http')>-1)
							window.open(url,'_system','location=no');
						else{
							window.open("http://"+url,'_system','location=no');
						}
		        	}else{

		        	}
		        },              // callback to invoke with index of button pressed
		        'Open Remote File'            // title
		        //'OK,CANCEL'          // buttonLabels
		    );

			
			
		}
		var totPic = 0;
		var imgList = [];
		
		$scope.loadPhoto = function(){
			navigator.camera.getPicture($scope.onLoadSuccess, $scope.onFail, { quality: 40,
				destinationType: Camera.DestinationType.FILE_URI, sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM });
		}
		$scope.capturePhoto = function(){
			navigator.camera.getPicture($scope.onSuccess, $scope.onFail, { quality: 40,
			    destinationType: Camera.DestinationType.FILE_URI, targetWidth: 600, targetHeight: 400, saveToPhotoAlbum: true
			});
		//capturePhoto();
		}
		$scope.onLoadSuccess = function(img) {
			var imageUrl = '';
			imageUrl = img;
			console.log('Successfully loaded imageUrl '+imageUrl);
			window.resolveLocalFileSystemURL(imageUrl , $scope.resolveLocalOnLoadSuccess, $scope.onFail);	
		}
		$scope.resolveLocalOnLoadSuccess = function(imageUrl){
			
			console.log('after: ' + imageUrl.toURL());
			if(!$scope.pageContent.jobinfo['photo'].arr){
				$scope.pageContent.jobinfo['photo'].arr = [];
			}
			$scope.pageContent.jobinfo['photo'].arr.push({status:false,imageUrl:imageUrl.toURL()});
			setTimeout(function(){$scope.$apply();},100)
			//eeDb.insertPhotoTbl($scope.pageContent.jobid,imageUrl.toURL());
		}
		$scope.onSuccess = function(imageUrl) {

			console.log('Successfully imageUrl '+imageUrl);
			if(!$scope.pageContent.jobinfo['photo'].arr){
				$scope.pageContent.jobinfo['photo'].arr = [];				
			}
			$scope.pageContent.jobinfo['photo'].arr.push({status:false,imageUrl:imageUrl});
			setTimeout(function(){$scope.$apply();},100)
			
			
		}
		
			
		$scope.saveImages = function(){
			if(!$scope.pageContent.jobinfo['photo'].status){
				$scope.pageContent.jobinfo['photo'].status = false;
			}
			console.log('photo saved '+$scope.pageContent.jobinfo['photo'].status);
			if($scope.pageContent.jobinfo['photo'].status == false){
				var imgList = $scope.pageContent.jobinfo['photo'].arr;
				console.log(JSON.stringify(imgList));
				
				for(i in imgList){
					var PhotoName = $scope.pageContent.jobid+"_img_"+i
					eeDb.insertPhotoTbl($scope.pageContent.jobid,imgList[i].imageUrl,PhotoName);
								
				}
				//updateProgressbar($scope.pageContent.jobinfo)
			}
			eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo,'photo');
		}
		$scope.removeImg =  function(a){
			console.log(JSON.stringify($scope.pageContent.jobinfo['photo'].arr));
			$('#id_'+a).remove();
			$scope.pageContent.jobinfo['photo'].arr.splice(a,1);
			console.log("removed");
			console.log(JSON.stringify($scope.pageContent.jobinfo['photo'].arr));
			eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
		}
		
		$scope.onFail = function(message) {
			//showMessage(message,"Camera Failed")
			console.log(message);
		}
		$scope.remove = function(array, index){
		    array.splice(index, 1);
		}
		$scope.update =  false;
		$scope.updatePo =  false;
		$scope.populateLineitem = function(id){
			$scope.update =  true;
			$scope.updatePOIndex = id;
			$scope.po_line_item_to_add = $scope.po_line_item_array[id];
		}
		$scope.populatePOitem  = function(index){
			$scope.updatePo =  true;
			$scope.po_form = $scope.pageContent.jobinfo['polineitem'].arr[index];
			$scope.po_line_item_array = $scope.po_form["LineItems"] ;
		}
		$scope.sendPhotoToserver = function(photoTblId,obj){
			convertImgToBase64(obj.imageUrl,function(base64Img){
					//console.log(base64Img);
					var temp = {jobId:obj.jobId, PhotoName:obj.PhotoName, Base64String:base64Img};
					//console.log(JSON.stringify(temp));
					dataFactory.SaveJobInspectionPhoto(temp)
						.success(function (data){
							if(!data.HasError){									
								console.log("Successfully send photocapture "+JSON.stringify(data));									
								eeDb.updatePhotoTbl(photoTblId,"ture");
							}else{
								console.log("Image sending failed "+JSON.stringify(data));									
							}
						})
						.error(function(error){
							console.log("img not sent "+JSON.stringify(error));
						})
				});
		}
		set_content_height();
		/*eeDb.open();
		createDb();*/

});
app.controller('jobdetailCtrl',function($scope,$http,dataFactory){
	
});
app.controller('loginCtrl',function($scope,$http,dataFactory){

	$scope.user = {};
	$scope.pageContent.jobsByDate;
	$scope.pageContent.jobsInDateArray=[];
	$scope.pageContent.jobsByType;
	$scope.pageContent.noticeList;
	$scope.pageContent.proceduralDocList;
	var monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]


	$scope.createNewUser = function () {
		$('#loadingDiv').show();
		console.log(JSON.stringify($scope.user));

		dataFactory.signup($scope.user)
		.success(function (data) {

			if(!data.HasError){	
				$scope.signupForm.$setPristine();
				$scope.pageContent.page = 'login';
				$('#loadingDiv').hide();
				showMessage(data.Message,"Sign Up");
			}else if(data.HasError){           	 
				showMessage(data.Message,"Signup Error!");
				$scope.pageContent.page = 'login';                	
				$('#loadingDiv').hide();     

			}

		}).
		error(function(error) {
			signuperror();
			$scope.pageContent.page = 'login'; 
			$('#loadingDiv').hide();
		});
	};
	$scope.login =  function(){
		
		var dpScope = angular.element('.dpView').scope().$parent;
		$scope.getdata={
			jobsByDate : false,
			noticeList:false,
			proceduralDocList:false
		};
		var date = new Date();
		dpScope.setDate(date);
		$scope.pageContent.currentDate = date.getDate()+"-"+(date.getMonth()+1);
		$('#loadingDiv').show();
		
		

		/*$scope.m_username = "bill.karovski";
		$scope.m_password ="123456";*/
		//if navigator.online take new password AND SAVE in localstorage
		if(navigator.onLine){
			setStorage('username',$scope.m_username);
			setStorage('pasword',$scope.m_password);	
			$scope.$parent.loggedUser.username = $scope.m_username;
			$scope.$parent.loggedUser.password = $scope.m_password;
		}else{
			if($scope.m_username != getStorage('username') || $scope.m_password != getStorage('pasword')){
				
				alert("Wrong username Or password");
				$scope.pageContent.page = 'login';
				$('#loadingDiv').hide();
				return false;
				
			}else if($scope.m_username == getStorage('username') && $scope.m_password == getStorage('pasword')){
				console.log("offline othentication succes");
			}

		}
		
		$scope.decideGetJobMethod();
		
		
	}
	function readyJobsData(){
			var dpScope = angular.element('.dpView').scope().$parent;
			var jobs = {};
			for(j in $scope.pageContent.jobsByDate){
				var jobObj = $scope.pageContent.jobsByDate[j];
				var d = jobObj.InspectionDate.replace(/[^0-9]/g,'');
				var dateMilisecond = new Date(parseInt(d));
				date = dateMilisecond.getDate()+"-"+(dateMilisecond.getMonth()+1);
				if($scope.pageContent.dateFilterJob[date]){
					$scope.pageContent.dateFilterJob[date][jobObj.JobId] = jobObj;
				}else{
					$scope.pageContent.dateFilterJob[date] = {};
					$scope.pageContent.dateFilterJob[date][jobObj.JobId] = jobObj;
				}
				
				jobs[jobObj.JobId] = jobObj;
				$scope.formdata[jobObj.JobId]= {};
				
				$scope.pageContent.jobsInDateArray.push((dateMilisecond.getMonth()+1)+"-"+dateMilisecond.getDate()+"-"+dateMilisecond.getFullYear());	
			}
			console.log($scope.pageContent.dateFilterJob);
			dpScope.dateList = $scope.pageContent.jobsInDateArray ;
			console.log(dpScope.dateList);
			dpScope.update();
			$scope.pageContent.currentDate = dpScope.now.getDate()+"-"+(dpScope.now.getMonth()+1);
			/*$scope.pageContent.page = 'home';*/
			$scope.$parent.showHome();
			$scope.pageContent.jobsByDate= jobs;
			$scope.getdata.jobsByDate = true;
			$('#loadingDiv').hide();
		}
	$scope.GetJobsByDate = function(){
			var dpScope = angular.element('.dpView').scope().$parent;
			var lastWeek = dpScope.weeks[dpScope.weeks.length-1];			
			var startDate = dpScope.weeks[0][0];
			startDate = formatDate(startDate);
			var endDate = lastWeek[lastWeek.length-1];
			endDate =  formatDate(endDate);
			
			dataFactory.getJobsByDate(startDate,endDate)
				.success(function (data) {
					setStorage('installedapp','true');

				if(!data.HasError){	
					$scope.pageContent.jobsByDate =  data.Data.Results;
					console.log(JSON.stringify($scope.pageContent.jobsByDate))
					setStorage('jobsByDate', JSON.stringify($scope.pageContent.jobsByDate));
					readyJobsData();
					$scope.GetNoticeList();			

				}else if(data.HasError){	
					showMessage(data.Message,"Login Error");                	 
					$scope.user = '';
					$scope.pageContent.page = 'login';
					//console.log(JSON.stringify(data));
					$('#loadingDiv').hide();
				}   

			}).
			error(function(error) {
				showDefaultError();								
				$('#loadingDiv').hide();
			});
	}	
	$scope.GetJobFirstTime =  function(){
		var startDate = new Date();
		var endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() - 13);
			startDate = formatDate(startDate);		
			
			endDate =  formatDate(endDate);
			
			dataFactory.getJobsByDate(startDate,endDate)
				.success(function (data) {
					setStorage('installedapp','true');

				if(!data.HasError){	
					$scope.pageContent.jobsByDate =  data.Data.Results;
					console.log(JSON.stringify($scope.pageContent.jobsByDate))
					setStorage('jobsByDate', JSON.stringify($scope.pageContent.jobsByDate));
					for(j in $scope.pageContent.jobsByDate){
						getJobInfoById($scope.pageContent.jobsByDate[j]);
						getRiskHazardByJobId($scope.pageContent.jobsByDate[j]);							
					}
					setTimeout(function(){
						readyJobsData();
						/*$scope.pageContent.page = "home";*/
						//$('#loadingDiv').hide();
						$scope.$apply();
					},5000)
					$scope.GetNoticeList();			

				}else if(data.HasError){	
					showMessage(data.Message,"Login Error");                	 
					$scope.user = '';
					$scope.pageContent.page = 'login';
					//console.log(JSON.stringify(data));
					$('#loadingDiv').hide();
				}   

			}).
			error(function(error) {
				showDefaultError();								
				$('#loadingDiv').hide();
			});
	}
	$scope.GetNoticeList = function(){
		console.log("GetNoticeList");
		dataFactory.getNoticeList()
		.success(function (data) {

			if(!data.HasError){	
				$scope.pageContent.noticeList =  data.Data.Results;
				console.log(JSON.stringify($scope.pageContent.noticeList))
				setStorage('noticeList', JSON.stringify($scope.pageContent.noticeList));
				$scope.getdata.noticeList = true;
				$scope.GetAllProceduralDocuments();
				    
				}else if(data.HasError){	
					/*showMessage(data.Message);                	 
					$scope.user = '';
					$scope.pageContent.page = 'login';
					console.log(JSON.stringify(data));*/
					if(getStorage('noticeList') && getStorage('noticeList').length>0)
						$scope.pageContent.noticeList = JSON.parse(getStorage('noticeList'));
					$('#loadingDiv').hide();
				}         

			}).
		error(function(error) {
	            //alert('Unable to signup,Try again')
	            //showDefaultError();
	            if(getStorage('noticeList') && getStorage('noticeList').length>0)
					$scope.pageContent.noticeList = JSON.parse(getStorage('noticeList'));
	            $('#loadingDiv').hide();
	        });
	}
	$scope.GetAllProceduralDocuments = function(){
		dataFactory.getAllProceduralDocuments()
		.success(function (data) {

			if(!data.HasError){	
				$scope.pageContent.proceduralDocList =  data.Data.Results;
				//console.log(JSON.stringify($scope.pageContent.proceduralDocList))
				setStorage('proceduralDocList', JSON.stringify($scope.pageContent.proceduralDocList));
				$scope.getdata.proceduralDocList = true;
					$('#loadingDiv').hide();
				}else if(data.HasError){	
					//showMessage(data.Message);                	 
					//$scope.user = '';
					//$scope.pageContent.page = 'login';
					if(getStorage('proceduralDocList') && getStorage('proceduralDocList').length>0)
						$scope.pageContent.proceduralDocList = JSON.parse(getStorage('proceduralDocList'));
					$('#loadingDiv').hide();
				}         

			}).
		error(function(error) {
			//showDefaultError();
			//$scope.$parent.showHome();
			if(getStorage('proceduralDocList') && getStorage('proceduralDocList').length>0)
				$scope.pageContent.proceduralDocList = JSON.parse(getStorage('proceduralDocList'));
			$('#loadingDiv').hide();

		});
	}
	
	$scope.decideGetJobMethod = function(){

		$http.defaults.headers.common['User'] = $scope.m_username;  
		$http.defaults.headers.common['Password'] = $scope.m_password; 
		if(navigator.onLine){
			console.log("Device online");
			$scope.$parent.getAllDropdownList();
			//if(getStorage('installedapp') && getStorage('installedapp').length>0 ){
				$scope.GetJobsByDate();
			/*}else{
				$scope.GetJobFirstTime();
				alert("Initializing app for the first time.It will take few time.");
			}*/
			eeDb.select2weeksJob();
		}else{
			console.log("Device offline")
			if(getStorage('jobsByDate') && getStorage('jobsByDate').length >0){
				$scope.pageContent.jobsByDate = JSON.parse(getStorage('jobsByDate'));
				$scope.pageContent.noticeList = JSON.parse(getStorage('noticeList'));
				$scope.pageContent.proceduralDocList = JSON.parse(getStorage('proceduralDocList'));

				if(getStorage('line_item_locations') && getStorage('line_item_locations').length>0){
					$scope.line_item_locations = JSON.parse(getStorage('line_item_locations'));
					console.log(getStorage('line_item_locations'));
				}
				if(getStorage('line_item_trade_types') && getStorage('line_item_trade_types').length>0){
					$scope.line_item_trade_types = JSON.parse(getStorage('line_item_trade_types'));
					console.log(getStorage('line_item_trade_types'));
				}
				if(getStorage('po_types') && getStorage('po_types').length>0){
					$scope.po_types = JSON.parse(getStorage('po_types'));
					console.log(getStorage('po_types'));
				}
				readyJobsData();
			}else{
				alert("Connect to internet.")
				$('#loadingDiv').hide();
			}			
			
		}
	}

	$scope.syncJobdata = function(r){
		for(i=0;i<r.rows.length;i++){
			job = r.rows.item(i);
			//console.log(JSON.stringify(job));
			if(job.stringObj!=undefined && job.stringObj.length > 0){
				jobToSend = JSON.parse(job.stringObj);
				if(!jobToSend['riskhazard'].sendSuccess || jobToSend['riskhazard'].sendSuccess == "false"){
					console.log('sycn started')
					$scope.saveRiskHazard(jobToSend); 
				}
				if(!jobToSend['assesment'].sendSuccess || jobToSend['assesment'].sendSuccess == "false"){
					$scope.saveAssesment(jobToSend)
				}
				if(!jobToSend['clientdiscussion'].sendSuccess || jobToSend['clientdiscussion'].sendSuccess == "false"){
					
					$scope.saveClientdiscussion(jobToSend)
				}
				if(!jobToSend['maintenance'].sendSuccess || jobToSend['maintenance'].sendSuccess == "false"){
					
					$scope.SaveMaintenanceIssue(jobToSend)
				}
				if(!jobToSend['lineitem'].sendSuccess || jobToSend['lineitem'].sendSuccess == "false"){

					if(jobToSend['lineitem'].arr.length > 0)
						$scope.saveLineItem(jobToSend)
				}
				if(!jobToSend['polineitem'].sendSuccess || jobToSend['polineitem'].sendSuccess == "false"){
					if(jobToSend['polineitem'].arr.length > 0)
						$scope.savePoLineItem(jobToSend)
				}
			}	
			
		}
		
	} 
	$scope.saveRiskHazard = function(obj){
		console.log(JSON.stringify(obj['riskhazard'].form));
		dataFactory.saveRiskHazard(obj['riskhazard'].form)
			.success(function(data){
				if(!data.HasError){					
					console.log("Successfully sync riskhazard ");
					obj['riskhazard'].sendSuccess = true;
					eeDb.updateJobDetail(obj.JobId,obj);
				}else{
					console.log("sync riskhazard not done "+JSON.stringify(data));
					//eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				}
			}).error(function(error){
				console.log("Error sending riskhazard");
			});
	}
	$scope.saveAssesment = function(obj){
		console.log(JSON.stringify(obj['assesment'].form));
		dataFactory.saveAssesment(obj['assesment'].form)
			.success(function(data){
				if(!data.HasError){					
					console.log("Successfully send assesment ");
					obj['assesment'].sendSuccess = true;
					eeDb.updateJobDetail(obj.JobId,obj);
				}else{
					console.log("sync assesment not done "+JSON.stringify(data));
				}
			}).error(function(error){
				console.log("Error sending assesment");
			});
	}
	$scope.saveClientdiscussion = function(obj){
		console.log(JSON.stringify(obj['clientdiscussion']));
		var tempObj = {JobId:jobToSend.JobId,ClientDiscussionDescription:obj['clientdiscussion'].text};
		dataFactory.SaveClientDiscussionItem(tempObj)
		.success(function(data){
			if(!data.HasError){
				console.log("Successfully synch ClientDiscussionItem ");
				obj['clientdiscussion'].sendSuccess = true;
				eeDb.updateJobDetail(obj.JobId,obj);
			}else{
				console.log("sync ClientDiscussionItem not done "+JSON.stringify(data));
			}

		}).error(function(error){
			console.log("Dosn't send ClientDiscussion");
			
		});

	}
	$scope.SaveMaintenanceIssue = function(job){
		var tempObj = {JobId:job.JobId,MaintenanceIssueDescription:job['maintenance'].text};
		dataFactory.SaveMaintenanceIssue(tempObj)
		.success(function(data){
			if(!data.HasError){
				console.log("Successfully synch maintenance ");
				job['maintenance'].sendSuccess = true;
				eeDb.updateJobDetail(job.JobId,job);
			}else{
				console.log("sync maintenance not done "+JSON.stringify(data));
			}

		}).error(function(error){
			console.log("Dosn't send maintenance");			
		});
	}
	$scope.saveLineItem = function(job){
		console.log(JSON.stringify(job['lineitem'].arr));
		var tempArr = [];
			var arr = job['lineitem'].arr;
			for(i=0;i<arr.length;i++){
				item =  arr[i];
				var obj = item;
				if(item.ChargeUnit){
					obj.ChargeUnit = item.ChargeUnit.ChargeUnit1;
				}else{
					obj.ChargeUnit = null;
				}
				if(item.Trade){
					obj.Trade =  item.Trade.TradeType1;
					obj.TradeTypeID =  item.Trade.ItemID;
				}else{
					obj.Trade = null;
					obj.TradeTypeID =  null
				}
				tempArr.push(obj);
			}
		dataFactory.SaveLineItem(tempArr)
		.success(function(data){
			if(!data.HasError){
				console.log("Successfully synch lineitem ");
				job['lineitem'].sendSuccess = true;
				eeDb.updateJobDetail(job.JobId,job);
			}else{
				console.log("sync lineitem not done "+JSON.stringify(data));
			}

		}).error(function(error){
			console.log("Dosn't send lineitem");
			
		});
	}
	$scope.savePoLineItem = function(job){
		var tempArr = [];
		for(obj2 in job['polineitem'].arr){
			obj = {};
			item = job['polineitem'].arr[obj2];
			obj.LineItems = item.LineItems;
			for(li in obj.LineItems){
				obj.LineItems[li].StartDate = item.StartDate;
				obj.LineItems[li].FinishDate = item.FinishDate;
				if(item.trade){
					obj.LineItems[li].Trade =  item.trade.TradeType1;
					obj.LineItems[li].TradeTypeID =  item.trade.ItemID
				}
					
			}
			if(item.trade){
				obj.TraderId = item.trade.TraderId;
			}
			if(obj.POType){
				obj.POType = item.POType.POTypeText;
			}
			obj.Note = item.Note;
			tempArr.push(obj)
		}		
		console.log(JSON.stringify(tempArr));
		dataFactory.SavePOLineItem(tempArr)
		.success(function(data){
			if(!data.HasError){					
				console.log("Successfully synch polineitem ");
				job['polineitem'].sendSuccess = true;
				eeDb.updateJobDetail(job.JobId,job);
			}else{
				console.log("doenst synch polineitem")
				console.log(JSON.stringify(data));
			}
		}).error(function(error){
			console.log("Dosn't synch polineitem");
		});
	}

	function getJobInfoById(job){

	}
	function getRiskHazardByJobId(job){
		console.log("get job id "+job.JobId)
		dataFactory.getRiskHazardByJobId(job.JobId)
		.success(function (data) {			

			if(!data.HasError){	
				console.log("save job id "+data.Data.Results.JobId)
				job['riskhazard'] = {};
				job['riskhazard'].form = data.Data.Results;
				job['riskhazard'].status = true;
				eeDb.insertJobDetail(job.JobId,job)
			}else if(data.HasError){	
				
			}   

		}).
		error(function(error) {
			
		});
}
});


app.controller('homeCtrl',function($scope,dataFactory){
	/*$scope.colorMap = {
		"VIC":"red",
		"NIC":"orange",
		"PIC":"green"
	}*/
	$scope.map = {
		center: {
			latitude: "33.775228",
			longitude: "-118.127439"
		},
		zoom: 14
	};
	$scope.joblist = {};
	$scope.searchJob = function(){
		$('#loadingDiv').show();
		$scope.jobsearchForm = {
			JobId:$scope.JobId,
			ClaimNumber: ($scope.ClaimNumber) ? $scope.ClaimNumber : '' ,
			ClientName:($scope.ClientName) ? $scope.ClientName : '' ,
			Suburb:($scope.Suburb) ? $scope.Suburb : '' 
		};

		console.log($scope.jobsearchForm);
		dataFactory.searchJob($scope.jobsearchForm)
		.success(function (data) {
                //alert('success')
                if(!data.HasError){	
                	$scope.joblist =  data.Data.Results;
			        //alert(JSON.stringify(data))
			        $('#loadingDiv').hide();
			    }else if(data.HasError){	
			    	showMessage(data.Message);                	 
			    	$scope.jobsearchForm = {
			    		JobId:"",
			    		ClaimNumber:"",
			    		ClientName:"",
			    		Suburb:""
			    	};
			    	$('#loadingDiv').hide();
			    }         

			}).
		error(function(error) {
                //alert('Error')
                showDefaultError();
                $scope.joblist = localdata.searchedJob ;
                $('#loadingDiv').hide();
            });
	}
});
app.controller('risk_hazardCtrl',['$scope','$http','$window','$location','dataFactory',
	function($scope,$http,$window,$location,dataFactory) {		

		$('.feedback_bottom_panel .signin').on('mousedown touchstart', function(){
			$(this).addClass('activeNext');
		})
		$('.feedback_bottom_panel .signin').on('mouseup touchcancel', function(){
			$(this).removeClass('activeNext');
		})
		
		
		/*$scope.pageContent.form_riskhazard = rinkhzardObj;
		$scope.form_assesment= assesmentObj;*/
		$scope.changeQsn3 = function(value){
			console.log('qsn4 '+$scope.pageContent.form_riskhazard.IsMakeSafeRequired)
			console.log('qsn5 '+$scope.pageContent.form_riskhazard.IsSpecialistReport)
			console.log('after')
			if(value == 'True'){
				
			}else if(value == 'False'){
				$scope.pageContent.form_riskhazard.IsMakeSafeRequired = "";
				$scope.pageContent.form_riskhazard.IsSpecialistReport = "";
			}
			console.log('qsn4 '+$scope.pageContent.form_riskhazard.IsMakeSafeRequired)
			console.log('qsn5 '+$scope.pageContent.form_riskhazard.IsSpecialistReport)
		}
		$scope.changeQsn9 = function(value){
			console.log('qsn9_1 '+$scope.form_assesment.IsCleanUp)
			console.log('qsn9_2'+$scope.form_assesment.IsDustProtection)
			console.log('qsn9_3 '+$scope.form_assesment.IsIsolation)
			console.log('qsn9_4'+$scope.form_assesment.IsFumes)
			console.log('after')
			if(value == 'True'){

			}else if(value == 'False'){
				$scope.form_assesment.IsCleanUp = "";
				$scope.form_assesment.IsDustProtection = "";
				$scope.form_assesment.IsIsolation = "";
				$scope.form_assesment.IsFumes = "";
			}
			console.log('qsn9_1 '+$scope.form_assesment.IsCleanUp)
			console.log('qsn9_2'+$scope.form_assesment.IsDustProtection)
			console.log('qsn9_3 '+$scope.form_assesment.IsIsolation)
			console.log('qsn9_4'+$scope.form_assesment.IsFumes)
		}
		
		$scope.changeQsn13 = function(value){
			if(value == 'True'){

			}else if(value == 'False'){
				$scope.form_assesment.IsStorage = "";
				$scope.form_assesment.IsRemoval = "";
				$scope.form_assesment.IsReturn = "";
			}
			console.log('qsn13_1 '+$scope.form_assesment.IsStorage)
			console.log('qsn13_2'+$scope.form_assesment.IsRemoval)
			console.log('qsn13_3 '+$scope.form_assesment.IsReturn)
		}
		$scope.changeQsn15 = function(value){
			if(value == 'True'){

			}else if(value == 'False'){
				$scope.form_assesment.IsProps = "";
				$scope.form_assesment.IsFence = "";
				$scope.form_assesment.IsTraps = "";
			}
			console.log('qsn15_1 '+$scope.form_assesment.IsProps)
			console.log('qsn15_2'+$scope.form_assesment.IsFence)
			console.log('qsn15_3 '+$scope.form_assesment.IsTraps)
		}
		$scope.saveFormData = function(form){
			switch(form){
				case 'riskhazard':
					$scope.formdata[$scope.pageContent.jobid]['riskhazard'] = $scope.pageContent.form_riskhazard;
					$scope.formdata[$scope.pageContent.jobid]['assesment'] = $scope.form_assesment;
					console.log($scope.formdata[$scope.pageContent.jobid]);
					$scope.saveRiskHazard($scope.formdata[$scope.pageContent.jobid]['riskhazard']);
					$scope.saveAssesment($scope.formdata[$scope.pageContent.jobid]['assesment']);
					break;
				default:

				break;
			}

		}
		$scope.saveRiskHazard = function(obj){
			obj.JobId = $scope.pageContent.jobid;
			obj.LoggedAt = new Date();
			//var tempObj = {JobId:$scope.pageContent.jobid,LoggedAt:new Date()};
			/*for(o in obj){
				tempObj[obj[o].attr] = obj[o].ans;
			}*/
			console.log(JSON.stringify(obj));
			$scope.pageContent.jobinfo['riskhazard'].form = obj;			

			dataFactory.saveRiskHazard(obj)
			.success(function(data){
				console.log(JSON.stringify(data));
				if(!data.HasError){					
					console.log("Successfully send riskhazard ");
					eeDb.updateJobDetailStatus(data.Data.Results.JobId,true,'riskhazard');
				}else{
					//$scope.pageContent.jobinfo['riskhazard'].status = false;
					//eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				}
			}).error(function(error){
				console.log("Error sending riskhazard");
				//$scope.pageContent.jobinfo['riskhazard'].status = false;
				//eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
			});
			eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo,'riskhazard');
		}
		$scope.saveAssesment = function(obj){
			obj.JobId = $scope.pageContent.jobid;
			obj.LoggedAt = new Date();
			
			console.log(JSON.stringify(obj));
			$scope.pageContent.jobinfo['assesment'].form = obj;
			dataFactory.saveAssesment(obj)
			.success(function(data){
				console.log(JSON.stringify(data));
				if(!data.HasError){
					console.log("Successfully send assesment ");
					eeDb.updateJobDetailStatus(data.Data.Results.JobId,true,'assesment');
				}else{
					//$scope.pageContent.jobinfo['assesment'].status = false;
					
				}
			}).error(function(error){
				console.log("Error sending assesment");
				
			});
			eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo,'assesment');
		}

	}]);

//$.grep = function (a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d} 
function set_content_height(){
    console.log("called");
    
    //setTimeout(function(){
       var header_height=parseInt($('.header').css('height'));
        var footer_height=parseInt($('.bottom_bar').css('height'));
        var window_height=window.innerHeight;
        var contentHeight = window_height-header_height-footer_height-1;
        $('.content_box').css('height',contentHeight);
        $('.details_holder').css('height',contentHeight-153-45);
        //},200)
    
}


    
$(window).resize(function() {
	
    console.log("resize");
    set_content_height();
    setTimeout(function(){
    	$('.content_box').animate({scrollTop:0},10);
    },300)
});

//window.onresize = set_content_height();