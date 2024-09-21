const Input = ({
  name,
  type,
  placeholder,
  value,
  disabled,
  fullWidth,
  onChange, // Add onChange prop
}: {
  name: string;
  type: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void; // Add type for onChange
}) => {
  return (
    <input
      name={name}
      type={type}
      disabled={disabled}
      value={value}
      required
      placeholder={placeholder}
      onChange={onChange} // Handle change
      className={`h-20 bg-transparent border-b text-3xl w-4/5 self-center focus:outline-none
      ${disabled && "opacity-50 cursor-default"}
      ${fullWidth && "w-full"}
      `}
    />
  );
};

export default Input;
