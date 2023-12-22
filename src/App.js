import React from 'react';
import Login from './pages/Login';
import Main from './pages/Main';
import ViewStock from './pages/ViewStock';
import storage from './store/storage';

const Counter = () => {
  const onMainPage = storage(state => state).isMainPageVisible;

  const {isLoggedin} = storage();


  if (isLoggedin) {
    if (onMainPage) {
      return <Main />
    } else {
      return <ViewStock />
    }
  } else {
    return <Login />
  }
};

export default Counter;
