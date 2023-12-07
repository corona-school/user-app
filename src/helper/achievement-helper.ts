function checkAndGetSecondEnumValue<T extends Record<string, string>>(enumElement: any, comparator: T): keyof T | null {
    if (typeof enumElement !== 'string') {
        return null;
    }
    const capitalizedValue = enumElement.toUpperCase();
    const secondEnumElement = Object.keys(comparator).find((key) => key === capitalizedValue);
    if (secondEnumElement) {
        return secondEnumElement;
    }
    return null;
}

export { checkAndGetSecondEnumValue };
