const showPlayerBtn = document.getElementById('show-player-btn')
const playerList = document.getElementById('player-list-ul')
const highScoreEl = document.getElementById('high-score-span')

let pplayers;

function showPlayer() {
    pplayers = JSON.parse(localStorage.getItem('players')) || []
    playerList.classList.toggle('hide')

    playerList.innerHTML = ''

    pplayers.forEach(player => {

        const li = document.createElement('li')
        li.innerText = `Name : ${player.name}. Score : ${player.score}`

        playerList.appendChild(li)
    })
}

showPlayerBtn.addEventListener('click', showPlayer)