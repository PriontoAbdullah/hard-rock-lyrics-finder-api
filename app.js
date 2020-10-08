const list = document.getElementById('suggestions');
const lyrics = document.getElementById('search_input');
const submitBtn = document.getElementById('search_button');
const show_result = document.getElementById('show_results');
const single_lyrics = document.getElementById('single_lyrics');

function back() {
	show_result.style.display = "block";
	single_lyrics.innerHTML = "";
}

const getLyrics = (artist, title, songTitle, artistName) => {
    fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
    .then(response => response.json())
    .then(data => {
        single_lyrics.innerHTML = `
        <button class="btn btn-danger my-3" onclick="back()"> << Back</button>
        <h2 class="text-success mb-4"> ${artistName} - ${songTitle} </h2>
        <pre class="lyric text-white">
        ${!data.lyrics ? 'We are so sorry that this lyrics is not available right now' : data.lyrics}
        </pre>
        `;

        show_result.style.display = 'none';
    })
}

lyrics.addEventListener('keypress', event => {
    list.style.display = 'block';
    show_result.style.display = 'none';

    if (event.target.value === '') {
        list.innerHTML = '';
    }

    console.log(event.target.value + event.key);
    let api = `https://api.lyrics.ovh/suggest/${event.target.value + event.key}`;
    fetch(api)
        .then(response => response.json())
        .then(data => {
            list.innerHTML = '';
            for (let i = 0; i < 15; i++) {
                const result = data.data[i];

                list.innerHTML += `<p class="author lead"><strong>${result.album.title.slice(0, 30)}</strong> Album by <span>${result.artist.name.slice(0, 20)}</span></p>`;
            }
        })
});


submitBtn.addEventListener('click', () => {
    list.style.display = 'none';
    show_result.style.display = 'block';

    const songName = document.getElementById('search_input').value;
    if (songName === '') {
        document.getElementById('search_input').setAttribute('placeholder', 'Enter a valid song name please');
    }

    fetch(`https://api.lyrics.ovh/suggest/${songName}`)
        .then(response => response.json())
        .then(data => {
            show_result.innerHTML = '';
            for (let i = 0; i < 20; i++) {
                const result = data.data[i];

                show_result.innerHTML += `
        <div class="single-result row align-items-center my-3 p-3">
            <div>
            <a href="${result.link}" target="_blank">
                <img src="${result.album.cover}" alt="cover of ${result.album.title}">
            </a>
            </div>
            <div class="col-md-6">
                <h3 id="lyrics_name" class="lyrics-name">${result.album.title}</h3>
                <p class="author lead">Album by <span id="author_name">${result.artist.name}</span></p>
            </div>
            <div class="text-md-right text-center mx-auto">
                <button class="btn btn-info">
                    <a style="color: #fff; text-decoration: none;" href="${result.preview}" target="_blank">Get Song</a>
                </button>
            </div>
            <div class="text-md-right text-center mx-auto">
            <button class="btn btn-success" onclick="getLyrics('${result.artist.name}', '${result.title}', '${result.title}', '${result.artist.name}')">Get Lyrics</button>
            </div>
        </div>`;
            }
        })

        document.getElementById('search_input').value = '';
})
