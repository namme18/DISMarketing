import { Route, Redirect, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const OMRoute = ({component: Component, ...rest}) => {
    const history = useHistory();
    const { restrictionlevel } = useSelector(state => state.authReducer.user);
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