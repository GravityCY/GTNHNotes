import { useEffect, useRef, useState } from "react";
import styles from "./Calculator.module.scss";
import "expr-eval";
import { Parser } from "expr-eval";

import { setFocus, getFocus } from "./Global";
import { DEBUG } from "./utils"

const parser = new Parser();

function Calculator() {
    const [show, setShow] = useState(false);
    const [input, setInput] = useState("0");

    const ref = useRef(null);

    function append(v) {
        setInput(input + v);
    }

    const nums = [];
    let x = 1;
    let y = 3;
    nums.push(<p onClick={() => append("0")} style={{ gridRow: 4, gridColumnStart: 1, gridColumnEnd: 4 }} className={styles.btn}>0</p>);
    for (let i = 1; i < 10; i++) {
        if (i == 4 || i == 7) {
            y--;
            x = 1;
        }
        const elem = <p onClick={() => append(i.toString())} style={{ gridColumn: x, gridRow: y }} className={styles.btn}>{i}</p>;
        nums.push(elem);
        x++;
    }

    useEffect(() => {
        if (ref.current !== null)
            setFocus(ref.current);
        function onCalc(e) {
            const number = Number.parseInt(e.key);
            if (e.key === "Enter") {
                setInput(parser.evaluate(input));
            } else if (e.key === "Backspace") {
                setInput(input.slice(0, -1));
            } else if (e.key === "Escape") {
                setInput("");
            } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
                append(e.key);
            } else if (!Number.isNaN(number)) {
                append(number.toString());
            } else {
                return;
            }
            DEBUG("Preventing default key for: " + e.key);
            e.preventDefault();
        }

        function onKey(e) {
            if (e.keyCode == 67 && e.shiftKey) {
                setShow(!show);
            } else if (show && ref.current.contains(getFocus())) {
                onCalc(e);
                return;
            } else {
                return;
            }
            e.preventDefault();
        }

        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [input, show, ref.current]);

    return (
        <>
            {<div ref={ref} className={styles.calculator + " " + (show ? styles.show : styles.hide)}>
                <div>
                    <h1>{input}</h1>
                </div>
                <div className={styles.inputs}>
                    <div className={styles.nums}>{nums}</div>
                    <div className={styles.operators}>
                        <p onClick={() => append("+")} className={styles.btn}>+</p>
                        <p onClick={() => append("-")} className={styles.btn}>-</p>
                        <p onClick={() => append("*")} className={styles.btn}>*</p>
                        <p onClick={() => append("/")} className={styles.btn}>/</p>
                        <p onClick={() => setInput("")} className={styles.btn}>C</p>
                        <p onClick={() => {setInput(parser.evaluate(input).toString())}} className={styles.btn}>=</p>
                    </div>
                </div>
            </div>}
        </>
    );
}

export default Calculator;