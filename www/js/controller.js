var app = angular.module('app', ['ngResource','datePicker','google-maps']); //

app.controller('mainCtrl',
	function($scope,$http,$window,$location,dataFactory) {

		$scope.loggedUser = {};
		$scope.modal_tempalte = 'views/modals.html';
		$scope.googlemap="";
		$scope.mainmenu = "views/mainmenu.html";
		$scope.header = "views/header.html";
		$scope.footer = "views/footer.html";
		$scope.login = "views/login.html";
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
			console.log(po_line_item_to_add);
			po_line_item_to_add.JobId = $scope.pageContent.jobid;
			$scope.po_line_item_array.push(po_line_item_to_add);
			$scope.po_line_item_to_add = {};
		};
		$scope.add_po_obj = function(){
			//if(Object.keys(po_line_item_to_add).length>0){
				$scope.po_form["LineItems"] = $scope.po_line_item_array;
				$scope.pageContent.jobinfo['polineitem'].arr.push($scope.po_form);	
				$scope.po_form = {};
			//}else{
				//alert("Nothing to add");
			//}	
		};
		$scope.clear_po_obj = function(){
			$scope.po_form = {};
		}
		$scope.clear_line_item = function(){
			$scope.line_item_to_add = {};
		}

		$scope.clear_po_line_item = function(){
			$scope.po_line_item_to_add = {};
		}

		$scope.saveNote =  function(){
			$('#notesModal').hide();
			var temp = {"JobId":$scope.pageContent.jobid, "NoteDescription":$scope.pageContent.jobinfo.notes};

			dataFactory.SaveNoteByJobId(temp)
			.success(function (data) {
				console.log("notes send Successfully");

				/*if(!data.HasError){	
					$scope.insurerDocuments = data.Data.Results;
					console.log(JSON.stringify(data));

				}else if(data.HasError){	
					console.log(JSON.stringify(data));
				}     */    

			}).
			error(function(error) {
				console.log("notes doesnt send.");
				//showDefaultError();
				//$('#loadingDiv').hide();
			});
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
					console.log(JSON.stringify($scope.line_item_locations));
					//$('#loadingDiv').hide();

				}else if(data.HasError){	
					console.log(JSON.stringify(data));
					//$('#loadingDiv').hide();
				}         

			}).
			error(function(error) {
				//showDefaultError();
				$scope.line_item_locations = ["Alfresco","Balcony","Basement","Bath room","Bedroom 1","Bedroom 2","Bedroom 3","Bedroom 4","Boundary","Carport","Cellar","Deck","Dining","Driveway","Ensuite","Entry","External","Family Room","Footpath","Garage","Garden","Gazebo","General","Guest Room","Hallway","Indoors pool","Internal","Kitchen","Laundry","Living room","Lounge room","Main dwelling External","Master bedroom","No Allowance","NOTE","Office","Other","Outdoors pool","Pantry","Patio","Pergola","Preliminary","Refer to Scope","Retaining Wall","Roof","Rumpus","Shed","Shop","Side Entry","Spa","Stair Well","Store Room","Study","Sub Floor","Sunroom","Toilet 1","Toilet 2","Verandah","Walk-in-Robe"];
				//$('#loadingDiv').hide();
			});
		}
		$scope.getLineItemTradeTypes = function(){
			dataFactory.getLineItemTradeTypes()
			.success(function (data) {

				if(!data.HasError){	
					$scope.line_item_trade_types = data.Data.Results;
					console.log(JSON.stringify(data));

				}else if(data.HasError){	
					console.log(JSON.stringify(data));
				}         

			}).
			error(function(error) {
				//showDefaultError();
				//$('#loadingDiv').hide();
			});
		}

		$scope.getPOTypes = function(){
			dataFactory.getPOTypes()
			.success(function (data) {

				if(!data.HasError){	
					$scope.po_types = data.Data.Results;
					console.log(JSON.stringify(data));

				}else if(data.HasError){	
					console.log(JSON.stringify(data));
				}         

			}).
			error(function(error) {
				//showDefaultError();
				//$('#loadingDiv').hide();
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
		$scope.map = {
			center: {
				latitude: "",
				longitude: ""
			},
			zoom: 12
		};

		    

		$scope.logout = function(){
			//$window.location.reload();
			$scope.pageContent.page = 'login';
			//$scope.showSettings = false;
		}
			
		$scope.showHome = function(){
			$scope.googlemap = "views/map.html";
			$scope.pageContent.page = 'home';
		}
		$scope.checkIfJobData = function(data,boolValue){
				// alert("in checkIfJobData function")
				if(boolValue == true){
					//job available
					//console.log(data.stringObj);
					$scope.pageContent.jobinfo =  JSON.parse(data.stringObj);					
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
	    				jQuery.extend($scope.pageContent.dateFilterJob[$scope.pageContent.currentDate][id], data.Data.Results);
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
			$scope.googlemap = "";
			/*var location = $scope.pageContent.jobinfo.Location.slice(1,$scope.pageContent.jobinfo.Location.length-1).split(",");

			console.log($scope.pageContent.jobinfo.Location.slice(1,$scope.pageContent.jobinfo.Location.length-1))
			$scope.map = {
				center: {
					latitude: location[0],
					longitude: location[1].trim()
				},
				zoom: 12
			};*/
			$('#loadingDiv').hide();
			$scope.temp = '';
			$scope.temp= angular.copy(rinkhzardObj);
			
			if($scope.pageContent.jobinfo['riskhazard']){
				$scope.pageContent.form_riskhazard = $scope.pageContent.jobinfo['riskhazard'];
				
			}else{
				$scope.pageContent.form_riskhazard = $scope.temp;
				$scope.pageContent.jobinfo['riskhazard'] = {};
				$scope.pageContent.jobinfo['riskhazard'].status = false;
			}
			if($scope.pageContent.jobinfo['assesment']){
				$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				
			}else{
				$scope.form_assesment = angular.copy(assesmentObj);
				$scope.pageContent.jobinfo['assesment'] = {};
				$scope.pageContent.jobinfo['assesment'].status = false;
			}

			if($scope.pageContent.jobinfo['clientdiscussion']){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				
			}else{
				$scope.pageContent.jobinfo['clientdiscussion'] = {};
				$scope.pageContent.jobinfo['clientdiscussion'].text ="";
				$scope.pageContent.jobinfo['clientdiscussion'].status = false;
			}
			if($scope.pageContent.jobinfo['maintenance']){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				
			}else{
				$scope.pageContent.jobinfo['maintenance'] = {};
				$scope.pageContent.jobinfo['maintenance'].text ="";
				$scope.pageContent.jobinfo['maintenance'].status = false;
			}
			if($scope.pageContent.jobinfo['lineitem']){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				
			}else{
				$scope.pageContent.jobinfo['lineitem'] = {};
				$scope.pageContent.jobinfo['lineitem'].arr=[];
				$scope.pageContent.jobinfo['lineitem'].status = false;
			}
			if($scope.pageContent.jobinfo['polineitem']){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				
			}else{
				$scope.pageContent.jobinfo['polineitem'] = {};
				$scope.pageContent.jobinfo['polineitem'].arr=[];
				$scope.pageContent.jobinfo['polineitem'].status = false;
			}
			if($scope.pageContent.jobinfo['report']){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				
			}else{
				$scope.pageContent.jobinfo['report'] = {};
				$scope.pageContent.jobinfo['report'].status = false;
			}
			if($scope.pageContent.jobinfo['photo']){
				//$scope.form_assesment = $scope.pageContent.jobinfo['assesment'];
				console.log(JSON.stringify($scope.pageContent.jobinfo['photo']))
				
			}else{
				$scope.pageContent.jobinfo['photo'] = {};
				$scope.pageContent.jobinfo['photo'].arr = [];
				$scope.pageContent.jobinfo['photo'].status = false;
			}
			$scope.pageContent.jobinfo.notes = '';
		    console.log("in showDetailPage method")
		    updateProgressbar($scope.pageContent.jobinfo);
		    $scope.pageContent.page = 'jobdetail';
			$('#loadingDiv').hide();
		   

			$('.header_bottom_part_left_cont span').removeClass('active');
			$('.header_bottom_part_left_cont span:nth-child(1)').addClass('active');

	    	//$('#loadingDiv').hide();

			$('.riskhazard').animate({scrollTop:0},10);
			setTimeout(function(){
				var progressbarwidth = $('.progressbar').width() -158-40;
				$('.progresss_right div').css('width',progressbarwidth/7); 
				$('.progressbar').css('opacity','1');  
				$('#loadingDiv').hide();
			},200)
		}
		$scope.showJobDetail = function(id){
			$scope.pageContent.jobid = id;
			try{
				eeDb.getJobById(id);	
			}catch(e){
				alert("error "+e);
			}
			
			$('#loadingDiv').show();
			
			
		}
		$scope.showInsurer = function(){
			
			$scope.pageContent.page = 'insurer';	
			$("#loadingDiv").show();
			$('.header_bottom_part_left_cont span').removeClass('active');
			$('.header_bottom_part_left_cont span:nth-child(2)').addClass('active');
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
						$scope.reportTemplate = 'views/report_template/festooning_garage_ceiling.html';
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
						$scope.reportTemplate = 'views/report_template/water_burst_pipe.html';
						break;
					case 'Glass Damage':
						$scope.reportTemplate = 'views/report_template/broken_glass.html';
						break;
					default:
						$scope.reportTemplate = "views/report_template/burglary_report.html";
						break;
				}					

				break;
				/*case 'freetext_report':
				$scope.pageContent.page = 'report_template';
				$scope.pageContent.altPage = 'freetext_report';
				$scope.pageContent.pagetitle = 'Free text report';

				break;*/

				default:
				$scope.pageContent.page = page;
				break;
			}
			/*setTimeout(function(){
				var progressbarwidth = $('.progressbar').width() -158-40;
				$('.progresss_right div').css('width',progressbarwidth/8); 
				$('.progressbar').css('opacity','1');  

			},200)
*/
			set_content_height();

		}
		$scope.saveClientdiscussion = function(){
			text  = $scope.pageContent.jobinfo['clientdiscussion'].text;
			var tempObj = {JobId:$scope.pageContent.jobid,ClientDiscussionDescription:text};
			$scope.pageContent.jobinfo['clientdiscussion'].text = text;
			dataFactory.SaveClientDiscussionItem(tempObj)
			.success(function(data){
				if(!data.HasError){
					$scope.pageContent.jobinfo['clientdiscussion'].status = true;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
					console.log("Successfully send riskhazard ");
					updateProgressbar($scope.pageContent.jobinfo);
				}else{
					$scope.pageContent.jobinfo['clientdiscussion'].status = false;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				}

			}).error(function(error){
				console.log("Dosnt send ClientDiscussion");
				$scope.pageContent.jobinfo['clientdiscussion'].status = false;
				console.log($scope.pageContent.jobinfo['clientdiscussion']);
				eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
			});
		}
		$scope.SaveMaintenanceIssue = function(){
			/*if(text.length <0 ){
				showMessage("You didn't write anything to send.","Error");
			}*/
			text  = $scope.pageContent.jobinfo['maintenance'].text;
			var tempObj = {JobId:$scope.pageContent.jobid,MaintenanceIssueDescription:text};
			dataFactory.SaveMaintenanceIssue(tempObj)
			.success(function(data){
				if(!data.HasError){
					$scope.pageContent.jobinfo['maintenance'].status = true;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
					console.log("Successfully send maintenance ");
					updateProgressbar($scope.pageContent.jobinfo);
				}else{
					$scope.pageContent.jobinfo['maintenance'].status = false;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				}
			}).error(function(error){
				console.log("Dosnt send maintenance");
				$scope.pageContent.jobinfo['maintenance'].status = false;
				console.log($scope.pageContent.jobinfo['maintenance']);
				eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
			});
		}
		$scope.saveLineItem = function(){
			console.log($scope.pageContent.jobinfo['lineitem']);
			//$scope.pageContent.jobinfo["lineitem"] = $scope.line_item_array;
			
			dataFactory.SaveLineItem($scope.pageContent.jobinfo['lineitem'].arr)
			.success(function(data){
				if(!data.HasError){
					$scope.pageContent.jobinfo['lineitem'].status = true;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
					console.log("Successfully send lineitem ");
					updateProgressbar($scope.pageContent.jobinfo);
				}else{
					$scope.pageContent.jobinfo['lineitem'].status = false;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				}
			}).error(function(error){
				console.log("Dosnt send lineitem");
				$scope.pageContent.jobinfo['lineitem'].status = false;
				console.log($scope.pageContent.jobinfo['lineitem']);
				eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
			});
		}
		$scope.savePoLineItem = function(){
			console.log($scope.pageContent.jobinfo['polineitem']);
			//$scope.pageContent.jobinfo["lineitem"] = $scope.line_item_array;
			
			dataFactory.SavePOLineItem($scope.pageContent.jobinfo['polineitem'].arr)
			.success(function(data){
				if(!data.HasError){
					$scope.pageContent.jobinfo['polineitem'].status = true;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
					console.log("Successfully send polineitem ");
					updateProgressbar($scope.pageContent.jobinfo);
				}else{
					$scope.pageContent.jobinfo['polineitem'].status = false;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				}
			}).error(function(error){
				console.log("Dosnt send polineitem");
				$scope.pageContent.jobinfo['polineitem'].status = false;
				console.log($scope.pageContent.jobinfo['polineitem']);
				eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
			});
		}
		$scope.reportForm = {};
		$scope.generateTemplate = function(){
			$scope.reportTemplate = {};
			$scope.reportTemplate.ClaimedIncident = $("#ClaimedIncident").text();

			$scope.reportTemplate.BuildersAssessmentCause = "Inspection completed by "+$scope.reportForm.estimatorName
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
			if($scope.form_assesment.qsn1.ans=='True'){
				$scope.reportTemplate.Maintenance += 'The insured will be responsible for carrying out necessary repairs to the '
							+ $scope.reportForm.maintenance+" prior to the commencement of insurance repairs."
			}else{
				$scope.reportTemplate.Maintenance += " No maintenance issues to report relating to this claim. ";	
			}
			
			$scope.reportTemplate.ReasonForReferral = "Claim Recommendation ";
			if($scope.reportForm.ReasonForReferral =='9'){
				$scope.reportTemplate.ReasonForReferral += $scope.reportForm.otherReasonForReferral;			 
			}else{
				$scope.reportTemplate.ReasonForReferral +=   $('#ReasonForReferral option:selected').text();   //$scope.reportForm.ReasonForReferral;		
			}						
			
			$scope.reportTemplate.ActionFollowingIncident = "";
			if($scope.pageContent.form_riskhazard.qsn4.ans == 'True'){
				$scope.reportTemplate.ActionFollowingIncident += "A makesafe has been carried out by Power Partners to temporarily secure the property. "
			}
			if($scope.form_assesment.qsn14_1.ans == 'True'){
				$scope.reportTemplate.ActionFollowingIncident += "  The insured’s boundary fence was damaged during the claimed event. A cost has been provided to repair the boundary fence. Costs provided are 50% half share of the boundary fence and this component of the claim is recommended for cash settlement. "
			}
			$scope.reportTemplate.WereContentsInvolved = "Contents: "+ $('#WereContentsInvolved option:selected').text();   //$scope.reportForm.WereContentsInvolved;
			console.log(JSON.stringify($scope.reportTemplate));
			$scope.showHome();
			if(Object.keys($scope.reportTemplate).length > 0){

			}
			updateProgressbar($scope.pageContent.jobinfo);
		}
		$scope.saveReport = function(){
			
			
			dataFactory.SavePOLineItem($scope.pageContent.jobinfo['polineitem'].arr)
			.success(function(data){
				if(!data.HasError){
					$scope.pageContent.jobinfo['polineitem'].status = true;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
					console.log("Successfully send polineitem ");
					//uodate progress bar
				}else{
					$scope.pageContent.jobinfo['polineitem'].status = false;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				}
			}).error(function(error){
				console.log("Dosnt send polineitem");
				$scope.pageContent.jobinfo['polineitem'].status = false;
				console.log($scope.pageContent.jobinfo['polineitem']);
				eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
			});
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
			if(url.indexOf('http')>-1)
				window.open(url,'_system','location=no');
			else{
				window.open("http://"+url,'_system','location=no');
			}
		}
		var totPic = 0;
		var imgList = [];
		
		$scope.loadPhoto = function(){
			navigator.camera.getPicture($scope.onSuccess, $scope.onFail, { quality: 50,
				destinationType: Camera.DestinationType.FILE_URI, sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM });
		}
		$scope.capturePhoto = function(){
			navigator.camera.getPicture($scope.onSuccess, $scope.onFail, { quality: 50,
			    destinationType: Camera.DestinationType.FILE_URI, saveToPhotoAlbum: true
			});
		//capturePhoto();
		}
		$scope.onSuccess = function(imageUrl) {
			//console.log('Successfully imageUrl '+imageUrl);
			eeDb.insertPhotoTbl($scope.pageContent.jobid,imageUrl)
			console.log(JSON.stringify($scope.pageContent.jobinfo['photo']));
			
			/*var div = $('<div class="img">');
			var img = $('<img>');
			//img.attr('src', 'data:image/jpeg;base64,'+imageUrl);
			img.attr('src',imageUrl);
			div.append(img);
			div.append('<div class="removeImg" onclick="removeImg(this)"></div>')
			$("#imageulr1").append(div);
				totPic++;*/
			
		}
		
			
		$scope.saveImages = function(){
			var imgList = $scope.pageContent.jobinfo['photo'].arr;
			console.log(JSON.stringify(imgList));
			//if(Object.keys(imgList).length>0){
				
				/*for(i in imgList){
					convertImgToBase64(imgList[i].imageUrl,function(base64Img){
						
						var temp = {jobId:$scope.pageContent.jobid,nameofPhoto:"Test",base64String:base64Img};
						dataFactory.SaveJobInspectionPhoto(temp)
							.success(function (data){
								if(!data.HasError){
									$scope.pageContent.jobinfo['photo'][imgList[i].id].status = true;
									eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
									console.log("Successfully send photocapture ");
									
									updateProgressbar($scope.pageContent.jobinfo)
								}else{
									$scope.pageContent.jobinfo['photo'][imgList[i].id].status = false;
									eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
									
								}
							})
							.error(function(error){
								console.log("img not sent");
							})
					} );					
				}*/
			//}

		}
		//saveApi(base64Img,imgList[i])
		/*function saveApi(base64Img,imgObj){
			var temp = {jobId:$scope.pageContent.jobid,nameofPhoto:"Test",base64String:base64Img};
			dataFactory.SaveJobInspectionPhoto(temp)
				.success(function (data){
					if(!data.HasError){
						$scope.pageContent.jobinfo['photo'][imgObj.id].status = true;
						eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
						console.log("Successfully send photocapture ");
						console.log(JSON.stringify($scope.pageContent.jobinfo['photo']));
						//uodate progress bar
					}else{
						$scope.pageContent.jobinfo['photo'][imgObj.id].status = false;
						eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
					}
				})
				.error(function(error){
					console.log("img not sent");
				})
		}*/
		$scope.onFail = function(message) {
			//showMessage(message,"Camera Failed")
			console.log(message);
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
				$scope.$parent.getAllDropdownList();
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
			scope.pageContent.page = 'signup'; 
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
		
		

		$scope.m_username = "bill.karovski";
		$scope.m_password ="123456";
		//if navigator.online take new password AND SAVE in localstorage
		/*
		localstorage.set('username',$scope.m_username);
		localstorage.set('pasword',$scope.m_password);
		*/
		$scope.$parent.loggedUser.username = $scope.m_username;
		$scope.$parent.loggedUser.password = $scope.m_password;
		//else take old username form localstorage
		/*
			$scope.$parent.loggedUser.username = $scope.m_username;
			$scope.$parent.loggedUser.password = $scope.m_password;
		*/

		$http.defaults.headers.common['User'] = $scope.m_username;  
		$http.defaults.headers.common['Password'] = $scope.m_password; 
		

		$scope.$parent.getAllDropdownList();
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
			$scope.pageContent.page = 'home';
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

				if(!data.HasError){	
					$scope.pageContent.jobsByDate =  data.Data.Results;
					//console.log(JSON.stringify($scope.pageContent.jobsByDate))
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
				$scope.pageContent.jobsByDate = localdata.jobsByDate;
				readyJobsData();
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
				    /*if(allTrue($scope.getdata)) {
					   $scope.pageContent.page = 'home';
					   $('#loadingDiv').hide();
					};*/
				}else if(data.HasError){	
					showMessage(data.Message);                	 
					$scope.user = '';
					$scope.pageContent.page = 'login';
					console.log(JSON.stringify(data));
					$('#loadingDiv').hide();
				}         

			}).
		error(function(error) {
	            //alert('Unable to signup,Try again')
	            showDefaultError();
	            $('#loadingDiv').hide();
	        });
	}
	$scope.GetAllProceduralDocuments = function(){
		dataFactory.getAllProceduralDocuments()
		.success(function (data) {

			if(!data.HasError){	
				$scope.pageContent.proceduralDocList =  data.Data.Results;
				console.log(JSON.stringify($scope.pageContent.proceduralDocList))
				setStorage('proceduralDocList', JSON.stringify($scope.pageContent.proceduralDocList));
				$scope.getdata.proceduralDocList = true;
			       $scope.$parent.showHome();
					//$scope.pageContent.page = 'home';
					$('#loadingDiv').hide();
				}else if(data.HasError){	
					showMessage(data.Message);                	 
					$scope.user = '';
					$scope.pageContent.page = 'login';
					console.log(JSON.stringify(data));
					$('#loadingDiv').hide();
				}         

			}).
		error(function(error) {
			showDefaultError();
			$('#loadingDiv').hide();
			$scope.$parent.showHome();

		});
	}
	
	$scope.decideGetJobMethod = function(){
		if(navigator.onLine){
			console.log("Device online")
			$scope.GetJobsByDate();
		}else{
			console.log("Device offline")
			if(getStorage('jobsByDate').length >0){
				$scope.pageContent.jobsByDate = JSON.parse();
				$scope.pageContent.noticeList = JSON.parse(getStorage('noticeList'));
				$scope.pageContent.proceduralDocList = JSON.parse(getStorage('proceduralDocList'));
				readyJobsData();
			}else{
				alert("Connect to internet.")
			}
			
			//$scope.GetJobFromLocalDb();
		}
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
			var tempObj = {JobId:$scope.pageContent.jobid,LoggedAt:new Date()};
			for(o in obj){
				tempObj[obj[o].attr] = obj[o].ans;
			}
			$scope.pageContent.jobinfo['riskhazard'] = obj;

			dataFactory.saveRiskHazard(tempObj)
			.success(function(data){
				if(!data.HasError){
					$scope.pageContent.jobinfo['riskhazard'].status = true;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
					console.log("Successfully send riskhazard ");
					updateProgressbar($scope.pageContent.jobinfo)
				}else{
					$scope.pageContent.jobinfo['riskhazard'].status = false;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				}
			}).error(function(error){
				console.log("Error sending riskhazard");
				$scope.pageContent.jobinfo['riskhazard'].status = false;
				eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
			});
		}
		$scope.saveAssesment = function(obj){
			var tempObj = {JobId:$scope.pageContent.jobid,LoggedAt:new Date()};
			for(o in obj){
				tempObj[obj[o].attr] = obj[o].ans;
			}
			$scope.pageContent.jobinfo['assesment'] = obj;
			dataFactory.saveAssesment(tempObj)
			.success(function(data){
				if(!data.HasError){
					$scope.pageContent.jobinfo['assesment'].status = true;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
					console.log("Successfully send assesment ");
					updateProgressbar($scope.pageContent.jobinfo)
				}else{
					$scope.pageContent.jobinfo['assesment'].status = false;
					eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
				}
			}).error(function(error){
				console.log("Error sending assesment");
				$scope.pageContent.jobinfo['assesment'].status = false;
				eeDb.updateJobDetail($scope.pageContent.jobid,$scope.pageContent.jobinfo);
			});
		}

	}]);
app.controller('1Ctrl',['$scope','$http','$window','$location',
	function($scope,$http,$window,$location) {
		
		$scope.pageContent ={}
		$scope.jobs = [];
		$scope.pageContent.jobid = localStorage.getItem("jobid");
		$scope.show_form = false;
		$scope.map = {
			center: {
				latitude: "23.780317",
				longitude: "90.406468"
			},
			zoom: 14
		};

		//api call
		//no data
		/*$scope.jobListByType = GetJobsByType('new' , $http);
		$scope.jobListByType = GetJobsByType('due', $http);
		$scope.jobListByType = GetJobsByType('report', $http);
		$scope.jobListByType = GetJobsByType('all', $http);
		$scope.GetJobyJobIdOrClaimNumber = GetJobyJobIdOrClaimNumber('10026258',$http);
		GetProceduralDocumentDetailsById(1,$http);*/
		
		//signup({"UserName":"shimul1","Password":"shimul1","Email":"shimul1@dcastalia.com"},$http);
		//changePassword('shimul1','shimul',$http)
		
		//GetJobDetailsByJobId(10026258,$http);
		//GetJobListByDateRange($http);
		
		/*$scope.GetAllProceduralDocuments = GetAllProceduralDocuments($http);
		$scope.GetNoticeList = GetNoticeList($http);*/



		/*var urlsegment = window.location.hash.split('/');
		if(urlsegment[urlsegment.length-1] == 'estimation' || urlsegment[urlsegment.length-1] =='photocapture'){
			$scope.pageContent.subpage = 'estimation';
		}else if(urlsegment[urlsegment.length-1] == 'insurer'){
			$scope.pageContent.subpage = 'insurer';
			$scope.pageContent.page_title ='Insurer Document';
		}else if(urlsegment[urlsegment.length-1] == 'sow'){
			$scope.pageContent.subpage = 'sow';
			$scope.pageContent.page_title ='SOW Document';
		}else if(urlsegment[urlsegment.length-1] == 'report_template'){
			$scope.pageContent.subpage = 'report_template';
			$scope.pageContent.page_title ='Report Template';
		}else if(urlsegment[urlsegment.length-1] == 'freetext_report'){
			$scope.pageContent.subpage = 'freetext_report';
			$scope.pageContent.page_title ='Freetext Report';

		}else if(urlsegment[urlsegment.length-1] == 'home'){
			$scope.pageContent.page = 'home';
			$scope.pageContent.page_title ='Home';
			//initializeMap();
		}else if(urlsegment[urlsegment.length-1] == 'assessment'){
			$scope.pageContent.page = 'assessment';
			$scope.pageContent.page_title ='Assessment';
			$('.riskhazard').animate({scrollTop:$('#assessmentDiv').offset().top-162},10);
		}*/
		
		$scope.changepass = function(){
			html = ''
			html += '<div class="popup_content">'
			html += '	<div class="popup">'
			html += '	<div class="header">Change password</div>'
			html += '<div class="inner_cont">'
			html += '	<span>Old password:</span><span> <input type="password" ></span>'
			html += '	<span>New password:</span><span> <input type="password" ></span>'
			html += '	<span>Confirm new password:</span><span> <input type="password" ></span>'
			html += '</div>'
			html += '	</div>'
			html += '<div>'
			$('body').append(html)
			$('.popup_content').on('click',function(){
				this.remove();
			})
		}

		
		
		$scope.showModal =  false;
		$scope.showMapModal = function(){
			//$('#mapModal').modal();
			$scope.showModal =  true
		}

		$scope.open_remotefile = function(url){
			window.open(url,'_system','location=no')
		}
		totPic = 0;
		
		$scope.loadPhoto = function(){
			navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
				destinationType: Camera.DestinationType.FILE_URI, sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM });
		}
		$scope.capturePhoto = function(){
			/*navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
			    destinationType: Camera.DestinationType.FILE_URI, saveToPhotoAlbum: true
			});*/
		capturePhoto();
		}


		$scope.onFail = function(message) {
			console.log('Failed because: ' + message);
		}


		$('#myModal').modal('hide');   		
		set_content_height();      
		setTimeout(function(){
			var progressbarwidth = $('.progressbar').width() -158-40;
			$('.progresss_right div').css('width',progressbarwidth/8); 
			$('.progressbar').css('opacity','1');  

		},300)


}])
//$.grep = function (a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d} 
function set_content_height(){
	console.log("called");
	//setTimeout(function(){
		var header_height=parseInt($('.header').css('height'));
		var footer_height=parseInt($('.bottom_bar').css('height'));
		var window_height=window.innerHeight;
		$('.content_box').css('height',window_height-header_height-footer_height-1);
		//},200)

}
$( window ).resize(function(){
	set_content_height();
})