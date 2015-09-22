import React from 'react';
import Configs from '../constants/Configs';
import GlossaryStore from '../stores/GlossaryStore';
import { PureRenderMixin } from 'react/addons';
import Actions from '../actions/GlossaryActions';
import { Button, Input, Icons, Icon, Select, Modal } from 'zanata-ui'
import DataTable from './glossary/DataTable'
import TextInput from './glossary/TextInput'
import { Loader } from 'zanata-ui'
import _ from 'lodash';
import StringUtils from '../utils/StringUtils'

var SystemGlossary = React.createClass({
  mixins: [PureRenderMixin],

  _init: function() {
    return GlossaryStore.init();
  },

  getInitialState: function() {
    var state = this._init();
    state['selectedUploadFileTransLocale'] = null;
    return state;
  },

  componentDidMount: function() {
    GlossaryStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    GlossaryStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(this._init());
  },

  _handleTransChange: function(localeId) {
    Actions.changeTransLocale(localeId)
  },

  _handleFilterKeyUp: function(input, event) {
    if(event.key == 'Enter') {
      Actions.updateFilter(input.state.value);
    }
  },

  _handleUploadFileTransChange: function (localeId) {
    this.setState({selectedUploadFileTransLocale : localeId});
  },

  _handleFile: function(e) {
    var self = this, reader = new FileReader();
    var file = e.target.files[0];

    reader.onload = function(upload) {
      self.setState({
        uploadFile: {
          uri: upload.target.result,
          file:file
        }
      });
    };
    reader.readAsDataURL(file);
  },

  _uploadFile: function() {
    Actions.uploadFile(this.state.uploadFile,
      this.state.srcLocale.locale.localeId,
      this.state.selectedUploadFileTransLocale);
  },

  _handleSubmit: function(e) {
    e.preventDefault();
  },

  _closeUploadModal : function () {
    this.setState({ showModal: false, uploadFile: null });
  },

  _openUploadModal : function() {
    this.setState({ showModal: true })
  },

  _getUploadFileExtension: function () {
    var extension = '';
    if(this.state.uploadFile) {
      extension = this.state.uploadFile.file.name.split(".").pop();
    }
    return extension;
  },

  _isSupportedFile: function (extension) {
    return extension === 'po' || extension === 'csv';
  },

  render: function() {
    var count = 0,
      selectedTransLocale = this.state.selectedTransLocale;

    var contents = (<DataTable
      glossaryData={this.state.glossary}
      glossaryResId={this.state.glossaryResId}
      focusedRow={this.state.focusedRow}
      hoveredRow={this.state.hoveredRow}
      totalCount={this.state.glossaryResId.length}
      canAddNewEntry={this.state.canAddNewEntry}
      canUpdateEntry={this.state.canUpdateEntry}
      user={Configs.user}
      sort={this.state.sort}
      srcLocale={this.state.srcLocale}
      selectedTransLocale={selectedTransLocale}/>);

    if(!_.isUndefined(this.props.srcLocale) && !_.isNull(this.props.srcLocale)) {
      count = this.state.srcLocale.numberOfTerms;
    }

    var uploadSection = "";
    if(this.state.canAddNewEntry
      && !_.isUndefined(this.state.srcLocale) && !_.isNull(this.state.srcLocale)) {

      var transLanguageDropdown = null,
        fileExtension = this._getUploadFileExtension(),
        disableUpload = true;
      if(this._isSupportedFile(fileExtension)) {
        if(fileExtension === 'po') {
          var localeOptions = [];
          _.forEach(this.state['locales'], function(locale, localeId) {
            localeOptions.push({
              value: localeId,
              label: locale.locale.displayName
            });
          });

          transLanguageDropdown = (<Select
            name='glossary-import-language-selection'
            className='w16'
            placeholder='Select a translation language…'
            value={this.state.selectedUploadFileTransLocale}
            options={localeOptions}
            onChange={this._handleUploadFileTransChange}
          />);

          if(!StringUtils.isEmptyOrNull(this.state.selectedUploadFileTransLocale)) {
            disableUpload = false;
          }
        } else {
          disableUpload = false;
        }
      }

      uploadSection = (
        <div>
          <Button onClick={this._openUploadModal}>
            <Icon name='import' className='mr1/4' /><span>Import Glossary</span>
          </Button>
          <Modal show={this.state.showModal} onHide={this._closeUploadModal}>
            <Modal.Header>
              <Modal.Title>Import Glossary</Modal.Title>
            </Modal.Header>
            <Modal.Body className='tal'>
              <form onSubmit={this._handleSubmit} encType="multipart/form-data">
                <input type="file" onChange={this._handleFile} ref="file" multiple={false} />
              </form>
              <p>
                CSV and PO files are supported. The source language should be in {this.state.srcLocale.locale.displayName}. For more details on how to prepare glossary files, see our <a href="http://docs.zanata.org/en/release/user-guide/glossary/upload-glossaries/" className="cpri" target="_blank">glossary import documentation</a>.
              </p>
              <div>
                {transLanguageDropdown}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='mr1' onClick={this._closeUploadModal}>Cancel</Button>
              <Button kind='primary' disabled={disableUpload} onClick={this._uploadFile}>Import</Button>
            </Modal.Footer>
          </Modal>
      </div>)
    }

    return (<div>
              <Icons />
              <div className='dfx aic mb1'>
                <div className='fxauto dfx aic'>
                  <h1 className='fz2 dib csec'>System Glossary</h1>
                  <Icon name='chevron-right' className='mh1/2 csec50' size='s1'/>
                  <Select
                    name='language-selection'
                    placeholder='Select a language…'
                    className='w16'
                    value={this.state.selectedTransLocale}
                    options={this.state.localeOptions}
                    onChange={this._handleTransChange}
                  />
                </div>
                {uploadSection}
              </div>
              <div className='dfx aic mb1'>
                <div className='fxauto'>
                  <div className='w8'>
                    <TextInput value={this.state.filter}
                      className="w100p pr1&1/2"
                      placeholder='Search Glossary'
                      id="search"
                      onKeydownCallback={this._handleFilterKeyUp}/>
                  </div>
                </div>
                <div className='dfx aic'>
                  <Icon name='glossary' className='csec50 mr1/4' />
                  <span className='csec'>{count}</span>
                </div>
              </div>
              <div>
                {contents}
              </div>
            </div>);
  }
});

export default SystemGlossary;
