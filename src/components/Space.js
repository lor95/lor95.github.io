import { useTexture } from '@react-three/drei';
import { Suspense } from 'react';

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
};

const Space = () => {
    let textureFile;
    const dimensions = getWindowDimensions();
    dimensions.width > dimensions.height ? (textureFile = 'space-w.jpg') : (textureFile = 'space-h.jpg');
    const texture = useTexture(textureFile);
    return (
        <Suspense fallback={null}>
            <primitive attach="background" object={texture} />
        </Suspense>
    );
};

export default Space;
