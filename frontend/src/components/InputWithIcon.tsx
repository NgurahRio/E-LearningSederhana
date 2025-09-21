import type { ReactNode} from "react";

type Props = {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
};

export default function InputWithIcon({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  leftIcon,
  rightIcon,
  onRightIconClick,
}: Props) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-600">
        {label}
      </label>
      <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-sm">
        {/* Icon kiri */}
        {leftIcon && <div className="text-gray-500 mr-2">{leftIcon}</div>}
        
        {/* Input */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 outline-none border-0 focus:ring-0 text-sm"
        />
        
        {/* Icon kanan */}
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
}
