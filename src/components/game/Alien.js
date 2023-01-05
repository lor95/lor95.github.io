import { useFrame, useLoader } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useCallback, useRef } from 'react';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { Lasers, useLaser } from './effects/Lasers';

//http://freesoundeffect.net/sound/small-laser-06-sound-effect

export const Alien = (props) => {
    const alienBody = useRef();
    //const defaultVector = new Vector3();
    // let canFire = true;

    // const mainQuaternion = new Quaternion();
    // mainQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), 0);
    // const refQuaternion = new Quaternion();
    // refQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);

    const materials = useLoader(MTLLoader, 'models/ufo.mtl');
    const alien = useLoader(OBJLoader, 'models/ufo.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    const addLaser = useLaser((state) => state.addLaser);
    const fireLaser = useCallback(
        (props) => {
            addLaser(props);
        },
        [addLaser]
    );

    setInterval(() => {}, 500);

    useFrame(() => {});

    return (
        <>
            <RigidBody friction={0.1} ref={alienBody}>
                <primitive
                    position={[4, 6.5, 4]}
                    object={alien}
                    scale={0.37}
                    rotation={[0, -Math.PI / 2, 0]}
                    castShadow
                    receiveShadow
                />
                <CuboidCollider
                    name="alien"
                    args={[2.3, 0.5, 2.3]}
                    position={[4, 9, 4]}
                    onIntersectionEnter={({ colliderObject }) => {
                        colliderObject.name !== 'alien_laser' && console.log('alien', colliderObject);
                    }}
                />
            </RigidBody>
            {/* <Lasers name="starship_laser" explosionCallback={props.explosionCallback} laserSounds={props.laserSounds} /> */}
        </>
    );
};
