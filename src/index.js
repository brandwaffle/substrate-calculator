import React from 'react';
import ReactDOM from 'react-dom/client';
import {Range} from 'react-range';
import './index.css';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import MuiInput from '@mui/material/Input';
import ScaleIcon from '@mui/icons-material/Scale';
import OpacityIcon from '@mui/icons-material/Opacity';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ForestIcon from '@mui/icons-material/Forest';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const Input = styled(MuiInput)`
  width: 42px;
`;

const p1 = {padding: 10, margin: 5, width: 300, height: 150, backgroundColor: '#9933CC' }

const cardStyle = {
  height: '121px',
  backgroundColor: 'lightblue',
  padding: '1em',
  verticalAlign: 'middle'
}

export default function InputSlider({parentCallback, iconType}) {
  const [value, setValue] = React.useState(50);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    parentCallback(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <Box sx={{ width: 300 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          {iconType}
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

class Water extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(values) {
    this.props.calculateWaterInfo(values);
  }

  render() {
    return (
      <div className='water'>
        <Typography variant="subtitle2" id="input-slider" gutterBottom>
          Enter water as a percentage of total batch weight:
        </Typography>
        <InputSlider parentCallback={this.handleChange} iconType=<OpacityIcon /> />
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
  
  handleChange(field, event) {
    this.props.calculateBatchInfo(field, event);
  }

  render() {
    return (
        <div className='batch'>
          <TextField label="Number of Bags" variant="outlined" type='number' className='number-of-bags' defaultValue={10} onChange={(e) => this.handleChange("number-of-bags", e)} />
          <TextField label="Bag Size (lbs)" variant="outlined" type='number' className='bag-size' defaultValue={5} onChange={(e) => this.handleChange("bag-size", e)} />
          <ScaleIcon fontSize="large" style={{
              height: '50px'
            }} />
        </div>
    );
  }
}

class Supplement extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(values) {
    this.props.calculateSupplementInfo(values);
  }

  render() {
    return (
      <div className='supplement'>
        <Typography variant="subtitle2" id="input-slider" gutterBottom>
          Select supplement (e.g. wheat bran) percentage below:
        </Typography>
        <InputSlider parentCallback={this.handleChange} iconType=<LocalPharmacyIcon /> />
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
        number_of_bags: 10,
        bag_size: 5,
        batch_size: 50
      },
      calculated_weights: {
        water_weight: 25,
        dry_weight: 25,
        supplement_weight: 12,
        sawdust_weight: 13
      }
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

  calculateBatchInfo = (field, event) => {
    var calculated_values = null;

    if ( field == 'number-of-bags' ) {
      calculated_values = {number_of_bags: event.target.value, batch_size: event.target.value * this.state.batch_info.bag_size, bag_size: this.state.batch_info.bag_size};
    } else {
      calculated_values = {bag_size: event.target.value, batch_size: event.target.value * this.state.batch_info.number_of_bags, number_of_bags: this.state.batch_info.number_of_bags};
    }

    this.setState({batch_info: calculated_values});
    this.calculateState(calculated_values);
  }

  calculateWaterInfo = (newValue) => {
    this.setState({water_weight: newValue});
    this.calculateState();
 }

  calculateSupplementInfo = (newValue) => {
    this.setState({supplement_weights: newValue});
    this.setState({sawdust_weight: 100 - newValue});
    this.calculateState();
  }

  calculateState = (batch_info = this.state.batch_info ) => {
    var water_weight, dry_weight, supplement_weight, sawdust_weight;
    water_weight = (this.state.water_weight / 100) * batch_info.batch_size;
    console.log( 'water weight: ' + water_weight );
    dry_weight = batch_info.batch_size - water_weight;
    console.log( 'dry weight: ' + dry_weight );
    
    supplement_weight = dry_weight * ( this.state.supplement_weights / 100 );
    console.log( 'supplement weight: ' + supplement_weight);

    sawdust_weight = dry_weight - supplement_weight;
    console.log( 'sawdust weight: ' + sawdust_weight);
    this.setState({calculated_weights: 
      {
        water_weight: water_weight.toFixed(0),
        dry_weight: dry_weight.toFixed(0),
        supplement_weight: supplement_weight.toFixed(0),
        sawdust_weight: sawdust_weight.toFixed(0)
      }
    })
    console.log(this.state);
  }

  render() {
    return (
      <Container maxWidth={"800"} className="calculator">
        <Typography align="center" variant="h1">Mushroom Batch Calculator</Typography>
        <Grid container>
          <Grid item xs={6}>
            <Divider><Typography variant="h2">Inputs</Typography></Divider>

            <Grid container spacing={4} justifyContent="center" columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item p={2}>
                <Card style={cardStyle}>
                  <Typography variant="h6">Dry Ingredients</Typography>
                  <div className="supplements">
                    {this.renderSupplement("wheat bran", "25")}
                  </div>
                  <Grid container spacing={2}>
                    <Grid item>
                      <ForestIcon />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle2" id="base-substrate" gutterBottom>
                        Base substrate (e.g. sawdust): {this.state.sawdust_weight} %
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item p={2}>
                <Card style={cardStyle} >
                  <Typography variant="h6">Wet Ingredients</Typography>
                  <div className="water"><Water calculateWaterInfo={this.calculateWaterInfo} /></div>
                </Card>
              </Grid>
              <Grid item p={2}>
                <Card style={cardStyle} >
                  <Typography variant="h6">Batch Info</Typography>
                  <div className='batch-info'>
                    <Batch calculateBatchInfo={this.calculateBatchInfo} />
                  </div>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Divider><Typography variant="h2">Results</Typography></Divider>

            <div className='results'>
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>
                  <Paper style={p1} elevation={3}>
                    <Typography variant="h6" component="h4" style={{ color: 'white' }}>
                      Total Weight
                    </Typography>
                    <Typography variant={"h" + (this.state.batch_info.batch_size.toString().length > 3 ? "2" : "1")} component={"h" + (this.state.batch_info.batch_size.toString().length > 3 ? "2" : "1")} style={{ color: 'white' }}>{this.state.batch_info.batch_size + " lbs"}</Typography>
                  </Paper>
                  <Paper style={p1} elevation={3}>
                    <Typography variant="h6" component="h4" style={{ color: 'white' }}>
                      Water Weight
                    </Typography>
                    <Typography variant={"h" + (this.state.calculated_weights.water_weight.toString().length > 3 ? "2" : "1")} component={"h" + (this.state.calculated_weights.water_weight.toString().length > 3 ? "2" : "1")} style={{ color: 'white' }}>{this.state.calculated_weights.water_weight + " lbs"}</Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper style={p1} elevation={3}>
                    <Typography variant="h6" component="h4" style={{ color: 'white' }}>
                      Sawdust Weight
                    </Typography>
                    <Typography variant={"h" + (this.state.calculated_weights.sawdust_weight.toString().length > 3 ? "2" : "1")} component={"h" + (this.state.calculated_weights.sawdust_weight.toString().length > 3 ? "2" : "1")} style={{ color: 'white' }}>{this.state.calculated_weights.sawdust_weight + " lbs"}</Typography>
                  </Paper>
                  <Paper style={p1} elevation={3}>
                    <Typography variant="h6" component="h4" style={{ color: 'white' }}>
                      Supplement Weight
                    </Typography>
                    <Typography variant={"h" + (this.state.calculated_weights.supplement_weight.toString().length > 3 ? "2" : "1")} component={"h" + (this.state.calculated_weights.supplement_weight.toString().length > 3 ? "2" : "1")} style={{ color: 'white' }}>{this.state.calculated_weights.supplement_weight + " lbs"}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Calculator />);