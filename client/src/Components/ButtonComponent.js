import "../Style/CssPages/ButtonComponent.css";
function ButtonComponent({ text, onClick, className = "" }) {
  return (
    <button className={`custom-button ${className}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default ButtonComponent;