import React, { Component, Fragment } from 'react'

import  './css/Board.css'

class Board extends Component { 
  checkColumn = (loc) => {
    switch (loc % 3) {
      case (1): return 1;
      case (2): return 2;
      case (0): return 3;
      default: break;
    }
  }

  checkRow = (loc) => {
    switch (Math.ceil(loc / 3)) {
      case (1): return 1;
      case (2): return 2;
      case (3): return 3;
      default: break;
    }
  }

  mostLeftBox = (loc) => {
    if (this.checkColumn(loc) === 1) {
      return loc;
    } else {
      return this.mostLeftBox(loc - 1)
    }
  }

  mostTopBox = (loc) => {
    if (this.checkRow(loc) === 1) {
      return loc;
    } else {
      return this.mostTopBox(loc - 3)
    }
  }

  checkVertical = (box, mostTopBox) => {
    if (box[mostTopBox] && box[mostTopBox + 3] && box[mostTopBox + 6]) {
      return (box[mostTopBox].type === box[mostTopBox + 3].type) && (box[mostTopBox + 3].type === box[mostTopBox + 6].type);
    }
  }

  checkHorizontal = (box, mostLeftBox) => {
    if (box[mostLeftBox] && box[mostLeftBox + 1] && box[mostLeftBox + 2]) {
      return (box[mostLeftBox].type === box[mostLeftBox + 1].type) && (box[mostLeftBox + 1].type === box[mostLeftBox + 2].type);
    }
  }

  checkDiagonal = (box, type, topLeftBox) => {
    switch (type) {
      case 'left': {
        if (box[topLeftBox] && box[topLeftBox + 4] && box[topLeftBox + 8]) {
          return (box[topLeftBox].type === box[topLeftBox + 4].type) && (box[topLeftBox + 4].type === box[topLeftBox + 8].type)
        } break;
      }
      case 'right': {
        if (box[topLeftBox + 2] && box[(topLeftBox + 2) + 2] && box[(topLeftBox + 2) + 4]) {
          return (box[topLeftBox + 2].type === box[(topLeftBox + 2) + 2].type) && (box[(topLeftBox + 2) + 2].type === box[(topLeftBox + 2) + 4].type)
        } break;
      }
      default: break;
    }
  }

  checkWinner = (loc, box) => {
    const score = { ...this.props.score }

    const mostTopBox = this.mostTopBox(loc)
    const mostLeftBox = this.mostLeftBox(loc)
    const topLeftBox = this.mostLeftBox(this.mostTopBox(loc))

    // Check is there any streak in same column
    const vertical = this.checkVertical(box, mostTopBox)
    // Check is there any streak in same row
    const horizontal = this.checkHorizontal(box, mostLeftBox)
    // Check is there any streak in diagonal from top left to bottom right
    const leftDiagonal = this.checkDiagonal(box, 'left', topLeftBox);
    // Check is there any streak in diagonal from top right to bottom left
    const rightDiagonal = this.checkDiagonal(box, 'right', topLeftBox);

    // If there is any streak lets decide the winner
    if (vertical || horizontal || leftDiagonal || rightDiagonal) {
      switch (box[loc].type) {
        case ('path'): score[1] += 1; break;
        case ('circle'): score[2] += 1; break;
        default: break;
      }
      return { isFinish: true, score }
    }
    return { isFinish: false, score }
  }

  locateHorizontal = (isCircle, loc, spot) => {
    const linePoint = {
      alpha: 83, 
      beta: 30, 
      gama: 250, 
      omega: 197, // ((160 x 1) + (7 x 1)) + 30
      teta: 417,
      delta: 364 // ((160 x 2) + (7 x 2)) + 30
    }
    
    if (window.innerWidth < 768) {
      linePoint.alpha = 60 //
      linePoint.beta = 22.5 //
      linePoint.gama = 185.5 //
      linePoint.omega = 150 // 
      linePoint.teta = 308 //
      linePoint.delta = 271.5 // 240 + 8 + 22.5
    } 
    
    if (window.innerWidth < 481) {
      linePoint.alpha = 38.5 //
      linePoint.beta = 15 //
      linePoint.gama = 122.5 //
      linePoint.omega = 96 //
      linePoint.teta = 204.5 //
      linePoint.delta = 179 // 160 + 4 + 15
    }

    switch(this.checkRow(loc)) {
      case (1): isCircle ? spot.y = linePoint.alpha : spot.y = linePoint.beta; break;
      case (2): isCircle ? spot.y = linePoint.gama : spot.y = linePoint.omega; break;
      case (3): isCircle ? spot.y = linePoint.teta : spot.y = linePoint.delta; break;
      default: break;
    }
  }

  locateVertical = (isCircle, loc, spot) => {
    const linePoint = {
      alpha: 83, 
      beta: 30, 
      gama: 250, 
      omega: 197, // ((160 x 1) + (7 x 1)) + 30
      teta: 417,
      delta: 364 // ((160 x 2) + (7 x 2)) + 30
    }
    
    if (window.innerWidth < 768) {
      linePoint.alpha = 60 //
      linePoint.beta = 22.5 //
      linePoint.gama = 185.5 //
      linePoint.omega = 150 // 
      linePoint.teta = 308 //
      linePoint.delta = 271.5 // 240 + 8 + 22.5
    } 
    
    if (window.innerWidth < 481) {
      linePoint.alpha = 38.5 //
      linePoint.beta = 15 //
      linePoint.gama = 122.5 //
      linePoint.omega = 96 //
      linePoint.teta = 204.5 //
      linePoint.delta = 179 // 160 + 4 + 15
    }

    switch (this.checkColumn(loc)) {
      case (1): isCircle ? spot.x = linePoint.alpha : spot.x = linePoint.beta; break;
      case (2): isCircle ? spot.x = linePoint.gama : spot.x = linePoint.omega; break;
      case (3): isCircle ? spot.x = linePoint.teta : spot.x = linePoint.delta; break;
      default: break;
    }
  }

  putCircle = (loc) => {
    let centerSpot = { x: null, y: null };
    this.locateHorizontal(true, loc, centerSpot)
    this.locateVertical(true, loc, centerSpot)

    let r = 55
    if (window.innerWidth < 768) r = 41.25
    if (window.innerWidth < 481) r = 27.5

    return <circle cx={centerSpot.x} cy={centerSpot.y} r={r} />
  }

  putCross = (loc) => {
    let topLeftSpot = { x: null, y: null };
    this.locateHorizontal(false, loc, topLeftSpot)
    this.locateVertical(false, loc, topLeftSpot)

    let r = 107
    if (window.innerWidth < 768) r = 70
    if (window.innerWidth < 481) r = 50

    return <path d={`
      M${topLeftSpot.x} ${topLeftSpot.y} ${topLeftSpot.x + r} ${topLeftSpot.y + r} 
      M${topLeftSpot.x} ${topLeftSpot.y + r} ${topLeftSpot.x + r} ${topLeftSpot.y}
    `} />
  }

  onBoxClick = (i) => {
    if (this.props.box[i]) return

    this.props.addTurn();

    const box = { ...this.props.box }

    console.log(this.props.player)

    switch(this.props.turn % 2) {
      case (0): {
        box[i] = this.props.player === 'cross' ? this.putCircle(i) : this.putCross(i);
        break;
      }
      case (1): { 
        box[i] = this.props.player === 'cross' ? this.putCross(i) : this.putCircle(i);
        break; 
      }
      default: break;
    }

    this.props.updateBox(box)

    const result = this.checkWinner(i, box);

    if (this.props.turn === 9 || result.isFinish) {
      setTimeout(() => { 
        this.props.resetGame(result.score) 
      }, 1000)
    }
  }

  renderBox = () => {
    const boxes = []
    for (let i = 1; i <= 9; i++) {
      boxes.push(<div key={i} onClick={() => this.onBoxClick(i)} className={`box`}></div>)
    }
    return boxes;
  }

  renderSvgLine = () => {
    let linePoint = {
      alpha: 5,
      beta: 167,
      gama: 334,
      omega: 497,
    } 

    if (window.innerWidth < 768) {
      linePoint.alpha = 3
      linePoint.beta = 124
      linePoint.gama = 248
      linePoint.omega = 362
    } 
    
    if (window.innerWidth < 481) {
      linePoint.alpha = 2
      linePoint.beta = 82
      linePoint.gama = 164
      linePoint.omega = 241
    }
    
    return [
      <line key="1" x1={linePoint.alpha} y1={linePoint.beta} x2={linePoint.omega} y2={linePoint.beta}></line>,
      <line key="2" x1={linePoint.alpha} y1={linePoint.gama} x2={linePoint.omega} y2={linePoint.gama}></line>,
      <line key="3" x1={linePoint.beta} y1={linePoint.alpha} x2={linePoint.beta} y2={linePoint.omega}></line>,
      <line key="4" x1={linePoint.gama} y1={linePoint.alpha} x2={linePoint.gama} y2={linePoint.omega}></line>,
    ]
  }

  renderMark = () => ( 
    Object
      .keys(this.props.box)
      .map((el, i) => <Fragment key={i}>{ this.props.box[el] }</Fragment>)
  )

  render() {
    return (
      <Fragment>
        <svg>
          { this.renderSvgLine() }
          { this.renderMark() }          
        </svg>
        <div className="boxes">
          { this.renderBox() }
        </div>
      </Fragment>
    )
  }
}

export default Board