import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ArrowBack from '@material-ui/icons/ArrowBack'
import { ValueRenderer } from '../../../components/reps/value-renderer'
import ExternalResourceOutputHandler from '../../../components/reps/output-handler-external-resource'

import PaneContentButton from './pane-content-button'
import { postMessageToEditor } from '../../port-to-editor'

// import {
//   // prettyDate,
//   getCellById,
// } from '../../tools/notebook-utils'

export class HistoryItemUnconnected extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    cellId: PropTypes.number,
    historyId: PropTypes.number.isRequired,
    historyType: PropTypes.string.isRequired,
    lastRan: PropTypes.number.isRequired,
  }
  constructor(props) {
    super(props)
    // this.state = { timeSince: 'just now' }
    this.showEditorCell = this.showEditorCell.bind(this)
  }

  // componentDidMount() {
  //   setInterval(() => {
  //     this.setState({ timeSince: prettyDate(new Date(this.props.lastRan)) })
  //   }, 5000)
  // }

  showEditorCell() {
    postMessageToEditor(
      'CLICK_ON_OUTPUT',
      {
        id: this.props.cellId,
        autoScrollToCell: true,
      },
    )
  }

  render() {
    let output
    let showCellReturnButton = true
    switch (this.props.historyType) {
      case 'CELL_EVAL_VALUE':
        output = (<ValueRenderer
          render
          valueToRender={this.props.valueToRender}
        />)
        break
      case 'CELL_EVAL_EXTERNAL_RESOURCE':
        output = <ExternalResourceOutputHandler value={this.props.valueToRender} />
        break
      case 'CELL_EVAL_INFO':
        output = this.props.valueToRender
        break
      case 'CONSOLE_EVAL':
        output = (<ValueRenderer
          render
          valueToRender={this.props.valueToRender}
        />)
        showCellReturnButton = false
        break
      default:
        // TODO: Use better class for inline error
        output = <div>Unknown history type {this.props.historyType}</div>
        break
    }

    const cellReturnButton = showCellReturnButton ? (
      <div className="history-metadata-positioner">
        <div className="history-metadata">
          <div className="history-show-actual-cell">
            <PaneContentButton
              text="scroll to cell"
              onClick={this.showEditorCell}
            >
              <ArrowBack style={{ fontSize: '12px' }} />
            </PaneContentButton>
          </div>
          {/* <div className="history-time-since"> {this.state.timeSince} </div> */}
        </div>
      </div>)
      : ''

    return (
      <div id={`history-item-id-${this.props.historyId}`} className="history-cell">
        <div className="history-content editor">
          {cellReturnButton}
          <pre className="history-item-code">{this.props.content}</pre>
        </div>
        <div className="history-item-output">
          {output}
        </div>
      </div>
    )
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    content: ownProps.historyItem.content,
    cellId: ownProps.historyItem.cellId,
    historyId: ownProps.historyItem.historyId,
    historyType: ownProps.historyItem.historyType,
    lastRan: ownProps.historyItem.lastRan,
    valueToRender: ownProps.historyItem.value,
  }
}

export default connect(mapStateToProps)(HistoryItemUnconnected)
