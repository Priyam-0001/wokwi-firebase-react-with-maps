// src/components/ReportSelector.jsx
import React, { useState } from "react";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";
import { ChevronDown } from "lucide-react";

dayjs.extend(updateLocale);
dayjs.extend(localeData);
dayjs.updateLocale('en', { months: [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] });

const ReportSelector = ({ reportType, setReportType, selectedDate, setSelectedDate }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const showDatePicker = reportType !== "live";

  const getDateLabel = () => {
    if (reportType === "year") return selectedDate.format("YYYY");
    if (reportType === "month") return selectedDate.format("MMMM YYYY");
    if (reportType === "day") return selectedDate.format("DD MMM, YYYY");
    return "";
  };

  const renderDateDropdownOptions = () => {
    if (reportType === "year") {
      const years = Array.from({ length: 10 }, (_, i) => dayjs().year() - i);
      return years.map((year) => (
        <div
          key={year}
          onClick={() => {
            setSelectedDate(dayjs(selectedDate).year(year));
            setDateDropdownOpen(false);
          }}
          className={`px-4 py-2 text-white cursor-pointer hover:bg-indigo-600 ${selectedDate.year() === year ? 'bg-indigo-700' : ''}`}
        >
          {year}
        </div>
      ));
    }
    if (reportType === "month") {
      const months = dayjs.localeData().months();
      return months.map((month, i) => (
        <div
          key={month}
          onClick={() => {
            setSelectedDate(dayjs(selectedDate).month(i));
            setDateDropdownOpen(false);
          }}
          className={`px-4 py-2 text-white cursor-pointer hover:bg-indigo-600 ${selectedDate.month() === i ? 'bg-indigo-700' : ''}`}
        >
          {month}
        </div>
      ));
    }
    if (reportType === "day") {
      const days = Array.from({ length: 31 }, (_, i) => i + 1);
      return days.map((day) => (
        <div
          key={day}
          onClick={() => {
            setSelectedDate(dayjs(selectedDate).date(day));
            setDateDropdownOpen(false);
          }}
          className={`px-4 py-2 text-white cursor-pointer hover:bg-indigo-600 ${selectedDate.date() === day ? 'bg-indigo-700' : ''}`}
        >
          {day.toString().padStart(2, '0')}
        </div>
      ));
    }
    return null;
  };

  return (
    <div className="bg-[#1f1b44] p-6 rounded-2xl shadow-lg border border-[#2a255c]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Report Type Selector */}
        <div className="flex flex-col w-full md:w-1/2 relative">
          <label htmlFor="reportType" className="mb-2 text-sm font-medium text-gray-300">
            Select Report Type
          </label>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#2d2d51] text-white border border-[#3b3b5b] rounded-lg px-4 py-2 w-full text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)}
          </button>
          {dropdownOpen && (
            <div className="absolute top-[100%] mt-1 w-full bg-[#2d2d51] border border-[#3b3b5b] rounded-lg shadow-lg z-10">
              {['live', 'year', 'month', 'day'].map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    setReportType(type);
                    setDropdownOpen(false);
                  }}
                  className={`px-4 py-2 text-white cursor-pointer hover:bg-indigo-600 ${reportType === type ? 'bg-indigo-700' : ''}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Selector with Dropdown */}
        {showDatePicker && (
          <div className="flex flex-col w-full md:w-1/2 relative">
            <label className="mb-2 text-sm font-medium text-gray-300">
              Selected {reportType.charAt(0).toUpperCase() + reportType.slice(1)}
            </label>
            <div
              className="flex items-center bg-[#2d2d51] text-white border border-[#3b3b5b] rounded-lg px-4 py-2 justify-between cursor-pointer"
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            >
              <span className="mx-2 text-sm font-semibold tracking-wide">{getDateLabel()}</span>
              <ChevronDown size={18} />
            </div>
            {dateDropdownOpen && (
              <div className="absolute top-[100%] mt-1 w-full bg-[#2d2d51] border border-[#3b3b5b] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent">
                {renderDateDropdownOptions()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSelector;
