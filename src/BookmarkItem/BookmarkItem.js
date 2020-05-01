import React from 'react';
import Rating from '../Rating/Rating';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
import './BookmarkItem.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function deleteBookmarkRequest(bookmarkId, callback) {
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'authorization': `Bearer ${config.API_KEY}`
    }
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(error => Promise.reject(error))
    }
    // no content on success, so skip res.json()
  })
    .then(() => {
      // call the callback when the request is successful
      // this is where the App component can remove it from state
      console.log(`last then statement ran`)
      callback(bookmarkId)
      
    })
    .catch(error => {
      console.error(error)
    })
}

export default function BookmarkItem(props) {
  return (
   <BookmarksContext.Consumer>
    {(context) => (
    <li className='BookmarkItem'>
      <div className='BookmarkItem__row'>
        <h3 className='BookmarkItem__title'>
          <a
            href={props.url}
            target='_blank'
            rel='noopener noreferrer'>
            {props.title}
          </a>
        </h3>
        <Rating value={props.rating} />
      </div>
      <p className='BookmarkItem__description'>
        {props.description}
      </p>
      <div className='BookmarkItem__buttons'>
        <button
          className='BookmarkItem__description'
          onClick={() => {
            deleteBookmarkRequest(
            props.id,
            context.deleteBookmark,
             )
            }}
        >
          Delete
        </button>
        <Link className="button" to={`/edit/${props.id}`}>Edit Bookmark</Link>
      </div>
    </li>
    )}
</BookmarksContext.Consumer>
  )}

  BookmarkItem.propTypes = {
    title: PropTypes.string.isRequired,
    url: (props, propName, componentName) => {
      // get the value of the prop
      const prop = props[propName];
  
      // do the isRequired check
      if(!prop) {
        return new Error(`${propName} is required in ${componentName}. Validation Failed`);
      }
  
      // check the type
      if (typeof prop != 'string') {
        return new Error(`Invalid prop, ${propName} is expected to be a string in ${componentName}. ${typeof prop} found.`);
      }
  
      // do the custom check here
      // using a simple regex
      if (prop.length < 5 || !prop.match(new RegExp(/^https?:\/\//))) {
        return new Error(`Invalid prop, ${propName} must be min length 5 and begin http(s)://. Validation Failed.`);
      }
    },
    rating: PropTypes.number,
    description: PropTypes.string
  };

  BookmarkItem.defaultProps = {
    rating: 1,
    description: ""
  };