// # from gtts import gTTS

// # # ask for text to speak
// # text = input("enter text to speak: ")

// # # generate tts
// # output = gTTS(text=text, lang="de")
// # output.save(f"tts.mp3")
// import requests

// r = requests.get("https://ttsmp3.com/makemp3_new.php")

// PARAMS = {'msg': 'Hallo ich bin Vicky', 'lang': 'Vicky', 'source': 'ttsmp3'}
var XMLHttpRequest = require("xhr2");
const Blob = require('node-blob');
const saveAs = require('file-saver');


  function downloadMP3(url, text) {
    
    //   console.log(text)
    // httpreq = new XMLHttpRequest();

    // httpreq.open("GET", url, true);
    // httpreq.responseType = "blob";
    // httpreq.onreadystatechange = function (e) {
    //     if (this.readyState == 4) {
    //         let response = (httpreq.response);
          
            

            
    //         try {
    //             let audiFile = new Blob([response], {type:'audio/mp3'});
    //             console.log(audiFile instanceof Blob)
    //             const href = URL.createObjectURL(audiFile);
    //             const a = Object.assign(document.createElement("a"), {
    //                 href,
    //                 style: "display:none",
    //                 download: "vicki_"+text+".mp3"
    //             });
    //             document.body.appendChild(a);
    //             a.click();
    //             URL.revokeObjectURL(href);
    //             a.remove();
    //             //saveAs(audiFile, "vicki_"+text+".mp3");
    //             console.log(response)
    //         }
    //         catch (err) {
    //             console.log("err", err)
    //             // alert("Something went wrong... please contact support@ttsmp3.com for support");
    //         }
    //     }
    // }
    // httpreq.send();
  }

  //   let downloadUrl = [], i;
  let count = 0, howManyTimes = 1000;
  let httpreq = [], i;
  function getIds (){
//     count++;



// console.log(count)
//     httpreq[count] = new XMLHttpRequest();

for(let i = 450; i< 300000;i++){

    let voicetext = `Alles klar! ${i} Euro Bruttogehalt. Wie ist deine Steuerklasse?`;
    console.log(voicetext)
}
// let lang = "Vicki"
// let params = "msg=" + voicetext + "&lang=" + lang + "&source=ttsmp3";
// httpreq[count].open("POST", "https://ttsmp3.com/makemp3_new.php", true);
// httpreq[count].setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// httpreq[count].overrideMimeType("application/json");


// httpreq[count].send(params);				
// httpreq[count].onreadystatechange = function() {
//     if (httpreq[count].readyState === 4) {
//         let array = JSON.parse(httpreq[count].response);
//         //console.log("readyState = 4")

//         console.log(array.MP3)
//         let mp3Id = array.MP3
//         // Object.keys(array).forEach(function(key) {
//         //     console.log('Key : ' + key + ', Value : ' + array[key])
//         //   })


//         let downloadUrl = `https://ttsmp3.com/dlmp3.php?mp3=${mp3Id}&location=direct`;
//         //console.log(downloadUrl)
       
//         //downloadMP3(downloadUrl, encodeURIComponent(array.Text.replace(/ /g,"_").toLowerCase()))


//     }
    
//   }
//   if (count < howManyTimes) {
//     setTimeout(getIds, 1000);
//   }
 

//console.log(this.ids)
}
getIds()
