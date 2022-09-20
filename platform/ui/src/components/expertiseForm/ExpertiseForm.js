import './ExpertiseForm.styl';

import React, { Component } from 'react';
import { withTranslation } from '../../contextProviders';

import { Icon } from '../../elements/Icon';
import PropTypes from 'prop-types';
import { Select } from '../../elements/form/Select.js';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class ExpertiseForm extends Component {
  static propTypes = {
    measurementCollection: PropTypes.array.isRequired,
    timepoints: PropTypes.array.isRequired,
    templateExpertise: PropTypes.array.isRequired,
    overallWarnings: PropTypes.object.isRequired,
    readOnly: PropTypes.bool,
    onItemClick: PropTypes.func,
    onRelabelClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onEditDescriptionClick: PropTypes.func,
    selectedMeasurementNumber: PropTypes.number,
    t: PropTypes.func,
    saveFunction: PropTypes.func,
    saveAsFunction: PropTypes.func,
    onSaveComplete: PropTypes.func,
  };

  static defaultProps = {
    overallWarnings: {
      warningList: [],
    },
    readOnly: false,
  };

  state = {
    selectedKey: null,
    loading: true,
    options: [],
    templateData: {
      desciption: '',
    },
    templateExpertise: [],
  };

  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    fetch(
      `http://127.0.0.1:8000/api/v1/template-expertise/read?code_doctor=${queryParams.get(
        'code_doctor'
      )}`
    )
      .then(res => res.json())
      .then(json => {
        this.setState({
          templateExpertise: json.data,
        });
      });
  }

  render() {
    const { overallWarnings, saveFunction, saveAsFunction, t } = this.props;
    const { templateExpertise } = this.state;
    console.log(this.props);
    // const hasOverallWarnings = overallWarnings.warningList.length > 0;

    const wrapperStyle = {
      padding: '12px',
    };
    const bodyForm = {
      minHeight: '300px',
    };

    const editorConfiguration = {
      toolbar: ['bold', 'italic', 'maximize'],
    };

    return (
      <div className="measurementTable">
        <div style={wrapperStyle}>
          <Select
            label={'Template Expertise :'}
            options={templateExpertise}
          ></Select>

          <CKEditor
            editor={ClassicEditor}
            data="<p>Hello from CKEditor 5!</p>"
            onReady={editor => {
              // You can store the "editor" and use when it is needed.
              console.log('Editor is ready to use!', editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              console.log({ event, editor, data });
            }}
            onBlur={(event, editor) => {
              console.log('Blur.', editor);
            }}
            onFocus={(event, editor) => {
              console.log('Focus.', editor);
            }}
          />
        </div>
        <div className="measurementTableFooter">
          <button
            onClick={this.saveFunction}
            className="saveBtn"
            data-cy="save-measurements-btn"
          >
            <Icon name="save" width="14px" height="14px" />
            Save
          </button>

          <button
            onClick={this.saveTemplate}
            className="saveAsBtn"
            data-cy="save-measurements-btn"
          >
            <Icon name="save" width="14px" height="14px" />
            Save As Template
          </button>
        </div>
      </div>
    );
  }

  saveTemplate = async event => {
    const { saveAsFunction, onSaveComplete } = this.props;
    try {
      const result = await saveAsFunction();
      console.log(result);
    } catch (error) {
      if (onSaveComplete) {
        onSaveComplete({
          title: 'STOW SR',
          message: error.message,
          type: 'error',
        });
      }
    }
  };

  saveFunction = async event => {
    console.log(this.props);
    const { saveFunction, onSaveComplete } = this.props;
    if (saveFunction) {
      try {
        const result = await saveFunction();
        if (onSaveComplete) {
          onSaveComplete({
            title: 'STOW SR',
            message: result.message,
            type: 'success',
          });
        }
      } catch (error) {
        if (onSaveComplete) {
          onSaveComplete({
            title: 'STOW SR',
            message: error.message,
            type: 'error',
          });
        }
      }
    }
  };

  onItemClick = (event, measurementData) => {
    if (this.props.readOnly) return;

    this.setState({
      selectedKey: measurementData.measurementNumber,
    });

    if (this.props.onItemClick) {
      this.props.onItemClick(event, measurementData);
    }
  };

  getActionButton = (btnLabel, onClickCallback) => {
    return (
      <button key={btnLabel} className="btnAction" onClick={onClickCallback}>
        <span style={{ marginRight: '4px' }}>
          <Icon name="edit" width="14px" height="14px" />
        </span>
        {this.props.t(btnLabel)}
      </button>
    );
  };
}

const connectedComponent = withTranslation(['MeasurementTable', 'Common'])(
  ExpertiseForm
);
export { connectedComponent as ExpertiseForm };
export default connectedComponent;
