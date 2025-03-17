import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import SearchBar from './components/searchBar'
import './App.css'

function App() {
  const [userData, setUserData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [currentOption, setCurrentOption] = useState('all');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fonction pour trier les données selon l'option sélectionnée
  const sortData = useCallback((option, data) => {
    switch(option) {
      case 'all':
        return [...data];
      case 'name':
        return [...data].sort((a, b) => a.name.last.localeCompare(b.name.last));
      case 'country':
        return [...data].sort((a, b) => a.location.country.localeCompare(b.location.country));
      case 'city':
        return [...data].sort((a, b) => a.location.city.localeCompare(b.location.city));
      default:
        console.log('Aucun membre trouvé');
        return data;
    }
  }, []);

  // Récupération des données
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://randomuser.me/api/?results=10');
        console.log('Données reçues:', response.data);
        const results = response.data.results;
        setUserData(results);
        setDisplayData(results);
        setLoading(false);
      } catch(error) {
        console.error('Erreur lors de la requete', error);
        setError('Impossible de charger les données');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Effet pour trier les données quand l'option change
  useEffect(() => {
    if (userData.length > 0 && !isSearching) {
      const sortedData = sortData(currentOption, userData);
      setDisplayData(sortedData);
    }
  }, [currentOption, userData, sortData, isSearching]);

  // Fonction pour gérer les résultats de recherche
  const handleSearchResults = useCallback((results) => {
    setIsSearching(results.length !== userData.length);
    setDisplayData(results);
  }, [userData.length]);

  function handleCount() {
    setCount(count + 1);
  }

  function handleClick(e) {
    const option = e.target.name;
    setCurrentOption(option);
  }

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className="app-container">
      <h1>Liste des utilisateurs</h1>
      
      <SearchBar items={userData} onResults={handleSearchResults} />
      
      <div className="btns">
        <button name="all" onClick={handleClick}>Tous</button>
        <button name="name" onClick={handleClick}>Trier par nom</button>
        <button name="country" onClick={handleClick}>Trier par pays</button>
        <button name="city" onClick={handleClick}>Trier par ville</button>
        <button onClick={handleCount}>Compteur: {count}</button>
      </div>
      
      {displayData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Name</th>
              <th>Firstname</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((user, index) => (
              <tr key={index}>
                <td><img src={user.picture.thumbnail} alt="thumbnail" /></td>
                <td>{user.name.last}</td>
                <td>{user.name.first}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.location.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune donnée disponible</p>
      )}
    </div>
  )
}

export default App
