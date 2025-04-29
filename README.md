# TheSTEMTutorNetwork

## Contact
For any inquiries, please contact [TheSTEMTutorNetwork Support](mailto:r.commandur@gmail.com).

## Project Overview
TheSTEMTutorNetwork is a web-based platform designed to connect students with certified tutors specializing in delivering GCSE/A-Level content. This is available to use to obtain many student's details and their desired tutoring lessons needed so that you get emailed when tutoring requests come in. After that, it's possible for you to email the students and set up a tutor for them. This repository contains the source code, assets, and database schema for the application.

## Project Structure

### Root Directory
- **server.js**: The main server-side JavaScript file for handling backend logic.
- **package.json**: Contains project metadata and dependencies.
- **package-lock.json**: Automatically generated file for locking dependencies.
- **.env**: Environment variables for sensitive data (not included in the repository).
- **README.md**: This documentation file.

### `assets/`
Contains static files such as CSS, JavaScript, images, and HTML pages.

#### `css/`
- **account_dashboardstyle.css**: Styles for the account dashboard page.
- **forgot_password_style.css**: Styles for the forgot password page.
- **homepage.css**: Styles for the homepage.
- **loginstyle.css**: Styles for the login/signup page.
- **verification_codestyle.css**: Styles for the verification code page.

#### `images/`
- **login_system_background.png**: Background image for the login system.
- **logo.png**: Logo of the tutoring agency.
- **tutoring_request.png**: Image used for tutoring requests.

#### `js/`
- **account_dashboardscript.js**: JavaScript for the account dashboard functionality.
- **forgot_password_script.js**: JavaScript for the forgot password functionality.
- **homepagescript.js**: JavaScript for the homepage animations and interactions.
- **loginsystemmain.js**: JavaScript for the login/signup system.
- **verification_codescript.js**: JavaScript for handling verification codes.

#### `pages/`
- **account_dashboard.html**: HTML for the account dashboard page.
- **forgot_password.html**: HTML for the forgot password page.
- **homepage.html**: HTML for the homepage.
- **login_signup_page.html**: HTML for the login/signup page.
- **verification_code.html**: HTML for the verification code page.

### `sql/`
Contains database-related files.
- **sql queries.sql**: SQL script for creating and managing the database schema.

## How to Run the Project

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd TheSTEMTutorNetwork
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up the database:
   - Import the `sql queries.sql` file into your MySQL database.
   - Configure the `.env` file with your database credentials (see the [Environment Variables](#environment-variables) section).

5. Start the server:
   ```bash
   node server.js
   ```

6. Open the application in your browser at `http://localhost:3000`.

## Features
- User authentication (login, signup, password reset).
- Verification system for email validation.
- Automatic Emails sent out whenever needed.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL

## Dependencies

### Required Dependencies
- `@emailjs/nodejs`: For sending emails.
- `bcrypt`: For hashing passwords.
- `dotenv`: For managing environment variables.
- `express`: For building the web server.
- `express-session`: For managing user sessions.
- `mysql2`: For interacting with the MySQL database.
- `nodemailer`: For sending emails.
- `passport`: For authentication.
- `passport-google-oauth20`: For Google OAuth 2.0 authentication.

### Development Dependencies
- `nodemon`: For automatically restarting the server during development.

### Installation
To install all required dependencies, run the following commands:

```bash
npm install
npm install --save-dev nodemon
```

## Environment Variables

The project requires the following environment variables to be set up in a `.env` file:

1. **SESSION_SECRET**: A secret key used for session management. This should be a secure, random string.
2. **emailJSUserID**: The User ID for EmailJS, used for sending emails.
3. **emailJSServiceID**: The Service ID for EmailJS.
4. **emailJSTemplateID**: The Template ID for EmailJS.
5. **DB_USER**: The username for the database connection.
6. **DB_PASSWORD**: The password for the database connection.
7. **DB_NAME**: The name of the database to connect to.
8. **EMAIL_USER**: The email address used for sending emails (via Nodemailer).
9. **EMAIL_PASS**: The password or app-specific password for the email account.
10. **DB_HOST**: The host address for the database (e.g., `localhost` for local development).
11. **PERSONAL_EMAIL_USER**: A personal email address, for administrative purposes.

Ensure that these variables are properly configured before running the project.

## Screenshots

### Homepage

![image](https://github.com/user-attachments/assets/84e3d9df-e15b-4233-8413-6ed40f33123d)
![image](https://github.com/user-attachments/assets/28954502-247f-46a7-9c52-f97cdd00c10f)
![image](https://github.com/user-attachments/assets/48361e12-7b87-4870-a4f6-e4a21319a971)
![image](https://github.com/user-attachments/assets/a3fed381-9692-471c-89a8-b142ad276cb3)
![image](https://github.com/user-attachments/assets/6ed4e6e5-e8e9-4a16-878f-b188ef8191d9)
![image](https://github.com/user-attachments/assets/53e32bbb-11ef-459b-9f0f-8c1e5fa48045)

### Login/Signup Page

![image](https://github.com/user-attachments/assets/d320b069-3232-4c81-929a-ee56da7c38e3)
![image](https://github.com/user-attachments/assets/cf3cd418-ffc7-4ba8-bf6f-68435c753c55)

### Tutoring Requests Page

![image](https://github.com/user-attachments/assets/8d9018f4-9f47-4ebc-b238-05d3d857d51c)
![image](https://github.com/user-attachments/assets/37e94cd4-0579-47f0-9c9f-8b471411c357)

