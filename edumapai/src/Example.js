import React, { useRef, useEffect, useState } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import define from "./0f203da9fadaee30/0f203da9fadaee30@739";
import "./Example.css";

function Example() {
    const ref = useRef();
  const [selectedOption, setSelectedOption] = useState("default");
  const [customMapName, setCustomMapName] = useState("");
  const [showCustomMapInput, setShowCustomMapInput] = useState(false);

    useEffect(() => {
        const runtime = new Runtime();
        runtime.module(define, name => {
            if (name === "chart") {
                return new Inspector(ref.current);
            }
        });
        return () => runtime.dispose();
    }, [selectedOption]);

    const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Check if the selected option is "Generate own map"
    setShowCustomMapInput(selectedValue === "option4");
        // You can perform additional actions based on the selected option if needed
    };

  const handleCustomMapNameChange = (event) => {
    setCustomMapName(event.target.value);
  };

  const handleGenerateMapClick = () => {
    // Perform actions with the custom map name, e.g., pass it to the backend
    console.log("Custom Map Name:", customMapName);
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
      {/* Conditionally render the custom map input field and button */}
      {showCustomMapInput && (
        <div className="CustomMapContainer">
          <label htmlFor="customMapName">I want to learn about </label>
          <input
            type="text"
            id="customMapName"
            value={customMapName}
            onChange={handleCustomMapNameChange}
          />
          <button onClick={handleGenerateMapClick}>Generate Map</button>
        </div>
      )}
    </div>
      <div ref={ref}></div>
    </div>
                );
}

                export default Example;
