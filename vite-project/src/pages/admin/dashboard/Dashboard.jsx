// Enhanced Dashboard Page - Full Code with Dropdown Time Filter
import React, { useContext, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { FaBoxOpen, FaShoppingCart, FaUsers, FaRupeeSign, FaWarehouse } from 'react-icons/fa';
import myContext from '../../../context/data/myContext';
import Layout from '../../../components/layout/Layout';
import DashboardTab from './DashboardTab';

function Dashboard() {
  const { mode, product, order, user, lowStockItems } = useContext(myContext);

  const [timeFilter, setTimeFilter] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedWeek, setSelectedWeek] = useState('1');
  const [showInventory, setShowInventory] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

 const formatDateToYYYYMMDD = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const filterByTime = (orders) => {
  return orders.filter((ord) => {
    const parsedDate = new Date(ord.date);
    if (isNaN(parsedDate)) return false;

    const orderDateStr = formatDateToYYYYMMDD(parsedDate); 
    const selectedStr = formatDateToYYYYMMDD(new Date(selectedDate));

    const orderYear = parsedDate.getFullYear();
    const orderMonth = parsedDate.getMonth() + 1;
    const orderDay = parsedDate.getDate();
    const orderWeek = Math.floor((orderDay - 1) / 7) + 1;

    if (timeFilter === 'day') {
      return orderDateStr === selectedStr;
    }

    if (timeFilter === 'week') {
      return (
        orderYear === Number(selectedYear) &&
        orderMonth === Number(selectedMonth) &&
        orderWeek === Number(selectedWeek)
      );
    }

    if (timeFilter === 'month') {
      return (
        orderYear === Number(selectedYear) &&
        orderMonth === Number(selectedMonth)
      );
    }

    if (timeFilter === 'year') {
      return orderYear === Number(selectedYear);
    }

    return true;
  });
};


  const filteredOrders = filterByTime(order);
  const totalItemsSold = filteredOrders.reduce((total, ord) => total + ord.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0), 0);
  const totalRevenue = filteredOrders.reduce((sum, ord) => sum + ord.cartItems.reduce((itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 1), 0), 0);

  const stats = [
    { label: 'Total Products', value: product.length, icon: <FaBoxOpen className="text-blue-600" size={40} /> },
    { label: 'Total Orders', value: filteredOrders.length, icon: <FaShoppingCart className="text-green-600" size={40} /> },
    { label: 'Items Sold', value: totalItemsSold, icon: <FaShoppingCart className="text-yellow-500" size={40} /> },
    { label: 'Total Users', value: user.length, icon: <FaUsers className="text-pink-500" size={40} /> },
    { label: 'Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: <FaRupeeSign className="text-purple-600" size={40} /> },
    { label: showInventory ? 'Hide Inventory' : 'Show Inventory', value: '', icon: <FaWarehouse size={55} />, action: () => setShowInventory(!showInventory) },
  ];

  const cardStyle = {
    backgroundColor: mode === 'dark' ? 'rgb(40, 44, 52)' : 'white',
    color: mode === 'dark' ? 'white' : '',
    transition: 'all 0.3s ease',
  };

  const groupOrdersByWeek = (order) => {
    const grouped = {};
    order.forEach((ord) => {
      const date = new Date(ord.date);
      const week = Math.floor((date.getDate() - 1) / 7) + 1;
      const key = `Week ${week}`;
      if (!grouped[key]) grouped[key] = { week: key, itemsSold: 0, revenue: 0 };
      const itemsSold = ord.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const revenue = ord.cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
      grouped[key].itemsSold += itemsSold;
      grouped[key].revenue += revenue;
    });
    return Object.values(grouped).sort((a, b) => a.week.localeCompare(b.week));
  };

  const salesData = timeFilter === 'week'
    ? groupOrdersByWeek(filteredOrders)
    : filteredOrders.map((ord) => ({
      orderId: ord.orderId || 'N/A',
      itemsSold: ord.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
      date: new Date(ord.date).toLocaleDateString('en-IN'),
    }));

  const revenueData = timeFilter === 'week'
    ? groupOrdersByWeek(filteredOrders)
    : filteredOrders.map((ord) => ({
      orderId: ord.orderId || 'N/A',
      revenue: ord.cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
      date: new Date(ord.date).toLocaleDateString('en-IN'),
    }));

  const filteredProductIds = new Set(filteredOrders.flatMap(ord => ord.cartItems.map(item => item._id)));
  const categoryData = product.filter(p => filteredProductIds.has(p._id)).reduce((acc, item) => {
    const existing = acc.find(p => p.name === item.category);
    if (existing) existing.value += 1;
    else acc.push({ name: item.category, value: 1 });
    return acc;
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 border rounded bg-white shadow dark:bg-gray-800 text-sm">
          {data.week && <p><strong>{data.week}</strong></p>}
          {data.orderId && <p>Order: {data.orderId}</p>}
          {data.date && <p>Date: {data.date}</p>}
          {data.itemsSold && <p>Sold: {data.itemsSold}</p>}
          {data.revenue && <p>Revenue: ₹{data.revenue.toFixed(2)}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <section className="text-gray-600 body-font mt-10 mb-10">
        {showNotification && lowStockItems.length > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded relative">
            <span>Warning: {lowStockItems.length} low stock items found.</span>
            <button onClick={() => setShowInventory(!showInventory)} className="ml-4 bg-red-600 text-white px-3 py-1 rounded">
              {showInventory ? 'Hide' : 'View'} Inventory
            </button>
            <span className="absolute top-1 right-2 cursor-pointer" onClick={() => setShowNotification(false)}>
              &times;
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-lg p-5 shadow-md flex flex-col items-center justify-center text-center cursor-pointer"
              style={cardStyle}
              onClick={stat.action}
            >
              <div className="mb-2 text-purple-500">{stat.icon}</div>
              <h3 className="text-xl font-bold">{stat.value}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Inventory Table */}
        {showInventory && (
          <div className="overflow-x-auto border rounded-lg shadow mb-10">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Stock</th>
                </tr>
              </thead>
              <tbody>
                {product.map((item, index) => (
                  <tr key={index} className={`hover:bg-purple-50 ${item.stock <= 20 ? 'bg-red-100 text-red-700' : ''}`}>
                    <td className="px-6 py-4"><img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded object-cover" /></td>
                    <td className="px-6 py-4">{item.title}</td>
                    <td className="px-6 py-4">₹{item.price}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4">{item.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Time Filter Dropdown & Inputs */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8 px-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Time Filter:</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border px-3 py-2 rounded shadow-sm bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {timeFilter === 'day' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border px-3 py-2 rounded shadow-sm"
              />
            )}

            {timeFilter === 'week' && (
              <>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border px-3 py-2 rounded">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
                <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border px-3 py-2 rounded w-24" />
                <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)} className="border px-3 py-2 rounded">
                  {[1, 2, 3, 4, 5].map(w => (
                    <option key={w} value={w}>Week {w}</option>
                  ))}
                </select>
              </>
            )}

            {timeFilter === 'month' && (
              <>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border px-3 py-2 rounded">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
                <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border px-3 py-2 rounded w-24" />
              </>
            )}
            
            {timeFilter === 'year' && (
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border px-3 py-2 rounded w-24 shadow-sm"
              />
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Items Sold</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={timeFilter === 'week' ? 'week' : 'orderId'} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="itemsSold" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={timeFilter === 'week' ? 'week' : 'orderId'} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Product Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <DashboardTab />
      </section>
    </Layout>
  );
}

export default Dashboard;
