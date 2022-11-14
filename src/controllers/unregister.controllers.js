import { deleteOne } from '../helpers/crud.js';
import pool from '../services/db.js';

export default async function (req, res) {
    const { id } = req.params;
    
    try {
        await deleteOne('instance', { id }, pool);
    } catch(err) {
        if(err.message === 'Not found') return res.status(404).json({ message: 'Instance not found' });
        return res.status(500).json({ message: 'Internal gateway error' });
    }

    res.status(200).json({ message: 'OK' });
}