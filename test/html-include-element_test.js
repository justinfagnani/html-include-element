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

  // TODO: tests for mode & changing src attribute

});
