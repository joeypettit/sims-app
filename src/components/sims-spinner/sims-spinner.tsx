import "./sims-spinner.css";

type SimsSpinnerProps = {
  centered?: boolean;
};

const SimsSpinner = ({ centered = false }: SimsSpinnerProps) => {
  const size = 100;

  const spinnerElement = (
    <div className="spinner-container" style={{ width: size, height: size }}>
      <div className="spinner"></div>
      <img
        src={"/assets/logo-green-no-circle-whitebg.png"}
        alt={"sims logo"}
        className="image"
        style={{ width: size, height: size }}
      />
    </div>
  );

  return centered ? (
    <div className="flex items-center justify-center w-full h-full">
      {spinnerElement}
    </div>
  ) : (
    spinnerElement
  );
};

export default SimsSpinner;
