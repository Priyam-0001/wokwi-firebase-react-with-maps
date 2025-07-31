// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "../firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ReportSelector from "./ReportSelector";
import MapComponent from "./MapComponent";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatIST = (ts) => dayjs(ts).tz("Asia/Kolkata");

const groupBy = (data, unit) => {
  const grouped = {};
  data.forEach(({ timestamp, temperature, humidity }) => {
    const key = formatIST(timestamp).startOf(unit).format("YYYY-MM-DD HH:mm");
    if (!grouped[key]) grouped[key] = { count: 0, tempSum: 0, humSum: 0 };
    grouped[key].count++;
    grouped[key].tempSum += temperature;
    grouped[key].humSum += humidity;
  });
  return Object.entries(grouped).map(([key, val]) => ({
    timestamp: key,
    temperature: +(val.tempSum / val.count).toFixed(2),
    humidity: +(val.humSum / val.count).toFixed(2),
  }));
};

const getTickFormatter = (type) => {
  if (type === "year") return (value) => dayjs(value).format("MMM");
  if (type === "month") return (value) => dayjs(value).format("DD");
  if (type === "day") return (value) => dayjs(value).format("HH:mm");
  return (value) => dayjs(value).format("HH:mm:ss");
};

const ChartBlock = ({ title, dataKey, stroke, data, tickFormatter }) => (
  <div className="bg-[#1b1840] rounded-xl shadow-md p-4">
    <div className="text-xl font-semibold flex justify-center pb-5 pt-2 text-white">
      {title}
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 40 }}>
        <CartesianGrid stroke="#555" strokeDasharray="4 4" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={tickFormatter}
          tick={{ fill: "white", fontSize: 12 }}
          minTickGap={40}
          height={50}
        />
        <YAxis
          tick={{ fill: "white", fontSize: 12 }}
          allowDecimals={false}
          domain={[0, 'auto']}
        />
        <Tooltip
          labelFormatter={(label) => dayjs(label).format("YYYY-MM-DD HH:mm:ss")}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const Dashboard = () => {
  const [rawData, setRawData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState("live");
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    const dhtRef = ref(database, "dhtLogs");
    onValue(dhtRef, (snapshot) => {
      const logs = snapshot.val();
      if (!logs) return;

      const parsed = Object.entries(logs).map(([id, entry]) => ({
        id,
        temperature: entry.temperature,
        humidity: entry.humidity,
        latitude: entry.latitude,
        longitude: entry.longitude, 
        timestamp: dayjs(entry.timestamp).toISOString(),
      }));

      const sorted = parsed.sort((a, b) =>
        dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix()
      );

      setRawData(sorted);
    });
  }, []);

  useEffect(() => {
    if (reportType === "live") {
      setReportData(rawData.slice(-10));
    } else if (reportType === "year") {
      const yearData = rawData.filter(entry =>
        formatIST(entry.timestamp).year() === selectedDate.year()
      );
      setReportData(groupBy(yearData, "month"));
    } else if (reportType === "month") {
      const monthData = rawData.filter(entry =>
        formatIST(entry.timestamp).year() === selectedDate.year() &&
        formatIST(entry.timestamp).month() === selectedDate.month()
      );
      setReportData(groupBy(monthData, "day"));
    } else if (reportType === "day") {
      const dayData = rawData.filter(entry =>
        formatIST(entry.timestamp).format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD")
      );
      setReportData(groupBy(dayData, "hour"));
    }
  }, [reportType, selectedDate, rawData]);

  const tickFormatter = getTickFormatter(reportType);
  console.log(`Data being passed to MapComponent: ${rawData.latitude, rawData.longitude}`);

  return (
    <div className="p-6 bg-[#16113a] text-white min-h-screen">
      <div className="text-xl font-bold text-center mb-4">📊 DHT22 Dashboard Report</div>

      <ReportSelector
        reportType={reportType}
        setReportType={setReportType}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-4">
        <ChartBlock
          title="🌡️ Temperature (°C)"
          dataKey="temperature"
          stroke="#ef4444"
          data={reportData}
          tickFormatter={tickFormatter}
        />
        <ChartBlock
          title="💧 Humidity (%)"
          dataKey="humidity"
          stroke="#3b82f6"
          data={reportData}
          tickFormatter={tickFormatter}
        />
      </div>
      <div>
        <MapComponent coordinates={rawData} />
      </div>
    </div>
  );
};

export default Dashboard;
