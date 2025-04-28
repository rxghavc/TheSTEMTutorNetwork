CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_role ENUM('student', 'tutor') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Verification (
    verification_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    verification_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- CREATE TABLE Tutors (
--     tutor_id INT PRIMARY KEY AUTO_INCREMENT,
--     user_id INT NOT NULL,
--     phone_number VARCHAR(15),
--     bio TEXT,
--     FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE Qualifications (
--     qualification_id INT PRIMARY KEY AUTO_INCREMENT,
--     qualification_name VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE Tutor_Qualifications (
--     tutor_id INT NOT NULL,
--     qualification_id INT NOT NULL,
--     FOREIGN KEY (tutor_id) REFERENCES Tutors(tutor_id) ON DELETE CASCADE,
--     FOREIGN KEY (qualification_id) REFERENCES Qualifications(qualification_id) ON DELETE CASCADE,
--     PRIMARY KEY (tutor_id, qualification_id)
-- );

-- CREATE TABLE Subjects (
--     subject_id INT PRIMARY KEY AUTO_INCREMENT,
--     subject_name VARCHAR(100) NOT NULL
-- );

-- CREATE TABLE Tutor_Subjects (
--     tutor_id INT NOT NULL,
--     subject_id INT NOT NULL,
--     FOREIGN KEY (tutor_id) REFERENCES Tutors(tutor_id) ON DELETE CASCADE,
--     FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
--     PRIMARY KEY (tutor_id, subject_id)
-- );

-- CREATE TABLE Exam_Boards (
--     exam_board_id INT PRIMARY KEY AUTO_INCREMENT,
--     exam_board_name VARCHAR(100) NOT NULL
-- );

-- CREATE TABLE Subject_Exam_Boards (
--     subject_id INT NOT NULL,
--     exam_board_id INT NOT NULL,
--     FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
--     FOREIGN KEY (exam_board_id) REFERENCES Exam_Boards(exam_board_id) ON DELETE CASCADE,
--     PRIMARY KEY (subject_id, exam_board_id)
-- );

-- CREATE TABLE Lessons (
--     lesson_id INT PRIMARY KEY AUTO_INCREMENT,
--     tutor_id INT NOT NULL,
--     student_id INT NOT NULL,
--     lesson_date DATE NOT NULL,
--     lesson_time TIME NOT NULL,
--     lesson_duration INT NOT NULL,
--     lesson_price DECIMAL(5, 2) NOT NULL,
--     lesson_status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
--     FOREIGN KEY (tutor_id) REFERENCES Tutors(tutor_id) ON DELETE CASCADE,
--     FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE Reviews (
--     review_id INT PRIMARY KEY AUTO_INCREMENT,
--     tutor_id INT NOT NULL,
--     student_id INT NOT NULL,
--     review_rating INT NOT NULL,
--     review_comment TEXT,
--     review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (tutor_id) REFERENCES Tutors(tutor_id) ON DELETE CASCADE,
--     FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE TutoringRequests (
--     request_id INT PRIMARY KEY AUTO_INCREMENT,
--     subject VARCHAR(255) NOT NULL,
--     level VARCHAR(255) NOT NULL,
--     availability VARCHAR(255) NOT NULL,
--     additional_info TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );