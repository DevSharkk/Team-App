import { useEffect, useMemo } from 'react'

export default function Result({ items, search, onResultatsNb }) {
    const filteredItems = useMemo(() => {
        return items ? items.filter(item => 
            item.name.last.toLowerCase().includes(search.toLowerCase()) || 
            item.name.first.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase()) ||
            item.location.city.toLowerCase().includes(search.toLowerCase())
        ) : [];
    }, [items, search]);

    useEffect(() => {
        onResultatsNb(filteredItems);
    }, [search, items]);

    return (
        <div className="results-count">
            {search && <p>{filteredItems.length} résultat(s) trouvé(s)</p>}
        </div>
    );
}