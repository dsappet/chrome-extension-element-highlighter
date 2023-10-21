console.log('my chrome extension is running!');

// Function to create the border-like box
function createOrUpdateBorderBox(element, text) {
  // Check if the element already has a border box
  const existingBorderBox = element.querySelector('.custom-border-box');
  
  if (existingBorderBox) {
    // If it exists, update its content
    existingBorderBox.innerHTML = text;
  } else {
    // If it doesn't exist, create a new one
    const borderBox = document.createElement('div');
    element.setAttribute('data-tooltip', text);
    borderBox.classList.add('custom-border-box');
    // borderBox.innerHTML = text;

    // Append the border-box to the element
    element.appendChild(borderBox);
  }
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

