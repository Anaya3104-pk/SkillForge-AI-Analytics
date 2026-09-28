SELECT
    (SELECT COUNT(*) FROM Users) AS Users,
    (SELECT COUNT(*) FROM Courses) AS Courses,
    (SELECT COUNT(*) FROM Enrollments) AS Enrollments,
    (SELECT COUNT(*) FROM Payments) AS Payments,
    (SELECT COUNT(*) FROM Certificates) AS Certificates,
    (SELECT COUNT(*) FROM Login_History) AS Logins,
    (SELECT COUNT(*) FROM AI_Chats) AS AI_Chats,
    (SELECT COUNT(*) FROM Feature_Usage) AS Feature_Usage,
    (SELECT COUNT(*) FROM Support_Tickets) AS Support_Tickets;
    
    
    SHOW TABLES LIKE 'Feature_Usage';
    
    SELECT COUNT(*) AS Total_Rows
FROM Feature_Usage;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Users;

SET FOREIGN_KEY_CHECKS = 1;


SELECT COUNT(*) AS total_users
FROM Users;

DESCRIBE Certificates;

DESCRIBE Enrollments;



SELECT COUNT(*) AS certificate_count
FROM Certificates;

SELECT
    COUNT(*) AS completed_enrollments
FROM Enrollments
WHERE completion_status = 'Completed';

SELECT COUNT(*) AS invalid_certificates
FROM Certificates c
LEFT JOIN Enrollments e
    ON c.enrollment_id = e.enrollment_id
WHERE e.enrollment_id IS NULL
   OR e.completion_status <> 'Completed';
   
   
   SELECT
    COUNT(*) AS total_certificates,
    COUNT(e.enrollment_id) AS matched_enrollments,
    SUM(
        CASE
            WHEN e.completion_status = 'Completed'
            THEN 1
            ELSE 0
        END
    ) AS completed_matches
FROM Certificates c
LEFT JOIN Enrollments e
    ON c.user_id = e.user_id
   AND c.course_id = e.course_id;
   
   
   SELECT
    c.certificate_id,
    c.user_id,
    c.course_id,
    c.issue_date,
    e.enrollment_id,
    e.completion_status,
    e.certificate_earned
FROM Certificates c
LEFT JOIN Enrollments e
    ON c.user_id = e.user_id
   AND c.course_id = e.course_id
WHERE e.enrollment_id IS NULL
   OR e.completion_status <> 'Completed'
LIMIT 20;

SELECT
    COUNT(*) AS completed_without_certificate
FROM Enrollments e
LEFT JOIN Certificates c
    ON e.user_id = c.user_id
   AND e.course_id = c.course_id
WHERE e.completion_status = 'Completed'
  AND c.certificate_id IS NULL;
  
  SELECT
    COUNT(*) AS completed,
    SUM(certificate_earned = 1) AS certificates_earned
FROM Enrollments
WHERE completion_status = 'Completed';

SELECT
    MIN(completion_date) AS first_completion,
    MAX(completion_date) AS last_completion
FROM Enrollments
WHERE completion_status = 'Completed';


CREATE TABLE Certificates_backup AS
SELECT *
FROM Certificates;

SELECT COUNT(*) AS backup_count
FROM Certificates_backup;

TRUNCATE TABLE Certificates;

INSERT INTO Certificates
    (user_id, course_id, issue_date, certificate_number)
SELECT
    user_id,
    course_id,
    completion_date,
    CONCAT(
        'CERT-',
        user_id,
        '-',
        course_id,
        '-',
        DATE_FORMAT(completion_date, '%Y%m%d')
    )
FROM Enrollments
WHERE completion_status = 'Completed'
  AND certificate_earned = 1
  AND completion_date IS NOT NULL;
  
  SELECT COUNT(*) AS certificate_count
FROM Certificates;


SELECT
    COUNT(*) AS invalid_certificates
FROM Certificates c
LEFT JOIN Enrollments e
    ON c.user_id = e.user_id
   AND c.course_id = e.course_id
WHERE e.enrollment_id IS NULL
   OR e.completion_status <> 'Completed';
   
   SELECT
    COUNT(*) AS completed_without_certificate
FROM Enrollments e
LEFT JOIN Certificates c
    ON e.user_id = c.user_id
   AND e.course_id = c.course_id
WHERE e.completion_status = 'Completed'
  AND e.certificate_earned = 1
  AND c.certificate_id IS NULL;