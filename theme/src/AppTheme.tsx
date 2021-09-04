import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native-appearance';

type _Mode = 'light' | 'dark';

export const ThemeContext = React.createContext<{
  Mode: _Mode;
  ModeBool: boolean;
  Theme: any;
  Toggle: (e: _Mode) => void;
}>({
  Mode: 'light',
  ModeBool: true,
  Theme: {},
  Toggle: () => {},
});

interface _ThemeProviderProps {
  children: any;
  theme: {
    light: {
      [key: string]: any;
    };
    dark: {
      [key: string]: any;
    };
  };
}

export function ThemeProvider({ children, theme }: _ThemeProviderProps) {
  React.useEffect(() => {
    (async () => {
      let a = await AsyncStorage.getItem('ThemeMode');
      // eslint-disable-next-line eqeqeq
      if (a == 'light' || a == 'dark') {
        setMode(a);
        setModeBool(a == 'light');
      } else if (a == 'system') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        let b = useColorScheme() == 'dark';
        setMode(b ? 'dark' : 'light');
        setModeBool(!b);
      }
    })();
  }, []);

  const [Mode, setMode] = React.useState<_Mode>('light');
  const [ModeBool, setModeBool] = React.useState(true);

  const Toggle = (tMode: _Mode | 'system') => {
    return new Promise(async (res) => {
      if (tMode == 'system') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        let b = useColorScheme() == 'dark';
        setMode(b ? 'dark' : 'light');
        setModeBool(!b);
      } else {
        setMode(tMode);
        setModeBool(tMode == 'light');
      }
      await AsyncStorage.setItem('ThemeMode', tMode);
      res(true);
    });
  };

  const Theme = Mode == 'light' ? theme.light : theme.dark;

  return (
    <ThemeContext.Provider value={{ Mode, ModeBool, Theme, Toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
