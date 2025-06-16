import React, { Fragment, useContext, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { BsFillCloudSunFill } from 'react-icons/bs'
import { FiSun } from 'react-icons/fi'
import myContext from '../../context/data/myContext'
import { RxCross2 } from 'react-icons/rx'
import { useSelector } from 'react-redux'
import { FaHeart } from 'react-icons/fa'

function Navbar() {
  const context = useContext(myContext)
  const { toggleMode, mode, wishlist } = context
  const [open, setOpen] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))

  const logout = () => {
    localStorage.clear('user')
    window.location.href = '/login'
  }

  const cartItems = useSelector((state) => state.cart)

  return (
    <div className="bg-white sticky top-0 z-50">
      {/* Mobile Menu */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition>

          <div className="fixed inset-0 z-40 flex">
            <Transition
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog
                className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl"
                style={{
                  backgroundColor: mode === 'dark' ? 'rgb(40, 44, 52)' : '',
                  color: mode === 'dark' ? 'white' : ''
                }}
              >
                <div className="flex px-4 pb-2 pt-28">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <RxCross2 />
                  </button>
                </div>
                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                  <Link to="/allproducts" onClick={() => setOpen(false)}>All Products</Link>
                  <Link to="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
                  {user && user?.user?.email !== 'rinsigupta7982@gmail.com' && (
                    <Link to="/order" onClick={() => setOpen(false)}>Order</Link>
                  )}
                  {user?.user?.email === 'rinsigupta7982@gmail.com' && (
                    <Link to="/dashboard" onClick={() => setOpen(false)}>Admin</Link>
                  )}
                  {user ? (
                    <a onClick={() => { logout(); setOpen(false); }} className="cursor-pointer">Logout</a>
                  ) : (
                    <Link to="/signup" onClick={() => setOpen(false)}>Signup</Link>
                  )}
                </div>
              </Dialog>
            </Transition>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop */}
      <header className="relative bg-white">
        <p
          className="flex h-10 items-center justify-center bg-pink-600 px-4 text-sm font-medium text-white"
          style={{
            backgroundColor: mode === 'dark' ? 'rgb(62 64 66)' : '',
            color: mode === 'dark' ? 'white' : ''
          }}
        >
          Get free delivery on orders over ₹300
        </p>

        <nav
          aria-label="Top"
          className="bg-gray-100 px-4 sm:px-6 lg:px-8 shadow-xl"
          style={{
            backgroundColor: mode === 'dark' ? '#282c34' : '',
            color: mode === 'dark' ? 'white' : ''
          }}
        >
          <div>
            <div className="flex h-16 items-center">
              {/* Mobile Menu Button */}
              <button
                type="button"
                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
                style={{
                  backgroundColor: mode === 'dark' ? 'rgb(80 82 87)' : '',
                  color: mode === 'dark' ? 'white' : ''
                }}
              >
                <span className="sr-only">Open menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/" className="text-2xl font-bold px-2 py-1 rounded" style={{ color: mode === 'dark' ? 'white' : '' }}>
                  E-Commerce
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:items-center lg:space-x-6">
                  <Link to="/" className="text-sm font-medium" style={{ color: mode === 'dark' ? 'white' : '' }}>
                    Home
                  </Link>
                  <Link to="/allproducts" className="text-sm font-medium" style={{ color: mode === 'dark' ? 'white' : '' }}>
                    All Products
                  </Link>
                  {user && user?.user?.email !== 'rinsigupta7982@gmail.com' && (
                    <Link to="/order" className="text-sm font-medium" style={{ color: mode === 'dark' ? 'white' : '' }}>
                      Order
                    </Link>
                  )}
                  {!user && (
                    <Link to="/signup" className="text-sm font-medium" style={{ color: mode === 'dark' ? 'white' : '' }}>
                      Signup
                    </Link>
                  )}
                  {user?.user?.email === 'rinsigupta7982@gmail.com' && (
                    <Link to="/dashboard" className="text-sm font-medium" style={{ color: mode === 'dark' ? 'white' : '' }}>
                      Admin
                    </Link>
                  )}
                  {user && (
                    <a onClick={logout} className="text-sm font-medium cursor-pointer" style={{ color: mode === 'dark' ? 'white' : '' }}>
                      Logout
                    </a>
                  )}
                </div>

                {/* Country */}
                <div className="hidden lg:ml-8 lg:flex">
                  <a className="flex items-center text-gray-700">
                    <img src="https://ecommerce-sk.vercel.app/img/indiaflag.png" alt="" className="w-5 h-auto" />
                    <span className="ml-3 text-sm font-medium" style={{ color: mode === 'dark' ? 'white' : '' }}>
                      INDIA
                    </span>
                  </a>
                </div>

                {/* Toggle Mode */}
                <div className="ml-4">
                  <button onClick={toggleMode}>
                    {mode === 'light' ? <FiSun size={24} /> : <BsFillCloudSunFill size={24} />}
                  </button>
                </div>

                {/* Wishlist */}
                <div className="ml-4 relative">
                  <Link to="/wishlist" className="flex items-center gap-1">
                    <FaHeart
                      className={`h-6 w-6 transition-colors duration-200 ${
                        wishlist.length > 0 ? 'text-red-500' : 'text-gray-400'
                      } ${mode === 'dark' ? 'text-white' : ''}`}
                    />
                    <span className={`text-sm font-medium ${mode === 'dark' ? 'text-white' : ''}`}>
                      {wishlist.length}
                    </span>
                  </Link>
                </div>

                {/* Cart */}
                <div className="ml-4 relative">
                  <Link to="/cart" className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218
                        c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6
                        20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75
                        0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                    <span className={`text-sm font-medium ${mode === 'dark' ? 'text-white' : ''}`}>
                      {cartItems.length}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Navbar
