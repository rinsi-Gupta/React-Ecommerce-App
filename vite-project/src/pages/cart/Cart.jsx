import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity
} from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { addDoc, collection, Timestamp, doc, runTransaction } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

function Cart() {
  const context = useContext(myContext);
  const { mode } = context;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((cartItem) => {
      temp += parseInt(cartItem.price) * (cartItem.quantity || 1);
    });
    setTotalAmount(temp);
  }, [cartItems]);

  const shipping = 100;
  const grandTotal = shipping + totalAmount;

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success('Item removed from cart');
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const buyNow = async () => {
    if (!name || !address || !pincode || !phoneNumber) {
      return toast.error("All fields are required");
    }

    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
      time: Timestamp.now(),
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    const orderId = `ORDER-${Date.now()}`;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: parseInt(grandTotal * 100),
      currency: "INR",
      name: "E-Commerce",
      description: "Test Transaction",
      handler: async function (response) {
        toast.success('Payment Successful');

        const paymentId = response.razorpay_payment_id;

        const orderInfo = {
          cartItems,
          addressInfo,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          email: JSON.parse(localStorage.getItem("user")).user.email,
          userid: JSON.parse(localStorage.getItem("user")).user.uid,
          orderId,
          paymentId
        };

        try {
          const orderRef = collection(fireDB, 'order');
          await addDoc(orderRef, orderInfo);

          for (const item of cartItems) {
            const productRef = doc(fireDB, "products", item.id);
            await runTransaction(fireDB, async (transaction) => {
              const productDoc = await transaction.get(productRef);
              if (!productDoc.exists()) throw "Product not found";

              const newStock = productDoc.data().stock - (item.quantity || 1);
              if (newStock < 0) throw "Not enough stock";

              transaction.update(productRef, { stock: newStock });
            });
          }

          dispatch(clearCart());
          localStorage.removeItem("cart");

        } catch (error) {
          console.error("Error placing order or updating stock:", error);
          toast.error("Error during order processing");
        }
      },
      theme: {
        color: "#3399cc"
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <Layout>
      <div className="h-screen bg-gray-100 pt-5 mb-[60%]" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '' }}>
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {cartItems.map((item, index) => {
              const { title, price, description, imageUrl } = item;
              return (
                <div key={index} className="justify-between mb-6 rounded-lg border drop-shadow-xl bg-white p-6 sm:flex sm:justify-start" style={{ backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '', color: mode === 'dark' ? 'white' : '' }}>
                  <img src={imageUrl} alt="product" className="w-full rounded-lg sm:w-40" />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold">{title}</h2>
                      <p className="text-sm">{description}</p>
                      <p className="mt-1 text-xs font-semibold">Price: ₹{price}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs font-semibold">Quantity:</span>
                        <button
                          onClick={() => dispatch(decrementQuantity(item))}
                          className={`px-2 rounded ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                        >−</button>
                        <span>{item.quantity || 1}</span>
                        <button
                          onClick={() => dispatch(incrementQuantity(item))}
                          className={`px-2 rounded ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                        >+</button>
                      </div>
                    </div>
                    <div onClick={() => deleteCart(item)} className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21L18.16 19.673A2.25 2.25 0 0115.916 21H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.11 48.11 0 00-3.478-.397m-12 .562a48.108 48.108 0 013.478-.397M7.5 5.393v-.916c0-1.18.91-2.164 2.09-2.201a51.964 51.964 0 013.32 0c1.18.037 2.09 1.022 2.09 2.201v.916" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3" style={{ backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '', color: mode === 'dark' ? 'white' : '' }}>
            <div className="mb-2 flex justify-between">
              <p>Subtotal</p>
              <p>₹{totalAmount}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>₹{shipping}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-3">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">₹{grandTotal}</p>
            </div>

            <Modal
              name={name}
              address={address}
              pincode={pincode}
              phoneNumber={phoneNumber}
              setName={setName}
              setAddress={setAddress}
              setPincode={setPincode}
              setPhoneNumber={setPhoneNumber}
              buyNow={buyNow}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
