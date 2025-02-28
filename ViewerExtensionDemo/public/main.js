class Edit2dExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.selectedShapes = []; // Store selected shapes
  }

  async load() {
    this._edit2D = await this.viewer.loadExtension("Autodesk.Edit2D");  
    this._edit2D.registerDefaultTools();

    const ctx = this._edit2D.defaultContext;
    
    // Listen for selection change
    ctx.selection.addEventListener(
      Autodesk.Edit2D.Selection.Events.SELECTION_CHANGED,
      (event) => {
        this.selectedShapes = event.target.layer.shapes;
        console.log("Selected Shapes Updated:", this.selectedShapes);
      }
    );

    return true;
  }

  unload() {
    this.stopTool();
    if (this._group) {
      this.viewer.toolbar.removeControl(this._group);
    }  
    return true;
  }

  onToolbarCreated() {
    this._group = this.viewer.toolbar.getControl("Edit2dExtensionsToolbar");
    if (!this._group) {
      this._group = new Autodesk.Viewing.UI.ControlGroup("Edit2dExtensionsToolbar");
      this.viewer.toolbar.addControl(this._group);
    }

    this.addButton("PolygonButton", "fas fa-draw-polygon", "Draw Polygon", "polygonTool");
    this.addButton("EditButton", "fas fa-edit", "Edit Polygon", "polygonEditTool");
    this.addButton("MoveButton", "fas fa-arrows-alt", "Move Polygon", "moveTool");
    this.addVerticesButton();
  }

  addButton(id, iconClass, tooltip, toolName) {
    let button = new Autodesk.Viewing.UI.Button(id);
    button.onClick = () => {
      if (button.getState() === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        this.stopTool();
      } else {
        this.startTool(toolName);
        button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
      }
    };
    button.setToolTip(tooltip);
    button.icon.classList.add(...iconClass.split(" "));
    this._group.addControl(button);
  }

  addVerticesButton() {
    let showVerticesButton = new Autodesk.Viewing.UI.Button("ShowVerticesButton");
    showVerticesButton.onClick = () => this.showSelectedVertices();
    showVerticesButton.setToolTip("Show Vertices");
    showVerticesButton.icon.classList.add("fas", "fa-list");
    this._group.addControl(showVerticesButton);
  }

  showSelectedVertices() {
    if (this.selectedShapes.length === 0) {
      console.log("No shape selected.");
      return;
    }
    this.selectedShapes.forEach((shape) => {
      if (shape._loops && shape._loops.length > 0) {
        console.log(`Shape ID: ${shape.id}, Vertices:`, shape._loops[0]);
      } else {
        console.log(`Shape ID: ${shape.id} has no vertex data.`);
      }
    });
  }

  startTool(toolName) {
    this.stopTool();
    let controller = this.viewer.toolController;
    controller.activateTool(this._edit2D.defaultTools[toolName].getName());
  }

  stopTool() {
    for (let button of this._group._controls) {
      button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
    }
    let activeTool = this.viewer.toolController.getActiveTool();
    var isEdit2DTool = activeTool && activeTool.getName().startsWith("Edit2");
    if (isEdit2DTool) {
      activeTool.selection?.clear();
      this.viewer.toolController.deactivateTool(activeTool.getName());
    }
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension("Edit2dExtension", Edit2dExtension);
