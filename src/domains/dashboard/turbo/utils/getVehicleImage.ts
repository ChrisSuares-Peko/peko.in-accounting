import autoRickshaw from '../assets/autoRickshaw.svg';
import bus from '../assets/bus.svg';
import car from '../assets/car.png';
import muv from '../assets/muv.png';
import scooter from '../assets/scooter.svg';
import sedan from '../assets/sedan.png';
import suv from '../assets/suv.png';
import tractor from '../assets/tractor.svg';
import truck from '../assets/truck.png';
import van from '../assets/van.svg';

// Keys are the vendor's (Vahan) Body Type values, uppercased.
const vehicleImageMap: Record<string, string> = {
    // Cars / Sedans
    'MOTOR CAR': car,
    'M/C': car,
    'RIGID (PASSENGER CAR)': car,
    HATCHBACK: car,
    'NULL/UNKNOWN': car,
    SEDAN: sedan,
    SALOON: sedan,
    COUPE: sedan,
    // SUVs / Jeeps
    JEEP: suv,
    SUV: suv,
    'HARD TOP': suv,
    'STATION WAGON': muv,
    // Trucks / Heavy vehicles
    TRUCK: truck,
    'TRUCK (OPEN BODY)': truck,
    LORRY: truck,
    TRAILER: truck,
    'TIP TRAILER': truck,
    TIPPER: truck,
    'OPEN BODY': truck,
    OPEN: truck,
    'FULL BODY': truck,
    'ARTICULATED VEHICLE': truck,
    'LIGHT MOTOR VEHICLE': truck,
    // Buses
    BUS: bus,
    'MAXI CAB': bus,
    'MINI BUS': bus,
    // Two-wheelers (Vahan labels motorcycles SOLO / SOLO WITH PILLION)
    'MOTOR CYCLE': scooter,
    MOTORCYCLE: scooter,
    SCOOTER: scooter,
    MOPED: scooter,
    '2 WHEELER': scooter,
    SOLO: scooter,
    'SOLO WITH PILLION': scooter,
    // Three-wheelers
    'AUTO RICKSHAW': autoRickshaw,
    'THREE WHEELER': autoRickshaw,
    'E-RICKSHAW': autoRickshaw,
    '3 WHEELER': autoRickshaw,
    // Tractors / Agricultural
    TRACTOR: tractor,
    'POWER TILLER': tractor,
    // Vans
    VAN: van,
    'GOODS VAN': van,
    '5 DOOR STEEL SHELL': van,
};

// The class code is authoritative for wheel count (e.g. "M-Cycle/Scooter(2WN)",
// "Three Wheeler (Passenger)(3WT)"); body type only differentiates 4-wheelers —
// a scooter can carry body type "Full Body", which would otherwise map to truck.
export default function getVehicleImage(bodyType?: string, vehicleClass?: string): string {
    if (vehicleClass) {
        if (/\(2\s*W/i.test(vehicleClass)) return scooter;
        if (/\(3\s*W/i.test(vehicleClass)) return autoRickshaw;
    }
    if (!bodyType) return car;
    const normalized = bodyType.trim().toUpperCase();
    return vehicleImageMap[normalized] ?? car;
}
