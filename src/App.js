import React, { Component } from 'react';
import vis from 'vis';
import 'vis/dist/vis-network.min.css';

import logo from './whappu-logo-transparent-2017.png';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.network = {};
    this.allNodes = {};
    this.highlightActive = false;
    this.upvotes = {};
  }

  componentDidMount() {
    fetch('http://localhost:8080/api/v1/users')
      .then(data => data.json())
      .then((data) => {
        const nodesDataset = new vis.DataSet(data.nodes);
        const edgesDataset = new vis.DataSet(data.upvoteLinks);

        const options = {
          nodes: {
            shape: 'dot',
            scaling: {
              min: 0,
              max: 75,
              label: {
                min: 0,
                max: 50,
                drawThreshold: 10,
                maxVisible: 20
              }
            },
            font: {
              size: 10,
              face: 'Tahoma'
            }
          },
          edges: {
            width: 0.10,
            color: { inherit: 'from' },
            smooth: {
              type: 'continuous'
            }
          },
          physics: false,
          interaction: {
            tooltipDelay: 200,
            hideEdgesOnDrag: true
          }
        };
        const networkData = { nodes: nodesDataset, edges: edgesDataset };

        this.network = new vis.Network(this.container, networkData, options);

          // get a JSON object
        this.allNodes = nodesDataset.get({ returnType: 'Object' });
      });
  }

  render() {
    return (
      <div className="app">
        <div className="header">
          <img className="logo" src={logo} alt="Whappu visualizer" />
        </div>
        <div id="upvotes" ref={(container) => { this.container = container; }} />
      </div>
    );
  }
}

export default App;
