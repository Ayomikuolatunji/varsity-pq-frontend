import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import store, { persistor } from "../src/app/store";
import "../styles/globals.css";

// for cropper js
import "cropperjs/dist/cropper.css";

import { Header, MetaTags } from "../components/index";

import AOS from "aos";
import "aos/dist/aos.css";

// for smooth animation
import "animate.css";

function MyApp({ Component, pageProps, ...appProps }) {
  useEffect(() => {
    AOS.init();
  });

  // exclude navbar from dashboard
  const getContent = () => {
    if (
      [
        "/dashboard",
        "/dashboard/create-course",
        "/dashboard/create-pastquestion",
        "/dashboard/courses",
        "/dashboard/settings",
        "/dashboard/pastquestions",
      ].includes(appProps.router.pathname)
    ) {
      return <Component {...pageProps} />;
    }

    return (
      <>
        <Header />
        <Component {...pageProps} />
      </>
    );
  };

  return (
    <div className="font-body">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MetaTags />
          {getContent()}
        </PersistGate>
      </Provider>
    </div>
  );
}

export default MyApp;
