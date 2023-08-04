function separator(importoNumerico){

        var importo = importoNumerico.toString();
        importo = importo.replace(".", ",");
        if(importo.length == 6){
            importo = importo.split('',importo.length).reverse().join('').replace(/([0-9]{3})/g, '$1.');
            importo = importo.split('', importo.length).reverse().join('');
            importo = importo.replace(/^\./, "");
        }
        else{
            if(importo.length > 4){
                importo = importo.split('',importo.length).reverse().join('').replace(/([0-9]{3})/g, '$1.');
                importo = importo.split('', importo.length).reverse().join('');
            }
        }
        return importo;

}
function getDateUpdate(date){
          var dateobj = new Date(date);
          var month = dateobj.getMonth()+1;
 		      var day = dateobj.getDate();
    	    var year = dateobj.getFullYear();
          var hour=dateobj.getHours();
          var minute=dateobj.getMinutes();
          var dateReturn;
          if(minute==0)
            dateReturn="Il giorno "+day+"/"+month+"/"+year+ " alle "+hour+":"+minute+0;
          else
            dateReturn="Il giorno "+day+"/"+month+"/"+year+ " alle "+hour+":"+minute;
          return dateReturn
}
function graphSetting(tittle){
  var title=tittle;
  var options = {
              title: title,
              titleTextStyle: {
                  color: '#ffffff'
              },
              curveType: 'function',
              legend: {
                position: 'bottom',
                textStyle:{
                  color: '#FFF'
                },
              },
              backgroundColor: '#161716',
    			    hAxis: {
                textStyle: {
                  color: '#FFF'
                },
              },
              vAxis: {
                textStyle:{
                  color: '#FFF'
                },
              },
              chartArea: {
                width: '80%',
              },
            };
  return options;
}
function graphSettingBar(tittle){
  var title=tittle;
  var options = {
      title: title,
      colors: ['#f400a1'],
      curveType: 'function',
      legend: {
        position: 'bottom',
        textStyle:{
          color: '#FFF'
        },
      },
      backgroundColor: '#161716',
      hAxis: {
        textStyle: {
          color: '#FFF',
        },
      },
      vAxis: {
        textStyle:{
          color: '#FFF'
        },
      },
      chartArea: {
        backgroundColor: '#161716',
        width: '75%',
      },
  };
  return options;
}
function getCases(){
    return fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json')
    .then(function(response){
        return response.json();
    });
}
function getVaccines(){
    return fetch('https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/anagrafica-vaccini-summary-latest.json')
    .then(function(response){
        return response.json();
    });
}
function getVaccinesRegion(){
    return fetch('https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/vaccini-summary-latest.json')
    .then(function(response){
        return response.json();
    });
}
function getVaccinesLastUpdate(){
    return fetch('https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/last-update-dataset.json')
    .then(function(response){
        return response.json();
    });
}
function getCasesRegion(){
    return fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni-latest.json')
    .then(function(response){
    return response.json();
    });
  }
function getvaccinesVariation(){
      return fetch('https://servermarca.altervista.org/covid/vaccinesLastDeliver.php')
      .then(function(response){
      return response.json();
    });
}
function getVaccinesTrend(){
      return fetch('https://servermarca.altervista.org/covid/vaccinesTrend.php')
      .then(function(response){
      return response.json();
    });
}
function getVaccinesDelivery(){
      return fetch('https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/consegne-vaccini-latest.json')
      .then(function(response){
      return response.json();
    });
}
main();
async function main(){
  //initialize variable
  var cases = await getCases();
  var vaccines = await getVaccines();
  var vaccinesRegion = await getVaccinesRegion();
  var casesRegion = await getCasesRegion();
  var vaccinesLastUpdate = await getVaccinesLastUpdate();
  var vaccinesVariation = await getvaccinesVariation();
  var vaccinesTrend = await getVaccinesTrend();
  var vaccinesDelivery = await getVaccinesDelivery();
  //setting sessionStorage for use region data
  sessionStorage.setItem('vaccinesRegion',  JSON.stringify(vaccinesRegion));
  sessionStorage.setItem('casesRegion',  JSON.stringify(casesRegion));
  //load chart
  google.charts.load('current', {'packages':['corechart','bar']});
  google.charts.setOnLoadCallback(drawChartCasesTrend);
  google.charts.setOnLoadCallback(drawChartVariationCasesTrend);
  google.charts.setOnLoadCallback(drawChartTamponsTrend);
  google.charts.setOnLoadCallback(drawChartHospitalTrend);
  google.charts.setOnLoadCallback(drawChartVaccinesTrend);
  google.charts.setOnLoadCallback(drawChartVaccinesAge);
  google.charts.setOnLoadCallback(drawChartVaccinesTrendDayly);
  google.charts.setOnLoadCallback(drawChartVaccinesCompany);

  //load the various part of site
  overall_data();
  region_table_registry_vaccines();
  update();
  //load left part of site
  async function overall_data() {
    //initialize variable
    var totalCases=0, totalCasesVariation=0, totalActive=0,totalActiveVariation=0, totalHealed=0, totalHealedVariation=0, totalDeath=0, totalDeathVariation=0, totalTampons=0, totalTamponsVariation=0, tamponsVariationPercent;
    var totalDosesAdministered=0,totalDosesVariation=0,totalDosesVariationLast=0,totalDosesAdministeredOnDeliveredPercent=0, totalDosesDelivered=0,totalDosesDeliveredVariation=0,totalDosesDeliveredVariationLast=0,firstDosesAdministered=0,firstDosesVariation=0,firstDosesVariationLast=0, secondDosesAdministered=0, secondDosesVariation=0,secondDosesVariationLast=0, firstDosesAdministeredPercent=0,secondDosesAdministeredPercent=0,femaleDosesAdministered=0,maleDosesAdministered=0,operatorDosesAdministered=0,nonOperatorDosesAdministered=0,guestDosesAdministered=0, schoolMemberDosesAdministered=0, militaryDosesAdministered=0;
    //storing value in variable for cases
    totalCases=cases[cases.length -1].totale_casi;
    totalCasesVariation=cases[cases.length -1].nuovi_positivi;
    totalActive=cases[cases.length -1].totale_positivi;
    totalActiveVariation=cases[cases.length -1].variazione_totale_positivi;
    totalHealed=cases[cases.length -1].dimessi_guariti;
    totalHealedVariation=cases[cases.length -1].dimessi_guariti-cases[cases.length -2].dimessi_guariti;
    totalDeath=cases[cases.length -1].deceduti;
    totalDeathVariation=cases[cases.length -1].deceduti-cases[cases.length -2].deceduti;
    totalTampons=cases[cases.length -1].tamponi;
    totalTamponsVariation=cases[cases.length -1].tamponi-cases[cases.length -2].tamponi;
    tamponsVariationPercent=((cases[cases.length -1].nuovi_positivi/(cases[cases.length -1].tamponi-cases[cases.length -2].tamponi)*100)).toFixed(2)+"%";
    //storing value in variable for vaccine
    for(let i=0; i<=20; i++){
      totalDosesDelivered+=vaccinesRegion.data[i].dosi_consegnate;
    }
    for (let i = 0; i <= 8; i++){
      totalDosesAdministered +=vaccines.data[i].totale;
      femaleDosesAdministered += vaccines.data[i].sesso_femminile;
      maleDosesAdministered += vaccines.data[i].sesso_maschile;
      firstDosesAdministered += vaccines.data[i].prima_dose;
      secondDosesAdministered += vaccines.data[i].seconda_dose;
      operatorDosesAdministered += vaccines.data[i].categoria_operatori_sanitari_sociosanitari;
      nonOperatorDosesAdministered += vaccines.data[i].categoria_personale_non_sanitario;
      guestDosesAdministered += vaccines.data[i].categoria_ospiti_rsa;
	  schoolMemberDosesAdministered +=vaccines.data[i].categoria_personale_scolastico;
	  militaryDosesAdministered += vaccines.data[i].categoria_forze_armate;
    }
    firstDosesAdministeredPercent=((firstDosesAdministered/60360000)*100).toFixed(2);
    secondDosesAdministeredPercent=((secondDosesAdministered/60360000)*100).toFixed(2);
    totalDosesAdministeredOnDeliveredPercent=((totalDosesAdministered/totalDosesDelivered)*100).toFixed(2);
    firstDosesVariation=vaccinesVariation.firstDose;
    secondDosesVariation=vaccinesVariation.secondDose;
    firstDosesVariationLast=firstDosesAdministered-vaccinesVariation.firstDoseLast;
    secondDosesVariationLast=secondDosesAdministered-vaccinesVariation.secondDoseLast;
    totalDosesVariation=firstDosesVariation+secondDosesVariation;
    totalDosesDeliveredVariation=vaccinesVariation.delivered;
    totalDosesVariationLast=firstDosesVariationLast+secondDosesVariationLast;
    totalDosesDeliveredVariation=totalDosesDelivered-vaccinesVariation.deliveredLast;
  //cases
    document.getElementById('total-cases').innerHTML=separator(totalCases);
    document.getElementById('total-cases-variation').innerHTML=separator(totalCasesVariation);
  //cases-active
    document.getElementById('total-active').innerHTML=separator(totalActive);
    document.getElementById('total-active-variation').innerHTML=separator(totalActiveVariation);
  //healed
    document.getElementById('total-healed').innerHTML=separator(totalHealed);
    document.getElementById('total-healed-variation').innerHTML=separator(totalHealedVariation);
  //death
    document.getElementById('total-death').innerHTML=separator(totalDeath);
    document.getElementById('total-death-variation').innerHTML=separator(totalDeathVariation);
  //tampons
    document.getElementById('total-tampons').innerHTML=separator(totalTampons);
    document.getElementById('total-tampons-variation').innerHTML=separator(totalTamponsVariation);
    document.getElementById('tampons-variation-percent').innerHTML=separator(tamponsVariationPercent);
  //vaccinesRegion
    document.getElementById('total-doses-administered').innerHTML=separator(totalDosesAdministered);
    document.getElementById('total-doses-delivered').innerHTML=separator(totalDosesDelivered);
    document.getElementById('total-doses-administered-variation').innerHTML=separator(totalDosesVariation);
    document.getElementById('total-doses-delivered-variation').innerHTML=separator(totalDosesDeliveredVariation);
    document.getElementById('total-doses-administered-variation-last').innerHTML=separator(totalDosesVariationLast);
    document.getElementById('total-doses-delivered-variation-last').innerHTML=separator(totalDosesDeliveredVariationLast);
    document.getElementById('total-doses-administered-percent').innerHTML=separator(totalDosesAdministeredOnDeliveredPercent+"%");
    document.getElementById('first-doses-administered').innerHTML=separator(firstDosesAdministered);
    document.getElementById('second-doses-administered').innerHTML=separator(secondDosesAdministered);
    document.getElementById('first-doses-administered-variation').innerHTML=separator(firstDosesVariation);
    document.getElementById('second-doses-administered-variation').innerHTML=separator(secondDosesVariation);
    document.getElementById('first-doses-administered-variation-last').innerHTML=separator(firstDosesVariationLast);
    document.getElementById('second-doses-administered-variation-last').innerHTML=separator(secondDosesVariationLast);
    document.getElementById('female-doses-administered').innerHTML=separator(femaleDosesAdministered);
    document.getElementById('male-doses-administered').innerHTML=separator(maleDosesAdministered);
    document.getElementById('first-doses-administered-percent').innerHTML=separator(firstDosesAdministeredPercent+"%");
    document.getElementById('second-doses-administered-percent').innerHTML=separator(secondDosesAdministeredPercent+"%");
    document.getElementById('operator-doses-administered').innerHTML=separator(operatorDosesAdministered);
    document.getElementById('non-operator-doses-administered').innerHTML=separator(nonOperatorDosesAdministered);
    document.getElementById('guest-doses-administered').innerHTML=separator(guestDosesAdministered);
	document.getElementById('school-member-doses-administered').innerHTML=separator(schoolMemberDosesAdministered);
	document.getElementById('military-doses-administered').innerHTML=separator(militaryDosesAdministered);
  }


    //load center part of site
  async function region_table_registry_vaccines() {
    //initialize variable
    var totalDoseAdministered=0;
    //start scrolling regions to compile table
    for(var i=0; i<=20;i++){
    //set number of case and vaccines
      document.getElementById('v'+i).innerHTML=separator(vaccinesRegion.data[i].dosi_somministrate);
      document.getElementById('vp'+i).innerHTML=separator(vaccinesRegion.data[i].percentuale_somministrazione)+"%";
      document.getElementById('c'+i).innerHTML=separator(casesRegion[i].totale_casi);
      //color background number of cases
      if(casesRegion[i].totale_casi<=449){
      document.getElementById('c'+i).style.background="#FFEDA0";
      }
      else if(casesRegion[i].totale_casi>449&&casesRegion[i].totale_casi<=999)
      {
      document.getElementById('c'+i).style.background="#FED976";
      }
      else if(casesRegion[i].totale_casi>1000&&casesRegion[i].totale_casi<=2999)
      {
      document.getElementById('c'+i).style.background="#FEB24C";
      }
      else if(casesRegion[i].totale_casi>3000&&casesRegion[i].totale_casi<=6999)
      {
      document.getElementById('c'+i).style.background="#FD8D3C";
      }
      else if(casesRegion[i].totale_casi>7000&&casesRegion[i].totale_casi<=11999)
      {
      document.getElementById('c'+i).style.background="#FC4E2A";
      }
      else if(casesRegion[i].totale_casi>12000&&casesRegion[i].totale_casi<=29999)
      {
      document.getElementById('c'+i).style.background="#E31A1C";
      }
      else if(casesRegion[i].totale_casi>30000&&casesRegion[i].totale_casi<=69999)
      {
      document.getElementById('c'+i).style.background="#BD0026";
      }
      else if(casesRegion[i].totale_casi>70000){
      document.getElementById('c'+i).style.background="#730022";
      }
    }
  }


//load update and credit data
  async function update(){
    var outputCasesLastUpdate, outputVaccinesLastUpdate;
    outputCasesLastUpdate=getDateUpdate(cases[cases.length-1].data);
    outputVaccinesLastUpdate=getDateUpdate(vaccinesLastUpdate.ultimo_aggiornamento);
    document.getElementById('last-update-cases').innerHTML+=outputCasesLastUpdate;
    document.getElementById('last-update-vaccines').innerHTML+=outputVaccinesLastUpdate;
  }


  //draw graph cases trend
  async function drawChartCasesTrend(){
    var data=[];
    var Header= ['Data', 'Totale Casi', "Guariti","Deceduti"];
    data.push(Header);
      for (var i = 0; i < cases.length; i++) {
        var temp=[];
        temp.push((cases[i].data).substring(0,(cases[i].data).length-9));
        temp.push(cases[i].totale_casi);
        temp.push(cases[i].dimessi_guariti);
        temp.push(cases[i].deceduti);
        data.push(temp);
      }
    var options=graphSetting("Andamento casi");
    var chartdata = new google.visualization.arrayToDataTable(data);
    var chart = new google.visualization.LineChart(document.getElementById('chart-cases-trend'));
    chart.draw(chartdata, options);
  }


  //draw graph variation cases trend
  async function drawChartVariationCasesTrend(){
    var data=[];
    var Header= ['Data', 'Nuovi Casi', "Variazione(nuovi-guariti-deceduti)"];
    data.push(Header);
      for (var i = 0; i < cases.length; i++) {
        var temp=[];
        temp.push((cases[i].data).substring(0,(cases[i].data).length-9));
        temp.push(cases[i].nuovi_positivi);
        temp.push(cases[i].variazione_totale_positivi);
        data.push(temp);
      }
    var options=graphSetting("Variazione casi");
    var chartdata = new google.visualization.arrayToDataTable(data);
    var chart = new google.visualization.LineChart(document.getElementById('chart-variation-cases-trend'));
    chart.draw(chartdata, options);
  }


  //draw graph tampons trend
  async function drawChartTamponsTrend(){
    var data=[];
    var Header= ['Data', 'Percentuale tamponi positivi'];
    data.push(Header);
    for (var i = 1; i < cases.length; i++) {
      var temp=[];
      temp.push((cases[i].data).substring(0,(cases[i].data).length-9));
    	temp.push((cases[i].nuovi_positivi/(cases[i].tamponi-cases[i-1].tamponi))*100);
      data.push(temp);
    }
    var options=graphSetting("Andamento tamponi");
    var chartdata = new google.visualization.arrayToDataTable(data);
    var chart = new google.visualization.LineChart(document.getElementById('chart-tampons-trend'));
    chart.draw(chartdata, options);
  }


  //draw graph hospital trend
  async function drawChartHospitalTrend(){
    var data=[];
    var Header= ['Data', 'Ricoverati', "Terapia Intensiva","Isolamento"];
    data.push(Header);
    for (var i = 0; i < cases.length; i++) {
      var temp=[];
      temp.push((cases[i].data).substring(0,(cases[i].data).length-9));
      temp.push(cases[i].ricoverati_con_sintomi);
      temp.push(cases[i].terapia_intensiva);
      temp.push(cases[i].isolamento_domiciliare);
      data.push(temp);
    }
    var options=graphSetting("Andamento ospedalizzazioni");
    var chartdata = new google.visualization.arrayToDataTable(data);
    var chart = new google.visualization.LineChart(document.getElementById('chart-hospital-trend'));
    chart.draw(chartdata, options);
  }


  //draw graph vaccines trend
  async function drawChartVaccinesTrend(){
    var data=[];
    var Header= ['Data', 'Dose 1', "Dose 2","Dosi totali somministrate","Dosi consegnate"];
    data.push(Header);
    for (var i = 0; i < vaccinesTrend.length; i++) {
      var temp=[];
      var totalDosesAdministered=parseInt(vaccinesTrend[i].secondDose)+parseInt(vaccinesTrend[i].firstDose);
      temp.push(vaccinesTrend[i].day);
      temp.push(parseInt(vaccinesTrend[i].firstDose));
      temp.push(parseInt(vaccinesTrend[i].secondDose));
      temp.push(parseInt(totalDosesAdministered));
      temp.push(parseInt(vaccinesTrend[i].delivered));
      data.push(temp);
    }
    var options=graphSetting("Andamento vaccinazioni");
    var chartdata = new google.visualization.arrayToDataTable(data);
    var chart = new google.visualization.LineChart(document.getElementById('vaccines-trend'));
    chart.draw(chartdata, options);
  }
  async function drawChartVaccinesTrendDayly(){
    var data=[];
    var Header= ['Data', 'Dose 1', "Dose 2"];
    data.push(Header);
    for (var i = 1; i < vaccinesTrend.length; i++) {
      var temp=[];
      temp.push(vaccinesTrend[i].day);
      temp.push(parseInt(vaccinesTrend[i].firstDose-vaccinesTrend[i-1].firstDose));
      temp.push(parseInt(vaccinesTrend[i].secondDose-vaccinesTrend[i-1].secondDose));
      data.push(temp);
    }
    var options=graphSetting("Andamento vaccinazioni");
    var chartdata = new google.visualization.arrayToDataTable(data);
    var chart = new google.visualization.LineChart(document.getElementById('vaccines-trend-dayly'));
    chart.draw(chartdata, options);
  }

  //draw graph vaccine by age
  async function drawChartVaccinesAge(){
    var data=[];
    var Header= ['Eta', 'Persone vaccinate'];
    data.push(Header);
    for (var i = 0; i < vaccines.data.length; i++) {
      var temp=[];
        temp.push(vaccines.data[i].fascia_anagrafica);
        temp.push(parseInt(vaccines.data[i].totale));
      data.push(temp);
    }
    var options=graphSettingBar("Vaccinazioni per eta");
    var chartdata = new google.visualization.arrayToDataTable(data);
    var chart = new google.charts.Bar(document.getElementById('vaccines-for-age'));
    chart.draw(chartdata, google.charts.Bar.convertOptions(options));
  }
//draw graph vaccine by company
  async function drawChartVaccinesCompany(){
    var data=[];
    var Header= ['Dosi', 'Azienda'];
    data.push(Header);
	var pfizer=0, astrazeneca=0, moderna=0;
    for (var i = 0; i < vaccinesDelivery.data.length; i++) {
		if(vaccinesDelivery.data[i].fornitore=="Pfizer/BioNTech"){
			pfizer+=vaccinesDelivery.data[i].numero_dosi;
		}
		else if(vaccinesDelivery.data[i].fornitore=="Vaxzevria (AstraZeneca)"){
			astrazeneca+=vaccinesDelivery.data[i].numero_dosi;
		}
		else if(vaccinesDelivery.data[i].fornitore=="Moderna"){
			moderna+=vaccinesDelivery.data[i].numero_dosi;
		}
    }

    var options=graphSettingBar("Dosi per azienda");
    var chartdata = google.visualization.arrayToDataTable([
         ['Azienda', 'Dosi'],
         ['Pfizer/BioNTech', pfizer],
		 ['Vaxzevria (AstraZeneca)', astrazeneca],
		 ['Moderna', moderna],
      ]);
    var chart = new google.charts.Bar(document.getElementById('vaccines-for-company'));
    chart.draw(chartdata, google.charts.Bar.convertOptions(options));
  }
}

//on click data of region
async function onClickRegionData(region){
  //requesting data from sessionStorage for use it
  var vaccinesRegion=JSON.parse(sessionStorage.getItem('vaccinesRegion'));
  var casesRegion=JSON.parse(sessionStorage.getItem('casesRegion'));
  //initialize variable
  var regionName, regionHospitalized, regionIntensiveCare, regionQuarantine, regionPositive, regionNewPositive, regionHealed, regionDeath, regionTotalCases, regionTotalTampons, regionTotalDosesDelivered, regionTotalDosesAdministered, regionTotalDosesUsedPercent;
  //set variable from json request
  regionName=casesRegion[region].denominazione_regione;
  regionHospitalized=separator(casesRegion[region].ricoverati_con_sintomi);
  regionIntensiveCare=separator(casesRegion[region].terapia_intensiva);
  regionQuarantine=separator(casesRegion[region].isolamento_domiciliare);
  regionPositive=separator(casesRegion[region].totale_positivi);
  regionNewPositive=separator(casesRegion[region].nuovi_positivi);
  regionHealed=separator(casesRegion[region].dimessi_guariti);
  regionDeath=separator(casesRegion[region].deceduti);
  regionTotalCases=separator(casesRegion[region].totale_casi);
  regionTotalTampons=separator(casesRegion[region].tamponi);
  regionTotalDosesDelivered=separator(vaccinesRegion.data[region].dosi_consegnate);
  regionTotalDosesAdministered=separator(vaccinesRegion.data[region].dosi_somministrate);
  regionTotalDosesUsedPercent=separator(vaccinesRegion.data[region].percentuale_somministrazione)+"%";
  //print data
  document.getElementById('region-name').innerHTML=regionName;
  document.getElementById('region-hospitalized').innerHTML=regionHospitalized;
  document.getElementById('region-intensive-care').innerHTML=regionIntensiveCare
  document.getElementById('region-quarantine').innerHTML=regionQuarantine
  document.getElementById('region-positive').innerHTML=regionPositive
  document.getElementById('region-new-positive').innerHTML=regionNewPositive
  document.getElementById('region-healed').innerHTML=regionHealed
  document.getElementById('region-death').innerHTML=regionDeath
  document.getElementById('region-total-cases').innerHTML=regionTotalCases
  document.getElementById('region-total-tampons').innerHTML=regionTotalTampons
  document.getElementById('region-total-doses-delivered').innerHTML=regionTotalDosesDelivered
  document.getElementById('region-total-doses-administered').innerHTML=regionTotalDosesAdministered
  document.getElementById('region-total-doses-used').innerHTML=regionTotalDosesUsedPercent;
}
