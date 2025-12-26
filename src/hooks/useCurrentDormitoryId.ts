"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fetchDormitoryIdByUid } from "@/lib/admin/dormer";

export function useCurrentDormitoryId() {
    const [dormitoryId, setDormitoryId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                setDormitoryId(await fetchDormitoryIdByUid(uid));
                setLoading(false);
            } else {
                setDormitoryId(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { dormitoryId, loading };
}
