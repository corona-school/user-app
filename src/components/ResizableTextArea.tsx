import { useState } from 'react';
import { Input, useBreakpointValue } from 'native-base';

interface InputProps {
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
}

const ResizableTextArea: React.FC<InputProps> = ({ value, placeholder, onChangeText }) => {
    const [height, setHeight] = useState<number>(0);
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    return (
        <Input
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            style={{ height: Math.max(isMobile ? 100 : 300, height) }}
            autoCompleteType={'normal'}
            onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
            multiline
        />
    );
};

export default ResizableTextArea;
