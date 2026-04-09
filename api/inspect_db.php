<?php

$pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=ecom', 'root', '');

echo "[tables]\n";
foreach ($pdo->query('SHOW TABLES') as $row) {
    echo $row[0], "\n";
}

echo "\n[migrations]\n";
foreach ($pdo->query('SELECT migration, batch FROM migrations ORDER BY migration') as $row) {
    echo $row[0], "\t", $row[1], "\n";
}
