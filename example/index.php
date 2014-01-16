<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title><?=isset($title) ? $title : "Blocks14"?></title>
		<link rel="stylesheet/less" type="text/css" href="style.css">
	</head>
	<body>
		<div id="flash">
			<h1>Blocks 14 - A jQuery Plugin</h1>
			<p>A jQuery plugin for a BreakOut-look-a-like game.</p>
			<hr>
			<canvas id="gameboard" width="800" height="300"></canvas>
		</div>
		<script src="js/jquery/jquery.js"></script>
		<script src="js/blocks14.js"></script>
		<script src="js/main.js"></script>
	</body>
</html>