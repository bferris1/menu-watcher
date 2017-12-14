import React from 'react';
import {Alert} from 'reactstrap';

export const Alerts = (props) => {

  if (props.alerts === undefined)
    return null;

  return (
    <div className={'alerts'}>
      {props.alerts.success === undefined ||
      <Alert color="success">
        {props.alerts.success}
      </Alert>
      }

      {props.alerts.danger === undefined ||
      <Alert color="danger">
        {props.alerts.danger}
      </Alert>
      }

      {props.alerts.warning === undefined ||
      <Alert color="warning">
        {props.alerts.warning}
      </Alert>
      }

      {props.alerts.info === undefined ||
      <Alert color="info">
        {props.alerts.info}
      </Alert>
      }
    </div>
  );
};

export default Alerts;
