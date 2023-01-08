import { StyleSheet, css } from 'aphrodite';
import { SiTarget } from 'react-icons/si';

import { centerReferralDimension } from '../../../constants';
import { useReferral } from '../../../hooks';

const styles = StyleSheet.create({
    referralContainer: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        minWidth: centerReferralDimension,
        minHeight: centerReferralDimension,
        maxWidth: centerReferralDimension,
        maxHeight: centerReferralDimension,
        color: '#efefef',
        fontSize: centerReferralDimension,
        zIndex: 1,
    },
    referral: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const CenterReferral = () => {
    const { referral } = useReferral();
    return (
        referral.x >= 0 &&
        referral.y >= 0 && (
            <div style={{ left: referral.x, top: referral.y }} className={css(styles.referralContainer)}>
                <div className={css(styles.referral)}>
                    <SiTarget />
                </div>
            </div>
        )
    );
};
