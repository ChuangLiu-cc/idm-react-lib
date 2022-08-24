import './App.css';
import Searchbar from './components/SearchBar'
import Resultlist from './components/ResultList';
import ReservationForm from './components/ReservationForm';
import Footer from './components/Footer';
import React from 'react';
function App() {
  return (
    <div className="App">
      <Searchbar />
      <Footer />
    </div>
  );
}

export default App;
