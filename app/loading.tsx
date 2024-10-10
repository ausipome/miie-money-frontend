import React from 'react';
import { Spinner } from '@nextui-org/spinner';

const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
        <Spinner className="ml-1 mt-0.5" color="warning" size="lg"/>
        </div>
    );
};

export default Loading;