import { Select as NBSelect } from 'native-base';

const SafariSelect = (props: any) => {
    const isSafari = () => /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

    return <NBSelect {...props} selection={isSafari() ? 1 : null} />;
};

SafariSelect.Item = NBSelect.Item;
export default SafariSelect;
export { SafariSelect };
