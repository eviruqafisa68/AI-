import React from 'react';import ReactDOM from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';import {AppRoutes} from './routes/AppRoutes';import {Toast} from './components/common/UI';import './styles/index.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><AppRoutes/><Toast/></BrowserRouter></React.StrictMode>);
