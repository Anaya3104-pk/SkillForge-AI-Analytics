# 🎓 SkillForge AI Analytics

An end-to-end analytics project for an AI-powered online learning platform.  
The project combines **MySQL, SQL, Python, Pandas, Matplotlib, Seaborn, and Next.js** to analyze users, courses, enrollments, payments, AI interactions, feature usage, and customer support activity.

🔗 **Live Dashboard:** https://skill-forge-ai-analytics.vercel.app/

🔗 **GitHub Repository:** https://github.com/Anaya3104-pk/SkillForge-AI-Analytics

---

## 📌 Project Overview

SkillForge is a fictional AI-powered online learning platform designed to simulate a real-world analytics environment.

The project focuses on transforming large-scale raw platform data into meaningful business insights through:

- Relational database design
- SQL analysis
- Exploratory Data Analysis
- Data validation
- Business KPIs
- Interactive analytics dashboards
- Cloud database integration
- Production deployment

The platform contains **12 interconnected tables** and more than **2 million synthetic records** covering different aspects of an online learning business.

---

## 🎯 Project Objectives

The main objectives of this project are to:

- Analyze user activity and engagement
- Understand course performance
- Measure enrollment and completion trends
- Analyze revenue and payment behavior
- Understand AI chatbot usage
- Analyze platform feature adoption
- Monitor customer support tickets
- Identify important business KPIs
- Build an interactive analytics dashboard
- Deploy the dashboard with a cloud-hosted database

---

## 📊 Dataset Overview

The database contains 12 interconnected tables with more than 2 million records.

| Table | Records |
|---|---:|
| Users | 50,000 |
| Courses | 100 |
| Enrollments | 147,595 |
| Payments | 20,057 |
| Certificates | 94,847 |
| Login History | 500,000 |
| AI Chats | 300,000 |
| Feature Usage | 1,000,000 |
| Support Tickets | 12,000 |
| Instructors | — |
| Categories | — |
| Subscription Plans | — |

### Total Dataset Size

**2M+ synthetic records**

The dataset was generated for analytics and portfolio purposes and is not based on real customer data.

---

## 🗄️ Database Schema

The project uses a relational MySQL database containing:

- `users`
- `subscription_plans`
- `categories`
- `instructors`
- `courses`
- `enrollments`
- `payments`
- `certificates`
- `login_history`
- `ai_chats`
- `feature_usage`
- `support_tickets`

The tables are connected using primary keys and foreign-key relationships to represent a realistic learning platform database.

---

## 🔍 Exploratory Data Analysis

Python was used to perform EDA on the major datasets.

### EDA Areas

- User analysis
- Course analysis
- Enrollment analysis
- Payment analysis
- Login activity
- AI chatbot interactions
- Feature usage
- Support ticket analysis

### Libraries Used

- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn

The EDA process included:

- Data inspection
- Data cleaning
- Missing-value analysis
- Distribution analysis
- Outlier analysis
- Trend analysis
- Categorical analysis
- Business-oriented visualizations

---

## 🧮 SQL Analysis

The project contains **40 SQL analysis queries** designed around real-world business questions.

SQL techniques used include:

- SELECT statements
- Filtering
- Aggregations
- GROUP BY
- HAVING
- INNER JOIN
- LEFT JOIN
- Self Join
- Subqueries
- Common Table Expressions (CTEs)
- Window Functions
- CASE statements
- Date functions
- Ranking
- Revenue analysis
- User segmentation
- Course performance analysis

The project also includes:

- SQL Views
- Stored Procedures
- Database creation scripts
- Table creation scripts
- Sample data insertion scripts

---

## 📈 Key Business Metrics

Some of the major metrics calculated from the dataset include:

### Users

- Total Users: **50,000**

### Enrollments

- Total Enrollments: **147,595**
- Completed: **94,847**
- In Progress: **32,038**
- Dropped: **20,710**
- Completion Rate: **64.26%**

### Revenue

- Successful Revenue: **₹78.59M**
- Successful Transactions: **18,843**
- Pending Payments: **624**
- Failed Payments: **590**
- Average Successful Transaction: **₹4,170.68**
- Discounts Applied: **₹2.59M**

### Courses

- Total Courses: **100**
- Active Courses: **98**
- Archived Courses: **2**
- Average Course Rating: **~4.18**

### Platform Activity

- Login Records: **500,000**
- AI Chat Records: **300,000**
- Feature Usage Records: **1,000,000**
- Support Tickets: **12,000**

---

## 🖥️ Interactive Dashboard

The project includes a web-based analytics dashboard built using **Next.js**.

### Dashboard Sections

#### 🏠 Overview

Provides a high-level view of the platform including:

- Total users
- Total enrollments
- Enrollment status
- Platform KPIs
- Top-performing courses

#### 👥 Users

Analyzes:

- User activity
- Active users
- Inactive users
- Suspended users
- User engagement

#### 📚 Courses

Analyzes:

- Course performance
- Course difficulty
- Course launches
- Course enrollments
- Categories
- Top courses
- Instructor performance

#### 💰 Revenue

Analyzes:

- Total revenue
- Successful transactions
- Payment status
- Payment methods
- Monthly revenue
- Subscription revenue
- Coupon/discount analysis

#### 🤖 AI Analytics

Analyzes:

- AI chatbot usage
- AI interactions
- User engagement with AI features
- AI-related activity trends

#### 🎧 Support

Analyzes:

- Support tickets
- Ticket status
- Support activity
- Customer support trends

---

## 🛠️ Technology Stack

### Data & Analytics

- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn

### Database

- MySQL
- SQL

### Backend / API

- Next.js API Routes
- Node.js
- MySQL2

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts

### Cloud & Deployment

- Aiven MySQL
- Vercel
- GitHub

---

## ☁️ Cloud Architecture

```text
                    ┌──────────────────────┐
                    │      GitHub Repo     │
                    │ SkillForge Analytics │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Vercel         │
                    │   Next.js Dashboard  │
                    └──────────┬───────────┘
                               │
                        API Requests
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Aiven MySQL       │
                    │   SkillForge DB      │
                    └──────────────────────┘


SkillForge-AI-Analytics/
│
├── dashboard/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── overview/
│   │   │   │   ├── users/
│   │   │   │   ├── courses/
│   │   │   │   ├── revenue/
│   │   │   │   ├── ai/
│   │   │   │   └── support/
│   │   │   │
│   │   │   ├── users/
│   │   │   ├── courses/
│   │   │   ├── revenue/
│   │   │   ├── ai/
│   │   │   ├── support/
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/
│   │   └── lib/
│   │
│   └── package.json
│
├── data_generator/
│
├── database/
│   ├── 01_create_database.sql
│   ├── 02_create_tables.sql
│   ├── 03_insert_sample_data.sql
│   ├── 04_views.sql
│   └── 05_stored_procedures.sql
│
├── sql/
│   └── 06_analysis_queries.sql
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
├── powerbi/
├── images/
├── docs/
├── PROJECT_PLAN.md
└── README.md

🚀 Running the Project Locally
1. Clone the Repository
git clone https://github.com/Anaya3104-pk/SkillForge-AI-Analytics.git
cd SkillForge-AI-Analytics
2. Install Dashboard Dependencies
cd dashboard
npm install
3. Configure Environment Variables

Create a .env.local file inside the dashboard folder.

DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=skillforge_ai
DB_PORT=your_database_port

Do not commit .env.local to GitHub.

4. Start the Development Server
npm run dev

Open:

http://localhost:3000
🌐 Live Deployment

The dashboard is deployed using Vercel and connected to a cloud-hosted Aiven MySQL database.

Live Dashboard

👉 https://skill-forge-ai-analytics.vercel.app/

🔐 Security

Sensitive database credentials are not stored in the GitHub repository.

Environment variables are used for:

Database host
Database username
Database password
Database name
Database port

The .env.local file is excluded through .gitignore.

📌 Key Learning Outcomes

This project provided hands-on experience with:

Relational database design
Large-scale synthetic data generation
SQL analytics
Advanced SQL queries
Data cleaning
Exploratory Data Analysis
Business KPI development
Data visualization
API development
Next.js dashboard development
Cloud database integration
Environment variable management
Git and GitHub
Vercel deployment
🔮 Future Improvements

Potential future enhancements include:

User authentication
Role-based dashboards
Real-time analytics
Advanced AI-powered insights
Predictive churn analysis
Course recommendation system
Automated business reports
Advanced user segmentation
More interactive dashboard filters
Automated anomaly detection
👩‍💻 Author

Anaya Kalap

B.Tech Computer Science Engineering

Interested in:

Data Analytics
Data Science
SQL
Business Intelligence
Machine Learning

⭐ If you found this project interesting, feel free to explore the repository and the live dashboard.
