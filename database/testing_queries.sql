SELECT * FROM Categories;

SELECT COUNT(*) FROM Instructors;

SELECT COUNT(*) AS total_courses
FROM Courses;

SELECT COUNT(*) FROM Users;

DELETE FROM Courses;
DESCRIBE Courses;
SELECT COUNT(*) FROM Courses;

SELECT difficulty, COUNT(*)
FROM Courses
GROUP BY difficulty;

SELECT category_id, COUNT(*)
FROM Courses
GROUP BY category_id;

DELETE FROM Users;
SELECT COUNT(*) FROM Users;

DESCRIBE Enrollments;

SELECT COUNT(*) FROM Enrollments;

SELECT completion_status, COUNT(*)
FROM Enrollments
GROUP BY completion_status;

SELECT certificate_earned, COUNT(*)
FROM Enrollments
GROUP BY certificate_earned;

DESCRIBE Payments;
DELETE FROM Payments;
SELECT COUNT(*) FROM Payments;
SELECT payment_status, COUNT(*)
FROM Payments
GROUP BY payment_status;
SELECT payment_method, COUNT(*)
FROM Payments
GROUP BY payment_method;
SELECT
SUM(amount) AS Revenue,
AVG(amount) AS Average_Payment
FROM Payments
WHERE payment_status='Success';

SELECT
SUM(amount) AS Revenue,
AVG(amount) AS Average_Payment
FROM Payments
WHERE payment_status='Success';

DESCRIBE Certificates;
DELETE FROM Certificates;

SELECT COUNT(*) FROM Certificates;
SELECT COUNT(DISTINCT certificate_number)
FROM Certificates;

SELECT COUNT(*)
FROM Enrollments
WHERE completion_status = 'Completed';

DESCRIBE Login_History;
DELETE FROM Login_History;

DESCRIBE AI_Chats;

SELECT COUNT(*) FROM Login_History;

SELECT device, COUNT(*)
FROM Login_History
GROUP BY device;

SELECT operating_system, COUNT(*)
FROM Login_History
GROUP BY operating_system;

SELECT browser, COUNT(*)
FROM Login_History
GROUP BY browser;

SELECT
MIN(session_duration_minutes),
AVG(session_duration_minutes),
MAX(session_duration_minutes)
FROM Login_History;

DELETE FROM AI_Chats;
SELECT COUNT(*) FROM AI_Chats;
SELECT topic, COUNT(*)
FROM AI_Chats
GROUP BY topic
ORDER BY COUNT(*) DESC;

SELECT satisfaction_rating, COUNT(*)
FROM AI_Chats
GROUP BY satisfaction_rating
ORDER BY satisfaction_rating;

SELECT
AVG(tokens_used) AS Avg_Tokens,
AVG(response_time_seconds) AS Avg_Response_Time
FROM AI_Chats;

DESCRIBE Feature_Usage;

DELETE FROM Feature_Usage;

DESCRIBE Support_Tickets;

SELECT COUNT(*) FROM Support_Tickets;

SELECT
ticket_category,
COUNT(*)
FROM Support_Tickets
GROUP BY ticket_category;

SELECT
priority,
COUNT(*)
FROM Support_Tickets
GROUP BY priority;

SELECT
ticket_status,
COUNT(*)
FROM Support_Tickets
GROUP BY ticket_status;

SELECT
AVG(resolution_time_hours)
FROM Support_Tickets
WHERE ticket_status <> 'Open';

SELECT
AVG(customer_rating)
FROM Support_Tickets
WHERE customer_rating IS NOT NULL;