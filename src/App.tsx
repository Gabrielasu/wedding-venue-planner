/**
 * App — composes Toolbar, Palette, Canvas, Inspector.
 */
import { useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { Palette } from './components/Palette';
import { Canvas } from './components/Canvas';
import { Inspector } from './components/Inspector';
import { useTranslation } from './i18n/useTranslation';

export default function App() {
  const { lang } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="app">
      <Toolbar />
      <div className="main">
        <Palette />
        <Canvas />
        <Inspector />
      </div>
    </div>
  );
}
