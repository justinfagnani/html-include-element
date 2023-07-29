// Prettier config to reduce merge conflicts: https://gist.github.com/devinrhode2/08c84e175c61b282b76f4766a94e4a01

/** @type {import('prettier').Options} */
const conf = {
  endOfLine: 'lf',
  singleQuote: true,
  semi: false,

  // avoid even more merge conflicts: https://prettier.io/blog/2020/03/21/2.0.0.html#change-default-value-for-trailingcomma-to-es5-6963httpsgithubcomprettierprettierpull6963-by-fiskerhttpsgithubcomfisker
  trailingComma: 'all',
  printWidth: 65,
  // Less code per line means:
  //  - less likely to have conflict on any given line
  //  - easier to spot changes in git (e.g. getListThing->getListsThing)
  //  - Encourages modularity
  //    - jsx components with 20 indent levels will not look good
  //    - This encourages creating smaller components
  //    - Still can opt-out with `// prettier-ignore` comments above component
  //    - OR, create a `.prettierrc.js` file in code you edit the most
  // - This exact number will always be somewhat arbitrary, it's not set in stone.
}

module.exports = conf
