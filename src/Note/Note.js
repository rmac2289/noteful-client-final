import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css'

import NotefulContext from '../NotefulContext'
import config from '../config'



export default class Note extends React.Component {
  static defaultProps = {
    onDeleteNote: () => {},
  }

  static contextType = NotefulContext;

  handleClickDelete = () => {
    const noteId = this.props.id


    fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'content-Type': 'application/json'
      },
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(e => Promise.reject(e))
      }
    })
    .then(() => {
      // deletes from context which updates state by removing note
      this.context.deleteNote(noteId)
      // sends user back to homepage after delete
      this.props.onDeleteNote(noteId)
    })
    .catch(err => {
      console.log({ err })
    })
  }

  render() {
    const { name, id, date_modified } = this.props

    return (
      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/note/${id}`}>
            {name}
          </Link>
        </h2>
        <button 
          className='Note__delete' 
          type='button'
          onClick={ this.handleClickDelete }>
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
              {format(date_modified, 'Do MMM YYYY')}
            </span>
          </div>
        </div>
      </div>        
    )
  }
}

Note.propType = {
  onDeleteNote: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  modified: PropTypes.string
};