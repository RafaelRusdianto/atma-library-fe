import { useEffect, useState } from "react";
import api from "../../../config/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Reports.css";

export default function ReportPeminjamanHarian() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/petugas/peminjaman-per-hari")
      .then((res) => setData(res.data.data || []))
      .catch((err) => console.error("Error fetching report:", err));
  }, []);

  return (
    <div className="report-container">
      <h2 className="report-title">Laporan Peminjaman Buku Per Hari</h2>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tanggal" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
