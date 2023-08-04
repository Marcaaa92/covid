<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once("dbconn.php");
        $url="https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/anagrafica-vaccini-summary-latest.json";
		$json_data = file_get_contents($url);
		$response_data = json_decode($json_data);
        $dose1=0; $dose2=0;$consegnati=0; $data=date('Y-m-d');;
        for($i=0; $i<=8; $i++){
        	$dose1+=$response_data->data[$i]->prima_dose;
            $dose2+=$response_data->data[$i]->seconda_dose;
        }
        $url="https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/vaccini-summary-latest.json";
    	$json_data = file_get_contents($url);
		$response_data = json_decode($json_data);
       for($i=0; $i<=20; $i++){
        	$consegnati+=$response_data->data[$i]->dosi_consegnate;
        }
         try {
            $stmt = $db->prepare("INSERT INTO dayly_vaccines(day,dose1, dose2, consegnati) VALUES (?,?,?,?)");
			$stmt->execute([$data,$dose1, $dose2, $consegnati]) or die ("errore");
		} catch (PDOException $e) {
			echo "Errore: " . $e->getMessage();
			die();
		}
?>