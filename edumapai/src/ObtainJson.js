import React, { useEffect, useState } from 'react';


function ObtainJson({link}) {
  const [message, setMessage] = useState('');

  
  const dataToSend = {param1:link};
  useEffect(() => {
    fetch("/jason",{
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
      <h1>{message}</h1>
    </div>
  );
}


export default ObtainJson;
