import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/loader/Loader';

function Order() {
  const userid = JSON.parse(localStorage.getItem('user')).user.uid;
  const context = useContext(myContext);
  const { mode, loading, order } = context;

  const textColor = mode === 'dark' ? 'text-white' : 'text-gray-800';
  const bgColor = mode === 'dark' ? 'bg-gray-900' : 'bg-white';

  const userOrders = order.filter(o => o.userid === userid);

  return (
    <Layout>
      {loading && <Loader />}

      <div className={`min-h-screen pt-10 px-4 md:px-10 ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h1 className={`text-3xl font-bold mb-8 ${textColor}`}>🧾 My Orders</h1>

        {userOrders.length > 0 ? (
          userOrders.map((ord, index) => (
            <div
              key={index}
              className={`mb-10 p-6 rounded-xl shadow-md ${bgColor} transition-transform hover:scale-[1.01]`}
            >
              <div className="flex flex-col md:flex-row md:justify-between mb-4">
                <div>
                  <h2 className={`text-lg font-semibold ${textColor}`}>📦 Order ID: {ord.orderId}</h2>
                  <p className={`text-sm ${textColor} opacity-80`}>Placed on: {ord.date}</p>
                </div>
                <div className="flex items-center gap-4 mt-3 md:mt-0">
                  <span className={`font-medium ${textColor}`}>Total: ₹{ord.cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ord.cartItems.map((item, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 items-start rounded-lg border p-4 shadow-sm ${
                      mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                    }`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-24 h-24 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-md font-semibold">{item.title}</h3>
                      <p className="text-sm opacity-70 mb-2">{item.description}</p>
                      <p className="text-sm font-medium">Price: ₹{item.price}</p>
                      <p className="text-sm font-medium">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-2xl font-semibold mt-20 text-gray-500 dark:text-gray-300">
            No orders found 💤
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Order;
