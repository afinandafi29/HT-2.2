
const CategoryButtons = ({ visible, languages, activeCategory, onCategoryClick }) => {
  return (
    <div className={`category-buttons ${visible ? 'active' : ''}`} id="category-buttons">
      {languages.map(lang => (
        <button
          key={lang}
          className={activeCategory === lang.toLowerCase() ? 'active' : ''}
          onClick={() => onCategoryClick(lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default CategoryButtons;