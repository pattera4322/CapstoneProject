import { Button } from "@material-tailwind/react";

const ButtonComponent = ({ onClick, children }) => {
  const handleButtonClick = () => {
    onClick();
  };

  return (
    <div>
      <Button onClick={handleButtonClick} className="bg-[#0068D2]">{children}</Button>
    </div>
  );
};

export default ButtonComponent;
