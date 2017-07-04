import React, { Component } from 'react'
import './App.css'
import GithubBadge from './github-badge'
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

        <GithubBadge
          url='https://github.com/hanford/react-drag-drawer'
          title='Star on Github'
        />

        <button onClick={this.toggle} className='toggle'>Open drawer!</button>

        <Drawer open={open} onRequestClose={this.toggle} modalElementClass='modalEl'>
          <div className='card'>
            <br />
            I'm in a drawer!
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
