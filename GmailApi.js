const axios = require('axios');
const qs = require('qs');

class GmailApi{

    accessToken = "";
    constructor() {
    this.accessToken = this.getAccessToken();
  }

getAccessToken = async () =>{

    let data = qs.stringify({
        'client_id': '146527058831-0kmbblghf35hu2q6034jjkdir5ll0r9o.apps.googleusercontent.com',
        'client_secret': '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',
        'refresh_token': '1//0gea4mKc61a7iCgYIARAAGBASNwF-L9Irw14EOP60yN9jfRaR2tv7INM5JrdgAJxO4prTeuMgM3eqXn3ASxUP41j86hv72TnZAHI',
        'grant_type': 'refresh_token' 
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://accounts.google.com/o/oauth2/token',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',       
         // 'Cookie': '__Host-GAPS=1:cRSEgy3deANdFEOK5P775NWp9h7Uyw:BgCCVl4Nf1iSHwNd'
      },
        data : data
      };
         
      let accessToken = "";
      await axios.request(config)
      .then(async function (response) {
        accessToken= await response.data.access_token;
        console.log("Access Token : " + accessToken);
      })
      .catch((error) => {
        console.log(error);
      });
      
      return accessToken;
}

searchGmail = async (searchItem) => {
    var config1 = {
      method: "get",
      url:
        "https://www.googleapis.com/gmail/v1/users/me/messages?q=" + searchItem,
        
      headers: {
        Authorization: `Bearer ${await this.accessToken} `,
      },
    };
    console.log("\nSearch Email : "+ searchItem);

    var threadId = "";
    await axios(config1)
      .then(async function (response) {
        threadId = await response.data["messages"][0].id;
        console.log("ThreadId / Id = " + threadId);
      })
      .catch(function (error) {
        console.log(error);
      });
    return threadId;
  };


  readGmailContent = async (messageId) => {
    var config = {
      method: "get",
      url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      headers: {
        Authorization: `Bearer ${await this.accessToken}`,
      },
    };
    var data = {};

    await axios(config)
      .then(async function (response) {
        data = await response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    return data;
  };


  emailInboxContent = async (searchText) => {
    const threadId = await this.searchGmail(searchText);
    const message = await this.readGmailContent(threadId);

    const encodedMessage = await message.payload["parts"][0].body.data;

    const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");

    console.log("\n"+ decodedStr);

    return decodedStr;
  };


}

module.exports= new GmailApi();