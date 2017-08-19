import React, { Component } from 'react'
import { Motion, spring, presets } from 'react-motion'
import PropTypes from 'prop-types'
import window from 'global/window'
import document from 'global/document'

class Drawer extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onDrag: PropTypes.func,
    onOpen: PropTypes.func,
    overlayOpacity: PropTypes.number,
    scrollToClose: PropTypes.number,
    allowClose: PropTypes.bool,
    direction: PropTypes.string,
    modalElementClass: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    containerStyle: PropTypes.object,
    onRest: PropTypes.func,
    disableDrag: PropTypes.bool,
    maxNegativeScroll: PropTypes.number.isRequired,
    notifyWillClose: PropTypes.func
  }

  static defaultProps = {
    onRest: () => {},
    maxNegativeScroll: 20,
    disableDrag: false,
    notifyWillClose: () => {},
    spring: {damping: 20, stiffness: 300},
    escapeClose: false,
    direction: 'y'
  }

  constructor (props) {
    super(props)

    this.state = {
      open: props.open,
      thumbY: 0,
      startThumbY: 0,
      thumbX: 0,
      startThumbX: 0,
      position: 0,
      touching: false,
      listenersAttached: false
    }

    // Background opacity controls the darkness of the overlay background. More means a darker background.
    this.BACKGROUND_OPACITY = props.overlayOpacity || 0.6
    this.SCROLL_TO_CLOSE = props.scrollToClose || 50
    this.parentElement = props.parentElement || document.body

    // typeof check, because false will otherwise be ignored
    this.allowClose = props.allowClose || (typeof props.allowClose !== 'boolean')
  }

  getNegativeScroll = element => {
    this.NEGATIVE_SCROLL = window.innerHeight - element.scrollHeight - this.props.maxNegativeScroll

    if (this.props.saveNegativeScroll) {
      this.props.saveNegativeScroll(this.NEGATIVE_SCROLL, element.scrollHeight)
    }
  }

  componentDidMount () {
    if (this.drawer) {
      this.getNegativeScroll(this.drawer)
    }
  }

  componentWillUpdate (nextProps, nextState) {
    // in the process of closing the drawer
    if (this.props.open && !nextProps.open) {
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
    if (!this.props.open && nextProps.open) {
      if (this.props.onOpen) {
        this.props.onOpen()
      }

      this.setState(() => {
        return {
          open: true
        }
      })
    }
  }

  componentWillUnmount () {
    // incase user navigated directly to checkout
    this.removeListeners()

    this.setState(() => {
      return {
        position: 0,
        thumbY: 0,
        thumbX: 0,
        touching: false
      }
    })
  }

  preventDefault = e => {
    e.preventDefault()
  }

  attachListeners = () => {
    // only attach listeners once as this function gets called every re-render
    if (this.props.disableDrag || this.state.listenersAttached) return

    this.parentElement.addEventListener('touchmove', this.preventDefault)
    this.parentElement.addEventListener('scroll', this.preventDefault)
    this.parentElement.addEventListener('mousewheel', this.preventDefault)

    if (!this.drawer) return
    this.drawer.addEventListener('touchend', this.onTouchEnd)
    this.drawer.addEventListener('touchmove', this.onTouchMove)
    this.drawer.addEventListener('touchstart', this.onTouchStart)

    this.setState({ listenersAttached: true })
  }

  removeListeners = () => {
    if (this.props.disableDrag) return

    this.parentElement.removeEventListener('touchmove', this.preventDefault)
    this.parentElement.removeEventListener('scroll', this.preventDefault)
    this.parentElement.removeEventListener('mousewheel', this.preventDefault)

    if (!this.drawer) return
    this.drawer.removeEventListener('touchend', this.onTouchEnd)
    this.drawer.removeEventListener('touchmove', this.onTouchMove)
    this.drawer.removeEventListener('touchstart', this.onTouchStart)

    this.setState({ listenersAttached: false })
  }

  onTouchStart = event => {
    // immediately return if disableDrag
    if (this.props.disableDrag) return
    const { pageY, pageX } = event.touches[0]

    this.setState(() => {
      return {
        thumbY: pageY,
        startThumbY: pageY,
        thumbX: pageX,
        startThumbX: pageX,
        touching: true
      }
    })
  }

  // onTouchMove = event => {
  //   // immediately return if disableDrag
  //   if (this.props.disableDrag) return

  //   // stop android's pull to refresh behavior
  //   event.preventDefault()

  //   const movingPosition = event.touches[0].pageY
  //   const delta = movingPosition - this.state.thumbY
  //   const position = this.state.position + delta
  //   const atBottom = position < this.NEGATIVE_SCROLL

  //   if (this.props.onDrag) {
  //     this.props.onDrag(position)
  //   }

  //   if (position >= 0 && movingPosition - this.state.startThumbY > this.SCROLL_TO_CLOSE) {
  //     this.props.notifyWillClose(true)
  //   } else {
  //     this.props.notifyWillClose(false)
  //   }

  //   if (!atBottom) {
  //     this.setState(() => {
  //       return {
  //         thumbY: movingPosition,
  //         position: this.state.position + delta
  //       }
  //     })
  //   }
  // }

  onTouchMove = event => {
    // immediately return if disableDrag
    if (this.props.disableDrag) return

    const { direction } = this.props
    const { startY, startX, position, thumbX, thumbY } = this.state

    // stop android's pull to refresh behavior
    event.preventDefault()

    const movingPositionY = event.touches[0].pageY
    const movingPositionX = event.touches[0].pageX

    const deltaY = movingPositionY - thumbY
    const positionY = position + deltaY

    const deltaX = movingPositionX - thumbX
    const positionX = position + deltaX

    let newPosition = null
    let movingPosition = null
    let start = null
    let delta = null
    let doWeClose = null

    if (direction === 'x') {
      newPosition = positionX
      movingPosition = movingPositionX
      start = startX
      delta = deltaX
      doWeClose = newPosition >= 0 && movingPosition - start < this.SCROLL_TO_CLOSE
    } else {
      newPosition = positionY
      movingPosition = movingPositionY
      start = startY
      delta = deltaY
      doWeClose = newPosition >= 0 && movingPosition - start > this.SCROLL_TO_CLOSE
    }

    const atBottom = newPosition < this.NEGATIVE_SCROLL

    if (this.props.onDrag) {
      this.props.onDrag(newPosition)
    }

    if (doWeClose) {
      this.props.notifyWillClose(true)
    } else {
      this.props.notifyWillClose(false)
    }

    if (!atBottom) {
      const translate = direction === 'x' ? position - delta : position + delta
      this.setState(() => {
        return {
          thumbY: movingPosition,
          thumbX: movingPosition,
          position: translate
        }
      })
    }
  }

  onTouchEnd = event => {
    // immediately return if disableDrag
    if (this.props.disableDrag) return
    // dont hide the drawer unless the user was trying to drag it to a hidden state,
    // this 50 is a magic number for allowing the user to drag the drawer up to 50pxs before
    // we automatically hide the drawer
    this.setState(() => {
      return {
        touch: false
      }
    })

    const { position, thumbY, thumbX, startThumbY, startThumbX } = this.state
    const { direction } = this.props

    let thumb = null
    let start = null
    let doWeClose = false

    if (direction === 'y') {
      thumb = thumbY
      start = startThumbY
      doWeClose = position >= 0 && thumb - start > this.SCROLL_TO_CLOSE
    } else {
      thumb = thumbX
      start = startThumbX
      doWeClose = position >= 0 && thumb - start < this.SCROLL_TO_CLOSE
    }

    if (doWeClose) {
      this.hideDrawer()
    }
  }

  hideDrawer = () => {
    // if we aren't going to allow close, let's animate back to the default position
    if (this.allowClose === false) {
      return this.setState(() => {
        return {
          position: 0,
          thumbY: 0,
          thumbX: 0,
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

    // let's reset our state, so our next drawer has a clean slate
    // clean up our listeners
    this.removeListeners()

    // call the close function
    this.props.onRequestClose()
  }

  onKeyDown = event => {
    const { escapeClose } = this.props

    if (escapeClose && event.keyCode === 27) {
      this.hideDrawer()
    }
  }

  getStyle = value => {
    const { direction } = this.props

    if (direction === 'y') {
      return {transform: `translateY(${value}px)`}
    } else {
      return {transform: `translateX(-${value}px)`}
    }
  }

  render () {
    // If drawer isn't open or in the process of opening/closing, then remove it from the DOM
    if (!this.props.open && !this.state.open) return <div />

    const { containerStyle } = this.props

    // Otherwise we only care if both state and props open are true
    const open = this.state.open && this.props.open

    const { position, touching } = this.state

    if (open) {
      // if our drawer is open, let's attach the listeners
      this.attachListeners()
    }

    const animationSpring = touching ? this.props.spring : presets.stiff

    return (
      <Motion
        style={{
          translateValue: spring(open ? position : window.innerHeight, animationSpring),
          opacity: spring(open ? this.BACKGROUND_OPACITY : 0)
        }}
        defaultStyle={{
          opacity: 0,
          translateValue: window.innerHeight
        }}
        onRest={this.props.onRest}
      >
        {({ translateValue, opacity }) => {
          return (
            <div
              style={{backgroundColor: `rgba(55, 56, 56, ${opacity})`, ...containerStyle}}
              onClick={this.hideDrawer}
              className='drawerContainer'
            >
              <div
                onClick={e => e.stopPropagation()}
                onKeyDown={this.onKeyDown}
                style={this.getStyle(translateValue)}
                ref={drawer => { this.drawer = drawer }}
                className={this.props.modalElementClass || ''}
                tabIndex={this.props.tabIndex || '0'}
              >
                {this.props.children}
              </div>

              <style jsx>{`
                .drawerContainer {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  display: flex;
                  justify-content: center;
                  z-index: 11;
                  align-items: center;
                }

                @media(max-width: 768px) {
                  .drawerContainer {
                    height: 100%;
                    width: 100%;
                  }
                }
              `}</style>
            </div>
          )
        }}
      </Motion>
    )
  }
}

export default Drawer
