# 🎓 SkillForge AI Analytics

An end-to-end analytics project for an **AI-powered online learning platform**, built to analyze user behavior, course performance, revenue, AI assistant usage, feature adoption, and customer support activity.

The project combines **SQL, Python, MySQL-compatible cloud databases, exploratory data analysis, and an interactive Next.js analytics dashboard** to demonstrate a complete data analytics workflow from raw data to production deployment.

> **Note:** The dataset used in this project is synthetically generated for analytics and portfolio purposes.

---

## 🌐 Live Dashboard

🚀 **Live Application:**  
https://skill-forge-ai-analytics.vercel.app/

💻 **GitHub Repository:**  
https://github.com/Anaya3104-pk/SkillForge-AI-Analytics

---

# 📌 Project Overview

SkillForge is designed as a fictional online learning platform where users can:

- Browse and enroll in courses
- Purchase subscription plans
- Make course-related payments
- Earn certificates
- Interact with an AI learning assistant
- Use different platform features
- Raise support tickets
- Log in and engage with the platform

The analytics system processes this information to answer business questions such as:

- How many users are using the platform?
- What courses have the highest enrollment?
- What percentage of enrollments are completed?
- How much revenue has been generated?
- Which payment methods are most commonly used?
- How actively are users interacting with the AI assistant?
- Which platform features are used most frequently?
- What categories and instructors perform well?
- What types of support issues are being raised?
- How does platform activity change over time?

---

# 🎯 Project Objectives

The main objectives of the project are:

1. Build a realistic relational database for an online learning platform.
2. Generate and analyze a large synthetic dataset.
3. Perform exploratory data analysis using Python.
4. Write SQL queries to extract business insights.
5. Create reusable SQL views and stored procedures.
6. Build an interactive analytics dashboard.
7. Connect the dashboard to a cloud-hosted database.
8. Deploy the application publicly using Vercel.
9. Demonstrate an end-to-end analytics workflow suitable for real-world business analysis.

---

# 📊 Dataset

The project contains approximately **2+ million records** across 12 relational tables.

| Table | Approx. Records | Description |
|---|---:|---|
| Users | 50,000 | User profiles and account information |
| Enrollments | 147,595 | Course enrollment activity |
| Payments | 20,057 | Payment transactions |
| Certificates | 94,847 | Certificates issued for completed courses |
| Login_History | 500,000 | User login activity |
| AI_Chats | 300,000 | AI assistant conversations |
| Feature_Usage | 1,000,000 | Platform feature usage |
| Support_Tickets | 12,000 | Customer support requests |
| Courses | 100 | Course information |
| Instructors | — | Instructor information |
| Categories | — | Course categories |
| Subscription_Plans | — | Subscription plan information |

### Dataset Characteristics

- 50,000 users
- 100 courses
- 147,595 enrollments
- 20,057 payment transactions
- 94,847 certificates
- 500,000 login records
- 300,000 AI conversations
- 1,000,000 feature usage records
- 12,000 support tickets

The data is **synthetically generated** and is intended to simulate a realistic learning-platform analytics environment.

---

# 🗄️ Database Schema

The database contains the following 12 tables:

```text
Subscription_Plans
        │
        ▼
      Users
        │
 ┌──────┼───────────────┐
 ▼      ▼               ▼
Enrollments  Payments  Login_History
    │          │
    ▼          ▼
Certificates  Subscription_Plans

Courses
   │
   ├── Categories
   │
   └── Instructors

Users
   │
   ├── AI_Chats
   ├── Feature_Usage
   └── Support_Tickets

   Main Tables
Users

Stores user account and profile information.

Courses

Contains course details including category, instructor, difficulty, rating, and status.

Enrollments

Tracks user enrollment and course progress.

Payments

Stores payment transactions, payment status, payment methods, discounts, and subscription information.

Certificates

Stores certificates generated for completed enrollments.

Login_History

Tracks user login activity.

AI_Chats

Stores interactions between users and the AI learning assistant.

Feature_Usage

Tracks usage of different platform features.

Support_Tickets

Stores customer support requests and their resolution status.

🔍 Exploratory Data Analysis

Python was used to perform EDA across the major datasets.

EDA Modules
EDA/
├── 01_users_eda.py
├── 02_courses_eda.py
├── 03_enrollments_eda.py
├── 04_payments_eda.py
├── 05_login_history_eda.py
├── 06_ai_chats_eda.py
├── 07_feature_usage_eda.py
└── 08_support_tickets_eda.py
EDA Covered
Data distribution
Missing values
Duplicate analysis
Categorical distributions
Numerical distributions
Outlier analysis
User activity
Course enrollment patterns
Payment behavior
Login trends
AI interaction patterns
Feature adoption
Support ticket patterns
Python Libraries
Pandas
NumPy
Matplotlib
Seaborn
🧮 SQL Analysis

The project contains 40 finalized SQL analysis queries covering multiple business areas.

SQL Analysis Areas
User Analytics
User distribution
Account activity
Login behavior
User segmentation
Course Analytics
Top courses
Course enrollment
Completion performance
Course ratings
Category performance
Instructor performance
Revenue Analytics
Total successful revenue
Successful transactions
Payment status
Payment methods
Discounts
Average transaction value
Subscription revenue
Monthly revenue
Engagement Analytics
Login activity
AI assistant usage
Feature usage
User engagement
Support Analytics
Support ticket volume
Ticket status
Ticket categories
Resolution analysis
🛠️ SQL Components

The SQL directory contains:

sql/
├── 01_create_database.sql
├── 02_create_tables.sql
├── 03_insert_sample_data.sql
├── 04_views.sql
├── 05_stored_procedures.sql
├── 06_analysis_queries.sql
└── testing_queries.sql
SQL Concepts Used
SELECT
WHERE
GROUP BY
HAVING
ORDER BY
Aggregate functions
JOINs
LEFT JOIN
INNER JOIN
Self JOIN
Subqueries
CTEs
Window functions
CASE statements
Date functions
Views
Stored procedures
Conditional aggregation
📈 Key Business Metrics

The current dataset produces the following key metrics:

Metric	Value
Total Users	50,000
Total Enrollments	147,595
Completed Enrollments	94,847
In Progress Enrollments	32,038
Dropped Enrollments	20,710
Completion Rate	64.26%
Successful Revenue	₹78,588,157
Successful Transactions	18,843
Pending Payments	624
Failed Payments	590
Average Successful Transaction	₹4,170.68
Total Discounts	₹2,594,400
Total AI Chats	300,000
Total Logins	500,000
Total Feature Usage	1,000,000
Support Tickets	12,000
Courses	100
📊 Interactive Dashboard

The project includes a multi-page interactive analytics dashboard.

🏠 Overview

Provides a high-level summary of the platform.

KPIs
Total Users
Total Enrollments
Successful Revenue
AI Chats
Completion Rate
Support Tickets
Visualizations
Revenue trend
Enrollment status
Top courses
Platform activity
👥 Users Analytics

The Users dashboard focuses on user activity and engagement.

Includes
User statistics
Login activity
User engagement
Platform usage
Feature adoption
User-related trends
📚 Courses Analytics

The Courses dashboard analyzes course performance.

Includes
Total courses
Active courses
Archived courses
Total enrollments
Average rating
Enrollment trends
Difficulty distribution
Top courses
Category distribution
Instructor distribution
💰 Revenue Analytics

The Revenue dashboard focuses on financial performance.

Includes
Successful revenue
Successful transactions
Pending payments
Failed payments
Average transaction value
Total discounts
Monthly revenue
Payment methods
Payment status
Subscription revenue
Coupon analysis
🤖 AI Analytics

The AI Analytics dashboard focuses on usage of the platform's AI assistant.

Includes
Total AI conversations
AI interaction trends
User engagement with AI
AI usage patterns
🎫 Support Analytics

The Support dashboard focuses on customer support activity.

Includes
Total support tickets
Ticket trends
Ticket categories
Ticket status
Support activity analysis
💻 Technology Stack
Data & Database
MySQL
TiDB Cloud
SQL
MySQL Workbench
Data Analysis
Python
Pandas
NumPy
Matplotlib
Seaborn
Dashboard
Next.js
TypeScript
Tailwind CSS
Recharts
Backend / API
Next.js API Routes
Node.js
mysql2
Deployment
Vercel
TiDB Cloud
Development Tools
Git
GitHub
VS Code
☁️ Cloud Architecture

The production application uses a cloud-hosted MySQL-compatible database and a Next.js application deployed on Vercel.

                    SkillForge AI Analytics
                              │
                              ▼
                     Next.js Dashboard
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              API Routes            Recharts
                    │
                    ▼
               TiDB Cloud
                    │
                    ▼
              skillforge_ai
                    │
                    ▼
              2M+ Analytics Rows
Deployment Flow
GitHub
   │
   ▼
Vercel
   │
   ▼
Next.js Application
   │
   ▼
Next.js API Routes
   │
   ▼
TiDB Cloud
   │
   ▼
MySQL-Compatible Database

The production dashboard connects to TiDB Cloud through environment variables.

Database credentials are not stored in the source code or GitHub repository.

🌐 Production Deployment
Live Dashboard

https://skill-forge-ai-analytics.vercel.app/

Production Stack
Component	Technology
Frontend	Next.js
Language	TypeScript
Styling	Tailwind CSS
Charts	Recharts
API	Next.js API Routes
Database	TiDB Cloud
Database Driver	mysql2
Hosting	Vercel
Source Control	GitHub
🔌 API Architecture

The dashboard communicates with the database through Next.js API routes.

Dashboard Page
      │
      ▼
Next.js API Route
      │
      ▼
mysql2 Connection Pool
      │
      ▼
TiDB Cloud
      │
      ▼
SQL Query
      │
      ▼
JSON Response
      │
      ▼
Dashboard Visualization
API Routes
/api/overview
/api/users
/api/courses
/api/revenue
/api/ai
/api/support

Each route retrieves analytics data from the cloud database and returns structured JSON data to the dashboard.

📁 Project Structure
SkillForge-AI-Analytics/
│
├── dashboard/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── users/
│   │   │   ├── courses/
│   │   │   ├── revenue/
│   │   │   ├── ai/
│   │   │   ├── support/
│   │   │   └── api/
│   │   │       ├── overview/
│   │   │       ├── users/
│   │   │       ├── courses/
│   │   │       ├── revenue/
│   │   │       ├── ai/
│   │   │       └── support/
│   │   │
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── KPICard.tsx
│   │   │
│   │   └── lib/
│   │       └── db.ts
│   │
│   └── package.json
│
├── data_generator/
│
├── database/
│
├── EDA/
│   ├── 01_users_eda.py
│   ├── 02_courses_eda.py
│   ├── 03_enrollments_eda.py
│   ├── 04_payments_eda.py
│   ├── 05_login_history_eda.py
│   ├── 06_ai_chats_eda.py
│   ├── 07_feature_usage_eda.py
│   └── 08_support_tickets_eda.py
│
├── docs/
│
├── images/
│
├── powerbi/
│
├── sql/
│   ├── 01_create_database.sql
│   ├── 02_create_tables.sql
│   ├── 03_insert_sample_data.sql
│   ├── 04_views.sql
│   ├── 05_stored_procedures.sql
│   ├── 06_analysis_queries.sql
│   └── testing_queries.sql
│
├── .gitignore
├── PROJECT_PLAN.md
└── README.md
🚀 Running the Project Locally
1. Clone the Repository
git clone https://github.com/Anaya3104-pk/SkillForge-AI-Analytics.git
cd SkillForge-AI-Analytics
2. Set Up Python Environment

Create a virtual environment:

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

Install required Python packages:

pip install pandas numpy matplotlib seaborn
🗄️ Database Setup

The project uses a MySQL-compatible database.

For local development, configure the required database connection variables.

Create:

dashboard/.env.local

Example:

DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=skillforge_ai
DB_PORT=4000

Do not commit .env.local or database credentials to GitHub.

💻 Dashboard Setup

Navigate to the dashboard:

cd dashboard

Install dependencies:

npm install

Start the development server:

npm run dev

Open:

http://localhost:3000
🔐 Security

The project follows basic production security practices.

Environment Variables

Database credentials are stored using environment variables rather than hard-coded in the source code.

The repository ignores sensitive files such as:

.env
.env.local
*.env
Database Connection

The production application uses a secure TLS-enabled connection to the cloud database.

Source Control

No database passwords or private credentials should be committed to GitHub.

🌐 Production Highlights
✅ Publicly deployed analytics dashboard
✅ Cloud-hosted MySQL-compatible database
✅ 2M+ rows of synthetic analytics data
✅ Next.js production application
✅ Database-backed API routes
✅ Interactive charts and KPI cards
✅ Multiple analytics modules
✅ Python-based exploratory data analysis
✅ 40 SQL analysis queries
✅ SQL views and stored procedures
✅ Secure environment-variable based credentials
✅ Vercel deployment
✅ TiDB Cloud database
✅ GitHub version control
📚 Key Learning Outcomes

This project provided practical experience in:

SQL
Relational database design
Complex SQL queries
Joins
Subqueries
CTEs
Window functions
Views
Stored procedures
Aggregations
Business analytics
Python
Data cleaning
Exploratory data analysis
Pandas
NumPy
Matplotlib
Seaborn
Data visualization
Analytics
KPI development
Revenue analysis
User behavior analysis
Course performance analysis
Engagement analysis
Support analytics
Business-oriented data interpretation
Full-Stack Analytics
Next.js
TypeScript
API development
Database connectivity
Recharts
Tailwind CSS
Cloud database integration
Production deployment
Cloud & Deployment
TiDB Cloud
Vercel
Environment variables
Production database connectivity
GitHub-based deployment
🔮 Future Improvements

Potential future enhancements include:

User authentication
Role-based dashboards
Advanced user segmentation
Predictive churn analysis
Course recommendation system
AI-powered business insights
Revenue forecasting
Automated anomaly detection
Advanced cohort analysis
Real-time analytics
Automated data pipelines
More advanced machine learning models
⚠️ Data Disclaimer

This project uses synthetically generated data created for educational, portfolio, and demonstration purposes.

The metrics and trends shown in the dashboard do not represent the actual performance of a real company or learning platform.

👩‍💻 Author

Anaya Kalap

B.Tech Computer Science Engineering

Interested in:

Data Analytics
Data Science
SQL
Python
Business Intelligence
Machine Learning
⭐ Project

If you find this project useful or interesting, feel free to explore the repository and the live dashboard.

🔗 Links

Live Dashboard:
https://skill-forge-ai-analytics.vercel.app/

GitHub:
https://github.com/Anaya3104-pk/SkillForge-AI-Analytics