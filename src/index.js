import React from 'react';
import ReactDOM from 'react-dom/client';
import {Range} from 'react-range';
import './index.css';

class Water extends React.Component {
  state = {
    values: [50]
  }
  render() {
    return (
      <div className='water'>
        <Range
        step={1}
        min={0}
        max={100}
        values={this.state.values}
        onChange={(values) => this.setState({ values })}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              width: '120px',
              float: 'right',
              backgroundColor: '#ccc'
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '42px',
              width: '8px',
              backgroundColor: '#999'
            }}
          />
        )}
      />
      <output style={{ marginTop: "30px" }} id="output">
          {this.state.values[0]}%
        </output>
      </div>
    );
  }
}

class Batch extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      number_of_bags: 1,
      bag_size: 5,
      batch_size: 5
    };
  }
  
  handleChange(event) {
    if ( event.target.className == 'number-of-bags' ) {
      this.setState({number_of_bags: event.target.value, batch_size: event.target.value * this.state.bag_size});
    } else {
      this.setState({bag_size: event.target.value, batch_size: event.target.value * this.state.number_of_bags});
    }
  }
  render() {
    return (
        <div className='batch'>
          <label className='number-of-bags'>Number of Bags</label>
          <input type='number' className='number-of-bags' defaultValue={this.state.number_of_bags} onChange={this.handleChange} />
          <label className='bag-size'>Bag Size (lbs)</label>
          <input type='number' className='bag-size' defaultValue={this.state.bag_size} onChange={this.handleChange} />
          <label className='total-batch-size'>Total Batch Size (lbs): </label>
          <output>
            {this.state.batch_size}
          </output>
          <button className='calculate' onClick= {() => this.props.calculateBatchInfo(this.state)}>
          Calculate Results
        </button>
        </div>
    );
  }
}

class Supplement extends React.Component {
  state = {
    values: [50]
  };
  
  render() {
    return (
      <div className="supplement">
        <input className="supplement" defaultValue={this.props.value} />
        <Range
        step={1}
        min={0}
        max={100}
        values={this.state.values}
        onChange={(values) => this.setState({ values })}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              width: '120px',
              float: 'right',
              backgroundColor: '#ccc'
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '42px',
              width: '8px',
              backgroundColor: '#999'
            }}
          />
        )}
      />
      <output style={{ marginTop: "30px" }} id="output">
          {this.state.values[0]}%
        </output>
      </div>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      sawdust_weight: null,
      supplement_weight: null,
      water_weight: null
    }
    this.calculateBatchInfo = this.calculateBatchInfo.bind(this);
  }
  
  renderSupplement(value, percentage) {
    return <Supplement value={value} percentage={percentage} />
  }

  calculateBatchInfo = (values) => {
    console.log(values);
  }

  render() {
    return (
      <div className="calculator" onChange={this.calculateBatchInfo}>
        <h1>Mushroom Substrate Calculator</h1>
        <h2>Dry Ingredients</h2>
        <div className="header">Add supplements (e.g. wheat bran) below:</div>
        <div className="supplements">
          {this.renderSupplement("wheat bran", "25")}
        </div>
        <h2>Wet Ingredients</h2>
        <div className="header">Enter water as a percentage of total batch weight:</div>
        <div className="water"><Water /></div>
        <h2>Batch info</h2>
        <div className='batch-info'>
          <Batch calculateBatchInfo={this.calculateBatchInfo} />
        </div>
        <div className='results'>

        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Calculator />);