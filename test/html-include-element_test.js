import '../html-include-element.js';

const assert = chai.assert;

suite('html-include-element', () => {

  let container;

  setup(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  teardown(() => {
    document.body.removeChild(container);
    container = undefined;
  });

  test('includes some HTML', async () => {
    container.innerHTML = `
      <html-include src="./test-1.html"></html-include>
    `;
    const include = container.querySelector('html-include');
    await new Promise((res) => {
      include.addEventListener('load', () => res());
    });
    assert.equal(include.shadowRoot.children[0].tagName, 'STYLE');
    assert.equal(include.shadowRoot.children[1].outerHTML, '<h1>TEST</h1>');
  });

  test('includes some HTML in light DOM', async () => {
    container.innerHTML = `
      <html-include no-shadow src="./test-1.html"></html-include>
    `;
    const include = container.querySelector('html-include');
    await new Promise((res) => {
      include.addEventListener('load', () => res());
    });
    assert.equal(include.innerHTML.trim(), '<h1>TEST</h1>');
  });

  test('preserves light DOM when including to shadow DOM', async () => {
    container.innerHTML = `
      <html-include src="./test-1.html">TEST</html-include>
    `;
    const include = container.querySelector('html-include');
    await new Promise((res) => {
      include.addEventListener('load', () => res());
    });
    assert.equal(include.innerHTML, 'TEST');
  });

  test('waits for styles to load', async () => {
    container.innerHTML = `
      <html-include src="./test-styles.html">TEST</html-include>
    `;
    const include = container.querySelector('html-include');
    console.log('1');
    await new Promise((res) => {
      include.addEventListener('load', () => {
        assert.isNotNull(include.shadowRoot.querySelector('link').sheet);
        res();
      });
    });
  });

  // TODO: tests for mode & changing src attribute

});
