var codes = '';
var allLanguageNames = '';

var languageToCode = {};
var user1Messages = {};
var user2Messages = {};

var numberOfMessages = 1;
var user1Lang = "en";
var user2Lang = "en";

function callAPI(api)
{
	var scriptcall = document.createElement("script");
	scriptcall.type = 'text/javascript';
	scriptcall.src = api;
	scriptcall.charset = "utf-8";
	document.getElementsByTagName("head")[0].appendChild(scriptcall);
}

function switchUsers(){
  if (document.getElementById("myonoffswitch").checked == false){
		for (var i in user1Messages){
			var p = document.getElementById(i);
			p.innerHTML = user1Messages[i]
		}
  }else {
		for (var i in user2Messages){
			var p = document.getElementById(i);
			p.innerHTML = user2Messages[i]
		}
	}
}

function getTranslation(message)
{
	var id = "p"+(numberOfMessages-1);
	if (document.getElementById("myonoffswitch").checked == false){
		user2Messages[id] = message;
	}
	else {
		user1Messages[id] = message;

	}
}

function convertMessage()
{
	document.getElementById("fromLangSelect").disabled = true;
	document.getElementById("toLangSelect").disabled = true;

  console.log("translating");
	originalMessage = document.getElementById("text").value;
	document.getElementById('text').value = "";

	//Assign the id for all the messages
	var p = document.createElement("p");
	p.id = "p" + numberOfMessages;
	numberOfMessages++;
	p.innerHTML = originalMessage;
	p.className = "chat-message"

	var div = document.createElement("div");
	div.appendChild(p);

	//Adding the message into the hashmap for the user lang
	if (document.getElementById("myonoffswitch").checked == false){
		div.className = "chat user1"
		user1Messages[p.id] = originalMessage;

		fromLang = user1Lang;
		toLang = user2Lang;
	}
	else {
		div.className = "chat user2"
		user2Messages[p.id] = originalMessage;

		fromLang = user2Lang;
		toLang = user1Lang;
	}
	document.getElementsByClassName("chatlogs")[0].appendChild(div);

	sendToAPI = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=getTranslation&appId=86B37AB482F841F7A33D2AB16430EF7C46E8775F&from=" + fromLang + "&to=" + toLang + "&text=" + originalMessage;
	callAPI(sendToAPI);
}

function pressEnter(e){
	if (e.keyCode == 13){
		e.preventDefault();
		convertMessage();
	}
}

function addLangsToMenu(selectMenu){
  for(var i=0; i<codes.length; i++)
  {
    var languageChoice = document.createElement("OPTION");

    languageChoice.text = allLanguageNames[i];
    languageChoice.value = allLanguageNames[i];

    selectbox.appendChild(languageChoice);

    // Set default to English
    if(codes[i] == 'en')
      languageChoice.selected = true;

    languageToCode[allLanguageNames[i]] = codes[i]
  }

}

function obtainLanguages(message)
{
	allLanguageNames = message;

  //Add langs to the select boxes
  selectbox = document.getElementById("fromLangSelect");
  addLangsToMenu(selectbox);
  selectbox = document.getElementById("toLangSelect");
  addLangsToMenu(selectbox);
}

function obtainCodes(message)
{
  //Get codes from the API call
	codes = message;

  //Convert output of codes to an api readable code array
	var name = 'en';
	var code = "[";
	for (var i = 0; i < codes.length; i++)
	{
		code += "\"" + codes[i] + "\"";

    //If you are not at the end of the list
		if (i != codes.length - 1)
			code += ", ";
	}
	code += "]";

	sendToAPI = "http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguageNames?oncomplete=obtainLanguages&appId=86B37AB482F841F7A33D2AB16430EF7C46E8775F" + "&locale=" + name + "&languageCodes=" + code;

	callAPI(sendToAPI);
}

// API method to get all codes
function getAllLangCodes()
{
	api = "http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguagesForTranslate?oncomplete=obtainCodes&appId=86B37AB482F841F7A33D2AB16430EF7C46E8775F";
	callAPI(api);
}

function updateUser1Lang(){
  user1Lang = languageToCode[document.getElementById('fromLangSelect').value];
	document.getElementById("fromLangSelect").disabled = true;
}

function updateUser2Lang(){
  user2Lang = languageToCode[document.getElementById('toLangSelect').value];
	document.getElementById("toLangSelect").disabled = true;
}

window.onload = getAllLangCodes;
