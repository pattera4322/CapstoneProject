import "./Button3D.css"

const Button3D = ({ onClick = () => {}, children }) => {
  const handleButtonClick = () => {
    onClick();
  };

  return (
    <button className="pushable" onClick={handleButtonClick}>
      <span className="shadow"></span>
      <span className="edge"></span>
      <span className="front">{children}</span>
    </button>
  );
};

export default Button3D;
