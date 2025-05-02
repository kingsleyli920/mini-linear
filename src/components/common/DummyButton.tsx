export default function DummyButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="btn-secondary w-full py-10 mb-2 cursor-not-allowed"
      disabled
    >
      {children}
    </button>
  );
}
