import React, { useContext, useEffect } from 'react';
import myContext from '../../context/data/myContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

function ProductCard() {
  const context = useContext(myContext);
  const {
    mode,
    product,
    searchKey,
    setSearchKey,
    filterType,
    setFilterType,
    filterPrice,
    setFilterPrice,
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

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-8 md:py-16 mx-auto">
        <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
          <h1
            className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900"
            style={{ color: mode === 'dark' ? 'white' : '' }}
          >
            Our Latest Collection
          </h1>
          <div className="h-1 w-20 bg-pink-600 rounded"></div>
        </div>

        <div className="flex flex-wrap -m-4">
          {product
            .filter((obj) =>
              obj.title.toLowerCase().includes(searchKey.toLowerCase())
            )
            .filter((obj) =>
              filterType ? obj.category.toLowerCase().includes(filterType.toLowerCase()) : true
            )
            .filter((obj) =>
              filterPrice ? obj.price.toString().includes(filterPrice.toString()) : true
            )
            .slice(0, 8)
            .map((item, index) => {
              const { title, price, imageUrl, id, category } = item;
              const isWished = wishlist?.some((w) => w.id === item.id);

              return (
                <div key={index} className="p-4 md:w-1/4 drop-shadow-lg">
                  <div
                    className="h-full flex flex-col justify-between border-2 hover:shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out border-gray-200 border-opacity-60 rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '',
                      color: mode === 'dark' ? 'white' : '',
                    }}
                  >
                    <div className="relative">
                      {/* Product Image */}
                      <div
                        onClick={() => (window.location.href = `/productinfo/${id}`)}
                        className="flex justify-center cursor-pointer"
                      >
                        <img
                          className="rounded-2xl w-full h-80 p-2 hover:scale-110 transition-transform duration-300 ease-in-out"
                          src={imageUrl}
                          alt={title}
                        />
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="p-5 border-t-2 flex flex-col flex-grow">
                      <h2
                        className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
                        style={{ color: mode === 'dark' ? 'white' : '' }}
                      >
                        {category || 'E-Commerce'}
                      </h2>
                      <h1
                        className="title-font text-lg font-medium text-gray-900 mb-3"
                        style={{ color: mode === 'dark' ? 'white' : '' }}
                      >
                        {title}
                      </h1>

                      {/* Price & Heart Row */}
                      <div className="flex items-center justify-between mb-3">
                        <p
                          className="text-pink-600 font-semibold text-base"
                          style={{ color: mode === 'dark' ? '#f472b6' : '#be185d' }}
                        >
                          ₹ {price}
                        </p>
                        <div
                          className="text-xl cursor-pointer transition-transform duration-200 hover:scale-110"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(item);
                          }}
                        >
                          {isWished ? (
                            <AiFillHeart className="text-red-500" />
                          ) : (
                            <AiOutlineHeart
                              className={mode === 'dark' ? 'text-white' : 'text-gray-600'}
                            />
                          )}
                        </div>
                      </div>

                      <div className="mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addCart(item);
                          }}
                          type="button"
                          className="focus:outline-none text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm w-full py-2"
                        >
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

export default ProductCard;
