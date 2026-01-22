import { Timestamp } from "firebase/firestore";

export const formatDate = (date: Timestamp) => {
    const d = date.toDate();
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};