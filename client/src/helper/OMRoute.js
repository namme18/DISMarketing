import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const OMRoute = ({component: Component, ...rest}) => {
    const restrictionlevel = useSelector(state => state.authReducer.user?.restrictionlevel);
    return(
        <Route 
            {...rest}
            render={props => 
                restrictionlevel !== ('operation manager' || 'owner') ? (
                    <Redirect to='/home' />
                ) : (
                    <Component {...props} />
                )
            }
        />
    )
}

export default OMRoute;