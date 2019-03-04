public class afPTODataTablesApexController {
 @auraEnabled
    public static List<PTO__c> getTrainingPTOById(Id userId){
        system.debug(userId);
        List<PTO__c> trainerPTO = 
            database.query('SELECT StartDate__c , EndDate__c, Reason__c, Status__c FROM PTO__c  ORDER BY StartDate__c');
        system.debug(trainerPTO);
         return trainerPTO;
    }
}