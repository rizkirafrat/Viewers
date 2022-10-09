import './ExpertiseForm.styl';

import React, { Component } from 'react';
import { withTranslation } from '../../contextProviders';

import { Icon } from '../../elements/Icon';
import PropTypes from 'prop-types';
import { Select } from '../../elements/form/Select.js';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TextInput } from '@ohif/ui';

class ExpertiseForm extends Component {
  static propTypes = {
    measurementCollection: PropTypes.array.isRequired,
    timepoints: PropTypes.array.isRequired,
    templateExpertise: PropTypes.array.isRequired,
    overallWarnings: PropTypes.object.isRequired,
    readOnly: PropTypes.bool,
    onSaveExpertise: PropTypes.func,
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
    is_new: true,
    loading: true,
    options: [],
    templateData: {
      desciption: '',
    },
    templateExpertise: [
      {
        key: 'Pilih Template',
        value: '',
      },
    ],
    expertise: {
      content: '',
    },
    accession_number: '',
    uuid_modality: '',
    modeChecked: false,
    template_name: '',
    disabled_text: false,
    selectedTemplate: '',
  };
  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const uuid = window.location.pathname.split('/')[2];
    this.setState({
      accession_number: queryParams.get('accession_number'),
      uuid_modality: uuid,
    });
    fetch(
      `http://10.100.1.41/apipacs/v1/template-expertise/read?code_doctor=${queryParams.get(
        'code_doctor'
      )}&kd_tindakan=${queryParams.get('kode_tindakan')}`
    )
      .then(res => res.json())
      .then(json => {
        if (json.meta.code != 400) {
          let templates = json.data;
          var templateTmp = [
            {
              key: 'Pilih Template',
              value: '',
            },
          ];
          templates.forEach(element => {
            if (element.name) {
              templateTmp.push({
                key: element.name,
                value: element.id,
                content: element.content,
                kd_tndakan: element.kd_tndakan,
              });
            }
          });
          this.setState({
            templateExpertise: templateTmp,
          });
        }
      });

    fetch(
      `http://10.100.1.41/apipacs/v1/expertise/read?accession_number=${queryParams.get(
        'accession_number'
      )}`
    )
      .then(res => res.json())
      .then(json => {
        if (json.meta.code != 400) {
          this.setState({
            expertise: json.data[0],
            is_new: false,
          });
        } else {
          this.setState({
            expertise: {
              content: '',
            },
          });
        }
      });
  }

  render() {
    const {
      templateExpertise,
      expertise,
      modeChecked,
      template_name,
      disabledText,
      selectedTemplate,
    } = this.state;
    // const hasOverallWarnings = overallWarnings.warningList.length > 0;

    const wrapperStyle = {
      padding: '12px',
      paddingBottom: '0',
    };

    return (
      <div className="measurementTable">
        <div style={wrapperStyle}>
          <Select
            label={'Template Expertise :'}
            options={templateExpertise}
            value={selectedTemplate}
            onChange={this.onChangeSelected}
          ></Select>

          <CKEditor
            editor={ClassicEditor}
            data={expertise.content}
            onChange={(event, editor) => {
              const dataEditor = editor.getData();
              var data = expertise;
              data.content = dataEditor;
              this.setState({
                expertise: data,
              });
            }}
          />
          <div className="controller" style={{ marginTop: '12px' }}>
            <div className="show-annotations">
              <label htmlFor="show-annotations" className="form-check-label">
                <input
                  id="show-annotations"
                  data-cy="show-annotations"
                  type="checkbox"
                  className="form-check-input"
                  checked={modeChecked}
                  onChange={this.onChangeCheckbox}
                />
                <span style={{ color: 'white' }}>Save As Template</span>
              </label>
            </div>

            <div className="file-name">
              <TextInput
                disabled={disabledText}
                type="text"
                data-cy="file-name"
                value={template_name}
                onChange={this.onChangeFileTemplate}
                label={'Template Name'}
                id="file-name"
              />
            </div>
          </div>
        </div>
        <div className="measurementTableFooter">
          <button
            onClick={this.onSaveExpertise}
            className="saveBtn"
            data-cy="save-measurements-btn"
          >
            <Icon name="save" width="14px" height="14px" />
            Save
          </button>
        </div>
      </div>
    );
  }

  onChangeCheckbox = event => {
    this.setState({
      modeChecked: event.target.checked,
      disabled_text: event.target.checked,
    });
    // const { expertise, accession_number, uuid_modality } = this.state;
    // if (this.props.onSaveExpertise) {
    //   this.props.onSaveExpertise(event, {
    //     expertise: expertise,
    //     accession_number: accession_number,
    //     uuid_modality: uuid_modality,
    //   });
    // }
  };

  onChangeSelected = event => {
    const { templateExpertise, expertise } = this.state;
    this.setState({
      selectedTemplate: event.target.value,
    });

    var key = event.target.value;

    templateExpertise.forEach(element => {
      if (element.value == key) {
        var data = expertise;
        data.content = element.content;
        this.setState({
          expertise: data,
        });
      }
    });
  };

  onChangeFileTemplate = event => {
    this.setState({
      template_name: event.target.value,
    });
    // const { expertise, accession_number, uuid_modality } = this.state;
    // if (this.props.onSaveExpertise) {
    //   this.props.onSaveExpertise(event, {
    //     expertise: expertise,
    //     accession_number: accession_number,
    //     uuid_modality: uuid_modality,
    //   });
    // }
  };

  onSaveExpertise = event => {
    const {
      expertise,
      accession_number,
      uuid_modality,
      modeChecked,
      template_name,
      is_new,
    } = this.state;

    const queryParams = new URLSearchParams(window.location.search);

    if (this.props.onSaveExpertise) {
      this.props.onSaveExpertise(event, {
        is_new: is_new,
        expertise: expertise,
        kd_tindakan: queryParams.get('kode_tindakan'),
        code_doctor: queryParams.get('code_doctor'),
        accession_number: accession_number,
        uuid_modality: uuid_modality,
        is_template: modeChecked,
        template_name: template_name,
      });
    }
  };

  saveFunction = async event => {
    const { saveFunction, onSaveComplete } = this.props;
    const { expertise } = this.state;
    if (saveFunction) {
      try {
        const result = await saveFunction(expertise);
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
