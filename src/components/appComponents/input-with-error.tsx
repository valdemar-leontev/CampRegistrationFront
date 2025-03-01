import { Input } from '../ui/input';


interface InputWithErrorProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const InputWithError = ({ error, ...props }: InputWithErrorProps) => {
  return (
    <div>
      <Input {...props} />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};