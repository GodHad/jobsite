import Link from 'next/link';

export default function Footer({ serverUrl }) {
    return (
        <div className="footer d-flex flex-column">
            <style jsx>
                {`
                .footer {
                    font-family: 'Inter', 'Noto Sans Hebrew', 'Alef', sans-serif;
                    padding: 74px 88px 50px 71px;
                    background-color: #1E202D;
                }
                
                .footer a {
                    text-align: right;
                    color: #fff;
                    font-weight: 400;
                    font-size: 15px;
                    line-height: 20px;
                    margin: 0;
                    margin-bottom: 16px;
                }

                .footer p {    
                    margin: 0;
                    margin-top: 103px;
                    font-weight: 400;
                    font-size: 15px;
                    line-height: 20px;
                    color: white;
                    opacity: .5;
                }
            `}
            </style>
            <Link href={"/sign-in"}><a>כניסה / הרשמה</a></Link>
            <Link href={"/sign-in"}><a>חשבון</a></Link>
            <Link href={"/jobs"}><a>משרות</a></Link>
            <Link href="/about"><a>אודות</a></Link>
            <p>Copyright © 2024. All rights reserved.</p>
        </div>
    )
}