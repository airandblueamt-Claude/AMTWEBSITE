import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AiAssistant from "./components/AiAssistant";
import RouteSeo from "./seo/RouteSeo";
import Analytics from "./components/Analytics";
import {
  DEFAULT_LOCALE,
  getLocaleDirection,
  isSupportedLocale,
  withLocale,
} from "./utils/localeRouting";

const HomePage = lazy(() => import("./pages/HomePage"));
const About = lazy(() => import("./components/About"));
const Solutions = lazy(() => import("./components/Solutions"));
const SolutionDetails = lazy(() => import("./components/SolutionDetails"));
const Projects = lazy(() => import("./components/Projects"));
const Contact = lazy(() => import("./components/Contact"));
const NewsDetails = lazy(() => import("./pages/NewsDetails"));
const NotFound = lazy(() => import("./components/NotFound"));

const DataNetwork = lazy(() => import("./ict/DataNetwork"));
const UnifiedCommunications = lazy(() => import("./ict/UnifiedCommunications"));
const Wireless = lazy(() => import("./ict/Wireless"));
const DataCenter = lazy(() => import("./ict/DataCenter"));
const NetworkSecurity = lazy(() => import("./ict/NetworkSecurity"));
const IpTelephony = lazy(() => import("./ict/IpTelephony"));

const FireAlarm = lazy(() => import("./low-current-systems/FireAlarm"));
const CCTV = lazy(() => import("./low-current-systems/CCTV"));
const AccessControl = lazy(() => import("./low-current-systems/AccessControl"));
const MasterClock = lazy(() => import("./low-current-systems/MasterClock"));

const MeetingConferenceRoomsAV = lazy(() => import("./Audio_Visual_Systems/MeetingConferenceRoomsAV"));
const AuditoriumsTheaters = lazy(() => import("./Audio_Visual_Systems/AuditoriumsTheaters"));
const IPTVDigitalSignage = lazy(() => import("./Audio_Visual_Systems/IPTVDigitalSignage"));
const VideoWallMounting = lazy(() => import("./Audio_Visual_Systems/VideoWallMounting"));
const InteractiveScreens = lazy(() => import("./Audio_Visual_Systems/InteractiveScreens"));

const OSP_Solutions = lazy(() => import("./OSP_Solutions/OSP_Solutions"));

const CctvSystemsPage = lazy(() => import("./pages/services/CctvSystemsPage"));
const AccessControlServicePage = lazy(() => import("./pages/services/AccessControlServicePage"));
const NetworkInfrastructurePage = lazy(() => import("./pages/services/NetworkInfrastructurePage"));
const SmartBuildingSolutionsPage = lazy(() => import("./pages/services/SmartBuildingSolutionsPage"));
const AudioVisualSystemsPage = lazy(() => import("./pages/services/AudioVisualSystemsPage"));

const RouteFallback = () => (
  <div
    className="min-h-[50vh] w-full flex items-center justify-center text-gray-400 text-sm"
    role="status"
    aria-live="polite"
  >
    Loading…
  </div>
);

const LocaleLayout: React.FC = () => {
  const { i18n } = useTranslation();
  const { locale } = useParams();
  const location = useLocation();
  const activeLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;

  useEffect(() => {
    if (i18n.language !== activeLocale) {
      void i18n.changeLanguage(activeLocale);
    }

    document.documentElement.lang = activeLocale;
    document.documentElement.dir = getLocaleDirection(activeLocale);
  }, [activeLocale, i18n]);

  if (!isSupportedLocale(locale)) {
    return <Navigate to={withLocale(location.pathname, DEFAULT_LOCALE)} replace />;
  }

  return (
    <div className="min-h-screen bg-transparent text-copy overflow-x-hidden font-body">
      <div className="amt-atmosphere" aria-hidden="true" />
      <RouteSeo />
      <Analytics />

      <Header />

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route index element={<HomePage />} />

          <Route path="about" element={<About />} />
          <Route path="services/cctv-systems" element={<CctvSystemsPage />} />
          <Route path="services/access-control" element={<AccessControlServicePage />} />
          <Route path="services/network-infrastructure" element={<NetworkInfrastructurePage />} />
          <Route path="services/smart-building-solutions" element={<SmartBuildingSolutionsPage />} />
          <Route path="services/audio-visual-systems" element={<AudioVisualSystemsPage />} />
          <Route path="services" element={<Solutions standalone />} />
          <Route path="solution-details" element={<SolutionDetails />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contact" element={<Contact />} />

          <Route path="news/:slug" element={<NewsDetails />} />

          <Route path="ict/data-network" element={<DataNetwork />} />
          <Route path="ict/unified-communications" element={<UnifiedCommunications />} />
          <Route path="ict/wireless" element={<Wireless />} />
          <Route path="ict/data-center" element={<DataCenter />} />
          <Route path="ict/network-security" element={<NetworkSecurity />} />
          <Route path="ict/ip-telephony" element={<IpTelephony />} />

          <Route path="low-current/fire-alarm" element={<FireAlarm />} />
          <Route path="low-current/cctv" element={<CCTV />} />
          <Route path="low-current/access-control" element={<AccessControl />} />
          <Route path="low-current/master-clock" element={<MasterClock />} />

          <Route path="av/meeting-rooms" element={<MeetingConferenceRoomsAV />} />
          <Route path="av/auditoriums" element={<AuditoriumsTheaters />} />
          <Route path="av/iptv" element={<IPTVDigitalSignage />} />
          <Route path="av/video-wall" element={<VideoWallMounting />} />
          <Route path="av/interactive-screens" element={<InteractiveScreens />} />

          <Route path="osp-solutions" element={<OSP_Solutions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <AiAssistant />

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    document.documentElement.lang = DEFAULT_LOCALE;
    document.documentElement.dir = getLocaleDirection(DEFAULT_LOCALE);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={withLocale("/", DEFAULT_LOCALE)} replace />} />
        <Route path="/:locale/*" element={<LocaleLayout />} />
        <Route path="*" element={<Navigate to={withLocale("/", DEFAULT_LOCALE)} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
