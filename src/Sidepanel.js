import React from "react"

export class Sidepanel extends React.Component {
    removePc(){
    
        if (document.getElementById('pointcloud').checked===false) {
            console.log('whatever')
            document.getElementById('pointcloud').setAttribute('checked',true)
        }
        else {
            console.log('whatever2')
            document.getElementById('pointcloud').setAttribute('checked',false)
        }
        
        
    }

    render() {
        return (
        <nav id="sidebar">
            <div className='layers'>
                <h1>Layers</h1>
                <label> Point Cloud</label>

                <footer id='footer'>Some text</footer>
            </div>
        </nav>
        );

    }
}