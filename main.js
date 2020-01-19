function makeBoard(rows) {
    return {
        difficulty: 'easy',
        rows: rows,
        state: null,
        freeCell: {
            row: -1,
            col: -1
        }
    }
}
let board = {}

function handleDrop(e) {
    const target = e.toElement
    const freeCell = document.getElementById("free-cell")
    try {
        const targetRow = parseInt(target.getAttribute('data-row'))
        const targetColumn =parseInt(target.getAttribute('data-column'))

        const freeCellRow = parseInt(freeCell.getAttribute('data-row'))
        const freeCellColumn = parseInt(freeCell.getAttribute('data-column'))

        const dist = Math.sqrt((targetRow-freeCellRow)**2 + (targetColumn-freeCellColumn)**2)
        if(dist!==1){
            throw new Error('invalid move')
        }
    }catch(err) {
        alert('Oops invalid move')
        return;
    }

    freeCell.id = ""
    target.id = "free-cell"
    freeCell.innerText = target.innerText
    target.innerText = ''

    target.draggable = true
    freeCell.draggable = false

    freeCell.ondrop = handleDrop
    freeCell.ondragover = handleDragover

    target.ondrop = null
    target.ondragover = null

}
function handleDragover(e) {
    e.preventDefault()
}

function createGameBoard() {
    const {state} = board

    const container = document.createElement('div')
    container.id = "board"
    for(let i = 0; i < state.length; i+=1) {
        const row = document.createElement('div')
        row.classList.add('row')

        for(let j = 0; j < state[0].length; j++) {
            const cell = document.createElement('div')
            cell.textContent = state[i][j]
            cell.classList.add('cell')
            cell.setAttribute('data-row',i)
            cell.setAttribute('data-column',j)
            if(board.state[i][j] === '') {
                cell.id="free-cell"
                cell.draggable = true
            } else {
                cell.ondrop = handleDrop
                cell.ondragover = handleDragover
            }

            row.appendChild(cell)
        }
        container.appendChild(row)
    }
    document.getElementById('game-board').innerHTML = ''
    document.getElementById('game-board').appendChild(container)
}
function createGameState() {
    const {rows} = board
    const max = rows*rows - 1;

    board.state = new Array(rows).fill(-1).map(()=>new Array(rows).fill(-1))

    for(let i = 1; i <= max; i++) {
        let r = Math.floor(Math.random()*rows)
        let c = Math.floor(Math.random()*rows)

        while(board.state[r][c] != -1) {
            r = Math.floor(Math.random()*rows)
            c = Math.floor(Math.random()*rows)
        }

        board.state[r][c] = i
    }
    board.state = board.state.map((ar,r)=>ar.map((e,c)=> {
        if(e==-1){
            board.freeCell = {
                row: r,
                cell: c
            }
            return ''
        }
        return e
    }))
}

function main() {
    resetGame(3)
}

function resetGame(rows) {
    console.log("initiating world...")
    board = makeBoard(rows)
    createGameState()
    console.log("creating game board...")
    createGameBoard()

    console.log(board)
}

document.addEventListener('DOMContentLoaded', main)
