function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText =
      "position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;";
    document.body.appendChild(container);
  }

  const colors = { success: "#27ae60", error: "#e74c3c", info: "#2980b9" };

  const toast = document.createElement("div");
  toast.style.cssText = `
    background:${colors[type] || colors.info};
    color:white;
    padding:14px 20px;
    border-radius:8px;
    font-size:15px;
    font-family:"Segoe UI",sans-serif;
    box-shadow:0 4px 12px rgba(0,0,0,0.35);
    max-width:320px;
    opacity:0;
    transform:translateX(40px);
    transition:opacity 0.3s ease,transform 0.3s ease;
    cursor:pointer;
  `;
  toast.innerText = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  });

  const dismiss = () => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    setTimeout(() => toast.remove(), 300);
  };

  toast.addEventListener("click", dismiss);
  setTimeout(dismiss, 3000);
}

function showConfirm(message, onConfirm) {
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9998;";

  const modal = document.createElement("div");
  modal.style.cssText =
    "background:#2b5278;padding:30px;border-radius:12px;max-width:380px;width:90%;text-align:center;color:white;font-family:'Segoe UI',sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.4);";
  modal.innerHTML = `
    <p style="font-size:17px;margin-bottom:24px;">${message}</p>
    <button id="confirmYes" style="background:#e74c3c;color:white;border:none;padding:10px 24px;border-radius:6px;font-size:15px;cursor:pointer;margin-right:10px;">Evet, Sil</button>
    <button id="confirmNo" style="background:white;color:#1e3d59;border:none;padding:10px 24px;border-radius:6px;font-size:15px;cursor:pointer;">İptal</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  modal.querySelector("#confirmYes").onclick = () => { overlay.remove(); onConfirm(); };
  modal.querySelector("#confirmNo").onclick = () => overlay.remove();
}
