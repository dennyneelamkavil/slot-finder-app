import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
  process.exit(1);
});

async function seed() {
  // 1. participants
  const participants = {
    1: { name: "Adam", threshold: 4 },
    2: { name: "Bosco", threshold: 4 },
    3: { name: "Catherine", threshold: 5 },
  };
  await redis.set("participants", JSON.stringify(participants));

  // 2. participantAvailability
  const participantAvailability = {
    1: {
      Monday: [
        { start: "09:00", end: "11:00" },
        { start: "14:00", end: "16:30" },
      ],
      Tuesday: [{ start: "09:00", end: "18:00" }],
      Wednesday: [{ start: "09:00", end: "18:00" }],
      Friday: [{ start: "09:00", end: "18:00" }],
    },
    2: {
      Monday: [{ start: "09:00", end: "18:00" }],
      Tuesday: [{ start: "09:00", end: "11:30" }],
      Wednesday: [{ start: "09:00", end: "18:00" }],
      Friday: [{ start: "09:00", end: "18:00" }],
    },
    3: {
      Monday: [{ start: "09:00", end: "18:00" }],
      Tuesday: [{ start: "09:00", end: "18:00" }],
    },
  };
  await redis.set(
    "participantAvailability",
    JSON.stringify(participantAvailability)
  );

  // 3. schedules
  const schedules = {
    1: {
      "28/05/2025": [
        { start: "09:30", end: "10:30" },
        { start: "15:00", end: "16:30" },
      ],
    },
    2: {
      "28/05/2025": [{ start: "13:00", end: "13:30" }],
      "29/05/2025": [{ start: "09:00", end: "10:30" }],
    },
  };
  await redis.set("schedules", JSON.stringify(schedules));

  console.log("✅ Redis seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
