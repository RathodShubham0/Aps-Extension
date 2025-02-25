import React from 'react';
import PropTypes from 'prop-types';

const { Autodesk } = window;
const runtime = {
    /** @type {Autodesk.Viewing.InitializerOptions} */
    options: null,
    /** @type {Promise<void>} */
    ready: null
};

/**
 * Initialize the viewer runtime with the given options.
 * 
 * @param {Autodesk.Viewing.InitializerOptions} options - The options to initialize the viewer runtime with.
 * @returns {Promise<void>} A promise that resolves when the viewer runtime is initialized.
 */
function initializeViewerRuntime(options) {
    if (!runtime.ready) {
        runtime.options = { ...options };
        runtime.ready = new Promise((resolve) => Autodesk.Viewing.Initializer(runtime.options, resolve));
    } else {
        if (['accessToken', 'getAccessToken', 'env', 'api', 'language'].some(prop => options[prop] !== runtime.options[prop])) {
            return Promise.reject('Cannot initialize another viewer runtime with different settings.');
        }
    }
    return runtime.ready;
}

/**
 * A React component that renders a 3D viewer.
 */
class Viewer extends React.Component {
    /**
     * Create a new instance of the Viewer component.
     * 
     * @param {object} props - The properties of the component.
     */
    constructor(props) {
        super(props);
        /**
         * The container element for the viewer.
         * 
         * @type {HTMLDivElement}
         */
        this.container = null;
        /**
         * The 3D viewer instance.
         * 
         * @type {Autodesk.Viewing.GuiViewer3D}
         */
        this.viewer = null;
    }

    /**
     * Called when the component is mounted.
     */
    componentDidMount() {
        initializeViewerRuntime(this.props.runtime || {})
            .then(() => {
                this.viewer = new Autodesk.Viewing.GuiViewer3D(this.container);
                this.viewer.start();
                
                 this.viewer.loadExtension('Edit2dExtension');
 
                this.updateViewerState({});
            })
            .catch(err => console.error(err));
    }

    /**
     * Called when the component is unmounted.
     */
    componentWillUnmount() {
        if (this.viewer) {
 
            this.viewer.finish();
            this.viewer = null;
        }
    }

    /**
     * Called when the component's props change.
     * 
     * @param {object} prevProps - The previous props of the component.
     */
    componentDidUpdate(prevProps) {
        if (this.viewer) {
            this.updateViewerState(prevProps);
        }
    }

    /**
 
    /**
     * Update the viewer's state.
     * 
     * @param {object} prevProps - The previous props of the component.
     */
    updateViewerState(prevProps) {
        if (this.props.urn && this.props.urn !== prevProps.urn) {
            Autodesk.Viewing.Document.load(
                'urn:' + this.props.urn,
                (doc) => this.viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()),
                (code, message, errors) => console.error(code, message, errors)
            );
        } else if (!this.props.urn && this.viewer.model) {
            this.viewer.unloadModel(this.viewer.model);
        }

        const selectedIds = this.viewer.getSelection();
        if (JSON.stringify(this.props.selectedIds || []) !== JSON.stringify(selectedIds)) {
            this.viewer.select(this.props.selectedIds);
        }
    }
 

    /**
     * Render the component.
     * 
     * @returns {JSX.Element} The JSX element to render.
     */
    render() {
        return <div ref={ref => this.container = ref}></div>;
    }
}

/**
 * The prop types of the Viewer component.
 */
Viewer.propTypes = {
    runtime: PropTypes.object,
    urn: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.number),
    onCameraChange: PropTypes.func,
    onSelectionChange: PropTypes.func
};

export default Viewer;
