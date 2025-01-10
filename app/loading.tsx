import React from 'react';
import { Spinner } from '@nextui-org/spinner';

const Loading: React.FC = () => {
    return (
        <div className="flex justify-center relative mt-20">
            <img src="/icon.png" alt="Logo" className="absolute w-48 h-48" />
            <Spinner color="warning" size="lg" className="absolute top-20" />
        </div>
         );
};

export default Loading;