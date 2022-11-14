import { Router } from 'express';
import { createOne, readOne, readMany, updateOne, deleteOne } from '../helpers/crud.js';
import pool from '../services/db.js';
import axios from 'axios';

const router = Router();

router.use(async (req, res) => {
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
    if(!service.enabled) res.status(503).json({ message: 'Service unavailable' });
    
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

    console.log(service);
    console.log(instances);

    if(!instances.length) return res.status(500).json({ message: 'Service not working' });
    const instIndex = service.instance_id ? (instances.findIndex(ins => ins.id === service.instance_id) + 1) % instances.length : 0;
    const inst = instances[instIndex];

    try {
        await updateOne('service', { 'instance_id': inst.id }, { 'id': service.id }, pool);
    } catch(err) {
        return res.status(500).json({ message: 'Internal gateway error' });
    }
    
    console.log({
        method: req.method,
        url: `${inst.url}/${resource}`,
        data: req.body
    });
    let response;
    try {
        response = await axios({
            method: req.method,
            url: `${inst.url}/${resource}`,
            data: req.body
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal gateway error' });
    }

    res.status(response.status).json(response.data);
});

export default router;
