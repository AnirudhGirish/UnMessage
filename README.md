# UnMessage 📩  
UnMessage is a secure, authentication-based anonymous messaging platform built using **Next.js, NextAuth.js, TypeScript, and MongoDB**. It allows users to receive anonymous messages while ensuring account security through authentication and email verification.  This project supports **user authentication, messaging, and a clean UI** for seamless user interaction.

## 🚀 Features  
🔐 Secure Authentication (NextAuth.js with Credentials Provider)

📨 Email Verification for new users

🕵️ Anonymous Messaging (Authenticated users can receive anonymous messages)

🏠 Protected Dashboard for logged-in users to view messages

🎨 Modern UI built with Tailwind CSS

🔄 Persistent Login State with JWT-based sessions

🚀 Fast and Scalable (Next.js API Routes + MongoDB)


### Details: 

- **Authentication**: Login/Signup using **NextAuth (Credentials Provider)**  
- **Session Management**: JWT-based session handling  
- **Messaging System**: Secure message exchange  
- **User Verification**: Email verification before accessing messages  
- **Database**: MongoDB with Mongoose ORM  
- **API Routes**: Next.js API routes for authentication & message operations  
- **UI Framework**: TailwindCSS for modern styling  


## 🛠️ Installation & Setup  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/unmessage.git
cd unmessage
```
### 2️⃣ Install Dependencies
```bash
npm install
# or
yarn install
```
### 3️⃣ Configure Environment Variables
Create a .env.local file and add the following:

```bash
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://your_mongo_url
```
### 4️⃣ Run the Development Server
```bash
npm run dev
# or
yarn dev
```

The app should now be running at http://localhost:3000 🎉

## 🔐 Authentication Flow
Sign Up → User chooses a username and submits email and password

Verify Account → User verifies account using OTP

Sign In → User logs in with email & password

Session Handling → NextAuth manages session with JWT

Message Access → Only verified users can receive messages

Messaging → Any user with the link can send messages

Logout → User session is cleared, redirecting to homepage

## 📡 API Routes

### 🔹 Authentication

| Method | Route                       | Description                                         |
|--------|-----------------------------|-----------------------------------------------------|
| POST   | `/api/sign-up`              | Handles sign up                                     |
| POST   | `/api/auth`                 | Handles login/logout                                |
| GET    | `/api/auth`                 | Retrieves user session                              |
| GET    | `api/check-username-unique` | Checks fir the uniqueness of username while sign up |

### 🔹 Anonymous Messaging
| Method | Route                   | Description                        |
|--------|-------------------------|------------------------------------|
| POST   | `/api/send-message`     | Send an anonymous message          |
| POST   | `/api/suggest-messages` | Gets AI message suggestions        |

### 🔹 Message Access
| Method | Route                   | Description                           |
|--------|-------------------------|---------------------------------------|
| GET    | `/api/get-messages`     | Retrieve received messages            |
| DELETE | `/api/delete-message`   | Delete a message                      |
| GET    | `/api/accept-messages`  | Retrive message acceptance status     |
| POST   | `/api/accept-messages`  | Handles status of message acceptance  |


## 🏆 Contributing

Want to improve UnMessage?

We welcome contributions! To contribute:

- Fork the repository.

- Create a feature branch (git checkout -b feature-xyz).

- Commit your changes (git commit -m "Added feature xyz").

- Push to your branch (git push origin feature-xyz).

- Open a Pull Request.

## 📜 License

This project is open-source and free to use.

- Built using Next.js, Typescript, Tailwind, ShadCN & MongoDB

## Contact

For questions or suggestions, reach out:

📧 Email: anirudhgirish08@gmail.com
