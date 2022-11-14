import { readOne, readMany, updateOne, deleteOne } from '../helpers/crud.js';
import pool from '../services/db.js';
import axios from 'axios';
import { MAX_FAIL_COUNT } from '../config/constants.js';

export default async function (req, res) {
    const [ _, serviceName, ...stuff ] = req.url.split('/');
    if(!serviceName) return res.status(400).json({ message: 'Bad Request' });
    const resource = stuff.join('/');
    
    let service, instances;
    try {
        service = await readOne(
            'service',
            { 'service': ['id', 'enabled', 'instance_id'] },
            [],
            { 'service': serviceName },
            pool
        );
    } catch(err) {
        console.log(err);
        if(err.message === 'Not found') return res.status(404).json({ message: 'Service not found' });
        return res.status(500).json({ message: 'Internal gateway error' });
    }
    if(!service.enabled) return res.status(503).json({ message: 'Service unavailable' });
    
    try {
        instances = await readMany(
            'instance',
            { 'instance': ['id', 'fail_count', 'url'] },
            [],
            { 'service_id': service.id },
            pool
        );
    } catch(err) {
        return res.status(500).json({ message: 'Internal gateway error' });
    }

    if(!instances.length) return res.status(500).json({ message: 'Service not working' });
    const newInstIndex = service.instance_id ? (instances.findIndex(inst => inst.id === service.instance_id) + 1) % instances.length : 0;
    const newInst = instances[newInstIndex];
    
    // console.log({
    //     method: req.method,
    //     url: `${newInst.url}/${resource}`,
    //     data: req.body
    // });
    let response;
    try {
        response = await axios({
            method: req.method,
            url: `${newInst.url}/${resource}`,
            data: req.body
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal gateway error' });

        const fail_count = newInst.fail_count + 1;
        if(fail_count >= MAX_FAIL_COUNT) {
            try {
                await deleteOne('instance', { 'id': newInst.id }, pool);
            } catch(err) {}
        } else {
            try {
                await updateOne('instance', { 'fail_count': fail_count }, { 'id': newInst.id }, pool);
            } catch(err) {}
        }
        return;
    }
    try {
        await updateOne('service', { 'instance_id': newInst.id }, { 'id': service.id }, pool);
    } catch(err) {}
    res.status(response.status).json(response.data);
}
