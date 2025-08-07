"use client";

import { useEffect, useState, useMemo } from "react";
import { firestore as db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  query,
  onSnapshot,
  runTransaction,
  serverTimestamp, // Use serverTimestamp for more accurate timestamps
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, // 1. Import signInWithEmailAndPassword
  onAuthStateChanged,
} from "firebase/auth";

// Import your components
import DormerHeader from "./components/DormerHeader";
import DormerFilters from "./components/DormerFilters";
import DormersTable from "./components/DormersTable";
import AddDormerModal from "./components/AddDormerModal";
import BillsModal from "./components/BillsModal";
import PaymentModal from "./components/PaymentModal";
import GenerateBillModal from "./components/GenerateBillModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Assuming this is the correct path for shadcn/ui
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

import {
  TableCell,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
} from "@/components/ui/table";

function DormersPageSkeleton() {
  const skeletonRows = Array(6).fill(0); // Create 6 skeleton rows for the table

  return (
    <div className="p-4 md:p-6 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 w-full md:w-1/3" />
        <Skeleton className="h-10 w-full md:w-1/4" />
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-32" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Skeleton className="h-5 w-40" />
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Skeleton className="h-5 w-20" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-5 w-28 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-36" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-5 w-44" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-end space-x-4 py-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}

export default function DormersPage() {
  const [modal, setModal] = useState(null);
  const [selectedDormer, setSelectedDormer] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [user, setUser] = useState(null);
  const [dormers, setDormers] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payables, setPayables] = useState([]); // Assuming you have a payables collection

  // --- 1. NEW STATE FOR CONFIRMATION DIALOG ---
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [billToCreate, setBillToCreate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // You can adjust this as needed

  const sendEmail = async (emailData) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      const data = await response.json();
      console.log("Email sent successfully:", data);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send notification email.");
    }
  };

  // --- Your existing useEffects and functions (openModal, closeModal, saveDormer, etc.) remain here ---
  // ... (keep all your existing useEffects and functions)

  const openModal = (modalType, dormer = null, bill = null) => {
    setModal(modalType);
    setSelectedDormer(dormer);
    setSelectedBill(bill);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedDormer(null);
    setSelectedBill(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLoading(true);
    const qDormers = query(collection(db, "dormers"));
    const unsubscribeDormers = onSnapshot(qDormers, (snapshot) => {
      const dormerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDormers(dormerData);
      setLoading(false);
    });

    const qBills = query(collection(db, "bills"));
    const unsubscribeBills = onSnapshot(qBills, (snapshot) => {
      const billData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBills(billData);
    });

    const qPayables = query(collection(db, "regularCharge"));
    const unsubscribePayables = onSnapshot(qPayables, (snapshot) => {
      const payableData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayables(payableData);
    });

    return () => {
      unsubscribeDormers();
      unsubscribeBills();
      unsubscribePayables();
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search or filter changes
  }, [searchTerm, statusFilter]);

  const dormersWithBills = useMemo(() => {
    if (!dormers.length) return [];
    return dormers.map((dormer) => ({
      ...dormer,
      bills: bills.filter((bill) => bill.dormerId === dormer.id),
    }));
  }, [dormers, bills]);

  const saveDormer = async (dormerData) => {
    if (!user) {
      console.error("Authentication error: Cannot save dormer.");
      toast.error("Authentication error. Please sign in again.");
      return;
    }

    // --- Store current admin's credentials ---
    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      toast.error("Could not verify current admin session.");
      return;
    }
    const adminEmail = currentAdmin.email;

    try {
      const existingDormer = dormers.find((d) => d.email === dormerData.email);
      if (existingDormer) {
        toast.error("A dormer with this email already exists.");
        return;
      }

      if (dormerData.role === "Admin") {
        // --- RE-AUTHENTICATION WORKAROUND ---

        // 2. Securely ask the admin for their password to re-authenticate later.
        // For security, you cannot access the password directly. Prompting is necessary.
        const adminPassword = prompt(
          "To keep your session active, please re-enter your password:"
        );

        if (!adminPassword) {
          toast.info("Admin creation canceled.");
          return;
        }

        // 3. Create the new admin user. This WILL sign out the current admin.
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          dormerData.email,
          "defaultAdminPassword123" // Secure temporary password
        );
        const newAdminUid = userCredential.user.uid;

        // 4. Immediately sign the original admin back in.
        // This happens so fast the user might not even notice the change.
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

        // 5. Now that the original admin is logged in again, save the new dormer's data.
        await setDoc(doc(db, "dormers", newAdminUid), {
          ...dormerData,
          createdBy: currentAdmin.uid, // Use the original admin's UID
          createdAt: serverTimestamp(),
        });

        toast.success("Admin dormer added successfully!");
        await sendEmail({
          to: dormerData.email,
          subject: "Welcome to Mabolo Payment System",
          html: `
            <h1>Welcome, ${dormerData.firstName}!</h1>
            <p>We're inviting you to be an admin of <a href="https://dorm-payment-system.vercel.app/">Mabolo Payment System</a>. You can now log in with the following credentials:</p>
            <p>Email: <strong>${dormerData.email}</strong></p>
            <p>Password: <strong>defaultAdminPassword123</strong></p>
            <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
          
            <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
                <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
                <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
                <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
            </div>
          `,
        });
      } else {
        // This part for creating regular users remains unchanged.
        await addDoc(collection(db, "dormers"), {
          ...dormerData,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });

        toast.success("Dormer added successfully!");
        await sendEmail({
          to: dormerData.email,
          subject: "Welcome to Mabolo Payment System",
          html: `
           <h1>Welcome, ${dormerData.firstName}!</h1>
          <p>Your dormer account has been created successfully. This is where you will receive your bills and payment confirmations!</p>
          
          <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
          
          <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
              <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
              <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
          </div>
          `,
        });
      }
    } catch (error) {
      console.error("Error adding dormer: ", error);
      // If re-authentication fails, the admin might be logged out.
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        toast.error("Re-authentication failed. Please log in again.");
        // Consider forcing a page reload to clear state
        // window.location.reload();
      } else {
        toast.error(`Failed to add dormer: ${error.message}`);
      }
    } finally {
      closeModal();
    }
  };

  const handleSavePayment = async (paymentData) => {
    if (!user || !paymentData.billId) {
      console.error("Authentication or data error.");
      return;
    }

    const billRef = doc(db, "bills", paymentData.billId);

    try {
      // A transaction reads data and writes changes in a single, safe operation
      await runTransaction(db, async (transaction) => {
        // 1. Get the most current bill data within the transaction
        const billRef = doc(db, "bills", paymentData.billId); // Ensure you have the correct ref
        const billDoc = await transaction.get(billRef);
        if (!billDoc.exists()) {
          throw "Bill document does not exist!";
        }
        const currentBillData = billDoc.data();
        const totalAmountDue = currentBillData.totalAmountDue;

        // --- CORRECTED LOGIC STARTS HERE ---

        // 2. Get the amount that was ALREADY paid from the bill document
        const amountAlreadyPaid = currentBillData.amountPaid || 0;

        // 3. Calculate the new total paid amount by adding the new payment
        const newTotalPaid = amountAlreadyPaid + paymentData.amount;

        // 4. Determine the final value to save, ensuring it doesn't exceed the total due
        const finalAmountPaidForBill = Math.min(newTotalPaid, totalAmountDue);

        // 5. Determine the actual amount of this specific payment that was applied
        // This handles overpayments correctly for the payment record.
        const amountAppliedThisTransaction =
          finalAmountPaidForBill - amountAlreadyPaid;

        // 6. Determine the new status based on the final, correct amount
        let newStatus = "Unpaid";
        if (finalAmountPaidForBill >= totalAmountDue) {
          newStatus = "Paid";
        } else if (finalAmountPaidForBill > 0) {
          newStatus = "Partially Paid";
        }

        // --- CORRECTED LOGIC ENDS HERE ---

        // 7. Record the new payment. CRITICAL: Use the original paymentData.amount
        // to record what the user actually gave you.
        await addDoc(collection(db, "payments"), {
          ...paymentData, // This contains the original amount, which is correct
          recordedBy: user.uid,
          createdAt: serverTimestamp(),
        });

        // 8. Update the main bill document with the correct, calculated values
        transaction.update(billRef, {
          amountPaid: finalAmountPaidForBill, // Use the correctly calculated total
          status: newStatus,
          updatedBy: user.uid,
          updatedAt: serverTimestamp(),
        });
      });

      const dormerInfo = dormers.find((d) => d.id === paymentData.dormerId);
      if (dormerInfo) {
        await sendEmail({
          to: dormerInfo.email,
          subject: `Payment Confirmation - ${paymentData.billId}`,
          html: `
            <h1>Payment Received!</h1>
            <p>Hi ${dormerInfo.firstName},</p>
            <p>We've received your payment of <strong>₱${paymentData.amount.toFixed(
              2
            )}</strong>.</p>
            <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
              <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
                <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
                <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
                <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
            </div>
          `,
        });
      }
    } catch (error) {
      console.error("Error saving payment in transaction: ", error);
      toast.error("Failed to save payment.");
    } finally {
      closeModal(); // Close modal after the operation is done
    }
  };

  const findExistingBillId = (dormerId, billingPeriod) => {
    const existingBill = bills.find(
      (bill) =>
        bill.dormerId === dormerId && bill.billingPeriod === billingPeriod
    );
    // Return the ID if a bill is found, otherwise null
    return existingBill ? existingBill.id : null;
  };

  const alreadyPaidBill = (dormerId, billingPeriod) => {
    const existingBill = bills.find(
      (bill) =>
        bill.dormerId === dormerId &&
        bill.billingPeriod === billingPeriod &&
        (bill.status === "Paid" || bill.status === "Partially Paid")
    );
    // Return true if a paid bill is found, otherwise false
    return !!existingBill;
  };

  // --- 2. REFACTORED BILL GENERATION LOGIC ---

  // This function just writes to the database. It can be called from multiple places.
  const saveBill = async (billData) => {
    if (!user || !billData) {
      console.error("Authentication error or missing bill data.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Separate the ID from the rest of the data
      const { id, ...dataToSave } = billData;

      if (id) {
        // If an ID exists, we are OVERWRITING
        const billRef = doc(db, "bills", id);
        await setDoc(billRef, {
          ...dataToSave, // The new data from the form
          // You might want to preserve the original creator and add an update timestamp
          updatedBy: user.uid,
          updatedAt: serverTimestamp(),
        });
        toast.success("Bill overwritten successfully!");
      } else {
        // No ID means we are CREATING a new bill
        await addDoc(collection(db, "bills"), {
          ...dataToSave,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });
        toast.success("New bill generated successfully!");
      }

      // --- NEW: Send new bill email ---
      const dormerInfo = dormers.find((d) => d.id === billData.dormerId);
      if (dormerInfo) {
        await sendEmail({
          to: dormerInfo.email,
          subject: `New Bill for ${billData.billingPeriod}`,
          html: `
            <h1>New Bill Generated</h1>
            <p>Hi ${dormerInfo.firstName},</p>
            <p>A new bill for the period <strong>${
              billData.billingPeriod
            }</strong> has been generated.</p>
            <p>Amount Due: <strong>₱${billData.totalAmountDue.toFixed(
              2
            )}</strong></p>
            <p>Please pay this amount to the Dorm SA.</p>

             <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
              <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
                <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
                <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
                <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
            </div>
          `,
        });
      }
    } catch (error) {
      console.error("Error saving bill: ", error);
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
      setBillToCreate(null);
    }
  };

  // This function is called by the modal. It decides what to do.
  const handleGenerateBill = async (billData) => {
    closeModal();

    const alreadyPaid = alreadyPaidBill(
      billData.dormerId,
      billData.billingPeriod
    );

    if (alreadyPaid) {
      // If a paid bill exists, show an alert and do not proceed
      setShowErrorModal(true);
      return;
    }

    const existingBillId = findExistingBillId(
      billData.dormerId,
      billData.billingPeriod
    );

    if (existingBillId) {
      // Bill exists. Store its data AND ID, then show confirmation.
      setBillToCreate({ ...billData, id: existingBillId });
      setShowConfirmDialog(true);
    } else {
      // Otherwise, create the bill directly
      await saveBill(billData);
    }
  };

  const filteredDormers = dormersWithBills.filter((dormer) => {
    const matchesSearch = `${dormer.firstName} ${dormer.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || dormer.roomNumber === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastDormer = currentPage * itemsPerPage;
  const indexOfFirstDormer = indexOfLastDormer - itemsPerPage;
  const paginatedDormers = filteredDormers.slice(
    indexOfFirstDormer,
    indexOfLastDormer
  );
  const totalPages = Math.ceil(filteredDormers.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <DormersPageSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <DormerHeader onAddDormer={() => openModal("add")} />

      <DormerFilters
        searchTerm={searchTerm}
        onSearchChange={() => setSearchTerm(event.target.value)}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        count={paginatedDormers.length}
      />

      <DormersTable
        dormers={paginatedDormers}
        onGenerateBill={(dormer) => openModal("generateBill", dormer)}
        onViewBills={(dormer) => openModal("bills", dormer)}
      />

      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>

      {/* --- MODALS --- */}
      <AddDormerModal
        isOpen={modal === "add"}
        onClose={closeModal}
        onSave={saveDormer}
      />

      <BillsModal
        isOpen={modal === "bills"}
        onClose={closeModal}
        dormer={selectedDormer}
        onRecordPayment={(bill) => openModal("payment", selectedDormer, bill)}
      />

      <PaymentModal
        isOpen={modal === "payment"}
        onClose={closeModal}
        dormer={selectedDormer}
        bill={selectedBill}
        onSavePayment={handleSavePayment}
      />

      <GenerateBillModal
        isOpen={modal === "generateBill"}
        onClose={closeModal}
        dormer={selectedDormer}
        // Pass the new handler function
        onGenerateBill={handleGenerateBill}
        payables={payables}
      />

      {/* --- 3. NEW CONFIRMATION DIALOG RENDERED VIA STATE --- */}
      {/* --- Updated Confirmation Dialog for OVERWRITING Bill --- */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-red-100 text-red-800">
          <DialogTitle>Overwrite Existing Bill?</DialogTitle>
          <DialogDescription>
            A bill for this dormer and billing period already exists. Do you
            want to overwrite it with the new data?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => saveBill(billToCreate)} // This now calls the universal saveBill
              disabled={isSubmitting}
            >
              {isSubmitting ? "Overwriting..." : "Overwrite Bill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showErrorModal}
        onOpenChange={setShowErrorModal}
        className="bg-red-100 text-red-800"
      >
        <DialogContent>
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>
            An existing payment for this bill already exists. You cannot
            override or delete it.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setShowErrorModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
