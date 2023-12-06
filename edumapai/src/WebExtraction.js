import React, { useEffect, useState } from 'react';


function WebExtraction({url}) {
  const [message, setMessage] = useState('');

  
  const dataToSend = {param1:url};
  useEffect(() => {
    fetch("/data",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataToSend }),
    }).then((res) =>
            res.json().then((data) => {
              console.log(data);
                // Setting a data from api
                setMessage(data.data);
            })
        );
    }, []);


  return (
    <div>
      <h4>{message}</h4>
    </div>
  );
}


export default WebExtraction;