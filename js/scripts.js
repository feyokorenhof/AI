const button = document.querySelector('.talk');
const vraagcontent = document.querySelector('.question');
const antwoordcontent = document.querySelector('.answer');
const weathercontent = document.querySelector('.weather');
var apikey = "2e171c9c3340edd86e3becb0f15f576d";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
var canSpeak = true;
var isListening = false;
var currentWindow = "";
var windows = [];
// getLocation();


recognition.onstart = function(){
    console.log('You can speak');
    isListening = true;
};

recognition.onspeechend = function(){

};

recognition.onend = function(){
    if(canSpeak){
        recognition.start();
    }    
    else{
        canSpeak = false;
        isListening = false;
    }
};

recognition.onresult = function(event){
    const current = event.resultIndex;

    const transcript = (event.results[current][0].transcript).toString().toLowerCase();
    vraagcontent.textContent = transcript;
    
    
        if(transcript.includes("poepie") && canSpeak){   
            if(transcript.includes("luister")){
                var ret3 = transcript.replace("poepie", "");
                if(ret3.length == 8){
                    isListening = true;
                    canSpeak = true;
                    readOutLoud("Ik luister, meneer");
                    console.log(isListening);
                }
                
            }                        
            if(transcript.includes("stop")){
                var ret1 = transcript.replace("poepie", "");
                if(ret1.length == 5){
                    isListening = false;
                    canSpeak = false;
                    readOutLoud("Okay, meneer");      
                    console.log(isListening);              
                }
                
                
            }

            if(isListening == true){
                    if(transcript.includes("open")){
                        var ret0 = transcript.replace("open", '');
                        var ret1 = ret0.replace("poepie", '');
                        var ret2 = ret1.replace(/\s/g, '');
                    
                    if(ret2 != "" || ret2 != " "){                    
                        readOutLoud("Ik open " + ret2 + " voor u, meneer");
                        var url = "https://www." + ret2 + ".com";
                        //console.log(url);
                        this.currentWindow = window.open(url, ret2);
                        windows.push(this.currentWindow);
                        console.log(windows);
                    }
                    
                }

                if(transcript.includes("sluit")){
                    var ret0 = transcript.replace("sluit", '');
                    var ret1 = ret0.replace("poepie", '');
                    var ret2 = ret1.replace(/\s/g, '');
                    
                    if(ret2 != "" || ret2 != " "){                    
                        readOutLoud("Ik sluit " + ret2 + " voor u, meneer");
                        //var url = "https://www." + ret2 + ".com";
                        //console.log(url);
                        windows.forEach(function(element){
                            var elementIndex = windows.indexOf(element);
                            element.close();
                            console.log(windows);
                            
                            
                        });
                    }
                    
                }


                if(transcript.includes("hoe laat") || transcript.includes("what time") ){
                    var today = new Date();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var msg = time.substring(0,2) + " uur " + time.substring(2, 4) + " minuten " + time.substring(4, 6) + " seconden ";
                    readOutLoud(msg);

                }

                if(transcript.includes("welke dag") || transcript.includes("what day")){
                    var today = new Date();
                    var dobArr = today.toDateString().split(' ');
                    var dobFormat = dobArr[2] + ' ' + dobArr[1] + ' ' + dobArr[3];
                    readOutLoud(dobFormat);

                }
                if(transcript.includes("weer") || transcript.includes("weather")){
                    getLocation();
                    canSpeak = true;
                    antwoordcontent.textContent = "";
                
                }
                if(transcript == "poepie" || transcript == "poepie" || transcript == "jij" || transcript == "Jij"){
                    weathercontent.textContent = "";
                    readOutLoud("Dat ben ik, meneer");
                }
                
                

            }
            else{
                vraagcontent.textContent = "";
                antwoordcontent.textContent = "";
                weathercontent.textContent = "";
            }
    }
        

    };   



button.addEventListener('click', () => {
    //console.log('hi');
    if(!isListening){
        recognition.start();
        canSpeak = true;

    }
    else{
        window.alert("Already listening!");
        
    }  

});

function readOutLoud(message){
    antwoordcontent.textContent = message;
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    
    window.speechSynthesis.speak(speech);
}

var getLocation = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(createAPI);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
};

var ur = "";

var createAPI = function(position) {
  ur = "http://api.openweathermap.org/data/2.5/weather?appid=" + apikey + "&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude; 
  var json = undefined;
  
  $.ajax({
  dataType: "json",
  url: ur,
  data: function(data) {
  },
  success: function(success) {
    json = success;
    var msg;
    if(json.weather[0].main == "Rain"){
        msg = "Het is op dit moment regenachtig, meneer";
        weathercontent.textContent = msg;
        returnWeather(msg);
    }
    if(json.weather[0].main == "Clouds"){
        msg = "Het is op dit moment bewolkt, meneer";
        weathercontent.textContent = msg;
        returnWeather(msg);
    }
    if(json.weather[0].main != "Rain" && json.weather[0].main != "Clouds"){
        msg = json.weather[0].main;
        weathercontent.textContent = msg;
        returnWeather(msg);

    }
    
  }
});
};

var returnWeather = function(msg){
    var message = msg;
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    
    window.speechSynthesis.speak(speech);
    
    

}
