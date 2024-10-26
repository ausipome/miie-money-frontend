// components/BackButton.tsx

import { Button } from '@nextui-org/button';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
  <div className="flex justify-start mb-4">
    <Button onClick={onClick} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Back
    </Button>
  </div>
);

export default BackButton;
