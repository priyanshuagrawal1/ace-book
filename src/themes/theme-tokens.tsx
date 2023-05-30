import { ThemeSchema } from './theme-schema';
// import { createTheme } from '@teambit/base-react.theme.theme-provider'

export const defaultTheme: ThemeSchema = {
    myColorBackground: '#ffffff',
    myColorText: 'purple',
    myFontSize: '26px',
    myBorderColor: 'purple',
    myBorderRadius: '5px',
};

export const darkTheme: ThemeSchema = {
    myColorBackground: '#000',
    myColorText: 'red',
    myBorderColor: 'red'
}
