import gifData from "../../constant/gifData";

interface EmoteSelectorProps {
  handleEmoteSelect: (gif: string) => void;
}

const EmoteSelector = ({ handleEmoteSelect }: EmoteSelectorProps) => {
  return (
    <div className="absolute right-0 bottom-12 bg-gray-700 p-2 rounded-lg shadow-lg z-50">
      <div className="grid grid-cols-4 gap-2 max-h-[10rem] overflow-y-auto">
        {gifData.map((gif, index) => (
          <button
            key={index}
            className="p-1 hover:bg-gray-500 rounded transition-colors"
            onClick={() => handleEmoteSelect(gif)}
          >
            <img src={gif} alt="emote" className="w-8 h-8" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmoteSelector;
