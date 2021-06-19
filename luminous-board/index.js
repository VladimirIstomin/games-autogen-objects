const getRandomElementFromList = list => list[Math.floor(Math.random() * list.length)];

const COLORS = ['#5d1451', '#2f416d', '#14868c', '#94ceca', '#ef6c57', '#7ed3b2', '#b9e6d3', '#f2f2f2'];
const NUMBER_OF_SQUARES = 600;

const boardGamePlugin = ({ colors, numberOfSquares }) => {
  const container = document.querySelector('.container');

  const createGrid = squaresNumber => {
    const squares = [];

    for (let i = 0; i < squaresNumber; i++) {
      const square = document.createElement('div');
      square.classList.add('square');

      squares.push(square);
      container.append(square);
    }

    return squares;
  }

  const addLightningEffect = (square, colors) => {
    square.addEventListener('mouseover', () => {
      const color = getRandomElementFromList(colors);
      square.style.backgroundColor = color;
      square.style.boxShadow = `0 0 0 1px ${ color }, 0 0 12px ${ color }`;
    });

    square.addEventListener('mouseleave', () => {
      square.style.backgroundColor = '#333';
      square.style.boxShadow = '0 0 0 1px #000';
    });
  }

  createGrid(numberOfSquares).forEach(square => addLightningEffect(square, colors));
}

boardGamePlugin({ colors: COLORS, numberOfSquares: NUMBER_OF_SQUARES });
