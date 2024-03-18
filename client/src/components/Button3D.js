import "./Button3D.css"

const Button3D = ({ onClick = () => {}, children }) => {
  const handleButtonClick = () => {
    onClick();
  };

  return (
    <button class="pushable" onClick={handleButtonClick}>
      <span class="shadow"></span>
      <span class="edge"></span>
      <span class="front">{children}</span>
    </button>
  );
};

export default Button3D;
