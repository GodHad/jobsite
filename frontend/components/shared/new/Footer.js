export default function Footer() {
    return (
        <div className="footer d-flex flex-column">
            <style jsx>
            {`
                .footer {
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
            <a href="#">כניסה / הרשמה</a>
            <a href="#">חשבון</a>
            <a href="#">משרות</a>
            <a href="#">אודות</a>
            <p>Copyright © 2024. All rights reserved.</p>
        </div>
    )
}