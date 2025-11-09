<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MAJSTOR-NASTE</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Галерия</h1>
  <div class="images">
    <?php
      $imageDir = 'images/';
      $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

      foreach (scandir($imageDir) as $file) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, $allowedExtensions)) {
          echo "<img src='$imageDir$file' alt='$file' class='gallery-image' />";
        }
      }
    ?>
  </div>
</body>
</html>
