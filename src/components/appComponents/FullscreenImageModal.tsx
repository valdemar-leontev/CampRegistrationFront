export const FullscreenImageModal = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[1000000000000]"
      onClick={onClose}
    >
      <div className="relative max-w-full max-h-full p-4">
        <img
          src={imageUrl}
          alt="Fullscreen Payment Check"
          className="max-w-full max-h-full"
        />
        <button
          className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};