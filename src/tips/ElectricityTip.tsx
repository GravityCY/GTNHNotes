import React from "react";

export default [
    "Electricity",
    <>
        <p>
            When getting into LV and trying to understand how electricity works
            in GTNH, it&#39;s kind of daunting.
        </p>
        <p>
            To simplify it without over-explaining, here as some do&#39;s and
            dont&#39;s.
        </p>
        <h2 id="donts">Dont&#39;s</h2>
        <ul>
            <li>
                Do not provide too much voltage to a cable
                <ul>
                    <li>
                        Make sure your generators are outputting the same
                        voltage as your cables
                    </li>
                    <li>
                        If you have a 32V generator make sure you have 32V
                        Cables!
                    </li>
                </ul>
            </li>
            <li>
                Do not have more generators than your cable can handle!
                <ul>
                    <li>
                        Each generator is 1A
                        <ul>
                            <li>If you have 1 generator have 1A cables</li>
                            <li>If you have 2 generators have 2A cables</li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
        <h2 id="dos">Do&#39;s</h2>
        <ul>
            <li>
                Machines can withstand more than 1A!
                <ul>
                    <li>
                        If your cables contain anything higher than 1A, machines
                        are fine with that!
                    </li>
                </ul>
            </li>
            <li>I can&#39;t think of anything else.</li>
        </ul>
    </>,
];
