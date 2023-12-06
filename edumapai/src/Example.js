import React, { useRef, useEffect, useState } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import define from "./0f203da9fadaee30/0f203da9fadaee30@739";
import "./Example.css";

function Example() {
    const ref = useRef();
    const [selectedOption, setSelectedOption] = useState("default");

    useEffect(() => {
        const runtime = new Runtime();
        runtime.module(define, name => {
            if (name === "chart") {
                return new Inspector(ref.current);
            }
        });
        return () => runtime.dispose();
    }, []);

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
        // You can perform additional actions based on the selected option if needed
    };

    return (
        <div>
    <div className="GraphContainer">
      <div className="DropdownContainer">
        <label htmlFor="dropdown">Select an option:</label>
        <select id="dropdown" value={selectedOption} onChange={handleDropdownChange}>
                            <option value="default" disabled>Select an option</option>
                            <option value="option1">Covid Information</option>
                            <option value="option2">Simple Linear Regression</option>
                            <option value="option3">K-Pop</option>
                            <option value="option4">Generate own map</option>
        </select>
      </div>
    </div>
      <div ref={ref}></div>
    </div>
                );
}

                export default Example;
