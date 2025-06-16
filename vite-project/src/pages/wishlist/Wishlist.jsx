import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

function Wishlist() {
  const { wishlist, toggleWishlist, mode } = useContext(myContext);
  const dispatch = useDispatch();

  const addToCartHandler = (item) => {
    dispatch(addToCart(item));
    toast.success('Moved to Cart');
    toggleWishlist(item); // Optional: remove from wishlist when added to cart
  };

  return (
    <section className="py-8 px-4 md:px-10">
      <h2 className="text-3xl font-bold mb-6 text-pink-600 text-center">❤️ Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="Empty Wishlist"
            className="w-32 h-32 mb-6 opacity-70"
          />
          <p className="text-lg text-gray-500">Your wishlist is empty. Add items to view them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={`relative flex flex-col justify-between border rounded-xl p-4 shadow-md ${
                mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              }`}
              style={{ minHeight: '370px' }}
            >
              <div className="overflow-hidden rounded-lg mb-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-52 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-medium text-base line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.category}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-pink-600 font-semibold text-sm">₹ {item.price}</p>
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="text-pink-600 hover:text-pink-800"
                      title="Remove from Wishlist"
                    >
                      <FaHeart className="text-base" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => addToCartHandler(item)}
                  className="mt-4 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium py-2 px-3 rounded-md w-full transition-all"
                >
                  Move to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
