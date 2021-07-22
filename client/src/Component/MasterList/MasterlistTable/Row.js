import { Badge, TableCell, TableRow, Typography } from "@material-ui/core";
import React from "react";

const Row = ({subs, allUsers}) => {
    return(
        <TableRow>
            <TableCell align='left' size='small'>
                {subs.applicationno}
            </TableCell>
            <TableCell align='left' size='small'>{subs.fullname.map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</TableCell>
            <TableCell align='left' size='small'>{subs.address.split(' ').map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</TableCell>
            <TableCell align='left' size='small'>{subs.contactno}</TableCell>
            <TableCell align='left' size='small'>{allUsers?.map(user => user._id === subs.agent ? user.username.split(' ')[0][0].toUpperCase()+user.username.split(' ')[0].substring(1) : '')}</TableCell>
        </TableRow>
    )
}

export default Row;