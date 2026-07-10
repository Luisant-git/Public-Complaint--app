export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-end bg-slate-900/35 p-4 sm:items-center sm:justify-center" onMouseDown={onClose}><div className="w-full max-w-[358px] rounded-2xl bg-white p-5 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>{title && <h2 className="text-base font-extrabold text-slate-800">{title}</h2>}<div className={title ? "mt-3" : ""}>{children}</div></div></div>;
}
