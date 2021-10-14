const express = require("express");
const app = express();
const fs = require("fs");

const quotes = require("./quotes.json");

// get all the quotes
const gettingQuotes = (request, response) => {
  response.send(quotes);
}

// get a quote by ID
const getQuoteById = (request, response) => {
  const quoteId = parseInt(request.params.id);
  const foundId = quotes.find((quote) => quote.id === quoteId);
  if (!foundId) {
    response.status(404).send('Sorry!, We cannot find it!!')
  } else {
    response.send(foundId);
  }
}

// creating new quote
const creatingQuote = (request, response) => {
  const newQuote = request.body;

  // providing unique id for the new quote
  const maxId = Math.max(...quotes.map((q) => q.id)) // returns max id
  newQuote.id = maxId + 1;

  //checking that the same quote doesn't exist already
  const sameQuote = quotes.find((q) => q.quote === newQuote.quote);
  if (sameQuote) {
    console.log(sameQuote);
    response.status(400).send("This quote already exist!!!")
  } else {
    quotes.push(newQuote);
  }

  //saving quotes
  fs.writeFileSync("./quotes.json", JSON.stringify(quotes, null, 4));

  // result to the client
  response.status(201).send(newQuote);
}

// updating a object that already exist
const updateQuote = (request, response) => {
  const quoteId = parseInt(request.params.id);

  //finding the id which be the same that the paramater id
  const findingId = quotes.find((quote) => quote.id === quoteId);

  // modify the object
  findingId.author = request.body.author;
  findingId.quote = request.body.quote;

  //updating json file with the data
  fs.writeFileSync("./quotes.json", JSON.stringify(quotes, null, 4));

  response.status(201).send('The quote have been updated!!')
}

const deleteQuote = (request, response) => {
  const quoteId = parseInt(request.params.id);

  const foundQuote = quotes.find((quote) => quote.id === quoteId);
  if (foundQuote) {
    quotes.splice(quotes.indexOf(foundQuote), 1)

    fs.writeFileSync("./quotes.json", JSON.stringify(quotes, null, 4))
    
    response.status(201).send("The quote have been deleted");
  } else {
    
    response.status(404).send("Sorry!, we cannot found the given id!!")
  }
}

app.use(express.json());
app.get("/quotes", gettingQuotes);
app.get("/quotes/:id", getQuoteById);
app.post("/quotes", creatingQuote);
app.put("/quotes/:id", updateQuote);
app.delete("/quotes/:id", deleteQuote);

app.listen(3000, () => console.log("Listening on port 3000"));
