import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({component: Component, ...rest}) => {
    return(
        <Route 
            {...rest}
            render = {props => 
                JSON.parse(localStorage.getItem('token')) ? (
                    <Redirect to='/home' />
                ) : (
                    <Component {...props} />
                )
            }
        />
    )
}

export default AuthRoute;