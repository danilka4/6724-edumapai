import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import WebExtraction from './WebExtraction';

export default function UrlSearch() {

    const [text, setText] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [key, setKey] = React.useState('');

    console.log(key);

    React.useEffect(() => {
        if (!(key === '') && text != key ){
            setUrl('');
        }
    }, [text]);
      
    function handleSubmit(){
        if (text === ''){
            alert("Please enter a url");
            setUrl(text);
        }
        else{
            if(text.includes("http://") || text.includes("https://")){
                setUrl(text);
            }
            else{
                    setUrl("https://"+text);
            }
        }
    }

    React.useEffect(() => {
        setKey(url);
    }, [url]);

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <TextField 
            id="outlined-basic" 
            label="Url" 
            variant="outlined"
            onChange={(event) => setText(event.target.value)} />
            <Button variant='outlined'
            onClick={handleSubmit}>Get Keywords</Button>
            {!(key === '') &&
            <h4>
                <WebExtraction url={key} />
            </h4>}
        </Box>
    );
}