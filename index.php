<?php 
require_once('nucommon.php'); ?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>

<head>
<meta http-equiv='Content-type' content='text/html;charset=UTF-8'>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>

<script>


<?php

	$opener	= $_GET['opener'];
	$target	= $_GET['target'];
	$type	= $_GET['type'];
	
	if($type == 'lookup'){
		
		$h	= "
		
		function nuLoad(){

			window.nuTYPE		= '$type';
			window.nuTARGET	= '$target';
			window.nuSESSION	= parent.nuSESSION;
			var p			= parent.nuOPENER[$opener];

			nuGetForm(p.form_id, p.record_id);

		}
		
		";
		print $h;

	}

	if($type == ''){
		
		print "
		
		function nuLoad(){

			nuLogin();
		
		}
		
		";
		
	}
?>

</script>

<?php
cssinclude('nubuilder4.css');
jsinclude('nuform.js');
jsinclude('nucommon.js');
nudebug("$opener	$target	$type");
	
?>

</head>

<body onload="nuLoad()" >

</body>

</html>
