import "./sims-spinner.css"; // Make sure to create this CSS file

const SimsSpinner = () => {
  const size = 100;
  return (
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
};

export default SimsSpinner;
