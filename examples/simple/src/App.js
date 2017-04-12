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
        <button onClick={this.toggle} className='toggle'>Open drawer!</button>

        <Drawer open={open} onRequestClose={this.toggle}>
          <div className='card'>
            I'm in a drawer!
            <br />
            <br />
            <br />
            <br />
            <button className='toggle' onClick={this.toggle}>Close drawer</button>
          </div>
        </Drawer>
      </div>
    )
  }
}
