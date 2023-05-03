import { createStyles } from '@mantine/core';
import { SiTarget } from 'react-icons/si';

import { centerReferralDimension } from '../../../constants';
import { useReferral } from '../../../hooks';

const useStyles = createStyles(() => ({
    referralContainer: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        color: '#efefef',
        zIndex: 1,
        minWidth: centerReferralDimension,
        minHeight: centerReferralDimension,
        maxWidth: centerReferralDimension,
        maxHeight: centerReferralDimension,
        fontSize: centerReferralDimension,
    },
    referral: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

export const CenterReferral = () => {
    const { referral } = useReferral();
    const { classes } = useStyles();
    return (
        referral.x >= 0 &&
        referral.y >= 0 && (
            <div style={{ left: referral.x, top: referral.y }} className={classes.referralContainer}>
                <div className={classes.referral}>
                    <SiTarget />
                </div>
            </div>
        )
    );
};
