<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
        require_once("dbconn.php");
        $stmt = $db->prepare("SELECT * FROM dayly_vaccines ORDER BY dose1");
		$stmt->execute([]);
        $response=array();
        $responseRow = array(
        	"day" => "",
            "firstDose" => 0,
            "secondDose" => 0,
            "delivered" => 0,
        );
        foreach($stmt as $row){
         $responseRow["day"]=$row["day"];
      	 $responseRow["firstDose"]=$row["dose1"];
         $responseRow["secondDose"]=$row["dose2"];
         $responseRow["delivered"]=$row["consegnati"];
         array_push($response,$responseRow);
        $i++;
        }
        echo json_encode($response);
?>