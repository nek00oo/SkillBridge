/**
 * Creates an HTML element with the specified tag, class name, and children.
 *
 * @param {string} [tag='div'] - The HTML tag name to create (e.g., 'div', 'span', 'p').
 * @param {string | string[]} [className] - The CSS class name(s) to add to the element. Defaults to `undefined`.
 * @param {Array<HTMLElement> | string} [content] - An array of child HTML elements or string to append to the created element. Defaults to `undefined`.
 * @returns {HTMLElement} - The newly created HTML element with the specified properties.
 */
export const createHtmlElement = (tag = 'div', className, content) => {
    const element = document.createElement(tag);

    if (className) {
        const classes = Array.isArray(className) ? className : [className];
        element.classList.add(...classes.filter(c => c !== null));
    }

    if (typeof content === 'string') {
        element.textContent = content;
    }

    if (Array.isArray(content)) {
        content.forEach((item) => {
            element.appendChild(item)
        })
    }

    return element;
}