import { Layout } from "../components/shared/new/Layout.js";
import Head from "next/head";
import * as React from "react";
import config from "../config/default.js"
const serverUrl = config.domain.server
import * as Cookie from "js-cookie"
import {useEffect} from "react";
import Image from "next/image";
import Link from 'next/link';
import { Requests } from "../components/CustomHooks/Requests.js";
import { NotifyComponent } from "../components/shared/Notify.js";

function SignUp({ query, router, pageTitle, user, serverUrl }) {
    useEffect(() => {
        if (query.next) Cookie.set("next", query.next)
        else Cookie.remove("next")
    }, [])

    const handleCreatUser = async (e) => {
        try {
            e.preventDefault();
            const formData = new FormData(e.target);
            const userData = {
                username: formData.get('full'),
                phoneNumber: formData.get('phoneNumber'),
                email: formData.get('email'),
                password: formData.get('password'),
            }
            const url = `${serverUrl}/user`
            const data = await Requests('post', url, {}, userData)
            NotifyComponent('success', "Success")
            router.push('/sign-in')
        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    return (
        <>
            <Head>
                <title>{pageTitle} - Sign Up</title>
            </Head>
            <Layout loading={false} router={router} user={user}>
                <style jsx>{`
                    .sign-in-container {
                        display: flex;
                        flex-direction: row;
                    }

                    .sign-in-background {
                        width: 50%;
                        background: linear-gradient(180deg, #FFFFFF 0%, #48286B 100%);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }

                    .sign-in-background .img-container {
                        margin-top: 350px;
                    }

                    .sign-in-background h1 {
                        font-family: Nunito;
                        font-size: 50px;
                        font-weight: 700;
                        line-height: 68.2px;
                        letter-spacing: 0.16em;
                        text-align: center;
                        color: #fffcfc;
                        margin-top: 205px;
                    }

                    .sign-in-content {
                        padding: 250px 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        width: 50%;
                    }

                    .sign-in-content h3 {
                        font-family: Poppins;
                        font-size: 16px;
                        font-weight: 400;
                        line-height: 24px;
                        text-align: center;
                        margin: 41px 0;
                        color: #000;
                    }

                    .sign-in-content .sign-in-title-line {
                        width: 154px;
                        height: 1px;
                        background-color: #524C4C61;
                    }

                    .sign-in-content h2 {
                        padding: 42px;
                        font-size: 20px;
                        font-weight: 400;
                        line-height: 30px;
                        letter-spacing: 0.12em;
                        text-align: left;
                        color: #000;
                    }

                    .third-party-login {
                        display: flex;
                        gap: 31px;
                    }
                    
                    .third-party-login a {
                        font-family: Poppins;
                        font-size: 16px;
                        font-weight: 400;
                        line-height: 22.5px;
                        text-align: center;
                        color: #72655F;
                        border: 1px solid #524C4C61;
                        background-color: white;
                        padding: 8px 40px;
                        border-radius: 5px;
                    }
                        
                    .third-party-login a span {
                        margin-left: 14px;
                    }

                    .sign-in-content button[type="submit"] {
                        font-size: 16px;
                        font-weight: 500;
                        line-height: 24px;
                        letter-spacing: 0.12em;
                        text-align: center;
                        color: #fff;
                        background: #31C5F3;
                        border-radius: 5px;
                        border: none;
                        margin: 47px 0;
                        padding: 17px 2px;
                        width: 100%;
                    }

                    .to-profile {
                        font-size: 16px;
                        font-weight: 400;
                        line-height: 34px;
                        letter-spacing: 0.08em;
                        text-align: center;
                        color: #332F2E;
                    }

                    .to-profile a {
                        font-weight: 600;
                        color: #0079B9;
                    }

                    @media (max-width: 1170px) {
                        .sign-in-container {
                            flex-direction: column;
                        }

                        .sign-in-container .sign-in-background {
                            width: 100%;
                        }

                        .sign-in-container .sign-in-background .img-container {
                            margin-top: 50px
                        }

                        .sign-in-container .sign-in-background h1 {
                            margin: 50px 0;
                        }

                        .sign-in-container .sign-in-content {
                            width: 100%;
                            padding: 20px 0;
                        }
                    }

                    @media (max-width: 560px) {
                        .third-party-login {
                            flex-direction: column;
                        }

                        .sign-in-content .sign-in-title-line {
                            display: none;
                        }
                    }
                `}</style>
                <div className="sign-in-container">
                    <div className="sign-in-background">
                        <div className="img-container">
                            <Image src="/assets/image/logo.png" width={99} height={207} />
                        </div>
                        <h1>AUTOFLY</h1>
                    </div>
                    <div className="sign-in-content">
                        <div>
                            <div className="sign-in-title d-flex flex-row align-items-center justify-content-center">
                                <div className="sign-in-title-line"></div>
                                <h2>בוא/י נתחיל</h2>
                                <div className="sign-in-title-line"></div>
                            </div>
                            <div className="third-party-login">
                            <Link href={serverUrl + "/auth/google"}><a><Image src="/assets/image/google-icon.png" width={14} height={14} /><span>Google Account</span></a></Link>
                                <Link href={serverUrl + "/auth/linkedin"}><a><Image src="/assets/image/linkedin-icon.png" width={14} height={14} /><span>LinkedIn Account</span></a></Link>
                            </div>
                            <h3>OR</h3>
                            <form onSubmit={handleCreatUser}>
                                <CustomInput label={"שם"} defaultValue={''} name={'full'} placeholder={"Enter your full name"} />
                                <CustomInput label={"מספר נייד"} defaultValue={''} name={'phoneNumber'} placeholder={"Enter your phone number(e.g. +972524001234)"} />
                                <CustomInput label={"אימייל"} defaultValue={''} name={'email'} placeholder={"Please enter your email address"} />
                                <CustomInput label={"סיסמא"} defaultValue={''} name={'password'} placeholder={"Please enter your password"} type={"password"} />
                                <button type="submit">הרשמה</button>
                            </form>
                            <p className="to-profile">יש לך כבר חשבון? <Link href="/sign-in"><a>כנס/י</a></Link></p>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default SignUp;

function CustomInput({ label, defaultValue, name, placeholder, type="text" }) {
    return (
        <>
            <style jsx>{`
                .custom-input {
                    margin-top: 7px;
                }

                .custom-input label {
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 24px;
                    letter-spacing: -0.02em;
                    text-align: right;
                    color: #636162;
                }

                .custom-input input {
                    font-family: Poppins;
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 21px;
                    text-align: left;
                    background-color: #FFF;
                    border-radius: 5px;
                    border: 1px solid #524C4C61;
                    padding: 15px 20px;
                    width: 100%;
                }

                .custom-input input.with-icon {
                    background-image: url(/assets/image/linkedin-icon.png);
                    background-repeat: no-repeat;
                    background-position: 34px;
                }
            `}</style>
            <div className="custom-input d-flex flex-column">
                <label>{label}</label>
                <input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} />
            </div>
        </>
    )
}