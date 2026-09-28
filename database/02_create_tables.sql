#first table 
CREATE TABLE subscription_Plans (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(50) NOT NULL UNIQUE,
    monthly_price DECIMAL(8,2) NOT NULL,
    duration_months INT NOT NULL,
    ai_chat_limit INT NOT NULL,
    certificate_access BOOLEAN NOT NULL DEFAULT FALSE,
    priority_support BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    gender ENUM('Male', 'Female', 'Other'),
    date_of_birth DATE,
    country VARCHAR(50),
    state VARCHAR(50),
    city VARCHAR(50),
    profession VARCHAR(100),
    experience_level ENUM('Beginner', 'Intermediate', 'Advanced'),
    signup_date DATE NOT NULL,
    account_status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',

    subscription_id INT,

    CONSTRAINT fk_users_subscription
        FOREIGN KEY (subscription_id)
        REFERENCES Subscription_Plans(subscription_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE Instructors (
    instructor_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    specialization VARCHAR(100),
    experience_years INT,
    rating DECIMAL(3,2),
    joining_date DATE
);

CREATE TABLE Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(150) NOT NULL,
    category_id INT NOT NULL,
    instructor_id INT NOT NULL,
    difficulty ENUM('Beginner','Intermediate','Advanced') NOT NULL,
    duration_hours INT NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    launch_date DATE,
    language VARCHAR(30) DEFAULT 'English',
    status ENUM('Active','Archived') DEFAULT 'Active',

    CONSTRAINT fk_course_category
        FOREIGN KEY (category_id)
        REFERENCES Categories(category_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_course_instructor
        FOREIGN KEY (instructor_id)
        REFERENCES Instructors(instructor_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE Enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    completion_status ENUM('In Progress','Completed','Dropped')
        DEFAULT 'In Progress',
    completion_date DATE,
    certificate_earned BOOLEAN DEFAULT FALSE,
    rating_given INT CHECK (rating_given BETWEEN 1 AND 5),

    CONSTRAINT fk_enrollment_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_enrollment_course
        FOREIGN KEY (course_id)
        REFERENCES Courses(course_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE AI_Chats (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    chat_date DATETIME NOT NULL,
    topic VARCHAR(100) NOT NULL,
    prompt_length INT CHECK (prompt_length > 0),
    response_time_seconds DECIMAL(5,2),
    tokens_used INT,
    satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 5),

    CONSTRAINT fk_chat_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE Feature_Usage (
    usage_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    usage_date DATETIME NOT NULL,
    session_duration_minutes INT CHECK (session_duration_minutes >= 0),
    device ENUM('Desktop','Mobile','Tablet'),

    CONSTRAINT fk_feature_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subscription_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    payment_method ENUM('UPI','Credit Card','Debit Card','Net Banking','Wallet'),
    payment_status ENUM('Success','Pending','Failed') DEFAULT 'Success',
    discount_amount DECIMAL(8,2) DEFAULT 0,
    coupon_code VARCHAR(30),

    CONSTRAINT fk_payment_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_payment_subscription
        FOREIGN KEY (subscription_id)
        REFERENCES Subscription_Plans(subscription_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE Login_History (
    login_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_datetime DATETIME NOT NULL,
    logout_datetime DATETIME,
    device ENUM('Desktop','Mobile','Tablet'),
    operating_system VARCHAR(30),
    browser VARCHAR(30),
    session_duration_minutes INT CHECK (session_duration_minutes >= 0),

    CONSTRAINT fk_login_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE Support_Tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ticket_category ENUM('Payment','Course','Technical','AI Tutor','Account'),
    priority ENUM('Low','Medium','High'),
    ticket_status ENUM('Open','Resolved','Closed') DEFAULT 'Open',
    created_date DATETIME NOT NULL,
    resolved_date DATETIME,
    resolution_time_hours DECIMAL(6,2),
    customer_rating INT CHECK (customer_rating BETWEEN 1 AND 5),

    CONSTRAINT fk_ticket_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE Certificates (
    certificate_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    issue_date DATE NOT NULL,
    certificate_number VARCHAR(50) NOT NULL UNIQUE,

    CONSTRAINT fk_certificate_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_certificate_course
        FOREIGN KEY (course_id)
        REFERENCES Courses(course_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

