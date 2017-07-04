import React from 'react'
import './index.css'

export const GithubBadge = ({ url, title }) => (
  <div className='star-container'>
    <a className='start-on-github' href={url} target='_blank'>{title}</a>
  </div>
)

export default GithubBadge
