import React, { PureComponent, Fragment } from 'react'
import GithubBadge from 'react-github-badge'
import { render } from 'react-dom'
import { css } from 'emotion'

import Drawer from '../../src'

const bigArray = new Array(500).fill(true)

class Demo extends PureComponent {
  state = {
    regular: false,
    sidebar: false,
    asyncHeight: false
  }

  toggle = (type, value) => event => {
    this.setState((state) => {
      return {
        [type]: value
      }
    })
  }

  getAsyncChildren = () => {
    setTimeout(() => {
      const asyncChildren = bigArray.map((_, index) => <div key={index}>{index}</div>)
      this.setState({asyncChildren})
    }, 200)
  }

  render() {
    const { regular, sidebar, asyncHeight, crazyStyle } = this.state

    return (
      <div className={`${Reset} ${Container}`}>
        <GithubBadge
          title='Star on Github'
          url='https://github.com/hanford/react-drag-drawer'
        />

        <h1>React Drag Drawer</h1>
        <Info>react-drag-drawer is a lightweight, performant, drawer/modal component that can be dragged close. The animations are done with react-motion so they feel very natural</Info>
        <button onClick={this.toggle('regular', true)} className={Toggle}>Open example</button>
        <div className={Break} />
        <Info>react-drag-drawer uses native HTML5 scrolling to remain performant and to properly respond to async data / components</Info>
        <button onClick={this.toggle('asyncHeight', true)} className={Toggle}>Async height</button>
        <div className={Break} />
        <Info>You can also use react-drag-drawer to build sidebars by simply changing the `direction` prop</Info>
        <button onClick={this.toggle('sidebar', true)} className={Toggle}>Sidebar</button>
        <div className={Break} />
        <Info>react-drag-drawer assumes nothing about your styles and is left entirely up to you how you want to style it</Info>
        <button onClick={this.toggle('crazyStyle', true)} className={Toggle}>Different style</button>
        <div className={Break} />
        <Info>react-drag-drawer has a <a target='_blank' href='https://github.com/hanford/react-drag-drawer#api'>small but extensive API</a> that allows for some very cool customizations</Info>

        <Drawer
          open={regular}
          onRequestClose={this.toggle('regular', false)}
          modalElementClass={ModalElement}
        >
          <div className={Card}>
            I'm in a drawer!
            <button className={Toggle} onClick={this.toggle('regular', false)}>Close drawer</button>
          </div>
        </Drawer>

        <Drawer
          open={sidebar}
          onRequestClose={this.toggle('sidebar', false)}
          modalElementClass={Sidebar}
          direction='x'
        >
          <div className={Card}>
            I'm a sidebar drawer
            <button className={Toggle} onClick={this.toggle('sidebar', false)}>Close drawer</button>
          </div>
        </Drawer>

        <AsyncHeightDrawer
          open={asyncHeight}
          onRequestClose={this.toggle('asyncHeight', false)}
          modalElementClass={HugeList}
        />
      </div>
    )
  }
}

const Info = ({ children }) => <p className={InfoComponent}>{children}</p>

class AsyncHeightDrawer extends PureComponent {
  state = {
    asyncData: []
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.open === false && nextProps.open === true) {
      setTimeout(() => {
        const newArray = new Array(500).fill(true)

        this.setState({ asyncData: newArray })
      }, 1500)
    }

    if (nextProps.open === false && this.props.open) {
      this.setState({ asyncData: [] })
    }
  }

  render () {
    return (
      <Drawer kinetic={true} {...this.props}>
        <div className={Card}>
          <button className={Toggle} onClick={this.props.onRequestClose}>Close drawer</button>
          <br />
          <div className={Content}>{this.state.asyncData.length === 0 ? <div>Loading...</div> : this.state.asyncData.map((_, index) => <div key={index}>{index}</div>)}</div>
        </div>
      </Drawer>
    )
  }
}

const Reset = css`
  html,
  body {
    margin: 0;
    padding: 0;
  }
`

const Content = css`
  background-color: white;
`

const Card = css`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 40px auto;

  @media(min-width: 768px) {
    border-radius: 0;
  }

  button {
    margin-top: 50px;
  }
`

const Toggle = css`
  background-color: #d50152;
  border-radius: 4px;
  color: white;
  border: 0;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: all 0.25s linear;

  &:active {
    transform: scale(0.9);
  }
`

const modal = css`
  position: absolute;
  top: 30px;
  background-color: white;
  width: 100%;
  max-width: 700px;
  min-height: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`

const Sidebar = css`
  ${modal}
  top: 0;
  max-width: 300px;
  border-radius: 0;
  left: 0;
`

const CrazyStyle = css`
  ${modal}
  top: auto;
  min-height: 100%;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
`

const ModalElement = css`
  ${modal}
  text-align: center;

  @media(max-width: 767px) {
    width: 100%;
  }
`

const HugeList = css`
  ${modal}
  text-align: center;
  overflow: auto;

  @media(max-width: 767px) {
    width: 100%;
  }
`

const Container = css`
  margin: 200px auto 0;
  width: 100%;

  font-family: arial;
  max-width: 600px;
`

const Break = css`
  width: 100%;
  margin-bottom: 20px;
`

const InfoComponent = css`

`

render(<Demo/>, document.querySelector('#demo'))
