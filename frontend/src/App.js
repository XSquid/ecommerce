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

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />}>
    <Route path='home' element={<Home />} />
    <Route path='login' element={<Login />} />
    <Route path='register' element={<Register />} />

    <Route element={<RequireAuth />}>
      <Route path='profile' element={<Profile />} />
    </Route>

    <Route path='products' element={<Products />} />
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
