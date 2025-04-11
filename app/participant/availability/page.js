import Redis from "ioredis";
import ClientForm from "./ClientForm";

export default async function AvailabilityPage({ searchParams }) {
  const { participants = "", start, end } = await searchParams;
  const selected = participants ? participants.split(",").map(Number) : [];

  const redis = new Redis(process.env.REDIS_URL);
  const [participantBuf, availabilityBuf, schedulesBuf] = await Promise.all([
    redis.get("participants"),
    redis.get("participantAvailability"),
    redis.get("schedules"),
  ]);

  const participantsData = JSON.parse(participantBuf || "{}");
  const availability = JSON.parse(availabilityBuf || "{}");
  const schedules = JSON.parse(schedulesBuf || "{}");

  function parseTime(hm, date) {
    const [h, m] = hm.split(":").map(Number);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
  }

  function format(dt) {
    return dt.toTimeString().slice(0, 5);
  }

  function findSlots() {
    if (!start || !end || selected.length === 0) return {};
    const slotsByDate = {};
    const startDate = new Date(start);
    const endDate = new Date(end);

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateKey = date.toLocaleDateString("en-GB");
      const slots = [];

      for (let hour = 9; hour < 18; hour++) {
        // limit to working hours
        for (let min of [0, 30]) {
          const slotStart = new Date(date);
          slotStart.setHours(hour, min, 0, 0);
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + 30);

          const ok = selected.every((id) => {
            const dayName = slotStart.toLocaleDateString("en-US", {
              weekday: "long",
            });
            const blocks = availability[id]?.[dayName] || [];
            const isWithin = blocks.some(
              (block) =>
                slotStart >= parseTime(block.start, date) &&
                slotEnd <= parseTime(block.end, date)
            );
            if (!isWithin) return false;

            const busy = schedules[id]?.[dateKey] || [];
            const conflict = busy.some(
              (block) =>
                slotStart < parseTime(block.end, date) &&
                slotEnd > parseTime(block.start, date)
            );
            if (conflict) return false;

            const used = busy.length;
            return used < participantsData[id].threshold;
          });

          if (ok) {
            slots.push(`${format(slotStart)}–${format(slotEnd)}`);
          }
        }
      }

      if (slots.length > 0) {
        slotsByDate[dateKey] = slots;
      }
    }

    return slotsByDate;
  }

  const slots = findSlots();

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-center">
        <a href="/participant/availability">Check Availability</a>
      </h1>
      <ClientForm
        participants={participantsData}
        selected={selected}
        start={start}
        end={end}
      />
      <hr className="my-6 border-gray-300" />
      {Object.keys(slots).length > 0 && (
        <div className="space-y-6 border p-6 rounded-lg shadow-md bg-yellow-50">
          <h2 className="text-2xl mb-4 text-center font-bold underline">
            Available Slots
          </h2>
          {Object.entries(slots).map(([date, times]) => (
            <div key={date}>
              <h3 className="text-xl font-medium mb-2">{date} : </h3>
              <div className="flex flex-wrap gap-3">
                {times.map((time) => (
                  <span
                    key={time}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm shadow font-semibold"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
