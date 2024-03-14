import React from "react";
import Header from "../components/Header";

import PolyethyleneTip from "../tips/PolyethyleneTip";
import LightFuelTip from "../tips/LightFuelTip";
import ElectricityTip from "../tips/ElectricityTip";
import SourcesTip from "../tips/SourcesTip";

import styles from "./TipsPage.module.scss";

function TipsPage() {
    function Tip(tipData: any[]) {
        return (
            <div className={`${styles.tip}`}>
                <div className={`${styles.title}`}>
                    <h1>{tipData[0]}</h1>
                </div>
                <div className={`${styles.content}  no-defaults`}>
                    {tipData[1]}
                </div>
            </div>
        );
    }

    return (
        <>
            <Header page="tips" />
            <div className={`${styles.tipContainer}`}>
                {Tip(ElectricityTip)}
                {Tip(LightFuelTip)}
                {Tip(PolyethyleneTip)}
            </div>
        </>
    );
}

export default TipsPage;
