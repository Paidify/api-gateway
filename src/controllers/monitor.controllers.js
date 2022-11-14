import { readMany } from '../helpers/crud.js';
import pool from '../services/db.js';

export default async function (_, res) {
    let services, instances;

    try {
        services = await readMany(
            'service', { 'service': ['id', 'service', 'enabled', 'instance_id'] }, [], {}, pool
        );
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal gateway error' });
    }

    try {
        instances = await readMany(
            'instance', { 'instance': ['id', 'url', 'fail_count', 'service_id'] }, [], {}, pool
        );
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal gateway error' });
    }

    res.status(200).json(services.map(service => ({
        ...service,
        instances: instances
            .filter(inst => inst.service_id === service.id)
            .map(inst => ({
                id: inst.id,
                url: inst.url,
                fail_count: inst.fail_count
            }))
    })));
}
