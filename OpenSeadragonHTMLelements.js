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
    //   rect: <OpenSeadragon.rect> (in image coordinates)
    // }
    this.elements = [];

    // These handle repositioning the element when interacting with the viewer
    this.viewer.addHandler("open", function() {self.repositionElement()})
    this.viewer.addHandler("animation", function () {self.repositionElement()})
    this.viewer.addHandler("rotate", function() {self.repositionElement()})
  }
    // ----------
  $.hElements.prototype = {
    // ----------
    validateElement: function(e) {
      let isValid = true
      let errors = []
      if (!("id" in e)) {
        isValid = false
        errors.push("id")
      }
      if (!("element" in e)) {
        isValid = false
        errors.push("element")
      }
      if (!("rect" in e)) {
        isValid = false
        errors.push("rect")
      }
      if (errors.length !== 0) {
        console.log("Missing properties", errors.join(", "), ". Element was not added: ", e)
      }
      return isValid
    },
    getElements: function() {
      return this.elements
    },
    addElement: function(e) {
      if (this.validateElement(e)) {
        let wrapperDiv = document.createElement("div");
        wrapperDiv.style.position = "absolute";
        wrapperDiv.appendChild(e.element);
        this.viewer.canvas.appendChild(wrapperDiv);
        this.elements.push({...e, element: wrapperDiv});
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
      const e = this.elements.find(function(e) {return e.id === id});
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
    repositionElement: function() {
      for (let e of this.elements) {
        const newRect = viewer.viewport.viewportToViewerElementRectangle(
          viewer.viewport.imageToViewportRectangle(e.rect)
        )
        e.element.style.left = newRect.x + "px"
        e.element.style.top = newRect.y + "px"
        e.element.style.width = newRect.width + "px"
        e.element.style.height = newRect.height + "px"
      }
    }
  }
})();
