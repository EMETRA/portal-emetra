import React from 'react'
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableHeaderCell,
    Checkbox
} from '../../atoms/Table/'

import {Column, DataTableProps} from './types'

export function DataTable<T extends { id: string }>({
    columns,
    data,
    selectable = false,
    selectedKeys = [],
    onToggleSelect
}: DataTableProps<T>) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {selectable && <TableHeaderCell style={{ width: '2.5rem' }}><Checkbox checked={false} onChange={() => {}}/></TableHeaderCell>}
                    {columns.map(col => (
                        <TableHeaderCell key={col.key}>
                        {col.label}
                        </TableHeaderCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map(row => (
                    <TableRow key={row.id}>
                        {selectable && (
                        <TableCell>
                            <Checkbox
                            checked={selectedKeys.includes(row.id)}
                            onChange={() => onToggleSelect?.(row)}
                            />
                        </TableCell>
                        )}
                        {columns.map(col => (
                        <TableCell key={col.key}>
                            {col.render ? col.render(row) : (row as any)[col.key]}
                        </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
