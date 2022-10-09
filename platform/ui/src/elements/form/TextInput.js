import React from 'react';
import PropTypes from 'prop-types';

import './TextInput.css';

class TextInput extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    value: '',
    id: `TextInput-${new Date().toTimeString()}`,
    label: undefined,
    type: 'text',
  };

  render() {
    var classText = 'form-control input-ohif ';
    if (this.props.disabled) {
      classText += 'disabled-text';
    }

    return (
      <div className="input-ohif-container">
        {this.props.label && (
          <label className="input-ohif-label" htmlFor={this.props.id}>
            {this.props.label}
          </label>
        )}
        <input
          type={this.props.type}
          id={this.props.id}
          disabled={this.props.disabled}
          className={classText}
          {...this.props}
        />
      </div>
    );
  }
}

export { TextInput };
