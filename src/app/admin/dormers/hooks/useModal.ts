import { useState } from "react";
import { Dormer, Bill, ModalType } from "../types";

export function useModal() {
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedDormer, setSelectedDormer] = useState<Dormer | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const openModal = (
    modalType: ModalType,
    dormer: Dormer | null = null,
    bill: Bill | null = null
  ) => {
    setModal(modalType);
    setSelectedDormer(dormer);
    setSelectedBill(bill);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedDormer(null);
    setSelectedBill(null);
  };

  return {
    modal,
    selectedDormer,
    selectedBill,
    openModal,
    closeModal,
  };
}
