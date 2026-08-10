export default function SearchBar({ valor, onChange, placeholder }) {
  return (
    <input
      className="search-bar"
      type="text"
      value={valor}
      placeholder={placeholder || 'Buscar...'}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
