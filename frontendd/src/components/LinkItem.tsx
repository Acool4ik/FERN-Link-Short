import React from 'react'
import { Link } from 'react-router-dom'

import { IListItem } from '../interfaces/IListItem'
import { EPath } from '../interfaces/IBackend'
interface IListItemWithColor extends IListItem { color: string }
type TLinkItem = React.FC<IListItemWithColor>


export const LinkItem: TLinkItem = ({_id, _linkLong, _linkShort, description, _dataCreated, color, img}) => (
    <div className={`col s6 m4 l3 hoverable row left-align link-item ${color}`} >

        <a className="col s12 hover-underline" rel="noreferrer" target="_blank" 
            href={_linkLong} 
            style={{wordBreak: 'break-word'}}
        >
            <span className="white-text" style={{textDecoration: 'none !important'}}>
                Follow the link: 
            </span> 
            <br />
            {EPath.baseUrl + EPath.api + EPath.linkitem + EPath.slash + _linkShort}
        </a>

        {
            img && <>
            <strong className="col s12" style={{marginTop: '0.6rem'}}>Image:</strong>
            {' '}
            <span className="col s12">
                {img.split('__')[1]}
            </span>
            </>
        }

        {   
            img &&
            <img className="icon-linkitem"
                style={{marginLeft: '.75rem'}}
                src={EPath.baseUrl + EPath.api + EPath.image + EPath.slash + img + EPath.download } 
                alt="loading..." 
            />
        }

        <span className="col s12" style={{marginTop: '0.6rem'}} >Date created:</span>
        <strong className="col s12">{new Date(_dataCreated).toLocaleDateString()}</strong>

        <span className="col s12" style={{marginTop: '0.6rem'}}>Description: </span>
        <strong className="col s12 truncate">{description || 'N/A'}</strong>
        
        <Link className="col s12 waves-effect waves-light btn" 
            to={EPath.linkitem + EPath.slash + _id} 
            style={{margin: '0.6rem 0'}}
        >
            <i className="material-icons right">cloud</i>
            detail information...
        </Link>
        
    </div>
)