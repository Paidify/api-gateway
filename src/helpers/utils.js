import { SERVICES } from "../config/constants.js";

export default function getResourceService (resource) {
    for(const service in SERVICES) {
        if(SERVICES[service].includes(resource)) return service;
    }
    return null;
}
