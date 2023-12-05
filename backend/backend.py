from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from flask import jsonify
from keybert import KeyBERT
from flask import request
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv("env.env")
api_key = os.getenv("API_KEY")

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

def obtain_map_on_topic(topic):
    message_chain = []
    message_chain.append( {"role": "system", "content": 'I want to create a mind map mapping all the knowledge necessary to learn a subject. To accomplish this, I want you to create a json object with node and link fields. The nodes represent subjects. The links represent knowledge prerequisites. For example, knowing multiplication requires knowing addition, so a link is created from addition to multiplication. The nodes field will have the node name under "id," an empty "url" field, and a "visited" field that says false. The link field will have a "source" field and a "target" field, as well as a "value" field that just has 1 in it. The "source" represents a knowledge prerequisite to the "target" node. The nodes are specific and learnable topics that are not broad. If a node would be "<subject> basics," break it up into the basics that the user needs to know. The first node should be the very first basic block that the user should learn to get at learning about the subject. There should be branches of links so the mind map ends up non-linear. The last node should be what the user requests to learn about.'})
    message_chain.append({"role": "user", "content": "Create and return only the mind map for Covid 19"})
    message_chain.append({"role": "assistant", "content":
"""{
    "nodes": [
        {"id": "About", "url": "", "visited": true},
        {"id": "Variants", "url": "", "visited": false},
        {"id": "Spread", "url": "", "visited": false},
        {"id": "Risk", "url": "", "visited": false},
        {"id": "Exposure", "url": "", "visited": false},
        {"id": "Symptoms", "url": "", "visited": false},
        {"id": "Testing", "url": "", "visited": false},
        {"id": "Treatment", "url": "", "visited": false},
        {"id": "Prevention", "url": "", "visited": false},
        {"id": "Misinformation", "url": "", "visited": false},
        {"id": "Reinfection", "url": "", "visited": false},
        {"id": "Vaccine", "url": "", "visited": false}
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
}"""})
    message_chain.append({"role": "user", "content": "Create and return only the mind map for simple linear regression"})
    message_chain.append({"role": "assistant", "content":
"""{
    "nodes": [
        {"id": "Matrix Addition/Subtraction", "url": "", "visited": false},
        {"id": "Transverse", "url": "", "visited": false},
        {"id": "Matrix Multiplication", "url": "", "visited": false},
        {"id": "Matrix Inverse", "url": "", "visited": false},
        {"id": "Normal Equation", "url": "", "visited": false},
        {"id": "Rank", "url": "", "visited": false},
        {"id": "Matrix Dimensionality", "url": "", "visited": false},
        {"id": "Simple Linear Regression", "url": "", "visited": false}
    ],
    "links": [
        {"source": "Matrix Addition", "target": "Matrix Multiplication", "value": 1},
        {"source": "Matrix Dimensionality", "target": "Matrix Multiplication", "value": 1},
        {"source": "Matrix Dimensionality", "target": "Rank", "value": 1},
        {"source": "Rank", "target": "Matrix Multiplication", "value": 1},
        {"source": "Matrix Multiplication", "target": "Matrix Inverse", "value": 1},
        {"source": "Matrix Inverse", "target": "Normal Equation", "value": 1},
        {"source": "Matrix Multiplication", "target": "Normal Equation", "value": 1},
        {"source": "Transverse", "target": "Normal Equation", "value": 1},
        {"source": "Normal Equation", "target": "Simple Linear Regression", "value": 1}
    ]
}"""})
    message_chain.append({"role": "user", "content": f"Create and return only the mind map for {topic}"})
    # model = "gpt-3.5-turbo-1106"
    model = "gpt-4-1106-preview"
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model = model,
        response_format={"type": "json_object"},
        messages=message_chain
    )
    # print(response.choices[0].message.content)
    return response.choices[0].message.content
if __name__ == '__main__':
    app.run(host='localhost', debug=True)
