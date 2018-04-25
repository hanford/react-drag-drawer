import React, { Component } from 'react'
import { Motion, spring, presets } from 'react-motion'
import PropTypes from 'prop-types'
import document from 'global/document'
import Observer from 'react-intersection-observer'
import styled, { css, keyframes } from 'react-emotion'
import { createPortal } from 'react-dom'

if (typeof window !== 'undefined') {
  require('intersection-observer')
}

export default class Drawer extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onDrag: PropTypes.func,
    onOpen: PropTypes.func,
    inViewportChange: PropTypes.func,
    allowClose: PropTypes.bool,
    modalElementClass: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    containerStyle: PropTypes.object,
    notifyWillClose: PropTypes.func,
    direction: PropTypes.string
  }

  static defaultProps = {
    notifyWillClose: () => {},
    onOpen: () => {},
    onDrag: () => {},
    inViewportChange: () => {},
    onRequestClose: () => {},
    direction: 'y',
    parentElement: document.body,
    allowClose: true,
    dontApplyListeners: false
  }

  state = {
    open: this.props.open,
    thumb: 0,
    start: 0,
    position: 0,
    touching: false,
    listenersAttached: false
  }

  MAX_NEGATIVE_SCROLL = 20
  SCROLL_TO_CLOSE = 75
  ALLOW_DRAWER_TRANSFORM = true

  componentDidMount () {
    if (this.props.escapeClose) {
      console.warn('escapeClose has been deprecated, please remove it from react-drag-drawer')
    }

    if (this.props.overlayOpacity) {
      console.warn('overlayOpacity has been deprecated, please remove it from react-drag-drawer')
    }

    if (this.props.onRest) {
      console.warn('onRest has been deprecated, please remove it from react-drag-drawer')
    }

    if (this.props.maxNegativeScroll) {
      console.warn('maxNegativeScroll has been deprecated, please remove it from react-drag-drawer')
    }

    if (this.props.disableDrag) {
      console.warn('disableDrag has been deprecated, please remove it from react-drag-drawer')
    }

    if (this.props.scrollToClose) {
      console.warn('scrollToClose has been deprecated, please remove it from react-drag-drawer')
    }

    if (this.props.spring) {
      console.warn('spring has been deprecated, please remove it from react-drag-drawer')
    }

    if (this.props.kinetic) {
      console.warn('kinetic has been deprecated, please remove it from react-drag-drawer')
    }

    if (this.props.animationSpring) {
      console.warn('animationSpring has been deprecated, please remove it from react-drag-drawer')
    }

    if (this.drawer) {
      this.getNegativeScroll(this.drawer)
    }
  }

  componentDidUpdate (prevProps, nextState) {
    // in the process of closing the drawer
    if (!this.props.open && prevProps.open) {
      this.removeListeners()

      setTimeout(() => {
        this.setState(() => {
          return {
            open: false
          }
        })
      }, 300)
    }

    if (this.drawer) {
      this.getNegativeScroll(this.drawer)
    }

    // in the process of opening the drawer
    if (this.props.open && !prevProps.open) {
      this.props.onOpen()

      this.setState(() => {
        return {
          open: true
        }
      })
    }
  }

  componentWillUnmount () {
    this.removeListeners()
  }

  attachListeners = (drawer) => {
    const { parentElement, dontApplyListeners }  = this.props
    const { listenersAttached } = this.state

    if (!drawer) return

    this.drawer = drawer

    // only attach listeners once as this function gets called every re-render
    if (listenersAttached || dontApplyListeners) return

    this.drawer.addEventListener('touchend', this.onTouchEnd)
    this.drawer.addEventListener('touchmove', this.onTouchMove)
    this.drawer.addEventListener('touchstart', this.onTouchStart)

    this.setState({ listenersAttached: true }, () => {
      setTimeout(() => {
        // trigger reflow so webkit browsers calculate height properly 😔
        this.drawer.style.display = 'none'
        void(this.drawer.offsetHeight)
        this.drawer.style.display = ''
      }, 300)
    })
  }

  removeListeners = () => {
    const { parentElement } = this.props

    if (!this.drawer) return

    this.drawer.removeEventListener('touchend', this.onTouchEnd)
    this.drawer.removeEventListener('touchmove', this.onTouchMove)
    this.drawer.removeEventListener('touchstart', this.onTouchStart)

    this.setState({ listenersAttached: false })
  }

  onTouchStart = event => {
    const { pageY, pageX } = event.touches[0]

    const start = this.isDirectionVertical() ? pageY : pageX

    // reset NEW_POSITION and MOVING_POSITION
    this.NEW_POSITION = 0
    this.MOVING_POSITION = 0

    this.setState(() => {
      return {
        thumb: start,
        start: start,
        touching: true
      }
    })
  }

  onTouchMove = event => {
    const { thumb, start, position } = this.state

    const { pageY, pageX } = event.touches[0]

    const movingPosition = this.isDirectionVertical() ? pageY : pageX
    const delta = movingPosition - thumb

    const newPosition = this.isDirectionVertical() ? position + delta : position - delta

    if (newPosition > 0 && this.ALLOW_DRAWER_TRANSFORM) {
      // stop android's pull to refresh behavior
      event.preventDefault()

      this.props.onDrag({ newPosition })
      // we set this, so we can access it in shouldWeCloseDrawer. Since setState is async, we're not guranteed we'll have the
      // value in time
      this.MOVING_POSITION = movingPosition
      this.NEW_POSITION = newPosition

      if (newPosition >= 0 && this.shouldWeCloseDrawer()) {
        this.props.notifyWillClose(true)
      } else {
        this.props.notifyWillClose(false)
      }

      // not at the bottom
      if (this.NEGATIVE_SCROLL < newPosition) {
        this.setState(() => {
          return {
            thumb: movingPosition,
            position: newPosition
          }
        })
      }
    }
  }

  onTouchEnd = event => {
    const { disableDrag } = this.props
    const { start } = this.state

    this.setState(() => {
      return {
        touching: false
      }
    })

    if (this.shouldWeCloseDrawer()) {
      this.hideDrawer()
    } else {
      this.setState(() => {
        return {
          position: 0
        }
      })
    }
  }

  getNegativeScroll = element => {
    const size = this.getElementSize()

    if (this.isDirectionVertical()) {
      this.NEGATIVE_SCROLL = size - element.scrollHeight - this.MAX_NEGATIVE_SCROLL
    } else {
      this.NEGATIVE_SCROLL = size - element.scrollWidth - this.MAX_NEGATIVE_SCROLL
    }
  }

  hideDrawer = () => {
    if (this.props.allowClose === false) {
      // if we aren't going to allow close, let's animate back to the default position
      return this.setState(() => {
        return {
          position: 0,
          thumb: 0,
          touching: false
        }
      })
    }

    this.setState(() => {
      return {
        position: 0,
        touching: false
      }
    })

    // cleanup
    this.removeListeners()

    // invoke parent close fn
    this.props.onRequestClose()
  }

  shouldWeCloseDrawer = () => {
    const { start } = this.state

    if (this.MOVING_POSITION === 0) return false

    return this.isDirectionVertical()
      ? this.NEW_POSITION >= 0 && this.MOVING_POSITION - start > this.SCROLL_TO_CLOSE
      : this.NEW_POSITION >= 0 && start - this.MOVING_POSITION > this.SCROLL_TO_CLOSE
  }

  getDrawerTransform = value => {
    const { direction } = this.props

    return this.isDirectionVertical() ? {transform: `translate3d(0, ${value}px, 0)`} : {transform: `translate3d(-${value}px, 0, 0)`}
  }

  getElementSize = () => {
    return this.isDirectionVertical() ? window.innerHeight : window.innerWidth
  }

  isDirectionVertical = () => {
    return this.props.direction === 'y'
  }


  inViewportChange = inView => {
    this.props.inViewportChange(inView)

    this.ALLOW_DRAWER_TRANSFORM = inView
  }

  preventDefault = event => event.preventDefault()
  stopPropagation = event => event.stopPropagation()

  setPosition = () => console.warn('Drawer.setPosition has been deprecated, please remove')
  saveNegativeScroll = () => console.warn('Drawer.saveNegativeScroll has been deprecated, please remove')
  setKineticPosition = () => console.warn('Drawer.setKineticPosition has been deprecated, please remove')
  setDrawerPosition = () => console.warn('Drawer.setDrawerPosition has been deprecated, please remove')

  render () {
    const { containerStyle, dontApplyListeners, id } = this.props

    const open = this.state.open && this.props.open

    if (!this.state.open && !this.props.open) {
      // If drawer isn't open or in the process of opening/closing, then remove it from the DOM
      return null
    }

    const { position, touching } = this.state

    const animationSpring = touching ? {damping: 20, stiffness: 300} : presets.stiff
    const hiddenPosition = this.getElementSize()

    return createPortal(
      <Motion
        style={{
          translate: spring(open ? position : hiddenPosition, animationSpring),
        }}
        defaultStyle={{
          translate: hiddenPosition
        }}
      >
        {({ translate }) => {
          return (
            <Container
              id={id}
              style={{backgroundColor: `rgba(55, 56, 56, ${open ? 0.6 : 0})`, ...containerStyle}}
              onClick={this.hideDrawer}
            >
              <HaveWeScrolled onChange={this.inViewportChange} />

              <div
                onClick={this.stopPropagation}
                style={this.getDrawerTransform(translate)}
                ref={this.attachListeners}
                className={this.props.modalElementClass || ''}
              >
                {this.props.children}
              </div>
            </Container>
          )
        }}
      </Motion>,
      this.props.parentElement
    )
  }
}

const Container = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  flex-shrink: 0;
  align-items: center;

  z-index: 11;
  transition: background-color 0.2s linear;

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`

const HaveWeScrolled = styled(Observer)`
  position: absolute;
  top: 0;
  height: 1px;
  width: 100%;
`
