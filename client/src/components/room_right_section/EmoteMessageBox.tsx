const EmoteMessageBox = ({ emoteUrl }: { emoteUrl: string }) => {
  return (
    <div className="absolute right-0 bottom-0 bg-gray-700 p-2 rounded-lg shadow-lg z-50">
      <img src={emoteUrl} alt="emote" className="w-16 h-16" />
    </div>
  );
};

export default EmoteMessageBox;
