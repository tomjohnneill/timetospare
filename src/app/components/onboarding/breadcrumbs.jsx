import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import MediaQuery from 'react-responsive'

export default class Breadcrumbs extends React.Component {
  render() {
    return (
      <div style={{width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#FFF'}}>
        <MediaQuery minDeviceWidth={700}>
          <div style={{maxWidth: 600, width: '100%'}}>
            <Stepper activeStep={this.props.stepIndex}>
            <Step>
              <StepLabel>Add details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Import volunteers</StepLabel>
            </Step>
            <Step>
              <StepLabel>Create projects</StepLabel>
            </Step>
          </Stepper>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{maxWidth: 600, width: '100%'}}>
            <Stepper activeStep={this.props.stepIndex}>
            <Step>
              <StepLabel></StepLabel>
            </Step>
            <Step>
              <StepLabel></StepLabel>
            </Step>
            <Step>
              <StepLabel></StepLabel>
            </Step>
          </Stepper>
          </div>
        </MediaQuery>

      </div>

    )
  }
}
