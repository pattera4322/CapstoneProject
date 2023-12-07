import { Button } from "@material-tailwind/react";

const ButtonComponent = ({ onClick, children }) => {
  const handleButtonClick = () => {
    onClick();
  };

  return (
    <div>
      <Button onClick={handleButtonClick}>{children}</Button>
    </div>
  );
};

export default ButtonComponent;
