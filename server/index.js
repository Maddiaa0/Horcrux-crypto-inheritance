// simply just want to test all of the logic that i need to test, as sidetree does not appear to work in the browser :(

// my stuff
import identityManager from "./services/IdentityManager.js";

const express = require('express')
const app = express()
const port = 3000


function testFunc(){
    const returned = identityManager.createDIDOther();
    console.log(returned);
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  testFunc()
})



