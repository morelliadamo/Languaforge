package com.tengelyhatalmak.languaforge.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendActivationEmail(String toEmail, String username, String activationToken) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("languaforgenoreply@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Aktiváld a LanguaForge fiókod!");

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Activate Your LanguaForge Account</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }

                        body {
                            background-color: #e5e7eb;
                            min-height: 100vh;
                            padding: 40px 20px;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        }

                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: white;
                            padding: 2.5rem;
                            border-radius: 1.5rem;
                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        }

                        .icon {
                            font-size: 60px;
                            text-align: center;
                            margin-bottom: 20px;
                        }

                        h1 {
                            font-size: 35px;
                            font-weight: bold;
                            text-align: center;
                            color: #0ea5e9;
                            margin-bottom: 10px;
                        }

                        .tagline {
                            font-size: 15px;
                            text-align: center;
                            margin-bottom: 40px;
                            color: #6b7280;
                            font-style: italic;
                            font-weight: 600;
                        }

                        h2 {
                            font-size: 25px;
                            font-weight: bold;
                            text-align: center;
                            margin-top: 6px;
                            margin-bottom: 20px;
                            color: #0ea5e9;
                        }

                        .message {
                            font-size: 16px;
                            text-align: center;
                            color: #6b7280;
                            line-height: 1.6;
                            margin-bottom: 30px;
                        }

                        .username {
                            color: #0ea5e9;
                            font-weight: bold;
                        }

                        .button-container {
                            text-align: center;
                            margin: 30px 0;
                        }

                        .button {
                            background-color: #0ea5e9;
                            color: white;
                            padding: 12px 32px;
                            border-radius: 0.75rem;
                            text-decoration: none;
                            font-size: 16px;
                            font-weight: 500;
                            display: inline-block;
                            transition: background-color 0.2s;
                        }

                        .button:hover {
                            background-color: #0284c7;
                        }

                        .footer {
                            text-align: center;
                            font-size: 14px;
                            color: #9ca3af;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #e5e7eb;
                        }

                        .link {
                            color: #0ea5e9;
                            word-break: break-all;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="icon">🚀</div>
                        <h1>LanguaForge</h1>
                        <p class="tagline">"Forge Your Language Skills."</p>
                        <h2>Üdvözlégy!</h2>
                        <p class="message">
                            Kedves <span class="username">""" + username + """
                            </span>,
                            <br><br>
                            Köszönjük, hogy regisztráltál a LanguaForge-ra és ezzel elkezdted a nyelvtudásod kovácsolását! Már izgatottak vagyunk!! :3
                            <br><br>
                            Hogy belevághass, kattints az alábbi linkre a fiókod aktiválásához:
                        </p>
                        <div class="button-container">
                            <a href="http://localhost:8080/auth/activate?token=""" + activationToken + """
                            " class="button">Fiók aktiválása</a>
                        </div>
                        <p class="message">
                            Vagy másold be a következő URL-t a böngésződbe:
                            <br>
                            <span class="link">http://localhost:8080/auth/activate?token=""" + activationToken + """
                            </span>
                        </p>
                        <div class="footer">
                            <p>A legjobbakat,<br>a LanguaForge csapata</p>
                        </div>
                    </div>
                </body>
                </html>
                """;

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send activation email", e);
        }
    }
}
