import { Redirect, Route} from 'react-router-dom';


const PrivateRoute = ({component: Component, ...rest}) => {
    return(
       <Route 
       {...rest}
       render={props => 
            !JSON.parse(localStorage.getItem('token')) ? (
                <Redirect to='/' />
            ) : (
                <Component {...props} />
            )
        }
       />
    )
}

export default PrivateRoute;