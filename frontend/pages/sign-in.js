import * as React from "react";
import Head from "next/head";
import {Layout} from "../components/shared/menu/Layout";
import config from "../config/default.js"

const serverUrl = config.domain.server
import * as Cookie from "js-cookie"
import {useEffect} from "react";

export default function LoginPage({query, router, pageTitle}) {
    useEffect(() => {
        if (query.next) Cookie.set("next", query.next)
        else Cookie.remove("next")

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (

        <>
            <Head>
                <title>{pageTitle} - Sign In</title>
            </Head>


            <Layout router={router} query={query}>

                <div className="d-flex flex-column flex-root">
                    <div
                        className="login login-2 login-signin-on "
                        id="kt_login">
                        <div
                            className=" bg-white login-aside order-2 order-lg-1 d-flex flex-row-auto position-relative overflow-hidden">

                            <div
                                className="d-flex flex-column-fluid flex-column justify-content-between py-9 px-7 py-lg-13 px-lg-35">

                                <a href="#" className="text-center pt-2">
                                    {/*<img src="/logo.png"*/}
                                    {/*     className="max-h-75px" alt=""/>*/}
                                </a>

                                <div className="d-flex flex-column-fluid flex-column flex-center">

                                    <div className="login-form login-signin py-11">

                                        <form className="form">

                                            <div className="text-center pb-8">
                                                <h2 className="font-weight-bolder text-dark font-size-h2 font-size-h1-lg">Sign
                                                    In</h2>

                                            </div>


                                            <div className="text-center pt-2">
                                                <a
                                                    href={serverUrl + "/auth/linkedin"}
                                                    className="btn btn-dark font-weight-bolder font-size-h6 px-8 py-4 my-3">Sign
                                                    In with Linkedin
                                                </a>
                                            </div>


                                        </form>

                                    </div>


                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </Layout>


            <style jsx>{`
.login, .login-aside {
  min-height: 100vh;
  position:absolute;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}


`}</style>

        </>
    )
}