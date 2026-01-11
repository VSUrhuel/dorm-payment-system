export interface Dormitory {
    id?: string;
    name: string;
    location: string;
    adviser: string;
    adviserName?: string;
    isDeleted?: boolean;
    occupancy?: number;
}