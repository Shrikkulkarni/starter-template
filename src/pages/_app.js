import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import ReactGA from 'react-ga';
import TopBarProgress from 'react-topbar-progress-indicator';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import '@/styles/globals.css';
let rawdata = require('../messages/en.json');

let langCode = "en"
let langObject = {}
langObject[langCode] = {}

langObject[langCode].translation = rawdata
i18n
  .use(initReactI18next)
  .init({
    resources: langObject,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

const App = ({ Component, pageProps }) => {
  const [progress, setProgress] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      ReactGA.pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <SessionProvider session={pageProps.session}>
        <ThemeProvider attribute="class">
        </ThemeProvider>
    </SessionProvider>
  );
};

export default App;
