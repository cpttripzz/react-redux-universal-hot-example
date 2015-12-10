export function pick(o, ...fields) {
  return Object.assign({}, ...(for (p of fields) {[p]: o[p]}) )
}