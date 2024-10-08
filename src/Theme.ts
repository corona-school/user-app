import { extendTheme } from 'native-base';

const VAR_COLOR_PRIMARY_LIGHT = '#EDF4F3';
const VAR_COLOR_PRIMARY = '#82B1B0';
const VAR_COLOR_PRIMARY_DARK = '#2B4B51';
const VAR_COLOR_YELLOW = '#FEDA50';
const VAR_COLOR_YELLOW_LIGHT = '#FBEFC6';
const VAR_COLOR_YELLOW_DARKEN = '#F4CC54';
const VAR_COLOR_PRIMARY_GREY = '#95A5A8';
const VAR_COLOR_DARKYELLOW = '#d0b345';
const VAR_COLOR_SECONDARY_LIGHT = VAR_COLOR_YELLOW_LIGHT;
const VAR_COLOR_SECONDARY = VAR_COLOR_YELLOW;
const VAR_COLOR_BLUE = '#405B73';
const VAR_COLOR_TERTIARY = VAR_COLOR_BLUE;
const VAR_COLOR_RED = '#D45D3A';
const VAR_COLOR_GREEN = '#5BA54F';
const VAR_COLOR_DANGER = VAR_COLOR_RED;
const VAR_COLOR_WARNING = VAR_COLOR_RED;
const VAR_COLOR_SUCCESS = VAR_COLOR_GREEN;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VAR_COLOR_TEXT_LIGHT = '#ffffff';
const VAR_COLOR_MODAL_BG = '#edf4f3f2';
const VAR_COLOR_LIGHT_GREY = '#8C9FA2';

const Theme = extendTheme({
    colors: {
        primary: {
            translucent: '#EDF4F316',
            darkTranslucent: 'rgba(31,76, 82, .73)',
            grey: VAR_COLOR_PRIMARY_GREY,
            100: VAR_COLOR_PRIMARY_LIGHT,
            200: VAR_COLOR_PRIMARY_LIGHT,
            300: VAR_COLOR_PRIMARY_LIGHT,
            400: VAR_COLOR_PRIMARY,
            500: VAR_COLOR_PRIMARY,
            600: VAR_COLOR_PRIMARY,
            700: VAR_COLOR_PRIMARY_DARK,
            800: VAR_COLOR_PRIMARY_DARK,
            900: VAR_COLOR_PRIMARY_DARK,
        },
        secondary: {
            100: VAR_COLOR_SECONDARY_LIGHT,
            200: VAR_COLOR_SECONDARY,
            300: VAR_COLOR_SECONDARY,
            400: VAR_COLOR_SECONDARY,
            500: VAR_COLOR_SECONDARY,
            600: VAR_COLOR_SECONDARY,
            700: VAR_COLOR_SECONDARY,
            800: VAR_COLOR_SECONDARY,
            900: VAR_COLOR_SECONDARY,
        },
        tertiary: {
            100: VAR_COLOR_TERTIARY,
            200: VAR_COLOR_TERTIARY,
            300: VAR_COLOR_TERTIARY,
            400: VAR_COLOR_TERTIARY,
            500: VAR_COLOR_TERTIARY,
            600: VAR_COLOR_TERTIARY,
            700: VAR_COLOR_TERTIARY,
            800: VAR_COLOR_TERTIARY,
            900: VAR_COLOR_TERTIARY,
        },
        success: {
            translucent: '#ecfdf3',
            100: VAR_COLOR_SUCCESS,
            200: VAR_COLOR_SUCCESS,
            300: VAR_COLOR_SUCCESS,
            400: VAR_COLOR_SUCCESS,
            500: VAR_COLOR_SUCCESS,
            600: VAR_COLOR_SUCCESS,
            700: VAR_COLOR_SUCCESS,
            800: VAR_COLOR_SUCCESS,
            900: VAR_COLOR_SUCCESS,
        },
        warning: {
            100: VAR_COLOR_WARNING,
            200: VAR_COLOR_WARNING,
            300: VAR_COLOR_WARNING,
            400: VAR_COLOR_WARNING,
            500: VAR_COLOR_WARNING,
            600: VAR_COLOR_WARNING,
            700: VAR_COLOR_WARNING,
            800: VAR_COLOR_WARNING,
            900: VAR_COLOR_WARNING,
            1000: VAR_COLOR_YELLOW_DARKEN,
        },
        danger: {
            100: VAR_COLOR_DANGER,
            200: VAR_COLOR_DANGER,
            300: VAR_COLOR_DANGER,
            400: VAR_COLOR_DANGER,
            500: VAR_COLOR_DANGER,
            600: VAR_COLOR_DANGER,
            700: VAR_COLOR_DANGER,
            800: VAR_COLOR_DANGER,
            900: VAR_COLOR_DANGER,
        },
        darkText: VAR_COLOR_PRIMARY_DARK,
        modalbg: VAR_COLOR_MODAL_BG,
    },
    fontSizes: {
        xs: '0.714rem',
        sm: '0.957rem',
        md: '1rem',
        lg: '1.214rem',
        xl: '1.357rem',
        // xs: 10,
        // sm: 12,
        // md: 15,
        // lg: 17,
        // xl: 19
    },
    sizes: {
        headerSizePx: 56,
        headerPaddingYPx: 8,
        imageHeaderWidth: '680px',
        contentContainerWidth: '680px',
        containerWidth: '1500px',
        desktopbuttonWidth: 'max-content',
        ModalContent: '590px',
        formsWidth: '768px',
        smallWidth: '400px',
    },
    components: {
        Text: {
            defaultProps: {
                fontSize: 'md',
                fontWeight: 400,
                color: VAR_COLOR_PRIMARY_DARK,
            },
        },
        Heading: {
            defaultProps: {
                fontSize: 'xl',
                color: VAR_COLOR_PRIMARY_DARK,
            },
        },
        Button: {
            defaultProps: {
                _text: {
                    fontWeight: 500,
                    fontSize: 14,
                },
                _disabled: {
                    backgroundColor: 'gray.500',
                },
            },
            variants: {
                solid: {
                    backgroundColor: VAR_COLOR_YELLOW,
                    _text: {
                        color: VAR_COLOR_PRIMARY_DARK,
                        fontSize: 14,
                        padding: '3px 5px',
                    },
                    _hover: {
                        backgroundColor: VAR_COLOR_DARKYELLOW,
                    },
                },
                secondary: {
                    backgroundColor: VAR_COLOR_BLUE,
                },
                outline: {
                    _text: {
                        color: VAR_COLOR_PRIMARY_DARK,
                    },
                    _light: {
                        borderColor: VAR_COLOR_PRIMARY,
                        _text: {
                            color: VAR_COLOR_PRIMARY_DARK,
                        },
                    },
                },
                outlinelight: {
                    _light: {
                        borderColor: VAR_COLOR_PRIMARY,
                        borderWidth: 1,
                        _text: {
                            color: 'white',
                        },
                    },
                },
                outlinemiddle: {
                    borderColor: VAR_COLOR_PRIMARY,
                    borderWidth: 1,
                    _hover: {
                        bg: `rgba(130,177,176,0.9)`,
                    },
                    _pressed: {
                        bg: `rgba(130,177,176,0.2)`,
                    },
                },
                link: {
                    textDecoration: 'underline',
                    textDecorationColor: VAR_COLOR_PRIMARY,
                },
            },
            sizes: {
                xs: {
                    px: 2,
                    py: 2,
                    _text: {
                        fontSize: 'sm',
                    },
                },
            },
        },
        Input: {
            defaultProps: {
                paddingTop: 4,
                paddingBottom: 4,
                color: VAR_COLOR_PRIMARY_DARK,
                backgroundColor: VAR_COLOR_PRIMARY_LIGHT,
                borderColor: VAR_COLOR_PRIMARY_LIGHT,
                borderRadius: 5,
                fontSize: 14,
                fontWeight: 400,
                _hover: {
                    borderColor: VAR_COLOR_PRIMARY_LIGHT,
                    backgroundColor: VAR_COLOR_PRIMARY_LIGHT,
                },
                _light: {
                    placeholderTextColor: '#777777',
                },
            },
        },
        TextArea: {
            defaultProps: {
                paddingTop: 4,
                paddingBottom: 4,
                color: VAR_COLOR_PRIMARY_DARK,
                backgroundColor: VAR_COLOR_PRIMARY_LIGHT,
                borderColor: VAR_COLOR_PRIMARY_LIGHT,
                borderRadius: 5,
                fontSize: 14,
                fontWeight: 400,
                _hover: {
                    borderColor: VAR_COLOR_PRIMARY_LIGHT,
                    backgroundColor: VAR_COLOR_PRIMARY_LIGHT,
                },
                _light: {
                    placeholderTextColor: VAR_COLOR_PRIMARY_DARK,
                },
            },
        },
        Checkbox: {
            defaultProps: {
                backgroundColor: VAR_COLOR_PRIMARY_LIGHT,
                padding: 1,
                borderWidth: 0,

                _checked: {
                    backgroundColor: VAR_COLOR_PRIMARY_DARK,
                },
            },
        },
        Alert: {
            defaultProps: {
                background: VAR_COLOR_PRIMARY_LIGHT,
                _icon: {
                    color: VAR_COLOR_PRIMARY_DARK,
                },
            },
        },
        FormControlLabel: {
            baseStyle: {
                _text: {
                    fontWeight: 700,
                    color: VAR_COLOR_PRIMARY_DARK,
                    fontSize: 14,
                },
            },
        },
        Switch: {
            defaultProps: {
                onThumbColor: VAR_COLOR_PRIMARY_LIGHT,
                onTrackColor: VAR_COLOR_PRIMARY_DARK,
                offThumbColor: VAR_COLOR_LIGHT_GREY,
                offTrackColor: VAR_COLOR_PRIMARY_GREY,
                _hover: {
                    offTrackColor: VAR_COLOR_PRIMARY_GREY,
                    onTrackColor: VAR_COLOR_PRIMARY_DARK,
                },
            },
        },
        Modal: {
            sizes: {
                full: {
                    contentSize: {
                        width: '80%',
                    },
                },
            },
        },
    },
    config: {
        initialColorMode: 'light',
    },
});

export default Theme;
