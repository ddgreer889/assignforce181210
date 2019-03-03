({
	select : function(component, event, helper) {
		var selectedEvt = $A.get('e.c:afBatchesByTrainerEvent');
        var trainerId = component.get('v.trainerId');
        console.log(trainerId);
        
        selectedEvt.setParams({'trainerId':trainerId});
        selectedEvt.fire();		
	}
})