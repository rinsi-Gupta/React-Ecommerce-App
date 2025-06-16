import React, { useEffect, useState } from 'react';
import myContext from './myContext';
import { fireDB } from '../../firebase/FirebaseConfig';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

function MyState(props) {
  const [mode, setMode] = useState('light');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [order, setOrder] = useState([]);
  const [user, setUser] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState({
    id: 'string',
    title: '',
    price: '',
    imageUrl: '',
    category: '',
    description: '',
    stock: '',
    time: Timestamp.now(),
    date: new Date().toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
  });

  // Toggle dark/light mode
  const toggleMode = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      document.body.style.backgroundColor =
        newMode === 'dark' ? 'rgb(17, 24, 39)' : 'white';
      return newMode;
    });
  };

  // Wishlist logic
  const toggleWishlist = (item) => {
    const exists = wishlist.find((w) => w.id === item.id);
    if (exists) {
      setWishlist(wishlist.filter((w) => w.id !== item.id));
      toast.info('Removed from wishlist');
    } else {
      setWishlist([...wishlist, item]);
      toast.success('Added to wishlist');
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const placeOrder = async (cartItems, addressInfo, currentUser, paymentId, orderId) => {
    try {
      setLoading(true);
      for (const item of cartItems) {
        const productRef = doc(fireDB, 'products', item.id);
        const productSnap = await getDoc(productRef);
        if (!productSnap.exists()) {
          toast.error(`Product ${item.title} not found`);
          setLoading(false);
          return;
        }

        const productData = productSnap.data();
        const currentStock = parseInt(productData.stock);
        const orderedQty = parseInt(item.quantity);

        if (currentStock < orderedQty) {
          toast.error(`Insufficient stock for ${item.title}`);
          setLoading(false);
          return;
        }

        await updateDoc(productRef, {
          stock: currentStock - orderedQty,
        });
      }

      const orderData = {
        userid: currentUser.uid,
        email: currentUser.email,
        cartItems: cartItems,
        addressInfo: addressInfo,
        orderId: orderId,
        paymentId: paymentId,
        createdAt: Timestamp.now(),
        date: new Date().toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      };

      await addDoc(collection(fireDB, 'order'), orderData);
      toast.success('Order placed successfully');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Order failed');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    const { title, price, imageUrl, category, description, stock } = products;
    if (!title || !price || !imageUrl || !category || !description || !stock) {
      return toast.error('Please fill all fields');
    }

    setLoading(true);
    try {
      const productRef = collection(fireDB, 'products');
      await addDoc(productRef, products);
      toast.success('Product Added successfully');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProductData = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, 'products'), orderBy('time'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let productsArray = [];
        querySnapshot.forEach((doc) => {
          productsArray.push({ ...doc.data(), id: doc.id });
        });
        setProduct(productsArray);

        const lowStock = productsArray.filter((item) => item.stock <= 20);
        setLowStockItems(lowStock);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const edithandle = (item) => setProducts(item);

  const updateProduct = async () => {
    setLoading(true);
    try {
      await setDoc(doc(fireDB, 'products', products.id), products);
      toast.success('Product Updated successfully');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (item) => {
    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, 'products', item.id));
      toast.success('Product Deleted successfully');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, 'order'));
      setOrder(result.docs.map((doc) => doc.data()));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, 'users'));
      setUser(result.docs.map((doc) => doc.data()));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
    getOrderData();
    getUserData();
  }, []);

  const [searchKey, setSearchKey] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPrice, setFilterPrice] = useState('');

  return (
    <myContext.Provider
      value={{
        mode,
        toggleMode,
        loading,
        setLoading,
        products,
        setProducts,
        addProduct,
        product,
        edithandle,
        updateProduct,
        deleteProduct,
        order,
        user,
        searchKey,
        setSearchKey,
        filterType,
        setFilterType,
        filterPrice,
        setFilterPrice,
        lowStockItems,
        placeOrder,
        wishlist,
        toggleWishlist,
      }}
    >
      {props.children}
    </myContext.Provider>
  );
}

export default MyState;
