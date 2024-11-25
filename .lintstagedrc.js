/**
 * @link https://www.npmjs.com/package/lint-staged
 */
module.exports = {
  '*.{js,ts,d.ts,tsx}': ['eslint --fix'],
  '*.{css,less,styl,scss,sass}': ['prettier --write', 'stylelint --fix'],
  '*.{json,html,md}': 'prettier --write'
}
