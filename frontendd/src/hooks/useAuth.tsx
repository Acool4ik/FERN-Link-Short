import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { EPath } from '../interfaces/IBackend'

import { Form } from '../components/Form' // components fro route
import { Generator } from '../components/Generator'
import { LinksContainer } from '../components/LinksContainer'
import { LinkItemDetail } from '../components/LinkItemDetail'

export const useAuth = (isAuth: boolean) => { 
    if(isAuth) {
        return <Switch>
            <Route path={EPath.linkitem + '/:id'} children={ <LinkItemDetail /> } />
            <Route path={EPath.linkcontainer} children={ <LinksContainer /> } />
            <Route path={EPath.generator} children={ <Generator /> } />
            <Redirect to={EPath.generator} />
        </Switch>
    } else {
        return <Switch>
            <Route path={EPath.form} children={ <Form /> } />
            <Redirect to={EPath.form} />
        </Switch>
    }
}