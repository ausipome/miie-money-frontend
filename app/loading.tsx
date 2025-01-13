import React from 'react';
import { Spinner } from '@nextui-org/spinner';
import Image from "next/image";

const Loading: React.FC = () => {
    return (
        <div className="flex justify-center relative mt-20">
            <Image 
            src="/icon.png" alt="Logo" 
            className="absolute"
            width={48}
            height={48} />
            <Spinner color="warning" size="lg" className="absolute top-20" />
        </div>
         );
};

export default Loading;