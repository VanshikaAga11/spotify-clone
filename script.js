const songs = [
    {
        title: "sunset drive",
        artist: "mountain explorers",
        file: "assets/song1.mp3",
        cover: "assets/cover1.jpg",
        duration: "2:00"
    },
    {
        title: "spiritual",
        artist: "night travellers",
        file: "assets/song2.mp3",
        cover: "assets/cover2.jpg",
        duration: "3:35"
    },
    {
        title: "rock",
        artist: "coastal",
        file: "assets/song3.mp3",
        cover: "assets/cover3.jpg",
        duration: "1:19"
    }
];

const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;      
let isRepeat = false;       
let originalSongs = [...songs]; 


const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');


const currentTitle = document.getElementById('current-title');
const currentArtist = document.getElementById('current-artist');
const currentCover = document.getElementById('current-cover');
const songsList = document.getElementById('songs-list');


const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');


const volumeBar = document.getElementById('volume-bar');
const volumeLevel = document.getElementById('volume-level');


function displaySongs() {
    songsList.innerHTML = '';
    
    
    songs.forEach((song, index) => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song-item';
        if (index === currentSongIndex) {
            songDiv.classList.add('active');
        }
        
        songDiv.innerHTML = `
            <div class="song-number">${index + 1}</div>
            <div class="song-info">
                <div class="title">${song.title}</div>
                <div class="artist">${song.artist}</div>
            </div>
            <div class="song-duration">${song.duration}</div>
        `;
        
        songDiv.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong();
            audio.play();
            isPlaying = true;
            playBtn.textContent = '⏸️';
            updateActiveSong();
        });
        
        songsList.appendChild(songDiv);
    });
}


function updateActiveSong() {
    document.querySelectorAll('.song-item').forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}


function loadSong() {
    const song = songs[currentSongIndex];
    audio.src = song.file;
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    currentCover.src = song.cover;
    
   
    currentCover.onerror = function() {
        this.src = 'https://via.placeholder.com/56/1db954/ffffff?text=♪';
    };
    
    updateActiveSong();
}


playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '▶️';
    } else {
        audio.play();
        playBtn.textContent = '⏸️';
    }
    isPlaying = !isPlaying;
});

nextBtn.addEventListener('click', () => {
    if (isShuffle) {
        // SHUFFLE MODE: play random song
        let randomIndex = Math.floor(Math.random() * songs.length);
        // make sure it's not the same song
        while (randomIndex === currentSongIndex && songs.length > 1) {
            randomIndex = Math.floor(Math.random() * songs.length);
        }
        currentSongIndex = randomIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong();
    audio.play();
    isPlaying = true;
    playBtn.textContent = '⏸️';
});

prevBtn.addEventListener('click', () => {
    if (isShuffle) {
        let randomIndex = Math.floor(Math.random() * songs.length);
        while (randomIndex === currentSongIndex && songs.length > 1) {
            randomIndex = Math.floor(Math.random() * songs.length);
        }
        currentSongIndex = randomIndex;
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
    loadSong();
    audio.play();
    isPlaying = true;
    playBtn.textContent = '⏸️';
});

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    
    if (isShuffle) {
        shuffleBtn.style.color = '#1db954';
        shuffleBtn.style.backgroundColor = '#282828';
        shuffleBtn.style.borderRadius = '50%';
        shuffleBtn.style.padding = '8px';
    } else {
        shuffleBtn.style.color = '#b3b3b3';
        shuffleBtn.style.backgroundColor = 'transparent';
        shuffleBtn.style.padding = '8px';
    }
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    
    if (isRepeat) {
        repeatBtn.style.color = '#1db954';
        repeatBtn.style.backgroundColor = '#282828';
        repeatBtn.style.borderRadius = '50%';
        repeatBtn.style.padding = '8px';
    } else {
        repeatBtn.style.color = '#b3b3b3';
        repeatBtn.style.backgroundColor = 'transparent';
        repeatBtn.style.padding = '8px';
    }
});
audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.play();
    } else if (isShuffle) {
        let randomIndex = Math.floor(Math.random() * songs.length);
        while (randomIndex === currentSongIndex && songs.length > 1) {
            randomIndex = Math.floor(Math.random() * songs.length);
        }
        currentSongIndex = randomIndex;
        loadSong();
        audio.play();
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong();
        audio.play();
    }
});

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

function updateProgress() {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// click on progress bar
progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

audio.volume = 0.7; // default volume

volumeBar.addEventListener('click', (e) => {
    const width = volumeBar.clientWidth;
    const clickX = e.offsetX;
    const vol = clickX / width;
    audio.volume = vol;
    volumeLevel.style.width = (vol * 100) + '%';
});


document.querySelectorAll('.featured-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        currentSongIndex = index % songs.length;
        loadSong();
        audio.play();
        isPlaying = true;
        playBtn.textContent = '⏸️';
    });
});

document.querySelectorAll('.playlist-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        currentSongIndex = index % songs.length;
        loadSong();
        audio.play();
        isPlaying = true;
        playBtn.textContent = '⏸️';
    });
});

function createLoginSystem() {
    const modalHTML = `
        <div id="login-modal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Login</h2>
                <input type="text" id="login-username" placeholder="Username">
                <input type="password" id="login-password" placeholder="Password">
                <button id="login-submit">Login</button>
                <p>Don't have account? <a href="#" id="show-signup">Sign up</a></p>
            </div>
        </div>
        
        <div id="signup-modal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Sign Up</h2>
                <input type="text" id="signup-username" placeholder="Username">
                <input type="email" id="signup-email" placeholder="Email">
                <input type="password" id="signup-password" placeholder="Password">
                <button id="signup-submit">Sign Up</button>
                <p>Already have account? <a href="#" id="show-login">Login</a></p>
            </div>
        </div>
    `;
    
   
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
   
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const userIcon = document.querySelector('.user');
    
    
    const headerDiv = document.querySelector('.header');
    const usernameDisplay = document.createElement('span');
    usernameDisplay.id = 'username-display';
    usernameDisplay.style.marginRight = '10px';
    usernameDisplay.style.color = '#1db954';
    usernameDisplay.style.fontWeight = 'bold';
    usernameDisplay.style.fontSize = '14px';
    
    
    headerDiv.insertBefore(usernameDisplay, userIcon);
    
    userIcon.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
    
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });
    
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });
    
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });
    
    function updateUsernameDisplay(username) {
        if (username) {
            usernameDisplay.textContent = `Hi, ${username}`;
            userIcon.textContent = '👤';
        } else {
            usernameDisplay.textContent = '';
            userIcon.textContent = '👤';
        }
    }
    
   
    document.getElementById('login-submit').addEventListener('click', () => {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (username && password) {
           
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                alert('Login successful! Welcome ' + username);
                localStorage.setItem('currentUser', username);
                updateUsernameDisplay(username);
                loginModal.style.display = 'none';
                
                
                document.getElementById('login-username').value = '';
                document.getElementById('login-password').value = '';
            } else {
                alert('User not found! Please sign up first.');
            }
        } else {
            alert('Please fill all fields!');
        }
    });
    
   
    document.getElementById('signup-submit').addEventListener('click', () => {
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        if (username && email && password) {
         
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
           
            if (users.find(u => u.username === username)) {
                alert('Username already exists!');
                return;
            }
            
            
            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Sign up successful! Please login.');
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
            
           
            document.getElementById('signup-username').value = '';
            document.getElementById('signup-email').value = '';
            document.getElementById('signup-password').value = '';
        } else {
            alert('Please fill all fields!');
        }
    });
    
   
    usernameDisplay.addEventListener('click', () => {
        if (localStorage.getItem('currentUser')) {
            if (confirm('Logout?')) {
                localStorage.removeItem('currentUser');
                updateUsernameDisplay(null);
                alert('Logged out successfully!');
            }
        }
    });
    
    
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        updateUsernameDisplay(currentUser);
    }
}


displaySongs();
loadSong();


volumeLevel.style.width = '70%';


createLoginSystem();

audio.onerror = function() {
    console.log('audio file not found, using placeholder');
    currentTitle.textContent = 'add your own songs!';
    currentArtist.textContent = 'put mp3 files in assets folder';

};
