const EmoteMessageBox = ({ emoteUrl }: { emoteUrl: string }) => {
  return (
    <div className="emote-message-box">
      <img src={emoteUrl} alt="emote" />
    </div>
  );
};

export default EmoteMessageBox;
