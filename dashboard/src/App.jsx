import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, ShoppingBag, 
  CreditCard, Activity, BarChart2, Package
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    Papa.parse('/cleaned_customer_shopping_behavior.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const rawData = results.data.filter(row => row.customer_id); // filter out empty rows
        processData(rawData);
      }
    });
  }, []);

  const processData = (rawData) => {
    // Basic KPIs
    const totalRevenue = rawData.reduce((sum, row) => sum + (row.purchase_amount || 0), 0);
    const totalCustomers = rawData.length;
    const avgSpend = totalRevenue / totalCustomers;

    // Revenue by Gender
    const revByGenderObj = {};
    rawData.forEach(row => {
      if (!revByGenderObj[row.gender]) revByGenderObj[row.gender] = 0;
      revByGenderObj[row.gender] += row.purchase_amount;
    });
    const revByGender = Object.keys(revByGenderObj).map(key => ({
      name: key,
      value: revByGenderObj[key]
    }));

    // Revenue by Age Group
    const revByAgeObj = {};
    rawData.forEach(row => {
      const ageGrp = row.age_group || 'Unknown';
      if (!revByAgeObj[ageGrp]) revByAgeObj[ageGrp] = 0;
      revByAgeObj[ageGrp] += row.purchase_amount;
    });
    const revByAge = Object.keys(revByAgeObj).map(key => ({
      name: key,
      Revenue: revByAgeObj[key]
    })).sort((a,b) => b.Revenue - a.Revenue);

    // Spend by Subscription
    const subObj = {};
    rawData.forEach(row => {
      const status = row.subscription_status;
      if (!subObj[status]) subObj[status] = { count: 0, total: 0 };
      subObj[status].count += 1;
      subObj[status].total += row.purchase_amount;
    });
    const subData = Object.keys(subObj).map(key => ({
      name: key === 'Yes' ? 'Subscribed' : 'Not Subscribed',
      AvgSpend: Math.round(subObj[key].total / subObj[key].count)
    }));

    // Customer Segments
    const segObj = { 'New': 0, 'Returning': 0, 'Loyal': 0 };
    rawData.forEach(row => {
      if (row.previous_purchases === 1) segObj['New']++;
      else if (row.previous_purchases <= 10) segObj['Returning']++;
      else segObj['Loyal']++;
    });
    const segData = Object.keys(segObj).map(key => ({
      name: key,
      value: segObj[key]
    }));

    // Top Categories
    const catObj = {};
    rawData.forEach(row => {
      if (!catObj[row.category]) catObj[row.category] = 0;
      catObj[row.category] += row.purchase_amount;
    });
    const topCategories = Object.keys(catObj).map(key => ({
      name: key,
      Revenue: catObj[key]
    })).sort((a,b) => b.Revenue - a.Revenue);

    setData(rawData);
    setMetrics({
      totalRevenue,
      totalCustomers,
      avgSpend,
      revByGender,
      revByAge,
      subData,
      segData,
      topCategories
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p style={{marginTop: '16px', color: 'var(--text-muted)'}}>Crunching data...</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card" style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: 0 }}>
              {entry.name}: {entry.name.includes('Revenue') || entry.name.includes('Spend') ? '$' : ''}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Customer Analytics Pro</h1>
        <p>Real-time insights and shopping behavior analysis</p>
      </header>

      {/* KPIs */}
      <div className="grid-kpi">
        <div className="glass-card">
          <DollarSign className="kpi-icon" size={24} />
          <h3 className="kpi-title">Total Revenue</h3>
          <p className="kpi-value">${metrics.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="glass-card">
          <Users className="kpi-icon" size={24} />
          <h3 className="kpi-title">Total Customers</h3>
          <p className="kpi-value">{metrics.totalCustomers.toLocaleString()}</p>
        </div>
        <div className="glass-card">
          <Activity className="kpi-icon" size={24} />
          <h3 className="kpi-title">Avg Spend / Customer</h3>
          <p className="kpi-value">${Math.round(metrics.avgSpend)}</p>
        </div>
        <div className="glass-card">
          <Package className="kpi-icon" size={24} />
          <h3 className="kpi-title">Top Category</h3>
          <p className="kpi-value" style={{fontSize: '1.8rem', paddingTop: '4px'}}>{metrics.topCategories[0]?.name}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-charts">
        <div className="glass-card">
          <h3 className="chart-title"><TrendingUp size={20} /> Revenue by Age Group</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.revByAge}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="chart-title"><Users size={20} /> Customer Segmentation</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.segData}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {metrics.segData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="chart-title"><ShoppingBag size={20} /> Revenue by Category</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.topCategories} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}}/>
                <Bar dataKey="Revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32}>
                  {metrics.topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="chart-title"><CreditCard size={20} /> Avg Spend: Subscribers vs Non-Subscribers</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.subData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}}/>
                <Bar dataKey="AvgSpend" fill="#10b981" radius={[4, 4, 0, 0]} barSize={64} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
