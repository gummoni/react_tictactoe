import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';

class Square extends React.Component {
  render() {
    return (
      <button 
        className="square" 
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        />
    )
  }

  render() {
    const status = 'Next Player: ' + (this.props.xIsNext ? 'X' : 'O');

    return (
      <div className="game-board">
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Jump extends React.Component {

  render() {
    const moves = this.props.history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => this.props.onClick(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <ol>{moves}</ol>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      winner: null,
    };
  }

  handleClick(current, i) {
    let squares = current.slice();
    const stepNumber = this.state.stepNumber;
    const history = this.state.history.slice(0, stepNumber + 1);
    const xIsNext = this.state.xIsNext;
    let winner = this.state.winner;

    if (null === winner) {
      if (null === squares[i]) {
        squares[i] = xIsNext ? 'X' : 'O';
        winner = this.calculateWinner(squares);
        this.setState({
          history: history.concat([{
            squares: squares,
          }]),
          stepNumber: history.length,
          xIsNext: !xIsNext,
          winner: winner,
          });
      }
    }
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      let x = squares[a];
      let y = squares[b];
      let z = squares[c];
      if (null !== x) {
        if (x === y) {
          if (x === z) {
            return x;
          }
        }
      }
    }
    return null;
  }

  jumoTo(stepNumber) {
    const history = this.state.history;
    const current = history[stepNumber];
    const squares = current.squares;
    const winner = this.calculateWinner(squares);

    this.setState({
      stepNumber: stepNumber,
      xIsNext: (stepNumber % 2) === 0,
      winner: winner,
    });
  }


  render() {    
    const stepNumber = this.state.stepNumber;
    const history = this.state.history;
    const current = history[stepNumber];
    const squares = current.squares;
    const winner = this.state.winner;
    const status = (winner)
    ? 'Winner: ' + winner
    : 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <Board 
          squares={squares}
          onClick={(i) => this.handleClick(squares, i)}
        />
        <div className="game-info">
          <div>{status}</div>
          <Jump 
            history={history} 
            onClick={(i) => this.jumoTo(i)}
            />
        </div>
      </div>
    );
  }
}

//  <React.StrictMode>
//    <App />
//  </React.StrictMode>,

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
