export default function getResourceService (resource) {
    const services =  {
        'queries': ['users', 'guests', 'pay-concepts', 'pay-methods', 'payments', 'invoices'],
        'auth': ['login'],
        'payment': ['pay'],
        'balance': ['check']
    };
    for(const service in services) {
        if(services[service].includes(resource)) return service;
    }
    return null;
}
