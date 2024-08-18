import 'notiflix/dist/notiflix-3.0.1.min.css'
import config from "../config/default.js"

const serverUrl = config.domain.server
const clientUrl = config.domain.client
import { GetUser } from "../components/CustomHooks/GetUser";
import { useEffect, useState } from "react";
import 'reactjs-popup/dist/index.css';
import { useRouter } from "next/router";
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from "react-redux";
import { store } from "../state/store";
import { CssBaseline } from '@material-ui/core';
import theme from '../components/shared/theme.js';

const AppComponent = ({ Component, pageProps }) => {
    const router = useRouter()
    const { query } = router;
    const [user, setUser] = useState(null)

    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) jssStyles.parentElement.removeChild(jssStyles);
    }, []);
    // async function userChecks() {

    //     const userData = await GetUser("/");
    //     if (router.pathname !== '/sign-in' && router.pathname !== '/jobs' && !userData && !router.pathname.includes('jobs/')) return router.push("/jobs")
    //     setUser(userData)
    // }


    // useEffect(() => {
    //     userChecks()
    // }, [])


    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div>
                    <Component
                        {...pageProps}
                        // user={user} 
                        serverUrl={serverUrl} query={router.query}
                        // userChecks={userChecks}
                        router={router} pageTitle={"Job Board"} clientUrl={clientUrl} />
                </div>
            </ThemeProvider>
        </Provider>

    )
};

AppComponent.getInitialProps = async appContext => {
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    ;
    return {
        pageProps
    };
};

export default AppComponent;
