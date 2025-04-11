"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ClientForm({ participants, selected, start, end }) {
  const router = useRouter();

  const options = Object.entries(participants).map(([id, participant]) => ({
    label: participant.name,
    value: Number(id),
  }));

  const [chosen, setChosen] = useState(
    options.filter((opt) => selected.includes(opt.value))
  );
  const [startDate, setStartDate] = useState(start ? new Date(start) : null);
  const [endDate, setEndDate] = useState(end ? new Date(end) : null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (endDate < startDate) {
      alert("End date must be later than the start date.");
      return;
    }
    router.push(
      `/participant/availability?participants=${chosen
        .map((c) => c.value)
        .join(
          ","
        )}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <div>
        <label className="block mb-1 font-medium">Select Participants</label>
        <MultiSelect
          options={options}
          value={chosen}
          onChange={setChosen}
          labelledBy="Select"
          className="rounded border border-gray-300"
          overrideStrings={{
            allItemsAreSelected: "Everyone Selected",
            selectSomeItems: "Select Participants",
            search: "Search...",
            noOptions: "No Participants Found",
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholderText="Select start date"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholderText="Select end date"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!startDate || !endDate || chosen.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
      >
        Check Availability
      </button>
    </form>
  );
}
