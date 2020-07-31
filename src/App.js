import React, { Component } from 'react';
import './App.css';
import linkedin from './linkedin.png'
import cloneDeep from 'lodash/cloneDeep';


class App extends Component{
  
  constructor(props){
      super(props)
      let t = this.generateGrid(30)

      this.state = {
        algo: 'Quicksort', 
        length: 30,
        board: t,
        boardSol: cloneDeep(t),
        speed: 'Fast',
        speedVal: 100,
        orange:[],
        green:[],
        solution:[],
        finaltab: Array.from({length: 30}, () => 0),
        can:true
      }
  }

  generateGrid(l){
    return Array.from({length: l}, () => Math.floor(Math.random() * 100));
  }

  onchangeGrid(){
    let tab= this.generateGrid(this.state.length)
    this.setState({
      board:tab,
      boardSol: cloneDeep(tab),
      orange:cloneDeep([]),
      green:cloneDeep([]),
      solution: [],
      finaltab: Array.from({length: this.state.length}, () => 0),
      can:true
    })
   }

  onchangeAlgo(e){
    this.setState({
      algo : e.target.value
    })
  }

  onchangeSpeed(e){
    let s= 100

    if( e.target.value === 'Average'){
      s=200
    }else if(e.target.value === 'Slow'){
      s=400
    }
    this.setState({
      speed : e.target.value,
      speedVal : s
    })
  }

  onchangeLength(e){
    if(e.target.value !== this.state.length ){
      let l =  e.target.value
      let tab= this.generateGrid(l)
      this.setState({
        length: l,
        board: tab,
        boardSol: cloneDeep(tab),
        solution:[],
        green :[],
        orange:[],
        finaltab: Array.from({length: l}, () => 0),
        can:true
      })
    }
  }

  sort(){
    if(this.state.can){
      this.setState({
        can: false
      })
      if(this.state.algo === 'Quicksort'){
        this.quickSort(0,this.state.length-1)
      }else if(this.state.algo === 'Merge sort'){
        this.mergeSort(0,this.state.board.length-1)
      }else if(this.state.algo === 'Shellsort'){
        this.shellSort()
      }else if(this.state.algo === 'selection Sort'){
        this.selectionSort()
      }else if(this.state.algo === 'Heapsort'){
        this.heapSort()
      }
      if(this.state.algo === 'Merge sort'){
        this.state.solution.map( (e,i) => {
          return setTimeout(() => {
            let tab = this.state.board
            tab[e.x] = e.y
            let g = [e.x,e.r]
            this.setState({
              board: tab,
              green: g,
            })
          }, this.state.speedVal*i)
        })
      }else{
        this.state.solution.map( (e,i) => {
            return setTimeout(() => {
              let tab = this.state.board
              let ilast = this.state.board[e.x];
              tab[e.x] = this.state.board[e.y];
              tab[e.y] = ilast;
              let g = [e.x,e.y]
              let r = []
              if(e.p !== undefined) r.push(e.p)
              if(e.final){
                let t = this.state.finaltab
                t[e.x]=1
                this.setState({
                  finaltab : t
                })
              }

              this.setState({
                green:g,
                orange: r,
                board: tab,
              })
            }, this.state.speedVal*i)
        })
      }
    } 
  }

  isorange(index){
    return this.state.orange.includes(index)
  }

  isgreen(index){
    return this.state.green.includes(index)
  }

  isFinal(index){
    return this.state.finaltab[index] === 1
  }

  displayBoard(){
    const numWidth = Math.floor(window.innerWidth / (this.state.length * 3))
    return (
      <div id="bodyContainer">
        {this.state.board.map((value, index) => {
          return <div key={index} className={`arrayElement , ${this.isFinal(index) ? 'res': this.isgreen(index) ? 'green' : this.isorange(index) ? 'orange' : ''}`} style={{height: `${value * 3}px`, width:`${numWidth}px`}}>
                 </div>
        })}
      </div>
    )
  }
  

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="toolbar" role="banner">
            Algorithms
            <select value={this.state.algo} onChange={(event) => this.onchangeAlgo(event)}> 
              <option>Quicksort</option>
              <option>Merge sort</option>
              <option>Heapsort</option>
              <option>Shellsort</option>
              <option>selection Sort</option>
            </select>
            <div className="spacer"></div>
            <button onClick={this.onchangeGrid.bind(this)}>generate Grid</button>
            <div className="spacer"></div>

            length
            <input value={this.state.length} type="range" min="0" max="100" onChange={(event) => this.onchangeLength(event)}></input>
            <div className="spacer"></div>
            Speed
            <select value={this.state.speed} onChange={(event) => this.onchangeSpeed(event)}> 
              <option>Fast</option>
              <option>Average</option>
              <option>Slow</option>
            </select>            
            <div className="spacer"></div>
            <button onClick={this.sort.bind(this)}>Sort</button>
            <div className="spacer"></div>
            <a href="https://www.linkedin.com/in/walid-boukris-179771157/">
              <img width='40' src={linkedin} alt='Linkedin' title='linkedin'/>
            </a>
          </div>
          {this.displayBoard()}    
          <table>
            <tbody>
              <tr>
                <td className="res" width='40'></td>
                <td>final Position</td>
              </tr>
              <tr>
                <td className="orange" width='40'></td>
                <td>pivot</td>
              </tr>
              <tr>
                <td className="green" width='40'></td>
                <td>position in traitement</td>
              </tr>
              <tr>
                <td className="normal" width='40'></td>
                <td>non treated position</td>
              </tr>
            </tbody>
          </table>
        </header>
      </div>
    );
  }

  /* AlgoooooooooooooooooooooooooooooooooooooooooS */
  
  /** Swap Function */
  swap(i,j,pivot,f) {
    let tab = this.state.boardSol
    let ilast = this.state.boardSol[i];
    tab[i] = this.state.boardSol[j];
    tab[j] = ilast;
    this.setState({
      boardSol: tab,
      solution: this.state.solution.push({'x':i,'y':j,'p':pivot,'final':f})
    }) 
  }

  /** Quicksort */
  quickSort = (debut,fin) => {
      if(debut<=fin){
        let p = this.partition(debut,fin);


        this.quickSort(debut,p-1)
        this.quickSort(p+1,fin)    
      }
  }

  partition = (debut,fin) => {
      let pivot = this.state.boardSol[fin];
      let i = debut;
      for(let j=debut; j<=fin;j++){
        if(this.state.boardSol[j] < pivot){
          this.swap(i,j,fin,false)
          i = i+1;
        }
      }
      this.swap(i,fin,fin,true)
      return i
  }

  /** Shellsort */
  shellSort = () => {
    this.state.boardSol.forEach( (elt,gap)=> {
      
      for(let i= gap; i<this.state.length ; i=i+1){
          let temp = this.state.boardSol[i]
          let j= i
          for(j= i; j >= gap && this.state.boardSol[j-gap]>temp ; j=j-gap){
            this.swap(j,j-gap,undefined,false)
          }
          let fuck = this.state.boardSol
          fuck[j] = temp
          this.setState({
            boardSol: fuck
          })
      }
    })
  }

  /** selection sort */
  selectionSort = () => {
    for( let i=0;i<this.state.length-1;i=i+1){
      let jmin = i
      for(let j=i+1;j<this.state.length;j=j+1){
        this.swap(j,j,undefined,false)
        if(this.state.boardSol[j]<this.state.boardSol[jmin]){
          jmin = j 
        }
      }
      this.swap(i,jmin,undefined,true)
    }
    this.swap(this.state.length-1,this.state.length-1,undefined,true)
  }
  
  /** merge sort */
  mergeSort = (debut,fin) => {
    if( 0<=debut && debut<fin ){
      let middle = Math.floor((fin + debut)/2)
      this.mergeSort(debut,middle)
      this.mergeSort(middle+1,fin)
      this.merge(debut,middle,fin)
    }
  }

  merge(debut,middle,fin){
    let L = []
    let R = []
    let n1 = middle - debut + 1; 
    let n2 = fin - middle; 

    for (let i=0; i<n1; ++i){
      L.push(this.state.boardSol[debut + i]) 
    }
    for (let j=0; j<n2; ++j){
      R.push(this.state.boardSol[middle + 1+ j])
    }  
    
    let i = 0
    let j = 0
    let k = debut
    while(i<n1 && j<n2){
      if(L[i]<= R[j]){
        let tab = this.state.boardSol
        tab[k]= L[i]
        this.setState({
          boardSol : tab,
          solution : this.state.solution.push({'x':k,'y':L[i],'p':undefined,'finale':false,'r':debut + i})
        })
        i++
      }else{
        let tab = this.state.boardSol
        tab[k]= R[j]
        this.setState({
          boardSol : tab,
          solution : this.state.solution.push({'x':k,'y':R[j],'p':undefined,'finale':false,'r':middle + 1+ j})
        })
        j++
      }
      k++
    }
    /* Copy remaining elements of L[] if any */
    while (i < n1) 
    { 
        let tab = this.state.boardSol
        tab[k]= L[i]
        this.setState({
          boardSol : tab,
          solution : this.state.solution.push({'x':k,'y':L[i],'p':undefined,'finale':false,'r':debut + i})
        })
        i++; 
        k++; 
    } 

    /* Copy remaining elements of R[] if any */
    while (j < n2) 
    { 
        let tab = this.state.boardSol
        tab[k]= R[j]
        this.setState({
          boardSol : tab,
          solution : this.state.solution.push({'x':k,'y':R[j],'p':undefined,'finale':false,'r':middle + 1+ j})
        }) 
        j++; 
        k++; 
    } 
  }

  /** heap sort */
  heapSort = () => {
    let n = this.state.length
    for (let i = n-1; i >= 0; i--){
      this.heapify(n, i);
    } 
    for (let i=n-1; i>=0; i--) 
        { 
            this.swap(i,0,undefined,true)
            this.heapify(i, 0); 
        } 
  }

  heapify(n,i){
    let largest = i;
    let l = 2*i + 1;
    let r = 2*i + 2;

    if (l < n && this.state.boardSol[l] > this.state.boardSol[largest]) {
      largest = l; 
    }
      
    if (r < n && this.state.boardSol[r] > this.state.boardSol[largest]){
      largest = r; 
    }
      
    if (largest !== i) 
    { 
        this.swap(i,largest,undefined,false)
        this.heapify(n, largest); 
    } 
  }
}

export default App;