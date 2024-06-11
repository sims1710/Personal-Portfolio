<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first_name = htmlspecialchars($_POST['first_name']);
    $last_name = htmlspecialchars($_POST['last_name']);
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $subject = htmlspecialchars($_POST['subject']);
    $content = htmlspecialchars($_POST['content']);

    if ($email) {
        $to = "simritib1@gmail.com";
        $full_name = $first_name . ' ' . $last_name;
        $headers = "From: " . $email . "\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        $message = "<html><body>";
        $message .= "<p><strong>Name:</strong> {$full_name}</p>";
        $message .= "<p><strong>Email:</strong> {$email}</p>";
        $message .= "<p><strong>Subject:</strong> {$subject}</p>";
        $message .= "<p><strong>Content:</strong><br>" . nl2br($content) . "</p>";
        $message .= "</body></html>";

        if (mail($to, $subject, $message, $headers)) {
            echo "Email sent successfully!";
        } else {
            echo "Failed to send email.";
        }
    } else {
        echo "Invalid email address.";
    }
} else {
    echo "Invalid request method.";
}
?>
