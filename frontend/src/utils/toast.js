// Simple toast notification utility
export const showToast = (message, type = "success") => {
    // Remove any existing toasts
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;

    const styles = {
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "16px 24px",
        borderRadius: "8px",
        color: "white",
        fontWeight: "500",
        fontSize: "14px",
        zIndex: "9999",
        animation: "slideIn 0.3s ease-out",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        maxWidth: "400px",
    };

    Object.assign(toast.style, styles);

    if (type === "success") {
        toast.style.backgroundColor = "#10b981";
    } else if (type === "error") {
        toast.style.backgroundColor = "#ef4444";
    } else if (type === "info") {
        toast.style.backgroundColor = "#3b82f6";
    }

    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = "slideOut 0.3s ease-out";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Add CSS animations
if (!document.querySelector("#toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
    document.head.appendChild(style);
}
