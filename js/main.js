//selector
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const showLyrics = document.getElementById("get-lyrics");
const goBack = document.querySelector(".go-back");
const goNext = document.querySelector(".go-next");
const getLyricsHider = document.getElementById("getLyrics2");
//event listener

searchBtn.addEventListener("click", () => getSearchInput());
//enter btn to search
searchInput.addEventListener("keyup", (eve) => {
  if (eve.keyCode === 13) {
    getSearchInput();
  }
});
//api
const api = "https://api.lyrics.ovh";
async function getSongList(searchValue) {
  const searchResult = await fetch(`${api}/suggest/${searchValue}`);
  const data = await searchResult.json();
  console.log(data);
  songDetails(data);
  ///test
  document.getElementById("nextSongs").addEventListener("click", () => {
    nextSongArray(data.next);
  });
}

async function songDetails(data) {
  filterSong = data.data;
  const TenSong = filterSong.slice(0, 10);
  console.log(TenSong);
  TenSong.map((song) => {
    const songName = song.title_short;
    const songAuthor = song.artist.name;
    const audioPreview = song.preview;
    // console.log(songs);
    searchResultShower(songName, songAuthor);
    fancyResult(songName, songAuthor, audioPreview);
  });
}

async function getLyrics(song, artist) {
  const getLyric = await fetch(`${api}/v1/${artist}/${song}`);
  const lyrics = await getLyric.json();
  //update lyrics in html dom
  if (lyrics.lyrics) {
    document.querySelector(".lyric").innerText = lyrics.lyrics;
  } else {
    document.querySelector(".lyric").innerText = lyrics.error;
  }
  document.querySelector("#lyrics-title").innerText = song;
}

async function getLyrics2(song, artist) {
  const getLyric = await fetch(`${api}/v1/${artist}/${song}`);
  const lyrics = await getLyric.json();
  //update lyrics in html dom
  if (lyrics.lyrics) {
    document.querySelector(".lyric-fancy").innerText = lyrics.lyrics;
  } else {
    document.querySelector(".lyric-fancy").innerText = lyrics.error;
  }
  document.querySelector("#lyrics-title-fancy").innerText = song;
}

// function
function searchResultShower(song, artist) {
  const pTag = document.createElement("p");
  pTag.innerHTML = `
              <p class="author lead">
              <div class="row text-center">
               <div class="col-md-7 col-12">
              <strong>${song}</strong> Album by <span>${artist}</span>
              </div>
              <div class="col-md-5 col-12">
              <button class="btn btn-success" id="get-lyrics" onclick="getLyrics('${song}', '${artist}')">
                Get Lyrics
              </button>
              </div>
            </p>
            `;
  document.querySelector(".song-result").appendChild(pTag);
}

function getSearchInput() {
  const searchValue = searchInput.value.trim();
  if (!searchValue) {
    alert("Nothing to search");
  } else {
    getSongList(searchValue);
  }
  resetResult();
}

// reset
function resetResult() {
  document.querySelector(".song-result").innerHTML = "";
  document.querySelector("#lyrics-title").innerText = "";
  document.querySelector(".lyric").innerText = "";
}

// fancy
function fancyResult(song, artist, audio) {
  const divTag = document.createElement("div");
  divTag.innerHTML = `
          <div class="single-result row align-items-center my-3 p-3">
            <div class="col-md-7 text-md-center text-center">
              <h3 class="lyrics-name">${song}</h3>
              <p class="author lead">
                Album by <span class="author-name">${artist}</span>
              </p>
            </div>
            <div class="col-md-5 text-md-right text-center">
              <button class="btn btn-success mb-2" id="getLyrics2" onclick="getLyrics2('${song}', '${artist}')">Get Lyrics</button>
             
            </div>
            <div class="col-md-12 text-center">
              <a href="${audio}" target="__blank">Preview</a>
            </div>
          </div>
  `;
  document.querySelector("#fancy-result").appendChild(divTag);
}

//hide lyrics
function hideLyrics() {
  document.querySelector(".lyric-fancy").innerText = "";
  document.querySelector("#lyrics-title-fancy").innerText = "";
  document.querySelector(".getLyrics2H").style.visibility = "hidden";
  document.querySelector(".getLyrics2").style.visibility = "visible";
}

// next
// const apiNext = `http://api.deezer.com/search?limit=10&q${searchInput.value.trim()}=&index=10`;
async function nextSongArray(data) {
  const nextS = await fetch(`https://cors-anywhere.herokuapp.com/${data}`);
  const nextSData = await nextS.json();
  const nextSDataArray = nextSData.data;
  const TenSongs = nextSDataArray.slice(0, 10);
  console.log(TenSongs);
  TenSongs.map((song) => {
    const songName = song.title_short;
    const songAuthor = song.artist.name;
    const audioPreview = song.preview;
    // console.log(songs);
    searchResultShower(songName, songAuthor);
    fancyResult(songName, songAuthor, audioPreview);
  });
}
