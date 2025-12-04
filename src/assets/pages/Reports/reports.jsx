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
  BarChart,
  Bar,
} from "recharts";
import "./Reports.css";

export default function ReportsPage() {
  const [summary, setSummary] = useState({});
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [volumeByCategory, setVolumeByCategory] = useState([]);
  const [loans, setLoans] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summaryRes, catRes, loansRes, finesRes] = await Promise.all([
          api.get("/petugas/reports/summary"),
          api.get("/petugas/reports/borrowing-by-category"),
          api.get("/petugas/reports/loans"),
          api.get("/petugas/reports/fines"),
        ]);

        const summaryPayload =summaryRes.data;
        const catPayload = catRes.data;

        console.log(catPayload.data);
        console.log(summaryPayload.data);

        setSummary(summaryPayload);
        setMonthlyTrend(catPayload.monthly_trend || []);
        setVolumeByCategory(catPayload.volume_by_category || []);
        setLoans(loansRes.data?.data || []);
        setFines(finesRes.data?.data || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Gagal memuat laporan. Coba muat ulang.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const formatNumber = (num) =>
    typeof num === "number"
      ? num.toLocaleString("en-US")
      : (parseInt(num, 10) || 0).toLocaleString("en-US");

  return (
    <div className="report-container">
      <div className="report-header">
        <div>
          <h2 className="report-title">Library Reports</h2>
          <p className="report-subtitle">
            Borrowing summary, categories, and latest fine transactions.
          </p>
        </div>
      </div>

      {error && <p className="report-error">{error}</p>}

      <div className="report-kpi-grid">
        <div className="kpi-card">
          <p className="kpi-label">Total Books</p>
          <p className="kpi-value">
            {loading ? "-" : formatNumber(summary.total_buku)}
          </p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Total Members</p>
          <p className="kpi-value">
            {loading ? "-" : formatNumber(summary.total_member)}
          </p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Active Loans</p>
          <p className="kpi-value">
            {loading ? "-" : formatNumber(summary.detail_aktif)}
          </p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Total Fines Collected</p>
          <p className="kpi-value">
            {loading ? "-" : `Rp ${formatNumber(summary.total_denda_bayar)}`}
          </p>
        </div>
      </div>

      <div className="report-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="report-subtitle">Borrowing Trend</h3>
            <p className="report-caption">Total loans per month</p>
          </div>
          <div className="chart-wrapper">
            <div className="chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrend}
                  margin={{ top: 8, right: 16, left: -6, bottom: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="bulan"
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Total Loans"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="report-subtitle">Loans by Category</h3>
            <p className="report-caption">Loan volume by category/genre</p>
          </div>
          <div className="chart-wrapper">
            <div className="chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={volumeByCategory}
                  margin={{ top: 8, right: 8, left: -10, bottom: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="nama_kategori"
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={74}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="total_peminjaman"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="chart-card list-card">
          <div className="chart-card-header">
            <h3 className="report-subtitle">Latest Loans</h3>
            <p className="report-caption">Last 5 loans</p>
          </div>

          <div className="list-wrapper">

            {loans.slice(0, 5).map((loan) => (
              <div className="list-row" key={loan.nomor_pinjam}>

                <div>
                  <div className="list-title">#{loan.nomor_pinjam}</div>
                  <div className="list-subtitle">
                    {loan.nama_member || "Member"} · {loan.status}
                  </div>
                </div>

                <div className="list-meta">
                  <span>{loan.tgl_pinjam}</span>
                  <span>{loan.jumlah_buku} buku</span>
                </div>
              </div>
            ))}
            {loans.length === 0 && !loading && (
              <div className="list-empty">No loan data yet.</div>
            )}

          </div>

        </div>

        <div className="chart-card list-card">
          <div className="chart-card-header">
            <h3 className="report-subtitle">Latest Fine Payments</h3>
            <p className="report-caption">Last 5 transactions</p>
          </div>

          <div className="list-wrapper">

            {fines.slice(0, 5).map((fine) => (
              <div className="list-row" key={fine.id_pembayaran}>
                <div>
                  <div className="list-title">
                    Rp {formatNumber(fine.total_bayar)}
                  </div>
                  <div className="list-subtitle">
                    {fine.nama_member || "Member"} · {fine.keterangan || "-"}
                  </div>
                </div>
                <div className="list-meta">
                  <span>{fine.tgl_bayar}</span>
                </div>
              </div>
            ))}

            {fines.length === 0 && !loading && (
              <div className="list-empty">No fine payments yet.</div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
