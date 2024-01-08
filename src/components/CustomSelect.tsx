import { ISelectProps, Select as NBSelect } from 'native-base';

/*
    Issue: https://github.com/GeekyAnts/NativeBase/issues/5111
    This component is a custom Select component that fixes a bug in NativeBase where only a single character is accepted on controlled input. It does this by setting the selection to 1 if the user is using Safari
*/
const CustomSelect = (props: ISelectProps) => {
    const isSafari = () => /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

    // ugly "props as any" hack to satisfy typescript though keeping it type-safe
    return <NBSelect {...(props as any)} selection={isSafari() ? 1 : null} />;
};

CustomSelect.Item = NBSelect.Item;
export default CustomSelect;
