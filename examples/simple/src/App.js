import React, { Component } from 'react'
import './App.css'
import Drawer from '../../../dist/react-drag-drawer.min.js'

export default class App extends Component {
  constructor () {
    super()

    this.state = {
      open: false
    }
  }

  toggle = () => {
    this.setState((state) => {
      let open = !state.open

      return {
        open
      }
    })
  }

  render () {
    const { open } = this.state

    return (
      <div className="App">
        <button onClick={this.toggle}>Open!</button>

        <Drawer open={open} onRequestClose={this.toggle}>
          <div className='card'>
            I'm in a drawer!
            <br />
            <button onClick={this.toggle}>Close</button>
          </div>
        </Drawer>
      </div>
    )
  }
}
