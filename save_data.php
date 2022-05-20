<?php
  if (isset($_POST["data"])) {
    $data = $_POST["data"];
    file_put_contents("data.csv", "\n".$data, FILE_APPEND);
  }
?>