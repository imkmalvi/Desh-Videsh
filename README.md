# 🌍 Desh-Videsh — Travel Discovery Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge&logo=netlify)](https://desh-videsh.netlify.app/)
[![React](https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)

> A full-stack travel discovery platform to explore destinations across countries and cities — built with React.js, Node.js, Express, and MongoDB.

---

## 🚀 Live Demo

🔗 **[https://desh-videsh.netlify.app/](https://desh-videsh.netlify.app/)**

---

## 📸 Features

- 🔍 **Destination Search** — Search and explore destinations by country and city
- 🔐 **User Authentication** — Secure JWT-based login and signup system
- 📱 **Responsive UI** — Seamless experience across mobile, tablet, and desktop
- ✏️ **CRUD Operations** — Add, edit, and delete destinations
- ☁️ **Cloud Deployment** — Frontend on Netlify, Database on MongoDB Atlas

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|---|---|
| React.js | UI components and routing |
| React Hooks (useState, useEffect) | State management |
| CSS3 / Responsive Design | Styling and layout |
| Fetch API | API communication |

### Backend
| Technology | Usage |
|---|---|
| Node.js | Server runtime |
| Express.js | REST API framework |
| MongoDB Atlas | Cloud database |
| JWT (JSON Web Token) | User authentication |
| bcrypt | Password hashing |

---

## 📁 Project Structure

```
desh-videsh/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── App.js          # Main app component
│   └── public/
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── models/             # MongoDB models
│   ├── middleware/         # Auth middleware
│   └── index.js            # Server entry point
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v16 or above)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/imkmalvi/desh-videsh.git
cd desh-videsh
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. **Setup environment variables**

Create `.env` file in `/server`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. **Run the application**
```bash
# Start backend (from /server)
npm start

# Start frontend (from /client)
npm start
```

5. **Open in browser**
```
http://localhost:3000
```

---

## 🔐 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Destination Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/destinations` | Get all destinations |
| GET | `/api/destinations/:id` | Get single destination |
| POST | `/api/destinations` | Add new destination |
| PUT | `/api/destinations/:id` | Update destination |
| DELETE | `/api/destinations/:id` | Delete destination |

---

## 🌟 Key Learnings

- Built a complete **full-stack application** from scratch
- Implemented **JWT authentication** with protected routes
- Learned **RESTful API design** with Express.js
- Worked with **MongoDB Atlas** for cloud database
- Deployed a production-ready app on **Netlify**

---

## 👨‍💻 Author

**Kamlesh Malvi**
- 📧 Email: [kmalvi2012@gmail.com](mailto:kmalvi2012@gmail.com)
- 💼 LinkedIn: [linkedin.com/in/imkmalvi](https://linkedin.com/in/imkmalvi)
- 🐙 GitHub: [github.com/imkmalvi](https://github.com/imkmalvi)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **If you found this project helpful, please give it a star!**
