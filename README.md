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

## License

MIT © [Jack Hanford](http://jackhanford.com)


### TODO
* Figure out how to handle styling (radium, CSS-Modules, <style jsx>, etc..)
* Publish package to npm
* Publish example (page, gif)
