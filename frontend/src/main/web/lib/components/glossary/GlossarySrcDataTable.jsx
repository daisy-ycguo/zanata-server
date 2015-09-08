import React from 'react';
import {PureRenderMixin} from '../../../node_modules/react/addons';
import Actions from '../../actions/GlossaryActions';
import {Table, Column} from 'fixed-data-table';
import StringUtils from '../../utils/StringUtils'
import { Icon } from 'zanata-ui';
import TextInput from './TextInput';
import LoadingCell from './LoadingCell'
import ColumnHeader from './ColumnHeader'


var GlossarySrcDataTable = React.createClass({
  ENTRY: {
    SRC: {
      col: 1,
      field: 'srcTerm.content'
    },
    TRANS: {
      col: 2,
      field: 'transTerm.content'
    },
    POS: {
      col: 3,
      field: 'pos'
    },
    DESC: {
      col: 4,
      field: 'description'
    }
  },
  CELL_HEIGHT: 48,
  propTypes: {
    glossaryData: React.PropTypes.object.isRequired,
    glossaryResId: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(React.PropTypes.string)
    ),
    //glossaryData: React.PropTypes.arrayOf(
    //  React.PropTypes.shape({
    //      resId: React.PropTypes.string.isRequired,
    //      pos: React.PropTypes.string,
    //      description: React.PropTypes.string,
    //      srcTerm: React.PropTypes.shape({
    //        content: React.PropTypes.string.isRequired,
    //        locale: React.PropTypes.string.isRequired,
    //        reference: React.PropTypes.string,
    //        comment: React.PropTypes.string,
    //        lastModifiedDate: React.PropTypes.string,
    //        lastModifiedBy: React.PropTypes.string
    //      }).isRequired,
    //      transTerm: React.PropTypes.shape({
    //        content: React.PropTypes.string.isRequired,
    //        locale: React.PropTypes.string.isRequired,
    //        comment: React.PropTypes.string,
    //        lastModifiedDate: React.PropTypes.string,
    //        lastModifiedBy: React.PropTypes.string
    //      }).isRequired
    //    })
    //).isRequired,
    canAddNewEntry: React.PropTypes.bool.isRequired,
    canUpdateEntry: React.PropTypes.bool.isRequired,
    isAuthenticated: React.PropTypes.bool.isRequired,
    user: React.PropTypes.shape({
      username: React.PropTypes.string.isRequired,
      email: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      imageUrl: React.PropTypes.string.isRequired,
      languageTeams: React.PropTypes.string.isRequired
    }),
    srcLocale: React.PropTypes.shape({
      locale: React.PropTypes.shape({
        localeId: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        alias: React.PropTypes.string.isRequired
      }).isRequired,
      count: React.PropTypes.number.isRequired
    }).isRequired,
    totalCount: React.PropTypes.number.isRequired
  },

  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      tbl_width: window.innerWidth - this.CELL_HEIGHT,
      tbl_height: window.innerHeight - 166,
      row_height: 48,
      header_height: 48,
      inputFields: {},
      timeout: null
    };
  },

  _generateTitle: function(term) {
    var title = "";
    if(!_.isUndefined(term) && !_.isNull(term)) {
      if (!StringUtils.isEmptyOrNull(term.lastModifiedBy)
        || !StringUtils.isEmptyOrNull(term.lastModifiedDate)) {
        title = "Last updated ";
        if (!StringUtils.isEmptyOrNull(term.lastModifiedBy)) {
          title += "by: " + term.lastModifiedBy;
        }
        if (!StringUtils.isEmptyOrNull(term.lastModifiedDate)) {
          title += " " + term.lastModifiedDate;
        }
      }
    }
    return title;
  },

  _generateKey: function (colIndex, rowIndex, resId) {
    return colIndex + ":" + rowIndex + ":" + resId
  },

  _renderSourceHeader: function (label) {
    var key = "src_content",
      asc = !_.isUndefined(this.props.sort[key]) ? this.props.sort[key] : true;

    return (<ColumnHeader value={this.props.srcLocale.locale.displayName}
      field={key}
      key={key}
      ascending={asc}
      onClickCallback={this._onHeaderClick}/>);
  },

  _renderPosHeader: function (label) {
    var key = "part_of_speech",
      asc = !_.isUndefined(this.props.sort[key]) ? this.props.sort[key] : true;
    return (<ColumnHeader value={label}
      field={key}
      key={key}
      ascending={asc}
      onClickCallback={this._onHeaderClick}/>);
  },

  _renderDescHeader: function (label) {
    var key = "desc",
      asc = !_.isUndefined(this.props.sort[key]) ? this.props.sort[key] : true;
    return (<ColumnHeader value={label}
      field={key}
      key={key}
      ascending={asc}
      onClickCallback={this._onHeaderClick}/>);
  },

  _renderTransHeader: function (label) {
    var key = "trans_count",
      asc = !_.isUndefined(this.props.sort[key]) ? this.props.sort[key] : true;
    return (<ColumnHeader value={label}
      field={key}
      key={key}
      ascending={asc}
      onClickCallback={this._onHeaderClick}/>);
  },

  _onHeaderClick: function (field, ascending) {
    Actions.updateSortOrder(field, ascending);
  },

  _renderSourceCell: function (resId, cellDataKey, rowData, rowIndex,
                              columnData, width) {
    var key = this._generateKey(this.ENTRY.SRC.col, rowIndex, resId)

    if (resId === null) {
      return (<LoadingCell key={key}/>)
    } else {
      var entry = this._getGlossaryEntry(resId)
      var term = entry.srcTerm
      var readOnly = !(rowIndex === 0 && this.props.canAddNewEntry)
      var title = this._generateTitle(term)

      if (readOnly) {
        return <span title={title} key={key}>{term.content}</span>
      } else {
        return (<TextInput value={term.content}
          placeholder='enter a new term'
          title={title}
          id={key}
          rowIndex={rowIndex}
          resId={resId}
          key={key}
          field={this.ENTRY.SRC.field}
          onFocusCallback={this._onInputFocus}
          onBlurCallback={this._onInputBlur}
          onChangeCallback={this._onValueChange}/>)
      }
    }
  },

  _renderPosCell: function (resId, cellDataKey, rowData, rowIndex,
                            columnData, width) {
    var key = this._generateKey(this.ENTRY.POS.col, rowIndex, resId);
    if(resId === null) {
      return (<LoadingCell key={key}/>);
    } else {
      var entry = this._getGlossaryEntry(resId),
        readOnly = !this.props.canUpdateEntry;
      if(readOnly) {
        return <span key={key}>{entry.pos}</span>;
      } else {
        return (<TextInput value={entry.pos}
          placeholder="enter part of speech"
          rowIndex={rowIndex}
          title={entry.pos}
          id={key}
          resId={resId}
          key={key}
          field={this.ENTRY.POS.field}
          onFocusCallback={this._onInputFocus}
          onBlurCallback={this._onInputBlur}
          onChangeCallback={this._onValueChange}/>);
      }
    }
  },

  _renderDescCell: function (resId, cellDataKey, rowData, rowIndex,
                             columnData, width) {
    var key = this._generateKey(this.ENTRY.DESC.col, rowIndex, resId);

    if(resId === null) {
      return (<LoadingCell key={key}/>);
    } else {
      var entry = this._getGlossaryEntry(resId),
        readOnly = !this.props.canUpdateEntry;
      if (readOnly) {
        return <span key={key}>{entry.description}</span>;
      } else {
        return (<TextInput value={entry.description}
          placeholder="enter description"
          rowIndex={rowIndex}
          title={entry.description}
          id={key}
          resId={resId}
          key={key}
          field={this.ENTRY.DESC.field}
          onFocusCallback={this._onInputFocus}
          onBlurCallback={this._onInputBlur}
          onChangeCallback={this._onValueChange}/>);
      }
    }
  },

  _renderTransCell: function (resId, cellDataKey, rowData, rowIndex,
                              columnData, width) {
    var key = this._generateKey(this.ENTRY.TRANS.col, rowIndex, resId);

    if(resId === null) {
      return (<LoadingCell key={key}/>);
    } else {
      var entry = this._getGlossaryEntry(resId),
        count = entry.termsCount;

      if (count === null) {
        count = '';
      }
      return (<span key={key}>{count}</span>)
    }
  },

  _onValueChange: function(inputField, value) {
    var entry = this._getGlossaryEntry(inputField.props.resId);
    _.set(entry, inputField.props.field, value);
    this.state.inputFields[inputField.props.id] = inputField;
  },

  _handleSave: function(resId) {
    this.setState({focusedRow: -1});
    Actions.createGlossary(resId);
  },

  _handleUpdate: function(resId) {
    this.setState({focusedRow: -1});
    Actions.updateGlossary(resId);
  },

  _handleDelete: function(resId) {
    this.setState({focusedRow: -1});
    Actions.deleteGlossary(resId, this.props.srcLocale.locale.localeId);
  },

  /**
   * restore glossary entry to original value
   * @param resId
   * @param rowIndex
   */
  _handleCancel: function (resId, rowIndex) {
    var self = this;

    _.forOwn(this.ENTRY, function(value, key) {
      var key = self._generateKey(value.col, rowIndex, resId),
        input = self.state.inputFields[key];
      if(!_.isUndefined(input)) {
        input.reset();
      }
    });
    this.setState({focusedRow: -1});
  },

  _renderActions: function (resId, cellDataKey, rowData, rowIndex,
                            columnData, width) {
    if(resId === null) {
      return (<LoadingCell/>);
    } else {
      var self = this;
      var cancelButton = (<button className='cpri' onClick={self._handleCancel.bind(self,
        resId, rowIndex)}>Cancel</button>);

      if (rowIndex == 0 && self.props.canAddNewEntry) {
        return (<div>
          <button className='cwhite bgcpri bdrs pv1/4 ph1/2 mr1/2' onClick={self._handleSave.bind(self,
            resId)}>Save</button>
                {cancelButton}
        </div>)
      } else if (this.props.canUpdateEntry) {
        return (<div>
          <button className='cwhite bgcpri bdrs pv1/4 ph1/2 mr1/2' onClick={self._handleDelete.bind(self,
            resId)}>Delete</button>
          <button className='cwhite bgcpri bdrs pv1/4 ph1/2 mr1/2' onClick={self._handleUpdate.bind(self,
            resId)}>Update</button>
                {cancelButton}
        </div>)
      } else {
        return (<div></div>)
      }
    }
  },

  _getSourceColumn: function() {
    return (<Column
      label=""
      width={150}
      dataKey={0}
      flexGrow={1}
      cellRenderer={this._renderSourceCell}
      headerRenderer={this._renderSourceHeader}
    />);
  },

  _getPosColumn: function() {
    return (<Column
      label="Part of Speech"
      width={150}
      dataKey={0}
      cellRenderer={this._renderPosCell}
      headerRenderer={this._renderPosHeader}
    />);
  },

  _getDescColumn: function() {
    return (<Column
      label="Description"
      width={150}
      flexGrow={1}
      dataKey={0}
      cellRenderer={this._renderDescCell}
      headerRenderer={this._renderDescHeader}
    />);
  },

  _getTransColumn: function() {
    return (<Column
      label="Translations"
      width={120}
      cellClassName="tac"
      dataKey={0}
      cellRenderer={this._renderTransCell}
      headerRenderer={this._renderTransHeader}
    />);
  },

  _getActionColumn: function() {
    return (<Column
      label=""
      cellClassName="ph1/4"
      width={300}
      dataKey={0}
      isResizable={false}
      cellRenderer={this._renderActions}
    />)
  },

  _getGlossaryEntry: function (resId) {
    return this.props.glossaryData[resId];
  },

  _rowGetter: function(rowIndex) {
    var self = this,
      row = self.props.glossaryResId[rowIndex];
    if(row === null) {
      if(this.state.timeout !== null) {
        clearTimeout(this.state.timeout);
      }
      this.state.timeout = setTimeout(function() {
        Actions.loadGlossary(rowIndex);
      }, 500);
      return [null];
    } else {
      return row;
    }
  },

  _onRowClick: function (event, rowIndex) {

  },

  _onInputFocus: function (input, rowIndex) {
    console.info('focus now', rowIndex);
    this.setState({focusedRow: rowIndex});
  },

  _onInputBlur: function (input, rowIndex) {
    console.info('blur now', rowIndex);
    this.setState({focusedRow: -1});
  },

  _rowClassNameGetter: function (rowIndex) {
    if(rowIndex == this.state.focusedRow) {
      //Current row is focused (clicked)
      return 'selectedClassAlex';
    }
  },

  render: function() {
    var srcColumn = this._getSourceColumn(),
      posColumn = this._getPosColumn(),
      descColumn = this._getDescColumn(),
      transColumn = this._getTransColumn(),
      actionColumn = this._getActionColumn();

    var dataTable = (<Table
      onRowClick={this._onRowClick}
      rowClassNameGetter={this._rowClassNameGetter}
      rowHeight={this.CELL_HEIGHT}
      rowGetter={this._rowGetter}
      rowsCount={this.props.totalCount}
      width={this.state.tbl_width}
      height={this.state.tbl_height}
      headerHeight={this.CELL_HEIGHT} >
      {srcColumn}
      {posColumn}
      {descColumn}
      {transColumn}
      {actionColumn}
    </Table>);

    return (<div>{dataTable}</div>);
  }
});

export default GlossarySrcDataTable;
