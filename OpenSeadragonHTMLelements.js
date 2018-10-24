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
    //   rect: <OpenSeadragon.Rect> (in image coordinates)
    //   (optional) anchor: "center"(default) || "origin"
    // }
    this.elements = [];

    // These handle repositioning the element when interacting with the viewer
    this.viewer.addHandler("open", function() {repositionElements(self.elements)})
    this.viewer.addHandler("animation", function () {repositionElements(self.elements)})
    this.viewer.addHandler("rotate", function() {repositionElements(self.elements)})
    this.viewer.addHandler("", function(ev) {console.log(ev)})
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
        const pos = viewer.viewport.imageToViewportCoordinates(e.rect.x, e.rect.y)
        if (e.anchor === "center") {
          this.viewer.viewport.fitBoundsWithConstraints(new OpenSeadragon.Rect(
            pos.x - vpRect.width / 2,
            pos.y - vpRect.height / 2,
            vpRect.width,
            vpRect.height
          ))

        } else if (e.anchor === "origin") {
          // this.viewer.viewport.fitBoundsWithConstraints(vpRect)
          // this.viewer.viewport.panTo(new OpenSeadragon.Point(
          //   pos.x + vpRect.width / 2,
          //   pos.y + vpRect.height / 2
          // ))
          // const point = flipCheck(i.position, viewerInfo)
          // this.viewer.viewport.fitBoundsWithConstraints(new OpenSeadragon.Rect(
          //   pos.x,
          //   pos.y,
          //   vpRect.width,
          //   vpRect.height
          // ))
          this.viewer.viewport.fitBoundsWithConstraints(new OpenSeadragon.Rect(
            pos.x - vpRect.width,
            pos.y - vpRect.height,
            vpRect.width,
            vpRect.height
          ))
        }
      }
    }
  }
})();

// ----------
// Helper functions. Not on proptotype

const validateElement = function(e) {
  let isValid = true
  if (!("anchor" in e)) {
    e.anchor = "center"
  }

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
  } else if (!e.anchor.match("center|origin")) {
    console.log("Wrong anchor value. Use 'center' or 'origin'. Element was not added: ", e)
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
  if (e.anchor === "center") {
    e.element.style.left = pos.x - newRect.width / 2 + "px"
    e.element.style.top = pos.y - newRect.height / 2 + "px"
  } else if (e.anchor === "origin") {
    e.element.style.left = pos.x + "px"
    e.element.style.top = pos.y + "px"
  }
  e.element.style.width = newRect.width + "px"
  e.element.style.height = newRect.height + "px"
}
