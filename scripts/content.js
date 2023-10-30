console.log('my chrome extension is running!');

function isElementWithinShadowDOM(element) {
  let parent = element.parentElement;

  while (parent) {
    if (parent.shadowRoot) {
      return true; // Element is within a Shadow DOM
    }
    parent = parent.parentElement;
  }

  return false; // Element is not within a Shadow DOM
}

function getParentShadowDOM(element) {
  let parent = element.parentElement;

  while (parent) {
    if (parent.shadowRoot) {
      return parent.shadowRoot; // Element is within a Shadow DOM
    }
    parent = parent.parentElement;
  }

  return; // Element is not within a Shadow DOM
}

function addClassToShadowRoot(shadowRoot) {
  // Define a custom CSS property
  const style = document.createElement('style');
  style.textContent = `
  .custom-border-box {
      
      line-height: 2; /* ?? */
      display: block; /* Show by default */
      content: attr(data-tooltip); /* Use data-tooltip attribute for the text */
      position: absolute;
      /*top: 0; */ /* Adjust top position as needed */
      left: 0; /* Adjust left position as needed */
      width: 100%;
      /* height: 100%; */
      text-align: center; /* Center text horizontally */
      /* background-color: rgba(0, 123, 255, 0.8); */ /* Background color and opacity */
      color: #fff; /* Text color */
      border: 1px solid #007bff;
      box-sizing: border-box;
      border-radius: 4px;
    padding: 5px; /* Adjust padding as needed */
    z-index: 9999; /* Ensure it appears above other elements */
    pointer-events: none;
  }
  `;

  shadowRoot.appendChild(style);
}

// Function to create the border-like box
function createOrUpdateBorderBox(element, text) {

  // element.style.border = '2px solid red'; // Customize the border style as needed
  // if(element.style.border )
  // element.style.boxSizing = 'border-box';

  // The :scope > part of this selector is important to avoid selecting nested elements
  // It causes only direct children to be queried, which is what we want
  if (element.querySelector(':scope > .custom-border-box')) {
    // Already has a child with custom-border-box class
    // Update the text
    element.querySelector(':scope > .custom-border-box').setAttribute('data-tooltip', text);
    return;
  }

  const parentShadow = getParentShadowDOM(element);
  if (parentShadow) {
    // add custom-border-box class to encapsulated styles
    addClassToShadowRoot(parentShadow);
  }

  // If it doesn't exist, create a new one
  const borderBox = document.createElement('div');
  // borderBox.innerText = text;
  borderBox.setAttribute('data-tooltip', text);
  borderBox.classList.add('custom-border-box');
  borderBox.style.width = window.getComputedStyle(element).width;
  borderBox.style.height = window.getComputedStyle(element).height;

  element.appendChild(borderBox);

}


// Recursive function to search for elements within Shadow DOM
function searchShadowDOMRecursively(element, attributeName) {
  element.querySelectorAll(`[${attributeName}]`).forEach((el) => {
    // Add your code to handle the element here
    // el.style.border = '2px solid red'; // Customize the border style as needed
    const text = el.getAttribute(attributeName);
    createOrUpdateBorderBox(el, text);
  });
  // Check if the element has a Shadow Root
  if (element.shadowRoot) {
    // Access the Shadow DOM of the element
    const shadowRoot = element.shadowRoot;

    // Search for elements within the Shadow DOM
    const elementsWithAttribute = shadowRoot.querySelectorAll(`[${attributeName}]`);

    elementsWithAttribute.forEach((el) => {
      // Add your code to handle the element here
      // element.style.border = '2px solid red'; // Customize the border style as needed
      const text = element.getAttribute(attributeName);
      createOrUpdateBorderBox(element, text);
    });

    // Recursively search the children of the shadow dom  element
    shadowRoot.childNodes.forEach((child) => {
      if (child instanceof HTMLElement) {
        searchShadowDOMRecursively(child, attributeName);
      }
    });
  }

  // Recursively search the children of the current element
  element.childNodes.forEach((child) => {
    if (child instanceof HTMLElement) {
      searchShadowDOMRecursively(child, attributeName);
    }
  });
}

// Start the search from the body element
const body = document.body;
setInterval(() => {
  searchShadowDOMRecursively(body, 'data-tutorial-id');
}, 5000);




// // Function to handle changes in the DOM
// function handleMutations(mutationsList) {
//   // console.log('mutation happened!', mutationsList)
//   for (const mutation of mutationsList) {
//     if (mutation.type === 'childList') {
//       // Check added nodes for the specific attribute
//       mutation.addedNodes.forEach((node) => {
//         if (node instanceof HTMLElement && node.hasAttribute('id')) {
//           // This is a new element with the data-id attribute
//           console.log('New element with data-id:', node);
//           // Add your code to highlight or process the new element here
//         }

//         // Search for elements within Shadow DOM
//         searchShadowDOM(node, 'id');
//       });
//     }
//   }
// }

// // Create a MutationObserver
// const observer = new MutationObserver(handleMutations);

// // Options for the observer (watch for changes to the entire subtree and new elements)
// const observerOptions = {
//   childList: true, // Watch for changes to the child nodes
//   subtree: true,   // Watch for changes in the entire subtree
// };

// // Start observing the document
// observer.observe(document, observerOptions);

