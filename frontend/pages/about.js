import Head from 'next/head';
import { Layout } from '../components/shared/new/Layout';
import { CommonContent } from '../components/shared/new/CommonContent';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { NotifyComponent } from '../components/shared/Notify';
import { Requests } from '../components/CustomHooks/Requests';

export default function About({ user, serverUrl, clientUrl, router, pageTitle }) {
    const [selectedPlan, setSelectedPlan] = useState('option1');

    const handleChange = (e) => {
        setSelectedPlan(e.target.value);
    }

    const handleSubmitPremium = async () => {
        if (user) {
            try {
                const response = await Requests('post', `${serverUrl}/user/active-subscribe`, {}, { optionType: selectedPlan });
                NotifyComponent('success', response.message)
            } catch (error) {
                NotifyComponent('failure', error.message)
            }
        } else {
            router.push('/sign-in');
        }
    }

    const subscriptionRef = useRef(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && window.location.hash === '#subscription') {
            if (subscriptionRef.current) {
                subscriptionRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [isClient]);

    return (
        <>
            <Head>
                <title>{pageTitle} - About</title>
            </Head>
            <Layout
                loading={false}
                user={user}
                router={router}
                clientUrl={clientUrl}
                serverUrl={serverUrl}
            >
                <style jsx>{`
                    .about-container {
                        background-color: #f5f5f5;
                    }

                    .premium-free {
                        padding: 52px 59px;
                        background-color: #1e202d;
                    }

                    @media (max-width: 960px) {
                        .premium-free {
                            padding: 52px 50px;
                        }
                    }

                    .premium-free .premium-free-title h2 {
                        font-family: 'Inter', 'Noto Sans Hebrew', 'Alef', sans-serif;
                        font-weight: 800;
                        color: #ffffff;
                        font-size: 30px;
                        line-height: 36px;
                        text-align: center;
                        width: 50%;
                        opacity: 0.7;
                    }

                    @media (max-width: 820px) {
                        .premium-free .premium-free-title h2 {
                            width: 100%;
                        }
                    }

                    .premium-free-content {
                        display: flex;
                        flex-direction: row;
                        margin-top: 66px;
                        justify-content: center;
                    }

                    
                    @media (max-width: 820px) {
                        .premium-free-content {
                            flex-direction: column;
                        }
                    }

                    .premium-free-content-left {
                        width: 50%;
                        text-align: center;
                        font-weight: 700;
                        font-size: 24px;
                        line-height: 28.8px;
                        color: rgba(255,255,255,.8);
                    }

                    @media (max-width: 960px) {
                        .premium-free-content-left {
                            padding: 0px;
                        }
                    }

                    @media (max-width: 820px) {
                        .premium-free-content-left {
                            width: 100%;
                        }
                    }

                    .premium-free-content-right {
                        width: 50%;
                    }

                    @media (max-width: 820px) {
                        .premium-free-content-right {
                            width: 100%;
                            margin-top: 21px;
                        }
                    }

                    .premium-free-content-right p {
                        font-weight: 400;
                        font-size: 20px;
                        line-height: 24px;
                        text-align: right;
                        color: #FFFBFB;
                    }

                    .premium-free-content-right p span {
                        font-weight: 700;
                    }

                    .icons-container {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
                        justify-content: center;
                        align-items: center;
                        justify-items: center;
                        margin-bottom: 42px;
                    }

                    .icons-container p {
                        text-align: center;
                        font-weight: 700;
                        font-size: 24px;
                        line-height: 28.8px;
                        color: rgba(255,255,255,.8);
                    }

                    .plus-icon {
                        position: relative;
                        width: 47px;
                        height: 47px;
                    }

                    .plus-icon:after {
                        content: ' ';
                        width: 47px;
                        height: 9px;
                        border-radius: 4px;
                        border: 1px solid rgba(189, 189, 189, 0.8);
                        background-color: #fff;
                        position: absolute;
                        top: 23.5px;
                        left: 0;
                        transform: rotate(90deg);
                    }

                    .plus-icon:before {
                        content: ' ';
                        width: 47px;
                        height: 9px;
                        border-radius: 4px;
                        border: 1px solid rgba(189, 189, 189, 0.8);
                        background-color: #fff;
                        position: absolute;
                        top: 23.5px;
                        left: 0;
                    }

                    .icon-wrapper {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .icon-wrapper {
                        border-radius: 8px;
                        border: 1px solid rgba(252, 252, 255, 0.8);
                    }

                    p {
                        margin-bottom: 0;
                        direction: rtl;
                        unicode-bidi: plaintext;
                    }

                    .how-it-works {
                        padding: 190px 54px 120px;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        gap: 125px;
                    }

                    @media (max-width: 820px) {
                        .how-it-works {
                            flex-direction: column;
                        }
                    }
                        
                    .gmail-img-container {
                        width: 51%;
                    }
                        
                    @media (max-width: 820px) {
                        .gmail-img-container {
                            width: 100%;
                        }
                    }
                                
                            
                    .how-it-works-description,
                    .video-container-description,
                    .why-us-description {
                        text-align: right;
                    }

                    .how-it-works-description h2,
                    .why-us-description h2 {
                        font-weight: 300;
                        font-size: 48px;
                        font-weight: 58px;
                        margin-bottom: 42px;
                        color: #1e202d;
                    }

                    .how-it-works-description p,
                    .video-container-description p, 
                    .why-us-description p {
                        font-weight: 400;
                        font-size: 20px;
                        line-height: 24px;
                        color: #000;
                    }

                    .how-it-works-description p span,
                    .video-container-description p span {
                        font-weight: 700
                    }

                    .video-container {
                        padding: 130px 130px 50px;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        gap: 300px;
                        background-color: rgba(202, 199, 199, 0.4);
                        align-items: center;
                        border-radius: 8px;
                    }

                    @media (max-width: 820px) {
                        .video-container {
                            flex-direction: column;
                            gap: 110px;
                        }
                    }

                    .video-container-description {
                        width: 35%;
                    }

                    @media (max-width: 820px) {
                        .video-container-description {
                            width: 100%;
                            text-align: center;
                        }
                    }

                    .video-container-img-wrapper {
                        width: 41%;
                        max-width: 583px;
                    }
                        
                    @media (max-width: 820px) {
                        .video-container-img-wrapper {
                            width: 100%;
                        }
                    }
                    .why-us-container {
                        padding: 120px 72px 48px 146px;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        gap: 54px;
                    }

                    @media (max-width: 820px) {
                        .why-us-container {
                            flex-direction: column;
                        }
                    }

                    .why-us-description {
                        width: 60%;
                    }

                    @media (max-width: 820px) {
                        .why-us-description {
                            width: 100%;
                        }
                    }

                    .why-us-description h3 {
                        font-weight: 700;
                        font-size: 20px;
                        line-height: 24px;
                        text-decoration: underline;
                        margin-bottom: 21px;
                    }

                    .badge {
                        position: absolute;
                        padding: 5px;
                        background-color: #FFD200;
                        border-radius: 8px;
                        font-weight: 700;
                        font-size: 10px;
                        line-height: 12px;
                        color: #000;
                        letter-spacing: 0px;
                        top: -12px;
                        left: -15px;
                    }

                    .quick-way-container {
                        padding: 160px 62px 120px;
                        background-color: rgba(202, 199, 199, 0.6);
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        gap: 80px;
                    }

                    @media (max-width: 970px) {
                        .quick-way-container {
                            flex-direction: column;
                        }
                    }

                    @media (max-width: 570px) {
                        .quick-way-container {
                            padding-left: 10px;
                            padding-right: 10px;
                        }
                    }

                    .quick-way-container .icon-wrapper {
                        border-color: #1E202D;
                    }

                    .quick-way-container-left h2 {
                        color: #1E202D;
                        font-weight: 300;
                        font-size: 36px;
                        line-height: 43px;
                        text-align: center;
                        margin-bottom: 42px;
                    }

                    .quick-way-container .icons-container p {
                        color: #1E202D;
                        opacity: .7;
                    }

                    .quick-way-container .plus-icon:before,
                    .quick-way-container .plus-icon:after {
                        background-color: #1e202d;
                    }

                    .quick-way-container-right {
                        width: 57%;
                        display: flex;
                        flex-direction: column;
                        align-items: end;
                    }

                    @media (max-width: 970px) {
                        .quick-way-container-right {
                            width: 100%;
                        }
                    }

                    .quick-way-container-right label {
                        background-color: #FFFDFD;
                        border-radius: 8px;
                        display: flex;
                        flex-direction: row;
                        justify-content: end;
                        text-align: right;
                        unicode-bidi: plaintext;
                        padding: 51px 33px 22px;
                        width: 100%;
                        margin-bottom: 32px;
                        position: relative;
                    }

                    .quick-way-container-right label .badge {
                        font-size: 14px;
                        font-weight: 700;
                        line-height: 16.94px;
                        letter-spacing: 0.05em;
                        text-align: center;
                        padding: 12px 30px;
                        left: -82px;
                        top: -20px;
                    }

                    @media (max-width: 570px) {
                        .quick-way-container-right label .badge {
                            left: -8px;
                            padding: 12px;
                        }
                    }

                    .quick-way-container-right label input {
                        margin-left: 25px;
                    }

                    .quick-way-container-right label h5 {
                        font-weight: 700;
                        font-size: 24px;
                        line-height: 29px;
                    }

                    .quick-way-container-right label p {
                        font-weight: 500;
                        font-size: 20px;
                        line-height: 24px;
                    }

                    input[type="radio"] {
                        appearance: none;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        position: relative;
                        width: 30px;
                        height: 30px;
                        border: 2px solid rgba(0, 0, 0, 0.8);
                        border-radius: 50%;
                        background-color: rgba(217, 217, 217, 1);
                        cursor: pointer;
                    }

                    input[type="radio"]:checked::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 14px;
                        height: 14px;
                        background-color: rgba(14, 0, 49, 1);
                        border-radius: 50%;
                        transform: translate(-50%, -50%);
                    }

                    .try-free-button-wrapper {
                        margin-top: 54px;
                        text-align: center;
                        font-weight: 700;
                        font-size: 14px;
                        line-height: 17px;
                        letter-spacing: 0.05em;
                        width: 66.5%;
                        color: #101010;
                    }

                    
                    .try-free-button-wrapper a {
                        display: block;
                        padding: 34px;
                        width: 100%;
                        background-color: #31C5F3;
                        border-radius: 8px;
                        color: #FFFBFB;
                        font-weight: 700;
                        font-size: 24px;
                        line-height: 29px;
                        letter-spacing: 0.05em;
                        margin-bottom: 11px;
                    }
                `}</style>
                <CommonContent />
                <div className="about-container">
                    <div className='premium-free d-flex flex-column'>
                        <div className='premium-free-title'>
                            <h2>נסה/י פרמיום 7 ימים חינם</h2>
                        </div>
                        <div className="premium-free-content">
                            <div className='premium-free-content-left'>
                                <div className='icons-container'>
                                    <div className='icon-wrapper' style={{ width: 108, height: 110 }}>
                                        <Image src={"/assets/image/icon3 1.png"} width={65} height={61} />
                                    </div>
                                    <div className='plus-icon'></div>
                                    <div className='icon-wrapper' style={{ width: 147, height: 148, position: 'relative' }}>
                                        <Image src={"/assets/image/all-jobs.png"} width={70} height={64} />
                                        <span className='badge'>חינם</span>
                                    </div>
                                    <div className='plus-icon'></div>
                                    <div className='icon-wrapper' style={{ width: 108, height: 110 }}>
                                        <Image src={"/assets/image/icon2 1.png"} width={76} height={60} />
                                    </div>
                                    <p>הגש/י בקליק</p>
                                    <div></div>
                                    <p>אתר</p>
                                    <div></div>
                                    <p>ראשון לדעת</p>
                                </div>
                                <p>חשבון 1, 3 מוצרים</p>
                            </div>
                            <div className='premium-free-content-right'>
                                <p>העולם המקצועי נע מהר, מרוחק, פחות לויאלי והחלפת עבודות  שכיחה מבעבר.</p>
                                <p>ויחד עם זאת, הגשת מועמדות למשרה נשארה כשהיתה, פעולה איטית ומייגעת,</p>
                                <p>מבוססת על לוחות דרושים מוטים</p>
                                <br />
                                <p style={{ direction: "ltr", unicodeBidi: 'inherit' }}>משנה זאת<span> AUTOFLY</span></p>
                                <br />
                                <p>חבילת הפרמיום שלנו הופכת את תהליך הגשת המועמדות למהירה וסופר קלה,</p>
                                <p>מתאימה אותה לימינו</p>
                            </div>
                        </div>
                    </div>
                    <div className='how-it-works'>
                        <div className='gmail-img-container'>
                            <Image src={"/assets/image/gmail.png"} width={800} height={345} />
                        </div>
                        <div className='how-it-works-description'>
                            <h2>כיצד זה עובד</h2>
                            <p><span>ראשון לדעת</span> סורק כל שעה אלפי אתרים/מקורות מידע שונים ומושך רק את</p>
                            <p>המשרות החדשות שהתפרסמו. ולאחרי, הוא מעדכן אותך דרך אימייל מיידית,</p>
                            <p>כך שתוכל/י להגיש מועמדות לפני כולם. הגשה ראשונית תבטיח כי מועמדותך</p>
                            <p>תיראה ותיבחן ע”י המעסיק הפוטנציאלי</p>
                        </div>
                    </div>
                    <div className='video-container'>
                        <div className="video-container-description">
                            <p>מצאת משרה מתאימה, לחצ/י על <span>הגש/י בקליק,</span></p>
                            <p>ואנחנו ניקח את זה מכאן הלאה</p>
                        </div>
                        <div className='video-container-img-wrapper'>
                            <Image src={"/assets/image/vimeo.png"} width={593} height={383} />
                        </div>
                    </div>
                    <div className='why-us-container'>
                        <div className='why-us-img-wrapper'>
                            <Image src={"/assets/image/codioful-formerly-gradienta--gmycsIe7FU-unsplash.png"} width={400} height={355} />
                        </div>
                        <div className='why-us-description'>
                            <h2>למה אנחנו</h2>
                            <h3>במירוץ למשרה, תמיד תהי/ה ראשונ/ה</h3>
                            <p>לא עוד חיפוש רציף ומייגע בלוחות דרושים אחר משרה רלוונטית.</p>
                            <p>אנחנו נעדכן אותך מיידית דרך מייל כאשר הזדמנות צצה</p>
                            <h3>קבל/י גישה ליותר משרות</h3>
                            <p>א תפספס שום הזדמנות, כמעט 20 אלף משרות חדשות מכל הענפים יחלקו עימך כל חודש. </p>
                            <p>השתמש במידע זה למציאת העבודה בה אתה חפץ</p>
                            <h3>רק משרות אמיתיות</h3>
                            <p>אתרי דרושים רבים אינם מתווכים הוגנים, כאלה המוכוונים בעיקר לחברות השמה או מעסיקות, ופחות למחפשי העבודה.</p>
                            <p>אנחנו לא כאלה. לא נקדם או נציג משרה שאינה אותנטית, כאן את/ה במרכז הפוקוס</p>
                            <h3>הגש/י בקליק אחד</h3>
                            <p>לא עוד מילוי חוזר ונשנה של פרטיך האישיים, הוספת מכתב מקדים, העלאת קורות חיים, בפעם המיליון.</p>
                            <p>שבון כאן יקנה לך נוחות הגשת מועמדות למשרה, ללא הטרחה הנלווית לה.</p>
                        </div>
                    </div>
                    <div className='quick-way-container' ref={subscriptionRef} id="subscription">
                        <div className='quick-way-container-left'>
                            <h2>הדרך המהירה והקלה <br />למציאת עבודה</h2>
                            <div className='icons-container'>
                                <div className='icon-wrapper' style={{ width: 108, height: 110 }}>
                                    <Image src={"/assets/image/icon3 1.png"} width={65} height={61} />
                                </div>
                                <div className='plus-icon'></div>
                                <div className='icon-wrapper' style={{ width: 147, height: 148, position: 'relative' }}>
                                    <Image src={"/assets/image/all-jobs.png"} width={70} height={64} />
                                    <span className='badge'>חינם</span>
                                </div>
                                <div className='plus-icon'></div>
                                <div className='icon-wrapper' style={{ width: 108, height: 110 }}>
                                    <Image src={"/assets/image/icon2 1.png"} width={76} height={60} />
                                </div>
                                <p>הגש/י בקליק</p>
                                <div></div>
                                <p>אתר</p>
                                <div></div>
                                <p>ראשון לדעת</p>
                            </div>
                        </div>
                        <div className='quick-way-container-right'>
                            <label>
                                <div>
                                    <h5>ראשון לדעת</h5>
                                    <p>4 שקלים מדי חודש לאחר שבוע ניסיון</p>
                                </div>
                                <input type='radio' name='plan' value={"option1"} checked={selectedPlan === 'option1'} onChange={handleChange} />
                                <span className='badge'>נסה 7 ימים חינם</span>
                            </label>
                            <label>
                                <div>
                                    <h5>הגש/י בקליק</h5>
                                    <p>30 שקלים מדי חודש לאחר שבוע ניסיון</p>
                                </div>
                                <input type='radio' name='plan' value={"option2"} checked={selectedPlan === 'option2'} onChange={handleChange} />
                                <span className='badge'>נסה 7 ימים חינם</span>
                            </label>
                            <div className='try-free-button-wrapper'>
                                <a onClick={handleSubmitPremium}>הרשם ונסה חינם</a>
                                ב 7 הימים הראשונים, באפשרותך לבטל את המנוי ללא כל עלות
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}