# 🕒 Slot Finder App

This is a scheduling tool built with **Next.js** that helps you find common available time slots between participants based on their availability and scheduled meetings. Data is stored in **Redis**, and you can easily check overlapping availability between selected participants within a date range.

---

## ✨ Features

- Select multiple participants from a dropdown.
- Pick a start and end date.
- View available 30-minute slots between 9 AM and 6 PM.
- Detects conflicts with existing schedules.
- Respects participant thresholds (max allowed meetings per day).

---

## 🚀 Getting Started

### 1. Clone the repository

### 2. Install dependencies

```bash
npm install
```

💡 **Note**: If you face dependency version conflicts (especially with `react-datepicker` or `react-multi-select-component`), use the following command instead:

```bash
npm install ioredis react-datepicker react-multi-select-component --legacy-peer-deps
```

### 3. Set up Redis

You need access to a Redis instance. You can use:

- [Redis Cloud](https://redis.com/try-free/)
- A local Redis server (`brew install redis` on macOS)

Then, create a `.env.local` file:

```
REDIS_URL=your_redis_connection_string
```

### 4. Scripts in `package.json`

Your `package.json` includes the following useful scripts:

```json
"scripts": {
  "seed": "node scripts/seed.js",
  "dev": "npm run seed && next dev"
}
```

So when you run the development server, it will automatically seed the database first.

### 5. Run the app in development

```bash
npm run dev
```

Visit `http://localhost:3000/participant/availability` to use the app.

---

## 🧠 Logic Breakdown

- **participants**: Basic participant data like name and daily threshold.
- **availability**: Weekly recurring availability per participant.
- **schedules**: Specific date-based meetings to avoid overlaps.
- **Threshold check**: Ensures a participant doesn’t exceed max slots/day.
- **Slot check**: Time blocks are 30-min chunks from 9 AM to 6 PM.

---

## 💠 Tech Stack

- [Next.js](https://nextjs.org/)
- [React Multi Select](https://www.npmjs.com/package/react-multi-select-component)
- [React Datepicker](https://reactdatepicker.com/)
- [Redis](https://redis.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🗃 Sample Seed Data

- **Participants**:
  - Adam (threshold: 4)
  - Bosco (threshold: 4)
  - Catherine (threshold: 5)
- **Availability**:
  - Monday & Tuesday schedules
- **Pre-scheduled meetings** on specific dates (e.g., 28/05/2025)

You can find this logic in `scripts/seed.js`.

---

## 📁 Project Structure

```
.
├── app/
│   └── participant/
│       └── availability/page.jsx   # Main page logic
│       └── availability/ClientForm.jsx  # Client-side form
├── scripts/
│   └── seed.js                     # Seeds Redis with demo data
├── .env.local                      # Redis connection config
├── package.json
└── README.md
```

---

## 🤛 Author

Made with ❤️ by Denny N J. Enjoy scheduling smarter!
