({
    getNames : function(component, event)
    {
        var action = component.get("c.getTrainers");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === 'SUCCESS')
            {
                var trainerNames = response.getReturnValue();              
                this.fireEvent(component, event, trainerNames);
            }
            else if(state === 'ERROR')
            {
                alert('Name Callback has failed!');
            }
        });
        $A.enqueueAction(action);
    },
    
    fireEvent : function(component, event, trainerNames)
    {
        var createJSON = component.getEvent("CreateJSON");
        var newJSONstring = trainerNames.toString();
        var newArray = newJSONstring.split(",");
        component.set("v.trainers", newArray);
        createJSON.setParam(
            "yAxisNames" , component.get("v.trainers")
        );
        console.log('event params fireEvent ' + createJSON.getParam('yAxisNames'));
        createJSON.fire();
    },
    createChart : function(component, event, names) {
        var jsonData = component.get("v.data");
        var seriesObj = [];
        console.log('dataHelper: ' + jsonData);
        var dataObj = JSON.parse(jsonData);
        if(names == null){
            var trainers = event.getParam("yAxisNames");
        }
        else{
            var trainers = names;
        }
        console.log('trainers: ' + trainers);
        var trainerAssignment = [];
        
        var seriesNames = [];
        var seriesData = [];
        var freeTimeData = [];
        for(var i = 0; i < dataObj.length; i++)
        {
            var year = dataObj[i].x.substring(0,4);
            var month = dataObj[i].x.substring(5,7) - 1;
            var day = dataObj[i].x.substring(8);
            dataObj[i].x = Date.UTC(year,month,day);
            var year2 = dataObj[i].x2.substring(0,4);
            var month2 = dataObj[i].x2.substring(5,7) - 1;
            var day2 = dataObj[i].x2.substring(8);
            dataObj[i].x2 = Date.UTC(year2,month2,day2);
            var seriesName = dataObj[i].series;
            delete dataObj[i].series;
            if(seriesNames.includes(seriesName))
            {
                for(var c = 0; c < seriesObj.length; c++)
                {
                    if(seriesObj[c].name == seriesName)
                    {
                        console.log('Test code #1');
                        seriesObj[c].data.push ({'x' : dataObj[i].x, 'x2' : dataObj[i].x2, 'y' : dataObj[i].y});
                        console.log('seriesObj[c]: ' + JSON.stringify(seriesObj[c]));
                    }
                }
            }
            else
            {
                seriesNames.push(seriesName);
                seriesData.push(dataObj[i]);
                console.log('dataObj: ' + dataObj[i]);
                seriesObj.push({'name' : seriesName, 'data' : [{'x' : dataObj[i].x, 'x2' : dataObj[i].x2, 'y' : dataObj[i].y}], 'dataLabels': {
                    enabled: true,
                    formatter: function(){
                        return Math.ceil((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000)) + " weeks";
                    }
                }
                               });
            }//end of Else
            
            
        }
        for(var i = 0; i < dataObj.length; i++)
        {
            for(var j = i + 1; j < dataObj.length; j++)
            {
                if(dataObj[j].x > dataObj[i].x2 && dataObj[j].y == dataObj[i].y)
                  {
                      freeTimeData.push({'x' : dataObj[i].x2, 'x2' : dataObj[j].x, 'y' : dataObj[i].y});
                  }
            }
        }
        seriesObj.push({'name' : 'Free Time', 'data' : freeTimeData,'dataLabels' : {
        enabled : true,
                       formatter: function(){
            return Math.ceil((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000)) + " weeks";
        }
        }
                       });
        var colorTheme = new Highcharts.setOptions({colors : ['#F26925', '#474C55', '#72A4C2', '#FCB414', '#B9B9BA']});
        
        var charts = new Highcharts.chart({
            chart: {
                renderTo: component.find("container").getElement(),
                type: 'xrange'
            },
            title: {
                text : component.get('v.chartTitle'),
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                
                title: {
                    text: ''
                    
                },
                categories: trainers,
                reversed : true,
                
            },
            series: 
            seriesObj            
        });
    },
})