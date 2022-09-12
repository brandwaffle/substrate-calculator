import React from 'react';
import ReactDOM from 'react-dom/client';
import {Range} from 'react-range';
import './index.css';

class Water extends React.Component {
  state = {
    values: [50]
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(values) {
    this.setState(values);
    this.props.calculateWaterInfo(values);
  }

  render() {
    return (
      <div className='water'>
        <Range
        step={1}
        min={0}
        max={100}
        values={this.state.values}
        onChange={(values) => this.handleChange({ values })}
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
    var calculated_values = null;
    if ( event.target.className == 'number-of-bags' ) {
      calculated_values = {number_of_bags: event.target.value, batch_size: event.target.value * this.state.bag_size, bag_size: this.state.bag_size};
      this.setState({calculated_values});
    } else {
      calculated_values = {bag_size: event.target.value, batch_size: event.target.value * this.state.number_of_bags, number_of_bags: this.state.number_of_bags};
      this.setState({calculated_values});
    }
    this.props.calculateBatchInfo(calculated_values);
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
        </div>
    );
  }
}

class Supplement extends React.Component {
  state = {
    values: [50]
  };
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(values) {
    this.setState(values);
    this.props.calculateSupplementInfo(values);
  }

  render() {
    return (
      <div className="supplement">
        <input className="supplement" defaultValue={this.props.value} />
        <Range
        step={1}
        min={0}
        max={100}
        values={this.state.values}
        onChange={(values) => this.handleChange({ values })}
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
      sawdust_weight: 50,
      supplement_weights: 50,
      water_weight: 50,
      batch_info: {
        number_of_bags: 1,
        bag_size: 5,
        batch_size: 5
      },
      calculated_weights: Object()
    }
    this.calculateBatchInfo = this.calculateBatchInfo.bind(this);
    this.calculateSupplementInfo = this.calculateSupplementInfo.bind(this);
  }
  
  renderSupplement(value, percentage) {
    return <Supplement 
              value={value} 
              percentage={percentage}
              calculateSupplementInfo={this.calculateSupplementInfo}
    />
  }

  calculateBatchInfo = (newValue) => {
    this.setState({batch_info: newValue});
    console.log(newValue);
  }

  calculateWaterInfo = (newValue) => {
    this.setState({water_weight: newValue.values[0]});
  }

  calculateSupplementInfo = (newValue) => {
    this.setState({supplement_weights: newValue.values[0]});
    this.setState({sawdust_weight: 100 - newValue.values[0]});
  }

  viewState = () => {
    var water_weight, dry_weight, supplement_weight, sawdust_weight;
    water_weight = (this.state.water_weight / 100) * this.state.batch_info.batch_size;
    console.log( 'water weight: ' + water_weight );
    dry_weight = this.state.batch_info.batch_size - water_weight;
    console.log( 'dry weight: ' + dry_weight );
    
    supplement_weight = dry_weight * ( this.state.supplement_weights / 100 );
    console.log( 'supplement weight: ' + supplement_weight);

    sawdust_weight = dry_weight - supplement_weight;
    console.log( 'sawdust weight: ' + sawdust_weight);
    this.setState({calculated_weights: 
      {
        water_weight: water_weight,
        dry_weight: dry_weight,
        supplement_weight: supplement_weight,
        sawdust_weight: sawdust_weight
      }
    })
    console.log(this.state);
  }

  render() {
    return (
      <div className="calculator">
        <h1>Mushroom Substrate Calculator</h1>
        <h2>Dry Ingredients</h2>
        <div className="header">Add supplements (e.g. wheat bran) below:</div>
        <div className="supplements">
          {this.renderSupplement("wheat bran", "25")}
        </div>
        <h2>Wet Ingredients</h2>
        <div className="header">Enter water as a percentage of total batch weight:</div>
        <div className="water"><Water calculateWaterInfo={this.calculateWaterInfo} /></div>
        <h2>Batch info</h2>
        <div className='batch-info'>
          <Batch calculateBatchInfo={this.calculateBatchInfo} />
        </div>
        <button onClick={ this.viewState }>View state</button>
        <div className='results'>
          <output className="sawdust-weight">
            Base substrate (e.g. sawdust): {this.state.sawdust_weight} %
          </output>
          <h2>Water Weight</h2>
          <output>
           {this.state.calculated_weights.water_weight} lbs
          </output>
          <h2>Sawdust Weight</h2>
          <output>
           {this.state.calculated_weights.sawdust_weight} lbs
          </output>
          <h2>Supplement Weight</h2>
          <output>
           {this.state.calculated_weights.supplement_weight} lbs
          </output>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Calculator />);