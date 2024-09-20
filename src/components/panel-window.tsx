// function PanelWindow({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="bg-slate-200 p-2 flex flex-grow h-full w-full">
//       <section className="bg-white rounded-lg shadow-xl border border-slate-200 flex flex-grow max-w-full max-h-full">
//         <div>{children}</div>
//       </section>
//     </div>
//   );
// }

// export default PanelWindow;
function PanelWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-1 flex h-full w-full">
      <section className="bg-white rounded-md shadow-xl border border-slate-200 p-4 overflow-auto h-full w-full">
        {children}
      </section>
    </div>
  );
}

export default PanelWindow;
