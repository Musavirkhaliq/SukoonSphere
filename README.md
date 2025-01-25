SukoonSphere is an innovative digital platform designed to address critical gaps in mental health awareness, education, and access to care. Through both a website and mobile app, SukoonSphere aims to create a comprehensive and supportive environment where users can access information, connect with professionals, and engage in meaningful discussions about mental health. The platform will serve as a hub for individuals seeking support, professionals looking to enhance their skills, and institutions aiming to collaborate with experts.

Project Objectives:
1.	Increase Mental Health Awareness: Provide accessible, engaging content that educates the public on mental health issues, treatments, and wellness practices.
2.	Create a Safe Space for Dialogue: Facilitate open conversations between individuals affected by mental health issues and those seeking to understand them better, especially students.
3.	Facilitate Professional Connections: Connect mental health experts with institutions and individuals in need of their services.
4.	Enhance Professional Skills: Offer resources and training for current and aspiring mental health professionals.
5.	Reduce Mental Health Stigma: Encourage open discussions, storytelling, and shared experiences to reduce the stigma associated with mental health.

Key Features:
1.	Curated Articles on Mental Health Topics:
•	A diverse collection of articles providing in-depth insights into various mental health issues, treatments, and wellness practices.
2.	Interactive Neuroscience Content:
•	Engaging, educational content that explores the brain's role in mental health, designed to be accessible and informative for all users.
3.	Expert-Institution Matchmaking System:
•	A feature that connects mental health experts with institutions in need of their services, fostering professional collaboration and enhancing care delivery.
4.	Therapist Training Portal:
•	A resource-rich portal offering training and development opportunities for aspiring and current mental health professionals, supporting their ongoing education and skill enhancement.
5.	Resource Directory for Seeking Help:
•	A comprehensive directory of mental health resources, including contact information for therapists, clinics, and support groups, ensuring users can easily find the help they need.
6.	Share a Story:
•	A section where users can share personal experiences with mental health, offering support and connection within the community, and encouraging others to share their own stories.
7.	Create and Share Videos:
•	A platform for users and experts to create and share video content related to mental health, including tips, therapy sessions, meditation guides, and personal experiences.
8.	Podcasts:
•	A dedicated space for hosting and listening to mental health podcasts, featuring expert insights, personal stories, and educational discussions.
9.	Debates and Discussions:
•	An interactive forum where users can engage in debates and discussions on mental health issues, moderated by professionals to ensure a safe and respectful environment.
10.	Write and Publish Articles:
•	A feature that allows users and professionals to write and publish articles on mental health topics, contributing to a diverse and ever-growing knowledge base.
11.	Virtual Support Groups:
•	Facilitated online support groups where individuals facing similar mental health challenges can connect and support each other, guided by professional facilitators.
12.	Mental Health Challenges:
•	Regular challenges that encourage users to engage in positive mental health practices, such as mindfulness, journaling, or exercise, promoting proactive self-care.
13.	Interactive Webinars and Workshops:
•	Live sessions led by mental health experts, covering a wide range of topics and available to both the general public and professionals, enhancing knowledge and skills.
14.	Mental Health Resource Library:
•	A comprehensive library of books, articles, videos, and other resources, categorized by mental health topics, providing users with easy access to reliable information.
15.	Expert Q&A Sessions:
•	Regular live Q&A sessions with mental health professionals, offering users direct access to expert advice and personalized guidance.
16.	Mental Health Journal:
•	A secure, private journal feature where users can track their thoughts, moods, and progress over time, encouraging self-reflection and mental health monitoring.





        


/*/*/*/*/*/**/*/*/*/*/*  Website Deployment Process  /*/*/*/*/*/**/*/*/*/*/*

/*/*/*/*/**/*/*/*/* Prerequistes /*/*/*/*/*/**/*/
Step 1- Copy github repository(if not copied yet).
        command: git clone github_repo_url

Step 2- Navigate to repository.
        command: code folder_name

Step 3- Setup node modules.
        command: npm i (both in client and BE)

Step 4- Create build version of client.
        command: npm run build

/*/*/*/*/**/*/*/*/* VPS commands- Deploy website /*/*/*/*/*/**/*/


Step 1- Check Running Processes:
        command: ps aux | grep node

Step 2- Identify running Node.js processes.

Step 3- Terminate process if any:
        command: sudo kill processId-PID(eg. 182928)

Step 4- Clear Log File:
        command rm nohup.out

Step 5- Remove the nohup.out log file to start fresh.
        Optional- Restart Server:
        reboot

Step 6-  Launch the Node.js server application in the background.
        command: nohup node server.js & (run command in BE)

Step 7- Start a preview server for the application on the host machine.
        command: nohup pnpm preview --host &

Step 8- Exit terminals.
        command: exit

/*/*/*/*/**/*/*/*/* Database commands-  /*/*/*/*/**/*/
Check mongoDb.
        command: mongosh
Show database.
        command: show dbs
Use database or clustures.
        command: use --clusture or db name

/*/*/*/*/**/*/*/*/* Clone and backup local Database /*/*/*/*/*/**/*/
Clone database.
        command: mongodump --out "." --host loacalhost --port27017
Copy to folder.
        command: chmod +x backup.sh


