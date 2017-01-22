var Alexa = require('alexa-sdk');
var https = require('https');
var http = require('http');



exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context)
  //Before this line is importing the SDK
  alexa.registerHandlers(handlers);
  //Registers the handlers function of the alex object created
  //alexa.registerHandlers(handler1,handler2,handler3)
  alexa.execute();}



var handlers = {
    'LaunchRequest': function(){
    this.emit(':tell','Hey');
  },
//    'IntentRequest': function(){
//    this.emit(':ask','GetWordDef');
//  },
  'GetWordDef' : function () {

 var wordD = this.event.request.intent.slots.WordDef.value;

    var options = {
        host: 'od-api.oxforddictionaries.com',
        path: '/api/v1/entries/en/'+wordD ,
        headers: {
          Accept: "application/json",
          app_id: "e0fe36a7",
          app_key: "34dbdb5e71626e9247aa5d17bdb3d22d"
        }
    };
    var that = this;
    var req = https.get(options, function(res ) {
          res.setEncoding('utf8');

            var returnData = "";
            var definition = "";

          res.on('data', chunk => {
            //console.log(chunk);
              returnData = returnData + chunk;
          });
          res.on('end',  () => {
            //console.log(returnData);
            var final = JSON.parse(returnData);
            definition = final.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
            that.emit(':tell',"The definition of "+wordD+" is ,"+definition);
          });



    });
    //tell is when Alexa tells you something
    //ask is when Alexa ask you something
  },
  'GetWordSynonym' : function()
  {
    var wordS = this.event.request.intent.slots.WordSyn.value;
    var options = {
        host: 'words.bighugelabs.com',
        path: '/api/2/145caad7fd1e560adbb4ac8d507a9f90/'+wordS+'/json'

    };

    var that = this;
    var req = http.get(options, function(res ) {
          res.setEncoding('utf8');

            var returnData = "";
            var synonym = "";

          res.on('data', chunk => {
            //console.log(chunk);
              returnData = returnData + chunk;
          });
          res.on('end',  () => {
            var final = JSON.parse(returnData);
            var partsOfSpeech = Object.keys(final);

            //console.log(returnData);
            var synonymIndex = Math.floor(Math.random() * partsOfSpeech.length);
            console.log(synonymIndex);
            console.log(partsOfSpeech);
            console.log(partsOfSpeech[synonymIndex]);
            console.log(final[partsOfSpeech[synonymIndex]].syn[0]);
            synonym = final[partsOfSpeech[0]].syn[0];
            that.emit(':tell',"A synonym of "+wordS+" is ,"+synonym);
          });



    });
  },
  'Unhandled': function(){
    this.emit(':ask','I didn\'t get that');
  }

};
