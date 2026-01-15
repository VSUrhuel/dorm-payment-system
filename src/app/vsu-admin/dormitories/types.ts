export interface Dormitory {
    id?: string;
    name: string;
    location: string;
    adviser: string;
    capacity: number;
    adviserName?: string;
    isDeleted?: boolean;
    occupancy?: number;
}