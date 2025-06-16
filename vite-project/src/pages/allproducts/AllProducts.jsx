import React, { useContext, useEffect } from 'react';
import Filter from '../../components/filter/Filter';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

function Allproducts() {
  const context = useContext(myContext);
  const {
    mode,
    product,
    searchkey,
    filterType,
    filterPrice,
    wishlist,
    toggleWishlist,
  } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  const addCart = (product) => {
    dispatch(addToCart(product));
    toast.success('Added to cart');
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = product
    ?.filter((obj) =>
      searchkey ? obj.title.toLowerCase().includes(searchkey.toLowerCase()) : true
    )
    .filter((obj) =>
      filterType ? obj.category.toLowerCase() === filterType.toLowerCase() : true
    )
    .filter((obj) => {
      if (!filterPrice) return true;
      const price = obj.price;
      if (filterPrice.includes('-')) {
        const [min, max] = filterPrice.split('-').map(Number);
        return price >= min && price <= max;
      }
      return price >= Number(filterPrice);
    });

  return (
    <Layout>
      <div className={`${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} transition-all duration-300 min-h-screen`}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">🛍️ Our Latest Collection</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filter Column */}
            <div className="col-span-1">
              <Filter />
            </div>

            {/* Product Grid */}
            <div className="col-span-1 md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts?.map((item, index) => {
                  const { title, price, imageUrl, id, category } = item;
                  const isWished = wishlist?.some((w) => w.id === item.id);

                  return (
                    <div
                      key={index}
                      onClick={() => (window.location.href = `/productinfo/${id}`)}
                      className="cursor-pointer hover:shadow-xl rounded-2xl border dark:border-gray-700 transition"
                    >
                      <div
                        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col h-full"
                      >
                        <img
                          src={imageUrl}
                          alt={title}
                          className="h-60 object-cover w-full p-2 rounded-2xl hover:scale-105 transition-transform duration-300"
                        />

                        <div className="p-4 flex flex-col flex-grow">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{category || 'E-Commerce'}</span>
                          <h2 className="text-lg font-semibold mb-1 dark:text-white">{title}</h2>

                          {/* Price + Wishlist Row */}
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-pink-600 font-bold">₹{price}</p>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(item);
                              }}
                              className="text-xl cursor-pointer hover:scale-110 transition-transform duration-200"
                            >
                              {isWished ? (
                                <AiFillHeart className="text-red-500" />
                              ) : (
                                <AiOutlineHeart className={mode === 'dark' ? 'text-white' : 'text-gray-600'} />
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addCart(item);
                            }}
                            className="mt-auto bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg w-full transition"
                          >
                            Add To Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredProducts?.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-300 col-span-full">
                    No products match your filters.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Allproducts;
