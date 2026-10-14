# 🛡️ מערכת ניהול מיגוניות

מערכת לניהול, איתור ודיווח על מיגוניות, המאפשרת למשתמשים למצוא מיגוניות קרובות, להציע מיגוניות חדשות, לשלוח בקשות לאישור מיגוניות וליצור קשר עם מנהלי המערכת.

---

## 🏗️ מבנה הפרויקט

```text
ShelterSite/
│
├── client/                         — צד לקוח (React)
│   ├── public/                     — קבצים סטטיים
│   ├── src/
│   │   ├── Components/             — כל הקומפוננטות
│   │   ├── Style/
│   │   │   └── CssPages/           — קובצי CSS
│   │   ├── App.css
│   │   ├── App.js                  — הגדרות Routes
│   │   ├── index.css
│   │   ├── index.js
│   │   └── Service.js              — קריאות לשרת
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── server/                         — צד שרת (Node.js & Express)
│   ├── dataBase/                   — שכבת מסד הנתונים
│   │   ├── sqlTables/              — קובצי יצירת טבלאות SQL
│   │   ├── addresses.txt           — רשימת כתובות
│   │   ├── ConnectToDB.js          — התחברות ל-DB
│   │   ├── CreateDB.js             — יצירת בסיס הנתונים
│   │   ├── CreateTables.js         — יצירת טבלאות
│   │   ├── Drop.js                 — מחיקת טבלאות
│   │   ├── GeocodeAddresses.js     — המרת כתובות לקואורדינטות
│   │   ├── Initialize.js           — אתחול ראשוני
│   │   └── sheltersCoordinates.json
│   ├── routs/                      — Routes של Express
│   ├── services/                   — לוגיקה וגישה למסד הנתונים
│   ├── .env
│   ├── .gitignore
│   ├── NewShelterAdress.js         — פונקציות עזר לכתובות
│   ├── package.json
│   ├── package-lock.json
│   └── Server.js                   — הפעלת השרת
│
└── README.md
```

---

## ✨ פונקציונליות

### 👤 משתמש רגיל

- הרשמה למערכת
- התחברות למערכת
- צפייה בפרופיל אישי
- צפייה בבקשות שהגיש
- הצעת מיגונית חדשה
- צפייה במיגוניות במפה
- יצירת מסלול הליכה למיגונית
- שליחת הודעות למנהלי המערכת

### 🛠️ מנהל מערכת

- אישור או דחיית מיגוניות
- הוספת מיגוניות ישירות למערכת
- צפייה בכל הבקשות
- ניהול משתמשים
- הוספת משתמשים
- עריכת משתמשים
- מחיקת משתמשים
- קבלת הודעות ממשתמשים
- מענה לפניות

---

## 🗄️ בסיס הנתונים

המערכת מבוססת על MySQL.

### users

| שדה | סוג |
|------|------|
| userId | INT |
| userName | VARCHAR |
| email | VARCHAR |
| phone | VARCHAR |
| userRole | VARCHAR |

### passwords

| שדה | סוג |
|------|------|
| userId | INT |
| passwordHash | VARCHAR |

### shelters

| שדה | סוג |
|------|------|
| shelterId | INT |
| shelterName | VARCHAR |
| address | VARCHAR |
| latitude | DOUBLE |
| longitude | DOUBLE |
| type | VARCHAR |
| createdByUserId | INT |
| status | VARCHAR |

### messages

| שדה | סוג |
|------|------|
| messageId | INT |
| senderUserId | INT |
| senderName | VARCHAR |
| receiverUserId | INT |
| subject | VARCHAR |
| content | TEXT |
| status | VARCHAR |
| createdAt | DATETIME |

---

## 🛠️ טכנולוגיות

| טכנולוגיה | שימוש |
|-----------|--------|
| React | צד לקוח |
| React Router | ניתוב |
| React Toastify | הודעות מערכת |
| Google Maps API | מפות וניווט |
| Node.js | צד שרת |
| Express | API |
| MySQL | בסיס נתונים |
| Axios / Fetch | תקשורת Client-Server |
| CSS | עיצוב |

---

## 🚀 הרצת הפרויקט

### דרישות מקדימות

- Node.js
- MySQL
- Git

---

### הורדת הפרויקט

```bash
git clone <repository-url>
```

---

### התקנת צד שרת

```bash
cd server
npm install
```

יצירת קובץ:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sheltersdb
```

הפעלת השרת:

```bash
npm start
```

---

### התקנת צד לקוח

```bash
cd client
npm install
```

יצירת קובץ:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY
```

הפעלת הפרויקט:

```bash
npm start
```

---

## 📁 ארכיטקטורה

```text
React Client
      ↓
Express Routes
      ↓
Services Layer
      ↓
MySQL Database
```

הפרויקט בנוי במבנה שכבות כדי להפריד בין:

- ממשק המשתמש
- הלוגיקה העסקית
- הגישה למסד הנתונים

---

## 📸 צילומי מסך

### מסך התחברות

![Login](screenshots/login.png)

### דשבורד משתמש

![Dashboard](screenshots/dashboard.png)

### ניהול מיגוניות

![Shelters](screenshots/shelters.png)

### מפה

![Map](screenshots/map.png)

---

## 👩‍💻 יוצרת הפרויקט

יהודית ברוכי

פרויקט גמר בנושא ניהול ואיתור מיגוניות באמצעות React, Node.js, MySQL ו-Google Maps.
