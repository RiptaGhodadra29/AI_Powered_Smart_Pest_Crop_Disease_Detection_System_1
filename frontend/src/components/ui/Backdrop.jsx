/*
  Backdrop
  --------
  A fixed, non-interactive decorative layer rendered once behind the whole app.
  Three stacked layers give depth without competing with content:
    1. a faint dotted grid (texture)
    2. a subtle tiled leaf pattern (on-brand, masked so it fades out)
    3. soft brand-green gradient "glows" in the corners
  All purely decorative -> aria-hidden, pointer-events-none, and -z-10.
*/
const Backdrop = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-neutral-50"
  >
    <div className="bg-dot-grid absolute inset-0 opacity-70" />
    <div className="bg-leaf-pattern mask-fade absolute inset-0 opacity-60" />

    {/* Ambient brand glows */}
    <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-200/30 blur-[130px]" />
    <div className="absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-emerald-100/50 blur-[130px]" />
    <div className="absolute -bottom-48 left-1/4 h-[28rem] w-[28rem] rounded-full bg-brand-100/40 blur-[130px]" />
  </div>
);

export default Backdrop;
