import React, { useContext } from 'react';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import HeroSection from '../../components/heroSection/HeroSection';
import Filter from '../../components/filter/Filter';
import ProductCard from '../../components/productCard/ProductCard';
import Track from '../../components/track/Track';
import Testimonial from '../../components/testimonial/Testimonial';
import { Link } from 'react-router-dom';

function Home() {
  const context = useContext(myContext);
  const { mode } = context;

  return (
    <Layout>
      <div className={`${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} transition-all duration-300`}>
        <HeroSection />

        <div className="container mx-auto px-4 py-8">
          {/* Responsive layout for filter and products */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="col-span-1">
              <Filter />
            </div>

            {/* Products */}
            <div className="col-span-1 md:col-span-3">
              <ProductCard />
            </div>
          </div>

          {/* See More Button */}
          <div className="flex justify-center mt-8">
            <Link to={'/allproducts'}>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition">
                See More Products
              </button>
            </Link>
          </div>
        </div>

        {/* Extra Sections */}
        <Track />
        <Testimonial />
      </div>
    </Layout>
  );
}

export default Home;
