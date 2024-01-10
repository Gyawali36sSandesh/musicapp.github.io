console.log('Lets write java script');
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00";
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    // Ensure the output is in the "00:00" format
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs =[]
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
  }


     //load the playlist when the card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${ item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
           
        })
    })
    

  
  // show all the song in the playlist
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs){
    songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" width="34" src="img/music.svg" alt="">
    <div class="info">
    <div> ${song.replaceAll("%20", " ")}</div>
    <div>Khem</div>
    </div>
    <div class="playnow">
      <span>Play Now</span>
      <img class="invert" src="img/play.svg" alt="">
    </div> <li>`;
  }
  
     //attach an event listener to each song
     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    
        })
    })
return songs
}

const playMusic = (track, pause=false) => {
    currentSong.src = `https://raw.githubusercontent.com/Gyawali36sSandesh/musicapp.github.io/main/${currFolder}/` + track
    if(!pause){
    currentSong.play()
    play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


   async function main(){
   
    // get all the song
await getSongs("songs/lok")
playMusic(songs[0],true)

 
//attach an event listener to play pause next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })




         //changing currentsong automatically
    currentSong.addEventListener("ended", () => {
        // Auto-play the next song when the current song ends
        playNextSong();
    });
    
    // Function to play the next song
    function playNextSong() {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    }



 // Assuming currentSong is already defined elsewhere in your code
 currentSong.addEventListener("timeupdate", () => {
  
    // Display the current time and duration in the "00:00" format
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+ "%";
  });
 
  //Add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent =(e.offsetX/e.target.getBoundingClientRect().width)*100; 
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime=((currentSong.duration)*percent)/100

})

//add an eventlister for handburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left ="0"
})

//add an eventlister for close
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left ="-100%"
})



//add an eventlister for next 
next.addEventListener("click",()=>{
    currentSong.pause()
    console.log("Next clicked") 

   let index = songs.indexOf( currentSong.src.split("/").slice(-1)[0])
   if((index + 1)<songs.length){
    playMusic(songs[index + 1])
   }  
})



//add an eventlister for prev
previous.addEventListener("click",()=>{
    currentSong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf( currentSong.src.split("/").slice(-1)[0])
    if((index - 1)>=0){
     playMusic(songs[index - 1])
    }
}) 




//add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log("Setting volume to",e.target.value, "/100")
    currentSong.volume = parseInt(e.target.value)/100
    })


//add event listener to mute tha track
document.querySelector(".volume >img").addEventListener("click", e=>{
    console.log(e.target)
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value=10;
    }

})






   }
main()
