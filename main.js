const board = (function _genBoard(config) {
    let instance = null
    class Board {

        constructor() {
            this.board = {}
            this.makeBoard.call(this, 3)
        }


        makeBoard(rows) {
            this.board =  {
                difficulty: 'easy',
                rows: rows,
                state: null,
                freeCell: {
                    row: -1,
                    col: -1
                }
            }

            this.createGameState.call(this,rows)
        }

        createGameState(rows) {
            const max = rows*rows - 1;

            this.board.state = new Array(rows).fill(-1).map(()=>new Array(rows).fill(-1))

            for(let i = 1; i <= max; i++) {
                let r = Math.floor(Math.random()*rows)
                let c = Math.floor(Math.random()*rows)

                while(this.board.state[r][c] != -1) {
                    r = Math.floor(Math.random()*rows)
                    c = Math.floor(Math.random()*rows)
                }

                this.board.state[r][c] = i
            }
            this.board.state = this.board.state.map((ar,r)=>ar.map((e,c)=> {
                if(e==-1){
                    this.board.freeCell = {
                        row: r,
                        cell: c
                    }
                    return ''
                }
                return e
            }))
        }

        getState() {
            return this.board.state
        }

        setState(row, col,value) {
            this.board.state[row][col] = value
        }
    }

    instance = new Board()

    return instance
  })()


  const game = (function(){
    class Game {
        handleDrop(e) {
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

            freeCell.ondrop = this.handleDrop
            freeCell.ondragover = this.handleDragover

            target.ondrop = null
            target.ondragover = null

        }
        handleDragover(e) {
            e.preventDefault()
        } // end of handleDragover

        createGameBoard() {
            const state = board.getState()

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
                    if(state[i][j] === '') {
                        cell.id="free-cell"
                        cell.draggable = true
                    } else {
                        cell.ondrop = this.handleDrop
                        cell.ondragover = this.handleDragover
                    }

                    row.appendChild(cell)
                }
                container.appendChild(row)
            }
            document.getElementById('game-board').innerHTML = ''
            document.getElementById('game-board').appendChild(container)
        } // end of createGameBoard

        resetGame(rows) {
            console.log("initiating world...")
            board.makeBoard(rows)
            console.log("creating game board...")
            this.createGameBoard()

            console.log(board)
        } // end of resetGame
    }

    return new Game()
  })()

  const DEFAULT_ROWS = 3

  function onCustomGame() {
    let rows;
    try {
        rows = parseInt(prompt("Enter number of rows"))
    } catch (error) {
        rows = DEFAULT_ROWS
    }
    game.resetGame(rows)
  }

  function main() {
    game.resetGame(DEFAULT_ROWS)
  }


  if( document.readyState !== 'loading' ) {
      main();
  } else {
      document.addEventListener('DOMContentLoaded',main);
  }
