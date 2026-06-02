type FunctionButtonProps = {
  onClickEvnt: () => void;
  iconPrefix: string;
  iconName: string;
  loading?: boolean;
};

const FunctionButton = ({
  onClickEvnt,
  iconPrefix,
  iconName,
  // loading,
}: FunctionButtonProps) => {
  // const loadingIconURL = "https://api.iconify.design/eos-icons/loading.svg";
  const customIcon = `https://api.iconify.design/${iconPrefix}/${iconName}.svg`;

  return (
    <button
      className="flex items-center bg-[#82bf56] hover:bg-[#75ad4d] text-white p-4 rounded-lg transition-colors"
      onClick={() => {
        onClickEvnt();
      }}
    >
      <div className="bg-white/20 p-2 rounded-lg mr-4">
        <img src={customIcon} width={40} height={40} />
      </div>
      <div className="text-left">
        <div className="text-xl font-semibold">Connect to the server</div>
        <div className="text-sm text-white/80">
          Try to connect to server, play with online opponent
        </div>
      </div>
    </button>
  );
};

export default FunctionButton;
