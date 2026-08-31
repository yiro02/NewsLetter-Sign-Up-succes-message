const welcomeTemplate = (name) => {
    return `
        <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2>Welcome ${name} 👋</h2>
            <p>Thank you for registering with our application.</p>
            <p>Your account has been created successfully.</p>
            <a
                href="https://yourwebsite.com"
                style="
                    display:inline-block;
                    padding:12px 20px;
                    background:#2563eb;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:5px;
                "
            >
                Visit Website
            </a>
            <p style="margin-top:20px;">
                Regards,<br>
                Node.js Team
            </p>
        </div>
    `;
};
module.exports = welcomeTemplate;