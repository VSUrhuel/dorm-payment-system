"use client"
import { ModalType, Dormer } from "@/app/admin/dormers/types";
import { useState } from "react";

export function useModal() {
    const [modal, setModal] = useState<ModalType>(null);
    const [selectedAdviser, setSelectedAdviser] = useState<Dormer | null>(null);

    const openModal = (modalType: ModalType, adviser: Dormer | null = null) => {
        setModal(modalType);
        setSelectedAdviser(adviser);
    };

    const closeModal = () => {
        setModal(null);
        setSelectedAdviser(null);
    };

    return {
        modal,
        selectedAdviser,
        openModal,
        closeModal,
    };
}
