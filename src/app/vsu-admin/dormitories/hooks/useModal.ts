
import { ModalType } from "@/app/admin/dormers/types";
import { useState } from "react";
import { Dormitory } from "../types";

export function useModal() {
    const [modal, setModal] =  useState<ModalType>(null);
    const [selectedDormitory, setSelectedDormitory] = useState<Dormitory | null>(null);

    const openModal = (modalType: ModalType, dormitory: Dormitory | null = null) => {
        setModal(modalType);
        setSelectedDormitory(dormitory);
    };

    const closeModal = () => {
        setModal(null);
        setSelectedDormitory(null);
    };

    return {
        modal,
        selectedDormitory,
        openModal,
        closeModal,
    };
}