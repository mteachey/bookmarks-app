import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
  <BrowseRouter>
   <App />
  </BrowseRouter>
  ,div);
  ReactDOM.unmountComponentAtNode(div);
});
