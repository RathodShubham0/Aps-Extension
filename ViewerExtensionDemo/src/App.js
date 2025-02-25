import './App.css';
import React, { useState } from 'react';
import Viewer from './components/Viewer/Viewer';

function App({ token, urn }) {
    const [camera, setCamera] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [wrapper, setWrapper] = useState(null);

    const onInputChange = (ev) => {
        const val = ev.target.value.trim();
        const ids = val.split(',').filter(e => e.length > 0).map(e => parseInt(e)).filter(e => Number.isInteger(e));
        setSelectedIds(ids);
    }

    return (
        <div className="app">
            <div style={{ position: 'relative', width: '800px', height: '600px' }}>
                <Viewer
                    runtime={{ accessToken: token }}
                    urn={urn}
                    selectedIds={selectedIds}
                    onCameraChange={({  camera }) => setCamera(camera.getWorldPosition())}
                    onSelectionChange={({ ids }) => setSelectedIds(ids)}
                    ref={ref => setWrapper(ref)}
                />
            </div>
            <div>
                Camera Position:
                {camera && `${camera.x.toFixed(2)} ${camera.y.toFixed(2)} ${camera.z.toFixed(2)}`}
            </div>
            <div>
                Selected IDs:
                <input type="text" value={selectedIds.join(',')} onChange={onInputChange}></input>
            </div>
            <button onClick={() => wrapper.viewer.autocam.goHome()}>Reset View</button>
        </div>
    );
}

export default App;