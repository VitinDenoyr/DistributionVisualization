<?php
	require_once 'config.php';
	
	function buildValidRequest($data){
		global $connection;

		# Simula uma consulta SQL
		/*
		$sql = "SELECT COUNT(*) FROM dummybase";
		$result = $connection->query($sql);
		*/

		# Lê linhas da consulta e converte em JSON
		/*
		$rows = [];
		if ($result->num_rows >= 0) {
			# $rows[] -> Adiciona no array rows o objeto obtido na próxima linha da consulta
			while ($row = $result->fetch_assoc()) {
				$rows[] = $row;
			}
			$json_result = json_encode($rows);
		}
		*/

		return json_encode([["status" => "VALID"]]);
	}