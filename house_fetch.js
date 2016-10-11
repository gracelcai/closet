

var settings = require("./settings.js");

async function getHousesPage(pageNo) {
  try {
    let response = await fetch(settings.url + "/house_price/1000000/");
    let responseJson = await response.json();
    return responseJson;
  } catch(error) {
    console.error(error);
  }
}

module.exports = getHousesPage
