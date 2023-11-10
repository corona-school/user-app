import { Box } from 'native-base';

type InnerShadowProps = {
    deviation?: number;
};

const InnerShadow: React.FC<InnerShadowProps> = ({ deviation }) => {
    return (
        <Box width="100%" height="100%" position="absolute" zIndex={1}>
            <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g width="100%" height="100%" filter="url(#filter0_i_1111_19771)">
                    <rect width="100%" height="100%" rx="8" fill="#D9D9D9" fill-opacity="0.15" />
                    <g filter="url(#filter1_d_1111_19771)"></g>
                </g>
                <defs width="100%" height="100%">
                    <filter id="filter0_i_1111_19771" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feGaussianBlur stdDeviation={deviation || 1} />
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1111_19771" />
                    </filter>
                </defs>
            </svg>
        </Box>
    );
};

const InnerShadowStory = () => {
    return (
        <Box width="280px" height="380px">
            <InnerShadow deviation={7.5} />
        </Box>
    );
};

export default InnerShadow;

export { InnerShadowStory };
