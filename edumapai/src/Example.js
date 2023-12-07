import React, { useRef, useEffect, useState } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import define from "./0f203da9fadaee30/0f203da9fadaee30@739";
import "./Example.css";

function Example() {
    const ref = useRef();
    const [selectedOption, setSelectedOption] = useState("default");
    const [customMapName, setCustomMapName] = useState("");
    const [showCustomMapInput, setShowCustomMapInput] = useState(false);
    var jsonData = {
    "nodes": [
        {"id": "About", "url": "https://www.cdc.gov/coronavirus/2019-ncov/your-health/about-covid-19.html#:~:text=COVID%2D19%20", "visited": true},
        {"id": "Variants", "url": "https://www.cdc.gov/coronavirus/2019-ncov/variants/index.html#:~:text=Variants%20Are%20Expected&text=Some%20changes%20and%20mutations%20allow,and%20become%20harder%20to%20stop", "visited": false},
        {"id": "Spread", "url": "https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/how-covid-spreads.html", "visited": false},
        {"id": "Risk", "url": "https://www.cdc.gov/coronavirus/2019-ncov/your-health/risks-getting-very-sick.html", "visited": false},
        {"id": "Exposure", "url": "https://www.cdc.gov/coronavirus/2019-ncov/your-health/if-you-were-exposed.html", "visited": false},
        {"id": "Symptoms", "url": "https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/symptoms.html", "visited": false},
        {"id": "Testing", "url": "https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/testing.html", "visited": false},
        {"id": "Treatment", "url": "https://www.cdc.gov/coronavirus/2019-ncov/your-health/treatments-for-severe-illness.html", "visited": false},
        {"id": "Prevention", "url": "https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html#:~:text=In%20those%20situations%2C%20use%20as,sick%20or%20who%20tested%20positive", "visited": false},
        {"id": "Misinformation", "url": "https://www.cdc.gov/vaccines/covid-19/health-departments/addressing-vaccine-misinformation.html", "visited": false},
        {"id": "Reinfection", "url": "https://www.cdc.gov/coronavirus/2019-ncov/your-health/reinfection.html", "visited": false},
        {"id": "Vaccine", "url": "https://www.cdc.gov/coronavirus/2019-ncov/vaccines/different-vaccines/overview-COVID-19-vaccines.html", "visited": false}
    ],
    "links": [
        {"source": "About", "target": "Spread", "value": 1},
        {"source": "About", "target": "Variants", "value": 1},
        {"source": "Spread", "target": "Risk", "value": 1},
        {"source": "Risk", "target": "Exposure", "value": 1},
        {"source": "Risk", "target": "Prevention", "value": 1},
        {"source": "Prevention", "target": "Misinformation", "value": 1},
        {"source": "Misinformation", "target": "Vaccine", "value": 1},
        {"source": "Exposure", "target": "Testing", "value": 1},
        {"source": "Testing", "target": "Treatment", "value": 1},
        {"source": "Treatment", "target": "Reinfection", "value": 1},
        {"source": "Treatment", "target": "Misinformation", "value": 1},
        {"source": "Misinformation", "target": "Variants", "value": 1},
        {"source": "Exposure", "target": "Symptoms"}
    ]
};

    useEffect(() => {
        const runtime = new Runtime();
        runtime.module(define, (name, value) => {
            if (name === "EduMap") {
                // Define a generator cell for EduMap
                return {
                    fulfilled: (value) => {
                        // Access the value and update the map accordingly
                        // value will contain the result of the cell execution
                        console.log(jsonData)
                        ref.current.innerHTML = "";
                        ref.current.appendChild(value(
                            jsonData, []));
                    }
                };
            }
        });
        return () => runtime.dispose();
    }, [selectedOption]);

    const handleDropdownChange = async (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        try {
            // Check if the JSON file exists by fetching and checking the response status
            const dataToSend = { param1: `${selectedValue}.json` };
            const response = await fetch("/jason", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dataToSend }),
            });

            if (!response.ok) {
                // JSON file does not exist or there was an error
                console.error(`Error loading JSON data for ${selectedValue}.json:`, response.statusText);
                return;
            }

            // JSON file exists, proceed to parse and use the data
            jsonData = await response.json();

            console.log(`Loaded JSON data for ${selectedValue}.json:`, jsonData);

            // Check if the selected option is "Generate own map"
            setShowCustomMapInput(selectedValue === "custom_gen");
            console.log("HEHEHE", jsonData);
            // You can perform additional actions based on the selected option if needed
        } catch (error) {
            console.error(`Error loading JSON data for ${selectedValue}.json:`, error);
        }
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
                        <option value="covid">Covid Information</option>
                        <option value="slr">Simple Linear Regression</option>
                        <option value="kpop">K-Pop</option>
                        <option value="custom_gen">Generate own map</option>
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
