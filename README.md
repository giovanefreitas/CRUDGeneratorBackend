# MongoDB and Express.js REST API sample application

This repository contains the sample application for the [MongoDB and Express.js REST API tutorial](https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial).

## How To Run

1. You can follow the [Getting Started with Atlas](https://docs.atlas.mongodb.com/getting-started/) guide, to learn how to create a free Atlas account, create your first cluster and get your Connection String to the database.
Then, set the Atlas URI connection parameter in `server/.env` to your Connection String:
```
ATLAS_URI=mongodb+srv://<username>:<password>@sandbox.jadwj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

2. Start the Express server:
```
docker run -p 27017:27017 --name mongodb -d mongo:6.0.7
cd server
npm install
npm run dev
```

3. Start the React app (in a new terminal window):
```
cd app
npm install
npm start
```

4. Testando

wget http://localhost:5050/exportar/64ac2f9f5cb711f1fd3c1e4d -O projeto.zip ; Expand-Archive "projeto.zip" -DestinationPath "./" -Force ; del projeto.zip

## Modelo de dados

{
	"name": "Projeto XPTO",
	"entities": [
		
	],
	"screens": [
        {
			"name": "produto", >>>> usado nas rotas do Vuejs
			"label": "Cadastro de produto",
            "entity": "Produto",
			"type": "grid",
			"subfields": [...]
        },
        ...
    ]
}

Screen element:

{
    "id": "subfields_0",
    "subheader_update": true,  <<<<< IGNORAR NO FRONTEND
    "order_rank": 0,  <<<<< IGNORAR NO FRONTEND
    "name": "header",
    "label": "Título",
    "label_display": "Título da seção",
    "type": "header",
    "tagname": "h1",
    "textalign": "text-left",
    "subfields": [],
    "active": true,
    "placeholder": "CEP",
}