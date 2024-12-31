# Timely
Timely is a comprehensive task management web application designed to facilitate efficient task organization, assignment, tracking, and collaboration within teams or organizations.

The task management system serves as a centralized platform for users to create, assign, prioritize, and monitor tasks, ensuring effective project management and workflow optimization. Its primary purpose is to streamline task management processes, enhance productivity, and improve team collaboration by providing features such as task creation, assignment, due date tracking, progress monitoring, and communication tools.

## Features

### User Management
- **User Registration**  
  - The system allows individuals to create new accounts by providing necessary information such as email address and password.  
  - Upon successful registration, user data is securely stored in the database.
  
- **User Login**  
  - Registered users can securely log in using their credentials (i.e., email and password).  
  - Secure authentication through providers such as Google and GitHub is also supported.

- **User Roles and Permissions**  
  - Different user roles include admin, manager, and team member, each with predefined permissions.  
  - Admin users have the highest level of access to manage users, roles, and system settings.

### Task Management
- **Task Creation**  
  - Users can create new tasks with relevant details such as title, description, due date, priority, and assignee.  
  - Tasks are stored in a centralized database and displayed in a task list.

- **Task Assignment**  
  - Tasks can be assigned to team members by users with appropriate permissions (e.g., managers, admins).  
  - Notifications are sent to assignees upon task assignment.

- **Task Tracking**  
  - A dashboard provides a visual representation to track task progress.  
  - Task statuses (e.g., pending, in progress, completed) can be updated in real-time.

- **Task Filtering and Sorting**  
  - Users can filter and sort tasks based on criteria such as tags, due date, priority, and assignee.

### Collaboration and Communication
- **Collaboration Features**  
  - Comments, file attachments, and discussions are supported to enhance collaboration.  
  - Users can add updates and share information directly within tasks.

### Miscellaneous Features
- **Notifications and Reminders**  
  - Notifications alert users about task assignments, updates, and deadlines.
  
- **Integration with External Tools**  
  - The system integrates with calendars, project management tools, and communication platforms for seamless workflows.

## Important Documents and Links
- [Live website](https://task.thearc.tech)
- [System Requirements Document](https://docs.google.com/document/d/1rTYxRgNTZVpW4h4aP3Nxr-lczjK0rjVaKvt7FAQbNYo/edit?usp=sharing)
- [System Design Document](https://docs.google.com/document/d/1clAEO7TsbToT7P--Wd2B1eGHCl_JWfyZvAi-Hugc9e8/edit?usp=sharing)
- [User Interface Design](https://www.figma.com/file/ODgHEzMrPy67yLTthphwNT/Timely---Task-Management-System?type=design&node-id=0%3A1&mode=design&t=P4GLk9fUtJynRcZ1-1)
- [Software Testing and Quality Assurance](https://docs.google.com/document/d/1qPcSxKjMxjceWqE9CutCcPI1hlWh1MG-9pBpwWzgxzk/edit?usp=sharing)
- [User Documentation Manual](https://docs.google.com/document/d/1wyD5pFXpIl0kVHvaZyFnDELNIHgUHLQpRKP66sEOwrg/edit?usp=sharing)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Developers
| Name              | ID         |
|-------------------|------------|
| Ararsa Derese     | ETS0152/13 |
| Birhanu Worku     | ETS0279/13 |
| Biruk Mesfin      | ETS0290/13 |
| Bisrat Kebere     | ETS0306/13 |
| Biyaol Mesay      | ETS0309/13 |