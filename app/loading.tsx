import React from 'react';
import { Spinner } from '@nextui-org/spinner';

const Loading: React.FC = () => {
    return (
        <div className="flex justify-center h-full">
        <Spinner color="warning" size="lg"/>
        </div>
    );
};

export default Loading;