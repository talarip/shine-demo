import React from 'react';
import Graph from 'react-graph-vis';

const Connections = (props) => {
  if (props.loadingGraphData === true) {
    props.getNetworkData();
  }

  const getGraphData = () => props.graphData;
  const options = {
      layout: {
          hierarchical: true
      },
      edges: {
          color: "#000000"
      }
  };

  const events = {
      select: function(event) {
        console.log('graph event fired', event);
          // const { nodes, edges } = event;
      }
  };

  return (
    <div>
      <h4>See Connections</h4>
      {
        props.loadingGraphData ?
          <div>Loading Graph Data...</div>
        :
          <Graph graph={getGraphData()} options={options} events={events} />
      }
    </div>
  );
};

export default Connections;
