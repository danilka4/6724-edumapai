from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from flask import jsonify
from keybert import KeyBERT
from flask import request

kw_model = KeyBERT()


def extract_text_from_url(url):
    try:
        # Send a request to the URL
        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 200:
            # Parse the content of the page
            soup = BeautifulSoup(response.content, 'html.parser')

            # Extract text from the parsed HTML
            text = soup.get_text(separator=' ', strip=True)
            return text
        else:
            return f"Failed to retrieve the webpage. Status code: {response.status_code}"
    except Exception as e:
        return str(e)



app = Flask(__name__)
CORS(app)


@app.route('/data', methods=['POST'])
def data():
    data = request.get_json()
    print("#########",data['dataToSend']['param1'])
    url = data['dataToSend']['param1']
    text = extract_text_from_url(url)
    keywords = kw_model.extract_keywords(text)
    keymessage = f'Top 5 keywords: {[x[0] for x in keywords[:5]]}'
    return {
        'data': keymessage
        }

if __name__ == '__main__':
    app.run(debug=True)