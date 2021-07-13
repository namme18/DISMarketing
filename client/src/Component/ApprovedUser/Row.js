import { IconButton, MenuItem, TableCell, TableRow, TextField, Tooltip } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { useDispatch } from 'react-redux';
import { processApprovedUser } from '../../redux/reducers/authActions/processApprovedUser';
import { getErrors } from '../../redux/reducers/errorReducer';

const Row = ({user, allUsers}) => {

    const dispatch = useDispatch();
    const teamleaders = allUsers?.filter(users => users.restrictionlevel === 'teamleader');

    const [data, setData] = useState({
        edit: false,
        teamleader: null,
        restrictionlevel: null,
        isApproved: false,
    });

    useEffect(() => {
        if(data.restrictionlevel || user.isApproved){
            setData({...data, isApproved: true})
        }
    },[data.restrictionlevel]);

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleEdit = id => {
        setData({edit: true});
    }

    const handleSave = (id, e) => {
        const { teamleader, restrictionlevel, isApproved } = data;
        if(!id || !isApproved || !restrictionlevel){
            const errData={
                msg:'Please complete required field!',
                status: 404,
                id:'CANT_APPROVED'
            }
            return dispatch(getErrors(errData))
        }

        if(restrictionlevel === 'agent' && !teamleader){
            const errData={
                msg:'Please asign a team leader',
                status: 404,
                id:'CANT_APPROVED'
            }
            return dispatch(getErrors(errData))
        }

        const newData = {
            id,
            teamleader,
            restrictionlevel,
            isApproved
        }
        dispatch(processApprovedUser(newData));
        setData({edit: false});
    }

    const handleCancel = () => {
        setData({edit: false});
    }

    const menuItem =[
        {
            name: 'Agent',
            value:'agent'
        },
        {
            name: 'Team leader',
            value:'teamleader'
        },
        {
            name: 'Sub Agent',
            value:'subagent'
        },
        {
            name: 'Operation Manager',
            value:'operation manager'
        },
        {
            name: 'Owner',
            value:'owner'
        },
    ]

    return(
        <TableRow>
            <TableCell>
                {user.username}
            </TableCell>
            <TableCell>
                {!data.isApproved ? 'NO': 'YES'}
            </TableCell>
            <TableCell>
                {data.restrictionlevel === 'agent' ? (
                    <TextField id='select' name='teamleader' label='Team Leader' select fullWidth onChange={onChange}>
                        {teamleaders.length === 0 ? (
                                <MenuItem value={null}>Asign first a Team Leader</MenuItem>
                            ) : (
                                teamleaders?.filter(tl => tl._id != user._id).map(leader => (
                                    <MenuItem value={leader._id}>{leader.username}</MenuItem>
                                ))
                            )}
                    </TextField>
                ): (
                    user.teamleader ? allUsers?.filter(tl => tl._id === user.teamleader)[0]?.username : 'NONE'
                )}
            </TableCell>
            <TableCell>
                {data.edit ? (
                    <TextField id='select' name='restrictionlevel' label='Restriction Level' select fullWidth onChange={onChange}>
                        {menuItem.map(item => (
                            <MenuItem value={item.value}>{item.name}</MenuItem>
                        ))}
                    </TextField>
                ) : user.restrictionlevel}
            </TableCell>
            <TableCell>
                {data.edit ? (
                <>
                <IconButton aria-label='edit' onClick={() => handleSave(user._id)}>
                    <Tooltip title='save'>
                        <SaveIcon color='primary' />
                     </Tooltip>
                 </IconButton>
                 <IconButton aria-label='cancel' onClick={handleCancel}>
                 <Tooltip title='Cancel'>
                     <CancelIcon color='error' />
                  </Tooltip>
                 </IconButton>
                </>
                ): (
                <IconButton aria-label='edit' onClick={() => handleEdit(user._id)}>
                    <Tooltip title='Edit'>
                    <EditIcon color='secondary' />
                    </Tooltip>
                </IconButton>
                )}
            </TableCell>
        </TableRow>
    )
}

export default Row;