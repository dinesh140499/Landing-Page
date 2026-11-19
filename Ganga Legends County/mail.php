<?php
// ===== SETTINGS (change these) =====
$to      = "shiv.buzz123@gmail.com";        // where enquiries are sent
$project = "Ganga Legends County";                   // shown in the email subject
// ===================================

ini_set("display_errors", 0);   // never print PHP warnings (they break the reply)
header("Content-Type: application/json");

// Only accept form submissions
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false]);
    exit;
}

// Spam bot trap: real visitors leave this hidden field empty
if (!empty($_POST["_honey"])) {
    echo json_encode(["success" => true]);
    exit;
}

// Read the form fields
$name    = trim($_POST["Name"] ?? "");
$phone   = trim($_POST["Phone"] ?? "");
$email   = trim($_POST["Email"] ?? "");
$message = trim($_POST["Message"] ?? "");
$source  = trim($_POST["Lead_Source"] ?? "Website");

// Name and phone are required
if ($name === "" || $phone === "") {
    echo json_encode(["success" => false]);
    exit;
}

// Build the email text from every field the form sent
$body = "New enquiry for $project\n\n";
foreach ($_POST as $key => $value) {
    if ($key === "_honey" || $value === "") continue;
    $label = str_replace("_", " ", $key);   // PHP turns spaces into _ in field names, so put them back
    $body .= "$label: $value\n";
}

$subject = "New Lead - $project - $name ($source)";

// Sender address (uses your own domain so it is less likely to be spam)
$domain  = str_replace("www.", "", $_SERVER["HTTP_HOST"]);
$headers = "From: $project <no-reply@$domain>\r\n";
if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers .= "Reply-To: $email\r\n";   // so you can reply to the visitor directly
}

// Send it
$sent = mail($to, $subject, $body, $headers);

echo json_encode(["success" => $sent]);
