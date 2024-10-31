// components/HomeButton.tsx

import { Button } from '@nextui-org/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

interface HomeButtonProps {
  onClick: () => void;
}

const HomeButton: React.FC<HomeButtonProps> = ({ onClick }) => (
  <div className="flex justify-start mb-4">
    <Button onClick={onClick} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      <FontAwesomeIcon icon={byPrefixAndName.fas['house']} /> Home
    </Button>
  </div>
);

export default HomeButton;
