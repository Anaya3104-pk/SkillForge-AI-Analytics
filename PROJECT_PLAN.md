# SkillForge AI – SaaS Learning Platform Analytics

## Objective
Design a realistic SaaS learning platform database, generate synthetic business data, perform SQL analysis, conduct EDA using Python, and build an interactive Power BI dashboard to provide business insights.

## Tech Stack
- MySQL
- Python
- Pandas
- NumPy
- Faker
- Matplotlib
- Seaborn
- Power BI
- Git & GitHub

## Project Phases
1. Business Understanding
2. Database Design
3. Data Generation
4. SQL Analysis
5. EDA
6. Dashboard Development
7. Future Machine Learning Extension

## Database Entities

1. Users
2. Subscription_Plans
3. Categories
4. Instructors
5. Courses
6. Enrollments
7. AI_Chats
8. Coding_Challenges
9. Payments
10. Login_History
11. Support_Tickets
12. Certificates

## Database Design

### Table 1: Users
- user_id (PK)
- first_name
- last_name
- email
- phone
- gender
- date_of_birth
- country
- state
- city
- profession
- experience_level
- signup_date
- subscription_id (FK)
- account_status

### Table 2: Subscription_Plans
- subscription_id (PK)
- plan_name
- monthly_price
- duration_months
- ai_chat_limit
- coding_challenge_limit
- certificate_access
- priority_support

# Business Objectives

The management of SkillForge AI wants to answer the following questions:

1. How is the platform growing over time?
2. Which subscription plans generate the highest revenue?
3. Which courses have the highest and lowest completion rates?
4. Which user segments are the most engaged?
5. Does AI Tutor usage improve course completion?
6. Which platform features are used the most?
7. Which users are likely to become inactive?
8. Which countries generate the most revenue?
9. What are the most common customer support issues?
10. What recommendations can increase user engagement and revenue?