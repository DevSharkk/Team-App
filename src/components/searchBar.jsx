import { useState, useCallback } from 'react'
import Result from './result'

export default function SearchBar({items, onResults}) {
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);

    function handleChange(e) {
        const value = e.target.value;
        setSearch(value);
    }
    
    const handleResults = useCallback((items) => {
        setResult(items);
        if (onResults) {
            onResults(items);
        }
    }, [onResults]);

    return (
        <>
            <div className="containerSearch">
                <input type="text" placeholder="Rechercher un membre" value={search} onChange={handleChange} />
                <Result 
                    items={items}
                    search={search}
                    onResultatsNb={handleResults}
                />
            </div>
        </>
    )
}