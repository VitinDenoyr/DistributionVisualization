<?php
	# Requisições Get
	if ($_SERVER['REQUEST_METHOD'] === 'GET'){
		$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
		if ($path === '/') { # || $path === '/dummypath'
			require_once 'main.php';
		}

	# Requisições Post
	} else if($_SERVER['REQUEST_METHOD'] === 'POST'){

		# Definir API como pública e que retorna um Json
		header("Access-Control-Allow-Origin: *");
		header("Content-Type: application/json");

		# Importações necessárias
        require_once 'functions.php';

		# Controle de Requisição
		# issset($_POST('x')) -> Verifica se o campo 'x' existe
		# echo -> Retorna um json de resposta à requisição

		if(isset($_POST['data'])){
			$tipo = $_POST['data'];

			if ($tipo === 'dado') {
				echo json_encode(["status" => "VALID"]);
				# echo buildValidRequest($tipo)
			} else {
				http_response_code(400);
				echo json_encode(["status" => "BAD REQUEST"]);
			}
		} else {
		    echo json_encode(["status" => "EMPTY"]);
		}
	}
