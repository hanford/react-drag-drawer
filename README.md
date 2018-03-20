## react-drag-drawer

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

> Mobile draggable drawer that falls back to modals on desktop

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo

[Live demo!](https://react-drag-drawer.jackhanford.com)

## Install

```
$ npm install react-drag-drawer --save
```


## Usage

```js
import Drawer from 'react-drag-drawer'

..

toggle = () => {
  let { toggle } = this.state

  this.setState({ toggle: !toggle })
}

logState = () => {
  console.log(`Drawer now ${this.state.open ? 'open' : 'closed'}`)
}

render () {
  const { open } = this.state

  return (
    <Drawer
      open={open}
      onRequestClose={this.toggle}
    >
      <div>Hey Im inside the drawer!</div>
    </Drawer>
  )
}
```

![](http://d.pr/i/ThqP+)

## API
| Param          | Type    | functionality | required |
|----------------|---------|-----------------|-----------------|
| open           | Boolean | null | true |
| children       | Node    | null | true |
| onRequestClose | Function| null | true |
| onDrag | Function| invoked on drag | false |
| onOpen | Function| invoked on drawer focus | false |
| notifyWillClose | Function| notify HOC if the drawer will close | false |
| onClose | Function| invoked on drawer close | false |
| allowClose | Boolean | block closing if allowClose={false}, default is true | false |
| scrollToClose | Number | pixel drag to trigger onRequestClose | false |
| modalElementClass | Object | className to be applied to top <Drawer> element | false |
| containerStyle | Object | styles to be applied to the drawer container | false |
| disableDrag | Boolean | makes the drawer undraggable - basically just a modal | false |
| maxNegativeScroll | Number | distance a drawer can be dragged above the bottom of the window container | false |
| parentElement | ref | block scrolls on element if you're not using body scrolling | false |
| spring | Object | React motion spring config | false |
| direction | String | direction to translate drawer | false |
| dontApplyListeners | Boolean | skip applying internal event listeners to the dom | false |

Example modal style
```css
.modal {
  outline: none;
  background: white;
  font-size: 1.6rem;
  width: 76rem;
  max-width: 90%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  z-index: 15;
  min-height: 47rem;

  will-change: transform;
  transform: translate3d(0, 0, 0);
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
```

## License

MIT © [Jack Hanford](http://jackhanford.com)
