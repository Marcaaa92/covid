<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once("dbconn.php");
        $stmt = $db->prepare("SELECT * FROM dayly_vaccines ORDER BY dose1 DESC LIMIT 2");
		$stmt->execute([]);
        $response = array(
            "firstDose" => 0,
            "secondDose" => 0,
            "delivered" => 0,
            "firstDoseLast" => 0,
            "secondDoseLast" => 0,
            "deliveredLast" => 0,
        );
        $i=0;
        foreach($stmt as $row){
        if($i==1){
        $response["firstDose"]-=$row["dose1"];
        $response["secondDose"]-=$row["dose2"];
        $response["delivered"]-=$row["consegnati"];
        }
        else{
      	 $response["firstDose"]=$row["dose1"];
         $response["secondDose"]=$row["dose2"];
         $response["delivered"]=$row["consegnati"];
         $response["firstDoseLast"]=$row["dose1"];
       	 $response["secondDoseLast"]=$row["dose2"];
      	  $response["deliveredLast"]=$row["consegnati"];
        }
        $i++;
        }
        echo json_encode($response);
?>