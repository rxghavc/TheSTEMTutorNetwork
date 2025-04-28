require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        throw err;
    }
    console.log('MySQL connected...');
});

// Middleware
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to generate a random verification code
function generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/pages/homepage.html'));
});

app.get('/login-signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/pages/login_signup_page.html'));
});

app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/pages/forgot_password.html'));
});

app.get('/verification-code', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/pages/verification_code.html'));
});

// Route to serve the account dashboard page
app.get('/account-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/pages/account_dashboard.html'));
});

// Route to handle signup
app.post('/signup', async (req, res) => {
    const { firstName, lastName, dob, email, password } = req.body;

    // Check if the email already exists in the Users table
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'User account already created' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Store signup data in session
        req.session.signupData = { firstName, lastName, dob, email, hashedPassword };

        // Insert verification code into the Verification table
        const verificationQuery = 'INSERT INTO Verification (email, verification_code, expires_at) VALUES (?, ?, ?)';
        db.query(verificationQuery, [email, verificationCode, expiresAt], (err, result) => {
            if (err) {
                console.error('Error inserting verification code:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            // Send verification email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Email Verification',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <div style="text-align: center;">
                            <img src="cid:logo" alt="Logo" style="width: 100px; height: auto;">
                        </div>
                        <h2 style="text-align: center; color: #4CAF50;">Email Verification</h2>
                        <p>Dear ${firstName} ${lastName},</p>
                        <p>Thank you for signing up. Please use the following verification code to complete your registration:</p>
                        <div style="text-align: center; font-size: 24px; font-weight: bold; color: #4CAF50; margin: 20px 0;">${verificationCode}</div>
                        <p>This code will expire in 5 minutes.</p>
                        <p>Best regards,<br>TheSTEMTutorNetwork Team</p>
                    </div>
                `,
                attachments: [{
                    filename: 'logo.png',
                    path: path.join(__dirname, 'assets/images/logo.png'), // Updated path
                    cid: 'logo'
                }]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Server error' });
                }
                res.status(200).json({ message: 'Verification email sent' });
            });
        });
    });
});

// Route to handle login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the email exists in the Users table
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Store user data in session
        req.session.user = { id: user.id, username: user.username, email: user.email };

        res.status(200).json({ message: 'Login successful' });
    });
});

// Route to handle verification code submission
app.post('/verify_code', (req, res) => {
    const { verificationCode } = req.body;
    const email = req.session.signupData.email;

    const query = 'SELECT * FROM Verification WHERE email = ? AND verification_code = ? AND expires_at > NOW()';
    db.query(query, [email, verificationCode], (err, results) => {
        if (err) {
            console.error('Error fetching verification code:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Insert user into the Users table
        const { firstName, lastName, dob, hashedPassword } = req.session.signupData;
        const insertUserQuery = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [`${firstName} ${lastName}`, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            // Delete the verification code from the Verification table
            const deleteVerificationQuery = 'DELETE FROM Verification WHERE email = ?';
            db.query(deleteVerificationQuery, [email], (err, result) => {
                if (err) {
                    console.error('Error deleting verification code:', err);
                    return res.status(500).json({ message: 'Server error' });
                }

                res.status(200).json({ message: 'User registered successfully' });
            });
        });
    });
});

// Route to handle resending verification code
app.post('/resend_code', (req, res) => {
    const { firstName, lastName, email } = req.session.signupData;
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Update verification code in the Verification table
    const updateVerificationQuery = 'UPDATE Verification SET verification_code = ?, expires_at = ? WHERE email = ?';
    db.query(updateVerificationQuery, [verificationCode, expiresAt, email], (err, result) => {
        if (err) {
            console.error('Error updating verification code:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        // Send verification email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="text-align: center;">
                        <img src="cid:logo" alt="Logo" style="width: 100px; height: auto;">
                    </div>
                    <h2 style="text-align: center; color: #4CAF50;">Email Verification</h2>
                    <p>Dear ${firstName} ${lastName},</p>
                    <p>Please use the following verification code to complete your registration:</p>
                    <div style="text-align: center; font-size: 24px; font-weight: bold; color: #4CAF50; margin: 20px 0;">${verificationCode}</div>
                    <p>This code will expire in 5 minutes.</p>
                    <p>Best regards,<br>TheSTEMTutorNetwork Team</p>
                </div>
            `,
            attachments: [{
                filename: 'logo.png',
                path: path.join(__dirname, 'assets/images/logo.png'), // Updated path
                cid: 'logo'
            }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Server error' });
            }
            res.status(200).json({ message: 'Verification email resent' });
        });
    });
});

// Route to check verification code expiration
app.post('/check_verification_expiration', (req, res) => {
    const email = req.session.signupData.email;

    const query = 'SELECT * FROM Verification WHERE email = ? AND expires_at <= NOW()';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error checking verification expiration:', err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            return res.json({ expired: true });
        }

        res.json({ expired: false });
    });
});

// Route to handle password reset
app.post('/reset_password', async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the email exists in the Users table
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'This user does not exist' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatePasswordQuery = 'UPDATE users SET password_hash = ? WHERE email = ?';
        db.query(updatePasswordQuery, [hashedPassword, email], (err, result) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            res.status(200).json({ message: 'Password reset successfully' });
        });
    });
});

// New endpoint to handle tutoring requests
app.post('/api/tutoring-request', (req, res) => {
    const { subject, level, availability, additionalInfo, email } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.PERSONAL_EMAIL_USER, // Replace with the email address to receive requests
        subject: 'New Tutoring Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <div style="text-align: center;">
                    <img src="cid:logo" alt="Logo" style="width: 100px; height: auto;">
                </div>
                <h2 style="text-align: center; color: #4CAF50;">New Tutoring Request</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Level of Study:</strong> ${level}</p>
                <p><strong>Availability:</strong> ${availability}</p>
                <p><strong>Additional Information:</strong> ${additionalInfo}</p>
                <p>Best regards,<br>TheSTEMTutorNetwork Team</p>
            </div>
        `,
        attachments: [
            {
                filename: 'logo.png',
                path: path.join(__dirname, 'assets/images/logo.png'),
                cid: 'logo'
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error.message);
            return res.status(500).json({ message: 'An error occurred while sending your request. Please try again later.' });
        }
        res.status(200).json({ message: 'Your request has been sent successfully!' });
    });
});

// Endpoint to get the logged-in user's email
app.get('/api/get-user-email', (req, res) => {
    if (req.session && req.session.user && req.session.user.email) {
        res.json({ email: req.session.user.email });
    } else {
        res.status(401).json({ error: 'User not logged in' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});