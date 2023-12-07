function ObtainJson({link}) {

  
  const dataToSend = {param1:link};
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
              return data.data;
          })
      );
}


export default ObtainJson;
