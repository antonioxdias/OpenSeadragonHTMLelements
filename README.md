# OpenSeadragonHTMLelements

Plugin to add HTMLelement overlaying capability to [OpenSeadragon]().
This allows for elements to be panned, zoomed, rotated and flipped with the viewer, mantaining their position and size ratio.

Check out a [demo]()

# Usage

After initializing your OpenSeadragon Viewer the plugin is initialized like this:

`````javascript
var hEl = viewer.HTMLelements()
`````

In order to add an element simply call the addElement method by providing a string id, the html element itself (created with document.createElement() or otherwise), and the top-left coordinates and size of the element *in OpenSeadragon imageCoordinates*.

`````javascript
hEl.addElement({
  id: "uuid123",
  element: myElement,
  x: 9500,
  y: 500,
  width: 4000,
  height: 2500,
  (optional)fontSize: 14
})
`````

Optionally, for elements with text, a font size can be provided granting zoom in/out properties to the text. However, this is strongly unadvised, as changing font size on the fly causes a bad case of CSS jitter, seemingly unavoidable. It is advised that any text be converted into an image, for smoother experience.

The following methods are provided, to be called on the HTMLelements object:

`````javascript
getElements()
// returns the array of elements

getElementById(id: <string>)
// returns the element object given its id

addElement(e: <HTMLelement>)
// adds the element to the viewer. if it not all required properties are provided
// it will not be added and a message will be logged in the browsers console

addElements(es: Array<HTMLelement>)
// adds multiple element objects to the viewer.

removeElementById(id: <string>)
// removes element that has the provided id

removeElementsById(ids: Array<string>)
// removes all elements that match the given ids

goToElementLocation(id: <string>)
// fit viewer bounds to match the element
`````
