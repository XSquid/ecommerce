import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';

import './App.css';
import Root from './components/root';
import Home from './components/home';
import Login from './components/login';
import Register from './components/register';
import Profile from './components/profile';
import Products from './components/products';
import ProductPage from './components/productPage';
import OrderHistory from './components/orderhistory';
import DeleteProfile from './components/deleteprofile';

const router = createBrowserRouter(createRoutesFromElements(

  //Parent route root makes it so all other routes display the header
  <Route path='/' element={<Root />}>
    <Route path='/' element={<Home />} />
    <Route path='home' element={<Home />} />
    <Route path='login' element={<Login />} />
    <Route path='register' element={<Register />} />


    <Route element={<RequireAuth />}>
      <Route path='profile' element={<Profile />} />
    </Route>

    <Route element={<RequireAuth />}>
      <Route path='order_history/:id' element={<OrderHistory />}/>
    </Route>

    <Route element={<RequireAuth />}>
      <Route path='/profile/delete' element={<DeleteProfile />}/>
    </Route>

    <Route path='products' element={<Products />} />
    <Route path='product/:id' element={<ProductPage />} />
  </Route>
))

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
