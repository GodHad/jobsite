import ClipLoader from "react-spinners/ClipLoader";
import * as React from "react";

export function DivLoader (){
    return (
        <div className={"loader-div"}>
            <div className={"loader-container"}>
                <ClipLoader/>
            </div>

            <style jsx>{`
                .loader-container {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    background-color: rgb(82 63 105 / 15%);
                    z-index: 1000;
                }                
                
                `}</style>

        </div>
    )
}