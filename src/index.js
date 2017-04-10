/**
 * This microcomponent is a modal on desktop and a Y-swipeable drawer on mobile
 */
import React, { PropTypes } from 'react'
import { Motion, spring, presets } from 'react-motion'
import window from 'global/window'
import document from 'global/document'

// import style from './style.css'

// Background opacity controls the darkness of the overlay background. More means a darker background.

export default class Drawer extends React.Component {
  constructor (props) {
    super(props)

    this.drawer = null
    this.state = {
      open: props.open,
      thumbY: 0,
      startThumbY: 0,
      position: 0,
      touching: false
    }

    this.BACKGROUND_OPACITY = 0.6
    this.NEGATIVE_SCROLL = props.negativeScroll || -195
    this.SCROLL_TO_CLOSE = 50

    this.attachListeners = this.attachListeners.bind(this)
    this.removeListeners = this.removeListeners.bind(this)
    this.preventDefaultTouch = this.preventDefaultTouch.bind(this)

    this.updatePosition = this.updatePosition.bind(this)
    this.updateThumbY = this.updateThumbY.bind(this)
    this.hideDrawer = this.hideDrawer.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }

  getNegativeHeight (drawerHeight) {
    const NEGATIVE_SCROLL_BUFFER = 30
    return window.innerHeight - drawerHeight - NEGATIVE_SCROLL_BUFFER
  }

  componentDidMount () {
    if (this.drawer) {
      this.NEGATIVE_SCROLL = this.getNegativeHeight(this.drawer.scrollHeight)
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.drawer) {
      const newNegativeScroll = this.getNegativeHeight(this.drawer.scrollHeight)

      if (newNegativeScroll < this.NEGATIVE_SCROLL) {
        this.NEGATIVE_SCROLL = newNegativeScroll
      }
    }

    // in the process of opening the drawer
    if (!this.props.open && nextProps.open) {
      this.setState({open: true})
    }

    // in the process of closing the drawer
    if (this.props.open && !nextProps.open) {
      this.removeListeners()
      setTimeout(() => this.setState({open: false}), 300)
    }
  }

  preventDefaultTouch (e) {
    e.preventDefault()
  }

  componentWillUnmount () {
    // incase user navigated directly to checkout
    this.removeListeners()
    this.setState({ position: 0, thumbY: 0, touching: false })
  }

  attachListeners () {
    const body = document.body

    body.addEventListener('touchmove', this.preventDefaultTouch)
    body.addEventListener('scroll', this.preventDefaultTouch)
    body.addEventListener('mousewheel', this.preventDefaultTouch)

    if (!this.drawer) return
    this.drawer.addEventListener('touchend', this.onTouchEnd)
    this.drawer.addEventListener('touchmove', this.onTouchMove)
    this.drawer.addEventListener('touchstart', this.onTouchStart)
  }

  removeListeners () {
    const body = document.body

    body.removeEventListener('touchmove', this.preventDefaultTouch)
    body.removeEventListener('scroll', this.preventDefaultTouch)
    body.removeEventListener('mousewheel', this.preventDefaultTouch)

    if (!this.drawer) return
    this.drawer.removeEventListener('touchend', this.onTouchEnd)
    this.drawer.removeEventListener('touchmove', this.onTouchMove)
    this.drawer.removeEventListener('touchstart', this.onTouchStart)
  }

  onTouchStart (event) {
    const startY = event.touches[0].pageY
    this.setState({
      thumbY: startY,
      startThumbY: startY,
      touching: true
    })
  }

  onTouchMove (event) {
    const movingPosition = event.touches[0].pageY
    const delta = movingPosition - this.state.thumbY

    if (this.props.onDrag) {
      this.props.onDrag()
    }

    if (!(delta + this.state.position < this.NEGATIVE_SCROLL)) {
      this.updatePosition(delta)
      this.updateThumbY(movingPosition)
    }
  }

  onTouchEnd (event) {
    // dont hide the drawer unless the user was trying to drag it to a hidden state,
    // this 50 is a magic number for allowing the user to drag the drawer up to 50pxs before
    // we automatically hide the drawer
    this.setState({touch: false})
    if (this.state.position >= 0 && this.state.thumbY - this.state.startThumbY > this.SCROLL_TO_CLOSE) {
      this.hideDrawer()
    }
  }

  hideDrawer () {
    // let's reset our state, so our next drawer has a clean slate
    // clean up our listeners
    this.removeListeners()
    // and finally route back to whichever URL we're at without the drawer.
    // (for the product page case, we're returning to /menu)
    this.props.onRequestClose()
    setTimeout(() => {
      this.setState({ open: false, thumbY: 0, position: 0, touching: false })
    }, 300)
  }

  updateThumbY (thumbPosition) {
    this.setState({thumbY: thumbPosition})
  }

  updatePosition (delta) {
    this.setState({position: this.state.position + delta})
  }

  render () {
    // If drawer isn't open or in the process of opening/closing, then remove it from the DOM
    if (!this.props.open && !this.state.open) return <div />

    // Otherwise we only care if both state and props open are true
    const open = this.state.open && this.props.open

    const { position, touching } = this.state

    if (this.props.open && this.state.open) {
      // if our drawer is open, let's attach the listeners
      this.attachListeners()
    }

    // this is passed to react-motion and react-motion animate accordingly.
    // we use a differenent animation curve when touching is true, b/c we want the touch
    // transition to feel native, which require a much higher stiffness (when your thumb moves, you want
    // the element to respond immediately)
    const animationSpring = touching ? {damping: 20, stiffness: 300} : presets.stiff

    return (
      <Motion style={{
        translateY: spring(open ? position : window.innerHeight, animationSpring),
        opacity: spring(open ? this.BACKGROUND_OPACITY : 0)
      }}>
        {({ translateY, opacity }) => {
          return (
            <div
              style={{backgroundColor: `rgba(55, 56, 56, ${opacity})`}}
              onClick={this.hideDrawer}
              className='drawerContainer'
            >
              <div
                style={{transform: `translateY(${translateY}px)`, height: '100%', width: '100%'}}
                onClick={(e) => e.stopPropagation()}
                ref={(drawer) => { this.drawer = drawer }}>
                {this.props.children}
              </div>

              <style jsx>{`
                .modal {
                  outline: none;
                  background: white;
                  font-size: var(--fontSizeParagraph);
                  width: 76rem;
                  max-width: 90%;
                  display: flex;
                  justify-content: space-between;
                  flex-direction: column;
                  z-index: 15;
                  min-height: 47rem;

                  /* add all the CSS hacks */
                  will-change: transform;
                  transform: translate3d(0, 0, 0);
                  -webkit-backface-visibility: hidden;
                  -webkit-transform-style: preserve-3d;
                }

                @media (max-width: 768px) {
                  .modal {
                    width: 100%;
                    max-width: 100%;
                    margin-bottom: 0;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                  }
                }

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

Drawer.propTypes = {
  children: PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]).isRequired,
  onRequestClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onDrag: PropTypes.func,
  negativeScroll: PropTypes.number
}
