(function() {
  var $ = window.OpenSeadragon;

  if (!$) {
      $ = require('openseadragon');
      if (!$) {
          throw new Error('OpenSeadragon is missing.');
      }
  }
  // ----------
  $.Viewer.prototype.HTMLelements = function(options) {
    if (!this.elementsInstance || options) {
      options = options || {};
      options.viewer = this;
      this.elementsInstance = new $.hElements(options);
    }
    return this.elementsInstance;
  };

  $.hElements = function (options) {
    var self = this;
    this.viewer = options.viewer;

    // elements is an array of objects in the format:
    // {
    //   id: <string>,
    //   element: <HTMLelement>,
    //   rect: <OpenSeadragon.Rect> in imageCoordinates
    // }
    this.elements = [];

    // These handle repositioning the element when interacting with the viewer
    this.viewer.addHandler("open", function() {repositionElements(self.elements)})
    this.viewer.addHandler("animation", function () {repositionElements(self.elements)})
    this.viewer.addHandler("rotate", function() {repositionElements(self.elements)})
  }
    // ----------
  $.hElements.prototype = {
    getElements: function() {
      return this.elements
    },
    getElementById: function(id) {
      return this.elements.find(function(e) {return e.id === id});
    },
    addElement: function(e) {
      if (validateElement(e)) {
        e.element.style.width = "100%"
        e.element.style.height = "100%"
        let wrapperDiv = document.createElement("div");
        wrapperDiv.style.position = "absolute";
        wrapperDiv.appendChild(e.element);
        this.viewer.canvas.appendChild(wrapperDiv);
        this.elements.push({
          ...e,
          element: wrapperDiv,
          rect: new OpenSeadragon.Rect(
            e.x + e.width / 2,
            e.y + e.height / 2,
            e.width,
            e.height
          )
        });
      }
      return this.elements
    },
    addElements: function(es) {
      for (let e of es) {
        this.addElement(e)
      }
      return this.elements
    },
    removeElementById: function(id) {
      const e = this.getElementById(id)
      if (e !== null) {
        this.viewer.canvas.removeChild(e.element);
        this.elements.splice(this.elements.indexOf(e), 1);
      }
      return this.elements
    },
    removeElementsById: function(ids) {
      for (let id of ids) {
        this.removeElementById(id)
      }
      return this.elements
    },
    goToElementLocation: function(id) {
      const e = this.getElementById(id)
      if (e !== null) {
      const vpRect = this.viewer.viewport.imageToViewportRectangle(e.rect)
      // const point = flipCheck(i.position, viewerInfo)
      const vpPos = viewer.viewport.imageToViewportCoordinates(e.rect.x, e.rect.y)
        this.viewer.viewport.fitBoundsWithConstraints(new OpenSeadragon.Rect(
          vpPos.x - vpRect.width / 2,
          vpPos.y - vpRect.height / 2,
          vpRect.width,
          vpRect.height
        ))
      }
    }
  }
})();

// ----------
// Helper functions. Not on proptotype

const validateElement = function(e) {
  const props = ["id", "element", "x", "y", "width", "height"]
  let isValid = true
  let errors = []
  for (prop of props) {
    if (!(prop in e)) {
      isValid = false
      errors.push(prop)
    }
  }
  if (errors.length !== 0) {
    console.log("Missing properties " + errors.join(", ") + ". Element was not added: ", e)
  }
  return isValid
}

const repositionElements = function(es) {
  for (let e of es) {
    repositionElement(e)
  }
}

const repositionElement = function(e) {
  const newRect = viewer.viewport.viewportToViewerElementRectangle(
    viewer.viewport.imageToViewportRectangle(e.rect)
  )
  // const point = flipCheck(i.position, viewerInfo)
  const pos = viewer.viewport.viewportToViewerElementCoordinates(
    viewer.viewport.imageToViewportCoordinates(e.rect.x, e.rect.y)
  )
  e.element.style.left = pos.x - newRect.width / 2 + "px"
  e.element.style.top = pos.y - newRect.height / 2 + "px"
  e.element.style.width = newRect.width + "px"
  e.element.style.height = newRect.height + "px"
}
