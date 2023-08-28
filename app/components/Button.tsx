interface Props {
  label: string;
  classname?: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<Props> = ({ label, classname, onClick, disabled }) => {
  return (
    <>
      <button
        disabled={disabled}
        onClick={onClick}
        className={`${classname} px-8 py-2 border border-blue-500 m-2 rounded-md inline-block 
                                 relative isolate after:content-[''] after:absolute after:-z-[1] 
                                 after:bg-blue-500 after:inset-0 after:scale-x-0 
                                 focus-visible:after:scale-x-100 hover:after:scale-x-100
                                 after:transition after:duration-[300ms] after:ease-linear 
                                 after:origin-left hover:after:origin-right 
                                 focus-visible:after:origin-right
        `}
      >
        {label}
      </button>
    </>
  );
};

export default Button;
