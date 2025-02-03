// components/BackButton.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-515ba5c52c/icons';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
  <div className="flex justify-start">
    <button onClick={onClick} className="px-2 py-2 md:px-4 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm md:text-base">
    <FontAwesomeIcon icon={byPrefixAndName.fas['arrow-left']} /> Back
    </button>
  </div>
);

export default BackButton;
