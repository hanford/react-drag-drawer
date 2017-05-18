## react-drag-drawer

> Mobile draggable drawer that falls back to modals on desktop

<br />

[Live demo!](https://build-mswpkxsqja.now.sh)

## Install

```
$ yarn add react-drag-drawer
```


## Usage

```js
import Drawer from 'react-drag-drawer'

..

toggle = () => {
  let { toggle } = this.state

  this.setState({ toggle: !toggle })
}

render () {
  const { open } = this.state

  return (
    <Drawer open={open} onRequestClose={this.toggle}>
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
| onClose | Function| invoked on drawer close | false |
| allowClose | Boolean | block closing if allowClose={false}, default is true | false |
| overlayOpacity | Number | 0.6 unless different value is passed in | false |
| scrollToClose | Number | pixel drag to trigger onRequestClose | false |
| modalElementClass | Object | className to be applied to top <modal> element | false |
| containerStyle | Object | styles to be applied to the drawer container | false |

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


### TODO
* Figure out optimal way of handling styling (radium, CSS-Modules, <style jsx>, etc..)
* Make Drawer dismissable in all swipeable directions (decouple from drag down to dismiss)
* Remove need for `refs` (Will fix preact)

## License

MIT © [Jack Hanford](http://jackhanford.com)
