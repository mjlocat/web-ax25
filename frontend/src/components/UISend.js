import React, { useState, useEffect } from 'react';
import { FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { onError } from '../libs/errorLib';
import { useFormFields } from '../libs/hooksLib';
import './UISend.css';

export default function UISend() {
  const [fields, handleFieldChange, resetFields] = useFormFields({
    from: '',
    to: '',
    via: '',
    data: ''
  });
  const [availableCallsigns, setAvailableCallsigns] = useState([]);

  useEffect(() => {
    onLoad();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function onLoad() {
    try {
      const config = await axios.get('/appconfig');
      resetFields({
        from: config.data.callsign || ''
      });
      const ports = await axios.get('/ports');
      setAvailableCallsigns(ports.data.map(port => port.portCallsign));
    } catch(e) {
      onError(e);
    }

  }

  async function sendMessage() {
    let via = [];
    if (fields.via) {
      via = fields.via.split(' ');
    }
    const packet = {
      from: fields.from,
      to: fields.to,
      data: fields.data,
      via
    };
    try {
      const result = await axios.post('/UIPacket', { packet });
      if (result.data.bytes) {
        handleFieldChange({ target: { id: 'data', value: '' } });
      } else {
        onError(result.data.message);
      }
    } catch (e) {
      onError(e);
    }
  }

  function messageIsValid() {
    return fields.from.length > 0 && fields.to.length > 0 && fields.data.length > 0;
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && messageIsValid()) {
      sendMessage();
    }
  }

  return (
    <div className="UISend">
      <table>
        <tr>
          <td>
            <FormGroup controlId="from">
              <FormLabel>From</FormLabel>
              <FormControl
                value={fields.from}
                onChange={handleFieldChange}
                as="select"
              >
                <option></option>
                {availableCallsigns.map(call => <option>{call}</option>)}
              </FormControl>
            </FormGroup>
          </td>
          <td>
            <FormGroup controlId="to">
              <FormLabel>To</FormLabel>
              <FormControl
                value={fields.to}
                onChange={handleFieldChange}
              />
            </FormGroup>
          </td>
          <td>
            <FormGroup controlId="via">
              <FormLabel>Via (space separated list)</FormLabel>
              <FormControl
                value={fields.via}
                onChange={handleFieldChange}
              />
            </FormGroup>
          </td>
        </tr>
        <tr>
          <td colspan="3">
          <FormGroup controlId="data">
              <FormLabel>Message</FormLabel>
              <FormControl
                value={fields.data}
                onChange={handleFieldChange}
                onKeyDown={handleKeyDown}
              />
            </FormGroup>
          </td>
        </tr>
      </table>
    </div>
  );
}
