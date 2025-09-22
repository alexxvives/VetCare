import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import AppRouter from './router/AppRouter';
import VetCareThemeProvider from './theme/VetCareThemeProvider';
import './theme/globalStyles.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <VetCareThemeProvider>
          <AppRouter />
        </VetCareThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;t React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import AppRouter from './router/AppRouter';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AppRouter />
      </PersistGate>
    </Provider>
  );
}

export default App;
