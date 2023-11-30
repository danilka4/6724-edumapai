import React, { useEffect, useState } from 'react';
import Graph from './Graph';
import Example from './Example'
import WebExtraction from './WebExtraction';

const graphData = {
  nodes : [
      {"id": "Matrix Addition/Subtraction"},
      {"id": "Transverse"},
      {"id": "Matrix Multiplication"},
      {"id": "Matrix Inverse"},
      {"id": "Normal Equation"},
      {"id": "Rank"},
      {"id": "Matrix Dimensionality"}
  ],
  links: [
      {"source": "Matrix Addition/Subtraction", "target": "Matrix Multiplication", "value": 1},
      {"source": "Matrix Dimensionality", "target": "Matrix Multiplication", "value": 1},
      {"source": "Rank", "target": "Matrix Multiplication", "value": 1},
      {"source": "Matrix Dimensionality", "target": "Rank", "value": 1},
      {"source": "Matrix Multiplication", "target": "Matrix Inverse", "value": 1},
      {"source": "Matrix Inverse", "target": "Normal Equation", "value": 1},
      {"source": "Matrix Multiplication", "target": "Normal Equation", "value": 1},
      {"source": "Transverse", "target": "Normal Equation", "value": 1}
  ]
}


function App() {

  


  return (
    <div className="App">
      <center>
      <h1>EduMap</h1>
      <h2>COVID Information</h2>
      </center>   
      {/* <Graph  data={graphData} width={500} height={500}/> */}
      <Example></Example>
      <WebExtraction url={"https://www.vt.edu/"}/>
    </div> 
  );
}

export default App;
