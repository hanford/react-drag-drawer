~~
Still in progress
~~

## react-drag-drawer

> Mobile draggable drawer that falls back to modals on desktop

<br />

[Live demo!](https://build-cfiogihwcb.now.sh)

## Install

```
$ yarn add react-drag-drawer
```


## Usage

```js
import Drawer from 'react-drag-drawer'

..

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
| overlayOpacity | Number | 0.6 unless different value is passed in | false |
| negativeScroll | Number | -195px amount of negative scroll to allow | false |
| scrollToClose | Number | pixel drag to trigger onRequestClose | false |

## License

MIT © [Jack Hanford](http://jackhanford.com)


### TODO
* Figure out how to handle styling (radium, CSS-Modules, <style jsx>, etc..)
* Publish package to npm
