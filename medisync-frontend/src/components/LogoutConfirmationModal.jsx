import { useEffect } from "react";
import Button from "./ui/Button";

function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="ms-modal-backdrop" 
            onClick={handleBackdropClick}
            style={{ zIndex: 9999 }}
        >
            <div className="ms-modal" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
                {/* Visual warning/logout icon indicator */}
                <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "var(--danger-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    color: "var(--danger)"
                }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </div>

                <h3 id="logout-modal-title" style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "700" }}>Logout?</h3>
                <p style={{ margin: "0 0 24px 0", color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5" }}>
                    Are you sure you want to logout from MediSync?
                </p>

                <div className="ms-modal-actions" style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <Button 
                        variant="secondary" 
                        onClick={onClose}
                        style={{ padding: "8px 16px", height: "38px", fontSize: "14px" }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="danger-solid" 
                        onClick={onConfirm}
                        style={{ padding: "8px 16px", height: "38px", fontSize: "14px" }}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LogoutConfirmationModal;
