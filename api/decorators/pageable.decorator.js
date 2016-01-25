import { mixin } from 'universal-mixin'
@mixin
export function pageable(){
  init() {
    let pageable = { lastId: null, direction: null}
    Object.defineProperty(this, 'pageable', {value: pageable})
  },
  setPageableProps(props) {
    this._pageableProps.push(props)
    return this
  },
  get pageableProps() {
    return this._pageableProps
  }
}